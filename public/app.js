(() => {
  'use strict';
  const C = window.SQL_COURSE;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const escapeHtml = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const regularTasks = C.tasks.filter(t => !t.bonus && !t.isTest);
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
      refreshAllFilterTasks();
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
    const testTasks=C.tasks.filter(t=>t.isTest);
    const testDone=testTasks.filter(t=>progress.completed?.[t.id]).length;
    const unlocked=C.shop.filter(i=>progress.xp>=i.xp).length;
    $('#main').innerHTML=`
      <section class="hero"><span class="badge">SQL · EventHub Leipzig</span><h1>Erst filtern, dann SQL schreiben</h1><p>Der Kurs startet mit einem Detektivfall: Sie lösen echte betriebliche Anfragen zunächst mit Tabellenfiltern. Danach übertragen Sie genau diese Denkweise Schritt für Schritt in vollständige SQL-Statements.</p><div class="hero-actions"><button class="btn primary" data-view="detective">Detektivfall starten</button><button class="btn" data-open-lab="1">SQL-Labor öffnen</button><a class="btn" href="https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all" target="_blank" rel="noopener">W3Schools TrySQL</a></div></section>
      <div class="stat-grid"><div class="stat"><small>Reguläre Aufgaben</small><strong>${done}/${regularTasks.length}</strong></div><div class="stat"><small>XP</small><strong>${progress.xp}</strong></div><div class="stat"><small>Finaltest</small><strong>${testDone}/${testTasks.length}</strong></div><div class="stat"><small>Freigeschaltet</small><strong>${unlocked}/${C.shop.length}</strong></div></div>
      <section class="section"><h2>So arbeitet dieser Kurs</h2><div class="interactive-grid"><div class="mini-tool"><h3>1. Detektivfall</h3><p>Sie kombinieren echte Tabellenfilter und erleben, warum mehrere Bedingungen in realen Anfragen notwendig sind.</p></div><div class="mini-tool"><h3>2. Datenmodell verstehen</h3><p>Anschließend wird die feste EventHub-Datenbank über ein korrektes ER-Modell in Chen-Notation und das zugehörige Relationenmodell eingeführt.</p></div><div class="mini-tool"><h3>3. Hilfen werden abgebaut</h3><p>Frühe SQL-Aufgaben enthalten noch Gerüste. Später schreiben Sie vollständige Statements ohne vorgegebenen Befehl.</p></div><div class="mini-tool"><h3>4. Ergebnis statt Wortlaut</h3><p>Bei SQL-Aufgaben wird das fachliche Ergebnis geprüft. Unterschiedliche korrekte SQL-Befehle können deshalb akzeptiert werden.</p></div></div></section>
      <section class="section"><div class="mini-tool"><h3>Eine Datenbank – der ganze Kurs</h3><p>Alle Aufgaben arbeiten mit <strong>EventHub Leipzig</strong>. Ihre Abfragen erzeugen echte Ergebnistabellen; UPDATE und DELETE verändern nur Ihre lokale Browserinstanz und können jederzeit zurückgesetzt werden.</p></div></section>`;
  }

  function renderER(){
    return `<div class="er-wrap"><div class="er-legend"><span><i class="legend-entity"></i> Entitätstyp</span><span><i class="legend-relation"></i> Beziehung</span><span><i class="legend-attribute"></i> Attribut</span><span><u>unterstrichen</u> = Primärschlüssel</span></div><svg class="er-diagram chen" viewBox="0 0 1220 720" role="img" aria-label="ER-Modell EventHub Leipzig in Chen-Notation">
      <!-- KUNDE -->
      <g data-table="kunden"><rect class="er-entity" x="70" y="270" width="155" height="62"/><text class="er-text center" x="147" y="307">KUNDE</text></g>
      <line class="er-line" x1="147" y1="270" x2="147" y2="205"/><ellipse class="er-attribute" cx="147" cy="170" rx="72" ry="28"/><text class="er-small center underline" x="147" y="175">KundenID</text>
      <line class="er-line" x1="70" y1="284" x2="42" y2="235"/><ellipse class="er-attribute" cx="35" cy="205" rx="60" ry="27"/><text class="er-small center" x="35" y="210">Name</text>
      <line class="er-line" x1="70" y1="320" x2="38" y2="372"/><ellipse class="er-attribute" cx="35" cy="405" rx="60" ry="27"/><text class="er-small center" x="35" y="410">Stadt</text>
      <line class="er-line" x1="180" y1="332" x2="215" y2="383"/><ellipse class="er-attribute" cx="225" cy="418" rx="78" ry="27"/><text class="er-small center" x="225" y="423">Kundentyp</text>

      <!-- bucht -->
      <g data-table="bucht"><polygon class="er-relation" points="330,270 400,300 330,330 260,300"/><text class="er-small center" x="330" y="305">bucht</text></g>
      <line class="er-line" x1="225" y1="301" x2="260" y2="301"/><text class="cardinality" x="240" y="288">n</text>
      <line class="er-line" x1="400" y1="301" x2="485" y2="301"/><text class="cardinality" x="430" y="288">m</text>
      <line class="er-line" x1="330" y1="270" x2="330" y2="215"/><ellipse class="er-attribute" cx="330" cy="180" rx="78" ry="27"/><text class="er-small center" x="330" y="185">AnzahlTickets</text>
      <line class="er-line" x1="310" y1="327" x2="285" y2="382"/><ellipse class="er-attribute" cx="270" cy="418" rx="92" ry="27"/><text class="er-small center" x="270" y="423">Buchungsdatum</text>
      <line class="er-line" x1="350" y1="327" x2="390" y2="382"/><ellipse class="er-attribute" cx="407" cy="418" rx="62" ry="27"/><text class="er-small center" x="407" y="423">Status</text>

      <!-- VERANSTALTUNG -->
      <g data-table="veranstaltungen"><rect class="er-entity" x="485" y="270" width="190" height="62"/><text class="er-text center" x="580" y="307">VERANSTALTUNG</text></g>
      <line class="er-line" x1="540" y1="270" x2="500" y2="213"/><ellipse class="er-attribute" cx="480" cy="180" rx="67" ry="27"/><text class="er-small center underline" x="480" y="185">EventID</text>
      <line class="er-line" x1="580" y1="270" x2="580" y2="205"/><ellipse class="er-attribute" cx="580" cy="170" rx="62" ry="27"/><text class="er-small center" x="580" y="175">Titel</text>
      <line class="er-line" x1="625" y1="270" x2="675" y2="215"/><ellipse class="er-attribute" cx="703" cy="180" rx="73" ry="27"/><text class="er-small center" x="703" y="185">Kategorie</text>
      <line class="er-line" x1="520" y1="332" x2="500" y2="386"/><ellipse class="er-attribute" cx="490" cy="420" rx="58" ry="27"/><text class="er-small center" x="490" y="425">Preis</text>
      <line class="er-line" x1="580" y1="332" x2="580" y2="390"/><ellipse class="er-attribute" cx="580" cy="425" rx="58" ry="27"/><text class="er-small center" x="580" y="430">Datum</text>
      <line class="er-line" x1="640" y1="332" x2="680" y2="386"/><ellipse class="er-attribute" cx="700" cy="420" rx="58" ry="27"/><text class="er-small center" x="700" y="425">Status</text>

      <!-- findet statt in -->
      <g data-table="findet"><polygon class="er-relation" points="790,270 875,300 790,330 705,300"/><text class="er-small center" x="790" y="296"><tspan x="790">findet statt</tspan><tspan x="790" dy="14">in</tspan></text></g>
      <line class="er-line" x1="675" y1="301" x2="705" y2="301"/><text class="cardinality" x="688" y="288">n</text>
      <line class="er-line" x1="875" y1="301" x2="940" y2="301"/><text class="cardinality" x="905" y="288">1</text>

      <!-- ORT -->
      <g data-table="orte"><rect class="er-entity" x="940" y="270" width="150" height="62"/><text class="er-text center" x="1015" y="307">ORT</text></g>
      <line class="er-line" x1="1015" y1="270" x2="1015" y2="205"/><ellipse class="er-attribute" cx="1015" cy="170" rx="62" ry="27"/><text class="er-small center underline" x="1015" y="175">OrtID</text>
      <line class="er-line" x1="980" y1="270" x2="945" y2="217"/><ellipse class="er-attribute" cx="920" cy="180" rx="82" ry="27"/><text class="er-small center" x="920" y="185">Bezeichnung</text>
      <line class="er-line" x1="980" y1="332" x2="945" y2="385"/><ellipse class="er-attribute" cx="925" cy="420" rx="58" ry="27"/><text class="er-small center" x="925" y="425">Stadt</text>
      <line class="er-line" x1="1050" y1="332" x2="1080" y2="385"/><ellipse class="er-attribute" cx="1095" cy="420" rx="74" ry="27"/><text class="er-small center" x="1095" y="425">Kapazität</text>

      <!-- Betreuung n:m -->
      <g data-table="betreuung"><polygon class="er-relation" points="580,500 670,540 580,580 490,540"/><text class="er-small center" x="580" y="536"><tspan x="580">wird betreut</tspan><tspan x="580" dy="14">von</tspan></text></g>
      <line class="er-line" x1="580" y1="332" x2="580" y2="500"/><text class="cardinality" x="592" y="475">n</text>
      <line class="er-line" x1="580" y1="580" x2="580" y2="625"/><text class="cardinality" x="592" y="610">m</text>
      <line class="er-line" x1="490" y1="540" x2="425" y2="540"/><ellipse class="er-attribute" cx="370" cy="540" rx="58" ry="27"/><text class="er-small center" x="370" y="545">Stunden</text>
      <line class="er-line" x1="670" y1="540" x2="735" y2="540"/><ellipse class="er-attribute" cx="790" cy="540" rx="58" ry="27"/><text class="er-small center" x="790" y="545">Rolle</text>

      <!-- MITARBEITENDE -->
      <g data-table="mitarbeitende"><rect class="er-entity" x="485" y="625" width="190" height="62"/><text class="er-text center" x="580" y="662">MITARBEITENDE</text></g>
      <line class="er-line" x1="485" y1="642" x2="415" y2="620"/><ellipse class="er-attribute" cx="355" cy="603" rx="86" ry="27"/><text class="er-small center underline" x="355" y="608">MitarbeiterID</text>
      <line class="er-line" x1="505" y1="687" x2="455" y2="705"/><ellipse class="er-attribute" cx="405" cy="708" rx="60" ry="24"/><text class="er-small center" x="405" y="713">Vorname</text>
      <line class="er-line" x1="560" y1="687" x2="545" y2="708"/><ellipse class="er-attribute" cx="545" cy="708" rx="65" ry="24"/><text class="er-small center" x="545" y="713">Nachname</text>
      <line class="er-line" x1="625" y1="687" x2="685" y2="705"/><ellipse class="er-attribute" cx="735" cy="708" rx="62" ry="24"/><text class="er-small center" x="735" y="713">Bereich</text>
    </svg><div class="er-info" id="erInfo"><strong>Hinweis:</strong> Klicken Sie auf ein Rechteck oder eine Raute. Das Modell zeigt bewusst die konzeptionelle Ebene; im Relationenmodell werden die n:m-Beziehungen als Tabellen <code>buchungen</code> und <code>einsaetze</code> umgesetzt.</div></div>`;
  }
  const erDetails={
    kunden:'<strong>KUNDE</strong>: Entitätstyp mit den Attributen KundenID, Name, Stadt, Land und Kundentyp. KundenID ist der Primärschlüssel.',
    bucht:'<strong>bucht</strong>: n:m-Beziehung zwischen KUNDE und VERANSTALTUNG. Beziehungsattribute sind AnzahlTickets, Buchungsdatum und Status. Im Relationenmodell wird daraus die Tabelle <code>buchungen</code> mit eigener BuchungID sowie KundenID und EventID als Fremdschlüssel.',
    veranstaltungen:'<strong>VERANSTALTUNG</strong>: Entitätstyp mit EventID als Primärschlüssel sowie Titel, Kategorie, Preis, Datum und Status.',
    findet:'<strong>findet statt in</strong>: n:1-Beziehung. Viele Veranstaltungen können demselben Ort zugeordnet sein; jede Veranstaltung verweist im Relationenmodell über OrtID auf genau einen Ort.',
    orte:'<strong>ORT</strong>: Entitätstyp mit OrtID als Primärschlüssel sowie Bezeichnung, Stadt und Kapazität.',
    betreuung:'<strong>wird betreut von</strong>: n:m-Beziehung zwischen VERANSTALTUNG und MITARBEITENDE mit den Beziehungsattributen Stunden und Rolle. Im Relationenmodell wird daraus die Tabelle <code>einsaetze</code> mit eigener EinsatzID.',
    mitarbeitende:'<strong>MITARBEITENDE</strong>: Entitätstyp mit MitarbeiterID als Primärschlüssel sowie Vorname, Nachname, Bereich und Aktiv.'
  };

  function renderRelationalOverview(){
    return `<section class="section"><div class="chapter-head"><div><h3>Vom ER-Modell zum Relationenmodell</h3><p>Diese sechs Tabellen stehen im SQL-Labor tatsächlich zur Verfügung.</p></div></div><div class="schema-grid">
      <button class="schema-card" data-open-table="kunden"><strong>kunden</strong><small>PK KundenID</small><span>Name · Stadt · Land · Kundentyp</span></button>
      <button class="schema-card" data-open-table="orte"><strong>orte</strong><small>PK OrtID</small><span>Bezeichnung · Stadt · Kapazitaet</span></button>
      <button class="schema-card" data-open-table="veranstaltungen"><strong>veranstaltungen</strong><small>PK EventID · FK OrtID</small><span>Titel · Kategorie · Preis · Datum · Status</span></button>
      <button class="schema-card" data-open-table="buchungen"><strong>buchungen</strong><small>PK BuchungID · FK KundenID · EventID</small><span>AnzahlTickets · Buchungsdatum · Status</span></button>
      <button class="schema-card" data-open-table="mitarbeitende"><strong>mitarbeitende</strong><small>PK MitarbeiterID</small><span>Vorname · Nachname · Bereich · Aktiv</span></button>
      <button class="schema-card" data-open-table="einsaetze"><strong>einsaetze</strong><small>PK EinsatzID · FK EventID · MitarbeiterID</small><span>Stunden · Rolle</span></button>
    </div></section>`;
  }

  function renderChapter(id){
    currentView=id; const ch=C.chapters.find(x=>x.id===id); const ts=C.tasks.filter(t=>t.chapter===id && !t.isTest);
    let extra='';
    if(id==='model') extra=`<section class="section"><div class="chapter-head"><div><h3>ER-Modell in Chen-Notation</h3><p>Rechteck = Entitätstyp · Raute = Beziehung · Oval = Attribut.</p></div></div>${renderER()}</section>${renderRelationalOverview()}`;
    if(id==='where') extra+=renderWhereSlider();
    if(id==='logic') extra+=renderLikeTool();
    $('#main').innerHTML=`<section class="chapter-head"><div><span class="badge">Lernkapitel</span><h2>${ch.icon} ${ch.title}</h2><p>${ch.subtitle}</p></div><strong>${ts.filter(t=>progress.completed?.[t.id]).length}/${ts.length}</strong></section><section class="chapter-intro">${ch.intro}<div class="video-row">${ch.videos.map(v=>`<a class="video-link" href="${v[1]}" target="_blank" rel="noopener">▶ ${v[0]}</a>`).join('')}</div></section>${extra}<div class="task-grid">${ts.map(renderTask).join('')}</div>`;
    hydrateTaskState(); if(id==='where') updateWhereTool(); if(id==='logic') updateLikeTool(); refreshAllFilterTasks();
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
      const sql=answer || t.starter || ''; body=`<textarea class="sql-input" data-sql="${t.id}" spellcheck="false" placeholder="Schreiben Sie hier Ihren vollständigen SQL-Befehl …">${escapeHtml(sql)}</textarea><div class="task-actions"><button class="btn small" data-run-task="${t.id}">▶ Ausführen</button><button class="btn small primary" data-check-task="${t.id}">✓ Ergebnis prüfen</button><button class="btn small" data-to-lab="${t.id}">Im großen SQL-Labor öffnen</button></div><div class="result-box task-result" id="result-${t.id}"></div>`;
    } else if(t.type==='filter'){
      body=renderFilterTask(t);
    }
    const objectiveButton=!['free','sql','filter'].includes(t.type)?`<button class="btn small primary" data-check="${t.id}">Prüfen</button>`:'';
    return `<article class="task ${done?'completed':''}" id="task-${t.id}"><div class="task-top"><div><div class="badges"><span class="badge afb${t.afb==='I'?'1':t.afb==='II'?'2':'3'}">AFB ${t.afb}</span>${t.bonus?'<span class="badge">Bonus</span>':''}<span class="badge rows">${escapeHtml(t.rowHint)}</span>${done?'<span class="badge done">✓ erledigt</span>':''}</div><h3>${t.title}</h3></div><strong>+${xpFor(t)} XP</strong></div><div class="prompt">${t.prompt}</div>${body}<div class="task-actions">${objectiveButton}<button class="btn small" data-solution="${t.id}">Musterlösung anzeigen</button></div><div class="feedback hidden" id="feedback-${t.id}"></div><div class="solution ${solutionSeen?'visible':''}" id="solution-${t.id}"><strong>Musterlösung</strong>${formatSolution(t.solution)}</div></article>`;
  }
  function formatSolution(s){ if(!s) return ''; if(/^\s*(SELECT|UPDATE|DELETE)/i.test(s)) return `<pre>${escapeHtml(s)}</pre>`; return `<p>${s}</p>`; }
  function renderFilterTask(t){
    const a=progress.answers?.[t.id]&&typeof progress.answers[t.id]==='object'?progress.answers[t.id]:{};
    const controls=t.filterSpec.controls.map(c=>{
      if(c.type==='select') return `<label class="filter-field"><span>${escapeHtml(c.label)}</span><select data-filter-task="${t.id}" data-filter-key="${c.key}">${c.options.map(o=>`<option value="${escapeHtml(o)}" ${String(a[c.key]??'')===String(o)?'selected':''}>${escapeHtml(o||'Alle')}</option>`).join('')}</select></label>`;
      if(c.type==='number') return `<label class="filter-field"><span>${escapeHtml(c.label)}</span><input type="number" step="0.1" data-filter-task="${t.id}" data-filter-key="${c.key}" value="${escapeHtml(a[c.key]??'')}"></label>`;
      if(c.type==='date') return `<label class="filter-field"><span>${escapeHtml(c.label)}</span><input type="date" data-filter-task="${t.id}" data-filter-key="${c.key}" value="${escapeHtml(a[c.key]??'')}"></label>`;
      if(c.type==='multiselect') { const vals=Array.isArray(a[c.key])?a[c.key]:[]; return `<fieldset class="filter-field filter-multi"><legend>${escapeHtml(c.label)}</legend>${c.options.map(o=>`<label><input type="checkbox" data-filter-task="${t.id}" data-filter-key="${c.key}" value="${escapeHtml(o)}" ${vals.includes(o)?'checked':''}> ${escapeHtml(o)}</label>`).join('')}</fieldset>`; }
      return '';
    }).join('');
    return `<div class="filter-lab"><div class="filter-controls">${controls}</div><div class="filter-status" id="filter-status-${t.id}">Filter werden geladen …</div><div class="table-scroll filter-table" id="filter-table-${t.id}"></div><div class="task-actions"><button class="btn small primary" data-check-filter="${t.id}">✓ Filter prüfen</button><button class="btn small" data-reset-filter="${t.id}">Filter zurücksetzen</button></div></div>`;
  }
  function getFilterRows(t){
    if(!SQL) return {columns:[],rows:[]}; const d=freshDb();
    try{const q=`SELECT ${t.filterSpec.columns.join(', ')} FROM ${t.filterSpec.table} ORDER BY ${t.filterSpec.idField};`;const r=d.exec(q)[0];return {columns:r?.columns||[],rows:r?.values||[]};} finally{d.close();}
  }
  function filteredRows(t){
    const {columns,rows}=getFilterRows(t); const a=progress.answers?.[t.id]&&typeof progress.answers[t.id]==='object'?progress.answers[t.id]:{};
    const objs=rows.map(row=>Object.fromEntries(columns.map((c,i)=>[c,row[i]])));
    const out=objs.filter(obj=>t.filterSpec.controls.every(c=>{
      const v=a[c.key]; if(c.type==='multiselect'){if(!Array.isArray(v)||!v.length)return true;return v.map(String).includes(String(obj[c.column]));}
      if(v===undefined||v===null||v==='')return true; const left=obj[c.column]; const right=(c.type==='number')?Number(v):v;
      if(c.op==='=')return String(left)===String(right); if(c.op==='<')return Number(left)<Number(right); if(c.op==='<=')return Number(left)<=Number(right); if(c.op==='>=')return c.type==='date'?String(left)>=String(right):Number(left)>=Number(right); if(c.op==='>')return Number(left)>Number(right); return true;
    })); return {columns,rows:out.map(o=>columns.map(c=>o[c])),ids:out.map(o=>Number(o[t.filterSpec.idField]))};
  }
  function refreshFilterTask(id){
    const t=taskMap[id]; if(!t||t.type!=='filter'||!SQL)return; const r=filteredRows(t); const box=$(`#filter-table-${id}`), status=$(`#filter-status-${id}`); if(!box||!status)return;
    status.innerHTML=`Aktuell <strong>${r.rows.length}</strong> Treffer`;
    box.innerHTML=`<table class="data-table"><thead><tr>${r.columns.map(c=>`<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${r.rows.map(row=>`<tr>${row.map(v=>`<td>${escapeHtml(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function refreshAllFilterTasks(){ C.tasks.filter(t=>t.type==='filter').forEach(t=>refreshFilterTask(t.id)); }
  function resetFilterTask(id){progress.answers[id]={};saveLocal();renderCurrent();}
  function checkFilterTask(id){const t=taskMap[id], r=filteredRows(t); const got=[...r.ids].sort((a,b)=>a-b), exp=[...t.filterSpec.expectedIds].sort((a,b)=>a-b); if(JSON.stringify(got)===JSON.stringify(exp)){completeTask(id);showFeedback(id,true,positive());}else showFeedback(id,false,`Noch nicht passend: Aktuell bleiben ${r.rows.length} Treffer übrig. Nutzen Sie die angekündigte Trefferzahl und prüfen Sie die Filterbedingungen.`);}
  function hydrateTaskState(){ updateChrome(); refreshAllFilterTasks(); }

  function handleMainClick(e){
    const view=e.target.closest('[data-view]')?.dataset.view; if(view){navigate(view);return;}
    if(e.target.closest('[data-open-lab]')){$('#labPanel').classList.add('open');return;}
    const er=e.target.closest('[data-table]'); if(er){$('#erInfo').innerHTML=erDetails[er.dataset.table]||''; return;}
    const sol=e.target.closest('[data-solution]'); if(sol){revealSolution(sol.dataset.solution);return;}
    const check=e.target.closest('[data-check]'); if(check){checkObjective(check.dataset.check);return;}
    const openTable=e.target.closest('[data-open-table]'); if(openTable){const n=openTable.dataset.openTable;$('#labSql').value=`SELECT *\nFROM ${n};`;$('#labPanel').classList.add('open');runLabSql();return;}
    const fcheck=e.target.closest('[data-check-filter]'); if(fcheck){checkFilterTask(fcheck.dataset.checkFilter);return;}
    const freset=e.target.closest('[data-reset-filter]'); if(freset){resetFilterTask(freset.dataset.resetFilter);return;}
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
    if(e.target.matches('[data-filter-task]')){const id=e.target.dataset.filterTask,key=e.target.dataset.filterKey;const a=progress.answers[id]&&typeof progress.answers[id]==='object'?progress.answers[id]:{};if(e.target.type==='checkbox'){a[key]=[...$$(`[data-filter-task="${id}"][data-filter-key="${key}"]:checked`)].map(x=>x.value);}else a[key]=e.target.value;progress.answers[id]=a;saveLocal();refreshFilterTask(id);}
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
    const chapterBadges={detective:'Daten-Detektiv',model:'Datenmodell-Scout',select:'SELECT-Starter',where:'Filter-Profi',order:'Sortier-Navigator',logic:'Logik-Tracker',change:'Data-Caretaker'};
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
