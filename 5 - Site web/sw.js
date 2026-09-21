/* ═══════════════════════════════════════════════════════════════════════════
   L'OUVRIER DE SERVICE (7 septembre 2026, refait)

   Sa première mission reste de rendre le site installable comme une application.
   La seconde, nouvelle, corrige un vrai bug : GitHub Pages demande aux navigateurs
   de garder les fichiers du site DIX MINUTES en cache (Cache-Control: max-age=600).
   Résultat : on appuyait sur « Mise à jour », le site voyait bien une version plus
   récente en ligne, il rechargeait… et le navigateur resservait l'ancien fichier.
   La nouvelle version n'arrivait jamais, et le message revenait en boucle.

   Ici, les pages, le style et les scripts sont TOUJOURS pris sur le réseau, jamais
   dans le cache. Les images, les sons et les vidéos, eux, gardent le cache normal :
   ils ne changent pas, et les recharger coûterait cher en données.
   ═══════════════════════════════════════════════════════════════════════════ */
self.addEventListener('install', e => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    try { for (const n of await caches.keys()) await caches.delete(n); } catch (err) {}
    await self.clients.claim();
  })());
});

const TOUJOURS_NEUF = /\.(?:html|js|css|json|txt)$/i;
/* ⚠️ 11 septembre 2026 — POURQUOI LES NOUVELLES PHOTOS N'ARRIVAIENT PAS.
   Mickaël : « je vois toujours les mêmes photos, pourtant j'ai fermé et
   rouvert. » Les images sont gardées en cache exprès : les recharger coûterait
   cher en données, et elles ne changent presque jamais. Mais quand elles
   changent VRAIMENT, elles restent bloquées derrière les anciennes.
   La règle retenue : on ne change jamais une image en place — on lui donne un
   nouveau nom (adrien-2.jpg). Un nom neuf n'a pas d'ancien en cache. */

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  let u;
  try { u = new URL(r.url); } catch (err) { return; }
  if (u.origin !== location.origin) return;
  /* la racine d'un dossier (…/elie/) est une page : elle aussi doit être fraîche */
  const estPage = TOUJOURS_NEUF.test(u.pathname) || u.pathname.endsWith('/');
  /* 21/09 — LES VOIX DE LA VISITE, GARDÉES ICI. Mickaël, en 5G : « des pauses terribles,
     dix secondes avant que le mec réponde ». Chaque réplique est un fichier, et le
     navigateur les redemandait au réseau toutes les dix minutes. Désormais : une voix
     (ou une vidéo) de la visite déjà entendue est rendue depuis ce cache, sans réseau ;
     et la visite les demande d'avance (voir précharger() dans visite-atelier.js). */
  if (/\/media\/visite-atelier\/[^?]+\.(?:mp3|mp4)$/i.test(u.pathname)){
    e.respondWith((async () => {
      const cache = await caches.open('va-media');
      const deja = await cache.match(r.url);
      if (deja) return deja;
      const rep = await fetch(r);
      if (rep && rep.ok && rep.status === 200) { try { await cache.put(r.url, rep.clone()); } catch (err) {} }
      return rep;
    })());
    return;
  }
  if (!estPage) return;
  e.respondWith((async () => {
    try {
      return await fetch(new Request(r.url, { cache: 'reload', credentials: 'same-origin' }));
    } catch (err) {
      /* pas de réseau : on rend ce qu'on peut plutôt qu'une page blanche */
      return fetch(r).catch(() => new Response('', { status: 504, statusText: 'hors ligne' }));
    }
  })());
});
