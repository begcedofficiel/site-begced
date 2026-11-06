/* =====================================================================
   BEGCED — Comportements du site : animations, équipe, organigramme,
   formations, portfolio filtrable et formulaires.
   Vous n'avez normalement pas besoin de modifier ce fichier.
   ===================================================================== */
(function () {
  "use strict";
  var C = window.BEGCED_CONFIG || {};
  var ic = window.BEGCED_ICON || function () { return ""; };
  var SILHOUETTE = "assets/img/equipe/silhouette.svg";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- Photos : silhouette si le fichier n'existe pas encore ---------- */
  function photoTag(m, cls) {
    return '<img class="' + (cls || "") + '" src="' + esc(m.photo) + '" alt="Photo de ' + esc(m.nom) +
      '" loading="lazy" width="500" height="500" data-fallback="1">';
  }
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && t.getAttribute("data-fallback") === "1" && t.src.indexOf("silhouette") === -1) {
      t.src = SILHOUETTE;
      t.classList.add("is-placeholder");
      t.alt = t.alt.replace("Photo de", "Photo à venir —");
    }
  }, true);

  /* ---------- Équipe ---------- */
  var EQ = window.BEGCED_EQUIPE || { membres: [], organigramme: {} };
  function membre(id) { return EQ.membres.filter(function (m) { return m.id === id; })[0]; }

  function carteMembre(m, complet) {
    var postes = m.postes.map(function (p) {
      return '<div class="poste"><p class="fonction">' + esc(p.fonction) + "</p>" +
        '<p class="dept">' + esc(p.departement) + "</p>" +
        (complet ? '<p class="resp">' + esc(p.responsabilites) + "</p>" : "") + "</div>";
    }).join("");
    var bio = complet
      ? (m.bio ? '<p class="bio">' + esc(m.bio) + "</p>" : "")
      : "";
    return '<article class="member" id="' + esc(m.id) + '">' +
      '<div class="member-photo">' + photoTag(m) + "</div>" +
      '<div class="member-body"><h3 class="member-name">' + esc(m.nom) + "</h3>" + postes + bio + "</div></article>";
  }

  $$("[data-team]").forEach(function (el) {
    var mode = el.getAttribute("data-team");
    var liste = EQ.membres;
    if (mode === "apercu") liste = ["innocent-kanda", "junior-ndunda", "moise-bamolona", "obed-zamba", "jacques", "tims-aseni-malamu"].map(membre).filter(Boolean);
    if (mode === "direction") liste = EQ.organigramme.direction.map(function (d) { return membre(d.membre); });
    if (mode === "techniques" || mode === "support" || mode === "ingenieurs") {
      /* une personne déjà présentée dans « Direction » n'est pas répétée */
      var vus = {};
      EQ.organigramme.direction.forEach(function (d) { vus[d.membre] = 1; });
      liste = (EQ.organigramme[mode] || []).map(function (d) { return membre(d.membre); })
        .filter(function (m) { if (!m || vus[m.id]) return false; vus[m.id] = 1; return true; });
    }
    el.innerHTML = liste.map(function (m) { return carteMembre(m, mode !== "apercu"); }).join("");
  });

  /* ---------- Organigramme ---------- */
  var org = $("[data-org]");
  if (org && EQ.organigramme.direction) {
    var O = EQ.organigramme;
    var noeud = function (d, cls) {
      var m = membre(d.membre) || { id: "", nom: "Recrutement en cours", photo: SILHOUETTE };
      var lien = m.id ? "#" + esc(m.id) : "https://wa.me/243898929192?text=" + encodeURIComponent("Bonjour BEGCED, je souhaite postuler au poste : " + d.departement);
      return '<a class="org-node ' + (cls || "") + '" href="' + lien + '"' + (m.id ? "" : ' target="_blank" rel="noopener" title="Postuler sur WhatsApp"') + '>' +
        '<span class="org-avatar">' + photoTag(m) + "</span>" +
        '<span class="org-txt"><span class="org-dept">' + esc(d.departement) + '</span><span class="org-name">' + esc(m.nom) + "</span></span></a>";
    };
    var dg = O.direction.filter(function (d) { return d.niveau === 1; });
    var dirs = O.direction.filter(function (d) { return d.niveau === 2; });
    org.innerHTML =
      '<div class="org-level org-top">' + dg.map(function (d) { return noeud(d, "org-dg"); }).join("") + "</div>" +
      '<div class="org-level org-dirs">' + dirs.map(function (d) { return noeud(d, "org-dir"); }).join("") + "</div>" +
      '<div class="org-groups">' +
      '<section class="org-group org-tech" aria-labelledby="og-t"><h3 id="og-t">' + ic("layers") + "Départements techniques opérationnels</h3>" +
      '<div class="org-list">' + O.techniques.map(function (d) { return noeud(d); }).join("") + "</div></section>" +
      '<section class="org-group org-sup" aria-labelledby="og-s"><h3 id="og-s">' + ic("briefcase") + "Départements administratifs et support</h3>" +
      '<div class="org-list">' + O.support.map(function (d) { return noeud(d); }).join("") + "</div></section>" +
      (O.ingenieurs && O.ingenieurs.length ? '<section class="org-group org-ing" aria-labelledby="og-i"><h3 id="og-i">' + ic("users") + "Ingénieurs</h3>" +
      '<div class="org-list org-list-3">' + O.ingenieurs.map(function (d) { return noeud(d); }).join("") + "</div></section>" : "") +
      "</div>";
  }

  /* ---------- Formations ---------- */
  var FO = window.BEGCED_FORMATIONS || [];
  $$("[data-formations]").forEach(function (el) {
    var mode = el.getAttribute("data-formations");
    if (mode === "apercu") {
      var pick = ["sig-qgis-arcgis-gee", "analyse-spatiale-teledetection", "kobocollect", "r-python-donnees", "modelisation-3d", "web-applications-ia"];
      el.innerHTML = pick.map(function (id) {
        var f = FO.filter(function (x) { return x.id === id; })[0]; if (!f) return "";
        return '<a class="train-chip reveal" href="formations.html#' + f.id + '"><span class="ic-badge">' + ic(f.icone) + "</span><span>" + esc(f.titre) + "</span></a>";
      }).join("");
      return;
    }
    el.innerHTML = FO.map(function (f) {
      var li = function (a) { return a.map(function (x) { return "<li>" + ic("check") + esc(x) + "</li>"; }).join(""); };
      var acom = '<span class="tbd">Sur demande</span>';
      return '<article class="training reveal" id="' + esc(f.id) + '">' +
        '<header class="training-head"><span class="ic-badge ic-lg">' + ic(f.icone) + "</span><div>" +
        "<h2>" + esc(f.titre) + "</h2><p>" + esc(f.description) + "</p></div></header>" +
        '<div class="training-cols"><div><h3>Objectifs pédagogiques</h3><ul class="checks">' + li(f.objectifs) + "</ul></div>" +
        "<div><h3>Compétences visées</h3><ul class=\"checks\">" + li(f.competences) + "</ul></div></div>" +
        '<dl class="training-meta">' +
        "<div><dt>Niveau</dt><dd>" + (f.niveau ? esc(f.niveau) : acom) + "</dd></div>" +
        "<div><dt>Dates</dt><dd>" + (f.dates ? esc(f.dates) : acom) + "</dd></div>" +
        "<div><dt>Modalités</dt><dd>" + (f.modalites ? esc(f.modalites) : acom) + "</dd></div></dl>" +
        '<a class="btn btn-outline" href="contact.html?objet=formation&formation=' + encodeURIComponent(f.id) + '">Demander des informations ' + ic("arrow") + "</a>" +
        "</article>";
    }).join("");
  });

  /* ---------- Portfolio filtrable ---------- */
  var PR = window.BEGCED_PROJETS || [];
  var DOM = { environnement: "Environnement", geomatique: "Géomatique", "genie-civil": "Génie civil", numerique: "Développement numérique", formation: "Formation" };
  var grid = $("[data-projets]");
  if (grid) {
    var vide = $("[data-projets-vide]");
    var carteProjet = function (p) {
      var img = p.images && p.images[0]
        ? '<img src="' + esc(p.images[0].src) + '" alt="' + esc(p.images[0].alt || p.titre) + '" loading="lazy">'
        : '<div class="proj-noimg">' + ic("folder") + "</div>";
      var row = function (l, v) { return v ? "<div><dt>" + l + "</dt><dd>" + esc(v) + "</dd></div>" : ""; };
      return '<article class="project" data-domaine="' + esc(p.domaine) + '">' +
        '<div class="project-media">' + img + '<span class="tag">' + esc(DOM[p.domaine] || p.domaine) + "</span></div>" +
        '<div class="project-body"><h3>' + esc(p.titre) + "</h3>" +
        '<dl class="project-meta">' + row("Client / partenaire", p.client) + row("Lieu", p.lieu) + row("Date", p.date) + "</dl>" +
        '<details><summary>Voir le détail</summary><dl class="project-detail">' +
        row("Contexte", p.contexte) + row("Intervention", p.intervention) + row("Résultats", p.resultats) +
        row("Outils", (p.outils || []).join(", ")) + "</dl>" +
        ((p.images || []).length > 1 ? '<div class="project-gallery">' + p.images.slice(1).map(function (i) {
          return '<img src="' + esc(i.src) + '" alt="' + esc(i.alt || "") + '" loading="lazy">';
        }).join("") + "</div>" : "") +
        "</details></div></article>";
    };
    grid.innerHTML = PR.map(carteProjet).join("");
    if (!PR.length) {
      /* aucun projet publié : on masque les filtres et le compteur, seul le message reste */
      var fl = $(".filters"); if (fl) fl.hidden = true;
      var stt = $("[data-filtre-statut]"); if (stt) stt.hidden = true;
    }
    var appliquer = function (f) {
      var n = 0;
      $$(".project", grid).forEach(function (c) {
        var ok = f === "tous" || c.getAttribute("data-domaine") === f;
        c.hidden = !ok; if (ok) n++;
      });
      if (vide) vide.hidden = n > 0;
      var st = $("[data-filtre-statut]");
      if (st) st.textContent = n ? n + " projet(s) affiché(s)" : "Aucun projet publié pour ce domaine pour le moment.";
    };
    $$("[data-filtre]").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("[data-filtre]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        appliquer(b.getAttribute("data-filtre"));
      });
    });
    appliquer("tous");
  }

  /* ---------- Formulaires ---------- */
  var MESSAGES = {
    valueMissing: "Ce champ est obligatoire.",
    typeMismatch: "Veuillez saisir une adresse e-mail valide (ex. nom@domaine.com).",
    patternMismatch: "Format non valide.",
    tooShort: "Ce texte est trop court."
  };
  function erreurChamp(f) {
    if (f.validity.valid) return "";
    if (f.type === "checkbox" && f.validity.valueMissing) return "Votre accord est nécessaire pour traiter la demande.";
    for (var k in MESSAGES) if (f.validity[k]) {
      if (k === "tooShort") return "Veuillez saisir au moins " + f.minLength + " caractères.";
      return MESSAGES[k];
    }
    return "Valeur non valide.";
  }
  function marquer(f) {
    var msg = erreurChamp(f);
    var box = document.getElementById(f.id + "-err");
    f.setAttribute("aria-invalid", msg ? "true" : "false");
    if (box) box.textContent = msg;
    return !msg;
  }

  $$("form[data-form]").forEach(function (form) {
    form.noValidate = true;
    var champs = $$("input, select, textarea", form).filter(function (f) { return f.name && f.name !== "_gotcha"; });
    champs.forEach(function (f) {
      f.addEventListener("blur", function () { if (f.value || f.type === "checkbox") marquer(f); });
      f.addEventListener("input", function () { if (f.getAttribute("aria-invalid") === "true") marquer(f); });
      f.addEventListener("change", function () { if (f.getAttribute("aria-invalid") === "true") marquer(f); });
    });

    /* Pré-remplissage depuis l'adresse (ex. contact.html?objet=devis&domaine=geomatique) */
    var q = new URLSearchParams(window.location.search);
    var objet = form.elements.objet, domaine = form.elements.domaine, msgF = form.elements.message;
    var mapObjet = { devis: "Demande de devis ou de proposition technique", partenariat: "Partenariat", formation: "Formation", prestation: "Demande de prestation" };
    if (objet && q.get("objet") && mapObjet[q.get("objet")]) objet.value = mapObjet[q.get("objet")];
    if (domaine && q.get("domaine")) { var d = $('option[value="' + q.get("domaine") + '"]', domaine); if (d) domaine.value = q.get("domaine"); }
    if (q.get("formation") && msgF && !msgF.value) {
      var fo = (window.BEGCED_FORMATIONS || []).filter(function (x) { return x.id === q.get("formation"); })[0];
      if (fo) { msgF.value = "Bonjour, je souhaite recevoir des informations sur la formation « " + fo.titre + " » (dates, modalités, conditions de participation).\n\n"; if (domaine) domaine.value = "formation"; }
    }

    var statut = $(".form-status", form);
    var bouton = $('button[type="submit"]', form);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var invalides = champs.filter(function (f) { return !marquer(f); });
      if (invalides.length) {
        statut.className = "form-status is-error";
        statut.innerHTML = ic("info") + "<span>Veuillez corriger " + (invalides.length > 1 ? "les " + invalides.length + " champs signalés." : "le champ signalé.") + "</span>";
        invalides[0].focus();
        return;
      }
      if (form.elements._gotcha && form.elements._gotcha.value) return; // robot

      var data = new FormData(form);
      var lignes = [];
      champs.forEach(function (f) {
        if (f.type === "checkbox") return;
        var lab = $('label[for="' + f.id + '"]', form);
        var v = f.tagName === "SELECT" ? (f.options[f.selectedIndex] || {}).text : f.value;
        if (v) lignes.push((lab ? lab.textContent.replace(/\s*\*|\(facultatif\)/g, "").trim() : f.name) + " : " + v);
      });

      if (!C.formEndpoint) {
        /* Pas de service d'envoi configuré : on n'affiche PAS de faux succès. */
        var sujet = "[Site BEGCED] " + (form.elements.objet ? form.elements.objet.value : form.getAttribute("data-form")) + " — " + (form.elements.nom ? form.elements.nom.value : "");
        var mailto = "mailto:" + C.email + "?subject=" + encodeURIComponent(sujet) + "&body=" + encodeURIComponent(lignes.join("\n"));
        statut.className = "form-status is-info";
        statut.innerHTML = ic("info") + "<div><strong>Votre message n’a pas encore été envoyé.</strong> L’envoi en ligne n’est pas encore activé sur ce site. " +
          "Cliquez ci-dessous pour ouvrir votre messagerie avec votre message pré-rempli, ou contactez-nous directement : <strong>" + C.email + "</strong> · <strong>" + C.telephone + "</strong>." +
          '<p class="status-actions"><a class="btn btn-primary btn-sm" href="' + mailto + '">' + ic("mail") + "Envoyer par e-mail</a> " +
          '<a class="btn btn-outline btn-sm" href="tel:' + C.telephoneLien + '">' + ic("phone") + "Appeler</a></p></div>";
        statut.focus();
        return;
      }

      bouton.disabled = true;
      var txt = bouton.innerHTML; bouton.textContent = "Envoi en cours…";
      statut.className = "form-status"; statut.textContent = "";
      data.append("_subject", "[Site BEGCED] " + (form.elements.objet ? form.elements.objet.value : form.getAttribute("data-form")));
      fetch(C.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (r.ok) return;
            /* Formspree renvoie la liste des erreurs : on l'affiche au visiteur */
            var e = new Error("HTTP " + r.status);
            e.details = (j.errors || []).map(function (x) { return x.message; }).filter(Boolean).join(" ");
            throw e;
          });
        })
        .then(function () {
          statut.className = "form-status is-success";
          statut.innerHTML = ic("check") + "<span><strong>Merci, votre message a bien été envoyé.</strong> Nous vous répondrons dans les meilleurs délais.</span>";
          form.reset(); champs.forEach(function (f) { f.removeAttribute("aria-invalid"); });
        })
        .catch(function (err) {
          statut.className = "form-status is-error";
          statut.innerHTML = ic("info") + '<span><strong>L’envoi a échoué.</strong> Votre message n’a pas été transmis.' + (err && err.details ? " (" + esc(err.details) + ")" : "") +
            ' Réessayez plus tard ou écrivez-nous à <a href="mailto:' + C.email + '">' + C.email + "</a> — " + C.telephone + ".</span>";
        })
        .then(function () { bouton.disabled = false; bouton.innerHTML = txt; statut.focus(); });
    });
  });

  /* ---------- Coordonnées injectées (data-c="email" etc.) ---------- */
  $$("[data-c]").forEach(function (el) {
    var k = el.getAttribute("data-c");
    if (k === "email") { el.textContent = C.email; if (el.tagName === "A") el.href = "mailto:" + C.email; }
    if (k === "tel") { el.textContent = C.telephone; if (el.tagName === "A") el.href = "tel:" + C.telephoneLien; }
    if (k === "adresse") el.textContent = C.adresse;
  });

  /* ---------- Réseaux sociaux (page Contact) ---------- */
  $$("[data-social]").forEach(function (el) {
    var R = C.reseaux || {};
    var html = (window.BEGCED_RESEAUX || []).map(function (r) {
      return '<a class="social-link" href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.nom) + "</a>";
    }).join("");
    if (R.whatsapp) html = '<a class="social-link social-wa" href="https://wa.me/' + esc(R.whatsapp) + '" target="_blank" rel="noopener">' + ic("phone") + "Écrire sur WhatsApp</a>" + html;
    el.innerHTML = html;
    if (!html) el.parentNode.hidden = true;
  });

  /* ---------- Apparition douce au défilement ---------- */
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var els = $$(".reveal");
  if (!reduit && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Galerie photos : agrandissement au clic ---------- */
  var liens = $$("a[data-lightbox]");
  if (liens.length) {
    var box = document.createElement("div");
    box.className = "lightbox"; box.hidden = true;
    box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Photo agrandie");
    box.innerHTML = '<button type="button" class="lb-close" aria-label="Fermer">×</button>' +
      '<button type="button" class="lb-prev" aria-label="Photo précédente">‹</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-next" aria-label="Photo suivante">›</button>';
    document.body.appendChild(box);
    var cur = 0, groupe = [];
    var montrer = function (i) {
      cur = (i + groupe.length) % groupe.length;
      var a = groupe[cur], im = a.querySelector("img");
      $("img", box).src = a.getAttribute("href");
      $("img", box).alt = im ? im.alt : "";
      $("figcaption", box).textContent = a.getAttribute("data-caption") || (im ? im.alt : "");
    };
    var fermer = function () { box.hidden = true; document.body.style.overflow = ""; };
    liens.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var g = a.getAttribute("data-lightbox");
        groupe = liens.filter(function (x) { return x.getAttribute("data-lightbox") === g; });
        montrer(groupe.indexOf(a)); box.hidden = false; document.body.style.overflow = "hidden";
        $(".lb-close", box).focus();
      });
    });
    $(".lb-close", box).addEventListener("click", fermer);
    $(".lb-prev", box).addEventListener("click", function () { montrer(cur - 1); });
    $(".lb-next", box).addEventListener("click", function () { montrer(cur + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) fermer(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") fermer();
      if (e.key === "ArrowLeft") montrer(cur - 1);
      if (e.key === "ArrowRight") montrer(cur + 1);
    });
  }
})();
