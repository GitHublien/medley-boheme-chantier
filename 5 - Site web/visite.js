/* ═══════════════════════════════════════════════════════════════════════════
   LA VISITE GUIDÉE — l'application se présente elle-même (11 septembre 2026)

   Mickaël : « il faut qu'elle fasse les choses automatiquement. Il faut qu'il
   voie et qu'il ait juste à regarder, comme si c'était une vidéo. Vraiment
   interactif pour le coup. »

   ★ LA RÈGLE

   Il ne touche à rien. Les pages s'ouvrent seules, le menu se déroule seul, le
   projecteur se déplace seul. Trois exceptions, et trois seulement : le choix
   du départ, le bouton rouge (c'est à lui de décider), et tourner le téléphone.

   ★ POURQUOI C'EST POSSIBLE AUJOURD'HUI ET PAS HIER

   Parce que le site ne recharge plus ses pages (voir une-seule-page.js). Une
   voix peut donc parler pendant qu'on ouvre l'atelier, revenir à l'accueil,
   filer vers les textes — sans une seule coupure. Hier, chaque lien aurait
   tué la voix net.

   ★ LA MÉCANIQUE

   Une suite d'arrêts. Chaque arrêt dit : quel son jouer, quoi éclairer, quel
   geste faire avant, et combien de temps attendre. Le son commande le rythme :
   on passe à l'arrêt suivant quand la phrase est finie, jamais avant.

   ★ CE QUI NE DOIT JAMAIS ARRIVER

   Qu'on reste coincé. Si un son manque, si une page ne répond pas, si le doigt
   se pose sur l'écran — la visite continue, se met en pause proprement, ou se
   termine. Elle ne bloque personne, jamais.
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
  const CLE_VUE = 'boheme-visite-vue-2';
  const CLE_OU  = 'boheme-visite-ou-2';      /* ou il en etait, s'il a ete interrompu */
  const DOSSIER = 'media/visite/';

  /* qui est là, et donc quelle voix lui parle */
  const VOIX_DE = { adrien:'leda', mickael:'leda', bry:'leda', elie:'leda',
                    /* ⚠️ 12 septembre — Mickael a choisi ALGENIB a l'oreille, apres
                       treize essais mesures : c'est la plus grave des voix d'homme
                       de Gemini. Ce nom-la doit changer ICI AUSSI, sinon le site
                       continue de demander les anciens fichiers « --charon » et
                       les nouveaux ne sont jamais joues. Vu avant publication. */
                    stephanie:'algenib', candice:'algenib' };
  let qui = '';
  try { qui = (new URLSearchParams(location.search).get('pour')
            || localStorage.getItem('boheme-pour') || '').toLowerCase(); } catch(e){}
  const voix = VOIX_DE[qui] || 'leda';

  /* ⚠️ QUAND UNE VOIX EST REFAITE, LE FICHIER GARDE SON NOM — et le telephone
     sert alors l'ancienne, qu'il garde en reserve pendant dix minutes. On colle
     donc un numero derriere l'adresse : il change le jour ou je refabrique des
     voix, et ce jour-la seulement. Le reste du temps, rien n'est retelecharge.
     (La meme lecon que les portraits, qu'il a fallu renommer en -2.jpg.) */
  const VOIX_VERSION = '12175';
  const sonCommun = n => DOSSIER + n + '--' + voix + '.mp3?v=' + VOIX_VERSION;
  const sonPerso  = n => DOSSIER + n + '--' + (qui || 'adrien') + '.mp3?v=' + VOIX_VERSION;

  /* ── les douze arrêts ─────────────────────────────────────────────────── */
  /* Chaque arret porte un nom : c'est ce que Mickael verra dans le mode essai,
     et c'est ce qui rendra ses notes utilisables. « Arret 7, le menu » se
     corrige ; « ca ne va pas » ne se corrige pas. */
  const ARRETS = [
    /* ═══════════════════════════════════════════════════════════════════
       LE NOUVEL ORDRE — valide par Mickael le 12 septembre a 14 h 45.
       « On suit la page. Un gros cadre, on zoome, on dezoome, on passe au
       suivant. On ne bouge plus d'un cote et de l'autre. »
       Une seule descente, du haut en bas de l'accueil, puis la barre du bas,
       le menu du haut, la musique, le paysage, la fin. Chaque arret glisse
       jusqu'a sa cible a la vitesse de sa main, et la lumiere epouse la forme
       de l'objet. Le zoom : « vise » large, puis « pendant » resserre.
       ═══════════════════════════════════════════════════════════════════ */

    /* 1 · le visage, puis l'arrivee */
    { son: sonPerso('01-bonjour'),        vise: null, nom: "L’accueil" },

    /* 2 · la page d'accueil : son geste, enregistre a sa main */
    { nom: 'La page d’accueil', vise: null, avant: 'effacerLeVisage',
      etapes: [
        { son: sonCommun('01b-accueil') },
        { attendre: 700 },
        { geste: 'defilerCommeLui' },
        { son: sonCommun('01d-en-haut') },
      ] },

    /* 3 · la carte de l'essentiel, en gros */
    { son: sonCommun('03-la-carte'), nom: 'La carte',
      vise: '.carteEssentiel' },

    /* 4 · zoom sur le bouton rouge ; le vert reste */
    { son: sonPerso('02-le-bouton-rouge'), nom: 'Le bouton rouge',
      vise: '.carteEssentiel .ceLigne:first-child a[data-recu]', sauterSiAbsent: true, sauterSiVert: true,
      demande: { texte: 'Tu veux le faire maintenant ?',
                 oui: 'Je le fais maintenant', non: 'Plus tard',
                 fait: '.carteEssentiel .ceLigne:first-child a[data-recu]' } },

    /* 5 · zoom sur « j'ai un probleme technique » */
    { son: sonCommun('05-probleme'), nom: 'Un problème technique',
      vise: '.carteEssentiel .ceLigne:first-child a.souci' },

    /* 6 · zoom sur « mise a jour » */
    { son: sonCommun('02b-mises-a-jour'), nom: 'Les mises à jour',
      vise: '.carteEssentiel .ceLigne:last-child button' },

    /* 7 · zoom sur la legende du halo bleu */
    { son: sonCommun('07-halo-bleu'), nom: 'Le halo bleu',
      vise: '.carteEssentiel .legendeNeuf', sauterSiAbsent: true },

    /* 8 a 16 · les tuiles, dans l'ordre de la page */
    { son: sonCommun('05-atelier'),      nom: "L’atelier",              vise: 'a[href*="KARAOKE"].tuile' },
    { son: sonCommun('06-textes'),       nom: 'Les textes',             vise: 'a[href*="LIVRE"].tuile' },
    { son: sonCommun('10-qui-chante'),   nom: 'Qui chante quoi',        vise: 'a[href*="QUI CHANTE"].tuile' },
    { son: sonCommun('11-mise-en-scene'),nom: 'La mise en scène',       vise: 'a[href*="MISE EN SC"].tuile' },
    { son: sonCommun('12-documents'),    nom: 'Les documents',          vise: 'a[href*="DOCUMENTS"].tuile' },
    { son: sonCommun('13-technique'),    nom: 'La technique',           vise: 'a[href*="VID"].tuile' },
    { son: sonCommun('02f-le-film'),     nom: 'Le film',                vise: 'a[href*="revoir=1"].tuile' },
    { son: sonCommun('15-rendez-vous'),  nom: 'Le rendez-vous',         vise: 'a[href*="CALENDRIER"].tuile' },
    { son: sonCommun('02e-les-infos'),   nom: 'Les informations utiles',vise: 'a[href*="BIENVENUE"].tuile' },

    /* 17 · les quatre mondes, puis les six : la page glisse le long */
    /* la section fait 2 400 pixels : la lumiere glisse monde par monde, au
       rythme ou la voix les nomme, puis sur les six. */
    { son: sonCommun('17-quatre-mondes'), nom: 'Quatre mondes',
      vise: '.mondes .monde.monopolis',
      pendant: [ { part: 0.30, geste: 'rien', vise: '.mondes .monde.notredame' },
                 { part: 0.40, geste: 'rien', vise: '.mondes .monde.egypte' },
                 { part: 0.50, geste: 'rien', vise: '.mondes .monde.romeo' },
                 { part: 0.62, geste: 'rien', vise: '.six' } ] },

    /* 18 · la barre du bas */
    { son: sonCommun('04-barre-du-bas'), nom: 'La barre du bas',
      vise: '.bas',
      pendant: [ { part: 0.70, geste: 'rien', vise: '.bas .menuBas' } ] },

    /* 19 · le menu du haut : on remonte, il s'ouvre, on referme, le logo */
    { son: sonCommun('07-menu'), nom: 'Le menu', vise: null,
      avant: 'remonterEnHaut',
      /* 17 h 45 — Mickael : « quand elle dit "les nouveautes et ton prenom",
         eclaire-les, au moment ou elle le dit, en jaune. » Mesure a la machine
         sur les deux voix : « nouveautes » a 39-40 % de la phrase, « prenom » a
         43-45 %, « halo bleu » a 67-68 %, « je le referme » a 80 %. */
      /* 18 h 05 — Mickael : « tu laisses le menu en entier, tu les eclaires,
         c'est tout. Pas besoin de zoomer. Le halo bleu, ce n'est pas la legende :
         c'est sur une page, la mise en scene par exemple. Tu eteins les jaunes et
         tu mets le bleu au bon moment. "Je le referme" : le menu se ferme, on voit
         tout, tu vas sur le logo, tu repars en arriere, puis la musique. » */
      pendant: [ { part: 0.10, geste: 'ouvrirMenu', vise: '.voile nav' },
                 { part: 0.385, geste: 'rien', surligne: '.voile nav a[href*="NOUVEAUT"]' },
                 { part: 0.43,  geste: 'rien', surligne: '.voile nav a[href*="NOUVEAUT"], .voile nav a[href*="PRENOM"]' },
                 { part: 0.67,  geste: 'rien', surligne: null, bleu: '.voile nav a[href*="MISE%20EN%20SC"], .voile nav a[href*="MISE EN SC"]' },
                 /* 18 h 25 — Mickael : « pas de zoom sur le logo, je veux voir toute
                    la page. Mais ca amene a la meme page, on ne voit pas de
                    difference. » La difference, on la fabrique : le menu ferme, la
                    page descend un peu vers les tuiles ; « il te ramene a l'accueil »,
                    le logo est vraiment appuye, et la page remonte en haut. */
                 /* 18 h 30 — « on referme et on se retrouve sur les six photos ; on
                    appuie sur Boheme et on se retrouve sur la photo du debut. » */
                 { part: 0.80,  geste: 'fermerMenu', bleu: null, vise: null },
                 { part: 0.82,  geste: 'seRetrouverSurLesSix' },
                 { part: 0.93,  geste: 'cliquerLogo' },
                 { part: 0.97,  geste: 'rien', vise: null } ] },

    /* 20 · la musique : elle s'allume, on la laisse jouer, puis le panneau, puis on coupe */
    { son: sonCommun('03-musique'), nom: 'La musique', vise: '.nav .musique .mRond',
      /* 18 h 35 — mesure sur les deux voix : « trois morceaux » a 41-43 %,
         « hop, un appui » a 78-84 %. Les titres restent ouverts entre les deux,
         zoom franc sur le rond ET les titres, puis tout se referme. */
      pendant: [ { a: 0.5,  geste: 'musiqueAllumer' },
                 /* 18 h 40 — « pas assez franc, on voit des parcelles » : la lumiere
                    se posait sur un panneau a moitie ouvert. On ouvre, on attend
                    qu'il soit deplie, PUIS on eclaire ; on referme, on attend, PUIS
                    la lumiere revient sur le rond seul. */
                 { part: 0.40, geste: 'musiqueTitresOuverts' },
                 { part: 0.44, geste: 'rien', vise: ['.nav .musique .mRond', '.nav .musique .mPan'] },
                 { part: 0.56, geste: 'musiqueMorceauSuivant' },
                 { part: 0.78, geste: 'musiqueEteindre' },
                 { part: 0.82, geste: 'rien', vise: '.nav .musique .mRond' } ] },

    /* 21 · le paysage, en deux temps : la voix demande, puis SE TAIT jusqu'a
       ce qu'il ait tourne, puis reprend. « Tant qu'il n'a pas tourne, plus de
       voix. » */
    /* ⚠️ 12 septembre, 16 h 40 — EN ATTENTE DES VOIX : Google a ferme le
       compteur du jour (100 voix par compte). Le deux-temps ci-dessus est
       pret ; en attendant, l'ancien morceau unique, dont la voix existe.
       A remettre des que 11a/11b sont fabriques (voir fabriquer_visite.py). */
    /* 16 h 55 — les voix 11a/11b sont la (modele Pro) : le deux-temps est retabli. */
    { nom: 'Le paysage', vise: null,
      etapes: [
        { son: sonCommun('11a-paysage-avant') },
        { geste: 'attendreLePaysage' },
        { son: sonCommun('11b-paysage-apres') },
      ] },

    /* 22 · la fin : son visage revient, en grand, pendant qu'elle parle, puis
       s'efface en fondu ; et on rend le portrait, puis la liberte de tourner */
    { nom: 'La fin', vise: null,
      etapes: [
        { geste: 'revenirAccueil' },
        { geste: 'revenirEnPortrait' },
        { geste: 'montrerLeVisagePourFinir' },
        { son: sonPerso('12-la-fin') },
        { geste: 'effacerLeVisage' },
      ] },
  ];


  /* ── les gestes que la visite fait elle-même ──────────────────────────── */
  const GESTES = {
    /* pour un temps qui ne fait que deplacer la lumiere, sans rien toucher */
    rien(){ return 0; },
    effacerLeVisage(){ effacerLeBonjour(); return 900; },
    /* attendre qu'il tourne, en silence, avec le pictogramme */
    attendreLePaysage(){
      signalerVisite('paysage');
      libererOrientation();
      return new Promise(r => attendre('paysage', r));
    },
    /* a la fin : on le ramene en portrait le temps de la derniere phrase */
    revenirEnPortrait(){
      verrouillerPortrait();
      if (innerWidth <= innerHeight) return 300;
      return new Promise(r => {
        const voir = () => { if (innerWidth <= innerHeight){ removeEventListener('resize', voir); apres(r, 500); } };
        addEventListener('resize', voir);
        apres(() => { removeEventListener('resize', voir); r(); }, 6000);
      });
    },
    montrerLeVisagePourFinir(){
      return new Promise(r => { montrerLeBonjour(() => apres(r, 600)); });
    },

    /* ── LA PAGE DEFILE, DOUCEMENT, ET LA PAROLE SUIT ─────────────────────
       ⚠️ 12 septembre, 10 h 10 — Mickael : « pendant que tu parles il faut que
       ca scrolle. Tu arrives devant les photos, hop, et ensuite tu remontes,
       mais doucement. Il faut qu'on puisse voir tous les trucs. Reflechis
       comme un etre humain. »

       Un humain qui montre une page ne recite pas une phrase par-dessus un
       mouvement. Il descend en parlant, s'arrete devant ce qu'il veut montrer,
       le nomme, remonte, et ne dit « voila » qu'une fois revenu. LE GESTE
       COMMANDE, LA PAROLE SUIT. Ces deux gestes rendent donc chacun une
       promesse, et l'arret les enchaine avec les morceaux de voix, dans l'ordre.

       Vingt-deux secondes pour descendre, dix-huit pour remonter : c'est le
       temps qu'il faut pour VOIR passer chaque porte, pas seulement pour
       arriver. Si son doigt touche l'ecran, on lache — et on considere le
       geste fini, pour ne jamais bloquer la suite. */
    descendreAuxVisages(){ return glisser('visages', 22000); },
    remonterEnHaut(){
      const d = Math.max(1500, Math.min(6000, scrollY / VITESSE_MAIN * 1000));
      return glisser('haut', d);
    },
    /* le geste enregistre par Mickael, s'il existe ; sinon la descente puis la
       remontee calculees, l'une apres l'autre */
    /* ── LES SIX VISAGES DANS L'ECRAN ──────────────────────────────────────
       ⚠️ 12 septembre, 10 h 40 — Mickael : « le seul probleme, c'est que je ne
       vois pas tous les visages. Je ne peux pas tout encadrer quand je descends.
       Est-ce que tu as une autre solution ? »
       Oui : au lieu de chercher un cadrage impossible, la page rapetisse
       d'elle-meme le bloc des six, juste ce qu'il faut pour qu'ils tiennent
       tous entre la barre du haut et celle du bas — et reprend sa taille a la
       remontee. Le rapport est CALCULE sur l'ecran reel : ca tient sur son
       Xiaomi comme sur un iPhone plus petit. */
    montrerLesSix(){
      const bloc = document.querySelector('.six');
      if (!bloc) return 0;
      const r = bloc.getBoundingClientRect();
      const haut = (document.querySelector('.nav') || {}).getBoundingClientRect?.().height || 56;
      const bas  = (document.querySelector('.bas') || {}).getBoundingClientRect?.().height || 92;
      const place = innerHeight - haut - bas - 24;
      const k = Math.min(1, place / r.height);
      bloc.style.transition = 'transform .9s cubic-bezier(.22,.8,.2,1)';
      bloc.style.transformOrigin = '50% 0';
      bloc.style.transform = 'scale(' + k.toFixed(3) + ')';
      /* et on cale le haut du bloc juste sous la barre, pour que TOUT soit visible */
      const y = r.top + scrollY - haut - 12;
      scrollTo({ top: y, behavior: 'smooth' });
      return 1000;
    },
    rendreLesSix(){
      const bloc = document.querySelector('.six');
      if (bloc) bloc.style.transform = '';
      return 600;
    },
    defilerCommeLui(){
      const t = gesteAccueil();
      /* la phrase du bas, et on ATTEND qu'elle soit finie avant de remonter :
         c'est lui qui a dit « je rappuie vite pour figer » — il ne remonte pas
         pendant qu'elle parle. */
      const direLesVisages = () => new Promise(r => {
        GESTES.montrerLesSix();
        let passe = false;
        const fini = () => { if (!passe){ passe = true; apres(() => { GESTES.rendreLesSix(); apres(r, 500); }, 900); } };
        apres(() => {
          son.onended = fini; son.onerror = () => apres(fini, 1500);
          son.src = sonCommun('01c-visages');
          son.play().catch(() => apres(fini, 1500));
        }, 900);
      });
      /* deux traces enregistrees a sa main : descente, puis remontee */
      if (t && t.descente && t.remontee)
        return rejouer(t.descente).then(direLesVisages).then(() => rejouer(t.remontee));
      /* une seule trace (ancien format) : la phrase au point le plus bas */
      if (t && t.length) return rejouer(t, () => { direLesVisages(); });
      return glisser('visages', 22000).then(direLesVisages).then(() => glisser('haut', 18000));
    },
    ouvrirMenu(){ document.body.classList.add('menu'); return 700; },

    /* ── LA MUSIQUE, POUR DE VRAI ────────────────────────────────────────
       ⚠️ 12 septembre — Mickael : « pour la musique, j'aurais aime que tu
       allumes la musique, qu'on entende la musique. Qu'il y ait aussi la
       possibilite de choisir les morceaux, de montrer comment tu choisis les
       morceaux, et d'eteindre la musique. Et il faudrait que ca se fasse
       automatiquement. »

       Je me contentais d'eclairer la note en parlant d'elle. C'est une brochure,
       pas une demonstration. Maintenant la visite appuie sur ses vrais boutons,
       a elle : on entend la musique demarrer, on voit le titre s'afficher, on
       voit le morceau changer, et on l'entend s'eteindre.

       On n'imite rien : on clique sur les memes boutons que son doigt. Le
       lecteur ne sait pas qu'on n'est pas lui. */
    musiqueAllumer(){
      const b = document.querySelector('.musique .mRond');
      const s2 = [...document.querySelectorAll('audio')].find(x => x !== son && !x.dataset.visite);
      if (b && (!s2 || s2.paused)) b.click();      /* eteinte : un appui l'allume */
      volumeGarde = null;                          /* on la laisse s'entendre */
      return 400;
    },
    musiqueTitresOuverts(){ if (window.__musiquePanneau) window.__musiquePanneau(true); return 350; },
    musiqueMorceauSuivant(){
      const b = document.querySelector('.musique .mNav[data-m="suiv"]');
      if (b) b.click();
      return 400;
    },
    musiqueEteindre(){
      if (window.__musiquePanneau) window.__musiquePanneau(false);   /* on rend les titres */
      const b = document.querySelector('.musique .mRond');
      const boite = document.querySelector('.musique');
      if (!b || !boite) return 0;
      /* le premier appui montre le titre, le second eteint : on refait donc
         exactement le geste qu'il ferait, dans le meme ordre. */
      if (!boite.classList.contains('ouvert')) b.click();
      apres(() => b.click(), 500);
      return 900;
    },
    fermerMenu(){ document.body.classList.remove('menu'); return 500; },
    montrerCalendrier(){
      const a = [...document.querySelectorAll('a[href]')]
        .find(x => /CALENDRIER/i.test(decodeURIComponent(x.getAttribute('href') || '')));
      if (a) a.click();
      apres(() => GESTES.revenirAccueil(), 4200);
      return 900;
    },
    /* un vrai appui sur le logo Boheme : on le voit s'enfoncer, puis l'accueil
       revient (le site recoud la page sans couper la voix) */
    /* le menu vient de se fermer : on se retrouve sur les six photos, d'un coup */
    seRetrouverSurLesSix(){
      const h = [...document.querySelectorAll('section.page h2')].find(x => /Les six/i.test(x.textContent));
      const sec = h ? h.closest('section') : null;
      if (sec) scrollTo({ top: sec.getBoundingClientRect().top + scrollY - 8, behavior: 'instant' });
      return 300;
    },
    /* « il te ramene toujours a l'accueil » : le logo s'enfonce et la page
       remonte en douceur sur la photo du debut. Pas de rechargement : Mickael
       l'a vu, « ce n'est pas beau ». */
    cliquerLogo(){
      const a = document.querySelector('.nav .marque');
      if (a){ a.style.transition = 'transform .18s'; a.style.transform = 'scale(.82)';
              apres(() => { a.style.transform = ''; }, 220); }
      apres(() => { try { scrollTo({ top: 0, behavior: 'smooth' }); } catch(e){ scrollTo(0, 0); } }, 200);
      return 900;
    },
    revenirAccueil(){
      const a = document.querySelector('.nav .marque') || [...document.querySelectorAll('a[href]')]
        .find(x => /ACCUEIL/i.test(decodeURIComponent(x.getAttribute('href') || '')));
      if (a && !/ACCUEIL/i.test(decodeURIComponent(location.pathname))) a.click();
      return 900;
    },
  };

  /* ── REJOUER SON GESTE ──────────────────────────────────────────────────
     Une trace : [[temps en ms, position], ...] enregistree par Mickael a la
     main, dans le mode essai. On la rejoue a l'identique — ses vitesses, ses
     arrets, ses hesitations. Rien n'est lisse ni calcule : c'est SA main.
     La trace figee ci-dessous est celle qu'il a validee ; celle du telephone
     (mode essai) passe devant, pour qu'il puisse en refaire une sans attendre
     une publication. */
  /* ⚠️ 12 septembre, 12 h — LE GESTE DE MICKAEL, valide par lui : « parfait,
     pour moi c'est bon. » Enregistre a sa main sur son telephone, lu par le
     cable, fige ici pour les six. Descente 4,3 s jusqu'aux six visages,
     remontee 4,7 s. Un point toutes les 100 ms, le rejeu interpole entre.
     Ce n'est pas une vitesse reglee au juge : c'est SA main. */
  const GESTE_ACCUEIL = {"descente":[[50,0],[151,0],[250,0],[350,0],[450,0],[550,0],[650,0],[750,0],[850,0],[1001,20],[1100,1512],[1200,2012],[1300,2934],[1400,3500],[1500,4009],[1601,4540],[1700,4762],[1802,5435],[1903,5756],[2000,6016],[2100,6266],[2200,6468],[2300,6691],[2400,6855],[2500,6976],[2600,7061],[2703,7217],[2800,7314],[2900,7353],[3001,7353],[3100,7495],[3200,7531],[3300,7557],[3401,7571],[3500,7577],[3601,7578],[3700,7578],[3807,7578],[3902,7578],[4001,7578],[4100,7578],[4200,7578],[4318,7578],[4350,7578]],"remontee":[[51,7578],[150,7578],[250,7578],[351,7578],[450,7578],[550,7578],[650,7578],[753,7407],[852,6506],[952,5863],[1053,5018],[1150,4364],[1250,3777],[1350,3255],[1450,2796],[1553,2391],[1650,2036],[1751,1724],[1850,1450],[1950,1229],[2050,1017],[2150,846],[2250,658],[2351,531],[2451,401],[2550,300],[2651,208],[2752,139],[2850,87],[2952,39],[3051,9],[3150,0],[3250,0],[3351,0],[3450,0],[3551,0],[3650,0],[3751,0],[3851,0],[3951,0],[4051,0],[4150,0],[4250,0],[4350,0],[4452,0],[4551,0],[4651,0],[4700,0]]};
  /* ── NETTOYER UNE TRACE AVANT DE LA REJOUER ─────────────────────────────
     ⚠️ 12 septembre, 10 h 55 — Mickael : « des que j'appuie sur le bouton, ca
     prend une certaine latence avant que ca descende. Et il faut que ce soit
     plus fluide, meme si mon geste a ete un peu saccade. »

     Deux choses, donc. La LATENCE : quand il appuie sur ● 1, l'enregistrement
     part aussitot, mais lui met une demi-seconde a poser le doigt et a bouger.
     Ce silence etait rejoue tel quel. On coupe les plateaux du debut et de la
     fin. Les SACCADES : un scroll au doigt, c'est de l'inertie et des a-coups,
     meme quand le geste est bon. On lisse par une moyenne glissante d'environ
     un tiers de seconde — ses vitesses et ses arrets restent, les a-coups
     partent. Et on n'ecrit jamais dans la trace d'origine. */
  function nettoyer(trace){
    if (!trace || trace.length < 3) return trace;
    let t = trace.map(p => [p[0], p[1]]);
    /* les plateaux : on avance tant que ca ne bouge pas, on recule pareil */
    let a = 0; while (a < t.length - 1 && Math.abs(t[a + 1][1] - t[0][1]) < 4) a++;
    let b = t.length - 1; while (b > a + 1 && Math.abs(t[b - 1][1] - t[b][1]) < 4) b--;
    t = t.slice(a, b + 1);
    const t0 = t[0][0];
    t = t.map(p => [p[0] - t0, p[1]]);
    /* le lissage : moyenne glissante sur 7 points (350 ms), bords gardes */
    /* onze points (550 ms) : les a-coups du doigt et l'inertie d'Android
       s'effacent, la forme du geste reste. « Il faut que ce soit beau. » */
    const L = 11, h = Math.floor(L / 2), lisse = [];
    for (let i = 0; i < t.length; i++){
      let somme = 0, n = 0;
      for (let j = Math.max(0, i - h); j <= Math.min(t.length - 1, i + h); j++){ somme += t[j][1]; n++; }
      lisse.push([t[i][0], somme / n]);
    }
    /* les deux extremites restent exactes : on part d'ou il est parti, on arrive ou il est arrive.
       Et le depart n'est pas ramolli par la moyenne : les premiers points gardent
       leur elan, sinon la page semble hesiter avant de partir. */
    for (let i = 0; i < Math.min(h, lisse.length); i++) lisse[i][1] = t[i][1];
    lisse[lisse.length - 1][1] = t[t.length - 1][1];
    return lisse;
  }

  /* ⚠️ 12 septembre, 11 h 50 — MESURE SUR SON TELEPHONE, au dixieme de seconde :
     « regarde » finit a 10,9 s ; la page ne bouge pas avant 13,9 s ; puis elle
     devale 7 700 pixels en 0,6 s au lieu de ses 5,8 s ; et la phrase du retour
     part alors que la page est encore en bas.
     Ce n'etait ni le son ni sa trace : c'est le DEFILEMENT LISSE du site
     (scroll-behavior: smooth) qui se battait contre le rejeu. Chaque position
     posee declenchait une glissade animee ; cinquante par seconde s'annulaient
     entre elles, et ca rattrapait tout d'un coup. On pilote en mode direct,
     image par image : behavior « instant », et le lissage, c'est nous. */
  function rejouer(traceBrute, auPlusBas){
    return new Promise(resoudre => {
      const trace = nettoyer(traceBrute);
      if (!trace || trace.length < 2){ resoudre(); return; }
      const depart = performance.now();
      const fin = trace[trace.length - 1][0];
      /* le point le plus bas de SA descente : c'est la que la voix dira « et
         la, tu vois, on arrive en bas » — au moment ou lui s'est arrete */
      const plusBas = Math.max.apply(null, trace.map(x => x[1]));
      let ditPlusBas = false;
      let i = 0, lache = false;
      const lacher = () => { lache = true; };
      addEventListener('pointerdown', lacher, { once: true, capture: true });
      const pas = (now) => {
        if (lache || arrete){ removeEventListener('pointerdown', lacher, true); resoudre(); return; }
        if (enPause){ requestAnimationFrame(pas); return; }
        const t = now - depart;
        while (i < trace.length - 1 && trace[i + 1][0] <= t) i++;
        const a = trace[i], b = trace[Math.min(i + 1, trace.length - 1)];
        const f = b[0] > a[0] ? Math.min(1, (t - a[0]) / (b[0] - a[0])) : 1;
        const y = a[1] + (b[1] - a[1]) * f;
        scrollTo({ top: y, behavior: 'instant' });
        if (!ditPlusBas && auPlusBas && y >= plusBas - 40){ ditPlusBas = true; auPlusBas(); }
        if (t < fin) requestAnimationFrame(pas);
        else { scrollTo({ top: trace[trace.length - 1][1], behavior: 'instant' }); removeEventListener('pointerdown', lacher, true); resoudre(); }
      };
      requestAnimationFrame(pas);
    });
  }
  function gesteAccueil(){
    let t = null;
    try { t = JSON.parse(localStorage.getItem('boheme-geste-accueil') || 'null'); } catch(e){}
    if (t && ((t.descente && t.remontee) || t.length > 1)) return t;
    return GESTE_ACCUEIL;
  }

  /* glisser jusqu'a un element, a la vitesse de la main de Mickael, pour que
     la tuile arrive au centre de l'ecran (entre les deux barres) */
  const VITESSE_MAIN = 7578 / 4.3;      /* pixels par seconde, mesures sur lui */
  function glisserVersElement(c){
    const r = c.getBoundingClientRect();
    const haut = (document.querySelector('.nav') || {}).getBoundingClientRect?.().height || 56;
    const bas  = (document.querySelector('.bas') || {}).getBoundingClientRect?.().height || 92;
    const utile = innerHeight - haut - bas;
    let cible = r.top + scrollY - haut - Math.max(0, (utile - r.height) / 2);
    const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    cible = Math.max(0, Math.min(max, cible));
    const distance = Math.abs(cible - scrollY);
    if (distance < 30) return Promise.resolve();
    /* ⚠️ 13 h 25 — mesure sur son telephone : 938 pixels en 0,7 s, « je ne vois
       rien de tout ca ». A la vitesse de sa main, un court trajet est un eclair.
       Un plancher d'une seconde et demie : on VOIT la page aller a la carte. */
    const duree = Math.max(1500, Math.min(6000, distance / VITESSE_MAIN * 1000));
    const depuis = scrollY, t0 = performance.now();
    const doux = t => t < .5 ? 2*t*t : -1 + (4 - 2*t)*t;
    return new Promise(resoudre => {
      const pas = (now) => {
        if (arrete){ resoudre(); return; }
        const t = Math.min(1, (now - t0) / duree);
        scrollTo({ top: depuis + (cible - depuis) * doux(t), behavior: 'instant' });
        if (t < 1) requestAnimationFrame(pas); else resoudre();
      };
      requestAnimationFrame(pas);
    });
  }

  /* le glissement lui-meme : de la ou on est jusqu'a la cible, en douceur */
  function glisser(vers, duree){
    return new Promise(resoudre => {
      const cible = () => {
        const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
        if (vers === 'haut') return 0;
        const q = document.querySelector('.qui');
        if (!q) return max;
        return Math.min(max, Math.max(0, q.getBoundingClientRect().top + scrollY - 14));
      };
      const depuis = scrollY, depart = performance.now();
      const doux = t => t < .5 ? 2*t*t : -1 + (4 - 2*t)*t;
      let lache = false;
      const lacher = () => { lache = true; };
      addEventListener('pointerdown', lacher, { once: true, capture: true });
      const pas = (now) => {
        if (lache || arrete){ removeEventListener('pointerdown', lacher, true); resoudre(); return; }
        if (enPause){ requestAnimationFrame(pas); return; }   /* on attend, on ne lache pas */
        const t = Math.min(1, (now - depart) / duree);
        const ou = cible();
        scrollTo({ top: depuis + (ou - depuis) * doux(t), behavior: 'instant' });
        if (t < 1) requestAnimationFrame(pas);
        else { scrollTo({ top: ou, behavior: 'instant' }); removeEventListener('pointerdown', lacher, true); resoudre(); }
      };
      requestAnimationFrame(pas);
    });
  }

  /* ── le décor : le voile, le projecteur, la barre de passage ──────────── */
  const style = document.createElement('style');
  style.textContent = `
    /* ⚠️ 11 septembre au soir — Mickael : « tout est flou, tout est en noir,
       il n'y a rien qu'on voie. » Il avait raison, et le defaut etait grossier :
       je peignais DEUX couches de noir. Le voile assombrissait toute la page —
       y compris la chose que je voulais montrer — et le projecteur en rajoutait
       une seconde par-dessus.

       Le bon dessin n'en a qu'une : le projecteur porte son propre noir, peint
       tout AUTOUR de lui par une ombre demesuree. L'interieur du cadre reste
       donc a sa vraie lumiere, sans que j'aie rien a toucher a la page. Le voile
       ne sert plus qu'a une chose, et il est transparent : arreter les doigts.
       Et plus aucun flou : on regarde la vraie application, pas une photo
       depolie. */
    /* ⚠️ 11 septembre au soir — L'IDEE DE MICKAEL, et elle est meilleure que la
       mienne : « pourquoi ne fais-tu pas avec des couleurs en degrade ? Tu
       eclaires vraiment ce qui represente. Ce n'est pas plus facile que de
       faire des carres ? »

       Si. C'est plus simple ET plus juste. Un cadre rectangulaire, c'est un
       objet de plus pose par-dessus la page — avec ses bords durs, ses coins
       qui ne collent a rien, et sa maniere de decouper de travers ce qui n'est
       pas un carre. Un projecteur, lui, ne pose rien : il eclaire. La lumiere
       s'eteint en douceur vers les bords, exactement comme une douche de scene,
       et l'or ne fait plus un trait mais une lueur.

       Une seule couche, donc, et c'est ce voile : un degre de noir partout,
       perce d'un halo doux la ou il faut regarder. Le centre et la taille du
       halo sont poses par la visite, en direct. */
    #vVoile{ position:fixed; inset:0; z-index:150;
      background:rgba(4,4,4,.86);
      opacity:0; pointer-events:none;
      transition:opacity .5s ease, background-position .6s cubic-bezier(.32,.72,0,1); }
    body.enVisite #vVoile{ opacity:1; pointer-events:auto; }
    #vProjecteur{ display:none; }
    /* ⚠️ 13 h 40 — Mickael : « j'ai pense plutot a un carre en halo, parce que
       le rond n'est pas carre par rapport au truc. Le carre pour les trucs qui
       sont carres, le halo rond pour les trucs qui sont un peu en rond. »
       La lumiere est donc un TROU dans le noir, qui prend la forme de l'objet :
       rond pour la note ou le logo, rectangle aux coins doux pour une carte ou
       une tuile. Le noir vient de son ombre demesuree, le bord est fondu par un
       leger flou, et l'or fait l'ourlet. */
    #vTrou{ position:fixed; z-index:151; pointer-events:none; opacity:0;
      box-shadow:0 0 0 9999px rgba(4,4,4,.92), 0 0 0 2px rgba(241,210,122,.5), 0 0 26px 8px rgba(241,210,122,.35);
      filter:blur(3px); transition:opacity .4s ease; }
    #vTrou.la{ opacity:1; }
    /* ⚠️ « Aucun texte ne doit manger un autre texte. » Ce bouton se posait
       PILE sur la barre du bas et mangeait ATELIER et TEXTES (vu en image le
       11 septembre au soir). Il se tient maintenant AU-DESSUS d'elle — et pas
       a une hauteur devinee : on mesure la vraie barre et on se range dessus
       (--hBas, pose par la visite au demarrage et a chaque rotation). */
    #vBarre{ position:fixed; z-index:153; left:0; right:0;
      bottom:calc(env(safe-area-inset-bottom) + var(--hBas, 92px) + 14px);
      display:flex; align-items:center; justify-content:center; gap:12px;
      opacity:0; transition:opacity .5s ease; pointer-events:none; }
    body.enVisite #vBarre{ opacity:1; pointer-events:auto; }
    #vBarre button{ border-radius:999px; border:1px solid rgba(212,175,55,.5);
      background:rgba(12,11,10,.92); color:#f1d27a; font:600 13px system-ui;
      padding:11px 20px; cursor:pointer; backdrop-filter:blur(12px); }
    #vBarre .vPrincipal{ background:linear-gradient(180deg,#f4d97f,#c9a13a); color:#1a1408; }
    #vPuces{ position:fixed; z-index:153; left:0; right:0;
      top:calc(env(safe-area-inset-top) + 8px); display:flex; justify-content:center; gap:5px;
      opacity:0; transition:opacity .5s; pointer-events:none; }
    body.enVisite #vPuces{ opacity:1; }
    #vPuces i{ width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,.22); }
    #vPuces i.faite{ background:rgba(212,175,55,.65); }
    #vPuces i.ici{ background:#f1d27a; box-shadow:0 0 9px rgba(241,210,122,.9); }
    /* la carte d'entrée */
    #vEntree{ position:fixed; inset:0; z-index:160; display:none; place-items:center;
      background:rgba(4,4,4,.93); backdrop-filter:blur(16px); padding:8vw; }
    #vEntree.la{ display:grid; }
    #vEntree .carte{ max-width:30rem; text-align:center; display:grid; gap:1rem;
      background:rgba(12,11,10,.94); border:1px solid rgba(212,175,55,.4);
      border-radius:1.2rem; padding:1.8rem 1.6rem; box-shadow:0 24px 70px rgba(0,0,0,.7); }
    #vEntree h2{ font-family:var(--disp,Georgia,serif); color:#f1d27a; margin:0; font-size:1.5rem; }
    #vEntree p{ margin:0; color:#bcb4a2; font-size:.92rem; line-height:1.6; }
    #vEntree .son{ color:#f1d27a; font-weight:600; }
    #vEntree .gestes{ display:grid; gap:.5rem; margin-top:.4rem; }
    #vEntree button{ padding:.95rem 1.2rem; border-radius:999px; font:600 1rem system-ui;
      cursor:pointer; border:1px solid rgba(212,175,55,.5); }
    #vEntree .oui{ background:linear-gradient(180deg,#f4d97f,#c9a13a); color:#1a1408; }
    #vEntree .non{ background:rgba(212,175,55,.08); color:#f1d27a; }
    /* l'invite à tourner le téléphone */
    #vTourne{ position:fixed; inset:0; z-index:158; display:none; place-items:center;
      background:rgba(4,4,4,.95); text-align:center; }
    #vTourne.la{ display:grid; }
    #vTourne .tel{ font-size:64px; animation:vTourner 2s ease-in-out infinite; }
    @keyframes vTourner{ 0%,100%{ transform:rotate(0) } 50%{ transform:rotate(90deg) } }
    /* les deux petites boites : la question du bouton rouge, et la pause */
    #vDemande, #vPause, #vDepart{ position:fixed; inset:0; z-index:159; display:grid; place-items:center;
      background:rgba(4,4,4,.82); backdrop-filter:blur(10px); padding:8vw; }
    #vDemande .bulle, #vPause .bulle, #vDepart .bulle{ display:grid; gap:.7rem; text-align:center; max-width:22rem;
      background:rgba(12,11,10,.96); border:1px solid rgba(212,175,55,.4);
      border-radius:1.1rem; padding:1.4rem 1.3rem; box-shadow:0 20px 60px rgba(0,0,0,.7); }
    #vDemande p, #vPause p, #vDepart p{ margin:0 0 .3rem; color:#f1d27a; font:600 1.05rem system-ui; }
    #vDemande button, #vPause button, #vDepart button{ padding:.85rem 1.1rem; border-radius:999px; cursor:pointer;
      font:600 .95rem system-ui; border:1px solid rgba(212,175,55,.5); }
    #vDemande .oui, #vPause .oui, #vDepart .oui{ background:linear-gradient(180deg,#f4d97f,#c9a13a); color:#1a1408; }
    #vDemande .non, #vPause .non{ background:rgba(212,175,55,.08); color:#f1d27a; }
    /* l'ecran de bienvenue : un visage, un prenom, sa couleur */
    /* ⚠️ 12 septembre — LE VISAGE PASSAIT PAR-DESSUS LE BOUTON « COMMENCER ».
       Vu en essai : quand le telephone refuse le son, le seul bouton qui debloque
       tout se retrouvait DERRIERE le portrait, donc intouchable. La visite
       restait muette et personne ne pouvait rien y faire. Le visage descend sous
       les boites qui demandent quelque chose. */
    #vBonjour{ position:fixed; inset:0; z-index:158; display:grid; place-items:center;
      background:#060505; opacity:0; transition:opacity .9s ease; }
    #vBonjour.la{ opacity:1; }
    #vBonjour .bCarte{ text-align:center; display:grid; gap:.9rem; justify-items:center;
      transform:translateY(14px) scale(.97); transition:transform 1.1s cubic-bezier(.22,.8,.2,1); }
    #vBonjour.la .bCarte{ transform:none; }
    #vBonjour .bCadre{ position:relative; width:min(52vw,15rem); aspect-ratio:1;
      border-radius:50%; overflow:hidden;
      box-shadow:0 0 0 2px color-mix(in srgb, var(--c) 70%, transparent),
                 0 0 58px color-mix(in srgb, var(--c) 45%, transparent); }
    /* 12 septembre, 16 h 45 — Mickael : « je suis rogne, il faut qu'on soit
       dans le rond. » Les six portraits sont des 760x1013, le rond est carre :
       centre au milieu, il coupait les cheveux d'Adrien, d'Elie, de Mickael et
       de Stephanie. Verifie sur une planche des six : a 12 % du haut, les six
       visages tiennent entiers. */
    #vBonjour .bCadre img{ width:100%; height:100%; object-fit:cover; object-position:50% 12%; display:block; }
    #vBonjour .bCadre i{ position:absolute; inset:0;
      background:radial-gradient(circle at 50% 120%, color-mix(in srgb, var(--c) 30%, transparent), transparent 62%); }
    #vBonjour .bMot{ font:400 1rem/1 system-ui, sans-serif; letter-spacing:.32em;
      text-transform:uppercase; color:#b9b09c; }
    #vBonjour .bNom{ font-family:var(--disp, Georgia, serif); font-size:clamp(2rem,11vw,3.4rem);
      line-height:1; color:var(--c); }
    body.enVisite{ overflow:hidden; }`;
  document.head.appendChild(style);

  /* la classe « visiteGarde » dit a une-seule-page.js de ne jamais les balayer
     quand on change de page : la visite traverse tout le site sans se defaire. */
  const el = (id, html) => { const d = document.createElement('div'); d.id = id;
    d.className = 'visiteGarde';
    if (html) d.innerHTML = html; document.body.appendChild(d); return d; };
  const voile = el('vVoile');
  const proj  = el('vProjecteur');
  const trou  = el('vTrou');
  const puces = el('vPuces');
  /* ⚠️ 12 septembre — PLUS DE « PASSER LA VISITE ».
     Mickael : « on ne peut pas passer outre, il faut qu'il voie l'aide
     automatique. C'est obligatoire, en fait. »

     J'avais plaide contre, et pour une raison que je maintiens : une porte
     fermee peut enfermer quelqu'un dehors. Il a tranche, et c'est sa decision.
     Alors je la rends sans danger plutot que de la discuter : la visite ne dure
     que deux minutes, elle ne se montre qu'UNE fois, elle reprend ou elle s'est
     arretee si le telephone sonne — et si le son est refuse, un bouton unique
     la demarre au lieu de la laisser muette. Ce sont ces trois filets qui
     remplacent la sortie, et ils sont plus surs qu'elle.
     La barre reste en place : le mode essai s'y accroche pour ses commandes. */
  const barre = el('vBarre', '');
  const tourne = el('vTourne',
    '<div><div class="tel">📱</div><div style="color:#f1d27a;font:600 20px system-ui;margin-top:14px">Tourne ton téléphone</div></div>');

  ARRETS.forEach(() => puces.appendChild(document.createElement('i')));

  /* ── le son ───────────────────────────────────────────────────────────── */
  const son = document.createElement('audio');
  son.preload = 'auto';
  son.setAttribute('data-visite', '1');
  /* ⚠️ 12 septembre — LA VOIX NE DOIT PAS TUER LA MUSIQUE DU HALL.
     Le site a une regle absolue, et elle est bonne : des qu'un autre son
     demarre, la musique s'arrete. Mais la voix de la visite n'est pas « un
     autre son » — c'est la visite elle-meme, et c'est elle qui s'occupe deja
     du volume du hall (elle le baisse, elle le rend). En la laissant declencher
     la regle, la musique s'eteignait au moment meme ou la voix disait « ecoute
     cette musique ». Cette marque la fait reconnaitre comme faisant partie de
     la maison : la regle continue de valoir pour les videos et les bandes de
     l'atelier, qui sont les vrais cas qu'elle vise. */
  son.setAttribute('data-musique-du-site', 'visite');
  document.body.appendChild(son);

  let ici = -1, arrete = false, departA = 0;
  /* un geste qui dure plus longtemps que la phrase (le defilement de l'accueil)
     pose ici une promesse : la visite ne passe a la suite qu'une fois qu'elle
     est tenue. La voix ne parle jamais d'autre chose pendant que la page bouge. */
  let gesteEnCours = null;

  /* ── UN SEUL FIL, ET PAS DEUX ───────────────────────────────────────────
     ⚠️ 11 septembre au soir — Mickael : « des fois il y a deux fois la voix
     qui apparait. »

     Je n'ai pas cherche d'ou venait le doublon : je l'ai rendu impossible. Un
     double appui sur « oui », un « revoir la visite » pendant qu'elle tourne
     deja, une page qui revient — et deux deroules se mettaient a avancer en
     meme temps sur la meme bande, chacun poussant l'autre. On entendait des
     phrases qui se coupaient et se recouvraient.

     Desormais chaque depart porte un numero. Tout ce qui revient d'un depart
     perime — la fin d'une phrase, un minuteur, une reponse — est jete sans
     rien faire. Comme dans Reaper : une seule piste armee a la fois, et c'est
     vrai par construction, pas par correction. */
  let fil = 0;

  /* ── LES HORLOGES DE LA VISITE ──────────────────────────────────────────
     Elle traverse les pages, donc elle ne peut pas se servir des minuteurs
     ordinaires : une-seule-page.js les fauche a chaque changement de page pour
     qu'aucune page ne laisse battre son coeur derriere elle. Elle emprunte
     donc les horloges d'origine, qui ne sont surveillees par personne. */
  const H = window.__horlogeHorsSurveillance || window;
  const apres = (f, ms) => H.setTimeout.call(window, f, ms);

  /* ── OU SE POSE LA LUMIERE ──────────────────────────────────────────────
     ⚠️ 11 septembre au soir — Mickael : « je n'ai pas l'impression que ce soit
     au bon endroit que tu montres les choses. »

     C'etait vrai, et la cause etait bete : je mesurais la position de l'objet
     420 millisecondes apres avoir lance le defilement — alors qu'un defilement
     doux dure bien plus longtemps que ca, et davantage encore sur un telephone.
     Je mesurais donc une chose EN TRAIN DE BOUGER, et je posais le cadre la ou
     elle etait au passage, pas la ou elle s'arretait.

     Maintenant je ne devine plus : je regarde l'objet jusqu'a ce qu'il ne bouge
     plus (deux mesures identiques de suite), et c'est seulement la que je pose
     le cadre. Puis je continue a le suivre pendant qu'on parle de lui : si la
     page remue encore pour une raison quelconque, le cadre reste dessus. */
  /* ⚠️ DEUX HORLOGES A ETEINDRE, PAS UNE. La premiere guette l'objet jusqu'a
     ce qu'il s'immobilise ; la seconde le suit ensuite. Je n'eteignais que la
     seconde — la premiere de l'arret precedent continuait donc a tourner, se
     stabilisait en retard, et reposait le cadre sur l'ANCIEN objet. Tous les
     arrets finissaient par montrer la meme chose. */
  const estAncre = (e) => {
    if (e && e.els) return estAncre(e.els[0]);
    for (let n = e; n && n !== document.body; n = n.parentElement)
      if (getComputedStyle(n).position === 'fixed') return true;
    return false;
  };
  let suivi = null, guette = null;
  function eteindreLesHorloges(){
    if (suivi){ clearInterval(suivi); suivi = null; }
    if (guette){ clearInterval(guette); guette = null; }
  }
  /* La douche de lumiere. On centre l'ellipse sur l'objet, on lui donne la
     taille de l'objet plus une marge, et on la laisse s'eteindre vers le noir.
     La fine bande d'or a 70 % fait l'ourlet chaud d'une vraie poursuite. */
  /* ⚠️ 12 h 35 — Mickael : « montre le gros truc, puis va jusqu'a mise a jour,
     une sorte de zoom. » Le halo ne saute donc plus d'une cible a l'autre : il
     GLISSE, centre et rayon, en six dixiemes de seconde. Comme une poursuite
     qui se resserre sur un chanteur. */
  let haloActuel = null, haloAnim = null;
  /* rx, ry : les demi-largeur et demi-hauteur du trou ; rond : sa forme */
  function peindreHalo(cx, cy, rx, ry, rond){
    trou.style.left = Math.round(cx - rx) + 'px';
    trou.style.top  = Math.round(cy - ry) + 'px';
    trou.style.width  = Math.round(rx * 2) + 'px';
    trou.style.height = Math.round(ry * 2) + 'px';
    trou.style.borderRadius = rond ? '50%' : '18px';
    trou.classList.add('la');
    voile.style.background = 'transparent';
  }
  function poserSur(c){
    const r = c.getBoundingClientRect();
    const cx = r.left + r.width / 2; let cy = r.top + r.height / 2;
    /* le clair doit couvrir l'objet : il s'arrete a 62 % du rayon, donc on
       divise par 0,62 pour que l'objet tienne tout entier dans la lumiere */
    /* La lumiere doit serrer l'objet, pas inonder le voisinage : une premiere
       version debordait sur le menu et sur la carte rouge. Le clair s'arrete a
       55 % du rayon — on divise donc par 0,55 — et la marge reste petite. */
    /* ⚠️ 12 septembre — « resserrer et zoomer un peu pour qu'on le voie
       vraiment, et qu'on ne voie pas autour. » La marge tombe a six pixels, et
       le clair tient jusqu'a 70 % du rayon : la lumiere epouse l'objet au lieu
       d'eclairer son quartier. */
    const rx = Math.max(22, r.width  / 2 + 8);
    let   ry = Math.max(22, r.height / 2 + 8);
    /* ⚠️ 12 septembre, 17 h 15 — Mickael, sur la barre du bas : « il manque
       une petite partie pour que ca recouvre, qu'on ne voie que la partie du
       bas. » Mesure : la barre commence a 811 px, la lumiere a 803. Les huit
       pixels de marge laissaient voir une bande de page au-dessus. Pour un
       objet colle au bord bas de l'ecran, on descend la lumiere : son bord
       haut s'aligne sur l'objet, et le surplus tombe hors de l'ecran. */
    if (r.bottom >= innerHeight - 3){
      ry = r.height / 2 + 12;
      cy = r.top + ry + 4;
    }
    /* rond si l'objet est a peu pres carre et petit (une note, un logo) */
    const ratio = r.width / Math.max(1, r.height);
    const rond = ratio > 0.75 && ratio < 1.33 && r.width < 140;
    const vise = { cx, cy, rx, ry, rond };
    /* premiere pose, ou meme cible qui a juste bouge de quelques pixels : direct */
    if (!haloActuel || (Math.abs(haloActuel.rx - rx) < 30 && Math.abs(haloActuel.ry - ry) < 30
                        && Math.abs(haloActuel.cx - cx) < 60 && Math.abs(haloActuel.cy - cy) < 60)){
      haloActuel = vise; peindreHalo(cx, cy, rx, ry, rond); return r;
    }
    /* sinon on glisse : 600 ms de l'ancien halo au nouveau */
    if (haloAnim) cancelAnimationFrame(haloAnim);
    const de = haloActuel, t0 = performance.now(), D = 380;   /* 18 h 40 — plus franc */
    const doux = t => t < .5 ? 2*t*t : -1 + (4 - 2*t)*t;
    const pas = (now) => {
      const t = Math.min(1, (now - t0) / D), k = doux(t);
      const h = { cx: de.cx + (vise.cx - de.cx) * k, cy: de.cy + (vise.cy - de.cy) * k,
                  rx: de.rx + (vise.rx - de.rx) * k, ry: de.ry + (vise.ry - de.ry) * k,
                  rond: k < .5 ? de.rond : vise.rond };
      haloActuel = h; peindreHalo(h.cx, h.cy, h.rx, h.ry, h.rond);
      if (t < 1) haloAnim = requestAnimationFrame(pas); else haloAnim = null;
    };
    haloAnim = requestAnimationFrame(pas);
    return r;
  }
  /* le surlignage jaune : un ou plusieurs elements, et on efface le precedent */
  function surligner(sel, classe){
    classe = classe || 'visiteSurligne';
    document.querySelectorAll('.' + classe).forEach(e => e.classList.remove(classe));
    if (sel) document.querySelectorAll(sel).forEach(e => e.classList.add(classe));
  }
  function eteindreLaLumiere(){ surligner(null); surligner(null, 'visiteBleu'); voile.style.background = 'rgba(4,4,4,.86)'; }
  function eclairer(selecteur){
    eteindreLesHorloges();
    /* ⚠️ 13 h 45 — Mickael, sur la musique : « quand tu cliques dessus, on ne
       voit pas la possibilite de changer les titres. Il faudrait rajouter un
       carre en dessous, en plus du rond. » Le panneau des titres s'ouvre sous
       la barre, sur toute la largeur : il n'est pas DANS la note. Une cible peut
       donc etre plusieurs elements a la fois, et la lumiere prend leur union —
       la note et le panneau dans un seul cadre. */
    let c = null;
    if (Array.isArray(selecteur)){
      const els = selecteur.map(q => document.querySelector(q)).filter(Boolean);
      if (els.length){
        c = { isConnected: true, els,
              getBoundingClientRect(){
                const rs = this.els.filter(e => e.isConnected).map(e => e.getBoundingClientRect()).filter(r => r.width || r.height);
                if (!rs.length) return { left:0, top:0, width:0, height:0, right:0, bottom:0 };
                const l = Math.min(...rs.map(r => r.left)), t = Math.min(...rs.map(r => r.top));
                const rt = Math.max(...rs.map(r => r.right)), b = Math.max(...rs.map(r => r.bottom));
                return { left:l, top:t, right:rt, bottom:b, width:rt - l, height:b - t };
              } };
      }
    } else c = selecteur && document.querySelector(selecteur);
    /* ⚠️ 13 h — MESURE SUR SON TELEPHONE : « bouton@0 » sur toute la trace. Le
       bouton rouge avait ete envoye a l'essai precedent, le site l'avait efface
       (display:none), et la lumiere visait un objet de taille nulle : elle
       partait vers le coin (0,0). « Tu repars dans les coins. »
       Une cible absente ou invisible ne fait plus rien bouger : on garde la
       lumiere la ou elle est, et la voix continue. */
    if (c){ const rr = c.getBoundingClientRect(); if (!rr.width && !rr.height) c = null; }
    if (!c && selecteur){ return; }
    /* rien a designer : on n'assombrit rien non plus. On regarde la vraie
       application, en pleine lumiere, pendant que la voix parle. */
    if (!c){ voile.style.background = 'transparent'; trou.classList.remove('la'); haloActuel = null; rangerLePasser(null); return; }
    /* ⚠️ UNE BARRE ANCREE NE DEFILE PAS. Le logo, la barre du bas, la note de
       la musique sont fixes a l'ecran : on ne defile que pour ce qui defile.

       ⚠️ 12 h 45 — Mickael : « a chaque fois qu'on va dans les images, il faut
       qu'on se mette sur la page d'accueil, et ensuite que ca aille a cet
       endroit comme je l'ai fait pour les photos, et ensuite qu'il y ait le
       halo. C'est pour montrer d'ou on le trouve. »
       Plus de defilement lisse du navigateur, trop rapide et sans ame : la page
       GLISSE jusqu'a la tuile a la vitesse de sa main — celle mesuree sur sa
       descente aux visages, 7 578 pixels en 4,3 secondes — et le halo ne
       s'allume qu'une fois arrivee. */
    /* ⚠️ 12 h 55 — Mickael : « le bouton rouge n'est plus au bon endroit, je ne
       sais pas ce que tu as fait. » C'est moi : la lumiere guettait deux mesures
       identiques pour se croire posee — or un glissement doux DEMARRE presque
       immobile, et elle se posait avant le depart, au mauvais endroit. Elle
       attend maintenant la fin du glissement, et seulement apres elle guette. */
    const arrivee = estAncre(c) ? Promise.resolve() : glisserVersElement(c);
    const monFilDeLumiere = ++filDeLumiere;
    arrivee.then(() => {
    if (monFilDeLumiere !== filDeLumiere) return;    /* une autre lumiere a pris la main */
    let avant = null, stable = 0, tours = 0;
    const H2 = (window.__horlogeHorsSurveillance || window).setInterval;
    const montre = guette = H2.call(window, () => {
      const r = c.getBoundingClientRect();
      const ou = [r.left|0, r.top|0, r.width|0, r.height|0].join(',');
      stable = (ou === avant) ? stable + 1 : 0;
      avant = ou;
      tours++;
      /* deux mesures identiques : l'objet s'est arrete, on peut poser la lumiere.
         Et au bout de trois secondes on la pose de toute facon : on ne reste
         jamais bloque a attendre quelque chose qui ne s'immobilise pas. */
      if (stable >= 2 || tours > 80){     /* jusqu'a 8 s : le temps d'un glissement a sa main */
        clearInterval(montre); guette = null;
        const r2 = poserSur(c);
        rangerLePasser(r2);
        /* on continue a le suivre, doucement, tant qu'on parle de lui */
        /* ⚠️ 13 h 10 — « apres la validation, la lumiere part sur la gauche tout
           en haut. » Le bouton rouge s'efface a la fin de la phrase, et le suivi
           continuait a se poser sur lui — un objet efface est en (0,0). Si
           l'objet suivi disparait ou devient invisible, la lumiere s'eteint
           doucement au lieu de partir dans le coin. */
        suivi = H2.call(window, () => {
          const rr = c.isConnected ? c.getBoundingClientRect() : null;
          if (rr && (rr.width || rr.height)) poserSur(c);
          else { clearInterval(suivi); suivi = null; voile.style.background = 'transparent'; trou.classList.remove('la'); haloActuel = null; }
        }, 250);
      }
    }, 100);
    });
  }
  let filDeLumiere = 0;

  /* ⚠️ « Aucun texte ne doit manger un autre texte. » Le bouton « Passer la
     visite » vit en bas de l'ecran — et quand on montre la barre du bas, il se
     posait pile dessus et mangeait les mots ATELIER et TEXTES (vu en image le
     11 septembre). Des que la lumiere descend dans le bas de l'ecran, il monte
     en haut. Il ne disparait jamais : on ne retient personne. */
  /* on mesure la barre du bas pour se ranger au-dessus d'elle. En paysage il
     n'y en a pas (une colonne a gauche a la place) : la mesure vaut alors zero,
     et le bouton redescend naturellement. */
  function mesurerLaBarreDuBas(){
    const b = document.querySelector('.bas');
    const h = (b && getComputedStyle(b).display !== 'none') ? Math.round(b.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--hBas', h + 'px');
  }
  addEventListener('resize', mesurerLaBarreDuBas);

  /* ⚠️ « Aucun texte ne doit manger un autre texte. » Ce bouton a mange trois
     choses avant de trouver sa place, et chaque fois c'est l'image qui me l'a
     appris, jamais le code :
       · la barre du bas et ses mots ATELIER, TEXTES ;
       · la carte rouge, quand je le faisais sauter en haut de l'ecran ;
       · la legende du halo bleu — celle qu'on etait justement en train de
         montrer, ce qui est le pire des trois.
     La regle est donc simple et generale : sa place ordinaire est au-dessus de
     la barre du bas ; et s'il touche ce que la lumiere designe, il se range
     juste AU-DESSUS de ce cadre. Jamais dedans, jamais par-dessus. */
  function rangerLePasser(r){
    barre.style.bottom = '';
    if (!r) return;
    const b = barre.getBoundingClientRect();
    const seTouchent = !(b.bottom < r.top - 6 || b.top > r.bottom + 6);
    if (seTouchent){
      const hautDuCadre = Math.max(0, r.top);
      barre.style.bottom = Math.max(12, innerHeight - hautDuCadre + 12) + 'px';
    }
  }

  function marquer(){
    [...puces.children].forEach((p, k) => {
      p.classList.toggle('ici', k === ici);
      p.classList.toggle('faite', k < ici);
    });
  }

  /* 20 h 15 — Mickael : « il faut qu'ils puissent voir. » On garde la sortie,
     mais elle revient : « j'arrete la » ne marque plus la visite comme vue. A la
     prochaine ouverture de l'accueil, elle reprend d'elle-meme la ou elle en
     etait. Seule une visite suivie jusqu'au bout compte comme vue. */
  let depuisSommaire = false;
  function finir(complete){
    arrete = true; fil++;   /* tout ce que revient d'avant est desormais perime */
    rendreLaVeille();
    libererOrientation();   /* « choisis le mode qui te va » : la visite finie, il tourne s'il veut */
    try { son.onended = son.onerror = null; } catch(e){}
    try { son.pause(); } catch(e){}
    document.body.classList.remove('enVisite', 'menu');
    voile.style.background = 'transparent'; trou.classList.remove('la');
    effacerLeBonjour();
    eteindreLesHorloges();
    tourne.classList.remove('la');
    if (complete){ try { localStorage.setItem(CLE_VUE, '1'); localStorage.removeItem(CLE_OU); } catch(e){} }
    rendreLaMusique();
    const rs = document.querySelector('#vRetourSommaire'); if (rs) rs.hidden = true;
    /* partie du sommaire : on y revient, que la visite soit finie ou arretee */
    if (depuisSommaire){ depuisSommaire = false; const so = document.querySelector('#vSommaire'); if (so) so.hidden = false; }
  }

  /* ── LA MUSIQUE DU HALL, PENDANT QU'ON PARLE ───────────────────────────
     On ne clique surtout pas sur la note : un appui ouvre le panneau, il en
     faut deux pour eteindre, et on casserait l'etat du lecteur. On baisse le
     volume de la bande, tout simplement — et on le rend a la fin. Comme un
     fondu dans Reaper : la musique reste dessous, elle ne s'arrete pas. */
  let volumeGarde = null;
  const bandeDuHall = () => [...document.querySelectorAll('audio')]
    .find(a => a !== son && !a.paused);
  function baisserLaMusique(){
    const b = bandeDuHall();
    if (b && volumeGarde === null){ volumeGarde = b.volume; b.volume = Math.min(b.volume, 0.10); }
  }
  function rendreLaMusique(){
    const b = bandeDuHall();
    if (b && volumeGarde !== null) b.volume = volumeGarde;
    volumeGarde = null;
  }

  /* ⚠️ 12 septembre — LE PARAMETRE S'APPELAIT « apres », COMME LE MINUTEUR.
     Quand j'ai fait passer toute la visite aux horloges qui survivent aux
     changements de page, j'ai renomme chaque « setTimeout » en « apres » — y
     compris la ou « apres » etait deja le nom de la suite a jouer. La ligne
     « attendre un peu, puis continuer » s'est donc changee en « continuer tout
     de suite ». D'ou le defaut que Mickael a vu : ca partait sans lui.
     Les suites s'appellent « alors », maintenant. Deux noms, deux choses. */
  function attendre(quoi, alors){
    if (quoi === 'paysage'){
      libererOrientation();
      if (innerWidth > innerHeight){ verrouillerPaysage(); return alors(); }
      tourne.classList.add('la');
      let fait = false;
      const voir = () => { if (!fait && innerWidth > innerHeight){ fait = true;
        tourne.classList.remove('la');
        removeEventListener('resize', voir); verrouillerPaysage(); apres(alors, 500); } };
      addEventListener('resize', voir);
      /* ⚠️ 13 septembre, 18 h 50 — la soeur de Mickael : « tout est noir ». Si la
         ROTATION AUTOMATIQUE du telephone est coupee, tourner ne change rien et
         cet ecran noir reste. Au bout de 3 s, l'application couche l'ecran
         elle-meme (elle en a le droit, installee) : le film des six se voit. */
      apres(() => { if (!fait && innerWidth <= innerHeight){
        try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape-primary').catch(() => {}); } catch(e){}
      } }, 3000);
      /* on ne retient personne : au bout de vingt secondes, on continue */
      apres(() => { if (fait) return; fait = true;
        signalerVisite('paysage-bloque');
        tourne.classList.remove('la'); removeEventListener('resize', voir); alors(); }, 20000);
      return;
    }
    alors();
  }

  /* ── LA QUESTION DU BOUTON ROUGE ────────────────────────────────────────
     ⚠️ 12 septembre — Mickael : « il faut que les paroles s'arretent tant qu'il
     n'a pas fait le choix. Pense a Ren'Py : il y a un choix a faire, hop. S'il
     n'a pas fait le choix, rien ne se met en marche. »

     Un choix qui se fait tout seul n'est pas un choix. Le compte a rebours de
     quinze secondes est supprime : la visite attend, aussi longtemps qu'il le
     faut, et rien d'autre ne se passe pendant ce temps.

     Et s'il part envoyer le message, on l'attend VRAIMENT — jusqu'a ce qu'il
     revienne sur l'application. Deux secondes et demie, c'etait le temps
     d'ouvrir WhatsApp, pas celui d'ecrire et de revenir. */
  function demander(d, alors){
    const boite = document.createElement('div');
    boite.className = 'visiteGarde'; boite.id = 'vDemande';
    boite.innerHTML = '<div class="bulle"><p>' + d.texte + '</p>'
      + '<button class="oui">' + d.oui + '</button>'
      + '<button class="non">' + d.non + '</button></div>';
    /* la voix se tait : on ne parle pas par-dessus un choix */
    try { son.pause(); } catch(e){}
    document.body.appendChild(boite);
    const partir = (ouvrir) => {
      boite.remove();
      /* ⚠️ 12 septembre — Mickael : « s'il fait le choix negatif, tu dis : ok,
         tu as fait ce choix. Par contre, quand tu le desireras, tu pourras
         avertir Mickael. » Les deux reponses ont droit a la meme consideration :
         « plus tard » est un choix, pas un echec, et on le lui dit. */
      if (!ouvrir) return repondre('02d-plus-tard', alors);
      const c = document.querySelector(d.fait);
      if (c) c.click();
      /* ⚠️ 12 septembre — Mickael : « des que j'ai appuye sur le bouton, elle
         dit ah super, tout de suite. Mais il faut qu'elle attende que je sois
         sur WhatsApp, que j'envoie, et que je revienne. Et meme, il pourrait y
         avoir une question quand il revient : ca y est, tu as envoye ? Parce
         que meme s'il va sur WhatsApp, il peut revenir en arriere. »

         Il a raison sur les deux points, et sa solution vaut mieux que la
         mienne. Je m'appuyais sur un signal du telephone — « la page est
         cachee, la page revient » — pour deviner qu'il avait envoye. Ce signal
         ment : le partage d'Android s'ouvre parfois SANS cacher la page, et
         surtout, revenir n'est pas envoyer. Il peut ouvrir WhatsApp et faire
         demi-tour.
         On ne devine plus : on demande. La question l'attend a son retour,
         aussi longtemps qu'il faut, et c'est SA reponse qui decide laquelle des
         deux phrases il entendra. */
      demanderSiEnvoye(alors);
    };
    boite.querySelector('.oui').addEventListener('click', () => partir(true));
    boite.querySelector('.non').addEventListener('click', () => partir(false));
    /* et AUCUN compte a rebours : tant qu'il n'a pas repondu, rien ne bouge. */
  }

  /* ── « COMMENCER » : LA PORTE DE SECOURS DU SON ──────────────────────────
     Elle ne s'ouvre que si le telephone a refuse de parler sans qu'on le touche.
     Un seul bouton, aucune question, et la visite reprend au meme endroit. */
  function demanderLePremierAppui(k, monFil){
    if (document.querySelector('#vDepart')) return;
    const b = document.createElement('div');
    b.className = 'visiteGarde'; b.id = 'vDepart';
    b.innerHTML = '<div class="bulle"><p>Monte le son, et touche pour commencer.</p>'
      + '<button class="oui">Commencer la visite</button></div>';
    document.body.appendChild(b);
    b.querySelector('.oui').addEventListener('click', () => {
      b.remove();
      if (monFil !== fil) return;
      /* 12 h 40 — on annule les gestes deja lances (defilement, lumieres) avant de rejouer l'arret */
      fil++; eteindreLesHorloges(); try { son.pause(); } catch(e){}
      jouer(k, fil);
    });
  }

  /* ── UN APPEL ARRIVE ────────────────────────────────────────────────────
     Le telephone sonne, il sort de l'application : la voix se tait a l'instant.
     Elle ne s'arrete pas, elle ne recommence pas — elle attend exactement la ou
     elle en etait, et elle repart quand il revient. C'est la meme regle que la
     musique du hall, qui s'efface quand quelqu'un appelle. */
  let sorti = false;
  addEventListener('visibilitychange', () => {
    if (!document.body.classList.contains('enVisite') || arrete) return;
    if (document.visibilityState === 'hidden'){
      sorti = !son.paused;              /* on ne note que si elle parlait */
      try { son.pause(); } catch(e){}
    } else if (sorti && !enPause){
      sorti = false;
      apres(() => { if (son.src && !enPause && !arrete) son.play().catch(() => {}); }, 700);
    }
  });

  /* ── « ÇA Y EST, TU AS ENVOYÉ ? » ───────────────────────────────────────
     Elle s'affiche a l'instant ou il part, donc elle est deja la quand il
     revient. Aucun compte a rebours, aucun signal a interpreter : elle attend.
     C'est la troisieme des exceptions ou il a la main, et la derniere. */
  function demanderSiEnvoye(alors){
    const b = document.createElement('div');
    b.className = 'visiteGarde'; b.id = 'vDemande';
    b.innerHTML = '<div class="bulle">'
      + '<p>Ça y est, tu as envoyé le message à Mickaël ?</p>'
      + '<button class="oui">Oui, c’est envoyé</button>'
      + '<button class="non">Non, finalement plus tard</button></div>';
    document.body.appendChild(b);
    /* elle nait pendant qu'il quitte l'application : on la rend sourde une
       demi-seconde, pour qu'aucun geste en cours ne reponde a sa place. */
    b.style.pointerEvents = 'none';
    apres(() => { b.style.pointerEvents = ''; }, 600);
    /* ⚠️ 12 h 10 — Mickael : « quand c'est envoye, il faut que ca se
       transforme en vert, et LA ensuite elle parle. » Et : « s'il revient en
       arriere et dit non, finalement je ne l'ai pas fait, il faut un autre
       texte » — different de « plus tard », qui est le refus d'y aller. */
    const partir = (envoye) => {
      b.remove();
      if (envoye){
        if (typeof window.marquerLeRecuEnvoye === 'function') window.marquerLeRecuEnvoye(true);
        /* le vert d'abord ; la voix ; et A LA FIN de la phrase, tout s'efface
           d'un coup et on continue sans attendre */
        /* 14 h 30 — « on ne va pas faire d'effacement : il restera toujours en
           vert, comme une cle validee. » */
        apres(() => repondre('02c-merci', alors), 900);
      } else {
        repondre('02g-pas-fait', alors);
      }
    };
    b.querySelector('.oui').addEventListener('click', () => partir(true));
    b.querySelector('.non').addEventListener('click', () => partir(false));
  }

  /* ── ON L'ATTEND VRAIMENT ───────────────────────────────────────────────
     Il est parti dans WhatsApp. Le telephone nous le dit : la page devient
     « cachee », puis « visible » quand il revient. On ne reprend pas une
     seconde avant — et s'il ne revient jamais, il n'y a rien a reprendre : la
     visite dort, elle ne tourne pas dans le vide. */
  function attendreSonRetour(alors){
    let parti = document.visibilityState === 'hidden', fini = false;
    const finir1 = () => { if (fini) return; fini = true;
      document.removeEventListener('visibilitychange', voir); alors(); };
    const voir = () => {
      if (document.visibilityState === 'hidden'){ parti = true; return; }
      if (parti) apres(finir1, 900);     /* le temps que l'ecran revienne */
    };
    document.addEventListener('visibilitychange', voir);
    /* s'il n'est pas sorti du tout — le partage s'est ouvert par-dessus sans
       quitter l'application, ou le telephone l'a refuse — on reprend au bout de
       huit secondes : on ne le laisse jamais devant un ecran mort. */
    apres(() => { if (!parti) finir1(); }, 8000);
  }

  /* ── LA REPONSE A SON CHOIX ─────────────────────────────────────────────
     Mickael : « il faudrait lui dire quand il a fait le choix. » Une phrase
     pour « je le fais maintenant », une autre pour « plus tard ». Ce sont les
     deux seules de toute la visite qui repondent a un geste — et aucune des
     deux ne reproche quoi que ce soit.

     Si le fichier n'est pas encore la, on enchaine sans rien dire : la visite
     ne bloque jamais sur un son manquant. */
  function repondre(quoi, alors){
    son.onended = son.onerror = null;
    let passe = false;
    const suite = () => { if (!passe){ passe = true; apres(alors, 700); } };
    son.src = sonCommun(quoi);
    son.onended = suite;
    son.onerror = () => apres(suite, 200);
    son.play().catch(() => apres(suite, 200));
  }

  /* ── LE DOIGT QUI SE POSE ───────────────────────────────────────────────
     « Et si son doigt touche l'ecran pendant la visite — par reflexe, ou pour
     voir — la visite se met en pause et propose : on continue ? Elle ne lutte
     jamais contre lui. » Le voile, la barre et la question ne comptent pas :
     ce sont ses trois rendez-vous a lui. */
  let enPause = false, reprendre = null;
  function pauser(){
    if (enPause || arrete || !document.body.classList.contains('enVisite')) return;
    enPause = true;
    try { son.pause(); } catch(e){}
    const b = document.createElement('div');
    b.className = 'visiteGarde'; b.id = 'vPause';
    b.innerHTML = '<div class="bulle"><p>Visite en pause.</p>'
      + '<button class="oui">On continue</button>'
      + '<button class="non">J&rsquo;arrête là</button></div>';
    document.body.appendChild(b);
    /* ⚠️ LA BOITE NAIT SOUS SON DOIGT. Le meme geste qui la fait apparaitre
       envoie ensuite un clic au meme endroit — et ce point tombe pile sur un
       bouton. Elle se refermait donc dans la seconde, parfois sur « j'arrete
       la » (vu en essai le 11 septembre). Elle reste sourde une demi-seconde,
       le temps que le doigt se leve. */
    b.style.pointerEvents = 'none';
    apres(() => { b.style.pointerEvents = ''; }, 500);
    b.querySelector('.oui').addEventListener('click', () => {
      b.remove(); enPause = false; try { son.play(); } catch(e){}
    });
    b.querySelector('.non').addEventListener('click', () => { b.remove(); enPause = false; finir(false); });
  }
  document.addEventListener('pointerdown', e => {
    if (!document.body.classList.contains('enVisite')) return;
    if (e.target.closest('#vBarre, #vDemande, #vPause, #vEntree, #vTourne, #vEssai, #vNote, #vTexte, #vBonjour, #vDepart')) return;
    pauser();
  }, true);

  function jouer(k, monFil){
    if (arrete || monFil !== fil) return;   /* un depart perime ne joue rien */
    ici = k; marquer();
    /* ⚠️ 12 septembre — Mickael : « s'il y a un appel au telephone, il ne faut
       pas que ca revienne au tout debut du tutoriel. Il faut que quand il
       revient dans l'application, ca se soit arrete, pour qu'il puisse
       reprendre. »
       C'est capital, et ca ne vaut pas que pour les appels : Android peut fermer
       une page laissee de cote, et l'application repart alors de zero. Deux
       minutes et demie a reecouter pour un coup de fil, personne ne le ferait
       deux fois. On note donc l'arret en cours a chaque pas. */
    try { localStorage.setItem(CLE_OU, JSON.stringify({ k: k, quand: Date.now() })); } catch(e){}
    if (k >= ARRETS.length) return finir(true);
    const a = ARRETS[k];
    /* ⚠️ 12 septembre — NE PAS PARLER DE CE QUI N'EST PLUS LA.
       Mickael : « je ne vois meme plus le bouton rouge, pourquoi ca a disparu ? »
       Rien n'etait casse : c'est sa regle du 11 septembre — une fois le message
       envoye, le bouton s'effacait pour de bon, « si ca a ete envoye, c'est
       termine ». Mais la visite, elle, continuait de consacrer un arret entier a
       un bouton absent : une voix qui parle d'un objet invisible, et une lumiere
       posee sur du vide.
       Un arret marque « sauterSiAbsent » s'efface donc de lui-meme quand ce
       qu'il montre n'est plus la. La visite a une etape de moins, et plus rien
       de faux. */
    if (a.sauterSiAbsent && a.vise && !document.querySelector(a.vise))
      return jouer(k + 1, monFil);
    /* 14 h 50 — le bouton vert RESTE affiche : l'arret ne se saute plus parce
       qu'il est absent, mais parce qu'il est deja vert. Sinon la voix dirait
       « ce bouton rouge » devant un bouton vert. */
    if (a.sauterSiVert && a.vise){ const e = document.querySelector(a.vise); if (e && e.classList.contains('faitVert')) return jouer(k + 1, monFil); }
    /* ── LES GESTES PENDANT LA PHRASE ───────────────────────────────────
       ⚠️ 12 septembre — Mickael : « pour le menu, il ne s'est pas ouvert
       automatiquement. Elle a voulu montrer des choses mais je n'ai rien vu,
       j'ai vu la fin juste. Il faut que ca glisse rapidement, automatiquement,
       pour pouvoir vraiment voir. »

       Le defaut etait dans l'ordre des choses : je faisais le geste AVANT de
       parler. Le menu s'ouvrait donc dans le silence, avant que la voix ne dise
       « je t'ouvre le menu » — et quand elle le disait, c'etait deja fait.

       Un arret peut maintenant porter une suite de gestes DATES : a telle
       seconde de la phrase, tel geste. La voix et la main travaillent ensemble,
       comme quelqu'un qui montre en parlant. */
    const posterLesGestes = () => {
      (a.pendant || []).forEach(g => {
        /* ⚠️ « part » plutot que « a » : une fraction de la phrase, pas un
           nombre de secondes. Les six voix ne parlent pas a la meme vitesse —
           la meme phrase fait 54 secondes chez Stephanie et 59 chez Adrien — et
           un temps fixe tombait donc a cote chez les uns ou chez les autres. La
           duree n'est connue qu'une fois la bande chargee : on attend. */
        const poser = (quand) => apres(() => {
          if (monFil !== fil || arrete || enPause) return;
          if (GESTES[g.geste]) GESTES[g.geste]();
          if (g.surligne !== undefined) surligner(g.surligne);
          if (g.bleu !== undefined) surligner(g.bleu, 'visiteBleu');
          if (g.vise !== undefined) eclairer(g.vise);
        }, Math.round(quand * 1000));
        if (g.part !== undefined){
          const calculer = () => { if (son.duration) poser(son.duration * g.part); };
          if (son.duration) calculer();
          else son.addEventListener('loadedmetadata', calculer, { once: true });
        } else poser(g.a);
      });
    };

    const suite = () => {
      if (monFil !== fil) return;
      baisserLaMusique();   /* elle peut etre repartie apres un changement de page */
      eclairer(a.vise);
      son.src = a.son;
      /* ⚠️ LE VERROU. Sans lui, un son manquant declenche DEUX fois la suite —
         une fois par « onerror », une fois par le refus de « play » — et la
         visite saute un arret sur deux, ou pose la meme question trois fois.
         Vu en essai le 11 septembre. Un arret ne passe la main qu'une fois. */
      let passe = false;
      const suivant = () => {
        if (arrete || passe || monFil !== fil) return;
        passe = true;
        /* en mode essai, on s'arrete la : c'est lui qui appuie sur ▶ */
        /* ⚠️ 13 h 30 — Mickael : « quand je reviens en arriere, en avant, il est
           perdu. » C'est le mode essai qui coupait l'enchainement : apres un
           arret, il attendait ▶, la page restait ou elle etait, et la descente
           vers l'arret suivant — celle qu'il veut voir — n'avait jamais lieu.
           L'enchainement est retabli, en essai comme en vrai. Pour revenir : ◀. */
        const aller = () => apres(() => jouer(k + 1, monFil), 350);
        const puis = () => { if (a.demande) demander(a.demande, aller); else aller(); };
        if (gesteEnCours){ const g = gesteEnCours; gesteEnCours = null; g.then(puis); }
        else puis();
      };
      son.onended = suivant;
      /* si le son manque — fichier absent, réseau coupé — on n'attend pas : on
         laisse le temps de lire l'écran et on continue. La visite ne bloque jamais. */
      son.onerror = () => apres(suivant, 3500);
      posterLesGestes();
      /* ⚠️ LA SEULE RESERVE, ET ELLE EST REELLE : un telephone refuse de jouer
         un son si personne n'a encore touche l'ecran. En demarrant d'elle-meme,
         la visite risquait donc de se derouler MUETTE — des images qui defilent
         sans la voix, ce qui est pire que rien.
         On ne le devine pas : on essaie, et si le telephone refuse, on pose un
         seul bouton — « Commencer » — qui n'apparait que dans ce cas-la, et qui
         reprend exactement ou on etait. Un appui, et tout se debloque pour le
         reste de la visite. */
      son.play().catch(err => {
        if (err && /NotAllowed/i.test(String(err.name || err))) demanderLePremierAppui(k, monFil);
        else apres(suivant, 3500);
      });
    };
    /* 15 h — un geste « avant » peut rendre une promesse (la remontee vers le
       menu) : on l'attend, au lieu de parler pendant que la page bouge encore. */
    let d = a.avant && GESTES[a.avant] ? GESTES[a.avant]() : 0;
    const attendreAvant = (d && typeof d.then === 'function') ? d : null;
    if (attendreAvant) d = 0;
    const apresAvant = (fn, ms) => attendreAvant ? attendreAvant.then(() => apres(fn, ms)) : apres(fn, ms);

    /* ⚠️ 12 septembre, 11 h — Mickael : « entre le moment ou la phrase a
     termine et la suivante, il y a deux ou trois secondes a chaque fois. Quand
     c'est fini, tout de suite il faut parler de l'accueil. » Les respirations
     entre arrets et entre etapes sont passees de 900 a 350 ms, et de 250 a 80
     entre un son et le geste qui le suit. On respire, on ne baille plus. */
  /* ── UN ARRET EN PLUSIEURS ETAPES ──────────────────────────────────
       Quand un arret porte « etapes », on les joue l'une apres l'autre : un son
       (on attend qu'il finisse), un geste (on attend sa promesse), une pause.
       Rien ne se chevauche. C'est ce qui permet a la voix de ne dire « voila »
       qu'une fois la page revenue en haut. */
    if (a.etapes){
      const jouerEtape = (n) => {
        if (monFil !== fil || arrete) return;
        if (n >= a.etapes.length){ apres(() => jouer(k + 1, monFil), 350); return; }
        const e = a.etapes[n];
        const encore = () => jouerEtape(n + 1);
        if (e.son){
          let passe = false;
          const fini = () => { if (!passe){ passe = true; apres(encore, 80); } };
          son.onended = fini;
          son.onerror = () => apres(fini, 2500);
          /* ⚠️ 12 septembre, 11 h 15 — Mickael : « des que tu dis regarde, il
             faut partir. Regarde, hop, tout de suite. Il y a trois ou quatre
             secondes apres le regard. » Une phrase enregistree finit toujours
             par un souffle qu'on ne peut pas couper sans abimer le dernier mot.
             Alors on n'attend pas la fin du FICHIER : « chevauche » dit combien
             de secondes avant la fin on lance la suite. Le geste part sur le
             mot lui-meme, comme une main qui bouge en parlant. */
          if (e.chevauche){
            const guetter = () => {
              if (passe || monFil !== fil) return;
              if (son.duration && son.currentTime >= son.duration - e.chevauche) fini();
              else apres(guetter, 60);
            };
            apres(guetter, 200);
          }
          son.src = e.son;
          son.play().catch(err => {
            if (err && /NotAllowed/i.test(String(err.name || err))) demanderLePremierAppui(k, monFil);
            else apres(fini, 2500);
          });
        } else if (e.geste && GESTES[e.geste]){
          const r = GESTES[e.geste]();
          if (r && typeof r.then === 'function') r.then(encore); else apres(encore, r || 0);
        } else if (e.attendre){
          apres(encore, e.attendre);
        } else encore();
      };
      apresAvant(() => { eclairer(a.vise); jouerEtape(0); }, d);
      return;
    }

    if (a.attend) apresAvant(() => attendre(a.attend, suite), d);
    else apresAvant(suite, d);
  }

  /* ── BIENVENUE, AVEC SON VISAGE ─────────────────────────────────────────
     ⚠️ 12 septembre — Mickael : « je pense mettre la photo avec "Bienvenue",
     des le debut, ce n'est deja pas mal. Bienvenue Stephanie, bienvenue
     Mickael, avec la photo de chaque personne. Et on commence l'aide juste
     apres. »

     Ca remplace la page d'informations qui arrivait la avant, et qui arrivait
     mal : apres trois minutes de film, une page dense ne se lit pas, elle se
     traverse. Un visage et un prenom, deux secondes, et la voix prend la suite.
     Chacun dans sa couleur, celle de ses lignes dans l'atelier. */
  const PORTRAITS = { adrien:'Adrien', stephanie:'Stéphanie', candice:'Candice',
                      mickael:'Mickaël', bry:'Bry', elie:'Élie' };
  let bonjour = null;
  function effacerLeBonjour(){
    if (!bonjour) return;
    const b = bonjour; bonjour = null;
    b.classList.remove('la');
    apres(() => b.remove(), 1100);
  }
  function montrerLeBonjour(alors){
    const nom = PORTRAITS[qui];
    if (!nom) return alors();              /* on ne sait pas qui c'est : on passe */
    /* 16 h 45 — vu sur son telephone : deux « Bienvenue » empiles (un lance a
       distance, un lance du menu). On effacait le second, le premier restait
       pour toujours. Un nouveau visage remplace TOUJOURS l'ancien. */
    document.querySelectorAll('#vBonjour').forEach(v => v.remove());
    bonjour = document.createElement('div');
    bonjour.id = 'vBonjour'; bonjour.className = 'visiteGarde';
    bonjour.style.setProperty('--c', 'var(--' + qui + ')');
    bonjour.innerHTML = '<div class="bCarte">'
      + '<div class="bCadre"><img src="site-assets/' + qui + '-2.jpg" alt=""><i></i></div>'
      + '<div class="bMot">Bienvenue</div>'
      + '<div class="bNom">' + nom + '</div></div>';
    document.body.appendChild(bonjour);
    /* si la photo manque, le prenom reste, seul : jamais de cadre vide */
    const img = bonjour.querySelector('img');
    img.addEventListener('error', () => { const c = img.closest('.bCadre'); if (c) c.style.display = 'none'; });
    apres(() => bonjour.classList.add('la'), 60);
    /* ⚠️ 12 septembre, corrige deux fois — Mickael, d'abord : « reste un peu plus
       longtemps avec la photo ». Puis, en le voyant tourner : « tu laisses la
       photo TANT QUE le premier bloc n'est pas passe. Et a partir de la premiere
       phrase qui est passee, la tu enleves la photo et tu dis : voici la page
       d'accueil. »

       Il a raison, et c'est mieux que ce que j'avais fait : le visage
       disparaissait au bout de six secondes pendant que la voix parlait encore,
       et on se retrouvait a ecouter un ecran vide. Il accompagne maintenant TOUTE
       la premiere phrase, et c'est sa disparition qui ouvre la visite — le rideau
       se leve au moment ou la voix dit « voila la page d'accueil ».

       On n'attend donc plus une duree : la suite demarre aussitot, et c'est
       l'arret suivant qui dira quand effacer. */
    alors();
  }

  /* ── la carte d'entrée ────────────────────────────────────────────────── */
  const entree = el('vEntree',
    '<div class="carte">'
    + '<h2>Bienvenue.</h2>'
    + '<p>Je peux te montrer l\'application en deux minutes — <b>tu n\'auras rien à toucher</b>.</p>'
    + '<p class="son">Monte le son de ton téléphone.</p>'
    + '<div class="gestes">'
    +   '<button class="oui">Oui, montre-moi</button>'
    +   '<button class="non">Non merci, je regarde seul</button>'
    + '</div></div>');

  /* ⚠️ 12 septembre — Mickael : « il faut que ce soit automatiquement en mode
     portrait. Si elle met en paysage, ca reste en portrait. C'est tres
     important, sinon le paysage va tout decaler. » On verrouille pendant la
     visite (ca ne marche qu'en application installee, ce qui est leur cas), et
     on libere a l'arret du paysage, puis a la fin. */
  /* ⚠️ 13 septembre, 18 h 50 — « les tetes a l'envers » (la soeur de Mickael,
     Xiaomi ; Elie ; sa niece). « portrait » tout court autorise Android a choisir
     le portrait RETOURNE (tete en bas) quand le capteur hesite. On ne demande
     plus que le portrait normal ; et le paysage dans le sens exact ou il tient
     le telephone a cet instant, jamais l'autre. */
  /* ═══ PRÉVENIR MICKAËL DEPUIS LA VISITE (13 septembre, 18 h 50) ═══
     Quand ca bloque chez quelqu'un, il faut SAVOIR : orientation, ecran qui
     couvre, taille, appli ou navigateur, telephone. Envoye a son sujet ntfy. */
  function signalerVisite(quoi){
    try {
      const NOMS = { adrien:'Adrien', stephanie:'Stéphanie', candice:'Candice', mickael:'Mickaël', bry:'Bry', elie:'Élie' };
      const qui = NOMS[(localStorage.getItem('boheme-pour') || '').toLowerCase()] || 'Quelqu\'un';
      const ua = navigator.userAgent || '';
      const tel = /iPhone|iPad/.test(ua) ? 'iPhone' : /Android/i.test(ua) ? 'Android' : 'ordinateur';
      const h = new Date(); const heure = h.getHours() + 'h' + String(h.getMinutes()).padStart(2, '0');
      let dessus = '?';
      try { const e = document.elementFromPoint(innerWidth / 2, innerHeight / 2); dessus = e ? (e.id || e.className || e.tagName) : 'rien'; } catch(e){}
      const appli = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches;
      const detail = ' — ' + (screen.orientation && screen.orientation.type || '?') + ', ' + innerWidth + '×' + innerHeight
        + ', dessus : ' + String(dessus).slice(0, 40) + ', appli=' + appli + ', voix ' + (son.paused ? 'muette' : 'parle')
        + ', arrêt ' + ici + ' — ' + ua.slice(0, 110);
      const TITRES = { 'paysage-bloque':'⚠️ Visite : bloqué sur « tourne ton téléphone »', 'noir':'⚠️ Visite : écran noir effacé', 'paysage':'Visite : arrêt paysage' };
      fetch('https://ntfy.sh/boheme-b2ebc8b427d107aa5d79', { method:'POST', mode:'no-cors',
        headers:{ 'Title': TITRES[quoi] || quoi, 'Tags': quoi === 'paysage' ? 'compass' : 'rotating_light' },
        body: qui + ' — ' + tel + ' — ' + heure + detail });
    } catch(e){}
  }
  /* le garde-fou : pendant la visite, un ecran noir « tourne » qui reste plus de
     25 s n'a plus de raison d'etre ; on l'efface, et on le dit a Mickael */
  let noirDepuis = 0;
  setInterval(() => {
    try {
      if (!document.body.classList.contains('enVisite')){ noirDepuis = 0; return; }
      if (tourne.classList.contains('la')){ noirDepuis += 5; if (noirDepuis >= 25){ noirDepuis = 0; tourne.classList.remove('la'); signalerVisite('noir'); } }
      else noirDepuis = 0;
    } catch(e){}
  }, 5000);

  function verrouillerPortrait(){
    try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('portrait-primary').catch(() => {}); } catch(e){}
  }
  /* 18 h 45 — Mickael : « quand on est en paysage, je veux que ce soit bloque
     aussi, juste pendant ce temps-la. » Une fois tourne, on tient le paysage
     jusqu'a la fin, ou le portrait est remis. */
  function verrouillerPaysage(){
    try {
      if (!(screen.orientation && screen.orientation.lock)) return;
      const t = (screen.orientation.type || '');
      const sens = t.indexOf('landscape') === 0 ? t : 'landscape-primary';
      screen.orientation.lock(sens).catch(() => { screen.orientation.lock('landscape').catch(() => {}); });
    } catch(e){}
  }
  function libererOrientation(){
    try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch(e){}
  }

  /* ⚠️ 13 h 30 — Mickael : « au debut, c'est chiant la musique, c'est fatigant
     a l'oreille. Tu la mettras au moment ou tu la montreras. » La musique du
     hall se tait des le depart de la visite ; c'est l'arret de la musique qui
     l'allume, pour de vrai, quand la voix en parle. */
  function taireLaMusique(){
    const b = document.querySelector('.musique');
    const s2 = [...document.querySelectorAll('audio')].find(x => x !== son && !x.dataset.visite);
    if (b && s2 && !s2.paused){
      const r = b.querySelector('.mRond');
      if (r){ if (!b.classList.contains('ouvert')) r.click(); r.click(); }   /* deux appuis : son vrai geste pour eteindre */
    }
  }

  /* 13 septembre, 10 h — Mickael : « le retroeclairage se baisse pendant la
     visite ». Le verrou de veille du film, etendu a la visite : l'ecran reste
     allume tant qu'elle parle, et on le rend a la fin. Redemande si l'appli
     revient au premier plan (un appel le fait tomber). */
  let veille = null;
  function tenirEveille(){
    try {
      if (!('wakeLock' in navigator)) return;
      navigator.wakeLock.request('screen').then(v => { veille = v; }).catch(() => {});
    } catch(e){}
  }
  function rendreLaVeille(){ try { if (veille){ veille.release().catch(() => {}); veille = null; } } catch(e){} }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && document.body.classList.contains('enVisite')) tenirEveille(); });

  /* ⚠️ 13 septembre, 12 h 40 — LE DEFAUT DES NOUVEAUX VENUS (la niece de Mickael
     sur Samsung, Elie sur iPhone : « les tetes a l'envers », « le bouton rouge
     n'est pas apparu »). Chez quelqu'un qui n'a jamais utilise l'application,
     le telephone REFUSE de jouer la voix sans un toucher. La visite posait bien
     la carte « Commencer »… mais les gestes (le defilement vers les six visages,
     les lumieres) etaient deja programmes et tournaient derriere la carte ; a
     l'appui, la visite repartait du debut PAR-DESSUS ces gestes en cours : la
     voix disait « voila l'accueil » devant les visages, et la lumiere du bouton
     rouge tombait au mauvais moment. Mickael ne le voyait jamais : son telephone
     connait l'application, Chrome le laisse parler sans demander.
     Reproduit dans un Chrome Android emule (Pixel 7), corrige ici : AVANT de
     bouger quoi que ce soit, on verifie qu'on a le droit de parler. Si non, la
     carte « Commencer » vient en premier, et rien ne bouge avant l'appui. */
  const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
  function quandOnPeutParler(alors){
    let s2;
    try { s2 = new Audio(SILENCE); s2.volume = 0.01; } catch(e){ return alors(); }
    const p = s2.play();
    if (!p || typeof p.then !== 'function') return alors();
    p.then(() => { try { s2.pause(); } catch(e){} alors(); })
     .catch(err => {
       if (!(err && /NotAllowed/i.test(String(err.name || err)))) return alors();
       if (document.querySelector('#vDepart')) return;
       const b = document.createElement('div');
       b.className = 'visiteGarde'; b.id = 'vDepart';
       b.innerHTML = '<div class="bulle"><p>Monte le son, et touche pour commencer.</p>'
         + '<button class="oui">Commencer la visite</button></div>';
       document.body.appendChild(b);
       b.querySelector('.oui').addEventListener('click', () => { b.remove(); alors(); });
     });
  }

  function lancer(){
    /* un depart neuf annule tout ce qui pouvait encore tourner */
    fil++; arrete = false; tenirEveille();
    verrouillerPortrait();
    taireLaMusique();
    try { son.pause(); son.onended = son.onerror = null; } catch(e){}
    mesurerLaBarreDuBas();
    entree.classList.remove('la');
    document.body.classList.add('enVisite');
    baisserLaMusique();
    const k = departA; departA = 0;
    const monFil = fil;
    quandOnPeutParler(() => { if (monFil === fil) jouer(k, monFil); });
  }

  entree.querySelector('.oui').addEventListener('click', lancer);
  entree.querySelector('.non').addEventListener('click', () => {
    entree.classList.remove('la');   /* « une autre fois » : elle reviendra, sans etre marquee vue */
  });
  voile.addEventListener('click', e => e.stopPropagation());

  /* ── LE MODE ESSAI SE CHARGE-T-IL ? ─────────────────────────────────────
     ?essai=1 une seule fois, et c'est retenu : Mickael n'aura pas a retaper une
     adresse sur un telephone. ?essai=0 l'eteint. Et un appui long sur « Revoir
     la visite guidee », dans le menu, le bascule — c'est le chemin le plus
     court depuis son doigt. */
  const CLE_ESSAI = 'boheme-visite-essai';
  /* ⚠️ 12 septembre, 17 h — Mickael : « enleve-moi maintenant le systeme de
     test, je n'en ai plus besoin. Si j'en ai besoin, tu me le remettras. »
     UN SEUL INTERRUPTEUR : false = aucune porte vers le mode essai (ni
     ?essai=1, ni l'appui long sur le logo, ni le menu), et le drapeau qui
     trainerait dans un telephone est efface. Remettre true pour le rendre.
     Le meme interrupteur existe dans site.js (le bouton du menu). */
  const ESSAI_DISPONIBLE = false;  /* 19 h 30 — « enleve-moi le truc d'essai, je n'en ai plus besoin » */
  if (!ESSAI_DISPONIBLE){ try { localStorage.removeItem(CLE_ESSAI); } catch(e){} }
  try {
    const d = ESSAI_DISPONIBLE ? new URLSearchParams(location.search).get('essai') : null;
    if (d === '1') localStorage.setItem(CLE_ESSAI, '1');
    if (d === '0') localStorage.removeItem(CLE_ESSAI);
  } catch(e){}
  /* Pour ses essais : remettre le bouton rouge comme au premier jour. Il en a
     besoin pour reecouter l'arret 2, qui disparait une fois le message envoye. */
  window.remettreLeBoutonRouge = () => {
    try {
      Object.keys(localStorage).filter(k => /boheme-(recu|prevenu)/i.test(k))
        .forEach(k => localStorage.removeItem(k));
    } catch(e){}
    return 'le bouton redevient rouge — recharge la page';
  };

  window.__modeEssai = () => { if (!ESSAI_DISPONIBLE) return false; try { return localStorage.getItem(CLE_ESSAI) === '1'; } catch(e){ return false; } };
  window.basculerModeEssai = () => {
    if (!ESSAI_DISPONIBLE) return 'Revoir la visite guidée';
    let on = false;
    try {
      on = localStorage.getItem(CLE_ESSAI) !== '1';
      if (on) localStorage.setItem(CLE_ESSAI, '1'); else localStorage.removeItem(CLE_ESSAI);
    } catch(e){}
    return on ? 'mode essai ALLUMÉ — recharge la page' : 'mode essai éteint';
  };
  /* ⚠️ 12 septembre — Mickael : « j'aimerais pouvoir avoir acces aux trucs a
     l'avant et a l'arriere. Ca a defile, il y a eu un texte qui ne m'a pas plu,
     mais je ne peux pas revenir en arriere, je ne me souviens plus lequel. »

     Le drapeau du mode essai avait disparu de son telephone — une reinstallation
     de l'application, sans doute. Il se retrouvait donc sans commandes au milieu
     de la visite, exactement dans la situation qu'on voulait eviter. Un second
     chemin, plus court et qui ne depend d'aucun menu : un appui long sur le logo
     Boheme, en haut a gauche, pendant la visite. Deux secondes et demie —
     personne ne tombe dessus par hasard, et lui le trouve du premier coup. */
  {
    const logo = ESSAI_DISPONIBLE ? document.querySelector('.nav .marque') : null;
    if (logo){
      let t = null;
      const debut = () => { t = apres(() => {
        t = null;
        if (!window.__modeEssai()){
          try { localStorage.setItem(CLE_ESSAI, '1'); } catch(e){}
        }
        if (!document.querySelector('script[src="visite-navigateur.js"]')){
          const sc = document.createElement('script'); sc.src = 'visite-navigateur.js';
          document.body.appendChild(sc);
        } else if (typeof window.montrerLaBarreDEssai === 'function') window.montrerLaBarreDEssai();
      }, 2500); };
      const fin = () => { if (t){ clearTimeout(t); t = null; } };
      logo.addEventListener('pointerdown', debut);
      ['pointerup','pointercancel','pointerleave'].forEach(n => logo.addEventListener(n, fin));
    }
  }

  if (window.__modeEssai() && !document.querySelector('script[src="visite-navigateur.js"]')){
    const t = document.createElement('script'); t.src = 'visite-navigateur.js';
    document.body.appendChild(t);
  }

  /* on la propose à la toute première visite, sur l'accueil seulement */
  /* ── REPRENDRE LA OU IL EN ETAIT ────────────────────────────────────────
     Si l'application a ete fermee en cours de visite — un appel qui dure, le
     telephone qui range la page pour faire de la place — on ne recommence pas
     au debut. On propose de reprendre, et c'est lui qui decide. Passe deux
     heures, on considere que c'est une autre journee. */
  function ouIlEnEtait(){
    try {
      const r = JSON.parse(localStorage.getItem(CLE_OU) || 'null');
      if (r && typeof r.k === 'number' && r.k > 0 && Date.now() - r.quand < 7200000) return r.k;
    } catch(e){}
    return 0;
  }

  function proposer(){
    let vue = true;
    try { vue = localStorage.getItem(CLE_VUE) === '1'; } catch(e){}
    /* ⚠️ 12 septembre, 10 h — Mickael : « comme on ne la voit qu'une seule fois,
       quand je dis ok c'est bon, je ne peux plus revenir dessus. Pour tester, il
       me faut un truc pour que, quand je retourne dans l'application, j'aie le
       truc a chaque fois. »
       En mode essai, la visite repart donc a CHAQUE ouverture de l'accueil, comme
       si c'etait la premiere. Chez les six, rien ne change : une seule fois. */
    /* ⚠️ 12 septembre, 10 h 50 — Mickael : « je veux juste etre sur la page
       d'accueil. Ni sur le debut de Candice, ni apres. Tant que je n'ai pas
       valide, je ne veux pas que ca passe a autre chose. » En mode essai,
       plus rien ne demarre tout seul : il est sur l'accueil, la barre est la,
       et c'est lui qui lance ce qu'il veut. */
    if (window.__modeEssai && window.__modeEssai()){
      /* ⚠️ 12 h 15 — Mickael : « je suis alle sur WhatsApp, j'ai change d'avis,
         et il n'y a plus aucun message. Il ne sait pas ou aller. » En simulation
         tout marchait ; sur le telephone, Android avait RECHARGE l'application
         pendant qu'il etait dans WhatsApp, et en mode essai rien ne redemarre.
         Si une visite etait en cours, on la reprend a son arret, sans carte. */
      const reste = ouIlEnEtait();
      if (reste) apres(() => window.__visite.allerA(reste), 900);
      return;
    }
    /* une visite interrompue passe avant tout : meme s'il l'a deja vue, on lui
       propose de finir celle qu'il avait commencee. */
    const reste = ouIlEnEtait();
    /* ⚠️ 15 h 30 — Mickael : « on ne donne pas le choix "voulez-vous
       continuer ?". Je veux que ca avance. Il faut qu'on voie le tutoriel. »
       Apres un appel ou un rechargement, la visite reprend d'elle-meme a son
       arret, sans carte ni question. */
    if (reste){
      apres(() => { fil++; arrete = false; verrouillerPortrait(); taireLaMusique();
                    document.body.classList.add('enVisite');
                    const monFil = fil; quandOnPeutParler(() => { if (monFil === fil) jouer(reste, monFil); }); }, 900);
      return;
    }
    if (false){
      entree.querySelector('h2').textContent = 'On reprend ?';
      entree.querySelector('.oui').textContent = 'Reprendre là où j’en étais';
      entree.querySelector('.non').textContent = 'Non, une autre fois';
      entree.querySelector('p').innerHTML =
        'Ta visite s’est arrêtée à l’étape <b>' + (reste + 1) + ' sur ' + ARRETS.length
        + '</b> — <b>' + (ARRETS[reste].nom || '') + '</b>.';
      departA = reste;
      apres(() => entree.classList.add('la'), 900);
      return;
    }
    const surAccueil = /ACCUEIL/i.test(decodeURIComponent(location.pathname)) || location.pathname.endsWith('/');
    /* ⚠️ 12 septembre — ELLE DEMARRE SEULE.
       Mickael : « je pense que la visite devrait demarrer des le depart, sans
       demander l'autorisation. » Il a raison, et pour une raison qu'il n'a pas
       eu besoin de dire : une porte qu'on doit pousser se referme sur les
       distraits. « Non merci » etait un appui d'une seconde, et il coutait deux
       minutes trente d'explications a quelqu'un qui en avait besoin.
       Elle part donc d'elle-meme, comme une vidéo qui commence. « Passer la
       visite » reste en bas, petit, du debut a la fin : on ne retient personne,
       mais on ne demande plus la permission de l'accueillir. */
    if (!vue && surAccueil) apres(() => montrerLeBonjour(lancer), 700);
  }
  proposer();

  /* ── LA PORTE DU MODE ESSAI ─────────────────────────────────────────────
     Mickael : « il faudrait un truc de test pour voir point par point, et
     t'expliquer les choses au fur et a mesure. M'arreter, faire des pauses
     quand je le desire. »

     La visite n'a pas besoin de savoir qu'on l'examine : elle expose trois
     gestes, et c'est tout. Le mode essai (visite-navigateur.js) s'en sert pour
     dessiner sa barre. Rien de tout cela n'existe chez les chanteurs. */
  window.__visite = {
    ou(){
      const a = ARRETS[ici] || {};
      return { arret: Math.max(0, ici), total: ARRETS.length,
               nom: a.nom || '—', enPause: enPause,
               paysage: innerWidth > innerHeight };
    },
    /* aller droit a un arret : on ferme ce qui trainait, on remet le decor
       dans l'etat ou cet arret le trouve, et on le joue depuis le debut. */
    allerA(k){
      k = Math.max(0, Math.min(ARRETS.length - 1, k));
      fil++; arrete = false; enPause = false; tenirEveille();
      effacerLeBonjour(); mesurerLaBarreDuBas();
      /* les deux premiers arrets se jouent en haut de l'accueil ; les autres
         partent de la ou la page est, comme en vrai */
      if (k <= 1) scrollTo({ top: 0, behavior: 'instant' });
      if (k < 19) taireLaMusique();    /* avant l'arret de la musique, elle se tait */
      /* en essai, le bouton rouge revient a chaque passage sur son arret */
      if (k === 3 && window.__modeEssai && window.__modeEssai() && typeof window.remettreLeRecuRouge === 'function') window.remettreLeRecuRouge();
      const p = document.querySelector('#vPause'); if (p) p.remove();
      const d = document.querySelector('#vDemande'); if (d) d.remove();
      try { son.pause(); son.onended = son.onerror = null; } catch(e){}
      eteindreLesHorloges();
      document.body.classList.add('enVisite');
      /* le menu doit etre ouvert pour les arrets qui parlent de lui, ferme
         pour les autres : sinon on eclaire quelque chose d'invisible. */
      const dansLeMenu = false;
      document.body.classList.toggle('menu', dansLeMenu);
      const monFil = fil;
      /* 14 h — Mickael : « en mode test, je ne vois pas non plus la photo de
         Candice juste avant. Il faut que j'aie la possibilite de tout voir. »
         L'arret 1 se joue donc AVEC le visage, comme au premier jour. */
      if (k === 0){ verrouillerPortrait(); montrerLeBonjour(() => jouer(0, monFil)); return; }
      apres(() => jouer(k, monFil), dansLeMenu ? 450 : 120);
    },
    /* le nom du fichier de son d'un arret : le mode essai s'en sert pour
       retrouver le texte ecrit correspondant. */
    /* 17 h 25 — le nom de chaque arret, pour le sommaire du navigateur */
    nom(k){ return (ARRETS[k] && ARRETS[k].nom) || ''; },
    cle(k){
      const a = ARRETS[k];
      const src = a && (a.son || (a.etapes && (a.etapes.find(e => e.son) || {}).son));
      if (!src) return '';
      const m = decodeURIComponent(src).match(/([^/]+?)--/);
      return m ? m[1] : '';
    },
    urlDuSon(cle){ return sonCommun(cle); },
    basculerPause(){
      if (enPause){
        const b = document.querySelector('#vPause'); if (b) b.remove();
        enPause = false;
        /* si l'arret n'a pas de son, on ne tente rien : sinon le navigateur se
           plaint d'une bande sans source (vu en essai). */
        if (son.src) son.play().catch(() => {});
      } else { pauser(); }
    },
  };

  /* et on peut la redemander, à tout moment */
  /* ── LE SOMMAIRE DE LA VISITE, pour les six ──────────────────────────────
     18 h 45 — Mickael : « quand on met "Revoir la visite guidee", je veux garder
     juste le sommaire. Pas le nom de la voix, pas les prenoms, pas les fleches,
     pas le mode essai. Ils touchent un arret, et ils l'ecoutent. » */
  /* 19 h 40 — Mickael : « quand on appuie sur Revoir la visite guidee, la page
     Visite guidee apparait en plein ecran. La ou il y avait accueil, atelier,
     textes, menu : une croix et le menu special de la visite. Tout disparait
     sauf le trait jaune en bas. On appuie sur le menu, un beau menu glisse, une
     croix en haut le referme. La croix du bas ramene au logiciel comme avant. »
     Deux photos, une par orientation, faites par lui dans Flow. */
  const sommaire = document.createElement('div');
  sommaire.id = 'vSommaire'; sommaire.className = 'visiteGarde'; sommaire.hidden = true;
  sommaire.innerHTML =
      '<img class="fond paysage" alt="" src="site-images/visite-sommaire-paysage.jpg?v=' + VOIX_VERSION + '">'
    + '<img class="fond portrait" alt="" src="site-images/visite-sommaire-portrait.jpg?v=' + VOIX_VERSION + '">'
    + '<div class="bande">'
    +   '<button class="fermer" type="button"><span class="x">\u2715</span><span class="mot">Fermer</span></button>'
    +   '<button class="menu" type="button"><span class="x">\u2630</span><span class="mot">Sommaire de la visite</span></button>'
    + '</div>'
    + '<div class="tiroir" hidden>'
    +   '<div class="tete"><h2>Sommaire de la visite</h2>'
    +     '<button class="fermerTiroir" type="button" aria-label="Fermer le sommaire"><img src="site-images/pastilles/croix.png" alt=""></button></div>'
    +   '<button class="debut" type="button"><img src="site-images/pastilles/lecture.png" alt=""><span>Depuis le début</span><small>la visite entière</small></button>'
    +   '<div class="liste"></div>'
    + '</div>';
  document.body.appendChild(sommaire);
  const styleSommaire = document.createElement('style');
  styleSommaire.textContent = `
    #vSommaire{ position:fixed; inset:0; z-index:205; background:#050505; overflow:hidden; }
    #vSommaire[hidden]{ display:none !important; }
    #vSommaire .fond{ position:absolute; inset:0; width:100%; height:100%; object-fit:contain; object-position:center; display:none; }
    @media (orientation:portrait){ #vSommaire .fond.portrait{ display:block; } }
    @media (orientation:landscape){ #vSommaire .fond.paysage{ display:block; } }
    /* LA REGLE : une bande dure, pleine largeur, trait d'or, en bas.
       20 h 15 — « le truc jaune immense, je n'aime pas du tout ; j'aurais prefere
       en or aussi. » Deux boutons sobres, cercles d'or sur le noir, et le mot
       « Sommaire » en or, a la police du site. */
    #vSommaire .bande{ position:absolute; left:0; right:0; bottom:0; display:flex; align-items:center; justify-content:space-between; gap:12px;
      padding:9px 14px calc(env(safe-area-inset-bottom) + 9px); background:rgba(8,7,6,.97);
      border-top:1px solid rgba(212,175,55,.85); box-shadow:0 -1px 0 rgba(212,175,55,.25), 0 -12px 34px rgba(0,0,0,.6); }
    #vSommaire .bande button{ display:flex; align-items:center; gap:12px; border:0; background:none; padding:0;
      color:var(--or2, #f1d27a); font-family:var(--disp, serif); font-size:1.15rem; letter-spacing:.03em; -webkit-tap-highlight-color:transparent; }
    #vSommaire .bande button .x{ width:44px; height:44px; border-radius:50%; display:grid; place-items:center;
      border:1px solid rgba(212,175,55,.6); background:rgba(212,175,55,.08); font-size:20px; line-height:1;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.08); }
    #vSommaire .bande button:active .x{ background:rgba(212,175,55,.25); }
    #vSommaire .bande .fermer .mot{ display:none; }
    #vSommaire .bande .menu{ flex-direction:row-reverse; }
    /* le petit bouton d'or « Sommaire » pendant une visite partie du sommaire */
    /* 20 h 30 — « il faut qu'il reste allume, il s'eteint avec les ombres » : il
       etait au meme niveau que le voile sombre de la visite. Au-dessus, toujours. */
    #vRetourSommaire{ position:fixed; right:12px; bottom:calc(env(safe-area-inset-bottom) + 104px); z-index:199; opacity:1 !important;
      display:flex; align-items:center; gap:8px; padding:8px 12px 8px 10px; border-radius:999px;
      border:1px solid rgba(212,175,55,.6); background:rgba(8,7,6,.92); color:var(--or2, #f1d27a);
      font-family:var(--disp, serif); font-size:.95rem; letter-spacing:.03em; box-shadow:0 8px 24px rgba(0,0,0,.6);
      -webkit-tap-highlight-color:transparent; }
    #vRetourSommaire[hidden]{ display:none !important; }
    #vRetourSommaire .tr{ display:grid; gap:3px; } #vRetourSommaire .tr i{ display:block; width:14px; height:1.5px; background:var(--or2, #f1d27a); }
    @media (orientation:landscape){ #vRetourSommaire{ bottom:calc(env(safe-area-inset-bottom) + 12px); } }
    /* 20 h — Mickael : « le tableau n'est pas beau, il ne prend pas tout l'ecran,
       il y a une place incroyable sous l'appareil photo. Fais-moi des pastilles en
       or, du vrai or. Regarde comment c'est fait sur le menu du site. » Le tiroir
       prend tout l'ecran, appareil photo compris ; les rangs sont ceux du menu du
       site (police d'affiche, fils d'or), les numeros sont les pastilles d'or. */
    #vSommaire .tiroir{ position:absolute; inset:0; display:grid; grid-template-rows:auto auto 1fr; gap:0;
      padding:calc(env(safe-area-inset-top) + 10px) calc(env(safe-area-inset-right) + 16px) calc(env(safe-area-inset-bottom) + 12px) calc(env(safe-area-inset-left) + 16px);
      background:rgba(5,5,5,.94); backdrop-filter:blur(30px); -webkit-backdrop-filter:blur(30px);
      color:#f2ead6; transform:translateY(100%); transition:transform .5s cubic-bezier(.2,.8,.2,1); }
    #vSommaire .tiroir.la{ transform:none; }
    #vSommaire .tiroir[hidden]{ display:grid !important; visibility:hidden; }
    #vSommaire .tiroir .tete{ display:flex; align-items:center; justify-content:space-between; gap:12px;
      padding:6px 0 12px; border-bottom:1px solid rgba(212,175,55,.35); }
    #vSommaire .tiroir h2{ margin:0; color:var(--or2, #f1d27a); font-family:var(--disp, serif); font-weight:400;
      font-size:clamp(1.5rem, 5.5vw, 2.2rem); letter-spacing:.04em; }
    #vSommaire .fermerTiroir{ width:52px; height:52px; padding:0; border:0; background:none; -webkit-tap-highlight-color:transparent; }
    #vSommaire .fermerTiroir img{ width:100%; height:100%; display:block; filter:drop-shadow(0 4px 10px rgba(0,0,0,.6)); }
    #vSommaire .debut{ display:flex; align-items:center; gap:14px; padding:14px 0; border:0; border-bottom:1px solid rgba(212,175,55,.35);
      background:none; color:var(--or2, #f1d27a); text-align:left; -webkit-tap-highlight-color:transparent; }
    #vSommaire .debut img{ width:56px; height:56px; flex:none; filter:drop-shadow(0 4px 10px rgba(0,0,0,.6)); }
    #vSommaire .debut span{ font-family:var(--disp, serif); font-size:clamp(1.35rem, 4.6vw, 1.9rem); }
    #vSommaire .debut small{ margin-left:auto; font-size:.72rem; letter-spacing:.18em; text-transform:uppercase; color:var(--gris, #a89f8c); }
    #vSommaire .liste{ overflow:auto; -webkit-overflow-scrolling:touch; overscroll-behavior:contain; display:block; }
    #vSommaire .liste button{ display:flex; align-items:center; gap:14px; width:100%; text-align:left;
      padding:10px 0; border:0; border-bottom:1px solid rgba(212,175,55,.18); background:none; color:#ece4d0;
      font-family:var(--disp, serif); font-size:clamp(1.2rem, 4.2vw, 1.7rem); -webkit-tap-highlight-color:transparent; }
    #vSommaire .liste button:active{ color:var(--or2, #f1d27a); }
    #vSommaire .liste button img{ width:46px; height:46px; flex:none; filter:drop-shadow(0 3px 8px rgba(0,0,0,.6)); }
    #vSommaire .liste button:last-child{ border-bottom:0; }
    @media (orientation:landscape){
      #vSommaire .tiroir{ grid-template-columns:minmax(220px, 34%) 1fr; grid-template-rows:auto 1fr; column-gap:24px;
        grid-template-areas:"tete tete" "debut liste"; }
      #vSommaire .tiroir .tete{ grid-area:tete; } #vSommaire .debut{ grid-area:debut; align-self:start; border-bottom:0; }
      #vSommaire .liste{ grid-area:liste; }
      #vSommaire .liste button img{ width:40px; height:40px; } #vSommaire .liste button{ padding:7px 0; }
    }`;
  document.head.appendChild(styleSommaire);
  {
    const tiroir = sommaire.querySelector('.tiroir');
    const liste = sommaire.querySelector('.liste');
    const ouvrirTiroir = () => { tiroir.hidden = false; requestAnimationFrame(() => tiroir.classList.add('la')); };
    const fermerTiroir = () => { tiroir.classList.remove('la'); apres(() => { tiroir.hidden = true; }, 460); };
    const fermerTout = () => { tiroir.classList.remove('la'); tiroir.hidden = true; sommaire.hidden = true; };
    ARRETS.forEach((a, k) => {
      if (!a.nom) return;
      const b = document.createElement('button'); b.type = 'button';
      b.innerHTML = '<img alt="" src="site-images/pastilles/' + (k + 1) + '.png"><span></span>';
      b.querySelector('span').textContent = a.nom;
      b.addEventListener('click', () => { fermerTout(); depuisSommaire = true; retourSommaire.hidden = false; window.__visite.allerA(k); });
      liste.appendChild(b);
    });
    sommaire.querySelector('.bande .menu').addEventListener('click', ouvrirTiroir);
    sommaire.querySelector('.fermerTiroir').addEventListener('click', fermerTiroir);
    sommaire.querySelector('.bande .fermer').addEventListener('click', fermerTout);
    sommaire.querySelector('.debut').addEventListener('click', () => {
      fermerTout(); depuisSommaire = true; retourSommaire.hidden = false; departA = 0; verrouillerPortrait(); montrerLeBonjour(lancer);
    });
  }
  /* le petit bouton d'or « Sommaire », en bas a droite, pendant une visite partie du sommaire */
  const retourSommaire = document.createElement('button');
  retourSommaire.id = 'vRetourSommaire'; retourSommaire.className = 'visiteGarde'; retourSommaire.type = 'button'; retourSommaire.hidden = true;
  retourSommaire.innerHTML = '<span class="tr"><i></i><i></i><i></i></span><span>Sommaire</span>';
  document.body.appendChild(retourSommaire);
  retourSommaire.addEventListener('click', () => { finir(false); });

  window.revoirLaVisite = () => {
    /* 19 h 50 — Mickael : « pourquoi je tombe tout de suite sur le guide ? »
       Revoir effacait le drapeau « deja vue » : a l'ouverture suivante,
       l'accueil croyait au premier jour. Revoir ne touche plus au drapeau ;
       il le pose meme, et oublie toute reprise en cours. */
    try { localStorage.setItem(CLE_VUE, '1'); localStorage.removeItem(CLE_OU); } catch(e){}
    /* on coupe net ce qui tournait peut-etre encore avant de reproposer */
    fil++; arrete = false;
    try { son.pause(); son.onended = son.onerror = null; } catch(e){}
    document.body.classList.remove('enVisite');
    eteindreLaLumiere();
    /* ⚠️ 12 septembre, 16 h 35 — Mickael : « quand on revoit la visite guidee,
       je devrais voir ma photo tout de suite, et je ne la vois pas. » La carte
       « on y va ? » demarrait a l'arret 1 sans le visage. Il a deja choisi
       « Revoir » dans le menu : pas de deuxieme question, le visage, puis la
       visite, exactement comme au premier jour. */
    /* 19 h 40 — depuis le menu : la page Visite guidee, plein ecran, photo entiere */
    document.body.classList.remove('menu');
    libererOrientation();
    sommaire.hidden = false;
  };
})();
