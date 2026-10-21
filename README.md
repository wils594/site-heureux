# Site vitrine Heureux Gagnant

Site statique (HTML, CSS, JavaScript) sans dépendance ni étape de compilation. Seules les polices Google (Playfair Display, Inter) sont chargées en ligne ; le site reste lisible sans elles.

## Structure

```
index.html            Page unique (toutes les sections)
config.js             Coordonnées et paramètres — le seul fichier à modifier
css/styles.css        Styles et animations
js/main.js            Menu, FAQ, validation, envoi, WhatsApp, appel
assets/svg/logo.svg   Logo
assets/images/hero-documents.svg   Visuel principal (voir ci-dessous)
```

## À configurer avant la mise en ligne (`config.js`)

| Champ | Effet quand renseigné |
|---|---|
| `whatsapp` | Affiche le bouton WhatsApp (message prérempli avec le service choisi) et permet l'envoi du formulaire par WhatsApp |
| `telephone` | Affiche le numéro et le bouton « Appeler » |
| `email` | Affiche l'adresse e-mail |
| `adresse`, `carteUrl` | Affiche l'adresse précise et un bouton « Voir sur la carte » |
| `reseaux` | Affiche uniquement les réseaux dont l'URL est renseignée |
| `formEndpoint` | Envoi réel du formulaire (ex. Formspree). Sans lui, aucun succès n'est affiché tant que rien n'a été transmis |

Tant qu'un champ est vide, l'élément correspondant n'apparaît pas : aucune coordonnée n'est inventée.

## Comportement du formulaire

- Avec `formEndpoint` : envoi réel ; la confirmation n'apparaît que si le service répond avec succès, sinon un message d'échec s'affiche.
- Sans `formEndpoint` mais avec `whatsapp` : ouvre WhatsApp avec le message prérempli (l'envoi se fait dans WhatsApp, le site ne le prétend pas envoyé).
- Sans aucun des deux : le site indique clairement que le message n'a pas été envoyé.

## Visuel principal

Le visuel du Hero est une **illustration réaliste rendue en SVG** : un passeport togolais (couverture verte, mention « République togolaise », selon la fiche du registre européen PRADO), un certificat fictif marqué « SPÉCIMEN » et un dossier. Ce n'est pas une photographie : aucun outil de génération d'images ni banque de photos autorisée n'était disponible. L'emblème est générique (étoile) et ne reproduit pas les armoiries officielles ; aucun document n'est utilisable et aucune donnée personnelle n'est lisible.
Pour utiliser une vraie photographie : placez-la dans `assets/images/` (ex. `hero-documents.jpg`, format ~4:4,4, documents anonymisés) et remplacez la valeur de `src` de l'image dans le Hero de `index.html`, ainsi que son texte `alt`.

## Couleurs

Charte inspirée du drapeau togolais : vert `#006A4A`, jaune `#FFCE00`, rouge `#D21034` (variables en tête de `css/styles.css`). Ces couleurs sont un choix graphique : le site ne présente pas Heureux Gagnant comme un organisme public (voir les mentions légales).

## Mentions légales

La fenêtre « Mentions légales » indique que le responsable de publication, l'immatriculation et l'hébergeur restent à compléter par l'entreprise (`index.html`, élément `#dlg-legal`). Ne pas mettre en ligne sans ces informations.

## Déploiement

Hébergez le dossier tel quel (Netlify, Vercel, GitHub Pages, hébergement mutualisé) : `index.html` est le point d'entrée.
