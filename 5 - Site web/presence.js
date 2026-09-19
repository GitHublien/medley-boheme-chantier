/* ═══════════════════════════════════════════════════════════════════
   LA PRÉSENCE

   Elle vient en fond, au hasard, et jamais deux fois pareil.

   ★ LE PRINCIPE, ET POURQUOI IL A CHANGÉ

   Avant, je rapetissais la vidéo et je la déplaçais. Résultat : on
   voyait ses bords, un rectangle net posé sur le noir — « un écran
   dans l'écran ». Raté.

   Maintenant la vidéo remplit TOUJOURS tout l'écran, sans exception.
   On la ZOOME (jamais moins que 1), puis on la DÉPLACE — et le
   déplacement est calculé pour qu'elle déborde toujours de l'écran
   des quatre côtés. Le visage va à gauche, à droite, en haut, mais
   on ne voit jamais un bord.

   ⚠️ Ce qu'il ne faut PAS faire : décaler le cadrage avec
   object-position. Le visage est au centre de ces vidéos (entre
   33 % et 84 %) : un cadrage à 10 % ne montre que du noir.

   ★ LE DÉTOURAGE — pourquoi il n'y a pas besoin d'écran vert

   Le fond des vidéos est déjà noir. Et « mix-blend-mode: screen »
   fait exactement le travail d'un fond vert : il ADDITIONNE l'image
   au fond. Or additionner du noir (zéro) ne change rien. Le noir
   devient donc parfaitement invisible, et il ne reste que le visage.

   Le seul défaut, c'était la compression : elle laissait du gris
   (jusqu'à 14 sur 255) là où il aurait fallu du zéro, et ce gris
   dessinait le rectangle. Tous les fragments ont donc été refaits
   avec leurs noirs écrasés à zéro absolu. Plus de rectangle, et
   aucun masque n'est nécessaire.

   Enfin, un léger flou la met DERRIÈRE : le texte de l’atelier reste
   net devant, et on peut lire.

   INSTALLATION — une ligne à la fin de la page :
       <script src="presence.js"></script>

   RÉGLAGES — à poser AVANT cette ligne :
       <script>window.PRESENCE = { force: 0.30 };</script>
   ═══════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

const R = Object.assign({
  dossier   : 'media/presence/',

  /* les fragments où l'on voit un visage entier, cadrable partout */
  fragments : ['reseau-1','reseau-2','paupieres','eclats-1',
               'regard-1','regard-2','profil','veille-2','souffle',
               'cadre','tete','eveil','regard','cote','veille','fin','respire'],

  /* ceux-là sont des gros plans : ils prennent TOUJOURS tout l'écran,
     jamais recadrés, sinon on coupe les yeux et ça ne veut plus rien dire */
  gros      : ['yeux-1','yeux-2'],
  chanceGros: 0.18,          // un peu moins d'une venue sur cinq

  force     : 0.62,          // à quel point on la voit, d'habitude
  franche   : 0.95,          // quand elle ose
  chance    : 0.35,

  delaiMin  : 3.5,
  delaiMax  : 9.0,
  resteMin  : 5.0,
  resteMax  : 10.0,
  premiere  : 3.0,

  fondu     : 2.8,
  fonduBref : 1.2,

  flou      : 2.0,           // le flou qui la met derrière le texte
  flouGros  : 1.5,           // les gros plans restent plus nets
  zoomMin   : 1.25,          // JAMAIS en dessous de 1 : sinon on voit les bords
  zoomMax   : 1.95,          // et on zoome, sinon le visage est perdu dans le cadre

  zIndex    : 0
}, window.PRESENCE || {});

/* ─── SUR PORTABLE : SEULEMENT QUAND ON NE JOUE PAS ─────────────
   La règle du 22/08/2026 : pendant la lecture, JAMAIS. En pause ou
   sur une page d'attente, elle peut venir — mais presque
   transparente. C'est la page qui l'allume et l'éteint en suivant
   Play et Pause. */
const SUR_MOBILE =
  matchMedia('(max-width: 820px), (pointer: coarse) and (max-width: 1100px)').matches;
const SANS_PRESENCE = false;
if (SUR_MOBILE){
  R.force   = Math.min(R.force,   0.13);
  R.franche = Math.min(R.franche, 0.20);
  R.delaiMin = Math.max(R.delaiMin, 8);
  R.flou = Math.max(R.flou || 0, 4);
}
/* Un écran de téléphone est étroit et haut. Une vidéo large
   « recadrée pour remplir » s'y retrouve zoomée à l'extrême : le
   visage devient énorme, on n'en voit qu'un morceau, et il cache le
   texte au lieu de l'accompagner. Sur téléphone on montre donc
   l'image ENTIÈRE, réduite : on voit enfin un visage, et il ne
   mange rien. (Le fond noir de la vidéo disparaît de lui-même :
   elle est posée en mode « écran ».) */
let REDUCTION = 0.5, CENTRE = false;   /* CENTRE : l'apparition demandée par la visite, au milieu de l'écran, sans décalage */   /* la réduction sur téléphone (la visite peut la relever le temps d'une apparition) */

/* ─── LES PLACES ─────────────────────────────────────────────────
   Où l'on emmène le visage, en pour cent de l'écran. Le zoom est
   toujours calculé pour que l'image déborde malgré le déplacement :
   on ne verra jamais un bord. */
const PLACES = [
  { nom:'centre',        dx:  0, dy:  0 },
  { nom:'à gauche',      dx:-22, dy:  0 },
  { nom:'à droite',      dx: 22, dy:  0 },
  { nom:'gauche haut',   dx:-18, dy:-14 },
  { nom:'droite haut',   dx: 18, dy:-14 },
  { nom:'gauche bas',    dx:-18, dy: 12 },
  { nom:'droite bas',    dx: 18, dy: 12 },
  { nom:'loin à gauche', dx:-30, dy:  4 },
  { nom:'loin à droite', dx: 30, dy:  4 },
  { nom:'en haut',       dx:  0, dy:-18 },
  { nom:'en bas',        dx:  0, dy: 14 },
];

/* Les gros plans d'yeux, eux, n'ont pas de fond noir : c'est de la
   peau jusqu'aux bords. Il leur faut donc un masque, mais très
   large, qui n'efface que l'extrême bord. */
const MASQUE_GROS =
  'radial-gradient(ellipse 98% 98% at 50% 50%, #000 66%, rgba(0,0,0,.6) 86%, transparent 100%)';

function fabriquer(){
  const v = document.createElement('video');
  v.muted = true; v.playsInline = true; v.setAttribute('playsinline','');
  v.preload = 'none'; v.loop = true;
  Object.assign(v.style, {
    position:'fixed', left:'0', top:'0',
    width:'100%', height:'100%',
    objectFit: SUR_MOBILE ? 'contain' : 'cover',
    opacity:'0', pointerEvents:'none',
    zIndex:String(R.zIndex), mixBlendMode:'screen',
    willChange:'opacity', transformOrigin:'50% 45%',
    transition:'opacity ' + R.fondu + 's ease'
  });
  document.body.appendChild(v);
  return v;
}
const lecteurs = [fabriquer(), fabriquer()];
let courant = 0, dernierFrag = -1, dernierePlace = -1, minuteur = null, arrete = false;

function tirer(n, dernier){
  if (n < 2) return 0;
  let i; do { i = Math.floor(Math.random()*n); } while (i === dernier);
  return i;
}
const entre = (a,b) => a + Math.random()*(b-a);

function programmer(){
  if (arrete) return;
  clearTimeout(minuteur);
  minuteur = setTimeout(venir, entre(R.delaiMin, R.delaiMax)*1000);
}

function venir(){
  if (arrete || document.hidden){ programmer(); return; }

  const grosPlan = R.gros.length > 0 && Math.random() < R.chanceGros;
  const franche  = Math.random() < R.chance;

  let nom, dx, dy, masque, zoom, flou;
  if (grosPlan){
    /* un gros plan d'yeux : plein écran, centré, jamais déplacé.
       Si on le décalait, on couperait un œil et ça ne voudrait
       plus rien dire. */
    nom = R.gros[Math.floor(Math.random()*R.gros.length)];
    dx = 0; dy = 0; masque = MASQUE_GROS; zoom = 1.06; flou = R.flouGros;
  } else {
    const iF = tirer(R.fragments.length, dernierFrag); dernierFrag = iF;
    const iP = tirer(PLACES.length, dernierePlace);    dernierePlace = iP;
    nom    = R.fragments[iF];
    masque = 'none';                  /* le noir suffit : rien à masquer */
    flou   = R.flou;

    /* LE CALCUL QUI ÉVITE LES BORDS
       Pour un zoom Z, le débordement disponible de chaque côté vaut
       (Z-1)/(2Z) de la largeur. On choisit donc le zoom EN FONCTION
       du déplacement voulu, jamais l'inverse. */
    const p = PLACES[iP];
    const besoin = Math.max(Math.abs(p.dx), Math.abs(p.dy)) / 100;
    const zoomMini = besoin > 0 ? 1/(1 - 2*besoin/0.9) : R.zoomMin;
    zoom = entre(Math.max(R.zoomMin, zoomMini), Math.max(R.zoomMax, zoomMini*1.25));
    dx = p.dx; dy = p.dy;
    if (CENTRE){ dx = 0; dy = 12; zoom = 1.6; }   /* la visite : plein centre, un peu plus bas que le texte du haut */
  }

  const v = lecteurs[courant];
  courant = 1 - courant;

  const miroir = (!grosPlan && Math.random() < 0.4) ? -1 : 1;
  v.style.transition = 'opacity ' + (franche ? R.fonduBref : R.fondu) + 's ease';
  v.style.objectPosition = '50% 42%';        /* le visage est là, on n'y touche pas */
  const z = SUR_MOBILE ? zoom * REDUCTION : zoom;
  v.style.transform = `scale(${z}) translate(${dx/z}%, ${dy/z}%) scaleX(${miroir})`;
  v.style.filter = `blur(${flou}px)`;
  v.style.webkitMaskImage = masque;
  v.style.maskImage = masque;
  v.style.webkitMaskSize = '100% 100%';
  v.style.maskSize = '100% 100%';

  v.src = R.dossier + nom + '.mp4';
  v.currentTime = 0;

  const p = v.play();
  if (!p || !p.then){ programmer(); return; }
  p.then(() => {
    v.style.opacity = String(franche ? R.franche : R.force);
    const reste = franche ? entre(R.resteMin, R.resteMax)*0.6
                          : entre(R.resteMin, R.resteMax);
    setTimeout(() => {
      const f = franche ? R.fonduBref*1.3 : R.fondu;
      v.style.transition = 'opacity ' + f + 's ease';
      v.style.opacity = '0';
      setTimeout(() => { try { v.pause(); v.removeAttribute('src'); v.load(); } catch(e){} },
                 f*1000 + 300);
      programmer();
    }, reste*1000);
  }).catch(programmer);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden){
    lecteurs.forEach(v => { v.style.opacity='0'; try{ v.pause(); }catch(e){} });
    clearTimeout(minuteur);
  } else programmer();
});

window.presence = {
  demarrer(){ if (SANS_PRESENCE) return; arrete = false; programmer(); },
  arreter(){ arrete = true; clearTimeout(minuteur);
             lecteurs.forEach(v => { v.style.opacity='0'; try{v.pause();}catch(e){} }); },
  maintenant(){ venir(); },
  /* 18/09 — pour la visite guidée : une apparition FRANCHE, nette, en grand,
     pendant `secondes`, quels que soient les réglages discrets du téléphone ;
     puis on rend les réglages habituels. */
  montrer(secondes){
    const garde = { force:R.force, franche:R.franche, chance:R.chance, flou:R.flou, flouGros:R.flouGros, resteMin:R.resteMin, resteMax:R.resteMax, chanceGros:R.chanceGros };
    const gardeRed = REDUCTION;
    Object.assign(R, { force:0.95, franche:0.95, chance:1, flou:0, flouGros:0, resteMin:secondes, resteMax:secondes, chanceGros:0 });
    REDUCTION = 0.85;
    clearTimeout(minuteur); arrete = false; CENTRE = true; venir(); CENTRE = false;
    setTimeout(() => { Object.assign(R, garde); REDUCTION = gardeRed; }, (secondes + 2) * 1000);
  },
  regler(o){ Object.assign(R, o); }
};

if (!SANS_PRESENCE) setTimeout(programmer, R.premiere*1000);
})();
