/* =====================================================================
   BEGCED — En-tête, pied de page et pictogrammes communs à toutes les pages.
   Pour modifier le menu : éditez le tableau NAV ci-dessous.
   (Pour une future version anglaise : dupliquez ce tableau avec les
   libellés traduits et choisissez-le selon <html lang="...">.)
   ===================================================================== */
(function () {
  "use strict";
  var C = window.BEGCED_CONFIG || {};

  var NAV = [
    { id: "accueil", label: "Accueil", href: "index.html" },
    { id: "a-propos", label: "À propos", href: "a-propos.html" },
    { id: "expertises", label: "Nos expertises", href: "expertises.html" },
    { id: "projets", label: "Nos projets", href: "projets.html" },
    { id: "formations", label: "Formations", href: "formations.html" },
    { id: "suivi-chantier-diaspora", label: "Diaspora", href: "suivi-chantier-diaspora.html" },
    { id: "etudiants-chercheurs", label: "Étudiants", href: "etudiants-chercheurs.html" },
    { id: "equipe", label: "Notre équipe", href: "equipe.html" },
    { id: "contact", label: "Contact", href: "contact.html" }
  ];
  var NAV_PIED = NAV.concat([
    { id: "methodologie", label: "Notre méthodologie", href: "methodologie.html" },
    { id: "partenariats", label: "Partenariats", href: "partenariats.html" },
    { id: "confidentialite", label: "Politique de confidentialité", href: "confidentialite.html" }
  ]);

  /* ---------- Pictogrammes (sprite SVG) ---------- */
  var P = {
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    map: '<path d="M14.1 5.55a2 2 0 0 0 1.8 0l3.65-1.83A1 1 0 0 1 21 4.62v12.76a1 1 0 0 1-.55.9l-4.55 2.27a2 2 0 0 1-1.8 0l-4.2-2.1a2 2 0 0 0-1.8 0l-3.65 1.83A1 1 0 0 1 3 19.38V6.62a1 1 0 0 1 .55-.9L8.1 3.45a2 2 0 0 1 1.8 0z"/><path d="M15 5.76v15"/><path d="M9 3.24v15"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    pin: '<path d="M20 10c0 5-5.54 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.2 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    plan: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
    trend: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    cap: '<path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    landmark: '<path d="M3 22h18"/><path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7"/><path d="M12 2 20 7H4z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    cube: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    phoneapp: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    bars: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
    cycle: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'
  };
  var sprite = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">';
  Object.keys(P).forEach(function (k) {
    sprite += '<symbol id="i-' + k + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + P[k] + "</symbol>";
  });
  sprite += "</svg>";
  document.body.insertAdjacentHTML("afterbegin", sprite);

  function ic(n) { return '<svg class="i" aria-hidden="true"><use href="#i-' + n + '"></use></svg>'; }
  window.BEGCED_ICON = ic;

  var meta = document.querySelector('meta[name="begced-page"]');
  var page = document.body.getAttribute("data-page") || (meta ? meta.content : "");

  /* ---------- En-tête ---------- */
  var liens = NAV.map(function (l) {
    var actif = l.id === page ? ' aria-current="page"' : "";
    return '<li><a href="' + l.href + '"' + actif + ">" + l.label + "</a></li>";
  }).join("");

  var header =
    '<a class="skip" href="#contenu">Aller au contenu principal</a>' +
    '<header class="site-header" id="haut">' +
    '<div class="wrap header-in">' +
    '<a class="brand" href="index.html" aria-label="BEGCED — retour à l’accueil">' +
    '<img src="assets/img/logo/logo-embleme-160.jpg" alt="" width="152" height="160" class="brand-mark">' +
    '<img src="assets/img/logo/logo-texte-72.jpg" alt="BEGCED" width="414" height="72" class="brand-word">' +
    "</a>" +
    '<nav class="main-nav" id="menu-principal" aria-label="Navigation principale"><ul>' + liens + "</ul>" +
    '<a class="btn btn-accent nav-cta" href="contact.html?objet=devis">Demander un devis</a></nav>' +
    '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu-principal">' +
    '<span class="menu-open">' + ic("menu") + '</span><span class="menu-close">' + ic("close") + '</span><span class="sr">Menu</span></button>' +
    "</div></header>";
  var hSlot = document.getElementById("site-header");
  if (hSlot) hSlot.outerHTML = header;

  /* ---------- Pied de page ---------- */
  var R = C.reseaux || {};
  var RESEAUX = [["facebook", "Facebook"], ["linkedin", "LinkedIn"], ["youtube", "YouTube"], ["instagram", "Instagram"],
    ["tiktok", "TikTok"], ["whatsappChaine", "Chaîne WhatsApp"], ["x", "X"]];
  window.BEGCED_RESEAUX = RESEAUX.filter(function (r) { return R[r[0]]; }).map(function (r) { return { url: R[r[0]], nom: r[1] }; });
  var reseaux = window.BEGCED_RESEAUX.map(function (r) {
    return '<li><a href="' + r.url + '" target="_blank" rel="noopener">' + r.nom + "</a></li>";
  });

  var annee = new Date().getFullYear();
  var footer =
    '<footer class="site-footer">' +
    '<div class="wrap footer-grid">' +
    '<div class="footer-brand">' +
    '<a href="index.html" class="footer-logo"><img src="assets/img/logo/logo-begced-520.jpg" alt="Logo BEGCED" width="473" height="520" loading="lazy"></a>' +
    "<p><strong>" + C.nomCourt + "</strong> — " + C.nomComplet + "</p>" +
    '<p class="footer-slogan">« ' + C.slogan.replace(/\.$/, "") + ". »</p>" +
    "</div>" +
    '<div><h2 class="footer-h">Navigation</h2><ul class="footer-links">' +
    NAV_PIED.map(function (l) { return '<li><a href="' + l.href + '">' + l.label + "</a></li>"; }).join("") +
    "</ul></div>" +
    '<div><h2 class="footer-h">Contact</h2><ul class="footer-contact">' +
    "<li>" + ic("pin") + "<span>" + C.adresse + "</span></li>" +
    '<li>' + ic("mail") + '<a href="mailto:' + C.email + '">' + C.email + "</a></li>" +
    '<li>' + ic("phone") + '<a href="tel:' + C.telephoneLien + '">' + C.telephone + "</a></li>" +
    (R.whatsapp ? '<li>' + ic("phone") + '<a href="https://wa.me/' + R.whatsapp + '" target="_blank" rel="noopener">WhatsApp : ' + (R.whatsappAffiche || R.whatsapp) + "</a></li>" : "") +
    "</ul>" +
    (reseaux.length ? '<h2 class="footer-h footer-h2">Suivez-nous</h2><ul class="footer-links">' + reseaux.join("") + "</ul>" : "") +
    '<a class="btn btn-accent btn-sm" href="contact.html?objet=devis">Demander un devis</a>' +
    "</div></div>" +
    '<div class="wrap footer-bottom"><p>© ' + annee + " BEGCED. Tous droits réservés.</p>" +
    '<p><a href="confidentialite.html">Politique de confidentialité</a> · <a href="#haut">Haut de page ↑</a></p></div>' +
    "</footer>";
  var fSlot = document.getElementById("site-footer");
  if (fSlot) fSlot.outerHTML = footer;

  /* ---------- Menu mobile ---------- */
  var btn = document.querySelector(".menu-toggle");
  var nav = document.getElementById("menu-principal");
  var hdr = document.querySelector(".site-header");
  function fermer() { btn.setAttribute("aria-expanded", "false"); hdr.classList.remove("open"); }
  if (btn) {
    btn.addEventListener("click", function () {
      var o = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!o));
      hdr.classList.toggle("open", !o);
      if (!o) { var f = nav.querySelector("a"); if (f) f.focus(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && hdr.classList.contains("open")) { fermer(); btn.focus(); }
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) fermer(); });
    window.matchMedia("(min-width: 1101px)").addEventListener("change", function (m) { if (m.matches) fermer(); });
  }
  /* Ombre de l'en-tête au défilement */
  var onScroll = function () { hdr && hdr.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
