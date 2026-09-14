/* ═══════════════════════════════════════════════════════════════════════════
   LA VISITE DE L'ATELIER — Rudy et Koraly (14 septembre 2026)

   Mickaël : « le guide de l'atelier est un peu compliqué ; ma sœur ne comprenait
   pas. Faisons un guide dans le style de la visite de l'accueil : la voix parle,
   la lumière montre, et quand la voix dit "vas-y", on attend le geste. »

   Même esprit que visite.js (le hall), mais un moteur à part, plus simple, cousu
   sur l'atelier : quatorze arrêts, dans l'ordre de l'écran (en bas d'abord, puis
   en haut de gauche à droite). Chaque arrêt est une suite de SEGMENTS : un son
   (les deux voix en dialogue, fabriquées d'un bloc par ElevenLabs), une chose
   éclairée, et, entre deux segments, soit un geste ATTENDU de la personne (✋),
   soit un geste FAIT par la visite (🤖).

   Les fichiers : media/visite-atelier/NN-x.mp3 (NN = arrêt, x = segment).
   La réplique « à la place de … » de l'arrêt 9 existe en sept versions, une par
   prénom (jamais le sien) : 09-perso-<prenom>.mp3, 09-perso-sans.mp3.
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  if (window.VISITE_ATELIER) return;
  const CLE_VUE = 'boheme-atelier-visite-vue-1';
  const CLE_OU  = 'boheme-atelier-visite-ou-1';
  const DOSSIER = 'media/visite-atelier/';
  const VERSION = '14i';   /* à changer quand les sons changent : casse le cache */
  const EN_CHANTIER = true;   /* 14 septembre : le panneau « en chantier », à passer à false quand c'est fini */
  const VALIDES = ['adrien','stephanie','candice','mickael','bry','elie'];
  const apres = (f, ms) => setTimeout(f, ms);
  const $ = s => document.querySelector(s);

  /* ── qui écoute (pour la réplique personnelle) : les lunettes de la séance,
        sinon le prénom de l'accueil ────────────────────────────────────────── */
  function quiEcoute(){
    let q = '';
    try { q = (sessionStorage.getItem('boheme-atelier-pour') || '').toLowerCase(); } catch(e){}
    if (!VALIDES.includes(q)){ try { q = (localStorage.getItem('boheme-pour') || '').toLowerCase(); } catch(e){} }
    return VALIDES.includes(q) ? q : 'sans';
  }

  /* ── LES ARRÊTS ──────────────────────────────────────────────────────────
     vise : ce que la lumière montre (un sélecteur, ou une liste = l'union).
     attend : le geste attendu après le son ({sel, evt}) ; evt : 'click'
       (défaut), 'input' (la barre de lecture), 'long' (le doigt posé).
     avant / apres : un geste fait par la visite, avant ou après le son.
     pendant : [{part, vise|bleu}] — à telle fraction du son, la lumière bouge. */
  const ARRETS = [
    /* 10 h 45 — « le premier geste vite, les blagues après, pendant que ça joue » */
    { nom:'Bienvenue', garderLaLecture:true, seg:[ { son:'01-a', vise:'#lbPlay', attend:{ sel:'#lbPlay' } } ] },
    /* 12 h — calé sur les temps de la bande : « Paris 1978 » finit à 5,3 s,
       « Un opéra rock… Starmania » à 12,0 s */
    { nom:'La lecture', garderLaLecture:true, seg:[
        { son:'02-a', aTemps:5.4 },
        { son:'02-b', aTemps:12.2 },
        { son:'02-c', silence:5000, vise:'#lbPlay', attend:{ sel:'#lbPlay' } },
        { son:'02-d' } ] },
    { nom:'La barre de lecture', seg:[
        { son:'03-a', vise:'#lbBarre', attend:{ sel:'#lbBarre', evt:'input' } },
        { son:'03-b', vise:'#lbPlay', attend:{ sel:'#lbPlay' } },
        { son:'03-c' } ] },
    { nom:'Bloc précédent, bloc suivant', seg:[
        { son:'04-a', vise:'#lbSuiv', attend:{ sel:'#lbSuiv' } },
        { son:'04-b', vise:'#lbPrec', attend:{ sel:'#lbPrec' } },
        { son:'04-c' } ] },
    { nom:'Les phrases', seg:[
        { son:'05-a', vise:'.ligne:visible', attend:{ sel:'.ligne' } },
        { son:'05-b', vise:'.ligne:visible', attend:{ sel:'.ligne' } },
        { son:'05-c', vise:'.ligne:visible' } ] },
    { nom:'Aller à ton passage', seg:[
        { son:'06-a', vise:'.b-aller', attend:{ sel:'.b-aller' } },
        { son:'06-b', vise:'.b-aller' } ] },
    { nom:'Retour à l\'accueil', seg:[ { son:'07-a', vise:'#btnSite' } ] },
    { nom:'Les trois points', seg:[
        { son:'08-a', vise:'#btnPlus', attend:{ sel:'#btnPlus' } },
        { son:'08-b', vise:'#btnPresence', apres:'montrerLeVisage' },
        { son:'08-c', vise:'#btnPresence', pendant:[{ part:.62, vise:'#btnStyle' }] },
        { son:'08-d', vise:'#btnStyle', pendant:[{ part:.55, vise:'#btnTuto' }], apres:'fermerLeTiroir' } ] },
    { nom:'Le rond de couleur', seg:[
        { son:'09-a', vise:'#btnQui' },
        { son:'09-perso', vise:'#btnQui' },
        { son:'09-b', vise:'#btnQui' } ] },
    { nom:'Blocs', seg:[
        { son:'10-a', vise:'#btnBlocs', attend:{ sel:'#btnBlocs' } },
        { son:'10-b', vise:'#menuB', attend:{ sel:'#menuB a' } },
        { son:'10-c', vise:'#btnBlocs' } ] },
    { nom:'Ton aide', seg:[
        { son:'11-a', vise:'#btnAide', pendant:[{ part:.28, vise:'#bandeau' }, { part:.88, vise:'#btnAide' }], attend:{ sel:'#btnAide' } },
        { son:'11-b', vise:['#btnAide', '.b-aller'], attend:{ sel:'#btnAide' } },
        { son:'11-c', vise:'#btnAide' } ] },
    { nom:'La bande', seg:[
        { son:'12-a', vise:'#btnBande', avant:'lancerLaLecture', attend:{ sel:'#btnBande' } },
        { son:'12-b', vise:'#btnBande', pendant:[{ part:.5, bleu:'.ligne.q-off', vise:'.ligne.q-off:visible' }] } ] },
    { nom:'Le doigt posé', seg:[
        { son:'13-a', vise:'#btnBlocs', attend:{ sel:'#btnBlocs', evt:'long' } },
        { son:'13-b', vise:'#btnBlocs' } ] },
    { nom:'La fin', seg:[ { son:'14-a' } ] },
  ];

  /* ── les gestes que la visite fait elle-même ─────────────────────────── */
  const GESTES = {
    /* le visage : on le fait venir (toute la scène se dévoile), on l'éteint
       (il disparaît), on le rallume. Un appui sur un bouton du tiroir referme
       le tiroir : on le rouvre à chaque fois. */
    montrerLeVisage(){
      const b = $('#btnPresence'); if (!b) return Promise.resolve();
      const rouvrir = () => apres(() => document.body.classList.add('tiroirOuvert'), 200);
      const allume = () => b.classList.contains('allume');
      return new Promise(r => {
        devoiler(true);
        if (!allume()){ b.click(); rouvrir(); }
        apres(() => { try { window.presence && window.presence.maintenant(); } catch(e){} }, 300);
        apres(() => { b.click(); rouvrir(); }, 3200);                 /* éteint : il disparaît */
        apres(() => { b.click(); rouvrir(); apres(() => { try { window.presence && window.presence.maintenant(); } catch(e){} }, 300); }, 5200);   /* rallumé */
        apres(() => { devoiler(false); r(); }, 7600);
      });
    },
    lancerLaLecture(){ lancerLaLecture(); return new Promise(r => apres(r, 800)); },
    arreterLaLecture(){ arreterLaLecture(); return Promise.resolve(); },
    fermerLeTiroir(){ document.body.classList.remove('tiroirOuvert'); return new Promise(r => apres(r, 500)); },
    ouvrirLeTiroir(){ document.body.classList.add('tiroirOuvert'); return new Promise(r => apres(r, 500)); },
  };

  /* ── la mise en place : voile, trou de lumière, bande du haut, cartes ──── */
  const st = document.createElement('style');
  st.textContent = `
    /* pendant la visite, la bande du haut pousse la barre de l'atelier (et ce qui
       s'y accroche : le bandeau, le tiroir) vers le bas, pour ne rien cacher */
    :root{ --vaH: calc(58px + env(safe-area-inset-top)); }
    body.enVisiteAtelier .barre{ top: var(--vaH) !important; }
    body.enVisiteAtelier #bandeau{ top: calc(var(--h-barre, 0px) + var(--vaH)) !important; }
    body.enVisiteAtelier .tiroir{ top: calc(62px + env(safe-area-inset-top) + var(--vaH)) !important; }
    /* 14 septembre, 10 h 20 — Mickaël : « je ne t'avais pas demandé du noir. Il
       faut qu'on voie l'atelier, que ça bouge. » Plus aucun voile sombre : l'atelier
       reste entièrement visible ; la chose montrée est cerclée d'or lumineux. Le
       voile transparent ne sert qu'à retenir les appuis pendant que la voix parle. */
    #vaVoile{ position:fixed; inset:0; z-index:150; background:transparent; opacity:0; pointer-events:none; }
    body.enVisiteAtelier #vaVoile{ opacity:1; pointer-events:auto; }
    body.enVisiteAtelier.vaAttend #vaVoile{ pointer-events:none; }
    /* 11 h — Mickaël : « pourquoi des carrés ? illumine. » La lumière est posée
       sur l'OBJET lui-même, dans sa forme (rond pour un bouton rond, la ligne
       pour une phrase) : il s'éclaire, et respire quand on attend le geste. */
    #vaTrou{ display:none !important; }
    /* 11 h 20 — « je ne veux que de la lumière, pas de rond autour » : l'objet
       entier s'éclaire (plus clair, plus chaud, un halo doux qui déborde de sa
       forme), et respire quand on attend le geste. Aucun trait. */
    .vaLumiere{ filter:brightness(1.7) saturate(1.3) drop-shadow(0 0 10px rgba(241,210,122,.95)) drop-shadow(0 0 26px rgba(241,210,122,.7)) !important;
      position:relative; z-index:152; }
    body.vaAttend .vaLumiere{ animation:vaPulse 1.1s ease-in-out infinite; }
    @keyframes vaPulse{ 0%,100%{ filter:brightness(1.4) saturate(1.2) drop-shadow(0 0 8px rgba(241,210,122,.8)) drop-shadow(0 0 18px rgba(241,210,122,.5)); }
                        50%{ filter:brightness(2) saturate(1.4) drop-shadow(0 0 14px rgba(255,235,160,1)) drop-shadow(0 0 40px rgba(241,210,122,.95)); } }
    /* la pause, d'un appui n'importe où */
    #vaPause{ position:fixed; left:50%; bottom:calc(env(safe-area-inset-bottom) + 96px); transform:translateX(-50%); z-index:158;
      padding:10px 18px; border-radius:999px; border:1px solid rgba(212,175,55,.6); background:rgba(8,7,6,.92); color:#f1d27a;
      font:600 .95rem system-ui; letter-spacing:.03em; display:none; pointer-events:none; }
    body.vaEnPause #vaPause{ display:block; }
    .vaBleu{ box-shadow:0 0 0 2px rgba(40,210,255,.9), 0 0 18px rgba(40,210,255,.6) !important; border-radius:8px; }
    #vaBarre{ position:fixed; z-index:153; left:0; right:0; top:0; display:flex; align-items:center; justify-content:space-between;
      height:var(--vaH); box-sizing:border-box; padding:env(safe-area-inset-top) 12px 0; background:rgba(8,7,6,.96); border-bottom:1px solid rgba(212,175,55,.85);
      opacity:0; pointer-events:none; transition:opacity .4s; transform:translateY(-100%); }
    body.enVisiteAtelier #vaBarre{ opacity:1; pointer-events:auto; transform:none; }
    #vaBarre button{ display:flex; align-items:center; gap:10px; border:0; background:none; padding:0; color:#f1d27a;
      font:600 1rem system-ui; letter-spacing:.03em; -webkit-tap-highlight-color:transparent; }
    #vaBarre button .x{ width:40px; height:40px; border-radius:50%; display:grid; place-items:center; border:1px solid rgba(212,175,55,.6);
      background:rgba(212,175,55,.08); font-size:18px; line-height:1; }
    #vaBarre .pause .x{ font-size:15px; }
    #vaBarre .titre{ color:#b9b2a0; font:400 .85rem system-ui; letter-spacing:.06em; text-transform:uppercase; }
    #vaBarre .tr{ display:grid; gap:3px; } #vaBarre .tr i{ display:block; width:14px; height:1.5px; background:#f1d27a; }
    .vaCarte{ position:fixed; inset:0; z-index:159; display:grid; place-items:center; background:rgba(4,4,4,.82); backdrop-filter:blur(10px); padding:8vw; }
    .vaCarte .vaBulle{ display:grid; gap:.7rem; text-align:center; max-width:22rem; background:rgba(12,11,10,.96);
      border:1px solid rgba(212,175,55,.4); border-radius:1.1rem; padding:1.4rem 1.3rem; box-shadow:0 20px 60px rgba(0,0,0,.7); }
    .vaCarte h3{ margin:0; color:#f1d27a; font:700 1.25rem system-ui; }
    .vaCarte p{ margin:0 0 .3rem; color:#e8e2d2; font:400 .98rem system-ui; line-height:1.5; }
    .vaCarte button{ padding:.9rem 1.1rem; border-radius:999px; cursor:pointer; border:1px solid rgba(212,175,55,.5); font:600 1rem system-ui; }
    .vaCarte .oui{ background:linear-gradient(180deg,#f4d97f,#c9a13a); color:#1a1408; }
    .vaCarte .non{ background:rgba(212,175,55,.08); color:#f1d27a; }
    #vaSommaire{ position:fixed; inset:0; z-index:205; background:#050505; overflow:auto; padding:calc(env(safe-area-inset-top) + 18px) 16px 110px; }
    #vaSommaire[hidden]{ display:none !important; }
    #vaSommaire h2{ color:#f1d27a; font:400 1.7rem Georgia, serif; text-align:center; margin:0 0 .3rem; letter-spacing:.04em; }
    #vaSommaire .sous{ color:#b9b2a0; text-align:center; font:400 .85rem system-ui; letter-spacing:.14em; text-transform:uppercase; margin:0 0 1.2rem; }
    #vaSommaire .liste{ display:grid; gap:8px; max-width:480px; margin:0 auto; }
    #vaSommaire .liste button{ display:flex; align-items:center; gap:14px; padding:10px 14px; border-radius:14px; border:1px solid rgba(212,175,55,.3);
      background:rgba(212,175,55,.06); color:#e8e2d2; font:500 1rem system-ui; text-align:left; -webkit-tap-highlight-color:transparent; }
    #vaSommaire .liste button .n{ width:34px; height:34px; border-radius:50%; display:grid; place-items:center; flex:none;
      border:1px solid #d4af37; color:#f1d27a; font:700 .95rem system-ui; background:rgba(8,7,6,.9); }
    #vaSommaire .liste button.vu .n{ background:#d4af37; color:#111; }
    #vaSommaire .bande{ position:fixed; left:0; right:0; bottom:0; display:flex; align-items:center; justify-content:space-between; gap:12px;
      padding:9px 14px calc(env(safe-area-inset-bottom) + 9px); background:rgba(8,7,6,.97); border-top:1px solid rgba(212,175,55,.85); }
    #vaSommaire .bande button{ display:flex; align-items:center; gap:12px; border:0; background:none; padding:0; color:#f1d27a; font:600 1.05rem system-ui; }
    #vaSommaire .bande button .x{ width:44px; height:44px; border-radius:50%; display:grid; place-items:center; border:1px solid rgba(212,175,55,.6); background:rgba(212,175,55,.08); font-size:20px; }
    #vaSommaire .bande .debut{ background:linear-gradient(180deg,#f4d97f,#c9a13a) !important; color:#1a1408 !important; padding:10px 18px !important; border-radius:999px !important; }
  `;
  document.head.appendChild(st);
  const el = (id, cls) => { const d = document.createElement('div'); d.id = id; if (cls) d.className = cls; document.body.appendChild(d); return d; };
  const voile = el('vaVoile'), trou = el('vaTrou');
  const barre = el('vaBarre');
  barre.innerHTML = '<button class="fermer" title="Quitter la visite"><span class="x">✕</span></button>'
    + '<span class="titre" id="vaTitre"></span>'
    + '<button class="pause" title="Pause"><span class="x">⏸</span></button>'
    + '<button class="menu" title="Sommaire"><span class="x"><span class="tr"><i></i><i></i><i></i></span></span></button>';

  /* ── la lumière ───────────────────────────────────────────────────────── */
  function visibles(sel){
    const pseudo = sel.endsWith(':visible'); const s = pseudo ? sel.slice(0, -8) : sel;
    let els = [...document.querySelectorAll(s)].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
    if (pseudo) els = els.filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && r.top >= 0 && r.bottom <= innerHeight; }).slice(0, 1);
    return els;
  }
  function eclairer(vise){
    derniereVise = vise;
    document.querySelectorAll('.vaBleu').forEach(e => e.classList.remove('vaBleu'));
    document.querySelectorAll('.vaLumiere').forEach(e => e.classList.remove('vaLumiere'));
    if (!vise) return;
    const sels = Array.isArray(vise) ? vise : [vise];
    sels.flatMap(visibles).forEach(e => e.classList.add('vaLumiere'));
  }
  /* lever le voile un instant (le visage se voit sur toute la scène), puis le remettre */
  let derniereVise = null;
  function devoiler(oui){
    if (oui){ document.querySelectorAll('.vaLumiere').forEach(e => e.classList.remove('vaLumiere')); }
    else eclairer(derniereVise);
  }
  function bleuir(sel){ document.querySelectorAll('.vaBleu').forEach(e => e.classList.remove('vaBleu')); if (sel) visibles(sel).forEach(e => e.classList.add('vaBleu')); }

  /* ── les sons : la voix, la musique de fond, l'atelier baissé ─────────── */
  const son = document.createElement('audio'); son.preload = 'auto';
  const fond = document.createElement('audio'); fond.loop = true; fond.preload = 'auto'; fond.src = DOSSIER + 'fond-mediterranean-dusk.mp3';
  const VOLUME_FOND = 0.06;   /* « vraiment très, très douce » : −24 dB environ */
  /* 11 h 10 — Mickaël : « quand ils parlent, la musique très doucement ; quand
     ils se taisent pour laisser écouter, on l'entend ; et à la fin de l'arrêt,
     elle s'arrête toute seule. » */
  const BAS = 0.12;
  let volumesGardes = null;
  const bandes = () => [...document.querySelectorAll('audio'), window.__auI].filter(a => a && a !== son && a !== fond);
  function baisserLAtelier(){
    if (!volumesGardes) volumesGardes = bandes().map(a => [a, a.volume]);
    bandes().forEach(a => { try { a.volume = Math.min(a.volume, BAS); } catch(e){} });
  }
  function laisserEcouter(){ (volumesGardes || bandes().map(a => [a, 1])).forEach(([a, v]) => { try { fondu(a, v, 600); } catch(e){} }); }
  function rendreLAtelier(){ if (!volumesGardes) return; volumesGardes.forEach(([a, v]) => { try { a.volume = v; } catch(e){} }); volumesGardes = null; }
  function arreterLaLecture(){ bandes().forEach(a => { try { if (!a.paused) a.pause(); } catch(e){} }); }
  function lancerLaLecture(){ const b = $('#lbPlay'); const au = $('#au'); if (b && au && au.paused) b.click(); }
  function fondu(a, vers, ms){
    const de = a.volume, t0 = performance.now();
    const pas = now => { const k = Math.min(1, (now - t0) / ms); a.volume = Math.min(1, Math.max(0, de + (vers - de) * k)); if (k < 1) requestAnimationFrame(pas); else if (vers === 0) a.pause(); };
    requestAnimationFrame(pas);
  }

  /* ── l'état ───────────────────────────────────────────────────────────── */
  let ici = -1, fil = 0, arrete = true, enPause = false, attente = null, depuisSommaire = false;
  const NOMS = { adrien:'Adrien', stephanie:'Stéphanie', candice:'Candice', mickael:'Mickaël', bry:'Bry', elie:'Élie' };

  function cheminDuSon(nom){
    if (nom === '09-perso') nom = '09-perso-' + quiEcoute();
    return DOSSIER + nom + '.mp3?v=' + VERSION;
  }

  /* attendre que la bande de l'atelier atteigne un temps (au plein volume) ; si elle
     ne joue pas, on n'attend pas plus de 15 s */
  function attendreLaBande(t, monFil){
    return new Promise(resolve => {
      const au = $('#au'); const t0 = Date.now();
      const tic = () => {
        if (monFil !== fil || arrete) return resolve();
        if (!au || au.currentTime >= t || Date.now() - t0 > 15000) return resolve();
        apres(tic, 80);
      };
      tic();
    });
  }
  /* ── le geste attendu : on éclaire en pulsant, et on laisse passer le doigt ── */
  function attendreLeGeste(a, monFil){
    return new Promise(resolve => {
      document.body.classList.add('vaAttend');
      const relance = apres(() => { if (monFil === fil && !arrete && !enPause){ try { const r = new Audio(DOSSIER + 'relance.mp3?v=' + VERSION); r.play().catch(() => {}); } catch(e){} } }, 25000);
      const fini = () => {
        clearTimeout(relance);
        if (monFil !== fil) return;
        document.body.classList.remove('vaAttend');
        document.removeEventListener('click', surClic, true);
        document.removeEventListener('input', surInput, true);
        document.removeEventListener('change', surInput, true);
        document.removeEventListener('boheme-appui-long', surLong);
        attente = null; apres(resolve, 700);
      };
      const surClic  = e => { if (a.evt && a.evt !== 'click') return; if (e.target.closest && e.target.closest(a.sel)) fini(); };
      const surInput = e => { if (a.evt !== 'input') return; if (e.target.closest && e.target.closest(a.sel)) fini(); };
      const surLong  = () => { if (a.evt === 'long') fini(); };
      document.addEventListener('click', surClic, true);
      document.addEventListener('input', surInput, true);
      document.addEventListener('change', surInput, true);
      document.addEventListener('boheme-appui-long', surLong);
      attente = fini;
    });
  }

  /* ── jouer un arrêt, segment après segment ───────────────────────────── */
  async function jouer(k, monFil){
    if (arrete || monFil !== fil) return;
    if (k >= ARRETS.length) return finir(true);
    ici = k; marquer();
    try { localStorage.setItem(CLE_OU, JSON.stringify({ k, quand: Date.now() })); } catch(e){}
    const a = ARRETS[k];
    $('#vaTitre').textContent = (EN_CHANTIER ? '🚧 ' : '') + (k + 1) + ' · ' + a.nom;
    for (const s of a.seg){
      if (arrete || monFil !== fil) return;
      if (s.avant && GESTES[s.avant]) await GESTES[s.avant]();
      eclairer(s.attend ? null : (s.vise || null));   /* avec un geste attendu : la lumière vient au « vas-y » */
      if (s.silence){ laisserEcouter(); await new Promise(r => apres(r, s.silence)); }   /* on laisse écouter */
      if (s.aTemps){ laisserEcouter(); await attendreLaBande(s.aTemps, monFil); }
      if (arrete || monFil !== fil) return;
      baisserLAtelier();
      await direLeSon(s, monFil);
      if (arrete || monFil !== fil) return;
      if (s.attend){ eclairer(s.vise || null); await attendreLeGeste(s.attend, monFil); }
      if (arrete || monFil !== fil) return;
      if (s.apres && GESTES[s.apres]) await GESTES[s.apres]();
    }
    if (arrete || monFil !== fil) return;
    if (!a.garderLaLecture) arreterLaLecture();   /* la musique ne continue jamais dans le vide */
    apres(() => jouer(k + 1, monFil), 500);
  }
  function direLeSon(s, monFil){
    return new Promise(resolve => {
      let passe = false; const fini = () => { if (passe) return; passe = true; resolve(); };
      son.onended = fini; son.onerror = () => apres(fini, 800);
      const minuteries = [];
      (s.pendant || []).forEach(g => {
        const poser = () => { if (!son.duration) return; minuteries.push(apres(() => {
          if (monFil !== fil || arrete || enPause) return;
          if (g.vise !== undefined) eclairer(g.vise);
          if (g.bleu !== undefined) bleuir(g.bleu);
        }, Math.round(son.duration * g.part * 1000))); };
        if (son.duration && son.src.indexOf(cheminDuSon(s.son)) >= 0) poser();
        else son.addEventListener('loadedmetadata', poser, { once: true });
      });
      son.src = cheminDuSon(s.son);
      son.play().catch(() => apres(fini, 1500));
    });
  }

  /* ── pause quand on quitte l'application ─────────────────────────────── */
  let sorti = false;
  addEventListener('visibilitychange', () => {
    if (arrete) return;
    if (document.visibilityState === 'hidden'){ sorti = !son.paused; try { son.pause(); fond.pause(); } catch(e){} }
    else if (sorti){ sorti = false; apres(() => { if (!arrete){ son.play().catch(() => {}); fond.play().catch(() => {}); } }, 600); }
  });

  /* ── le sommaire ─────────────────────────────────────────────────────── */
  const sommaire = el('vaSommaire'); sommaire.hidden = true;
  function marquer(){
    sommaire.querySelectorAll('.liste button').forEach((b, i) => b.classList.toggle('vu', i < ici || (i === ici)));
  }
  function construireLeSommaire(){
    sommaire.innerHTML = '<h2>La visite de l\'atelier</h2><p class="sous">Rudy et Koraly · quatorze arrêts</p><div class="liste"></div>'
      + '<div class="bande"><button class="fermer"><span class="x">✕</span></button><button class="debut">▶ Depuis le début</button>'
      + '<button class="menu"><span class="x"><span class="tr" style="display:grid;gap:3px"><i style="display:block;width:14px;height:1.5px;background:#f1d27a"></i><i style="display:block;width:14px;height:1.5px;background:#f1d27a"></i><i style="display:block;width:14px;height:1.5px;background:#f1d27a"></i></span></span></button></div>';
    const liste = sommaire.querySelector('.liste');
    ARRETS.forEach((a, i) => {
      const b = document.createElement('button'); b.innerHTML = '<span class="n">' + (i + 1) + '</span><span>' + a.nom + '</span>';
      b.addEventListener('click', () => { sommaire.hidden = true; depuisSommaire = true; lancer(i); });
      liste.appendChild(b);
    });
    sommaire.querySelector('.fermer').addEventListener('click', () => { sommaire.hidden = true; });
    sommaire.querySelector('.menu').addEventListener('click', () => { sommaire.hidden = true; });
    sommaire.querySelector('.debut').addEventListener('click', () => { sommaire.hidden = true; depuisSommaire = true; lancer(0); });
  }
  construireLeSommaire();

  /* ── départ, arrêt, fin ──────────────────────────────────────────────── */
  let placeGardee = null;
  function remettreLAtelierAuDebut(){
    try {
      const au = $('#au'); if (!au) return;
      if (placeGardee === null) placeGardee = au.currentTime || 0;
      try { au.pause(); } catch(e){}
      if (typeof allerBloc === 'function'){ allerBloc(0); try { au.pause(); } catch(e){} }
      else au.currentTime = 0;
    } catch(e){}
  }
  function rendreSaPlace(){
    try {
      const au = $('#au');
      if (au && placeGardee !== null && placeGardee > 2){ au.currentTime = placeGardee; try { if (typeof reprendre === 'function') reprendre(); } catch(e){} }
    } catch(e){}
    placeGardee = null;
  }
  function lancer(k){
    k = k || 0;
    arrete = false; fil++; const monFil = fil;
    /* 11 h 20 — « à partir du moment où l'on entre dans le guide, ça revient au
       début ; et à la fin, on retrouve l'endroit où on travaillait » */
    if (k === 0) remettreLAtelierAuDebut();
    document.body.classList.add('enVisiteAtelier');
    document.body.classList.remove('tiroirOuvert');
    try { const bc = $('#bienvenueCarte'); if (bc) bc.classList.remove('la'); } catch(e){}
    try { $('#menuB') && $('#menuB').classList.remove('vu'); } catch(e){}
    baisserLAtelier();
    fond.volume = 0; fond.currentTime = 0; fond.play().then(() => fondu(fond, VOLUME_FOND, 2500)).catch(() => {});
    try { if ('wakeLock' in navigator) navigator.wakeLock.request('screen').catch(() => {}); } catch(e){}
    jouer(k, monFil);
  }
  function finir(complete){
    arrete = true; fil++;
    document.body.classList.remove('enVisiteAtelier', 'vaAttend', 'vaEnPause'); enPause = false;
    try { son.pause(); } catch(e){}
    arreterLaLecture();
    rendreSaPlace();
    fondu(fond, 0, 1200);
    eclairer(null); bleuir(null);
    rendreLAtelier();
    if (attente) attente = null;
    /* quitter soi-même (✕, sommaire) = pas de reprise proposée ; la reprise ne
       sert que si le téléphone a coupé la visite (un appel, une page fermée) */
    try { localStorage.removeItem(CLE_OU); } catch(e){}
    if (complete){ try { localStorage.setItem(CLE_VUE, '1'); } catch(e){} }
    if (depuisSommaire){ depuisSommaire = false; sommaire.hidden = false; }
  }
  const pauseEtiquette = el('vaPause'); pauseEtiquette.textContent = '⏸ en pause · appuie pour reprendre';
  function basculerLaPause(){
    if (arrete) return;
    enPause = !enPause;
    document.body.classList.toggle('vaEnPause', enPause);
    if (enPause){ try { son.pause(); fond.pause(); } catch(e){} }
    else { son.play().catch(() => {}); fond.play().catch(() => {}); }
  }
  /* pendant que la voix parle, le voile transparent reçoit l'appui : pause / reprise */
  /* 12 h 30 — Mickaël : l'appui n'importe où « crée des interférences » : retiré ;
     la pause est un bouton ⏸ dans la bande du haut */
  voile.addEventListener('click', e => { e.stopPropagation(); });
  barre.querySelector('.pause').addEventListener('click', () => { basculerLaPause(); barre.querySelector('.pause .x').textContent = enPause ? '▶' : '⏸'; });
  barre.querySelector('.fermer').addEventListener('click', () => finir(false));
  barre.querySelector('.menu').addEventListener('click', () => { finir(false); sommaire.hidden = false; });

  /* la carte de départ : le son ne peut partir que d'un geste */
  function carteDeDepart(k, alors){
    const c = document.createElement('div'); c.className = 'vaCarte';
    const reprise = k > 0;
    c.innerHTML = '<div class="vaBulle"><h3>' + (reprise ? 'On reprend la visite ?' : 'La visite de l\'atelier') + '</h3>'
      + '<p>' + (reprise ? 'Tu t\'étais arrêté à l\'arrêt ' + (k + 1) + ' · ' + ARRETS[k].nom + '.' : 'Rudy et Koraly te montrent l\'atelier, bouton par bouton. Cinq minutes, et tu peux partir quand tu veux.') + '</p>'
      + (EN_CHANTIER ? '<p style="color:#ffc814;border:1px solid rgba(255,200,20,.5);border-radius:10px;padding:.5rem .7rem;font-size:.9rem">🚧 <b>En chantier.</b> Ce guide est en cours de fabrication : il peut être en désordre, ça ne casse rien.</p>' : '')
      + '<p>🎧 Monte le son.</p>'
      + '<button class="oui">' + (reprise ? 'Reprendre là' : 'Commencer') + '</button>'
      + (reprise ? '<button class="non">Depuis le début</button>' : '<button class="non">Plus tard</button>') + '</div>';
    document.body.appendChild(c);
    c.querySelector('.oui').addEventListener('click', () => { c.remove(); alors(k); });
    c.querySelector('.non').addEventListener('click', () => { c.remove(); if (reprise) alors(0); });
  }
  function ouIlEnEtait(){
    try { const o = JSON.parse(localStorage.getItem(CLE_OU) || 'null'); if (o && Date.now() - o.quand < 3 * 3600 * 1000) return o.k; } catch(e){}
    return 0;
  }

  window.VISITE_ATELIER = {
    /* depuis la carte « Oui, je fais le guide » ou le « ? » : on propose, puis on part */
    proposer(){ carteDeDepart(ouIlEnEtait(), k => lancer(k)); },
    sommaire(){ marquer(); sommaire.hidden = false; },
    lancer, finir, son, fond,
    vue(){ try { return localStorage.getItem(CLE_VUE) === '1'; } catch(e){ return false; } },
    ARRETS,
  };
})();
