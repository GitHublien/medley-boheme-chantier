# LES IMAGES DU SITE BOHÈME — prompts NanoBanana

*7 septembre 2026. Version corrigée : le logo est passé en RÉFÉRENCE, comme tu me l'as dit.*

---

## TU AVAIS RAISON, ET JE ME SUIS TROMPÉ

J'ai écrit qu'une machine ne pouvait pas replacer ton logo. C'est faux, et ma propre base de
connaissances le disait déjà : NanoBanana accepte **jusqu'à quatorze images de référence en
même temps**, sait replacer un objet à l'identique quand on le lui demande explicitement, et
sait écrire du français avec les accents. Il y a même une entrée « ajouter un élément à un
endroit précis, logo, bannière » et une autre « blending de logos avec textures ».

**Donc on fait comme tu le veux : le logo est dans l'image, pas posé par-dessus.**

Ton fichier `logo.png` est en transparence, en 1563 pixels de côté, il est parfait pour ça.

---

## LES DEUX RÈGLES QUI CHANGENT TOUT

**1. Toujours déposer le logo en première référence.**

```
D:\De nombreux projets dossier important pour IA\medley-boheme\5 - Site web\logo.png
```

**2. Générer l'affiche 01 en premier, puis s'en servir comme référence de style.**
C'est ce qui rendra les cinq affiches sœurs. Pour les affiches 02 à 05, tu déposes deux
références : `logo.png` **et** ton `01-scene.png` déjà validé. Le prompt le dit.

*(Les prompts sont en anglais : le modèle est entraîné en anglais, ça change tout. Le texte à
écrire dans l'image, lui, est en français entre guillemets, c'est la règle.)*

---

## OÙ DÉPOSER LE RÉSULTAT

```
D:\De nombreux projets dossier important pour IA\medley-boheme\5 - Site web\site-images\
```

Garde exactement les noms indiqués : c'est comme ça que le site les trouve tout seul.

---

# A · LES CINQ AFFICHES

## 01 — L'affiche du spectacle → `01-scene.png`

**Références à déposer : `logo.png`**
**Format : 16:9.** Fais aussi une version 9:16 nommée `01-scene-portrait.png` si tu peux.

> Use the attached reference image: it is the official "Bohème Production" logo, a golden calligraphic letter B inside a golden circle. **Reproduce this logo exactly as it is, identical, unchanged, same shape, same lettering, same golden gradient. Do not redraw it, do not stylise it, do not alter a single letter.**
> 
> Scene: an empty grand theatre stage seen from the audience, deep black background, six narrow golden spotlights falling on the bare black floor in a gentle line, thin theatrical haze drifting through the beams, fine film grain.
> Place the reference logo centred in the upper third of the image, floating above the stage, at about 20% of the image width, glowing softly as if lit by the stage lights, its transparent background blending into the darkness.
> Below the logo, engraved in elegant thin golden serif capitals, perfectly spelled in French: "MEDLEY BOHÈME".
> Under that, much smaller, in thin letter-spaced golden capitals: "CANNES · 4 OCTOBRE 2026".
> Cinematic still, high-end editorial photography, warm gold on deep black, vast empty space around the text, no people, no faces, no other text than specified.

---

## 02 — Monopolis, 1978 → `02-monopolis.png`

**Références : `logo.png` + `01-scene.png`**
**Format : 3:4** (affiche portrait).

> Two reference images are attached. The first is the official "Bohème Production" logo: **reproduce it exactly, identical, unchanged.** The second is a poster whose visual style must be matched exactly: same deep black, same warm gold, same haze, same film grain, same typography.
> 
> Scene: a rain-wet city street at night in 1978, seen from above, neon reflections in gold and cold blue on the wet asphalt, tall towers vanishing into fog, a lone radio tower with a blinking red light.
> Engraved across the sky in large elegant golden serif numerals, perfectly spelled: "1978".
> Below it, smaller, in thin letter-spaced golden capitals, perfectly spelled in French: "MONOPOLIS".
> Place the reference logo small, discreet, in the bottom right corner, at about 10% of the image width.
> Cinematic still, no people, no faces, no other text than specified.

---

## 03 — Notre-Dame, 1482 → `03-notredame.png`

**Références : `logo.png` + `01-scene.png` · Format : 3:4**

> Two reference images are attached. The first is the official "Bohème Production" logo: **reproduce it exactly, identical, unchanged.** The second is a poster whose visual style must be matched exactly.
> 
> Scene: the silhouette of a gothic cathedral under construction at dawn, wooden scaffolding against the stone, dust floating in the golden first light, a great rose window catching the sun.
> Engraved in the sky in large elegant golden serif numerals, perfectly spelled: "1482".
> Below it, smaller, in thin letter-spaced golden capitals, perfectly spelled in French: "NOTRE-DAME DE PARIS".
> Place the reference logo small and discreet in the bottom right corner, at about 10% of the image width.
> Cinematic still, no people, no faces, no other text than specified.

---

## 04 — L'Égypte → `04-egypte.png`

**Références : `logo.png` + `01-scene.png` · Format : 3:4**

> Two reference images are attached. The first is the official "Bohème Production" logo: **reproduce it exactly, identical, unchanged.** The second is a poster whose visual style must be matched exactly.
> 
> Scene: the Sinai desert at dusk, a lone mountain against a gold-to-indigo sky, two paths of footprints diverging in the sand, wind lifting a thin veil of dust.
> Engraved in the sky in elegant golden serif capitals, perfectly spelled in French: "ÉGYPTE".
> Below it, smaller, in thin letter-spaced golden capitals, perfectly spelled in French: "LES DIX COMMANDEMENTS".
> Place the reference logo small and discreet in the bottom right corner, at about 10% of the image width.
> Cinematic still, no people, no faces, no other text than specified.

---

## 05 — La fin → `05-fin.png`

**Références : `logo.png` + `01-scene.png` · Format : 16:9**

> Two reference images are attached. The first is the official "Bohème Production" logo: **reproduce it exactly, identical, unchanged.** The second is a poster whose visual style must be matched exactly.
> 
> Scene: a black stage after the last note. Six golden spotlights slowly fading to embers on the bare floor, haze settling, one spotlight still bright at the centre.
> Engraved low in the image, small, in thin letter-spaced golden capitals, perfectly spelled in French: "AIMER, C'EST CE QU'IL Y A D'PLUS BEAU".
> Place the reference logo centred above that line, at about 12% of the image width, glowing faintly.
> Cinematic still, no people, no faces, no other text than specified.

---

# B · LES HUIT FONDS (sans texte, sans logo)

*Le titre de chaque porte s'écrit par-dessus, dans le site, en vrai texte : il reste lisible sur
un téléphone, ce qu'un texte gravé ne ferait pas à cette taille. Pour ces huit-là, une seule
référence : `01-scene.png`, pour garder le même grain et la même lumière.*

**Référence pour les huit : `01-scene.png`. Format : 4:3.**
En tête de chacun :

> The attached reference image sets the visual style: match it exactly, same deep black, same warm gold light, same haze, same film grain. No text, no logo, no people, no faces.

**06 — Le karaoké** → `06-karaoke.png`

> A single handheld wireless microphone lying on a black stage floor, caught in one golden beam, tiny gold dust particles floating in the light, extreme shallow depth of field.

**07 — Les textes** → `07-textes.png`

> An old opera libretto open on a black lacquered table, pages softly lit in gold, the printed lines blurred and unreadable, a fountain pen resting across the page.

**08 — La mise en scène** → `08-mise-en-scene.png`

> A theatre stage seen from directly above like a plan, black floor, six small glowing gold marks placed in a line, thin golden guide lines drawn in light on the floor, haze.

**09 — Les documents** → `09-documents.png`

> A stack of thick cream paper documents tied with a thin gold ribbon on a black surface, a plain red wax seal, dramatic side light, no readable writing.

**10 — Les vidéos** → `10-videos.png`

> A vintage film projector beam cutting through haze toward the viewer, gold dust floating in the beam, the projector half hidden in shadow.

**11 — Le rendez-vous** → `11-calendrier.png`

> The façade of the Palais des Festivals in Cannes at night, the red-carpet stairs empty and glowing gold under the lights, dark blue sea behind, no people.

**12 — Les nouveautés** → `12-nouveautes.png`

> A small brass theatre bell hanging on a dark velvet curtain, one gold highlight on its rim, everything else in shadow.

**13 — Installer l'application** → `13-installer.png`

> A smartphone lying flat on black velvet, its screen showing only a soft golden glow, no interface, no icons, warm reflections on the velvet.

---

# C · LES DEUX TEXTURES (carré, sans texte)

**14 — Poussière d'or** → `14-poussiere.png`

> Pure black background, thousands of tiny gold dust particles floating at different depths, some sharp some blurred, seamless texture, no text.

**15 — Velours noir** → `15-velours.png`

> Close-up texture of black theatre velvet with a faint gold sheen along the folds, soft studio light, seamless texture, no text.

---

# D · LES TROIS VIDÉOS (8 à 10 s, en boucle, sans son, 16:9, MP4)

**V1 — La brume** → `V1-brume.mp4` (fond de l'accueil)

> Slow cinematic loop, 10 seconds: on a black stage, thin theatrical haze drifts slowly from left to right through six golden spotlights, gold dust rises gently, camera perfectly still, no cuts, no people, no text.

**V2 — Le velours** → `V2-velours.mp4` (fond des pages intérieures)

> Slow cinematic loop, 8 seconds: black theatre velvet curtain moving almost imperceptibly, a slow warm golden light sweeping across the folds, camera still, no cuts, no text.

**V3 — Le passage** → `V3-passage.mp4` (pour la nouvelle porte, plus tard)

> Cinematic, 8 seconds: the camera glides forward through a dark tunnel of golden light rings passing faster and faster, ending on pure black, no people, no text.

*Si Flow bloque, ne t'entête pas : AIVID avec Seedance, ou Kling, feront ces plans fixes très
lents aussi bien. Et j'ai une clé OpenRouter qui me permet de générer moi-même en Nano Banana
Pro quand l'interface refuse : dis-le-moi si tu veux que je m'en serve.*

---

# L'ORDRE, ET CE QUI COMPTE

1. **L'affiche 01 d'abord.** Regarde le logo de près : s'il est déformé ou si une lettre a
   bougé, relance. C'est elle qui sert de modèle à tout le reste.
2. **Les affiches 02 à 05**, avec 01 en seconde référence.
3. Les huit fonds, puis les textures et les vidéos, facultatives.

**Vérifie l'orthographe à chaque fois.** Les accents français sont bien gérés par NanoBanana 2,
mais une faute dans une image ne se rattrape pas après coup.

**Rien ne bloque en attendant :** le site tourne déjà avec des fonds dessinés. Chaque image
apparaît d'elle-même dès que tu la déposes, une par une si tu veux.

---

# C · LES TROIS À REFAIRE (12 septembre, 19 h) — logo vrai, petit, en bas à droite

*Mickaël : « Le medley des légendes n'est pas bon, la mise en scène a le logo trop gros,
qui chante quoi n'a pas le vrai logo. » Les trois reprennent le gabarit de l'atelier :
titre en bas à gauche, logo petit en bas à droite, une douche d'or, la brume, le noir.*

**Références, dans cet ordre : `logo.png`, puis `site-images/06-karaoke.jpg`. Format 16:9.**
En tête de chacun :

> Use the two attached reference images. The first one is the official "Bohème Production" logo, a golden calligraphic letter B inside a golden circle. **Reproduce this logo exactly as it is, identical, unchanged, same shape, same lettering, same golden gradient. Do not redraw it, do not stylise it, do not alter a single letter.** The second one is a poster from the same series: **match its look exactly, same deep black stage, same single warm golden spotlight, same thin theatrical haze, same fine film grain, same placement of the title bottom-left and the small logo bottom-right.**
> Place the reference logo small in the bottom-right corner, at about 9% of the image width, glowing softly, its transparent background blending into the black. No other text than specified, no watermark, no people, no faces.

**01 — Le medley des légendes** → `01-scene.jpg`

> Subject: an empty grand theatre stage seen from the audience, deep black, six narrow golden spotlights falling on the bare black floor in a gentle line, thin theatrical haze drifting through the beams, tiny gold dust in the light, vast empty darkness above.
> Style: cinematic still, high-end editorial photography, deep black and warm gold only. Light: the six beams only, soft, no harsh highlights. Lens: 35mm at f/4, sharp, fine film grain.
> Bottom-left, engraved in elegant thin golden serif capitals, large, perfectly spelled in French: "LE MEDLEY DES LÉGENDES". Just below it, much smaller, in thin letter-spaced golden capitals: "CANNES · 4 OCTOBRE 2026".

**08 — La mise en scène** → `08-mise-en-scene.jpg`

> Subject: a theatre stage seen from directly above like a floor plan, black floor, six small glowing gold marks placed in a gentle line, thin golden guide lines drawn in light across the floor, haze catching a single spotlight from above.
> Style: cinematic still, high-end editorial photography, deep black and warm gold only. Light: one soft golden spotlight from above, the gold marks glowing. Lens: 50mm at f/4, sharp, fine film grain.
> Bottom-left, engraved in elegant thin golden serif capitals, large, perfectly spelled in French: "LA MISE EN SCÈNE". Just below it, much smaller, in thin letter-spaced golden capitals, perfectly spelled in French: "qui est où, et quand".

**16 — Qui chante quoi** → `16-qui-chante.jpg`

> Subject: six different empty theatre chairs in a row on a black stage, each one under its own narrow golden spotlight, thin haze, the chairs slightly different from one another, warm wood and worn velvet, deep darkness around.
> Style: cinematic still, high-end editorial photography, deep black and warm gold only. Light: six narrow golden beams from above, soft, no harsh highlights. Lens: 35mm at f/4, sharp, fine film grain.
> Bottom-left, engraved in elegant thin golden serif capitals, large, perfectly spelled in French: "QUI CHANTE QUOI". Just below it, much smaller, in thin letter-spaced golden capitals, perfectly spelled in French: "le parcours de chacun".
