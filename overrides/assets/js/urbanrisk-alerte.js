/*
 * UrbanRisk Mont-Ngafula – vigilance pluie, version 2 (novembre 2026)
 * BEGCED – « De la donnée à l'action »
 *
 * Pourquoi cette version :
 * la version 1 prenait le modèle le plus pluvieux (GFS ou ECMWF) et annonçait
 * une date précise. À Kinshasa, la pluie vient surtout d'orages locaux : un seul
 * modèle se trompe souvent de jour. Résultat : pluie annoncée les mauvais jours,
 * alors qu'il n'a plu que le mercredi.
 *
 * Ce que fait la version 2 :
 * 1. Elle lit les PRÉVISIONS D'ENSEMBLE (environ 120 scénarios : ECMWF 51,
 *    GFS 31, ICON 40) au lieu d'un seul scénario par modèle.
 * 2. Elle calcule, pour chaque jour, la PROBABILITÉ de dépasser 20, 35 et 50 mm.
 * 3. Elle ne déclenche ORANGE ou ROUGE que si une part suffisante des scénarios
 *    s'accorde (40 % ou plus), et affiche « risque d'orage X % » jour par jour.
 * 4. Si les ensembles ne répondent pas, elle revient à l'ancienne méthode,
 *    en le signalant clairement.
 *
 * Utilisation (inchangée) : <div id="ur-alerte"></div> pour le bandeau.
 * Optionnel : <div id="ur-previsions"></div> pour le tableau jour par jour.
 * Aucune donnée personnelle, aucun service payant (Open-Meteo, CC BY 4.0).
 */
(function () {
  "use strict";

  var LIEN = "https://begced.com/diagnostic-parcelle";
  var PTS = [
    { nom: "Bassin B1 (centre)", lat: -4.4621, lon: 15.2622 },
    { nom: "Bassin B2 (est)", lat: -4.4759, lon: 15.3841 },
    { nom: "Bassin B3 (ouest)", lat: -4.5164, lon: 15.2097 },
    { nom: "Nord de la commune", lat: -4.40, lon: 15.21 },
    { nom: "Sud de la commune", lat: -4.58, lon: 15.33 }
  ];
  var MODELES = ["ecmwf_ifs025", "gfs025", "icon_seamless"];
  var SEUILS = { jaune: 20, orange: 35, rouge: 50, orange72: 50, rouge72: 80 };
  var P_ALERTE = 0.40;   // part des scénarios nécessaire pour ORANGE / ROUGE
  var P_JAUNE = 0.30;
  var DECALAGE_H = 1;    // Kinshasa = UTC+1
  var JOURS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
  var NOMS = ["", "Jaune", "Orange", "Rouge"];
  var COULEURS = ["", "#f2c200", "#f08a00", "#d62828"];

  function urlEnsemble() {
    return "https://ensemble-api.open-meteo.com/v1/ensemble?latitude=" +
      PTS.map(function (p) { return p.lat; }).join(",") +
      "&longitude=" + PTS.map(function (p) { return p.lon; }).join(",") +
      "&hourly=precipitation&models=" + MODELES.join(",") +
      "&forecast_days=4&timezone=GMT";
  }
  function urlSecours() {
    return "https://api.open-meteo.com/v1/forecast?latitude=" +
      PTS.map(function (p) { return p.lat; }).join(",") +
      "&longitude=" + PTS.map(function (p) { return p.lon; }).join(",") +
      "&hourly=precipitation&models=gfs_seamless,ecmwf_ifs025&forecast_days=4&timezone=GMT";
  }

  // Jour de Kinshasa (AAAA-MM-JJ) pour une heure GMT "2026-11-04T13:00"
  function jourKin(iso) {
    var d = new Date(iso + "Z");
    d.setUTCHours(d.getUTCHours() + DECALAGE_H);
    return d.toISOString().slice(0, 10);
  }

  // Regroupe les colonnes horaires par scénario : { "ecmwf_ifs025": [[...], ...] }
  function scenarios(hourly) {
    var groupes = {};
    Object.keys(hourly).forEach(function (cle) {
      if (cle.indexOf("precipitation") !== 0) return;
      var modele = "unique";
      MODELES.concat(["gfs_seamless"]).forEach(function (m) {
        if (cle.indexOf(m) !== -1) modele = m;
      });
      (groupes[modele] = groupes[modele] || []).push(hourly[cle]);
    });
    return groupes;
  }

  /*
   * Analyse un point. Chaque modèle compte pour un tiers, quel que soit son
   * nombre de scénarios, pour qu'ECMWF (51) n'écrase pas les autres.
   * Retourne { jours: [{jour, p20, p35, p50, mediane}], p72_50, p72_80 }.
   */
  function analyserPoint(donnees, maintenant) {
    var t = donnees.hourly.time;
    var debut = 0;
    while (debut < t.length && new Date(t[debut] + "Z") < maintenant) debut++;
    var fin = Math.min(t.length, debut + 72);
    var listeJours = [];
    for (var i = debut; i < fin; i++) {
      var j = jourKin(t[i]);
      if (listeJours.indexOf(j) === -1) listeJours.push(j);
    }
    listeJours = listeJours.slice(0, 3);

    var groupes = scenarios(donnees.hourly);
    var modeles = Object.keys(groupes);
    var poidsModele = 1 / modeles.length;
    var res = listeJours.map(function (j) { return { jour: j, p20: 0, p35: 0, p50: 0, valeurs: [] }; });
    var p72_50 = 0, p72_80 = 0, totaux = [];

    modeles.forEach(function (m) {
      var membres = groupes[m].filter(function (serie) {
        return serie.slice(debut, fin).some(function (v) { return v !== null; });
      });
      if (!membres.length) return;
      var poids = poidsModele / membres.length;
      membres.forEach(function (serie) {
        var total72 = 0, parJour = {};
        for (var k = debut; k < fin; k++) {
          var v = serie[k] || 0;
          total72 += v;
          var j = jourKin(t[k]);
          parJour[j] = (parJour[j] || 0) + v;
        }
        totaux.push([total72, poids]);
        if (total72 >= SEUILS.orange72) p72_50 += poids;
        if (total72 >= SEUILS.rouge72) p72_80 += poids;
        res.forEach(function (r) {
          var mm = parJour[r.jour] || 0;
          r.valeurs.push(mm);
          if (mm >= SEUILS.jaune) r.p20 += poids;
          if (mm >= SEUILS.orange) r.p35 += poids;
          if (mm >= SEUILS.rouge) r.p50 += poids;
        });
      });
    });

    res.forEach(function (r) {
      var v = r.valeurs.sort(function (a, b) { return a - b; });
      r.mediane = v.length ? v[Math.floor(v.length / 2)] : 0;
      r.haut = v.length ? v[Math.floor(v.length * 0.9)] : 0; // scénario pluvieux (90 %)
      delete r.valeurs;
    });
    // Pluie probable sur 72 h : valeur que 40 % des scénarios dépassent (60e centile pondéré).
    // C'est la valeur cohérente avec la règle « ORANGE si 40 % des scénarios dépassent 50 mm ».
    totaux.sort(function (a, b) { return a[0] - b[0]; });
    var somme = totaux.reduce(function (m, x) { return m + x[1]; }, 0), cumul = 0, q60 = 0;
    for (var q = 0; q < totaux.length; q++) { cumul += totaux[q][1]; if (cumul >= 0.6 * somme) { q60 = totaux[q][0]; break; } }
    return { jours: res, p72_50: p72_50, p72_80: p72_80, pluie72: q60 };
  }

  function niveauPoint(a) {
    var n = 0;
    a.jours.forEach(function (j) {
      if (j.p50 >= P_ALERTE) n = Math.max(n, 3);
      else if (j.p35 >= P_ALERTE) n = Math.max(n, 2);
      else if (j.p20 >= P_JAUNE) n = Math.max(n, 1);
    });
    if (a.p72_80 >= P_ALERTE) n = Math.max(n, 3);
    else if (a.p72_50 >= P_ALERTE) n = Math.max(n, 2);
    return n;
  }

  function analyser(liste, maintenant) {
    var points = liste.map(function (d, i) {
      var a = analyserPoint(d, maintenant || new Date());
      a.nom = PTS[i].nom;
      a.niveau = niveauPoint(a);
      return a;
    });
    var niveau = points.reduce(function (m, p) { return Math.max(m, p.niveau); }, 0);
    // Tableau communal : pour chaque jour, la probabilité la plus forte parmi les 5 points
    var jours = points[0].jours.map(function (j, k) {
      var c = { jour: j.jour, p20: 0, p35: 0, p50: 0, mediane: 0, haut: 0 };
      points.forEach(function (p) {
        var x = p.jours[k]; if (!x) return;
        ["p20", "p35", "p50", "mediane", "haut"].forEach(function (f) { c[f] = Math.max(c[f], x[f]); });
      });
      return c;
    });
    return { niveau: niveau, points: points, jours: jours };
  }

  function libelleJour(iso) {
    var d = new Date(iso + "T12:00:00Z");
    return JOURS[d.getUTCDay()] + " " + d.getUTCDate();
  }
  function pct(x) { return Math.round(x * 100) + " %"; }

  function phraseRisque(j) {
    if (j.p50 >= 0.2) return "risque d'orage très fort " + pct(j.p50);
    if (j.p35 >= 0.2) return "risque d'orage fort " + pct(j.p35);
    if (j.p20 >= 0.2) return "risque d'averse orageuse " + pct(j.p20);
    return "pluie forte peu probable";
  }

  function afficherBandeau(r, secours) {
    var el = document.getElementById("ur-alerte");
    if (!el) return;
    if (r.niveau < 2) { el.innerHTML = ""; el.style.display = "none"; return; }
    var jour = r.jours.slice().sort(function (a, b) { return b.p35 - a.p35; })[0];
    var zones = r.points.filter(function (p) { return p.niveau >= 2; }).map(function (p) { return p.nom; });
    var surPage = /diagnostic-parcelle/.test(location.pathname);
    el.style.cssText = "display:block;background:" + COULEURS[r.niveau] +
      ";color:#fff;padding:10px 16px;font:600 15px/1.4 system-ui,sans-serif;text-align:center";
    el.innerHTML = "⚠️ Vigilance expérimentale " + NOMS[r.niveau].toUpperCase() +
      " – Mont-Ngafula · " + libelleJour(jour.jour) + " : " + phraseRisque(jour) +
      " (" + Math.round(jour.mediane) + " à " + Math.round(jour.haut) + " mm selon les scénarios) · " +
      (zones.length === PTS.length ? "toute la commune" : zones.join(", ")) + (secours ? " · méthode de secours" : "") +
      (surPage ? "" : " · <a href='" + LIEN + "' style='color:inherit;text-decoration:underline'>Voir la carte UrbanRisk</a>");
  }

  function afficherTableau(r, secours) {
    var el = document.getElementById("ur-previsions");
    if (!el) return;
    var lignes = r.jours.map(function (j) {
      return "<tr><td>" + libelleJour(j.jour) + "</td><td>" + pct(j.p20) + "</td><td>" + pct(j.p35) +
        "</td><td>" + pct(j.p50) + "</td><td>" + Math.round(j.mediane) + " – " + Math.round(j.haut) + " mm</td></tr>";
    }).join("");
    el.innerHTML =
      "<table class='ur-tab' style='width:100%;border-collapse:collapse;font-size:14px'>" +
      "<thead><tr><th style='text-align:left'>Jour</th><th>≥ 20 mm</th><th>≥ 35 mm</th><th>≥ 50 mm</th><th>Pluie probable</th></tr></thead>" +
      "<tbody>" + lignes + "</tbody></table>" +
      "<p style='font-size:13px;opacity:.8;margin-top:8px'>Probabilité que la pluie de la journée dépasse le seuil, " +
      "sur le point le plus exposé de la commune. " +
      (secours ? "Prévisions d'ensemble indisponibles : méthode de secours (2 modèles), moins fiable. "
               : "Calculée sur environ 120 scénarios (ECMWF, GFS, ICON). ") +
      "Les orages de Kinshasa sont locaux : un même jour, il peut pleuvoir fort à Kimwenza et rester sec à Kindele. " +
      "Information expérimentale BEGCED, non officielle. Alertes officielles : Mettelsat et Protection civile.</p>";
  }

  // Affiche, puis partage le résultat avec la carte (bassins B1, B2, B3 = points 1 à 3)
  function publier(r, secours) {
    r.secours = secours;
    afficherBandeau(r, secours); afficherTableau(r, secours);
    window.UrbanRiskVigilance.dernier = r;
    try { window.dispatchEvent(new CustomEvent("urbanrisk:vigilance", { detail: r })); } catch (e) { /* ancien navigateur */ }
  }

  function lancer() {
    fetch(urlEnsemble())
      .then(function (r) { if (!r.ok) throw new Error("ensemble"); return r.json(); })
      .then(function (j) { var r = analyser(Array.isArray(j) ? j : [j]); publier(r, false); })
      .catch(function () {
        fetch(urlSecours())
          .then(function (r) { if (!r.ok) throw 0; return r.json(); })
          .then(function (j) { var r = analyser(Array.isArray(j) ? j : [j]); publier(r, true); })
          .catch(function () { /* service indisponible : aucun bandeau, aucune fausse alerte */ });
      });
  }

  // Exposé pour les tests et pour la tâche de vigilance
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { analyser: analyser, analyserPoint: analyserPoint, niveauPoint: niveauPoint, urlEnsemble: urlEnsemble };
  } else {
    window.UrbanRiskVigilance = { analyser: analyser, relancer: lancer };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", lancer);
    else lancer();
  }
})();
