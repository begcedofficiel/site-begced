/* =====================================================================
   BEGCED — ÉQUIPE
   ---------------------------------------------------------------------
   AJOUTER UNE PHOTO : enregistrez la photo (carrée de préférence,
   500 x 500 px, format .jpg) dans le dossier  assets/img/equipe/
   en lui donnant EXACTEMENT le nom indiqué dans « photo ».
   Exemple : assets/img/equipe/innocent-kanda.jpg
   Tant que le fichier n'existe pas, une silhouette neutre s'affiche.

   COMPLÉTER UNE BIOGRAPHIE : écrivez le texte entre les guillemets
   de « bio ». Laissez "" tant qu'elle n'est pas validée.
   ===================================================================== */
window.BEGCED_EQUIPE = {
  membres: [
    {
      id: "innocent-kanda",
      nom: "Innocent KANDA",
      photo: "assets/img/equipe/innocent-kanda.jpg",
      postes: [
        { fonction: "Directeur général", departement: "Direction générale", responsabilites: "Orientation stratégique, supervision globale et représentation." }
      ],
      bio: ""
    },
    {
      id: "junior-ndunda",
      nom: "Junior NDUNDA",
      photo: "assets/img/equipe/junior-ndunda.jpg",
      postes: [
        { fonction: "Directeur technique", departement: "Direction technique", responsabilites: "Coordination technique, assurance qualité et validation." }
      ],
      bio: ""
    },
    {
      id: "moise-bamolona",
      nom: "Moïse BAMOLONA",
      photo: "assets/img/equipe/moise-bamolona.jpg",
      postes: [
        { fonction: "Directeur administratif et financier", departement: "Direction administrative et financière", responsabilites: "Gestion administrative, financière et des ressources humaines." }
      ],
      bio: ""
    },
    {
      id: "eliezer-kanda",
      nom: "Éliézer KANDA",
      photo: "assets/img/equipe/eliezer-kanda.jpg",
      postes: [
        { fonction: "Responsable du département Génie civil", departement: "Génie civil", responsabilites: "Infrastructures, BTP, modélisation et ouvrages." }
      ],
      bio: ""
    },
    {
      id: "victoire-manzuku",
      nom: "Victoire MANZUKU IMBEMBE",
      photo: "assets/img/equipe/victoire-manzuku.jpg",
      postes: [
        { fonction: "Responsable Ressources humaines et logistique", departement: "Ressources humaines et logistique", responsabilites: "Gestion du personnel, logistique et moyens généraux." }
      ],
      bio: ""
    },
    {
      id: "obed-zamba",
      nom: "Obed ZAMBA",
      photo: "assets/img/equipe/obed-zamba.jpg",
      postes: [
        { fonction: "Responsable du département Géomatique", departement: "Géomatique", responsabilites: "SIG, télédétection, cartographie et topographie." }
      ],
      bio: ""
    },
    {
      id: "jacques",
      nom: "Jacques",
      photo: "assets/img/equipe/jacques.jpg",
      postes: [
        { fonction: "Ingénieur", departement: "Équipe d’ingénieurs", responsabilites: "Études techniques et missions de terrain." }
      ],
      bio: ""
    },
    {
      id: "tims-aseni-malamu",
      nom: "Tims ASENI MALAMU",
      photo: "assets/img/equipe/tims-aseni-malamu.jpg",
      postes: [
        { fonction: "Responsable du département Recherche et formation", departement: "Recherche et formation", responsabilites: "Projets de recherche appliquée, formations et encadrement des stagiaires." }
      ],
      bio: ""
    }
  ],

  /* Organigramme : chaque case renvoie à un membre (id) ci-dessus. */
  organigramme: {
    direction: [
      { departement: "Direction générale", membre: "innocent-kanda", niveau: 1 },
      { departement: "Direction technique", membre: "junior-ndunda", niveau: 2 },
      { departement: "Direction administrative et financière", membre: "moise-bamolona", niveau: 2 }
    ],
    techniques: [
      { departement: "Géomatique", membre: "obed-zamba" },
      { departement: "Génie civil", membre: "eliezer-kanda" },
      { departement: "Environnement", membre: "" },
      { departement: "Développement numérique", membre: "" },
      { departement: "Recherche et formation", membre: "tims-aseni-malamu" }
    ],
    support: [
      { departement: "Ressources humaines et logistique", membre: "victoire-manzuku" },
      { departement: "Finances et comptabilité", membre: "" }
    ],
    ingenieurs: [
      { departement: "Ingénieur", membre: "jacques" }
    ]
  }
};
