(() => {
  'use strict';
  const C = window.SQL_COURSE;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const escapeHtml = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const regularTasks = C.tasks.filter(t => !t.bonus);
  const allTasks = [...C.tasks, ...C.bonusTasks];
  const taskMap = Object.fromEntries(allTasks.map(t => [t.id,t]));
  const xpFor = t => (t.afb === 'I' ? 20 : t.afb === 'II' ? 35 : 50) + (t.bonus ? 15 : 0);
  const defaultProgress = () => ({completed:{},answers:{},xp:0,badges:[],equipped:{theme:'default',avatar:'🧑‍💻',pet:'',outfit:''},checklist:C.checklist.map(()=>({value:3,done:false})),lastView:'home',solutionSeen:{},updatedAt:null});
  let progress = defaultProgress();
  let session = localStorage.getItem('sqlq_session') || '';
  let currentUser = null;
  let SQL = null, seedSql = '', labDb = null;
  let currentView = 'home';
  let syncTimer = null;
  let selectedDragChip = null;

  document.addEventListener('DOMContentLoaded', init);

  async function init(){
    renderNav();
    loadGuest();
    applyEquipped();
    renderHome();
    bindGlobal();
    await initDatabase();
    await restoreSession();
    updateChrome();
  }

  async function initDatabase(){
    try{
      seedSql = await fetch('seed.sql').then(r => {if(!r.ok) throw new Error('seed.sql fehlt'); return r.text();});
      SQL = await window.initSqlJs({locateFile:file => `vendor/${file}`});
      resetLabDb();
      $('#labStatus').textContent = 'Datenbank bereit';
    }catch(err){
      $('#labStatus').textContent = 'SQL-Engine konnte nicht geladen werden';
      $('#labResult').innerHTML = `<div class="feedback bad">${escapeHtml(err.message)}. Prüfen Sie die Internetverbindung, da sql.js als Bibliothek geladen wird.</div>`;
    }
  }
  function freshDb(){ const db = new SQL.Database(); db.exec(seedSql); return db; }
  function resetLabDb(){ if(!SQL) return; try{ labDb?.close(); }catch{} labDb=freshDb(); refreshTableSelect(); }
  function refreshTableSelect(){
    if(!labDb) return;
    const names = labDb.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;")[0]?.values.flat() || [];
    $('#tableSelect').innerHTML = names.map(n=>`<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('');
  }

  function loadGuest(){
    try{ progress = {...defaultProgress(), ...JSON.parse(localStorage.getItem('sqlq_guest')||'{}')}; }
    catch{ progress = defaultProgress(); }
  }
  function saveLocal(){
    progress.updatedAt = new Date().toISOString();
    if(currentUser) localStorage.setItem('sqlq_user_backup', JSON.stringify(progress));
    else localStorage.setItem('sqlq_guest', JSON.stringify(progress));
    updateChrome();
    if(currentUser && session){ clearTimeout(syncTimer); syncTimer=setTimeout(()=>syncProgress(),700); }
  }
  async function syncProgress(){
    if(!currentUser || !session) return;
    try{ await api('saveProgress',{token:session,progress}); }
    catch(e){ console.warn('Sync fehlgeschlagen',e); }
  }
  async function restoreSession(){
    if(!session) return;
    try{
      const r=await api('getProgress',{token:session});
      currentUser=r.user;
      progress={...defaultProgress(), ...(r.progress||{})};
      const guest=JSON.parse(localStorage.getItem('sqlq_guest')||'{}');
      if(Object.keys(guest.completed||{}).length > Object.keys(progress.completed||{}).length){
        if(confirm('Auf diesem Gerät gibt es einen weiter fortgeschrittenen Gaststand. Möchten Sie ihn in Ihr Konto übernehmen?')){
          progress=mergeProgress(progress,guest); await syncProgress();
        }
      }
      applyEquipped(); updateChrome(); renderCurrent();
    }catch{
      session=''; localStorage.removeItem('sqlq_session'); currentUser=null; loadGuest(); updateChrome();
    }
  }
  function mergeProgress(a,b){
    const p={...defaultProgress(),...a};
    p.completed={...(a.completed||{}),...(b.completed||{})};
    p.answers={...(a.answers||{}),...(b.answers||{})};
    p.solutionSeen={...(a.solutionSeen||{}),...(b.solutionSeen||{})};
    p.xp=Math.max(calcXp(p), a.xp||0, b.xp||0);
    p.badges=[...new Set([...(a.badges||[]),...(b.badges||[])])];
    return p;
  }
  function calcXp(p=progress){ return allTasks.reduce((sum,t)=>sum+(p.completed?.[t.id]?xpFor(t):0),0); }

  function bindGlobal(){
    $('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('open');
    $('#authBtn').onclick=()=> currentUser ? openAccountModal() : openAuthModal('login');
    $('#glossaryBtn').onclick=openGlossary;
    $('#journalBtn').onclick=exportJournal;
    $('#labFab').onclick=()=>$('#labPanel').classList.add('open');
    $('#labClose').onclick=()=>$('#labPanel').classList.remove('open');
    $('#resetDbBtn').onclick=()=>{ if(confirm('Übungsdatenbank auf den Ausgangszustand zurücksetzen?')){resetLabDb(); $('#labStatus').textContent='Ausgangszustand wiederhergestellt'; $('#labResult').innerHTML='';} };
    $('#showTableBtn').onclick=()=>{ const n=$('#tableSelect').value; $('#labSql').value=`SELECT *\nFROM ${n};`; runLabSql(); };
    $('#runSqlBtn').onclick=runLabSql;
    $('#modalClose').onclick=closeModal;
    $('#modal').addEventListener('click',e=>{if(e.target.id==='modal') closeModal();});
    $('#chapterNav').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b) navigate(b.dataset.view);});
    $('#sidebar').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b) navigate(b.dataset.view);});
    $('#main').addEventListener('click',handleMainClick);
    $('#main').addEventListener('input',handleMainInput);
    $('#main').addEventListener('dragstart',handleDragStart);
    $('#main').addEventListener('dragover',e=>{if(e.target.closest('.dropzone')) e.preventDefault();});
    $('#main').addEventListener('drop',handleDrop);
  }

  function renderNav(){
    $('#chapterNav').innerHTML = `<button class="nav-link" data-view="home">🏠 Übersicht</button>` + C.chapters.map(ch=>`<button class="nav-link" data-view="${ch.id}">${ch.icon} ${ch.title}</button>`).join('');
  }
  function navigate(view){ currentView=view; progress.lastView=view; saveLocal(); renderCurrent(); $('#sidebar').classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'}); }
  function renderCurrent(){
    if(currentView==='home') renderHome();
    else if(C.chapters.some(c=>c.id===currentView)) renderChapter(currentView);
    else if(currentView==='test') renderTest();
    else if(currentView==='bonus') renderBonus();
    else if(currentView==='gallery') renderGallery();
    else if(currentView==='checklist') renderChecklist();
    else if(currentView==='teacher') renderTeacher();
    $$('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView));
  }

  function updateChrome(){
    const done=regularTasks.filter(t=>progress.completed?.[t.id]).length;
    const pct=Math.round(done/regularTasks.length*100);
    progress.xp=calcXp(progress);
    $('#xpValue').textContent=progress.xp;
    $('#progressFill').style.width=pct+'%';
    $('#progressText').textContent=`${pct} % · ${done}/${regularTasks.length} Aufgaben`;
    $('#profileName').textContent=currentUser?currentUser.nickname:'Gastmodus';
    $('#profileClass').textContent=currentUser?`${currentUser.className} · ${currentUser.role==='teacher'?'Lehrkraft':'Schülerkonto'}`:'nur auf diesem Gerät';
    $('#authBtn').textContent=currentUser?'Konto':'Anmelden';
    $('#avatar').textContent=progress.equipped?.avatar||'🧑‍💻';
    $('#pet').textContent=progress.equipped?.pet||'';
    $('#outfit').textContent=progress.equipped?.outfit||'';
    $$('.teacher-only').forEach(el=>el.classList.toggle('hidden',currentUser?.role!=='teacher'));
    applyEquipped();
  }
  function applyEquipped(){ document.body.classList.remove('theme-night','theme-sky','theme-mint'); const th=progress.equipped?.theme; if(th && th!=='default') document.body.classList.add('theme-'+th); }

  function renderHome(){
    currentView='home';
    const done=regularTasks.filter(t=>progress.completed?.[t.id]).length;
    const testDone=C.tasks.filter(t=>t.isTest && progress.completed?.[t.id]).length;
    const unlocked=C.shop.filter(i=>progress.xp>=i.xp).length;
    $('#main').innerHTML=`
      <section class="hero"><span class="badge">SQL · EventHub Leipzig</span><h1>Von der Tabelle zur eigenen Abfrage</h1><p>Arbeiten Sie mit einer festen relationalen Datenbank, führen Sie echte SQL-Befehle aus und kontrollieren Sie sich über die angekündigte Ergebniszahl, bevor Sie eine Musterlösung öffnen.</p><div class="hero-actions"><button class="btn primary" data-view="start">Kurs starten</button><button class="btn" data-open-lab="1">SQL-Labor öffnen</button><a class="btn" href="https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all" target="_blank" rel="noopener">W3Schools TrySQL</a></div></section>
      <div class="stat-grid"><div class="stat"><small>Reguläre Aufgaben</small><strong>${done}/${regularTasks.length}</strong></div><div class="stat"><small>XP</small><strong>${progress.xp}</strong></div><div class="stat"><small>Finaltest</small><strong>${testDone}/12</strong></div><div class="stat"><small>Freigeschaltet</small><strong>${unlocked}/${C.shop.length}</strong></div></div>
      <section class="section"><div class="chapter-head"><div><h2>Die feste Kursdatenbank</h2><p>Ein Datenmodell, alle Kapitel. Klicken Sie im ER-Modell auf eine Tabelle.</p></div></div>${renderER()}</section>
      <section class="section"><h2>So arbeitet dieser Kurs</h2><div class="interactive-grid"><div class="mini-tool"><h3>1. Erst selbst ausprobieren</h3><p>Jede SQL-Aufgabe nennt vorher die erwartete Zahl der Ergebnis- oder Änderungsdatensätze. Nutzen Sie diese Zahl als Plausibilitätskontrolle.</p></div><div class="mini-tool"><h3>2. Ergebnis statt Wortlaut</h3><p>Bei SQL-Aufgaben wird nicht geprüft, ob Ihr Befehl exakt wie die Musterlösung aussieht. Entscheidend ist das korrekte Ergebnis bzw. der korrekte Datenbankzustand.</p></div><div class="mini-tool"><h3>3. Sicher experimentieren</h3><p>Das SQL-Labor läuft in Ihrem Browser. UPDATE und DELETE verändern nur Ihre lokale Übungsinstanz. Mit „Datenbank zurücksetzen“ kehren Sie zum Ausgangszustand zurück.</p></div><div class="mini-tool"><h3>4. Fortschritt mit oder ohne Konto</h3><p>Im Gastmodus bleibt der Stand auf diesem Gerät. Mit Konto wird er über Netlify Functions und Blobs synchronisiert.</p></div></div></section>`;
  }

  function renderER(){
    return `<div class="er-wrap"><svg class="er-diagram" viewBox="0 0 960 430" role="img" aria-label="Entity-Relationship-Modell EventHub Leipzig">
      <line class="er-line" x1="170" y1="100" x2="375" y2="100"/><line class="er-line" x1="575" y1="100" x2="785" y2="100"/><line class="er-line" x1="830" y1="145" x2="555" y2="300"/><line class="er-line" x1="865" y1="145" x2="675" y2="290"/><line class="er-line" x1="775" y1="335" x2="785" y2="335"/>
      <g data-table="kunden"><rect class="er-box" x="30" y="55" rx="12" width="140" height="90"/><text class="er-text" x="48" y="82">KUNDEN</text><text class="er-small" x="48" y="105">PK KundenID</text><text class="er-small" x="48" y="125">Name · Stadt · …</text></g>
      <g data-table="buchungen"><rect class="er-box" x="375" y="55" rx="12" width="200" height="90"/><text class="er-text" x="393" y="82">BUCHUNGEN</text><text class="er-small" x="393" y="105">PK BuchungID</text><text class="er-small" x="393" y="125">FK KundenID · EventID</text></g>
      <g data-table="veranstaltungen"><rect class="er-box" x="785" y="55" rx="12" width="160" height="90"/><text class="er-text" x="803" y="82">VERANSTALTUNGEN</text><text class="er-small" x="803" y="105">PK EventID</text><text class="er-small" x="803" y="125">FK OrtID</text></g>
      <g data-table="orte"><rect class="er-box" x="395" y="300" rx="12" width="160" height="90"/><text class="er-text" x="415" y="327">ORTE</text><text class="er-small" x="415" y="350">PK OrtID</text><text class="er-small" x="415" y="370">Bezeichnung · Stadt</text></g>
      <g data-table="einsaetze"><rect class="er-box" x="575" y="290" rx="12" width="200" height="90"/><text class="er-text" x="595" y="317">EINSÄTZE</text><text class="er-small" x="595" y="340">PK EinsatzID</text><text class="er-small" x="595" y="360">FK EventID · MitarbeiterID</text></g>
      <g data-table="mitarbeitende"><rect class="er-box" x="785" y="290" rx="12" width="160" height="90"/><text class="er-text" x="803" y="317">MITARBEITENDE</text><text class="er-small" x="803" y="340">PK MitarbeiterID</text><text class="er-small" x="803" y="360">Vorname · Bereich</text></g>
      <text class="er-small" x="245" y="88">1 : n</text><text class="er-small" x="660" y="88">n : 1</text><text class="er-small" x="650" y="230">n : 1 Ort</text><text class="er-small" x="760" y="215">1 : n Einsätze</text><text class="er-small" x="780" y="325">n : 1</text>
    </svg><div class="er-info" id="erInfo"><strong>Hinweis:</strong> Klicken Sie auf eine Tabelle, um ihre Felder und ihre Rolle im Modell zu sehen.</div></div>`;
  }
  const erDetails={
    kunden:'<strong>kunden</strong>: KundenID (PK), Name, Stadt, Land, Kundentyp. Eine Kundin bzw. ein Kunde kann mehrere Buchungen besitzen.',
    buchungen:'<strong>buchungen</strong>: BuchungID (PK), KundenID (FK), EventID (FK), AnzahlTickets, Buchungsdatum, Status. Diese Tabelle löst die n:m-Beziehung zwischen Kunden und Veranstaltungen auf.',
    veranstaltungen:'<strong>veranstaltungen</strong>: EventID (PK), Titel, Kategorie, Preis, OrtID (FK), Datum, Status.',
    orte:'<strong>orte</strong>: OrtID (PK), Bezeichnung, Stadt, Kapazitaet. Ein Ort kann mehrere Veranstaltungen aufnehmen.',
    einsaetze:'<strong>einsaetze</strong>: EinsatzID (PK), EventID (FK), MitarbeiterID (FK), Stunden, Rolle. Beziehungstabelle zwischen Veranstaltungen und Mitarbeitenden.',
    mitarbeitende:'<strong>mitarbeitende</strong>: MitarbeiterID (PK), Vorname, Nachname, Bereich, Aktiv.'
  };

  function renderChapter(id){
    currentView=id; const ch=C.chapters.find(x=>x.id===id); const ts=C.tasks.filter(t=>t.chapter===id);
    let extra='';
    if(id==='where') extra=renderWhereSlider();
    if(id==='logic') extra=renderLikeTool();
    $('#main').innerHTML=`<section class="chapter-head"><div><span class="badge">Lernkapitel</span><h2>${ch.icon} ${ch.title}</h2><p>${ch.subtitle}</p></div><strong>${ts.filter(t=>progress.completed?.[t.id]).length}/${ts.length}</strong></section><section class="chapter-intro">${ch.intro}<div class="video-row">${ch.videos.map(v=>`<a class="video-link" href="${v[1]}" target="_blank" rel="noopener">▶ ${v[0]}</a>`).join('')}</div></section>${extra}<div class="task-grid">${ts.map(renderTask).join('')}</div>`;
    hydrateTaskState(); if(id==='where') updateWhereTool(); if(id==='logic') updateLikeTool();
  }
  function renderWhereSlider(){ return `<section class="section"><div class="mini-tool"><h3>Interaktiv: Preisgrenze verschieben</h3><p>Beobachten Sie, wie eine WHERE-Bedingung die Ergebnismenge verändert.</p><label>Preis größer als <strong><output id="priceVal">10</output> €</strong></label><input id="priceSlider" type="range" min="0" max="30" step="1" value="10"><div class="mini-results" id="priceResults"></div></div></section>`; }
  function renderLikeTool(){ return `<section class="section"><div class="mini-tool"><h3>Interaktiv: LIKE-Muster testen</h3><p>Verändern Sie das Muster. Beispiele: <code>G%</code>, <code>%a%</code>, <code>%Open</code>.</p><input id="likePattern" type="text" value="%a%" aria-label="LIKE-Muster"><div class="mini-results" id="likeResults"></div></div></section>`; }

  function renderTest(){
    currentView='test'; const ts=C.tasks.filter(t=>t.isTest); const done=ts.filter(t=>progress.completed?.[t.id]).length;
    $('#main').innerHTML=`<section class="hero"><span class="badge">Abschlusstest</span><h1>SQL Kompetenz-Check</h1><p>Der Test bündelt die wichtigsten Kompetenzen. Die Aufgaben bleiben einzeln überprüfbar; bei jeder SQL-Aufgabe sehen Sie weiterhin die erwartete Ergebniszahl.</p><div class="hero-actions"><strong>${done}/${ts.length} erledigt</strong></div></section><div class="task-grid">${ts.map(renderTask).join('')}</div>`; hydrateTaskState();
  }
  function renderBonus(){ currentView='bonus'; $('#main').innerHTML=`<section class="hero"><span class="badge">Bonus</span><h1>Extra Queries</h1><p>Bonusmissionen liegen in AFB II und III und geben zusätzliche XP.</p></section><div class="task-grid">${C.bonusTasks.map(renderTask).join('')}</div>`; hydrateTaskState(); }

  function renderTask(t){
    const done=!!progress.completed?.[t.id];
    const answer=progress.answers?.[t.id] ?? '';
    const solutionSeen=!!progress.solutionSeen?.[t.id];
    const ext=t.external?`<a class="btn small" href="${t.external}" target="_blank" rel="noopener">Externe Übung öffnen</a>`:'';
    let body='';
    if(t.type==='single'||t.type==='tf'){
      const opts=t.type==='tf'?[['true','Richtig'],['false','Falsch']]:t.options;
      body=opts.map(o=>`<label class="choice"><input type="radio" name="${t.id}" value="${o[0]}" ${answer===o[0]?'checked':''}> ${o[1]}</label>`).join('');
    } else if(t.type==='multi'){
      const vals=Array.isArray(answer)?answer:[]; body=t.options.map(o=>`<label class="choice"><input type="checkbox" name="${t.id}" value="${o[0]}" ${vals.includes(o[0])?'checked':''}> ${o[1]}</label>`).join('');
    } else if(t.type==='drag'){
      const placements=answer&&typeof answer==='object'&&!Array.isArray(answer)?answer:{};
      body=`<div class="drag-wrap"><div><strong>Begriffe</strong><div class="chips">${t.pairs.map(p=>`<button class="chip" draggable="true" data-chip="${escapeHtml(p[0])}" data-task="${t.id}">${escapeHtml(p[0])}</button>`).join('')}</div></div><div><strong>Ziele</strong>${t.pairs.map(p=>`<div class="dropzone" data-target="${escapeHtml(p[1])}" data-task="${t.id}"><small>${escapeHtml(p[1])}</small><strong>${escapeHtml(Object.entries(placements).find(([,v])=>v===p[1])?.[0]||'')}</strong></div>`).join('')}</div></div>`;
    } else if(t.type==='sequence'){
      const arr=Array.isArray(answer)&&answer.length?answer:t.items; body=`<ul class="sequence-list" data-task="${t.id}">${arr.map((x,i)=>`<li class="sequence-item" data-value="${escapeHtml(x)}"><span>${escapeHtml(x)}</span><span class="sequence-controls"><button data-move="up" ${i===0?'disabled':''}>↑</button><button data-move="down" ${i===arr.length-1?'disabled':''}>↓</button></span></li>`).join('')}</ul>`;
    } else if(t.type==='free'){
      body=`<textarea data-answer="${t.id}" rows="5" placeholder="Ihre fachliche Antwort …">${escapeHtml(answer)}</textarea><div class="task-actions"><button class="btn small" data-save-free="${t.id}">Antwort speichern</button>${ext}</div><div class="self-check ${solutionSeen?'':'hidden'}" data-self="${t.id}"><p>Vergleichen Sie Ihre Antwort mit der Musterlösung.</p><div class="task-actions"><button class="btn small primary" data-self-ok="${t.id}">Richtig – als korrekt werten</button><button class="btn small" data-self-retry="${t.id}">Nochmal bearbeiten</button></div></div>`;
    } else if(t.type==='sql'){
      const sql=answer || t.starter || ''; body=`<textarea class="sql-input" data-sql="${t.id}" spellcheck="false">${escapeHtml(sql)}</textarea><div class="task-actions"><button class="btn small" data-run-task="${t.id}">▶ Ausführen</button><button class="btn small primary" data-check-task="${t.id}">✓ Ergebnis prüfen</button><button class="btn small" data-to-lab="${t.id}">Im großen SQL-Labor öffnen</button></div><div class="result-box task-result" id="result-${t.id}"></div>`;
    }
    return `<article class="task ${done?'completed':''}" id="task-${t.id}"><div class="task-top"><div><div class="badges"><span class="badge afb${t.afb==='I'?'1':t.afb==='II'?'2':'3'}">AFB ${t.afb}</span>${t.bonus?'<span class="badge">Bonus</span>':''}<span class="badge rows">${escapeHtml(t.rowHint)}</span>${done?'<span class="badge done">✓ erledigt</span>':''}</div><h3>${t.title}</h3></div><strong>+${xpFor(t)} XP</strong></div><div class="prompt">${t.prompt}</div>${body}<div class="task-actions">${!['free','sql'].includes(t.type)?`<button class="btn small primary" data-check="${t.id}">Prüfen</button>`:''}<button class="btn small" data-solution="${t.id}">Musterlösung anzeigen</button></div><div class="feedback hidden" id="feedback-${t.id}"></div><div class="solution ${solutionSeen?'visible':''}" id="solution-${t.id}"><strong>Musterlösung</strong>${formatSolution(t.solution)}</div></article>`;
  }
  function formatSolution(s){ if(!s) return ''; if(s.includes('\n') && /SELECT|UPDATE|DELETE/i.test(s)) return `<pre>${escapeHtml(s)}</pre>`; return `<p>${s}</p>`; }
  function hydrateTaskState(){ updateChrome(); }

  function handleMainClick(e){
    const view=e.target.closest('[data-view]')?.dataset.view; if(view){navigate(view);return;}
    if(e.target.closest('[data-open-lab]')){$('#labPanel').classList.add('open');return;}
    const er=e.target.closest('[data-table]'); if(er){$('#erInfo').innerHTML=erDetails[er.dataset.table]||''; return;}
    const sol=e.target.closest('[data-solution]'); if(sol){revealSolution(sol.dataset.solution);return;}
    const check=e.target.closest('[data-check]'); if(check){checkObjective(check.dataset.check);return;}
    const run=e.target.closest('[data-run-task]'); if(run){runTaskSql(run.dataset.runTask,false);return;}
    const checksql=e.target.closest('[data-check-task]'); if(checksql){checkSqlTask(checksql.dataset.checkTask);return;}
    const tolab=e.target.closest('[data-to-lab]'); if(tolab){const id=tolab.dataset.toLab;$('#labSql').value=$(`[data-sql="${id}"]`)?.value||'';$('#labPanel').classList.add('open');return;}
    const save=e.target.closest('[data-save-free]'); if(save){saveFree(save.dataset.saveFree);return;}
    const selfok=e.target.closest('[data-self-ok]'); if(selfok){completeTask(selfok.dataset.selfOk); showFeedback(selfok.dataset.selfOk,true,'Selbstkontrolle gespeichert.');return;}
    const retry=e.target.closest('[data-self-retry]'); if(retry){const id=retry.dataset.selfRetry; $(`[data-self="${id}"]`)?.classList.add('hidden'); $(`#solution-${id}`)?.classList.remove('visible'); return;}
    const move=e.target.closest('[data-move]'); if(move){moveSequence(move);return;}
    const chip=e.target.closest('[data-chip]'); if(chip){selectedDragChip=chip.dataset.chip; $$('.chip').forEach(c=>c.classList.toggle('selected',c===chip)); return;}
    const zone=e.target.closest('.dropzone'); if(zone && selectedDragChip){placeChip(zone.dataset.task,selectedDragChip,zone.dataset.target); selectedDragChip=null; renderCurrent(); return;}
    const equip=e.target.closest('[data-equip]'); if(equip){equipItem(equip.dataset.equip);return;}
    const teacherAct=e.target.closest('[data-teacher-action]'); if(teacherAct){teacherAction(teacherAct.dataset.teacherAction,teacherAct.dataset.user);return;}
  }
  function handleMainInput(e){
    if(e.target.matches('[data-answer]')){progress.answers[e.target.dataset.answer]=e.target.value; saveLocal();}
    if(e.target.matches('[data-sql]')){progress.answers[e.target.dataset.sql]=e.target.value; saveLocal();}
    if(e.target.id==='priceSlider') updateWhereTool();
    if(e.target.id==='likePattern') updateLikeTool();
    if(e.target.matches('[data-check-range]')){const i=+e.target.dataset.checkRange; progress.checklist[i].value=+e.target.value; saveLocal(); $(`#rangeVal-${i}`).textContent=e.target.value;}
    if(e.target.matches('[data-check-done]')){const i=+e.target.dataset.checkDone; progress.checklist[i].done=e.target.checked; saveLocal();}
  }
  function handleDragStart(e){const c=e.target.closest('[data-chip]');if(c){e.dataTransfer?.setData('text/plain',JSON.stringify({task:c.dataset.task,chip:c.dataset.chip}));}}
  function handleDrop(e){const z=e.target.closest('.dropzone');if(!z)return;e.preventDefault();try{const d=JSON.parse(e.dataTransfer.getData('text/plain'));placeChip(d.task,d.chip,z.dataset.target);renderCurrent();}catch{}}
  function placeChip(task,chip,target){const a=progress.answers[task]&&typeof progress.answers[task]==='object'?progress.answers[task]:{}; Object.keys(a).forEach(k=>{if(a[k]===target) delete a[k];}); a[chip]=target;progress.answers[task]=a;saveLocal();}
  function moveSequence(btn){const li=btn.closest('li'), ul=li.parentElement; if(btn.dataset.move==='up'&&li.previousElementSibling) ul.insertBefore(li,li.previousElementSibling); if(btn.dataset.move==='down'&&li.nextElementSibling) ul.insertBefore(li.nextElementSibling,li); const id=ul.dataset.task;progress.answers[id]=[...ul.children].map(x=>x.dataset.value);saveLocal();renderCurrent();}

  function checkObjective(id){
    const t=taskMap[id]; let ans;
    if(t.type==='single'||t.type==='tf') ans=$(`input[name="${id}"]:checked`)?.value||'';
    if(t.type==='multi') ans=$$(`input[name="${id}"]:checked`).map(x=>x.value).sort();
    if(t.type==='drag') ans=progress.answers[id]||{};
    if(t.type==='sequence') ans=progress.answers[id]||t.items;
    progress.answers[id]=ans; saveLocal();
    let ok=false;
    if(t.type==='single'||t.type==='tf') ok=t.correct.includes(ans);
    if(t.type==='multi') ok=JSON.stringify(ans)===JSON.stringify([...t.correct].sort());
    if(t.type==='drag') ok=t.pairs.every(([a,b])=>ans[a]===b);
    if(t.type==='sequence') ok=JSON.stringify(ans)===JSON.stringify(t.correctOrder);
    if(ok){completeTask(id);showFeedback(id,true,positive());}else showFeedback(id,false,'Noch nicht vollständig korrekt. Prüfen Sie Ihre Auswahl und versuchen Sie es erneut.');
  }
  function saveFree(id){const v=$(`[data-answer="${id}"]`).value.trim();progress.answers[id]=v;saveLocal();showFeedback(id,!!v,v?'Antwort gespeichert. Sie können jetzt die Musterlösung zur Selbstkontrolle öffnen.':'Bitte geben Sie zuerst eine eigene Antwort ein.');}
  function revealSolution(id){
    const t=taskMap[id];
    if(t.type==='free' && !(progress.answers[id]||'').trim()){showFeedback(id,false,'Bitte geben Sie zuerst eine eigene Antwort ein.');return;}
    if(!confirm('Sind Sie sicher, oder wollen Sie es nicht noch einmal versuchen?')) return;
    progress.solutionSeen[id]=true;saveLocal();$(`#solution-${id}`)?.classList.add('visible');$(`[data-self="${id}"]`)?.classList.remove('hidden');
  }
  function completeTask(id){ if(progress.completed[id]) return; progress.completed[id]=true; progress.xp=calcXp(progress); unlockBadges(); saveLocal(); const card=$(`#task-${id}`);card?.classList.add('completed'); updateChrome(); }
  function unlockBadges(){
    const chapterBadges={start:'Datenmodell-Scout',select:'SELECT-Starter',where:'Filter-Profi',order:'Sortier-Navigator',logic:'Logik-Tracker',change:'Data-Caretaker'};
    for(const ch of C.chapters){const ts=C.tasks.filter(t=>t.chapter===ch.id); if(ts.length && ts.every(t=>progress.completed[t.id])){const b=chapterBadges[ch.id];if(b&&!progress.badges.includes(b))progress.badges.push(b);}}
    const test=C.tasks.filter(t=>t.isTest); if(test.every(t=>progress.completed[t.id])&&!progress.badges.includes('Query Master'))progress.badges.push('Query Master');
  }
  function showFeedback(id,ok,msg){const el=$(`#feedback-${id}`);if(!el)return;el.className='feedback '+(ok?'ok':'bad');el.textContent=msg;el.classList.remove('hidden');}
  function positive(){return ['Korrekt – die Abfrage passt.','Treffer. Das Ergebnis stimmt.','Sauber gelöst.','Richtig – weiter zur nächsten Query.'][Math.floor(Math.random()*4)];}

  function runLabSql(){
    if(!labDb){$('#labStatus').textContent='SQL-Engine noch nicht bereit';return;}
    const sql=$('#labSql').value.trim(); if(!sql)return;
    try{const result=labDb.exec(sql);const changed=labDb.getRowsModified();renderSqlResult($('#labResult'),result,changed);$('#labStatus').textContent=result.length?`${result[0].values.length} Zeile(n) im ersten Resultset`: `${changed} Zeile(n) geändert`;refreshTableSelect();}
    catch(e){$('#labResult').innerHTML=`<div class="feedback bad">${escapeHtml(e.message)}</div>`;$('#labStatus').textContent='Fehler';}
  }
  function runTaskSql(id){
    if(!labDb)return; const area=$(`[data-sql="${id}"]`); const sql=area.value.trim(); progress.answers[id]=sql;saveLocal();
    try{const r=labDb.exec(sql);const changed=labDb.getRowsModified();renderSqlResult($(`#result-${id}`),r,changed);}
    catch(e){$(`#result-${id}`).innerHTML=`<div class="feedback bad">${escapeHtml(e.message)}</div>`;}
  }
  function checkSqlTask(id){
    if(!SQL)return; const t=taskMap[id], sql=$(`[data-sql="${id}"]`)?.value.trim()||''; progress.answers[id]=sql;saveLocal(); if(!sql){showFeedback(id,false,'Bitte geben Sie zuerst einen SQL-Befehl ein.');return;}
    let u,e;
    try{
      u=freshDb(); e=freshDb();
      const ur=u.exec(sql); e.exec(t.expectedSql);
      let ok;
      if(t.mode==='mutation') ok=compareResults(u.exec(t.verifySql),e.exec(t.verifySql),true);
      else ok=compareResults(ur,e.exec(t.expectedSql),!!t.orderSensitive);
      if(ok){completeTask(id);showFeedback(id,true,positive());}else showFeedback(id,false,'Die Abfrage läuft, erzeugt aber noch nicht genau das erwartete Ergebnis. Nutzen Sie die angekündigte Datensatzzahl als Kontrolle.');
    }catch(err){showFeedback(id,false,'SQL-Fehler: '+err.message);}
    finally{try{u?.close();e?.close();}catch{}}
  }
  function compareResults(a,b,orderSensitive){
    if(a.length!==b.length)return false;
    for(let i=0;i<a.length;i++){
      if(a[i].columns.length!==b[i].columns.length)return false;
      let av=a[i].values.map(r=>JSON.stringify(r)), bv=b[i].values.map(r=>JSON.stringify(r));
      if(!orderSensitive){av.sort();bv.sort();}
      if(JSON.stringify(av)!==JSON.stringify(bv))return false;
    }
    return true;
  }
  function renderSqlResult(el,result,changed=0){
    if(!result.length){el.innerHTML=`<div class="feedback ok">Befehl ausgeführt. ${changed} Datensatz/Datensätze wurden verändert.</div>`;return;}
    el.innerHTML=result.map(r=>`<table><thead><tr>${r.columns.map(c=>`<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${r.values.map(row=>`<tr>${row.map(v=>`<td>${escapeHtml(v===null?'NULL':v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`).join('');
  }

  function updateWhereTool(){if(!SQL||!$('#priceSlider'))return; const v=+$('#priceSlider').value;$('#priceVal').textContent=v;const d=freshDb(),r=d.exec(`SELECT Titel, Preis FROM veranstaltungen WHERE Preis > ${v} ORDER BY Preis;`)[0];$('#priceResults').innerHTML=`<strong>${r?.values.length||0} Datensätze</strong>`+(r?`<ul>${r.values.slice(0,8).map(x=>`<li>${escapeHtml(x[0])} · ${x[1]} €</li>`).join('')}</ul>`:'');d.close();}
  function updateLikeTool(){if(!SQL||!$('#likePattern'))return; const p=$('#likePattern').value.replaceAll("'","''");const d=freshDb();try{const r=d.exec(`SELECT Titel FROM veranstaltungen WHERE Titel LIKE '${p}' ORDER BY Titel;`)[0];$('#likeResults').innerHTML=`<strong>${r?.values.length||0} Datensätze</strong>`+(r?`<ul>${r.values.map(x=>`<li>${escapeHtml(x[0])}</li>`).join('')}</ul>`:'');}catch(e){$('#likeResults').textContent=e.message;}d.close();}

  function renderGallery(){
    currentView='gallery'; $('#main').innerHTML=`<section class="hero"><span class="badge">XP-Galerie</span><h1>Freischalten und ausrüsten</h1><p>Ihre XP werden nicht ausgegeben. Sobald Sie die Schwelle erreichen, können Sie ein Item dauerhaft ausrüsten.</p></section><section class="section"><h2>Galerie</h2><div class="gallery">${C.shop.map(i=>{const unlocked=progress.xp>=i.xp;const equipped=Object.values(progress.equipped||{}).includes(i.value);return `<div class="shop-item ${unlocked?'':'locked'}"><div class="shop-icon">${i.icon}</div><strong>${i.name}</strong><small>${i.xp} XP</small><p>${unlocked?'Freigeschaltet':'Noch gesperrt'}</p>${unlocked?`<button class="btn small ${equipped?'primary':''}" data-equip="${i.id}">${equipped?'Ausgerüstet':'Ausrüsten'}</button>`:''}</div>`}).join('')}</div></section><section class="section"><h2>Badges</h2><div class="chips">${(progress.badges||[]).length?progress.badges.map(b=>`<span class="chip">🏅 ${escapeHtml(b)}</span>`).join(''):'Noch keine Kapitel-Badges freigeschaltet.'}</div></section>`;
  }
  function equipItem(id){const i=C.shop.find(x=>x.id===id);if(!i||progress.xp<i.xp)return;progress.equipped[i.type]=i.value;saveLocal();renderGallery();}
  function renderChecklist(){
    currentView='checklist'; const done=progress.checklist.filter(x=>x.done).length;
    $('#main').innerHTML=`<section class="hero"><span class="badge">Selbstüberprüfung</span><h1>Was kann ich schon sicher?</h1><p>Schätzen Sie jede Kompetenz auf einer Skala von 1 bis 5 ein. „Erledigt“ lässt sich jederzeit wieder zurücksetzen.</p><strong>${done}/${C.checklist.length} als erledigt markiert</strong></section><section class="section">${C.checklist.map((txt,i)=>{const v=progress.checklist[i]||{value:3,done:false};return `<div class="check-row"><label><strong>${i+1}. ${txt}</strong><span><input type="checkbox" data-check-done="${i}" ${v.done?'checked':''}> erledigt</span></label><input type="range" min="1" max="5" value="${v.value}" data-check-range="${i}"><small>Selbsteinschätzung: <strong id="rangeVal-${i}">${v.value}</strong>/5</small></div>`}).join('')}</section>`;
  }

  function openGlossary(){
    openModal(`<h2>SQL-Glossar</h2><input id="glossSearch" type="text" placeholder="Begriff suchen …" style="width:100%;padding:.7rem;border:1px solid #ccd5e3;border-radius:9px"><div id="glossList">${glossHtml('')}</div>`);
    $('#glossSearch').oninput=e=>$('#glossList').innerHTML=glossHtml(e.target.value);
  }
  function glossHtml(q){q=q.toLowerCase();return C.glossary.filter(x=>x.join(' ').toLowerCase().includes(q)).map(x=>`<p><strong>${escapeHtml(x[0])}</strong><br>${escapeHtml(x[1])}</p>`).join('')||'<p>Kein Begriff gefunden.</p>';}

  function openModal(html){$('#modalContent').innerHTML=html;$('#modal').classList.remove('hidden');}
  function closeModal(){$('#modal').classList.add('hidden');}
  function openAuthModal(tab='login'){
    openModal(`<h2>Anmeldung & Klassen</h2><p>Ohne Anmeldung können Sie den Kurs weiter als Gast bearbeiten. Mit Konto wird Ihr Fortschritt geräteübergreifend gespeichert.</p><div class="auth-tabs"><button data-auth-tab="login">Anmelden</button><button data-auth-tab="register">Schülerkonto</button><button data-auth-tab="teacher">Lehrerzugang anlegen</button></div><div id="authForm"></div>`);
    const setTab=t=>{ $$('[data-auth-tab]').forEach(b=>b.classList.toggle('active',b.dataset.authTab===t)); renderAuthForm(t); };
    $$('[data-auth-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.authTab)); setTab(tab);
  }
  function renderAuthForm(tab){
    const teacher=tab==='teacher'; const register=tab==='register';
    $('#authForm').innerHTML=`<div class="form-grid"><label>Klasse<input id="authClass" placeholder="z. B. FOS12A"></label><label>Nickname<input id="authNick" autocomplete="username" placeholder="selbstgewählter Nickname"></label><label>Passwort<input id="authPass" type="password" autocomplete="${register?'new-password':'current-password'}"></label>${teacher?'<label>Lehrer-Setup-Code<input id="authCode" type="password" placeholder="Code aus Netlify"></label>':''}<button class="btn primary" id="authSubmit">${teacher?'Lehrerzugang anlegen':register?'Schülerkonto anlegen':'Anmelden'}</button><div id="authMsg"></div></div>`;
    $('#authSubmit').onclick=async()=>{
      const className=$('#authClass').value.trim(),nickname=$('#authNick').value.trim(),password=$('#authPass').value;
      try{
        const payload={className,nickname,password}; if(teacher)payload.code=$('#authCode').value;
        const r=await api(teacher?'setupTeacher':register?'registerStudent':'login',payload);
        if(register){$('#authMsg').innerHTML='<div class="feedback ok">Konto angelegt. Sie können sich jetzt anmelden.</div>';return;}
        if(teacher && !r.token){$('#authMsg').innerHTML='<div class="feedback ok">Lehrerzugang angelegt. Bitte anmelden.</div>';return;}
        session=r.token;localStorage.setItem('sqlq_session',session);currentUser=r.user;progress={...defaultProgress(),...(r.progress||{})};applyEquipped();closeModal();updateChrome();renderCurrent();
      }catch(e){$('#authMsg').innerHTML=`<div class="feedback bad">${escapeHtml(e.message)}</div>`;}
    };
  }
  function openAccountModal(){
    openModal(`<h2>Konto</h2><p><strong>${escapeHtml(currentUser.nickname)}</strong><br>${escapeHtml(currentUser.className)} · ${currentUser.role==='teacher'?'Lehrkraft':'Schülerkonto'}</p><p>Fortschritt: ${regularTasks.filter(t=>progress.completed[t.id]).length}/${regularTasks.length} Aufgaben · ${progress.xp} XP</p>${currentUser.role==='teacher'?'<button class="btn" id="teacherOpen">Lehrerbereich öffnen</button>':''}<button class="btn danger" id="logoutBtn">Abmelden</button>`);
    $('#logoutBtn').onclick=logout; if($('#teacherOpen'))$('#teacherOpen').onclick=()=>{closeModal();navigate('teacher');};
  }
  async function logout(){try{await api('logout',{token:session});}catch{} session='';currentUser=null;localStorage.removeItem('sqlq_session');loadGuest();applyEquipped();closeModal();updateChrome();renderHome();}
  async function api(action,payload={}){
    const res=await fetch('/api',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action,...payload})});
    const data=await res.json().catch(()=>({error:'Serverantwort konnte nicht gelesen werden.'})); if(!res.ok)throw new Error(data.error||'Serverfehler'); return data;
  }

  async function renderTeacher(){
    currentView='teacher'; if(currentUser?.role!=='teacher'){navigate('home');return;}
    $('#main').innerHTML='<section class="hero"><span class="badge">Lehrerbereich</span><h1>Klassenfortschritt</h1><p>Es werden ausschließlich Konten Ihrer Klasse angezeigt.</p></section><section class="section"><div id="teacherData">Lade Daten …</div></section>';
    try{
      const r=await api('teacherList',{token:session}); const students=r.students||[];
      $('#teacherData').innerHTML=`<div class="task-actions"><button class="btn danger" data-teacher-action="resetClass">Fortschritt der Klasse zurücksetzen</button></div><div class="teacher-table"><table><thead><tr><th>Nickname</th><th>Fortschritt</th><th>XP</th><th>Finaltest</th><th>Aktionen</th></tr></thead><tbody>${students.map(s=>`<tr><td>${escapeHtml(s.nickname)}</td><td>${s.done}/${regularTasks.length}</td><td>${s.xp}</td><td>${s.testDone}/12</td><td><div class="teacher-actions"><button class="btn small" data-teacher-action="resetUser" data-user="${s.userId}">Fortschritt zurücksetzen</button><button class="btn small" data-teacher-action="password" data-user="${s.userId}">Passwort setzen</button><button class="btn small danger" data-teacher-action="delete" data-user="${s.userId}">Nutzer entfernen</button></div></td></tr>`).join('')}</tbody></table></div>`;
    }catch(e){$('#teacherData').innerHTML=`<div class="feedback bad">${escapeHtml(e.message)}</div>`;}
  }
  async function teacherAction(action,userId){
    try{
      if(action==='resetClass'){if(!confirm('Wirklich den Fortschritt aller Schülerkonten dieser Klasse zurücksetzen?'))return;await api('teacherResetClass',{token:session});}
      if(action==='resetUser'){if(!confirm('Fortschritt dieses Nutzers zurücksetzen?'))return;await api('teacherResetProgress',{token:session,userId});}
      if(action==='delete'){if(!confirm('Dieses Schülerkonto wirklich entfernen?'))return;await api('teacherDeleteUser',{token:session,userId});}
      if(action==='password'){const password=prompt('Neues Passwort eingeben:');if(!password)return;await api('teacherResetPassword',{token:session,userId,password});}
      await renderTeacher();
    }catch(e){alert(e.message);}
  }

  function exportJournal(){
    const completed=allTasks.filter(t=>progress.completed?.[t.id]); if(!completed.length){alert('Es sind noch keine abgeschlossenen Aufgaben vorhanden.');return;}
    const name=currentUser?`${currentUser.nickname} · ${currentUser.className}`:'Gastmodus';
    const win=window.open('','_blank'); if(!win){alert('Bitte erlauben Sie Pop-ups für den PDF-Export.');return;}
    const items=completed.map(t=>`<section><h3>${escapeHtml(t.title)} <small>AFB ${t.afb}</small></h3><p>${t.prompt}</p><p><strong>Ihre Antwort:</strong></p><pre>${escapeHtml(answerForPrint(t))}</pre></section>`).join('');
    const checklist=C.checklist.map((x,i)=>`<li>${escapeHtml(x)} – ${progress.checklist[i]?.value||3}/5 ${progress.checklist[i]?.done?'✓':''}</li>`).join('');
    win.document.write(`<!doctype html><html lang="de"><head><meta charset="utf-8"><title>SQL-Lernjournal</title><style>body{font:11pt/1.45 Arial,sans-serif;color:#111;margin:18mm}h1{font-size:20pt}h2{font-size:15pt;border-bottom:1px solid #bbb;padding-bottom:4px}h3{font-size:12pt;margin-bottom:4px}section{break-inside:avoid;margin:0 0 14px}pre{white-space:pre-wrap;background:#f3f3f3;padding:8px;border-radius:5px}small{font-weight:normal;color:#555}@media print{button{display:none}}</style></head><body><h1>SQL Quest Leipzig – Lernjournal</h1><p><strong>${escapeHtml(name)}</strong><br>Erstellt am ${new Date().toLocaleDateString('de-DE')} · ${completed.length} abgeschlossene Aufgaben</p><h2>Bearbeitete Aufgaben</h2>${items}<h2>Selbstcheck</h2><ol>${checklist}</ol><p><button onclick="window.print()">Als PDF drucken / speichern</button></p></body></html>`);win.document.close();setTimeout(()=>win.print(),400);
  }
  function answerForPrint(t){const a=progress.answers?.[t.id]; if(Array.isArray(a))return a.join(', '); if(a&&typeof a==='object')return Object.entries(a).map(([k,v])=>`${k} → ${v}`).join('\n'); return a||'(automatisch geprüfte Aufgabe)';}
})();
