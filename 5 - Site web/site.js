/* ═══════════════════════════════════════════════════════════════════════════
   LE SITE BOHÈME — le script commun (7 septembre 2026)
   Il fabrique la navigation (île, menu plein écran, barre du bas), révèle les
   blocs au défilement, anime les calques de l'ouverture, charge les images
   quand elles existent (et laisse un beau fond sinon), et fait suivre le lien
   personnel (?pour=…) de page en page.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ⚠️ 12 septembre, 9 h 55 — Mickael : « tu te trompes sur les horaires, il est
   9 h 54 du matin. » J'inventais des heures qui avancaient toutes seules au
   lieu de lire l'horloge : « 14h25 » a 9 h 54, c'est faux, et un numero de
   version faux est pire qu'un compteur — il fait croire a une publication qui
   n'a pas eu lieu. Desormais l'heure est LUE sur la machine a chaque
   publication, jamais tapee. */
const VERSION_SITE = '13/09/2026 · 12h56';
(function(){
  const PAGES = [
    { f:'ACCUEIL — Bohème.html',        t:'Accueil',        g:'⌂', i:'maison', s:'le hall' },
    { f:'KARAOKE — Medley complet.html', t:'Atelier',        g:'♪', i:'note', s:'la salle de travail' },
    { f:'LIVRE — Les textes du medley.html', t:'Textes',     g:'¶', i:'livre', s:'le livre, avec la musique' },
    { f:'QUI CHANTE QUOI — Bohème.html', t:'Qui chante quoi', g:'♪', i:'note', s:'bloc par bloc, qui prend la parole' },
    { f:'MISE EN SCÈNE — Bohème.html',  t:'Mise en scène',  g:'◎', i:'scene', s:'qui est où, quand' },
    { f:'DOCUMENTS — Bohème.html',      t:'Documents',      g:'≡', i:'document', s:'à télécharger' },
    /* 11 sept — Mickaël : « Vidéos, ça fait double emploi avec la mise en scène.
       C'est l'extrait de la conduite : tu peux mettre Vidéo technique. » */
    { f:'VIDÉOS — Bohème.html',         t:'Technique',      g:'▶', i:'lecture', s:'la conduite, en vidéo' },
    { f:'CALENDRIER — Bohème.html',     t:'Calendrier',     g:'✦', i:'etoile', s:'le rendez-vous' },
    { f:'NOUVEAUTÉS — Bohème.html',     t:'Nouveautés',     g:'◌', i:'nouveau', s:'ce qui a changé' },
    { f:'PRENOM — Bohème.html',         t:'Mon prénom',     g:'●', i:'coche', s:'choisir, ou en changer' },
    { f:'index.html',                   t:'Installer',      g:'⇩', i:'telecharger', s:'l\'application sur ton téléphone' },
  ];
  /* ⚠️ 10 sept, au soir — DANS L'APPLICATION, ON NE PROPOSE PLUS D'INSTALLER.
     Mickaël : « à partir du moment où la personne est à l'intérieur de l'application,
     pas besoin de lui dire d'installer : s'il l'a fait, c'est déjà installé ». L'entrée
     « Installer » du menu ne s'affiche donc que dans un navigateur. */
  const enAppli = matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches || navigator.standalone === true;
  if (enAppli){ const k = PAGES.findIndex(p => p.f === 'index.html'); if (k >= 0) PAGES.splice(k, 1); }
  /* le prénom : dans le lien, sinon celui qu'on a gardé (application installée) */
  let pour = new URLSearchParams(location.search).get('pour');
  try { if (pour) localStorage.setItem('boheme-pour', pour); else pour = localStorage.getItem('boheme-pour') || null; } catch(e){}
  /* LE MODE RÉGLAGE SE RETIENT (11 sept) : une fois allumé, il suit de page en
     page et survit à un rechargement, sinon on le perd au premier lien touché. */
  let reglage = new URLSearchParams(location.search).get('reglage') === '1';
  try {
    if (reglage) sessionStorage.setItem('boheme-reglage', '1');
    else if (sessionStorage.getItem('boheme-reglage') === '1') reglage = true;
  } catch(e){}
  const suite = (pour ? '?pour=' + encodeURIComponent(pour) : '') + (reglage ? (pour ? '&' : '?') + 'reglage=1' : '');
  const ici = decodeURIComponent(location.pathname.split('/').pop() || '');
  const lien = p => encodeURI(p.f) + suite;

  /* ── la navigation ─────────────────────────────────────────────────── */
  const nav = document.createElement('div'); nav.className = 'nav';
  /* ⚠️ 10 sept, au soir — TROIS RONDS, TOUS DE LA MÊME TAILLE. Mickaël : « il faut que
     les ronds soient tous à la même taille, c'est important. Il faut que ce soit beau,
     élégant de partout. » Dans la barre : l'accueil (⌂, caché quand on y est déjà),
     la musique (♪), le menu (≡). Même diamètre, même or, même espacement. */
  const surAccueil = /^ACCUEIL/i.test(ici) || ici === '' || ici === 'site.html';
  /* 11 sept, 1 h — LA MARQUE RETROUVE SON NOM. Mickaël : « j'aimais bien aussi avec le
     texte de Bohème, c'était pas mal. » Le logo et le mot, dans une pastille de la même
     hauteur et du même bord que les ronds : rien ne se touche, tout est au même dessin. */
  nav.innerHTML = '<a class="marque" href="' + lien(PAGES[0]) + '" aria-label="Accueil" title="Accueil"><img src="icone-192.png" alt=""><span>Bohème</span></a>'
    + (surAccueil ? '' : '<a class="rond maison" href="' + lien(PAGES[0]) + '" aria-label="Accueil" title="Accueil"><i class="ico ico-maison"></i></a>')
    + PAGES.slice(0, 7).map(p => '<a class="l' + (p.f === ici ? ' ici' : '') + '" href="' + lien(p) + '"><i class="ico ico-' + p.i + '"></i>' + p.t + '</a>').join('')
    /* 11 sept, 8 h — Mickaël : « tu fais un autre trait en or, et en dessous, dans
       une sorte de carré, tu mets le rond. » La musique et le menu vivent donc dans
       leur propre case, séparée des pages par un trait d'or. Debout, cette case se
       range simplement à droite ; couché, elle se pose au pied de la colonne. */
    + '<div class="basNav"><button class="burger rond" aria-label="Menu"><i></i><i></i><i></i></button></div>';
  const voile = document.createElement('div'); voile.className = 'voile';
  /* 11 septembre — Mickaël : « j'aimerais qu'en bas du menu, un petit carré très
     joli marque la légende : si vous voyez cette couleur, c'est une mise à jour.
     C'est le bon endroit, parce que c'est là qu'on les voit. » */
  voile.innerHTML = '<button class="fermer" aria-label="Fermer le menu"><i></i><i></i></button><nav>'
    + PAGES.map(p => '<a href="' + lien(p) + '"><span><i class="ico ico-' + p.i + '"></i>' + p.t + '</span><small>' + p.s + '</small></a>').join('')
    + '</nav><div class="legendeMenu"><span class="ex">Une page</span>'
    + '<span class="dit">Ce <b>halo bleu</b> veut dire <b>du nouveau depuis ta dernière visite</b>.'
    + ' Tu ouvres la page, il s\u2019éteint.</span>'
    /* 11 septembre — on peut redemander la visite guidee a tout moment. Elle ne
       se propose d'elle-meme qu'une fois, le tout premier jour ; apres, elle est
       ici, en petit, et personne ne tombe dessus par hasard. */
    + '<button class="revoirVisite" type="button"><span class="ico ico-lecture"></span> Revoir la visite guidée</button>'
    /* 12 septembre, 10 h — Mickael : « est-ce que tu peux faire un bouton pour le
       mode essai ? » L'appui long etait invisible et ne lui parlait pas. Un vrai
       bouton, qui dit son etat. Il n'apparait que chez Mickael (son lien) ou
       quand le mode est deja allume : les cinq autres ne le verront pas. */
    + '<button class="modeEssai" type="button" hidden></button></div>';
  const bas = document.createElement('div'); bas.className = 'bas';
  bas.innerHTML = [PAGES[0], PAGES[1], PAGES[2]].map(p => '<a class="' + (p.f === ici ? 'ici' : '') + '" href="' + lien(p) + '"><span class="ico ico-' + p.i + '"></span>' + p.t + '</a>').join('')
    + '<a class="menuBas" href="#"><span>≡</span>Menu</a>';
  {
    const b = voile.querySelector('.revoirVisite');
    b.addEventListener('click', () => {
      document.body.classList.remove('menu');
      if (typeof window.revoirLaVisite === 'function') window.revoirLaVisite();
    });
    /* 12 septembre — un appui LONG bascule le mode essai (la barre ◀ ⏸ ↻ ✎ ▶).
       Mickael n'a ainsi jamais a retaper une adresse sur son telephone. Il faut
       tenir une seconde et demie : personne ne tombe dessus par hasard. */
    let minuteur = null;
    const debut = () => { minuteur = setTimeout(() => {
      minuteur = null;
      if (typeof window.basculerModeEssai === 'function'){
        b.textContent = window.basculerModeEssai();
        setTimeout(() => location.reload(), 900);
      }
    }, 1500); };
    const fin = () => { if (minuteur){ clearTimeout(minuteur); minuteur = null; } };
    b.addEventListener('pointerdown', debut);
    ['pointerup','pointercancel','pointerleave'].forEach(n => b.addEventListener(n, fin));
  }
  {
    const b = voile.querySelector('.modeEssai');
    /* ⚠️ 12 septembre, 17 h — mode essai retire a la demande de Mickael.
       Meme interrupteur que dans visite.js : remettre true pour le rendre. */
    const ESSAI_DISPONIBLE = false;  /* 19 h 30 — « enleve-moi le truc d'essai, je n'en ai plus besoin » */
    const peindre = () => {
      if (!ESSAI_DISPONIBLE){ b.hidden = true; return; }
      let on = false;
      try { on = localStorage.getItem('boheme-visite-essai') === '1'; } catch(e){}
      const moi = (pour || '').toLowerCase() === 'mickael';
      b.hidden = !(on || moi);
      b.textContent = on ? 'Mode essai : allumé — la visite repart à chaque ouverture'
                         : 'Mode essai : éteint';
      b.classList.toggle('allume', on);
    };
    peindre();
    b.addEventListener('click', () => {
      let on = false;
      try {
        on = localStorage.getItem('boheme-visite-essai') !== '1';
        if (on) localStorage.setItem('boheme-visite-essai', '1');
        else localStorage.removeItem('boheme-visite-essai');
      } catch(e){}
      peindre();
      setTimeout(() => location.reload(), 500);
    });
  }
  document.body.prepend(nav, voile, bas);
  const basculer = () => document.body.classList.toggle('menu');
  nav.querySelector('.burger').addEventListener('click', basculer);
  bas.querySelector('.menuBas').addEventListener('click', e => { e.preventDefault(); basculer(); });
  voile.addEventListener('click', e => { if (e.target === voile) basculer(); });
  voile.querySelector('.fermer').addEventListener('click', basculer);
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('menu')) basculer(); });

  /* ═══ ON NE COPIE PLUS, SAUF OÙ C'EST PRÉVU (11 septembre 2026) ═════════
     Le style ferme déjà la sélection. Ces trois gardes ferment le reste : le
     menu du clic droit, le presse-papier, et le glisser d'une image hors de
     l'application. Tout ce qui porte la classe « copiable » reste libre — et
     les boutons qui copient pour toi (le diagnostic, le mode réglage)
     continuent de marcher : ils passent par le presse-papier du système, pas
     par une sélection. */
  const libre = e => e && e.closest && e.closest('input, textarea, [contenteditable="true"], .copiable');

  /* ═══ ET PLUS DE VIBRATION AU DOIGT MAINTENU (11 septembre 2026) ═══════════
     Mickaël : « il y a le téléphone qui réagit comme s'il voulait copier, cette
     petite vibration. Dans une vraie application, ça n'existe pas. »

     Cette secousse vient d'Android : elle accompagne le geste de sélection de
     texte. On ne peut pas commander le vibreur depuis une page — mais on peut
     empêcher le geste d'être reconnu. Le doigt qui reste posé sans bouger voit
     donc son appui long annulé AVANT qu'Android ne le prenne pour une sélection.
     Les endroits qui ont besoin de l'appui long (les boutons de l'atelier, la
     copie prévue) sont épargnés : ils portent leur propre garde. */
  document.addEventListener('touchstart', e => {
    if (libre(e.target)) return;
    if (e.target && e.target.closest && e.target.closest('[data-appui-long], .btn-reg, button, a')) return;
    if (e.touches.length === 1 && e.cancelable) {
      /* on ne bloque pas le toucher : on retire seulement son pouvoir d'ouvrir
         la sélection — c'est le « long press » qu'Android accompagne du vibreur */
      const cible = e.target;
      const annuler = () => { try { getSelection().removeAllRanges(); } catch(x){} };
      setTimeout(annuler, 300); setTimeout(annuler, 520);
    }
  }, { passive: true, capture: true });

  document.addEventListener('contextmenu', e => { if (!libre(e.target)) e.preventDefault(); });
  document.addEventListener('copy', e => { if (!libre(e.target)) e.preventDefault(); });
  document.addEventListener('cut',  e => { if (!libre(e.target)) e.preventDefault(); });
  document.addEventListener('selectstart', e => { if (!libre(e.target)) e.preventDefault(); });
  document.addEventListener('dragstart', e => { if (!libre(e.target)) e.preventDefault(); });

  /* ── UNE SEULE PAGE (11 septembre 2026) ───────────────────────────────
     Pour que la musique ne s'arrête jamais en changeant de page. Chargé avant
     tout le reste, et seulement sur les pages qui s'y prêtent : l'atelier, le
     livre, le guide et la porte gardent leur propre vie. */
  {
    const u = document.createElement('script'); u.src = 'une-seule-page.js';
    (document.body || document.documentElement).appendChild(u);
  }

  /* ── LE LECTEUR VIDÉO (11 sept) ───────────────────────────────────────
     Il ne se charge que si la page contient une vidéo : les autres n'en portent
     pas une ligne. C'est lui qui remplace les boutons de Chrome — et qui évite le
     message « glisser vers le bas » en n'appelant jamais le plein écran système. */
  /* ⚠️ 11 septembre, 18 h 15 — IL SE CHARGE TOUJOURS, MAINTENANT.
     Mickaël : « je vais dans Technique, je retrouve le même truc de vidéos
     Windows. On n'avait pas changé le système de vidéo ? »

     Si, et il marchait. Mais je ne le chargeais que si la page contenait DÉJÀ
     une vidéo au démarrage. Depuis que le site ne recharge plus ses pages, on
     arrive toujours par l'accueil — qui n'en a pas — donc il ne se chargeait
     jamais, et Chrome reprenait la main avec ses trois points.
     Il pèse sept kilo-octets et ne fait rien s'il n'y a pas de vidéo : il est
     donc là dès le départ, une fois pour toutes. */
  {
    const v = document.createElement('script'); v.src = 'video.js';
    (document.body || document.documentElement).appendChild(v);
  }

  /* ── LA VISITE GUIDÉE (11 sept) ───────────────────────────────
     Mickaël : « il faut qu'elle fasse les choses automatiquement. Il faut qu'il
     voie et qu'il ait juste à regarder, comme si c'était une vidéo. »

     Elle ne se propose qu'une fois, et seulement sur l'accueil — mais le fichier
     est là partout, pour qu'on puisse la redemander depuis le menu à tout moment
     (window.revoirLaVisite). Elle pèse peu et ne fait rien tant qu'on ne
     l'appelle pas. */
  {
    /* le texte ecrit des phrases accompagne la visite : il ne sert qu'au mode
       essai, mais il doit etre charge avant lui pour etre deja la. */
    const x = document.createElement('script'); x.src = 'visite-textes.js';
    (document.body || document.documentElement).appendChild(x);
    const g = document.createElement('script'); g.src = 'visite.js';
    (document.body || document.documentElement).appendChild(g);
  }

  /* ── LE MODE RÉGLAGE (11 sept) ────────────────────────────────────────
     Mickaël : « est-ce que je peux te montrer ? » Oui : ?reglage=1 sur n'importe
     quelle page, et il déplace les choses au doigt. Le fichier n'est chargé que
     dans ce cas : le site normal n'en porte pas une ligne. */
  if (reglage){
    /* on le pose tout de suite : le corps existe déjà (la barre vient d'y être
       ajoutée). Passer par l'événement « load » arrivait trop tard, il était
       parfois déjà tiré, et le script n'était jamais posé. */
    const r = document.createElement('script'); r.src = 'reglage.js';
    (document.body || document.documentElement).appendChild(r);
  }

  /* ── le pied de page ───────────────────────────────────────────────── */
  const pied = document.createElement('footer');
  /* 12 septembre, 18 h 15 — Mickael : « la signature Boheme Production, tu la
     fais plus grosse, mais en bas, tout en bas. Portrait et paysage. » Elle
     ferme la page, apres les liens et la ligne du spectacle. */
  pied.innerHTML = '<div class="page">'
    + '<div class="liens">' + PAGES.map(p => '<a href="' + lien(p) + '">' + p.t + '</a>').join('') + '</div>'
    + '<p>Bohème Production · <b>Le Medley des Légendes</b> · Starmania, Notre-Dame de Paris, Les Dix Commandements, Roméo et Juliette · Palais des Festivals, Cannes, 4 octobre 2026</p>'
    + '<img class="signature" src="site-assets/signature-blanc.png" alt="Bohème Production" onerror="this.remove()"></div>';
  document.body.appendChild(pied);


  /* ── les pictogrammes en or remplacent les petits signes des boutons ──── */
  const ICONES = { '→':'fleche', '↗':'fleche', '¶':'livre', '⟳':'maj', '✓':'coche', '✔':'coche', '✦':'etoile',
                   '⇩':'telecharger', '▶':'lecture', '♪':'note', '⌂':'maison', '◎':'scene', '◌':'nouveau' };
  /* les pages écrivent déjà leur pictogramme ; on ne traite que les boutons créés
     à la volée, sinon le signe s'afficherait une fraction de seconde avant d'être
     remplacé — c'est ce clignotement que Mickaël voyait au retour à l'accueil */
  document.querySelectorAll('.btn > b').forEach(b => {
    if (b.querySelector('.ico')) return;
    const n = ICONES[b.textContent.trim()];
    if (n){ const i = document.createElement('span'); i.className = 'ico ico-' + n; b.textContent = ''; b.appendChild(i); }
  });

  /* ── les liens internes gardent le prénom ──────────────────────────── */
  if (suite) document.querySelectorAll('a[href]').forEach(a => {
    const h = a.getAttribute('href');
    if (/^https?:|^#|^mailto:|^tel:/.test(h) || h.includes('?')) return;
    if (/\.html$/i.test(h)) a.setAttribute('href', h + suite);
  });

  /* ── les images : quand elles existent, elles arrivent en fondu ────── */
  /* L'IMAGE SUIT LA ROTATION (7 sept) : l'affiche verticale sur téléphone debout,
     l'horizontale dès qu'on couche le téléphone. Avant, elle était choisie une seule
     fois à l'ouverture : en tournant, on gardait la mauvaise, toute petite au milieu. */
  const debout = () => matchMedia('(max-width: 820px) and (orientation: portrait)').matches;
  function bonneImage(el){
    const p = el.getAttribute('data-img-portrait');
    return (p && debout()) ? p : el.getAttribute('data-img');
  }
  /* ═══ CE QUI DOIT REVIVRE À CHAQUE PAGE (11 septembre 2026) ═══════════════
     Depuis que le site ne recharge plus ses pages (voir une-seule-page.js), tout
     ce qui se faisait « une fois au démarrage » doit pouvoir se refaire. On le
     range donc dans une fonction qu'on rappelle à chaque arrivée. */
  let aImages = [];
  function poserImages(){
  aImages = [...document.querySelectorAll('[data-img]')];
  aImages.forEach(el => {
    if (el._img) return;                       /* déjà servie */
    const img = new Image();
    img.onload = () => {
      el.appendChild(img); requestAnimationFrame(() => img.classList.add('la'));
      /* l'affiche porte déjà son titre gravé : le texte de secours s'efface */
      const carte = el.closest('.monde, .ouverture, .tuile, .enTete'); if (carte) carte.classList.add('a-image');
    };
    img.onerror = () => {};       /* pas d'image : le fond dessiné reste */
    img.alt = ''; img.src = bonneImage(el);
    el._img = img;
  });
  document.querySelectorAll('[data-video]').forEach(el => {
    if (el._video) return;
    const v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
    v.src = el.getAttribute('data-video'); el._video = v;
    v.addEventListener('canplay', () => { el.appendChild(v); requestAnimationFrame(() => v.classList.add('la')); v.play().catch(() => {}); }, { once: true });
    v.addEventListener('error', () => {});
  });
  }
  poserImages();
  function suivreRotation(){
    aImages.forEach(el => {
      if (!el._img || !el.getAttribute('data-img-portrait')) return;
      const veut = bonneImage(el);
      const a = document.createElement('a'); a.href = veut;     /* pour comparer des adresses complètes */
      if (el._img.src === a.href) return;
      el._img.src = veut;
    });
  }
  addEventListener('resize', suivreRotation, { passive: true });
  addEventListener('orientationchange', () => setTimeout(suivreRotation, 80), { passive: true });
  /* ── la révélation au défilement ───────────────────────────────────── */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('vu'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  function reveler(){ document.querySelectorAll('.rev:not(.vu)').forEach(el => io.observe(el)); }
  reveler();

  /* ═══ LE RÉVEIL, à chaque page qui arrive sans rechargement ═══════════════ */
  window.reveillerLaPage = function(){
    poserImages();
    reveler();
    /* ⚠️ 11 septembre, 19 h — LE HALO NE S'ÉTEIGNAIT PLUS.
       Mickaël : « je clique sur les trucs et ça ne part pas. Ça ne veut rien
       dire d'avoir cette couleur si, après l'avoir regardé, elle ne disparaît
       pas. » C'était juste : on marquait la page « vue » UNE SEULE FOIS au
       chargement — or la page ne se recharge plus. On la marque donc à chaque
       arrivée, et le halo s'éteint sous ses yeux. */
    try {
      const ouJeSuis = decodeURIComponent(location.pathname.split('/').pop() || '');
      if (NOUVEAU.includes(ouJeSuis)) localStorage.setItem('boheme-vu-' + ouJeSuis, VERSION_SITE);
    } catch(e){}
    if (typeof pastiller === 'function') pastiller();
    /* les liens de la page neuve doivent porter le prénom, comme les autres */
    if (suite) document.querySelectorAll('a[href$=".html"]').forEach(a => {
      const h = a.getAttribute('href') || '';
      if (h.includes('?') || /^(http|#|javascript:)/.test(h)) return;
      a.setAttribute('href', h + suite);
    });
    /* et la barre du bas doit savoir où l'on est */
    const ou = decodeURIComponent(location.pathname.split('/').pop() || '');
    document.querySelectorAll('.nav a.l, .bas a, .voile a').forEach(a => {
      const h = decodeURIComponent((a.getAttribute('href') || '').split('?')[0]);
      a.classList.toggle('ici', h === ou);
    });
  };

  /* ── l'ouverture : deux calques en parallaxe, par transform seulement ── */
  const fond = document.querySelector('.ouverture .fond, .enTete .fond');
  const texte = document.querySelector('.ouverture .texte');
  /* la profondeur ne s'applique plus au texte sur téléphone : il défilait moins vite
     que la page et se faisait recouvrir par la section suivante (7 sept) */
  const petitEcran = matchMedia('(max-width: 820px)').matches;
  if (fond && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    let y = 0, demande = false;
    const peindre = () => { demande = false; fond.style.transform = 'translate3d(0,' + (y * .22) + 'px,0)'; if (texte && !petitEcran) texte.style.transform = 'translate3d(0,' + (y * .08) + 'px,0)'; };
    addEventListener('scroll', () => { y = Math.min(scrollY, innerHeight * 1.2); if (!demande){ demande = true; requestAnimationFrame(peindre); } }, { passive: true });
  }

  /* l'ouvrier de service force le réseau pour les pages, le style et les scripts :
     sans lui, GitHub Pages fait garder les fichiers dix minutes et la mise à jour tourne en rond */
  if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').then(r => r.update()).catch(() => {});
  }

  /* ── LA MISE À JOUR, comme dans l'atelier : un petit mot qui répond ──
     Elle vérifie à l'ouverture, sans déranger, et dit toujours où on en est.
     Les nouveautés du jour allument une pastille sur les pages concernées. */
  /* Ce qui a changé aujourd'hui. Une page retirée d'ici perd son halo rosé.
     11 septembre : ajout de la Mise en scène et des Vidéos, pour que Mickaël
     voie le halo en vrai — c'est ce qu'il m'a demandé. */
  /* ⚠️ 11 septembre 2026 — ON N'ANNONCE QUE CE QUI A VRAIMENT CHANGÉ.
     Mickaël : « je n'ai rien fait comme mise à jour sur la mise en scène, ni sur
     la vidéo. Il ne faut pas faire des faux trucs. » J'avais allumé ces deux
     pages pour lui MONTRER le halo : c'était un mensonge à l'écran. Retirées.

     Ce qui mérite le halo, ce sont les changements qu'il décide : un texte
     modifié dans le medley, une répartition, une mise en scène écrite, un
     document ajouté, une date. Jamais une retouche de mon côté. */
  /* ⚠️ 11 septembre, 19 h 30 — LA LISTE EST VIDE, ET C'EST VOLONTAIRE.
     Mickaël : « qui chante quoi, il n'y a pas eu de changement. Il faut faire
     attention dans les mises à jour, il ne faut pas faire n'importe quoi. »

     Il a raison, et deux fois plutôt qu'une : le halo ne vaut que s'il dit la
     vérité. Un halo posé sur une page qui n'a pas bougé, c'est une promesse
     qu'on ne tient pas — et au troisième mensonge, plus personne ne le regarde.

     Cette liste ne se remplit donc QUE sur sa parole, quand il a vraiment changé
     quelque chose : un texte du medley, une répartition, une mise en scène
     écrite, un document, une date. Jamais une retouche de mon côté. */
  const NOUVEAU = [];
  const mot = document.createElement('div'); mot.className = 'mot';
  document.body.appendChild(mot);
  let motMinuteur = null;
  function dire(html, duree){
    clearTimeout(motMinuteur); mot.innerHTML = html; mot.classList.add('la');
    if (duree) motMinuteur = setTimeout(() => mot.classList.remove('la'), duree);
  }
  mot.addEventListener('click', () => mot.classList.remove('la'));
  window.direBoheme = dire;

  async function chercherMaj(silencieux){
    if (!silencieux) dire('⟳ Je cherche s\'il y a du nouveau…', 0);
    try {
      /* la version vit dans site.js : c'est lui qu'on interroge, pas la page */
      const r = await fetch('site.js?verif=' + Date.now(), { cache: 'no-store' });
      const t = await r.text();
      const m = t.match(/const VERSION_SITE = '([^']+)'/);
      const enLigne = m ? m[1] : null;
      if (!enLigne){ if (!silencieux) dire('Je n\'ai pas pu vérifier. Réessaie dans un moment.', 5000); return; }
      if (enLigne === VERSION_SITE){
        try { sessionStorage.removeItem('boheme-maj-tentee'); } catch(e){}
        if (!silencieux) dire('✔ Tu as déjà la <b>dernière version</b>.<br><span class="pt">Version ' + VERSION_SITE + '</span>', 5000);
        return;
      }
      /* ─── LE GARDE-FOU (7 sept) ──────────────────────────────────────────
         On ne recharge qu'UNE fois pour une version donnée. Si le navigateur
         resert quand même l'ancien fichier, on ne recommence pas : on le dit. */
      let dejaTentee = null;
      try { dejaTentee = sessionStorage.getItem('boheme-maj-tentee'); } catch(e){}
      if (dejaTentee === enLigne){
        dire('La nouvelle version est prête, mais ton navigateur garde encore l\'ancienne en mémoire.<br>'
           + '<b>Ferme complètement l\'application, puis rouvre-la</b> : elle sera là.', 9000);
        return;
      }
      try { sessionStorage.setItem('boheme-maj-tentee', enLigne); } catch(e){}
      dire('🎉 Une <b>nouvelle version</b> est arrivée !<br>Je l\'installe…', 0);
      /* on vide aussi les caches de l'application avant de recharger */
      setTimeout(async () => {
        try { if (window.caches) for (const n of await caches.keys()) await caches.delete(n); } catch(e){}
        location.replace(location.pathname + '?maj=' + Date.now() + (pour ? '&pour=' + pour : ''));
      }, 1200);
    } catch(e){ if (!silencieux) dire('Pas de réseau pour l\'instant. Réessaie quand tu auras de la connexion.', 5000); }
  }
  window.chercherMajSite = chercherMaj;
  setTimeout(() => chercherMaj(true), 3500);

  /* la pastille rouge sur ce qui a changé, dans le menu et dans la barre du bas */
  /* une page « nouvelle » qu'on a OUVERTE dans cette version n'a plus de pastille : on note qu'on l'a vue */
  /* ⚠️ 10 septembre — PAS DE PASTILLE À LA TOUTE PREMIÈRE VISITE.
     Mickaël : « si on donne pour la première fois le lien, mettre un truc rouge,
     c'est débile : il n'y a pas de raison, ils viennent de l'avoir. » Une pastille
     dit « ça a changé DEPUIS LA DERNIÈRE FOIS » — encore faut-il une dernière fois.
     Au tout premier passage, on note simplement la version et on n'allume rien. */
  let premiereVisite = false;
  try {
    if (!localStorage.getItem('boheme-site-connu')){
      premiereVisite = true;
      localStorage.setItem('boheme-site-connu', VERSION_SITE);
      NOUVEAU.forEach(p => localStorage.setItem('boheme-vu-' + p, VERSION_SITE));
    }
  } catch(e){}
  const vu = p => { try { return localStorage.getItem('boheme-vu-' + p) === VERSION_SITE; } catch(e){ return false; } };
  try { if (NOUVEAU.includes(ici)) localStorage.setItem('boheme-vu-' + ici, VERSION_SITE); } catch(e){}
  /* et quand tout a été vu, plus une seule pastille nulle part */
  window.toutEstVu = () => NOUVEAU.every(vu);
  function pastiller(){
    document.querySelectorAll('.duNeuf').forEach(e => { const h = (e.getAttribute('href')||'').split('?')[0];
      if (!NOUVEAU.includes(decodeURIComponent(h)) || vu(decodeURIComponent(h))) e.classList.remove('duNeuf'); });
    document.querySelectorAll('.nav a.l, .voile a, .bas a').forEach(a => {
      const h = decodeURIComponent((a.getAttribute('href') || '').split('?')[0]);
      if (NOUVEAU.includes(h) && !vu(h) && !a.querySelector('.pastille')){
        /* 11 sept — Mickaël : « au lieu d'un petit point rouge, pourquoi ne pas
           mettre un dégradé de couleur sur toute la partie où il y a du nouveau ?
           Comme ça ils savent exactement, et en même temps c'est joli. » La ligne
           entière s'éclaire donc d'un souffle rouge ; le point reste, minuscule,
           pour ceux qui ne distinguent pas bien les couleurs. */
        a.classList.add('duNeuf');
        const i = document.createElement('i'); i.className = 'pastille'; i.title = 'du nouveau ici'; a.appendChild(i);
      }
    });
    /* 17 h 45 — les traits du menu s'eclairent en bleu tant qu'il reste du neuf
       non vu : c'est ce que la voix de la visite promet depuis ce matin. */
    const resteDuNeuf = NOUVEAU.some(h => !vu(h));
    document.querySelectorAll('.nav .burger').forEach(b => b.classList.toggle('duNeuf', resteDuNeuf));
  }
  pastiller();

  /* ── le bouton « j'ai tout reçu » ───────────────────────────────────── */
  /* ═══ L'ACCUSÉ DE RÉCEPTION (refait le 11 septembre 2026) ══════════════════
     Mickaël : « quand je suis la première personne, il est marqué "j'ai tout reçu",
     il ne va pas comprendre pourquoi. Quand c'est en rouge, c'est que j'attends de
     savoir si c'est bon. Après, c'est en vert quand ça a été fait. Et il peut y
     avoir une autre option : s'il y a un souci. »

     Trois états, donc :
       • ROUGE   — personne n'a encore rien dit. Le bouton demande, et il explique.
       • VERT    — le message est parti. Le bouton devient un constat, plus une demande.
       • et à côté, toujours, une petite porte « j'ai un souci » qui prépare
         l'autre message.
     Le message est écrit d'avance : il n'a qu'à choisir le groupe et envoyer. */
  const recu = document.querySelector('[data-recu]');
  if (recu){
    const NUMERO = recu.getAttribute('data-recu');   /* numéro WhatsApp, format international sans + ; vide = il choisit */
    const qui = pour ? pour.charAt(0).toUpperCase() + pour.slice(1) : '';
    const lien = t => (NUMERO ? 'https://wa.me/' + NUMERO + '?text=' : 'https://wa.me/?text=') + encodeURIComponent(t);
    const CLE = 'boheme-recu-dit-2';
    const dit = () => { try { return localStorage.getItem(CLE) === '1'; } catch(e){ return false; } };

    const bon  = (qui ? qui + ' : ' : '') + 'j\u2019ai bien l\u2019application Bohème, tout est OK pour moi.';
    const souci= (qui ? qui + ' : ' : '') + 'j\u2019ai un problème technique avec l\u2019application Bohème — ';

    /* la petite porte « j'ai un souci », posée juste après le bouton */
    const pb = document.createElement('a');
    pb.className = 'btn doux souci';
    /* ⚠️ 12 septembre — Mickael : « est-ce que le mot "j'ai un souci" est bien ?
       Est-ce que ce n'est pas mieux "j'ai un probleme technique" ? »
       « Souci » etait accueillant mais flou : on peut avoir un souci avec sa
       repartition ou avec une date. Le nouveau nom dit de quoi il s'agit. */
    pb.innerHTML = 'J\u2019ai un problème technique <b><i class="ico ico-fleche"></i></b>';
    pb.href = lien(souci); pb.target = '_blank'; pb.rel = 'noopener';
    pb.title = 'préparer un message pour dire ce qui ne va pas';

    /* ═══ UNE FOIS ENVOYÉ, LE BOUTON S'EFFACE (11 septembre 2026, 19 h 45) ═══
       Mickaël : « voir "C'est envoyé, merci" à chaque fois et que ça reste comme
       ça, c'est un petit peu nul. Si ça a été envoyé, c'est terminé. »
       Sa proposition — le garder quinze secondes — demandait de deviner quand il
       regarde l'écran. Plus simple : le gros bouton disparaît pour de bon dès
       que c'est envoyé, et « J'ai un souci » devient le bouton principal. À la
       visite suivante, il n'y a même plus le constat. */
    const peindre = () => {
      const v = dit();
      recu.classList.toggle('faitVert', v);
      recu.classList.toggle('aFaireRouge', !v);
      /* 14 h 30 — le bouton vert reste affiche a chaque visite : c'est la cle validee */
      recu.innerHTML = v
        ? 'C\u2019est envoyé, merci <b><i class="ico ico-coche"></i></b>'
        : 'Dis-moi que tout s\u2019ouvre <b><i class="ico ico-coche"></i></b>';
      recu.href = lien(bon);
      recu.target = '_blank'; recu.rel = 'noopener';
    };
    peindre();
    recu.insertAdjacentElement('afterend', pb);
    /* ⚠️ 13 septembre, 10 h 45 — Mickael : « il y avait la barre githublien en
       haut, je ne veux jamais la voir. » Le lien wa.me s'ouvrait dans un onglet
       de navigateur PAR-DESSUS l'application, et c'est cet onglet qu'on
       retrouvait au retour. On ouvre WhatsApp lui-meme (whatsapp://), sans
       onglet ; si rien ne s'est passe en 1,6 s (WhatsApp absent), le lien web
       prend le relais. */
    const ouvrirWhatsApp = (a, texte) => (e) => {
      e.preventDefault();
      const direct = (NUMERO ? 'whatsapp://send?phone=' + NUMERO + '&text=' : 'whatsapp://send?text=') + encodeURIComponent(texte);
      const t0 = Date.now();
      const secours = setTimeout(() => {
        if (document.visibilityState === 'visible' && Date.now() - t0 < 2500) window.open(a.href, '_blank', 'noopener');
      }, 1600);
      document.addEventListener('visibilitychange', () => { if (document.visibilityState !== 'visible') clearTimeout(secours); }, { once: true });
      try { location.href = direct; } catch(x){ clearTimeout(secours); window.open(a.href, '_blank', 'noopener'); }
    };
    /* iPhone : on ne change RIEN. wa.me y ouvre deja l'application WhatsApp
       sans onglet, et un whatsapp:// rate y afficherait une alerte de Safari.
       Le detour direct ne vaut que pour Android. */
    const surAndroid = /Android/i.test(navigator.userAgent);
    if (surAndroid){
      recu.addEventListener('click', e => ouvrirWhatsApp(recu, bon)(e));
      pb.addEventListener('click', e => ouvrirWhatsApp(pb, souci + ' ')(e));
    }

    /* ═══ ON NE CROIT PLUS LE CLIC : ON DEMANDE (12 septembre 2026) ═══
       Mickaël : « si Bry, ou n'importe qui, va sur WhatsApp et finalement change
       d'avis, revient en arrière — ça va effacer le machin comme s'il avait été
       envoyé, alors que ça n'a pas été envoyé. »

       Il a raison, et c'était un vrai trou. Je notais « envoyé » une seconde et
       demie après l'appui, c'est-à-dire au moment où WhatsApp s'ouvre — pas au
       moment où le message part. Ouvrir n'est pas envoyer. Un chanteur qui
       hésite et revient en arrière disparaissait de la liste sans avoir rien
       dit, et Mickaël l'aurait compté comme prévenu.

       Alors on demande, à son retour : « Tu as bien envoyé ? » Tant qu'il n'a
       pas répondu oui, le bouton reste rouge. C'est la même règle que dans la
       visite guidée, et pour la même raison : on ne devine pas un fait, on le
       constate. */
    const effacerLeBouton = () => {
      recu.style.transition = 'opacity .8s ease, max-height .8s ease, margin .8s ease, padding .8s ease';
      recu.style.opacity = '0'; recu.style.maxHeight = '0';
      recu.style.margin = '0'; recu.style.paddingTop = '0'; recu.style.paddingBottom = '0';
      setTimeout(() => { recu.style.display = 'none'; }, 900);
      pb.classList.remove('doux');
    };

    /* « c'est envoye » : le bouton passe au vert, puis s'efface. La visite
       guidee appelle ceci quand il repond oui a SA question, pour que le vert
       arrive AVANT la voix qui le nomme. */
    /* ⚠️ 12 h 30 — Mickael : « quand il passe au vert, il disparait bizarrement
       et ce n'est pas beau. Tu laisses le bouton vert, et a la fin de la
       phrase, tu effaces tout d'un coup. » Pendant la visite, c'est donc la
       visite qui decide du moment, et l'effacement est net : pas de fondu qui
       traine. Hors visite, on garde le fondu doux six secondes apres. */
    const effacerNet = () => { recu.style.display = 'none'; pb.classList.remove('doux'); };
    const marquerEnvoye = (sansEffacer) => {
      recu.dataset.vientDeLEnvoyer = '1';
      try { localStorage.setItem(CLE, '1'); } catch(e){}
      peindre(); direMot();
      /* 14 h 30 — plus d'effacement, ni ici ni dans la visite : « il restera
         toujours en vert, comme une cle validee ». */
    };
    window.marquerLeRecuEnvoye = marquerEnvoye;
    window.effacerLeRecuNet = effacerNet;
    /* 13 h 55 — pour ses essais : « quand je retourne en arriere, ca ne va pas
       sur le truc rouge, c'est comme si c'etait saute. » Le bouton envoye est
       efface, et l'arret d'un bouton absent se saute. En mode essai, on le
       remet en rouge a chaque passage. */
    window.remettreLeRecuRouge = () => {
      try { localStorage.removeItem(CLE); } catch(e){}
      delete recu.dataset.vientDeLEnvoyer;
      recu.style.display = ''; recu.style.opacity = ''; recu.style.maxHeight = '';
      recu.style.margin = ''; recu.style.paddingTop = ''; recu.style.paddingBottom = '';
      pb.classList.add('doux');
      peindre(); direMot();
    };

    const demanderSiEnvoye = () => {
      if (document.querySelector('.boiteEnvoye')) return;
      /* ⚠️ 12 septembre — Mickaël : « même s'il a mis "plus tard" sur le système
         d'aide et qu'il est revenu, il y aura une question à chaque fois. »

         Ma condition était trop large : je me taisais pendant TOUTE la visite.
         Or « plus tard » dans la visite ne veut pas dire « plus jamais » : s'il
         appuie ensuite sur le bouton de sa propre main, il faut lui demander,
         visite en cours ou pas. Il n'y a qu'un seul cas à éviter, et c'est le
         doublon au même instant : quand la visite a SA question à l'écran. */
      if (document.querySelector('#vDemande')) return;
      const b = document.createElement('div');
      b.className = 'boiteEnvoye';
      b.innerHTML = '<div class="beBulle"><p>Tu as bien envoyé le message&nbsp;?</p>'
        + '<button class="beOui">Oui, c’est envoyé</button>'
        + '<button class="beNon">Non, pas encore</button></div>';
      document.body.appendChild(b);
      /* elle naît sous son doigt au retour : sourde une demi-seconde */
      b.style.pointerEvents = 'none';
      setTimeout(() => { b.style.pointerEvents = ''; }, 600);
      b.querySelector('.beOui').addEventListener('click', () => { b.remove(); marquerEnvoye(); });
      b.querySelector('.beNon').addEventListener('click', () => b.remove());
    };

    recu.addEventListener('click', () => {
      attendLaReponse = true;
      /* s'il n'a pas quitté la page du tout (le partage s'est ouvert par-dessus,
         ou WhatsApp a refusé de s'ouvrir), on demande quand même au bout de
         quelques secondes : il ne doit jamais rester sans qu'on lui demande. */
      setTimeout(() => { if (attendLaReponse){ attendLaReponse = false; demanderSiEnvoye(); } }, 7000);
    });
    let attendLaReponse = false;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && attendLaReponse){
        attendLaReponse = false;
        setTimeout(demanderSiEnvoye, 600);
      }
    });

    /* le mot d'explication, juste en dessous — il change avec la couleur */
    const mot = document.createElement('p');
    mot.className = 'motRecu';
    const direMot = () => {
      mot.innerHTML = dit()
        ? '<span class="cestNote">C’est noté, merci.</span> S’il t’arrive quoi que ce soit ensuite, la porte ci-dessous reste ouverte.'
        : 'Tant que ce bouton est rouge, c’est que je ne sais pas encore si tout s’ouvre chez toi. '
        + 'Un appui prépare le message : tu n’as plus qu’à choisir le groupe et envoyer.';
    };
    direMot(); pb.insertAdjacentElement('afterend', mot);
    recu.addEventListener('click', () => setTimeout(direMot, 1600));
  }

  /* ═══════════════════════════════════════════════════════════════════════
     LA MUSIQUE DU SITE (10 septembre 2026)

     Trois règles données par Mickaël, dans l'ordre où il les a dites :
       1. « pas trop trop fort, assez bas pour ne pas gêner pendant qu'on
          regarde le site » → volume 0,16, et jamais plus ;
       2. « quand on regarde des vidéos, il faut ABSOLUMENT que ça s'arrête,
          c'est très important » → toute lecture d'un son ou d'une vidéo, où
          que ce soit dans la page, met la musique en pause immédiatement ;
       3. « il faut que le lecteur soit adaptable pour les portables, je ne
          veux en aucun cas que ça gêne » → un simple rond en bas à droite,
          au-dessus de la barre du bas ; il ne se déplie que si on le touche,
          et il se replie tout seul.

     Pour ajouter un morceau : une ligne dans MUSIQUES, et c'est tout.
     ═══════════════════════════════════════════════════════════════════════ */
  (function musique(){
    const MUSIQUES = [
      /* Les noms crachés par Suno ne valaient rien. Mickaël, 11 sept :
         « L'ère des talents, peut-être en jeu de mots — l'air, l'ère. » */
      { f:'media/site/air-sing-boheme.mp3',     t:'L\u2019ère des talents' },
      { f:'media/site/boheme-on-decolle-2.mp3', t:'Avant le lever de rideau' },
      { f:'media/site/boheme-on-decolle-3.mp3', t:'La loge, à trois heures' },
    ];
    if (!MUSIQUES.length) return;
    const VOLUME = 0.16;          /* bas, volontairement */
    const CLE = 'boheme-musique';  /* ce qu'on emporte de page en page */

    /* AU HASARD (10 sept) : « je ne veux pas que ce soit toujours la même chose
       quand on allume la musique. » Le premier morceau est tiré au sort ; ensuite
       c'est celui qu'on écoutait qui reprend, de page en page. */
    let etat = { i: Math.floor(Math.random() * MUSIQUES.length), t:0, joue:null };
    try { etat = Object.assign(etat, JSON.parse(sessionStorage.getItem(CLE) || '{}')); } catch(e){}
    if (etat.i < 0 || etat.i >= MUSIQUES.length) etat.i = Math.floor(Math.random() * MUSIQUES.length);
    const garder = () => { try { sessionStorage.setItem(CLE, JSON.stringify(etat)); } catch(e){} };

    /* ── le lecteur, minuscule ─────────────────────────────────────────── */
    const boite = document.createElement('div');
    boite.className = 'musique';
    boite.innerHTML =
        '<button class="mRond" aria-label="Musique du site"><span class="mIco">♪</span></button>'
      + '<div class="mPan">'
      +   '<button class="mNav" data-m="prec" aria-label="Morceau précédent">‹</button>'
      +   '<span class="mTitre"></span>'
      +   '<button class="mNav" data-m="suiv" aria-label="Morceau suivant">›</button>'
      + '</div>';
    /* ⚠️ 10 septembre — LE LECTEUR MONTE DANS LA BARRE, à côté de « Bohème ».
       Mickaël : « pourquoi tu ne mets pas le lecteur en haut, au niveau de Bohème ? »
       Il avait raison : en bas, il fallait sans cesse le tenir à l'écart de la barre du
       bas et du menu. Dans la barre du haut, il ne peut recouvrir personne — et il se
       trouve du premier coup d'œil, sur les trois dispositions (barre horizontale sur
       ordinateur, réduite sur téléphone debout, colonne à gauche en paysage). */
    /* ordre voulu : ⌂ accueil · ♪ musique · … · ≡ menu */
    const case_ = nav.querySelector('.basNav');
    if (case_) case_.insertBefore(boite, case_.firstChild);          /* ♪ puis ≡, dans leur case */
    else {
      const apres = nav.querySelector('.rond.maison') || nav.querySelector('.marque');
      if (apres && apres.parentNode === nav) apres.insertAdjacentElement('afterend', boite);
      else nav.appendChild(boite);
    }

    const rond   = boite.querySelector('.mRond');
    const ico    = boite.querySelector('.mIco');
    const titre  = boite.querySelector('.mTitre');
    /* l'audio est DANS la page, et pas seulement en mémoire : sinon ses
       événements ne remontent pas au document, et on ne peut plus rien
       vérifier ni surveiller depuis l'extérieur. */
    const son = document.createElement('audio');
    son.preload = 'none'; son.volume = 0; son.style.display = 'none';
    son.setAttribute('data-musique-du-site', '1');
    document.body.appendChild(son);

    /* Il vit maintenant DANS la barre du haut : plus rien à esquiver, plus aucun
       calcul de position. C'est la barre qui le place, comme les autres boutons. */
    /* 11 sept, 10 h — Mickaël : « quand on appuie, il faut qu'on ait la possibilité
       d'avoir le texte, et quand on rappuie dessus, qu'il s'éteigne. » Le panneau ne
       se referme donc plus tout seul au bout de quatre secondes : c'est lui qui décide.
       Il se replie seulement quand on touche ailleurs dans la page. */
    /* 11 sept, 11 h — Mickaël : « il faut que le nom disparaisse après trois ou
       quatre secondes, parce que sinon on le voit en continu, et quand on scrolle
       ce n'est pas extraordinaire. » Il revient dès qu'on retouche la note. */
    let replier = null, tenirOuvert = false;
    const replierPan = () => { if (tenirOuvert) return; clearTimeout(replier); boite.classList.remove('ouvert'); };
    const deplier = () => {
      boite.classList.add('ouvert');
      clearTimeout(replier);
      if (!tenirOuvert) replier = setTimeout(() => boite.classList.remove('ouvert'), 4000);
    };
    /* 12 septembre, 18 h 35 — pour la visite guidee : « il faut que les titres
       restent en bas, ca disparait, ca reapparait, c'est bizarre. » La visite
       tient le panneau ouvert le temps d'en parler, puis le rend. */
    window.__musiquePanneau = (ouvert) => { tenirOuvert = !!ouvert;
      if (ouvert){ boite.classList.add('ouvert'); clearTimeout(replier); }
      else { clearTimeout(replier); boite.classList.remove('ouvert'); } };
    document.addEventListener('click', e => { if (!boite.contains(e.target)) replierPan(); }, true);

    /* CHANGER DE MORCEAU SANS COUPURE (10 sept) : « il faudrait avoir la possibilité
       de la changer et que l'autre musique se mette en marche, sans que ça fasse un
       arrêt ». On descend le son de l'un, on charge l'autre, on remonte : l'oreille
       n'entend pas de trou, juste un passage. */
    function charger(i, jouer, reprise){
      const suivant = ((i % MUSIQUES.length) + MUSIQUES.length) % MUSIQUES.length;
      const enDouceur = jouer && !son.paused;
      const poser = () => {
        etat.i = suivant;
        son.src = MUSIQUES[etat.i].f;
        titre.textContent = MUSIQUES[etat.i].t;
        /* ⚠️ 10 sept, au soir — ON NE REMET PAS LA POSITION À ZÉRO QUAND ON CHANGE DE PAGE.
           Mickaël : « quand on change de page, la musique doit continuer ». Elle
           repartait du début à chaque page : cette ligne effaçait la position
           mémorisée AVANT que le lecteur ait pu la reprendre. Elle ne s'efface plus
           que lorsqu'on change vraiment de morceau. */
        if (!reprise) etat.t = 0;
        garder();
        if (jouer) lancer();
      };
      if (enDouceur) versVolume(0, poser); else poser();
      /* à la reprise d'une page à l'autre, on entre en fondu : le raccord ne
         s'entend pas, là où un démarrage sec faisait « sauter » la musique */
      if (reprise) son.volume = 0;
    }

    /* on monte et on descend en douceur : un son qui claque, c'est laid */
    let fondu = null;
    /* Le fondu : « pas » dit à quelle vitesse on descend ou on monte. Petit, il
       prend son temps — c'est ce qu'il faut pour un adieu. Mickaël : « ça coupe
       d'un coup, ce n'est pas beau du tout. Il faut vraiment que ça coupe
       doucement, en décrescendo. » */
    function versVolume(cible, apres, pas){
      clearInterval(fondu);
      const p = pas || 0.25;
      fondu = setInterval(() => {
        const d = cible - son.volume;
        if (Math.abs(d) < 0.008){ son.volume = cible; clearInterval(fondu); if (apres) apres(); return; }
        son.volume = Math.max(0, Math.min(1, son.volume + d * p));
      }, 40);
    }

    /* arrive-t-on d'une page qu'on vient de quitter ? alors on remonte en douceur */
    let raccord = false;
    try { raccord = sessionStorage.getItem('boheme-musique-raccord') === '1';
          sessionStorage.removeItem('boheme-musique-raccord'); } catch(e){}

    function lancer(){
      if (!son.src) charger(etat.i, false, true);   /* reprise : on garde la position d'une page à l'autre */
      son.volume = 0;
      son.play().then(() => {
        etat.joue = true; garder();
        boite.classList.add('joue'); boite.classList.remove('eteint'); ico.textContent = '♪';
        /* si l'on arrive d'une page qu'on vient de quitter, on remonte LENTEMENT :
           c'est ce qui efface le raccord. Un premier allumage, lui, peut monter
           franchement — on vient de le demander. */
        versVolume(VOLUME, null, raccord ? 0.055 : 0.25);
        raccord = false;
      }).catch(() => {
        /* ⚠️ 10 sept, au soir — UN REFUS N'EST PAS UNE DÉCISION.
           Ici on écrivait « joue = false » : un simple refus passager du navigateur
           (la page vient de s'ouvrir, le son n'est pas encore prêt) se transformait
           en « l'utilisateur l'a éteinte », et la musique ne revenait plus jamais
           d'elle-même en changeant de page. Mesuré : elle continuait sa position
           mais restait en pause. On garde le souhait tel quel, on réessaie dès que
           le son est prêt, et le premier geste la relance de toute façon. */
        boite.classList.remove('joue');
        son.addEventListener('canplay', () => {
          if (etat.joue !== false && son.paused && !autresQuiJouent().length) son.play().then(() => {
            boite.classList.add('joue'); boite.classList.remove('eteint'); versVolume(VOLUME);
          }).catch(()=>{});
        }, { once:true });
      });
    }
    function stopper(garderEtat){
      /* un décrescendo d'environ une seconde : l'oreille l'entend partir,
         elle ne le reçoit pas comme un couperet */
      versVolume(0, () => son.pause(), 0.07);
      if (garderEtat !== 'silencieux'){ etat.joue = false; garder(); }
      boite.classList.remove('joue'); boite.classList.add('eteint'); ico.textContent = '♪';
    }

    rond.addEventListener('click', e => {
      e.stopPropagation();
      if (son.paused) { deplier(); lancer(); }
      else if (!boite.classList.contains('ouvert')) { deplier(); }  /* 1er appui : le titre */
      else { stopper(); replierPan(); }                              /* 2e appui : on éteint */
    });
    boite.querySelectorAll('.mNav').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation(); deplier();
      charger(etat.i + (b.dataset.m === 'suiv' ? 1 : -1), !son.paused || etat.joue);
    }));
    /* ─── UN APPEL ARRIVE : LA MUSIQUE S'EFFACE ────────────────────────────
       Mickaël : « quand il y a quelqu'un qui nous appelle, il ne faut pas que la
       musique continue, il faut qu'elle baisse en fondu, que la personne puisse
       téléphoner tranquillement, et ensuite si vous revenez, la musique se remet
       en marche. » On ne coupe pas : on descend le son, on met en pause, et au
       retour on remonte doucement — mais seulement si elle jouait vraiment. */
    let enPause = false;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden){
        if (!son.paused){ enPause = true; versVolume(0, () => son.pause()); }
      } else if (enPause){
        enPause = false;
        if (etat.joue !== false){ son.play().then(() => versVolume(VOLUME)).catch(()=>{}); }
      }
    });

    /* ═══ ELLE NE SAUTE PLUS EN CHANGEANT DE PAGE (11 septembre 2026) ═══════
       Mickaël : « quand on change de page, la musique saute un peu, et ce n'est
       pas beau. Est-ce que ça peut ne pas sauter ? »

       Oui. Le saut venait de ce qu'on ne notait sa position que toutes les deux
       secondes, pour ménager la mémoire du téléphone : en partant, on pouvait
       donc perdre jusqu'à deux secondes de musique. Maintenant on note la
       position EXACTE au moment précis où la page s'en va — et la suivante
       reprend sur cette seconde-là, en montant le son en un souffle plutôt
       qu'en le rallumant d'un coup. */
    const noterMaintenant = () => {
      try { if (son.src && !isNaN(son.currentTime)) { etat.t = son.currentTime; garder(); } } catch(e){}
    };

    /* ═══ LE RACCORD D'UNE PAGE À L'AUTRE (11 septembre 2026, 17 h) ═══════════
       Mickaël : « la musique saute encore. Fais comme dans Reaper : en passant
       d'une page à l'autre, ça doit donner l'impression d'une seule et même
       musique. »

       Il faut être honnête sur ce qui est possible. Chaque page est un document
       neuf : le son ne peut pas traverser, il est forcément rechargé. Ce qu'on
       PEUT faire, et qui suffit à l'oreille, c'est le raccord des monteurs :
       on DESCEND avant de partir, on REMONTE en arrivant, et on reprend à la
       seconde exacte. L'oreille ne perçoit plus une coupure mais un souffle.

       Pour vraiment n'avoir qu'un seul son continu, il faudrait que le site ne
       change jamais de page — c'est un autre chantier, et je te le dirai
       franchement si tu veux qu'on le fasse. */
    let onSEnVa = false;
    function partirEnDouceur(vers){
      if (onSEnVa) return true;
      if (son.paused || son.volume < 0.02) return false;   /* rien à adoucir */
      onSEnVa = true;
      noterMaintenant();
      try { sessionStorage.setItem('boheme-musique-raccord', '1'); } catch(e){}
      /* 11 septembre — Mickaël : « ça coupe bizarrement, tu ne m'as pas fait le
         fondu. » 420 ms, c'était trop court pour s'entendre. On descend
         maintenant sur près d'une seconde : l'oreille a le temps de le suivre. */
      versVolume(0, () => { location.href = vers; }, 0.10);
      setTimeout(() => { location.href = vers; }, 950);     /* filet de sécurité */
      return true;
    }
    /* ⚠️ 11 septembre, 18 h — DEPUIS LA PAGE UNIQUE, CE FONDU NE SERT PLUS QUE
       DE SECOURS. Quand la page ne se recharge pas, le son ne s'arrête jamais :
       il n'y a rien à adoucir. On ne descend donc le volume QUE si l'on part
       vraiment — vers l'atelier, le livre, le guide, ou hors du site. */
    document.addEventListener('click', e => {
      const a = e.target && e.target.closest && e.target.closest('a[href]');
      if (!a || a.target || e.defaultPrevented) return;
      const h = a.getAttribute('href') || '';
      if (/^(#|javascript:|mailto:|tel:)/.test(h)) return;
      try { if (new URL(a.href).origin !== location.origin) return; } catch(err){ return; }
      if (window.__pageUnique && window.__pageUnique(a.href)) return;   /* on ne quitte pas : rien à faire */
      if (partirEnDouceur(a.href)){ e.preventDefault(); e.stopPropagation(); }
    }, true);
    addEventListener('pagehide', noterMaintenant);
    addEventListener('beforeunload', noterMaintenant);
    document.addEventListener('visibilitychange', () => { if (document.hidden) noterMaintenant(); });
    /* et tout lien touché note la position avant même que la page parte */
    document.addEventListener('click', e => {
      const a = e.target && e.target.closest && e.target.closest('a[href]');
      if (a && !a.target && !/^(#|javascript:)/.test(a.getAttribute('href') || '')) noterMaintenant();
    }, true);

    son.addEventListener('ended', () => charger(etat.i + 1, true));
    son.addEventListener('timeupdate', () => {
      if (son.currentTime - etat.t > 2){ etat.t = son.currentTime; garder(); }
    });

    /* ── LA RÈGLE ABSOLUE : un autre son démarre, la musique s'arrête ──── */
    let repriseEnAttente = null;
    const autresQuiJouent = () => [...document.querySelectorAll('audio, video')]
      .filter(m => m !== son && !m.hasAttribute('data-musique-du-site') && !m.paused && !m.ended);

    document.addEventListener('play', e => {
      if (e.target === son || e.target.hasAttribute?.('data-musique-du-site')) return;
      clearTimeout(repriseEnAttente);
      if (!son.paused){ boite.classList.add('endormie'); stopper('silencieux'); }
    }, true);

    /* ⚠️ On ne peut PAS se fier au seul signal d'arrêt : si la vidéo est
       retirée de la page (ce que font les lecteurs qui se referment), son
       « pause » ne remonte jamais jusqu'ici — mesuré le 10 septembre, la
       musique restait endormie pour toujours. Alors on regarde nous-mêmes,
       trois fois toutes les cinq secondes : plus rien ne joue depuis trois
       secondes, la musique revient. Trois secondes, pour qu'elle ne reparte
       pas entre deux vidéos et ne hache pas tout. */
    let silenceDepuis = 0;
    setInterval(() => {
      if (!etat.joue) return;
      if (autresQuiJouent().length){ silenceDepuis = 0; return; }
      if (!son.paused){ silenceDepuis = 0; boite.classList.remove('endormie'); return; }
      silenceDepuis += 1;
      if (silenceDepuis >= 2){          /* 2 × 1,5 s = 3 s de vrai silence */
        silenceDepuis = 0;
        boite.classList.remove('endormie');
        lancer();
      }
    }, 1500);

    /* ── on reprend là où on en était, de page en page ─────────────────── */
    charger(etat.i, false, true);   /* reprise : on garde la position d'une page à l'autre */
    son.addEventListener('loadedmetadata', () => {
      if (etat.t > 1 && etat.t < son.duration - 2) son.currentTime = etat.t;
    }, { once:true });

    /* ELLE PART TOUTE SEULE AU PREMIER GESTE (10 sept) : « dès qu'on clique, ça fait
       démarrer la musique. Après, s'ils veulent l'arrêter, c'est eux qui l'arrêtent. »
       Trois états, et c'est ce qui fait toute la différence :
         null  → personne n'a encore rien décidé : le premier geste la lance ;
         true  → on l'a voulue : elle reprend de page en page ;
         false → on l'a ÉTEINTE : on n'y revient plus jamais tout seul.
       Les navigateurs interdisent de démarrer un son sans geste : on attend donc
       le premier toucher, où qu'il soit — jamais avant. */
    if (etat.joue === true){
      son.preload = 'auto';
      if (!autresQuiJouent().length) lancer();
    }
    if (etat.joue !== false){
      const auPremierGeste = e => {
        if (e && e.target && e.target.closest && e.target.closest('.musique')) return;  /* le rond se gère seul */
        if (etat.joue === false) return;
        if (son.paused && !autresQuiJouent().length) lancer();
        retirer();
      };
      const retirer = () => {
        removeEventListener('pointerdown', auPremierGeste, true);
        removeEventListener('keydown', auPremierGeste, true);
      };
      addEventListener('pointerdown', auPremierGeste, { capture:true, passive:true });
      addEventListener('keydown', auPremierGeste, true);
    }
    titre.textContent = MUSIQUES[etat.i].t;
  })();
})();
