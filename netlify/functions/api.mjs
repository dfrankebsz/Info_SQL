import { getStore } from '@netlify/blobs';
import crypto from 'node:crypto';

const REGION = process.env.BLOBS_REGION || 'eu-central-1';
const users = getStore({ name: 'sqlq-users', region: REGION });
const classes = getStore({ name: 'sqlq-classes', region: REGION });
const progressStore = getStore({ name: 'sqlq-progress', region: REGION });
const sessions = getStore({ name: 'sqlq-sessions', region: REGION });

const json = (data, status=200) => Response.json(data, { status, headers: {'cache-control':'no-store'} });
const now = () => Date.now();
const norm = s => String(s||'').trim().normalize('NFKC');
const slug = s => encodeURIComponent(norm(s).toLocaleLowerCase('de-DE'));
const userKey = (classSlug, nickSlug) => `u/${classSlug}/${nickSlug}`;
const progressKey = (classSlug, userId) => `p/${classSlug}/${userId}`;
const sessionKey = token => `s/${crypto.createHash('sha256').update(token).digest('hex')}`;

async function getJSON(store,key){ return await store.get(key,{type:'json',consistency:'strong'}); }
async function setJSON(store,key,value,opts={}){ return await store.set(key,JSON.stringify(value),opts); }
function validText(s,min,max){ const v=norm(s); return v.length>=min && v.length<=max; }
function hashPassword(password,salt=crypto.randomBytes(16).toString('hex')){
  const hash=crypto.scryptSync(password,salt,64).toString('hex'); return {salt,hash};
}
function passwordMatches(password,user){
  const candidate=crypto.scryptSync(password,user.salt,64); const stored=Buffer.from(user.passwordHash,'hex');
  return stored.length===candidate.length && crypto.timingSafeEqual(stored,candidate);
}
function safeUser(u){ return {userId:u.userId,nickname:u.nickname,className:u.className,role:u.role}; }
function codeMatches(a,b){
  const A=Buffer.from(String(a||'')), B=Buffer.from(String(b||''));
  return A.length===B.length && A.length>0 && crypto.timingSafeEqual(A,B);
}
async function createSession(u,key){
  const token=crypto.randomBytes(32).toString('base64url');
  await setJSON(sessions,sessionKey(token),{userKey:key,userId:u.userId,classSlug:u.classSlug,role:u.role,expiresAt:now()+1000*60*60*24*30});
  return token;
}
async function authenticate(token){
  if(!token) throw Object.assign(new Error('Nicht angemeldet.'),{status:401});
  const sk=sessionKey(token), s=await getJSON(sessions,sk);
  if(!s || s.expiresAt<now()){ if(s) await sessions.delete(sk); throw Object.assign(new Error('Sitzung abgelaufen. Bitte erneut anmelden.'),{status:401}); }
  const u=await getJSON(users,s.userKey); if(!u) throw Object.assign(new Error('Nutzerkonto nicht gefunden.'),{status:401});
  return {session:s,user:u,userKey:s.userKey,sessionKey:sk};
}
async function revokeUserSessions(userId){
  const {blobs}=await sessions.list({prefix:'s/'});
  for(const b of blobs){ const s=await getJSON(sessions,b.key); if(s?.userId===userId) await sessions.delete(b.key); }
}
async function getTargetStudent(teacher,userId){
  const {blobs}=await users.list({prefix:`u/${teacher.classSlug}/`});
  for(const b of blobs){ const u=await getJSON(users,b.key); if(u?.userId===userId && u.role==='student') return {u,key:b.key}; }
  throw Object.assign(new Error('Schülerkonto in dieser Klasse nicht gefunden.'),{status:404});
}

export default async (req) => {
  if(req.method !== 'POST') return json({error:'Nur POST ist erlaubt.'},405);
  let body={}; try{ body=await req.json(); }catch{return json({error:'Ungültige Anfrage.'},400);}
  try{
    const action=body.action;
    if(action==='setupTeacher'){
      const setup=process.env.TEACHER_SETUP_CODE;
      if(!setup) return json({error:'TEACHER_SETUP_CODE ist in Netlify noch nicht gesetzt.'},503);
      if(!codeMatches(body.code,setup)) return json({error:'Der Lehrer-Setup-Code ist nicht korrekt.'},403);
      if(!validText(body.className,1,60)||!validText(body.nickname,2,40)||!validText(body.password,6,200)) return json({error:'Klasse, Nickname oder Passwort entsprechen nicht den Mindestanforderungen.'},400);
      const className=norm(body.className), nickname=norm(body.nickname), classSlug=slug(className), nickSlug=slug(nickname), key=userKey(classSlug,nickSlug);
      if(await getJSON(users,key)) return json({error:'Dieser Nickname existiert in der Klasse bereits.'},409);
      const {salt,hash}=hashPassword(body.password); const u={userId:crypto.randomUUID(),className,classSlug,nickname,nickSlug,role:'teacher',salt,passwordHash:hash,createdAt:new Date().toISOString()};
      await setJSON(classes,`c/${classSlug}`,{className,classSlug,createdAt:new Date().toISOString()}); await setJSON(users,key,u,{onlyIfNew:true});
      return json({ok:true});
    }
    if(action==='registerStudent'){
      if(!validText(body.className,1,60)||!validText(body.nickname,2,40)||!validText(body.password,6,200)) return json({error:'Klasse, Nickname oder Passwort entsprechen nicht den Mindestanforderungen.'},400);
      const className=norm(body.className), nickname=norm(body.nickname), classSlug=slug(className), nickSlug=slug(nickname), key=userKey(classSlug,nickSlug);
      const c=await getJSON(classes,`c/${classSlug}`); if(!c) return json({error:'Diese Klasse wurde noch nicht durch eine Lehrkraft eingerichtet.'},404);
      if(await getJSON(users,key)) return json({error:'Dieser Nickname existiert in der Klasse bereits.'},409);
      const {salt,hash}=hashPassword(body.password); const u={userId:crypto.randomUUID(),className:c.className,classSlug,nickname,nickSlug,role:'student',salt,passwordHash:hash,createdAt:new Date().toISOString()};
      const r=await setJSON(users,key,u,{onlyIfNew:true}); if(r?.modified===false) return json({error:'Dieser Nickname existiert bereits.'},409);
      return json({ok:true});
    }
    if(action==='login'){
      const classSlug=slug(body.className), nickSlug=slug(body.nickname), key=userKey(classSlug,nickSlug), u=await getJSON(users,key);
      if(!u || !passwordMatches(String(body.password||''),u)) return json({error:'Klasse, Nickname oder Passwort stimmen nicht.'},401);
      const token=await createSession(u,key); const p=await getJSON(progressStore,progressKey(u.classSlug,u.userId));
      return json({token,user:safeUser(u),progress:p||null});
    }
    if(action==='getProgress'){
      const {user}=await authenticate(body.token); const p=await getJSON(progressStore,progressKey(user.classSlug,user.userId)); return json({user:safeUser(user),progress:p||null});
    }
    if(action==='saveProgress'){
      const {user}=await authenticate(body.token); const raw=JSON.stringify(body.progress||{}); if(raw.length>450000) return json({error:'Der Fortschrittsdatensatz ist zu groß.'},413);
      const p=JSON.parse(raw); p.updatedAt=new Date().toISOString(); await setJSON(progressStore,progressKey(user.classSlug,user.userId),p); return json({ok:true});
    }
    if(action==='logout'){
      if(body.token) await sessions.delete(sessionKey(body.token)); return json({ok:true});
    }
    if(action.startsWith('teacher')){
      const {user:teacher}=await authenticate(body.token); if(teacher.role!=='teacher') return json({error:'Nur Lehrkräfte dürfen diese Funktion verwenden.'},403);
      if(action==='teacherList'){
        const {blobs}=await users.list({prefix:`u/${teacher.classSlug}/`}); const students=[];
        for(const b of blobs){ const u=await getJSON(users,b.key); if(!u||u.role!=='student') continue; const p=await getJSON(progressStore,progressKey(u.classSlug,u.userId))||{}; const completed=p.completed||{}; const done=Object.keys(completed).filter(k=>completed[k]&&!k.startsWith('b')).length; const testDone=Object.keys(completed).filter(k=>/^t\d+$/.test(k)&&completed[k]).length; students.push({userId:u.userId,nickname:u.nickname,done,testDone,xp:p.xp||0,updatedAt:p.updatedAt||null}); }
        students.sort((a,b)=>a.nickname.localeCompare(b.nickname,'de')); return json({students});
      }
      if(action==='teacherResetClass'){
        const {blobs}=await progressStore.list({prefix:`p/${teacher.classSlug}/`}); for(const b of blobs) await progressStore.delete(b.key); return json({ok:true,deleted:blobs.length});
      }
      const {u,key}=await getTargetStudent(teacher,body.userId);
      if(action==='teacherResetProgress'){ await progressStore.delete(progressKey(u.classSlug,u.userId)); return json({ok:true}); }
      if(action==='teacherDeleteUser'){ await progressStore.delete(progressKey(u.classSlug,u.userId)); await users.delete(key); await revokeUserSessions(u.userId); return json({ok:true}); }
      if(action==='teacherResetPassword'){
        if(!validText(body.password,6,200)) return json({error:'Das neue Passwort muss mindestens 6 Zeichen lang sein.'},400);
        const {salt,hash}=hashPassword(body.password); u.salt=salt;u.passwordHash=hash;u.passwordChangedAt=new Date().toISOString();await setJSON(users,key,u);await revokeUserSessions(u.userId);return json({ok:true});
      }
    }
    return json({error:'Unbekannte Aktion.'},400);
  }catch(err){ return json({error:err.message||'Serverfehler'},err.status||500); }
};

export const config = { path: '/api' };
