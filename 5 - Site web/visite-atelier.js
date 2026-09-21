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
  const VERSION = '18b';   /* à changer quand les sons changent : casse le cache */
  const EN_CHANTIER = true;
  /* le mode TRAVAIL (chantier local, 14 h 45) : pause à la fin de chaque arrêt,
     Continuer / Rejouer / Sommaire, et reprise là où on s'était arrêté */
  const CHANTIER = location.hostname === 'localhost' || /medley-boheme-chantier/.test(location.pathname);   /* 19/09 : le chantier vit aussi sur GitHub, à part */
  const PAS_A_PAS = CHANTIER;
  /* 21/09 — diagnostic du chantier : au chargement, la composition de la barre part sur ntfy (chantier seulement) */
  if (CHANTIER && location.hostname !== 'localhost') setTimeout(() => { try {
    const rows = [...document.querySelectorAll('.barre > *')].filter(e => e.getBoundingClientRect().width > 0).map(e => { const cs = getComputedStyle(e, '::before'); const r = e.getBoundingClientRect(); return (e.id || e.className.toString().slice(0, 18)) + ':' + (cs.backgroundImage || 'none').replace(/.*\//, '').replace(/["')]/g, '') + '@' + Math.round(r.left) + ',' + Math.round(r.top) + ' o=' + getComputedStyle(e).order; });
    fetch('https://ntfy.sh/boheme-b2ebc8b427d107aa5d79', { method:'POST', mode:'no-cors', body: 'DIAG barre ' + innerWidth + 'x' + innerHeight + ' | ' + rows.join(' | ') });
  } catch(e){} }, 4000);
  /* et toutes les 5 s : si un disque ou une copie traîne hors visite, ou pendant la visite, on le dit (arrêt, segment, état) */
  if (CHANTIER && location.hostname !== 'localhost') setInterval(() => { try {
    const c = document.querySelectorAll('.vaCache').length, av = document.querySelectorAll('.vaAvant').length, pa = document.querySelectorAll('.vaParti').length;
    if (!c && !av && !pa) return;
    const info = 'DIAG prise c=' + c + ' avant=' + av + ' parti=' + pa + ' visite=' + document.body.classList.contains('enVisiteAtelier') + ' titre=' + ((document.getElementById('vaTitre') || {}).textContent || '') + ' son=' + (son.src || '').split('/').pop().split('?')[0] + ' t=' + son.currentTime.toFixed(1) + ' paused=' + son.paused + ' pos=' + [...document.querySelectorAll('.vaCache')].map(e => e.style.left + '/' + e.style.top).join(';');
    if (info !== window.__diagPrise){ window.__diagPrise = info; fetch('https://ntfy.sh/boheme-b2ebc8b427d107aa5d79', { method:'POST', mode:'no-cors', body: info }); }
  } catch(e){} }, 5000);   /* 14 septembre : le panneau « en chantier », à passer à false quand c'est fini */
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
    { nom:'La lecture', garderLaLecture:true, prepare:'lireDepuisLeDebut', seg:[
        { son:'02-a', aTemps:5.5, baisserA:0.4 },   /* « Trop génial » dans le creux du narrateur (5,3 → 9,0 s), musique à 40 % le temps du mot */
        { son:'02-b', aTemps:12.2 },
        /* 14 h — on laisse écouter jusqu'à la fin de « Il est minuit. Les zonards descendent sur la ville. » (28,5 s) */
        { son:'02-c', aTemps:28.8, vise:'#lbPlay', attend:{ sel:'#lbPlay' } },
        { son:'02-d' } ] },
    { nom:'La barre de lecture', garderLaLecture:true, seg:[   /* la lecture continue vers l'arrêt 4 */
        { son:'03-a', vise:'#lbBarre', attend:{ sel:'#lbBarre', evt:'input' } },
        { son:'03-b', vise:'#lbPlay', attend:{ sel:'#lbPlay' } },
        { son:'03-c', silence:1000, baisserA:0.38 },   /* 15 h 10 — une seconde de musique, puis « Waouh, tac ! » avec la musique à moitié */
        { son:'03-d', silence:3000, baisserA:0.38 } ] },   /* trois secondes de musique, puis Koraly, musique à moitié */
    /* 15/09 — la glissade devient un arrêt à part, pour y aller directement depuis le sommaire */
    { nom:'La glissade', garderLaLecture:true, prepare:'lancerLaLecture', seg:[
        { son:'04-a', vise:'#lbBarre', baisserA:0.12, garderBas:true, attend:{ sel:'#lbBarre', evt:'glisse', pendant:'04-b' } },   /* le secret : musique à 15 % */
        /* 03-gh : les deux fichiers montés ensemble, Rudy coupe la parole à Koraly ; Blocs s'illumine à « ce bouton », les flèches à la fin */
        /* « Tu vois ce bouton, en haut ? » : le bouton Blocs GROSSIT et s'illumine (zoom), puis revient */
        { son:'04-c', baisserA:0.12, fonduBas:true },
        { son:'04-d', silence:900, baisserA:0.12, pendant:[{ part:.22, zoom:'#btnBlocs', montre:true }, { part:.96, zoom:null }] },   /* Koraly MONTRE : le bloc reste à sa place */   /* « Tu vois ce bouton… » : il se détache et vient en grand */
        { son:'04-e', baisserA:0.3, vise:['#lbPrec', '#lbSuiv'] } ] },
    { nom:'Bloc précédent, bloc suivant', seg:[
        { son:'05-a', vise:'#lbSuiv', baisserA:0.3, attend:{ sel:'#lbSuiv' } },
        { son:'05-b', silence:3000, vise:'#lbPrec', attend:{ sel:'#lbPrec' } },   /* 3 s pour entendre le bloc suivant */
        { son:'05-c', silence:3500, baisserA:0.1 },                             /* 3,5 s pour entendre le bloc précédent, puis il chante */   /* 16 h 15 — Rudy chante (faux) : la bande baisse un peu, on l'entend chanter par-dessus */
        { son:'05-d', baisserA:0.08 } ] },   /* la dispute ; pendant « la suite… », le texte glisse vers la phrase de l'arrêt 6 */
    { nom:'Les phrases', seg:[
        /* 15/09 — la visite choisit elle-même une vraie phrase chantée, l'amène au milieu
           de l'écran, puis l'éclaire ; on ne dépend pas de ce qui est à l'écran */
        { son:'06-a', pendant:[{ part:.30, geste:'placerUnePhrase' }, { part:.62, vise:'[data-va-cible]' }], vise:'[data-va-cible]', attend:{ sel:'.ligne' } },   /* éclairée à « je t'en éclaire une », en blanc au « vas-y », éteinte à l'appui */
        { son:'06-b', attend:{ sel:'.ligne' } },   /* « celle que tu veux » : libre, rien n'est éclairé */   /* « essaie avec une autre : celle-ci » */
        { son:'06-c', apres:'effacerLaCible' } ] },   /* après l'appui : plus aucune lumière */
    { nom:"Aller à ton passage, et l'étoile", seg:[
        /* 15/09 — le bouton pris dans les doigts : il quitte la barre (disque noir), gigote au milieu jusqu'à « Voilà », puis revient */
        { son:'07-a', pendant:[{ part:.72, zoom:'.b-aller', gigote:true }] },   /* « je te déplace le bouton… » */
        { son:'07-b', garderZoom:true },                                          /* il gigote pendant tout ça */
        { son:'07-c', avant:'reposer' },                                          /* « Voilà » : il revient */
        { son:'07-d', vise:'.b-aller', attend:{ sel:'.b-aller' } },                /* « Vas-y, appuie dessus » */
        { son:'07-e', pendant:[{ part:.30, vise:'#bandeau' }, { part:.92, geste:'sEloigner' }] },   /* « regarde le bandeau » ; « je nous emmène plus loin » : la lecture saute 4 blocs */
        { son:'07-f', pendant:[{ part:.12, vise:'.b-aller' }, { part:.55, vise:null }, { part:.86, zoom:'#btnAide', gigote:true }] },   /* « il est revenu » : ⏩ s'illumine ; « je te la prends aussi » : l'étoile part */
        { son:'07-g', garderZoom:true },
        { son:'07-h', avant:'reposer' },                                          /* « Bon » : l'étoile revient */
        { son:'07-i', vise:'#btnAide', attend:{ sel:'#btnAide' } },                /* « Appuie dessus, tu vas voir » */
        { son:'07-j', vise:'#btnAide', attend:{ sel:'#btnAide' } },                /* « Rallume-la, s'il te plaît » */
        { son:'07-k' } ] },
    /* 15/09, le faux accueil — Rudy appuie sur ↩ « juste pour voir » : l'accueil
       apparaît (une vidéo de 30 s, les deux en dessin animé, avec la vraie barre
       du bas devant), ils se disputent, sautent dans ATELIER à 28 s, et on revient. */
    { nom:'Retour à l\'accueil', seg:[
        { son:'08-a', pendant:[{ part:.48, vise:'#btnSite' }] },                   /* « je te l'allume » : ↩ s'éclaire */
        { son:'08-b', vise:'#btnSite', pendant:[{ part:.88, geste:'appuyerSurRetour' }], apres:'fauxAccueil' },   /* « NON ! » : clic (le bruit), ↩ enfoncé net, trop tard */
        { son:'08-c' } ] },
    /* 16/09 — réécrit : Rudy touche, Koraly explique, une phrase chacun ; la petite
       télé d'Élie (14 s) ; un seul geste demandé, refermer le tiroir. */
    { nom:'Les trois points', prepare:'eteindreLeVisage', seg:[
        { son:'09-a', vise:'#btnPlus', pendant:[{ part:.87, zoom:'#btnPlus', gigote:true }] },   /* « je regarde ! » : ⋯ part dans ses doigts, gigote */
        { son:'09-b', garderZoom:true, pendant:[{ part:.70, zoom:null }] },                     /* « Rudy ! Non ! Repose ça… » ; « Oh, ça va, hein… » : il le repose en parlant */
        { son:'09-c' },                                                                         /* « Ah bah bravo. Et maintenant il boude » … « Mmh » */
        { son:'09-perso', vise:'#btnPlus', attend:{ sel:'#btnPlus' } },                         /* « Alors <prénom>, profites-en : vas-y, appuie » */
        { son:'09-d', pendant:[{ part:.05, vise:'#btnPresence' }, { part:.5, vise:null }], apres:'tele' },   /* « Ouf. OK : trois petites choses. Le visage… Regarde » : la télé */
        { son:'09-e' },                                                                         /* « flippante »… « Regarde plutôt » */
        { son:'09-perso2', vise:'#btnPresence', attend:{ sel:'#btnPresence' }, apres:'visageVenu' },   /* « Tiens, appuie dessus, <prénom>, vas-y » : la personne allume, il apparaît en grand */
        { son:'09-perso3' },                                                                    /* 0 → 3 s : elle fixe. Rudy : « <prénom>, ce truc me regarde ! » */
        { son:'09-f', avant:'visageDort' },                                                     /* 3 → 6 s : elle ferme les yeux, la vidéo s'arrête sur les yeux fermés. « Ah… elle ferme les yeux. Ouf. » / « un visage qui dort » */
        { son:'09-perso4', avant:'visageRouvre' },                                              /* 6 → 10 s : elle rouvre, avance, sourit. « Elle les a rouverts ! Elle avance ! Elle sourit ! » */
        { son:'09-perso5', vise:'#btnPresence', attend:{ sel:'#btnPresence' }, apres:'visageParti' },   /* « Éteins-le, <prénom>, appuie encore une fois » : la personne éteint */
        { son:'09-g', pendant:[{ part:.85, vise:'#btnStyle' }] },                               /* « Voilà. Et lui, il respire. Bon. Le style. » */
        { son:'09-h', vise:'#btnStyle' },                                                       /* Rudy : « toute une philosophie, parce que le style, vois-tu… » */
        { son:'09-i', vise:'#btnStyle' },                                                       /* Koraly le coupe : « Néon, ou or… » */
        { son:'09-j', pendant:[{ part:.0, vise:'#btnTuto' }], vise:'#btnPlus', attend:{ sel:'#btnPlus' } },   /* le guide ; « referme-le, vas-y » */
        { son:'09-k' } ] },
    { nom:'Le rond de couleur', seg:[
        { son:'10-a', vise:'#btnQui' },
        { son:'10-perso', vise:'#btnQui' },
        { son:'10-b', vise:'#btnQui' } ] },
    { nom:'Blocs', seg:[
        { son:'11-a', vise:'#btnBlocs', attend:{ sel:'#btnBlocs' } },
        { son:'11-b', vise:'#menuB', attend:{ sel:'#menuB a' } },
        { son:'11-c', vise:'#btnBlocs' } ] },
    { nom:'La bande', seg:[
        { son:'13-a', vise:'#btnBande', avant:'lancerLaLecture', attend:{ sel:'#btnBande' } },
        { son:'13-b', vise:'#btnBande', pendant:[{ part:.5, bleu:'.ligne.q-off', vise:'.ligne.q-off:visible' }] } ] },
    { nom:'Le doigt posé', seg:[
        { son:'14-a', vise:'#btnBlocs', attend:{ sel:'#btnBlocs', evt:'long' } },
        { son:'14-b', vise:'#btnBlocs' } ] },
    { nom:'La fin', seg:[ { son:'15-a' } ] },
  ];

  /* la hauteur de la ligne vivante pendant la visite : 62 % de la scène (sous le bandeau) */
  const HAUTEUR = 0.62;
  function poserAHauteur(el){
    const scene = document.querySelector('.scene'); if (!scene || !el) return;
    try { scene.scrollTo({ top: Math.max(0, el.offsetTop - scene.clientHeight * HAUTEUR), behavior: 'smooth' }); } catch(e){ scene.scrollTop = el.offsetTop - scene.clientHeight * HAUTEUR; }
  }
  /* la phrase chantée la plus proche de cette hauteur, à l'écran */
  function phraseAHauteur(){
    const scene = document.querySelector('.scene'); if (!scene) return null;
    const y = scene.getBoundingClientRect().top + scene.clientHeight * HAUTEUR;
    let meilleur = null, d = 1e9;
    document.querySelectorAll('.ligne').forEach(l => {
      if (l.classList.contains('q-off')) return;
      const r = l.getBoundingClientRect(); if (!r.height) return;
      const dd = Math.abs((r.top + r.height / 2) - y); if (dd < d){ d = dd; meilleur = l; }
    });
    return d < 220 ? meilleur : null;
  }
  /* ── les gestes que la visite fait elle-même ─────────────────────────── */
  /* le faux accueil : la vidéo plein écran, la vraie barre du bas par-dessus */
  function fauxAccueil(){
    return new Promise(resolve => {
      arreterLaLecture(); try { fond.pause(); } catch(e){}
      const f = document.createElement('div'); f.id = 'vaFaux';
      /* 15/09, 23 h — Mickaël : aucune barre par-dessus (la vidéo a la sienne), la vidéo
         un tout petit peu assombrie « comme si on était vraiment dedans », le petit
         point vert du haut de l'écran, et « L'ère des talents » (la musique du hall) dessous. */
      f.innerHTML = '<video playsinline preload="auto" src="' + DOSSIER + 'faux-accueil.mp4?v=16t"></video><div class="vaVert"></div>';
      document.body.appendChild(f);
      const v = f.querySelector('video'); let fini = false;
      const hall = document.createElement('audio'); hall.src = 'media/site/air-sing-boheme.mp3'; hall.loop = true; hall.volume = 0.09;   /* « qu'on l'entende, mais plus bas » */ hall.id = 'vaHall'; f.appendChild(hall);
      const sortir = () => { if (fini) return; fini = true; f.classList.add('vaFin'); fondu(hall, 0, 500); apres(() => { f.remove(); $('#btnSite') && $('#btnSite').classList.remove('vaAppuye'); resolve(); }, 500); };
      v.addEventListener('playing', () => { hall.play().catch(() => {}); }, { once: true });
      v.addEventListener('ended', sortir); v.addEventListener('error', sortir);
      requestAnimationFrame(() => f.classList.add('vaLa'));
      v.play().catch(() => apres(sortir, 1500));
      apres(sortir, 34000);   /* garde-fou */
    });
  }
  /* la petite télé 16/9 au milieu de l'écran : l'extrait d'Élie, avec le son */
  function tele(){
    return new Promise(resolve => {
      const t = document.createElement('div'); t.id = 'vaTele';
      t.innerHTML = '<video playsinline preload="auto" src="' + DOSSIER + 'tele-elie.mp4"></video>';
      document.body.appendChild(t);
      const v = t.querySelector('video'); let fini = false;
      const sortir = () => { if (fini) return; fini = true; t.classList.remove('vaLa'); apres(() => { t.remove(); resolve(); }, 600); };
      v.addEventListener('ended', sortir); v.addEventListener('error', sortir);
      requestAnimationFrame(() => t.classList.add('vaLa'));
      v.play().catch(() => apres(sortir, 1500));
      apres(sortir, 18000);
    });
  }
  let telePromesse = null;
  const GESTES = {
    tele,
    /* 18/09 — Mickaël : « par défaut, le visage est éteint ; c'est seulement quand on
       appuie qu'on le voit ». Quoi que la personne ait choisi avant, l'arrêt 9
       commence visage ÉTEINT (bouton barré), et c'est elle qui l'allumera. */
    eteindreLeVisage(){ const b = $('#btnPresence'); if (b && b.classList.contains('allume')) b.click(); document.body.classList.remove('tiroirOuvert'); return new Promise(r => apres(r, 300)); },
    teleDebut(){ telePromesse = tele(); return Promise.resolve(); },
    teleFin(){ const t = telePromesse || Promise.resolve(); telePromesse = null; return t; },
    /* la personne vient d'allumer le visage : on le laisse venir (la scène se dévoile), et le tiroir reste ouvert */
    /* 18/09 — LE VISAGE QUI FAIT PEUR : la vidéo Kling « visage-flippant » (10 s), en grand
       au milieu ; le dialogue est calé sur elle, et c'est la visite qui la fait avancer :
       0 → 3 s elle fixe ; 3 → 6 s elle ferme les yeux (on la fige là) ; 6 → 10 s elle
       rouvre les yeux, avance et sourit (on la laisse finir et on garde la dernière image). */
    visageVenu(){
      devoiler(true); apres(() => document.body.classList.add('tiroirOuvert'), 200);
      try { window.presence && window.presence.arreter(); } catch(e){}   /* pas de visage au hasard en plus */
      const v = document.createElement('video'); v.id = 'vaVisage'; v.playsInline = true; v.muted = true; v.preload = 'auto';
      v.src = DOSSIER + 'visage-flippant.mp4';
      document.body.appendChild(v);
      v.addEventListener('timeupdate', () => { if (v.dataset.stop && v.currentTime >= +v.dataset.stop) v.pause(); });
      v.dataset.stop = '6.0';
      requestAnimationFrame(() => v.classList.add('vaLa'));
      v.play().catch(() => {});
      return new Promise(r => apres(r, 600));
    },
    visageDort(){ const v = $('#vaVisage'); if (v){ v.dataset.stop = '6.0'; if (v.paused && v.currentTime < 6) v.play().catch(() => {}); } return Promise.resolve(); },
    visageRouvre(){ const v = $('#vaVisage'); if (v){ v.dataset.stop = ''; if (v.currentTime < 6) v.currentTime = 6; v.play().catch(() => {}); } return Promise.resolve(); },
    /* la personne vient d'éteindre le visage : la vidéo s'efface, on rouvre le tiroir */
    visageParti(){ const v = $('#vaVisage'); if (v){ v.classList.remove('vaLa'); apres(() => v.remove(), 600); }
      apres(() => document.body.classList.add('tiroirOuvert'), 200); return new Promise(r => apres(r, 900)); },
    prendreLesPoints(){ zoomer('#btnPlus', true); return new Promise(r => apres(r, 350)); },
    appuyerSurRetour(){ const b = $('#btnSite'); if (b){ b.classList.add('vaAppuye'); } clic.currentTime = 0; clic.play().catch(() => {}); return Promise.resolve(); },
    fauxAccueil,
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
    /* si on arrive à cet arrêt sans que la lecture tourne depuis le début (par le
       sommaire, par exemple), on la relance nous-mêmes à zéro */
    lireDepuisLeDebut(){
      const au = $('#au'); if (!au) return Promise.resolve();
      if (au.paused){
        try { if (typeof allerBloc === 'function') allerBloc(0); else { au.currentTime = 0; au.play().catch(() => {}); } } catch(e){}
        return new Promise(r => apres(r, 600));
      }
      return Promise.resolve();
    },
    arreterLaLecture(){ arreterLaLecture(); return Promise.resolve(); },
    placerUnePhrase(){
      document.querySelectorAll('[data-va-cible]').forEach(e => e.removeAttribute('data-va-cible'));
      const lignes = [...document.querySelectorAll('.ligne')].filter(l => !l.classList.contains('q-off') && (l.textContent || '').trim().length > 18);
      if (!lignes.length) return Promise.resolve();
      /* 15/09 — Mickaël : toujours la même phrase, « C'est l'heure où les zonards
         descendent sur la ville » (Adrien) ; sinon la première chantée après ici */
      /* le texte affiché est découpé en syllabes doublées : on cherche dans les données de
         l'atelier (LIGNES[i].d.texte), pas dans l'affichage */
      /* chaque mot est un <span class="mot"> dont le premier texte est le vrai mot */
      const texteDe = l => [...l.querySelectorAll('.mot')].map(m => (m.firstChild && m.firstChild.nodeType === 3) ? m.firstChild.textContent : '').join('').replace(/[\s\-]+/g, ' ').toLowerCase();
      let c = lignes.find(l => texteDe(l).includes('banlieues dortoir'));
      if (!c){ const y = innerHeight / 2; c = lignes.find(l => l.getBoundingClientRect().top > y) || lignes[0]; }
      c.setAttribute('data-va-cible', '1');
      poserAHauteur(c);
      return new Promise(r => apres(r, 900));
    },
    /* la phrase suivante (chantée) après la cible, pour le second appui */
    effacerLaCible(){ document.querySelectorAll('[data-va-cible]').forEach(e => e.removeAttribute('data-va-cible')); return Promise.resolve(); },
    placerLaSuivante(){
      const c = document.querySelector('[data-va-cible]');
      const lignes = [...document.querySelectorAll('.ligne')].filter(l => !l.classList.contains('q-off') && (l.textContent || '').trim().length > 10);
      let i = c ? lignes.indexOf(c) : -1; let n = lignes[i + 1] || lignes[0];
      document.querySelectorAll('[data-va-cible]').forEach(e => e.removeAttribute('data-va-cible'));
      if (!n) return Promise.resolve();
      n.setAttribute('data-va-cible', '1');
      poserAHauteur(n);
      return new Promise(r => apres(r, 700));
    },
    /* « je nous emmène plus loin » : quatre blocs plus loin, sans lancer la lecture */
    sEloigner(){
      /* 16/09 — Mickaël : « je veux qu'à chaque fois il réapparaisse ». ⏩ n'apparaît
         que si le prochain passage est à plus de 25 s : on saute de 4 blocs, on
         laisse le bandeau se mettre à jour (400 ms), et si ⏩ n'est pas là, on
         avance encore d'un bloc, jusqu'à ce qu'il y soit. */
      try { const au = $('#au'); const i = (typeof blocCourant === 'function') ? blocCourant() : 0;
        let j = Math.min(i + 4, 19), essais = 0;
        const essayer = () => {
          if (typeof allerBloc !== 'function') return;
          allerBloc(j); apres(() => { try { au.pause(); } catch(e){} }, 150);
          apres(() => { if (!document.querySelector('.b-aller.la') && j < 19 && essais++ < 6){ j++; essayer(); } }, 550);
        };
        essayer(); } catch(e){}
      return Promise.resolve();
    },
    reposer(){ zoomer(null); return new Promise(r => apres(r, 1900)); },
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
    /* 13 h 50 — Mickaël : « il faut que le lecteur reste visible pendant le guide » :
       le lecteur du bas ne se cache jamais pendant la visite */
    body.enVisiteAtelier #lecteurBas.cache{ transform:none !important; opacity:1 !important; pointer-events:auto !important; }
    /* le disque noir laissé à la place du bouton parti (l'atelier force ses boutons : on force plus fort) */
    .vaParti{ visibility:hidden !important; }
    [data-va-parti]{ transition:opacity .5s; }
    /* le bouton qui gigote dans les doigts de Rudy */
    .vaAvant.vaGigote{ animation:vaGigote .55s ease-in-out infinite !important; transition:none !important; }
    @keyframes vaGigote{ 0%{ transform:translate(var(--dx),var(--dy)) scale(3) rotate(-7deg); } 25%{ transform:translate(calc(var(--dx) + 14px),calc(var(--dy) - 10px)) scale(3.1) rotate(8deg); }
      50%{ transform:translate(calc(var(--dx) - 12px),calc(var(--dy) + 8px)) scale(2.9) rotate(-9deg); } 75%{ transform:translate(calc(var(--dx) + 8px),calc(var(--dy) + 12px)) scale(3.05) rotate(6deg); } 100%{ transform:translate(var(--dx),var(--dy)) scale(3) rotate(-7deg); } }
    #vaVoile{ position:fixed; inset:0; z-index:150; background:transparent; opacity:0; pointer-events:none; }
    body.enVisiteAtelier #vaVoile{ opacity:1; pointer-events:auto; }
    /* 15/09 — Mickaël : « il faut bloquer pour ne pas que la personne appuie sur
       autre chose et dérègle le tutoriel ». Pendant l'attente, le voile garde
       l'écran, avec un TROU découpé sur l'objet attendu : lui seul répond. */
    body.enVisiteAtelier.vaAttend #vaVoile{ pointer-events:auto; }
    /* 11 h — Mickaël : « pourquoi des carrés ? illumine. » La lumière est posée
       sur l'OBJET lui-même, dans sa forme (rond pour un bouton rond, la ligne
       pour une phrase) : il s'éclaire, et respire quand on attend le geste. */
    #vaTrou{ display:none !important; }
    /* 11 h 20 — « je ne veux que de la lumière, pas de rond autour » : l'objet
       entier s'éclaire (plus clair, plus chaud, un halo doux qui déborde de sa
       forme), et respire quand on attend le geste. Aucun trait. */

    .vaLumiere{ filter:brightness(1.7) saturate(1.3) drop-shadow(0 0 10px rgba(241,210,122,.95)) drop-shadow(0 0 26px rgba(241,210,122,.7)) !important;
      position:relative; z-index:152; }
    /* 15/09 — au « vas-y », la lumière prend de l'ampleur : fond doré, halo large qui
       respire, l'objet grossit un peu. Avant, seulement le petit halo. */
    body.vaAttend .vaLumiere{ animation:vaPulse 1.1s ease-in-out infinite; }
    /* 18/09 — le bouton du visage, même barré, doit s'éclairer FORT : on lève son voile « endormi » */
    #btnPresence.endormi.vaLumiere{ opacity:1 !important; }
    #btnPresence.endormi.vaLumiere::after{ box-shadow:0 0 8px rgba(255,235,160,1); }
    /* 18/09 — les trois points « pas assez éclairés » : au « vas-y », le rond entier
       prend un fond d'or et les points deviennent blancs, en plus du halo */
    body.vaAttend #btnPlus.vaLumiere{ background:rgba(212,175,55,.45) !important; border-color:#fff3c4 !important; transform:scale(1.12); }
    body.vaAttend #btnPlus.vaLumiere::before{ background:#fff !important; box-shadow:-9px 0 0 #fff, 9px 0 0 #fff !important; }
    /* 15/09 — une phrase : petit halo à « je t'en éclaire une » ; au « vas-y », elle
       passe en blanc lumineux, sans fond ni cadre ; à l'appui, tout s'éteint */
    .vaLumiere.ligne, .vaLumiere.ligne .mot{ opacity:1 !important; }
    body.vaAttend .vaLumiere.ligne, body.vaAttend .vaLumiere.ligne .mot{ color:#fff !important; text-shadow:0 0 14px rgba(255,240,180,.95), 0 0 28px rgba(241,210,122,.8); }
    @keyframes vaPulse{ 0%,100%{ filter:brightness(1.7) saturate(1.3) drop-shadow(0 0 12px rgba(241,210,122,.95)) drop-shadow(0 0 28px rgba(241,210,122,.7)); }
                        50%{ filter:brightness(2.4) saturate(1.5) drop-shadow(0 0 20px rgba(255,235,160,1)) drop-shadow(0 0 60px rgba(241,210,122,1)); } }
    /* la pause, d'un appui n'importe où */
    #vaPause{ position:fixed; left:50%; bottom:calc(env(safe-area-inset-bottom) + 96px); transform:translateX(-50%); z-index:158;
      padding:10px 18px; border-radius:999px; border:1px solid rgba(212,175,55,.6); background:rgba(8,7,6,.92); color:#f1d27a;
      font:600 .95rem system-ui; letter-spacing:.03em; display:none; pointer-events:none; }
    body.vaEnPause #vaPause{ display:block; }
    /* le visage qui fait peur (18/09) : en grand, au milieu, le noir de la vidéo se fond dans la page */
    #vaVisage{ position:fixed; left:50%; top:52%; height:min(78vh, 140vw); aspect-ratio:9/16; transform:translate(-50%,-50%) scale(.92); z-index:165;
      mix-blend-mode:screen; opacity:0; transition:opacity .7s, transform 1.2s cubic-bezier(.2,.8,.2,1); pointer-events:none; object-fit:contain; }
    #vaVisage.vaLa{ opacity:1; transform:translate(-50%,-50%) scale(1); }
    /* la petite télé d'Élie (16/09) */
    #vaTele{ position:fixed; left:50%; top:50%; width:min(92vw, 640px); aspect-ratio:16/9; transform:translate(-50%,-50%) scale(.6); z-index:170;
      background:#000; border:1px solid rgba(212,175,55,.75); border-radius:10px; box-shadow:0 0 0 6px rgba(0,0,0,.85), 0 0 40px rgba(212,175,55,.35), 0 30px 80px rgba(0,0,0,.8);
      opacity:0; transition:opacity .5s, transform .6s cubic-bezier(.2,.8,.2,1); overflow:hidden; }
    #vaTele.vaLa{ opacity:1; transform:translate(-50%,-50%) scale(1); }
    #vaTele video{ width:100%; height:100%; object-fit:cover; display:block; }
    /* le faux accueil (15/09) */
    .vaAppuye{ transform:scale(.8) !important; filter:brightness(2) contrast(1.25) saturate(1.5) drop-shadow(0 0 3px rgba(255,240,180,1)) drop-shadow(0 0 9px rgba(241,210,122,.9)) !important; transition:transform .08s, filter .08s !important; }   /* lumière nette, halo court */
    #vaFaux{ position:fixed; inset:0; z-index:170; background:#0a0908; opacity:0; transition:opacity .35s; }
    #vaFaux.vaLa{ opacity:1; } #vaFaux.vaFin{ opacity:0; }
    #vaFaux video{ position:absolute; inset:0; width:100%; height:100%; object-fit:contain; object-position:center bottom; filter:brightness(.92) contrast(1.06) saturate(1.08); }   /* un peu de lumière, chaude, naturelle */
    #vaFaux .vaVert{ position:absolute; top:calc(env(safe-area-inset-top) + 9px); right:14px; width:7px; height:7px; border-radius:50%; background:#35d05a; box-shadow:0 0 4px rgba(53,208,90,.8); }   /* l’écran est plus haut que la vidéo (9:16) : on garde tout, calé en bas, le vide reste en haut, sombre */
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
    /* 18/09 — le mode CONTINU : la visite enchaîne, et on a une télécommande (⏮ ⏸ ⏭ + sommaire) */
    #vaBarre .prec .x, #vaBarre .suiv .x{ font-size:14px; }
    body:not(.vaContinu) #vaBarre .prec, body:not(.vaContinu) #vaBarre .suiv{ display:none; }
    #vaBarre .marque .x{ font-size:16px; border-color:rgba(255,120,120,.7); }
    #vaSommaire .liste button.marqueItem{ border-color:rgba(255,120,120,.5); } #vaSommaire .liste button.marqueItem small{ opacity:.6; }
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
    + '<button class="prec" title="Arrêt précédent"><span class="x">⏮</span></button>'
    + '<button class="pause" title="Pause"><span class="x">⏸</span></button>'
    + '<button class="suiv" title="Arrêt suivant"><span class="x">⏭</span></button>'
    + (CHANTIER ? '<button class="marque" title="Marquer : ici, quelque chose à changer"><span class="x">📍</span></button>' : '')
    + (CHANTIER ? '<button class="maj" title="Recharger la dernière version"><span class="x">⟳</span></button>' : '')
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
  /* 15/09 — le VRAI zoom, de caméra : toute la page s'approche de l'objet (×2,4 en
     une seconde), l'œil est obligé d'y aller ; null = on recule à la normale */
  /* 15/09 — la mise en avant : une copie du bouton se détache de sa place, vient
     en grand au milieu de l'écran (×3), illuminée, pendant que le reste
     s'assombrit ; à la fin elle retourne à sa place et s'efface. */
  let avant = null, avantOrig = null;
  function zoomer(sel, gigote, montre){
    if (!sel){
      if (!avant) return;
      const c = avant; avant = null;
      /* le retour, en douceur : on fige d'abord le gigotage là où il est, puis on glisse (1,6 s) */
      /* 16/09 — Mickaël : « il faut qu'elle le remette au même endroit ». Le retour
         vise l'endroit où est le VRAI bouton MAINTENANT (la barre a pu glisser
         entre-temps), pas l'endroit d'où il était parti. On repose la copie sur
         la place actuelle, avec un décalage égal à sa position présente, puis on
         glisse vers zéro : elle atterrit pile sur le bouton, qui réapparaît. */
      const cr = c.getBoundingClientRect();
      const orig = avantOrig; avantOrig = null; const r2 = orig ? orig.getBoundingClientRect() : null;
      c.classList.remove('vaGigote'); c.style.transition = 'none';
      if (r2 && r2.width){
        c.style.left = r2.left + 'px'; c.style.top = r2.top + 'px'; c.style.width = r2.width + 'px'; c.style.height = r2.height + 'px';
        const dx = (cr.left + cr.width / 2) - (r2.left + r2.width / 2), dy = (cr.top + cr.height / 2) - (r2.top + r2.height / 2);
        c.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + (cr.width / r2.width) + ')';
        document.querySelectorAll('.vaCache').forEach(k => { k.style.left = (r2.left - 6) + 'px'; k.style.top = (r2.top - 6) + 'px'; });
      } else {
        const m = getComputedStyle(c).transform; c.style.transform = m === 'none' ? c.style.transform : m;
      }
      void c.offsetWidth;   /* on force le navigateur à prendre acte */
      c.style.transition = 'transform 1.6s cubic-bezier(.4,.05,.2,1)';
      requestAnimationFrame(() => { c.style.transform = 'translate(0,0) scale(1)'; voile.style.background = 'transparent'; });
      apres(() => {
        document.querySelectorAll('[data-va-parti]').forEach(o => { o.classList.remove('vaParti'); o.removeAttribute('data-va-parti'); });
        document.querySelectorAll('.vaCache').forEach(k => { k.style.opacity = '0'; apres(() => k.remove(), 520); });
        c.style.transition = 'opacity .35s'; c.style.opacity = '0'; apres(() => c.remove(), 380);
      }, 1650);
      return;
    }
    const e = visibles(sel)[0]; if (!e) return;
    const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); const av = getComputedStyle(e, '::before');
    avantOrig = e;
    if (!montre){   /* 16/09 — Rudy PREND : l'original part et sa place devient noire ; Koraly MONTRE : il reste là */
    e.classList.add('vaParti'); e.setAttribute('data-va-parti', '1');   /* il quitte sa place */
    /* et un CACHE noir opaque par-dessus l'emplacement : rien ne transparaît, ni rond ni logo */
    /* et un CACHE noir opaque par-dessus l'emplacement : rien ne transparaît, ni rond ni logo
       (16/09 — remis : « quand il prend le truc, il prend vraiment le truc, c'est noir ») */
    const cache = document.createElement('div'); cache.className = 'vaCache';
    cache.style.cssText = 'position:fixed;left:' + (r.left - 6) + 'px;top:' + (r.top - 6) + 'px;width:' + (r.width + 12) + 'px;height:' + (r.height + 12) + 'px;'
      + 'border-radius:50%;background:#0a0908;z-index:153;pointer-events:none;transition:opacity .5s;';
    document.body.appendChild(cache);
    }
    const c = document.createElement('div'); c.className = 'vaAvant';
    c.style.cssText = 'position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;z-index:161;'
      + 'border-radius:' + cs.borderRadius + ';border:' + cs.border + ';background:' + cs.backgroundColor + ';'
      + 'background-image:' + (av.backgroundImage !== 'none' ? av.backgroundImage : cs.backgroundImage) + ';background-size:' + (av.backgroundSize !== 'auto' ? av.backgroundSize : '60%') + ';background-position:center;background-repeat:no-repeat;'
      + 'transition:transform 1.2s cubic-bezier(.45,.05,.2,1);transform:translate(0,0) scale(1);pointer-events:none;'
      + 'filter:brightness(1.6) saturate(1.3) drop-shadow(0 0 12px rgba(241,210,122,.95)) drop-shadow(0 0 30px rgba(241,210,122,.7));';
    if (av.backgroundImage === 'none' && cs.backgroundImage === 'none' && av.width !== 'auto'){
      /* 16/09 — les trois points : pas d'image, un ::before dessiné (rond + ombres) : on le refait dans la copie */
      const pt = document.createElement('span');
      pt.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:block;width:' + av.width + ';height:' + av.height + ';border-radius:' + av.borderRadius + ';background:' + av.backgroundColor + ';box-shadow:' + av.boxShadow + ';';
      c.appendChild(pt);
    }
    document.body.appendChild(c);
    const dx = innerWidth / 2 - (r.left + r.width / 2), dy = innerHeight / 2 - (r.top + r.height / 2);
    voile.style.transition = 'background 1.2s'; voile.style.background = 'rgba(4,4,4,.9)';   /* 16/09 : plus sombre, la bulle d'aide et les boutons ne traversent plus */
    requestAnimationFrame(() => { c.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(3)'; });
    if (gigote) apres(() => { c.style.setProperty('--dx', dx + 'px'); c.style.setProperty('--dy', dy + 'px'); c.classList.add('vaGigote'); }, 1250);
    avant = c;
  }
  function bleuir(sel){ document.querySelectorAll('.vaBleu').forEach(e => e.classList.remove('vaBleu')); if (sel) visibles(sel).forEach(e => e.classList.add('vaBleu')); }

  /* ── les sons : la voix, la musique de fond, l'atelier baissé ─────────── */
  const son = document.createElement('audio'); son.preload = 'auto'; son.volume = 1;
  const clic = document.createElement('audio'); clic.src = DOSSIER + 'clic.mp3?v=16v'; clic.preload = 'auto';
  const fond = document.createElement('audio'); fond.loop = true; fond.preload = 'auto'; fond.src = DOSSIER + 'fond-mediterranean-dusk.mp3';
  const VOLUME_FOND = 0.06;   /* « vraiment très, très douce » : −24 dB environ */
  /* 11 h 10 — Mickaël : « quand ils parlent, la musique très doucement ; quand
     ils se taisent pour laisser écouter, on l'entend ; et à la fin de l'arrêt,
     elle s'arrête toute seule. » */
  const BAS = 0.03;
  /* 15/09 — Chrome Android ignore parfois « audio.volume » : on passe la bande de
     l'atelier par une table de mixage interne (Web Audio, un GainNode), qui obéit
     partout. On la branche une seule fois par lecteur, au lancement (geste). */
  let mix = null; const gains = new Map();
  function brancherLaTable(){
    try {
      if (!mix){ const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; mix = new AC(); }
      if (mix.state === 'suspended') mix.resume().catch(() => {});
      bandes().forEach(a => {
        if (gains.has(a)) return;
        try { const src = mix.createMediaElementSource(a); const g = mix.createGain(); g.gain.value = 1; src.connect(g); g.connect(mix.destination); gains.set(a, g); } catch(e){}
      });
    } catch(e){}
  }
  function regler(a, v, ms){
    const g = gains.get(a);
    if (g){ const t = mix.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(v, t + (ms || 0) / 1000); }
    else { try { if (ms) fondu(a, v, ms); else a.volume = v; } catch(e){} }
  }   /* 13 h 50 — « quand elle dit trop génial, il faut que tu baisses » : très bas */
  let volumesGardes = null;
  const bandes = () => [...document.querySelectorAll('audio'), window.__auI].filter(a => a && a !== son && a !== fond);
  function baisserLAtelier(niveau, doux){
    brancherLaTable();
    const n = (niveau === undefined || niveau === null) ? BAS : niveau;   /* 0 = coupée, c'est permis */
    bandes().forEach(a => regler(a, n, doux ? 700 : 60));
  }
  function laisserEcouter(){ brancherLaTable(); bandes().forEach(a => regler(a, 1, 600)); }
  function rendreLAtelier(){ bandes().forEach(a => regler(a, 1, 0)); }
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
    if (/-perso[0-9]*$/.test(nom)) nom = nom + '-' + quiEcoute();   /* 09-perso, 09-perso2, 09-perso3, 10-perso : la réplique aux lunettes */
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
  /* le trou dans le voile : tout est bloqué sauf l'objet attendu */
  function percerLeVoile(sel){
    const els = sel ? [...document.querySelectorAll(sel)].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }) : [];
    if (!els.length){ voile.style.clipPath = ''; return; }
    const W = innerWidth, H = innerHeight, m = 10;
    let poly = '0 0, ' + W + 'px 0, ' + W + 'px ' + H + 'px, 0 ' + H + 'px, 0 0';
    els.forEach(e => { const r = e.getBoundingClientRect(); const l = r.left - m, t = r.top - m, rt = r.right + m, b = r.bottom + m;
      poly += ', ' + l + 'px ' + t + 'px, ' + l + 'px ' + b + 'px, ' + rt + 'px ' + b + 'px, ' + rt + 'px ' + t + 'px, ' + l + 'px ' + t + 'px, 0 0'; });
    voile.style.clipPath = 'polygon(evenodd, ' + poly + ')';
  }
  function attendreLeGeste(a, monFil){
    return new Promise(resolve => {
      document.body.classList.add('vaAttend');
      percerLeVoile(a.sel);
      const surTaille = () => percerLeVoile(a.sel);
      /* la lumière suit : toujours la phrase qui passe à la bonne hauteur */
      const suivi = a.suivre ? setInterval(() => {
        const l = phraseAHauteur(); if (!l || l.hasAttribute('data-va-cible')) return;
        document.querySelectorAll('[data-va-cible]').forEach(e => e.removeAttribute('data-va-cible'));
        l.setAttribute('data-va-cible', '1'); eclairer('[data-va-cible]'); percerLeVoile(a.sel);
      }, 400) : null;
      addEventListener('resize', surTaille); addEventListener('scroll', surTaille, true);
      const relance = apres(() => { if (monFil === fil && !arrete && !enPause){ try { const r = new Audio(DOSSIER + 'relance.mp3?v=' + VERSION); r.play().catch(() => {}); } catch(e){} } }, 25000);
      const fini = () => {
        clearTimeout(relance);
        if (monFil !== fil) return;
        document.body.classList.remove('vaAttend');
        eclairer(null);   /* au geste, la lumière s'éteint net : il ne reste rien de jaune */
        voile.style.clipPath = ''; removeEventListener('resize', surTaille); removeEventListener('scroll', surTaille, true); if (suivi) clearInterval(suivi);
        document.removeEventListener('click', surClic, true);
        document.removeEventListener('input', surInput, true);
        document.removeEventListener('change', surInput, true);
        document.removeEventListener('boheme-appui-long', surLong);
        attente = null; apres(resolve, 700);
      };
      const surClic  = e => { if (a.evt && a.evt !== 'click') return; if (e.target.closest && e.target.closest(a.sel)) fini(); };
      /* la glissade : on compte les mouvements ; après 1 s de glissade, un son « pendant » ;
         le lâcher (change / pointerup) termine — mais on laisse finir le son pendant */
      let glisseDepuis = 0, sonPendant = null, pendantParti = false;
      const surGlisse = e => {
        if (a.evt !== 'glisse' || !(e.target.closest && e.target.closest(a.sel))) return;
        if (!glisseDepuis) glisseDepuis = Date.now();
        if (!pendantParti && a.pendant && Date.now() - glisseDepuis > 1000){
          pendantParti = true; sonPendant = new Audio(DOSSIER + a.pendant + '.mp3?v=' + VERSION); sonPendant.play().catch(() => {});
        }
      };
      const surLacher = e => {
        if (a.evt !== 'glisse' || !glisseDepuis) return;   /* le doigt se lève, n'importe où : la glissade est finie */
        const partir = () => { document.removeEventListener('input', surGlisse, true); document.removeEventListener('pointerup', surLacher, true); document.removeEventListener('touchend', surLacher, true); document.removeEventListener('change', surLacher, true);
          laisserEcouter();   /* 15/09 — au lâcher, la musique revient, comme dans l'atelier ; Rudy la fera baisser en fondu */
          fini(); };
        if (sonPendant && !sonPendant.ended && !sonPendant.paused) sonPendant.addEventListener('ended', partir, { once: true }); else partir();
      };
      document.addEventListener('input', surGlisse, true);
      document.addEventListener('pointerup', surLacher, true);
      document.addEventListener('touchend', surLacher, true);
      document.addEventListener('change', surLacher, true);
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
    ici = k; marquer(); precharger(k);
    try { localStorage.setItem(CLE_OU, JSON.stringify({ k, quand: Date.now() })); } catch(e){}
    const a = ARRETS[k];
    $('#vaTitre').textContent = (EN_CHANTIER ? '🚧 ' : '') + (k + 1) + ' · ' + a.nom;
    if (a.prepare && GESTES[a.prepare]) await GESTES[a.prepare]();
    for (const s of a.seg){
      if (arrete || monFil !== fil) return;
      if (reprise && reprise.k === k && a.seg.indexOf(s) < reprise.seg) continue;   /* on rejoint la marque : on saute ce qui est avant */
      if (s.avant && GESTES[s.avant]) await GESTES[s.avant]();
      eclairer(s.attend ? null : (s.vise || null));   /* avec un geste attendu : la lumière vient au « vas-y » */
      if (s.silence){ laisserEcouter(); await new Promise(r => apres(r, s.silence)); }   /* on laisse écouter */
      if (s.aTemps){ laisserEcouter(); await attendreLaBande(s.aTemps, monFil); }
      if (arrete || monFil !== fil) return;
      if (!s.sansBaisser) baisserLAtelier(s.baisserA, s.fonduBas);
      await direLeSon(s, monFil);
      if (!s.garderZoom && !(a.seg[a.seg.indexOf(s) + 1] || {}).garderZoom && !((a.seg[a.seg.indexOf(s) + 1] || {}).avant === 'reposer')) zoomer(null);
      if (!s.garderBas) laisserEcouter();   /* ils se taisent : la bande remonte à plein */
      if (arrete || monFil !== fil) return;
      if (s.attend){ eclairer(s.vise || null); await attendreLeGeste(s.attend, monFil); }
      if (arrete || monFil !== fil) return;
      if (s.apres && GESTES[s.apres]) await GESTES[s.apres]();
    }
    if (arrete || monFil !== fil) return;
    if (!a.garderLaLecture) arreterLaLecture();   /* la musique ne continue jamais dans le vide */
    if (PAS_A_PAS && !fluide() && k + 1 < ARRETS.length && !a.garderLaLecture){
      try { localStorage.setItem(CLE_OU, JSON.stringify({ k: k + 1, quand: Date.now() })); } catch(e){}
      const c = document.createElement('div'); c.className = 'vaCarte';
      c.innerHTML = '<div class="vaBulle"><h3>Arrêt ' + (k + 1) + ' terminé</h3><p>' + a.nom + '</p>'
        + '<button class="oui">Continuer → ' + (k + 2) + ' · ' + ARRETS[k + 1].nom + '</button>'
        + '<button class="non">Rejouer cet arrêt</button><button class="non som">Sommaire</button></div>';
      document.body.appendChild(c);
      c.querySelector('.oui').addEventListener('click', () => { c.remove(); jouer(k + 1, monFil); });
      c.querySelector('.non:not(.som)').addEventListener('click', () => { c.remove(); if (k === 0) remettreLAtelierAuDebut(); jouer(k, monFil); });
      c.querySelector('.som').addEventListener('click', () => { c.remove(); finir(false); sommaire.hidden = false; });
      return;
    }
    apres(() => jouer(k + 1, monFil), 500);
  }
  let reprise = null;
  function a_seg_index(s){ const a = ARRETS[ici]; return a ? a.seg.indexOf(s) : -1; }
  /* 21/09 — LES MARQUES (chantier) : Mickaël regarde la visite en continu et, quand
     quelque chose pourrait être mieux, il appuie sur 📍. On note l'arrêt, le segment,
     la seconde, le mot ; ça part aussi sur ntfy. Le sommaire liste les marques, et
     « revenir » rejoue la visite deux secondes avant la marque. */
  function lireLesMarques(){ try { return JSON.parse(localStorage.getItem('va-marques') || '[]'); } catch(e){ return []; } }
  function poserUneMarque(){
    if (ici < 0) return;
    const a = ARRETS[ici]; const nom = (son.src || '').split('/').pop().split('?')[0];
    const seg = a.seg.findIndex(x => nom.indexOf(x.son) === 0 || nom === x.son + '.mp3');
    const m = { k: ici, seg: Math.max(0, seg), t: +son.currentTime.toFixed(1), son: nom, quand: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) };
    const L = lireLesMarques(); L.push(m); try { localStorage.setItem('va-marques', JSON.stringify(L)); } catch(e){}
    try { fetch('https://ntfy.sh/boheme-b2ebc8b427d107aa5d79', { method:'POST', mode:'no-cors', body: 'MARQUE ' + L.length + ' : arrêt ' + (ici + 1) + ' · ' + a.nom + ' · ' + nom + ' à ' + m.t + ' s (' + m.quand + ')' }); } catch(e){}
    const b = barre.querySelector('.marque .x'); if (b){ b.textContent = '✔'; apres(() => { b.textContent = '📍'; }, 900); }
    construireLeSommaire(); marquer();
  }
  function revenirALaMarque(m){
    sommaire.hidden = true; depuisSommaire = true;
    reprise = { k: m.k, seg: m.seg, t: m.t };
    lancer(m.k);
  }
  function direLeSon(s, monFil){
    return new Promise(resolve => {
      let passe = false; const fini = () => { if (passe) return; passe = true; resolve(); };
      son.onended = fini; son.onerror = () => apres(fini, 800);
      /* 15/09, 17 h — les gestes « pendant » se calent sur le temps RÉEL de la voix
         (son.currentTime), plus sur un minuteur à part : si le fichier charge
         lentement, le geste attend le mot. Vérifié dix fois par seconde. */
      const restants = (s.pendant || []).slice();
      const guetter = setInterval(() => {
        if (monFil !== fil || arrete || passe){ clearInterval(guetter); return; }
        if (enPause || !son.duration) return;
        for (let i = 0; i < restants.length; i++){
          const g = restants[i];
          if (son.currentTime < son.duration * g.part) continue;
          restants.splice(i--, 1);
          if (g.vise !== undefined) eclairer(g.vise);
          if (g.bleu !== undefined) bleuir(g.bleu);
          if (g.zoom !== undefined) zoomer(g.zoom, g.gigote, g.montre);
          if (g.geste && GESTES[g.geste]) GESTES[g.geste]();
        }
        if (!restants.length) clearInterval(guetter);
      }, 100);
      son.src = cheminDuSon(s.son);
      if (reprise && reprise.k === ici && a_seg_index(s) === reprise.seg){ const t = reprise.t; reprise = null; son.addEventListener('loadedmetadata', () => { try { son.currentTime = Math.max(0, t - 2); } catch(e){} }, { once: true }); }
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
    sommaire.querySelectorAll('.liste button:not(.marqueItem)').forEach((b, i) => { if (i < ARRETS.length) b.classList.toggle('vu', i <= ici); });
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
    if (CHANTIER){
      const L = lireLesMarques();
      if (L.length){
        const h = document.createElement('p'); h.className = 'sous'; h.style.marginTop = '18px'; h.textContent = '📍 Mes marques (' + L.length + ')';
        liste.appendChild(h);
        L.forEach((m, i) => {
          const b = document.createElement('button'); b.className = 'marqueItem';
          b.innerHTML = '<span class="n">📍</span><span>' + (i + 1) + ' · arrêt ' + (m.k + 1) + ' · ' + (ARRETS[m.k] || {}).nom + ' · ' + m.son.replace('.mp3', '') + ' à ' + m.t + ' s <small>(' + m.quand + ')</small></span>';
          b.addEventListener('click', () => revenirALaMarque(m));
          liste.appendChild(b);
        });
        const eff = document.createElement('button'); eff.innerHTML = '<span class="n">✕</span><span>Effacer toutes les marques</span>';
        eff.addEventListener('click', () => { try { localStorage.removeItem('va-marques'); } catch(e){} construireLeSommaire(); });
        liste.appendChild(eff);
      }
    }
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
  /* 21/09 — on demande D'AVANCE les voix de cet arrêt et du suivant (et les vidéos qui
     vont avec) : le service worker les garde, et l'enchaînement ne dépend plus de la 5G. */
  const dejaDemande = new Set();
  function precharger(k){
    try {
      const noms = [];
      [k, k + 1].forEach(i => { const a = ARRETS[i]; if (a) a.seg.forEach(s => { if (s.son) noms.push(s.son); }); });
      const urls = noms.map(cheminDuSon);
      if (k >= 6 && k <= 8) urls.push(DOSSIER + 'faux-accueil.mp4?v=16t', DOSSIER + 'tele-elie.mp4', DOSSIER + 'visage-flippant.mp4', DOSSIER + 'clic.mp3?v=16v');   /* les mêmes adresses exactes que dans les gestes */
      for (let j = urls.length - 1; j >= 0; j--) if (dejaDemande.has(urls[j])) urls.splice(j, 1);
      urls.forEach(u => dejaDemande.add(u));
      let i = 0; const suivant = () => { if (i >= urls.length) return; const u = urls[i++]; fetch(u, { credentials: 'same-origin' }).then(r => r.arrayBuffer ? r.arrayBuffer() : null).catch(() => {}).finally(suivant); };
      suivant(); suivant();   /* deux à la fois */
    } catch(e){}
  }
  function lancer(k){
    k = k || 0;
    arrete = false; fil++; const monFil = fil;
    precharger(k);
    /* 11 h 20 — « à partir du moment où l'on entre dans le guide, ça revient au
       début ; et à la fin, on retrouve l'endroit où on travaillait » */
    if (k === 0) remettreLAtelierAuDebut();
    brancherLaTable();
    document.body.classList.add('enVisiteAtelier');
    document.body.classList.toggle('vaContinu', fluide());
    document.body.classList.remove('tiroirOuvert');
    try { const bc = $('#bienvenueCarte'); if (bc) bc.classList.remove('la'); } catch(e){}
    try { $('#menuB') && $('#menuB').classList.remove('vu'); } catch(e){}
    /* 13 h 30 — Mickaël : « enlève la musique derrière » : plus de fond ; et la bande
       de l'atelier reste FORTE tant qu'ils ne parlent pas (on ne baisse qu'au son) */
    try { if ('wakeLock' in navigator) navigator.wakeLock.request('screen').catch(() => {}); } catch(e){}
    jouer(k, monFil);
  }
  /* 21/09 — Mickaël : « un cercle vide qui ne devrait pas être là » : le disque noir posé
     à la place d'un bouton pris dans les doigts restait sur l'écran si on quittait la
     visite (✕, sommaire, saut) à ce moment-là. On nettoie tout, sans animation. */
  function nettoyerLaPrise(){
    document.querySelectorAll('.vaCache, .vaAvant, #vaVisage, #vaTele, #vaFaux').forEach(e => e.remove());
    document.querySelectorAll('[data-va-parti]').forEach(o => { o.classList.remove('vaParti'); o.removeAttribute('data-va-parti'); });
    avant = null; avantOrig = null; voile.style.background = 'transparent';
  }
  function finir(complete){
    arrete = true; fil++;
    nettoyerLaPrise();
    document.body.classList.remove('enVisiteAtelier', 'vaAttend', 'vaEnPause', 'vaContinu'); enPause = false;
    try { son.pause(); } catch(e){}
    arreterLaLecture();
    rendreSaPlace();
    fondu(fond, 0, 1200);
    eclairer(null); bleuir(null);
    rendreLAtelier();
    if (attente) attente = null;
    /* quitter soi-même (✕, sommaire) = pas de reprise proposée ; la reprise ne
       sert que si le téléphone a coupé la visite (un appel, une page fermée) */
    if (!PAS_A_PAS){ try { localStorage.removeItem(CLE_OU); } catch(e){} }
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
  function sauterA(k){
    if (k < 0 || k >= ARRETS.length) return;
    fil++; try { son.pause(); } catch(e){}
    document.body.classList.remove('vaAttend', 'vaEnPause'); enPause = false; barre.querySelector('.pause .x').textContent = '⏸';
    nettoyerLaPrise(); eclairer(null); bleuir(null); voile.style.clipPath = '';
    document.querySelectorAll('.vaCarte').forEach(e => e.remove());
    laisserEcouter();
    const monFil = fil; jouer(k, monFil);
  }
  barre.querySelector('.prec').addEventListener('click', () => sauterA(ici - 1));
  if (barre.querySelector('.marque')) barre.querySelector('.marque').addEventListener('click', e => { e.stopPropagation(); poserUneMarque(); });
  barre.querySelector('.suiv').addEventListener('click', () => sauterA(ici + 1));
  barre.querySelector('.pause').addEventListener('click', () => { basculerLaPause(); barre.querySelector('.pause .x').textContent = enPause ? '▶' : '⏸'; });
  if (barre.querySelector('.maj')){
    /* chantier : ⟳ recharge la page avec la dernière version et revient à l'arrêt en cours */
    barre.querySelector('.maj').addEventListener('click', () => {
      try { localStorage.setItem(CLE_OU, JSON.stringify({ k: Math.max(0, ici), quand: Date.now() })); sessionStorage.setItem('va-reprendre', '1'); } catch(e){}
      location.replace(location.pathname + '?x=' + Date.now());
    });
  }
  /* en chantier, un bouton ⟳ flotte aussi hors visite, pour recharger d'un doigt */
  /* 16/09 — Mickaël : « des fois, j'ai envie d'entendre la suite sans que ça coupe » :
     un bouton ⏭ à côté de ⟳ ; allumé = la visite enchaîne les arrêts sans carte. */
  function fluide(){ try { return localStorage.getItem('va-fluide') === '1'; } catch(e){ return false; } }
  if (PAS_A_PAS){
    const fl = document.createElement('button'); fl.id = 'vaFluide';
    const peindre = () => { fl.textContent = fluide() ? '⏭' : '⏸'; fl.title = fluide() ? 'Fluide : la visite enchaîne (appuie pour couper à chaque arrêt)' : 'Coupé à chaque arrêt (appuie pour enchaîner)'; fl.style.background = fluide() ? 'rgba(212,175,55,.35)' : 'rgba(8,7,6,.85)'; };
    fl.style.cssText = 'position:fixed;right:10px;bottom:calc(env(safe-area-inset-bottom) + 202px);z-index:149;width:44px;height:44px;border-radius:50%;border:1px solid rgba(212,175,55,.6);color:#f1d27a;font-size:20px;';
    fl.addEventListener('click', () => { try { localStorage.setItem('va-fluide', fluide() ? '0' : '1'); } catch(e){} peindre(); document.body.classList.toggle('vaContinu', fluide()); });
    peindre(); document.body.appendChild(fl);
    const m = document.createElement('button'); m.id = 'vaMaj'; m.textContent = '⟳';
    m.style.cssText = 'position:fixed;right:10px;bottom:calc(env(safe-area-inset-bottom) + 150px);z-index:149;width:44px;height:44px;border-radius:50%;border:1px solid rgba(212,175,55,.6);background:rgba(8,7,6,.9);color:#f1d27a;font-size:20px;';
    m.title = 'Recharger la dernière version du chantier';
    m.addEventListener('click', () => { try { sessionStorage.setItem('va-reprendre', '1'); } catch(e){} location.replace(location.pathname + '?x=' + Date.now()); });
    document.body.appendChild(m);
    /* au retour : on rouvre la visite là où on en était */
    try { if (sessionStorage.getItem('va-reprendre') === '1'){ sessionStorage.removeItem('va-reprendre'); apres(() => { const k = ouIlEnEtait(); lancer(k); }, 1800); } } catch(e){}
  }
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
    try { const o = JSON.parse(localStorage.getItem(CLE_OU) || 'null'); if (o && (PAS_A_PAS || Date.now() - o.quand < 3 * 3600 * 1000)) return o.k; } catch(e){}
    return 0;
  }

  window.VISITE_ATELIER = {
    /* depuis la carte « Oui, je fais le guide » ou le « ? » : on propose, puis on part */
    proposer(){ carteDeDepart(ouIlEnEtait(), k => lancer(k)); },
    sommaire(){ marquer(); sommaire.hidden = false; },
    lancer, finir, son, fond, zoomer,
    vue(){ try { return localStorage.getItem(CLE_VUE) === '1'; } catch(e){ return false; } },
    ARRETS,
  };
})();
