/* =====================================================================
   BEGCED — CONFIGURATION DU SITE
   ---------------------------------------------------------------------
   C'est le SEUL fichier à modifier pour changer les coordonnées,
   activer l'envoi des formulaires ou ajouter les réseaux sociaux.
   ===================================================================== */
window.BEGCED_CONFIG = {
  nomCourt: "BEGCED",
  nomComplet: "Bureau d’Études en Génie Civil, Géomatique, Environnement et Développement Numérique",
  slogan: "De la donnée à l’action.",
  signature: "Concevoir, analyser, exécuter et innover pour un développement durable en République démocratique du Congo.",
  adresse: "Mont-Ngafula, Kinshasa, RDC",
  email: "info@begced.com",
  telephone: "+243 898 929 192",
  telephoneLien: "+243898929192", // même numéro, sans espaces (utilisé pour le lien « Appeler »)

  /* ---------------------------------------------------------------
     ENVOI DES FORMULAIRES
     Le site est statique : il ne peut pas envoyer d'e-mail tout seul.
     1. Créez un formulaire gratuit sur https://formspree.io
        (avec l'adresse info@begced.com).
     2. Copiez l'adresse fournie, par ex. "https://formspree.io/f/abcdwxyz".
     3. Collez-la ci-dessous entre les guillemets.
     Tant que ce champ est vide, les formulaires NE PRÉTENDENT PAS
     envoyer le message : ils proposent d'ouvrir la messagerie du
     visiteur avec le message pré-rempli.
     --------------------------------------------------------------- */
  formEndpoint: "https://formspree.io/f/mbgdvazd", // formulaire « Site BEGCED » (activé le 21/10/2026)

  /* ---------------------------------------------------------------
     RÉSEAUX SOCIAUX — à remplir UNIQUEMENT lorsqu'ils existent.
     Exemple : linkedin: "https://www.linkedin.com/company/begced"
     Les champs vides ne s'affichent pas sur le site.
     --------------------------------------------------------------- */
  reseaux: {
    facebook: "https://www.facebook.com/profile.php?id=61594808189464",
    linkedin: "https://www.linkedin.com/company/begced/",
    youtube: "https://www.youtube.com/@BEGCEDOfficiel",
    instagram: "https://www.instagram.com/begced.officiel/",
    tiktok: "https://www.tiktok.com/@begcedofficiel",
    whatsappChaine: "https://whatsapp.com/channel/0029Vb9KA9LAe5VrCAqkPi18",
    x: "",
    whatsapp: "243898929192",            // numéro WhatsApp : international, sans + ni espaces
    whatsappAffiche: "+243 898 929 192"  // même numéro, tel qu'il s'affiche
  }
};
