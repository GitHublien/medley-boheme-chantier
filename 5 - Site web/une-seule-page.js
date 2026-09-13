/* ═══════════════════════════════════════════════════════════════════════════
   UNE SEULE PAGE — pour que la musique ne s'arrête jamais (11 septembre 2026)

   Mickaël : « fais comme dans Reaper : en passant d'une page à l'autre, ça doit
   donner l'impression d'une seule et même musique, donc ça ne peut pas sauter.
   Et du coup ce sera peut-être même plus léger. »

   ★ LE PRINCIPE, ET POURQUOI ÇA MARCHE

   Jusqu'ici, toucher un lien tuait la page : le son mourait avec elle, et la
   page suivante devait tout reconstruire — le style, les images, le lecteur.
   D'où le saut, et d'où la lenteur.

   Maintenant, la page ne meurt plus. On va CHERCHER le contenu de la page
   demandée, et on remplace seulement ce qui change à l'intérieur. Le lecteur de
   musique, lui, n'est jamais touché : il continue de jouer, sans même savoir
   qu'on a changé de pièce. C'est exactement la méthode de Reaper — on ne
   recharge pas la table de mixage à chaque morceau.

   ★ CE QUI EST REMPLACÉ, ET CE QUI RESTE

   Remplacé : le contenu (tout ce qui suit la barre), le titre de l'onglet,
   l'adresse. Gardé : la barre du haut, la barre du bas, le menu, LE SON.

   ★ LES TROIS PRUDENCES

   1. Une page qui a ses propres scripts (l'atelier, le livre, le guide, la
      porte, le prénom) NE PASSE PAS par ici : on la charge normalement. Ces
      pages sont des mondes à part, et tenter de les coudre ici casserait tout.
   2. Le bouton « retour » du téléphone continue de marcher : chaque passage
      est inscrit dans l'historique.
   3. Si quoi que ce soit échoue — pas de réseau, page inattendue — on retombe
      sur le chargement normal. On ne reste jamais coincé.
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
  /* les pages qui gardent leur propre vie : on ne les coud pas */
  /* ⚠️ 11 septembre, 18 h 45 — Mickaël : « pourquoi les autres ne sont pas à la
     même enseigne ? » Réponse mesurée, page par page :

       Mon prénom ............   7 Ko ·  0 minuteur  → rejoint la famille
       Informations utiles ...  17 Ko ·  0 minuteur  → rejoint la famille
       Le guide .............. 125 Ko ·  8 minuteurs → reste à part
       Le livre .............. 128 Ko ·  8 minuteurs → reste à part
       La porte ..............  51 Ko · 14 minuteurs → reste à part
       L'atelier ............. 668 Ko · 54 minuteurs → reste à part

     Un « minuteur », c'est une horloge que la page lance et qui continue de
     battre. Dans une page qu'on recharge, elle meurt avec elle. Ici, la page ne
     meurt plus : ces horloges tourneraient donc POUR TOUJOURS, en plus de
     celles de la page suivante. L'atelier en a cinquante-quatre.

     Et surtout : ces quatre pages jouent toutes du son. La musique doit s'y
     arrêter de toute façon — les coudre ici n'apporterait donc RIEN à la
     musique, seulement du risque. Le garde-fou ci-dessous les rendra possibles
     le jour où l'on voudra y aller. */
  const APART = /KARAOKE|LIVRE|TUTORIEL|PORTE|index\.html|installer|diagnostic|fiche-technique/i;

  const estCousable = href => {
    try {
      const u = new URL(href, location.href);
      if (u.origin !== location.origin) return false;
      if (APART.test(decodeURIComponent(u.pathname))) return false;
      return /\.html$/i.test(u.pathname) || u.pathname.endsWith('/');
    } catch(e){ return false; }
  };
  /* on ne se coud que DEPUIS une page cousable : sinon on ne sait pas quoi remplacer */
  if (!estCousable(location.href)) return;

  const zone = () => document.querySelector('main') || document.body;

  /* un voile d'or très bref, le temps du remplacement : on voit qu'il se passe
     quelque chose, mais on n'attend jamais devant une page blanche */
  const style = document.createElement('style');
  style.textContent = `
    .enRoute{ position:fixed; left:0; right:0; top:0; height:2px; z-index:200;
      background:linear-gradient(90deg,#c9a13a,#f1d27a,#c9a13a);
      transform:scaleX(0); transform-origin:left; transition:transform .5s ease; }
    .enRoute.part{ transform:scaleX(.7); }
    .enRoute.fini{ transform:scaleX(1); opacity:0; transition:transform .2s, opacity .4s .2s; }
    .pageArrive{ animation:pageArrive .45s ease both; }
    @keyframes pageArrive{ from{ opacity:0; transform:translateY(10px) } to{ opacity:1; transform:none } }`;
  document.head.appendChild(style);
  const fil = document.createElement('div'); fil.className = 'enRoute';
  document.body.appendChild(fil);

  /* ═══ LE GARDE-FOU DES HORLOGES ═══════════════════════════════════════════
     Quand une page lance une horloge (setInterval) ou un rendez-vous
     (setTimeout), on note son numéro. En quittant la page, on les arrête tous.
     Sans cela, une page visitée laisserait ses horloges battre à jamais dans la
     page vivante — et au bout de dix pages, le téléphone ramerait sans qu'on
     comprenne pourquoi. */
  const horloges = new Set(), vraiInterval = window.setInterval, vraiTimeout = window.setTimeout;
  let onRegarde = false;
  /* ⚠️ 11 sept — LA VISITE GUIDEE A DROIT AUX VRAIES HORLOGES.
     Le balayage ci-dessus tue les minuteurs de la page qu'on quitte. C'est
     exactement ce qu'il faut... sauf pour la visite, qui traverse les pages :
     ses minuteurs a elle etaient fauches au premier changement de page, et
     elle restait figee sur le calendrier (vu en essai). On lui prete donc les
     horloges d'origine, celles que personne ne surveille. */
  window.__horlogeHorsSurveillance = { setTimeout: vraiTimeout, setInterval: vraiInterval };
  window.setInterval = function(){ const id = vraiInterval.apply(window, arguments); if (onRegarde) horloges.add(['i', id]); return id; };
  window.setTimeout  = function(){ const id = vraiTimeout.apply(window, arguments);  if (onRegarde) horloges.add(['t', id]); return id; };
  function arreterLesHorloges(){
    horloges.forEach(([quoi, id]) => { try { quoi === 'i' ? clearInterval(id) : clearTimeout(id); } catch(e){} });
    horloges.clear();
  }

  let enCours = null;
  /* le lecteur de musique demande : « est-ce que tu t'en occupes ? » Si oui, il
     ne descend pas le son : il n'y a pas de départ, donc rien à adoucir. */
  window.__pageUnique = href => estCousable(href);

  /* ⚠️ 13 septembre, 10 h 30 — Mickael : « quand on manipule beaucoup, le menu
     marche mais Atelier et Textes ne repondent plus, jusqu'a fermer l'appli. »
     Pendant un chargement, on ignore les autres clics (enCours). Si l'appli
     passe en arriere-plan au milieu (WhatsApp, un appel), le telephone gele le
     chargement, qui ne finit jamais : le verrou restait pose pour toujours.
     Deux garde-fous : le chargement a 8 s maximum (au-dela, on abandonne et le
     lien suivant passe par la voie classique), et un verrou de plus de 12 s
     est considere comme mort. */
  let depuis = 0;
  async function aller(href, viaHistorique){
    if (enCours && Date.now() - depuis < 12000) return;
    enCours = href; depuis = Date.now();
    fil.className = 'enRoute part';
    const ctrl = ('AbortController' in window) ? new AbortController() : null;
    const garde = ctrl ? setTimeout(() => ctrl.abort(), 8000) : null;
    try {
      const r = await fetch(href, { credentials:'same-origin', signal: ctrl ? ctrl.signal : undefined });
      if (garde) clearTimeout(garde);
      if (!r.ok) throw new Error('réponse ' + r.status);
      const texte = await r.text();
      const neuve = new DOMParser().parseFromString(texte, 'text/html');

      /* ce qu'on garde de la page d'arrivée : son contenu et son titre */
      const corpsNeuf = neuve.querySelector('main') || neuve.body;
      if (!corpsNeuf) throw new Error('page sans contenu');

      /* on retire ce que le script commun fabrique : il est déjà là, vivant */
      corpsNeuf.querySelectorAll('.nav, .voile, .bas, footer, .musique, .mot, .vScene').forEach(e => e.remove());

      /* les styles propres à la nouvelle page, qui n'existent pas encore ici */
      neuve.querySelectorAll('head style, head link[rel="stylesheet"]').forEach(e => {
        const clef = e.outerHTML.slice(0, 140);
        if (![...document.head.children].some(x => x.outerHTML.slice(0, 140) === clef))
          document.head.appendChild(e.cloneNode(true));
      });

      /* le remplacement lui-même */
      const ici = zone();
      /* ⚠️ CE QU'ON GARDE À TOUT PRIX. Oublier quelque chose ici, c'est le voir
         disparaître au premier changement de page — c'est arrivé au lecteur
         vidéo, dont la scène était effacée en silence. */
      const GARDES = ['nav','voile','bas','musique','enRoute','mot','vScene','vuePlein','visiteGarde'];
      const garde = [...ici.children].filter(e =>
        (e.classList && GARDES.some(c => e.classList.contains(c)))
          || e.tagName === 'FOOTER' || e.tagName === 'SCRIPT' || e.tagName === 'AUDIO');
      [...ici.children].forEach(e => { if (!garde.includes(e)) e.remove(); });
      /* ⚠️ 11 septembre, 18 h 30 — LES SCRIPTS DE LA PAGE DOIVENT REVIVRE.
         Mickaël : « voir le plan en grand ne marche pas, il ne se passe rien. »
         C'était juste : ce bouton est servi par un script écrit DANS la page des
         documents, et je ne rejouais pas les scripts. Le bouton arrivait donc
         sans personne pour l'écouter.

         On les rejoue maintenant — en les recopiant, car un script inséré tel
         quel ne s'exécute jamais. Ceux qui portent une adresse (src) sont
         ignorés : ils sont déjà chargés une fois pour toutes. */
      /* on arrête les horloges de la page qu'on quitte, avant toute chose */
      arreterLesHorloges();
      const scripts = [];
      /* ⚠️ 12 septembre, 18 h 15 — Mickael : « Boheme Productions est en haut,
         l'accueil est en bas. » Le contenu neuf etait ajoute A LA FIN du corps,
         donc APRES le pied de page qu'on garde. Il se glisse maintenant avant
         lui : nav, contenu, pied de page, comme sur une page fraiche. */
      const pied = [...ici.children].find(e => e.tagName === 'FOOTER') || null;
      [...corpsNeuf.children].forEach(e => {
        if (e.tagName === 'SCRIPT'){ scripts.push(e); return; }
        const clone = document.importNode(e, true);
        if (pied) ici.insertBefore(clone, pied); else ici.appendChild(clone);
        /* un script niché dans le contenu compte aussi */
        clone.querySelectorAll && clone.querySelectorAll('script').forEach(x => scripts.push(x));
      });
      onRegarde = true;                 /* tout ce que la page lance est noté */
      scripts.forEach(vieux => {
        if (vieux.src) return;                        /* déjà chargé, une fois pour toutes */
        const neuf = document.createElement('script');
        /* ⚠️ CHAQUE SCRIPT DANS SA BULLE. Sans cela, deux pages qui nomment la
           même chose — « q », « COUL » — se heurtent dès qu'on les rejoue dans
           la même page vivante, et la seconde refuse de démarrer. En les
           enfermant chacun dans sa parenthèse, leurs mots ne sortent plus. */
        neuf.textContent = '(function(){' + String.fromCharCode(10)
                         + vieux.textContent + String.fromCharCode(10) + '})();';
        neuf.dataset.deLaPage = '1';
        document.body.appendChild(neuf);
      });
      setTimeout(() => { onRegarde = false; }, 3000);   /* le temps qu'elle s'installe */
      /* on nettoie les scripts de la page précédente : ils ont fait leur office */
      document.querySelectorAll('script[data-de-la-page]').forEach((x, i, l) => {
        if (i < l.length - scripts.length) x.remove();
      });

      document.title = neuve.title || document.title;
      /* ⚠️ 11 sept — la visite guidee traverse les pages : sa marque doit
         survivre a la releve du corps, sinon elle s'eteint au premier
         changement de page (vu en essai). On la remet aussitot. */
      const enVisite = document.body.classList.contains('enVisite');
      document.body.className = neuve.body.className || '';
      if (enVisite) document.body.classList.add('enVisite');
      if (!viaHistorique) history.pushState({ cousu:1 }, '', href);

      /* la page d'arrivée doit revivre : images, apparitions, boutons */
      window.scrollTo(0, 0);
      ici.classList.add('pageArrive');
      setTimeout(() => ici.classList.remove('pageArrive'), 500);
      if (typeof window.reveillerLaPage === 'function') window.reveillerLaPage();
      document.dispatchEvent(new CustomEvent('boheme-page-changee'));

      fil.className = 'enRoute fini';
      setTimeout(() => { fil.className = 'enRoute'; }, 700);
    } catch(e){
      if (garde) clearTimeout(garde);
      /* on ne reste jamais coincé : au moindre doute, la vieille méthode.
         (Si l'appli est en arriere-plan, on attend qu'elle revienne : un
         changement de page invisible est perdu.) */
      if (document.visibilityState === 'visible') location.href = href;
    } finally { enCours = null; fil.className = 'enRoute'; }
  }

  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a || a.target || a.hasAttribute('download')) return;
    const h = a.getAttribute('href') || '';
    if (/^(#|javascript:|mailto:|tel:)/.test(h)) return;
    if (!estCousable(a.href)) return;
    e.preventDefault(); e.stopPropagation();
    aller(a.href, false);
  }, true);

  addEventListener('popstate', () => {
    if (estCousable(location.href)) aller(location.href, true);
  });
})();
