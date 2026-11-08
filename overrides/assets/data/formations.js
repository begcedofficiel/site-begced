/* =====================================================================
   BEGCED — FORMATIONS
   ---------------------------------------------------------------------
   Les objectifs et compétences ci-dessous sont des PROPOSITIONS de
   rédaction : faites-les valider par le département Recherche et
   formation avant publication.
   « niveau », « dates » et « modalites » restent "" tant qu'ils ne
   sont pas confirmés : le site affiche alors « À communiquer ».
   N'indiquez ni tarif ni certification non confirmés.
   ===================================================================== */
window.BEGCED_FORMATIONS = [
  {
    id: "sig-qgis-arcgis-gee",
    icone: "map",
    titre: "QGIS, ArcGIS Pro, Google Earth Engine et autres logiciels SIG",
    description: "Prendre en main les principaux logiciels de SIG (QGIS, ArcGIS Pro, Global Mapper, GRASS GIS, SAGA GIS) et la plateforme Google Earth Engine pour produire, analyser et diffuser des données géographiques.",
    niveau: "",
    objectifs: ["Organiser un projet SIG et ses données", "Produire des cartes thématiques de qualité", "Traiter des images satellitaires dans Google Earth Engine"],
    competences: ["Gestion de couches vectorielles et raster", "Mise en page cartographique", "Scripts de base dans Google Earth Engine", "Modèles numériques de terrain et hydrologie (Global Mapper, GRASS, SAGA)"],
    dates: "", modalites: ""
  },
  {
    id: "kobocollect",
    icone: "phoneapp",
    titre: "KoboCollect et collecte numérique de données",
    description: "Concevoir des formulaires numériques et organiser des enquêtes de terrain fiables sur téléphone ou tablette.",
    niveau: "",
    objectifs: ["Concevoir un formulaire XLSForm", "Déployer une enquête et suivre la collecte", "Exporter et contrôler la qualité des données"],
    competences: ["Conception de questionnaires", "Collecte géoréférencée", "Nettoyage et export des données"],
    dates: "", modalites: ""
  },
  {
    id: "analyse-spatiale-teledetection",
    icone: "layers",
    titre: "Télédétection et analyse spatiale : ENVI, ERDAS Imagine et SNAP",
    description: "Comprendre et appliquer les méthodes d’analyse spatiale et de télédétection aux questions territoriales et environnementales, avec ENVI, ERDAS Imagine, SNAP (images Sentinel et radar) et QGIS.",
    niveau: "",
    objectifs: ["Choisir les données et méthodes adaptées", "Classer l’occupation du sol", "Détecter et cartographier des changements"],
    competences: ["Prétraitement d’images optiques et radar", "Classification et validation", "Analyse de changements"],
    dates: "", modalites: ""
  },
  {
    id: "r-python-donnees",
    icone: "bars",
    titre: "R, RStudio, Python et Jupyter Notebook appliqués aux données environnementales et géographiques",
    description: "Automatiser le traitement, l’analyse statistique et la visualisation de données environnementales et spatiales.",
    niveau: "",
    objectifs: ["Importer, nettoyer et structurer des données", "Réaliser des analyses statistiques reproductibles", "Produire graphiques et cartes par le code"],
    competences: ["Programmation de base en R et Python", "Carnets Jupyter Notebook", "Visualisation et rapports reproductibles"],
    dates: "", modalites: ""
  },
  {
    id: "gps-google-earth-pro",
    icone: "pin",
    titre: "GPS, GNSS de terrain et Google Earth Pro",
    description: "Réaliser des relevés de terrain fiables avec un GPS et les exploiter dans Google Earth Pro et les logiciels SIG.",
    niveau: "",
    objectifs: ["Configurer un GPS et enregistrer points et traces", "Transférer et contrôler les données collectées", "Visualiser, mesurer et cartographier dans Google Earth Pro"],
    competences: ["Relevés GPS et GNSS (points, traces, surfaces)", "Formats GPX et KML/KMZ", "Import dans QGIS et ArcGIS"],
    dates: "", modalites: ""
  },
  {
    id: "drone-photogrammetrie",
    icone: "target",
    titre: "Drone et photogrammétrie : Agisoft Metashape et Pix4D",
    description: "Planifier des vols de drone et produire orthophotos, modèles numériques de terrain et nuages de points.",
    niveau: "",
    objectifs: ["Planifier une mission de vol", "Traiter les images avec Agisoft Metashape ou Pix4D", "Exploiter orthophotos et MNT dans un SIG"],
    competences: ["Plan de vol et points de contrôle", "Orthophotos, MNT et nuages de points", "Intégration SIG et calcul de volumes"],
    dates: "", modalites: ""
  },
  {
    id: "spss-powerbi-sql",
    icone: "db",
    titre: "SPSS, Power BI et bases de données SQL (PostgreSQL/PostGIS)",
    description: "Analyser des données d’enquête, gérer des bases de données et construire des tableaux de bord pour la prise de décision.",
    niveau: "",
    objectifs: ["Réaliser des analyses statistiques avec SPSS", "Interroger et organiser des données avec SQL et PostGIS", "Construire des tableaux de bord interactifs dans Power BI"],
    competences: ["Statistiques descriptives et tests", "Requêtes SQL", "Visualisation et tableaux de bord"],
    dates: "", modalites: ""
  },
  {
    id: "biomasse-carbone-climat",
    icone: "leaf",
    titre: "Calcul de biomasse, carbone et analyse climatique",
    description: "Estimer la biomasse et les stocks de carbone à partir d’inventaires, et analyser les variables climatiques.",
    niveau: "",
    objectifs: ["Organiser un inventaire forestier", "Appliquer des équations allométriques", "Analyser des séries climatiques"],
    competences: ["Calcul de biomasse et de carbone", "Estimation des émissions de CO₂", "Analyse de données climatiques"],
    dates: "", modalites: ""
  },
  {
    id: "modelisation-3d",
    icone: "cube",
    titre: "AutoCAD, Civil 3D, Covadis, ArchiCAD, Revit et SketchUp",
    description: "Dessiner des plans et concevoir des maquettes numériques 2D/3D de bâtiments, de routes et de réseaux (BIM).",
    niveau: "",
    objectifs: ["Dessiner des plans techniques avec AutoCAD", "Concevoir routes, plateformes et terrassements avec Civil 3D et Covadis", "Construire une maquette BIM avec Revit ou ArchiCAD"],
    competences: ["Dessin technique 2D (AutoCAD)", "Topographie, profils et cubatures (Civil 3D, Covadis)", "Modélisation 3D et BIM (Revit, ArchiCAD, SketchUp)"],
    dates: "", modalites: ""
  },
  {
    id: "calcul-structures",
    icone: "building",
    titre: "Calcul de structures : Robot Structural Analysis, ETABS, SAP2000 et Tekla",
    description: "Modéliser, calculer et dimensionner les structures en béton armé et en acier selon les normes en vigueur.",
    niveau: "",
    objectifs: ["Modéliser une structure et ses charges", "Calculer et dimensionner poteaux, poutres, dalles et fondations", "Produire les plans de ferraillage et notes de calcul"],
    competences: ["Robot Structural Analysis", "ETABS et SAP2000", "Détails et ferraillage (Tekla Structures)"],
    dates: "", modalites: ""
  },
  {
    id: "gestion-chantier",
    icone: "calendar",
    titre: "Gestion de chantier : MS Project, métrés et devis",
    description: "Planifier un chantier, estimer les quantités et les coûts, et suivre l’avancement des travaux.",
    niveau: "",
    objectifs: ["Planifier les travaux avec MS Project", "Réaliser métrés et devis estimatifs (Excel)", "Suivre l’avancement et les coûts d’un chantier"],
    competences: ["Planning et diagramme de Gantt", "Métrés, devis et bordereaux de prix", "Suivi et rapports de chantier"],
    dates: "", modalites: ""
  },
  {
    id: "web-applications-ia",
    icone: "code",
    titre: "Développement web, applications et initiation à l’intelligence artificielle",
    description: "Découvrir la création de sites et d’applications, et les bases de l’intelligence artificielle appliquée aux données.",
    niveau: "",
    objectifs: ["Créer une page web simple", "Comprendre l’architecture d’une application", "Découvrir les usages de l’IA (classification, prédiction)"],
    competences: ["HTML, CSS et notions de programmation", "Logique applicative", "Premiers modèles d’apprentissage automatique"],
    dates: "", modalites: ""
  }
];
