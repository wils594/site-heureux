/*
 * CONFIGURATION DE HEUREUX GAGNANT
 * Modifiez uniquement ce fichier pour renseigner les coordonnées réelles.
 * Tant qu'un champ est vide (""), la fonctionnalité correspondante reste
 * désactivée proprement : aucune coordonnée n'est inventée.
 */
window.HG_CONFIG = {
  entreprise: "Heureux Gagnant",
  ville: "Lomé, Togo",

  // Numéro WhatsApp au format international, chiffres uniquement (sans + ni espaces).
  whatsapp: "22890512878",

  // Numéro d'appel au format international avec +. Ce texte s'affiche tel quel sur le site.
  telephone: "+228 90 51 28 78",

  // Adresse e-mail de réception des demandes.
  email: "julienanago702@gmail.com",

  // Adresse postale affichée (optionnelle). Exemple : "Quartier ..., Lomé".
  adresse: "agoelegbassito",

  // URL de la carte (lien Google Maps / OpenStreetMap vers votre local). Optionnel.
  carteUrl: "https://goo.gl/maps/MAmobJMiTym6w11d9?g_st=aw",

  // Réseaux sociaux : renseignez une URL complète pour afficher le lien, sinon laissez "".
  reseaux: {
    facebook: "",
    instagram: "",
    linkedin: ""
  },

  /*
   * ENVOI DU FORMULAIRE
   * Pour recevoir les messages par e-mail sans serveur, créez un formulaire
   * sur un service comme Formspree (https://formspree.io) puis collez ici
   * l'URL de point d'accès, ex. "https://formspree.io/f/xxxxxxxx".
   * Ce champ attend une adresse web (URL), pas un numéro de téléphone.
   * Tant qu'il est vide, le formulaire passe par WhatsApp : aucun succès n'est simulé.
   */
  formEndpoint: ""
};