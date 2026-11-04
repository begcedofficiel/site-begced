/*
 * UrbanRisk Mont-Ngafula – « Météo en direct » sur la carte (novembre 2026)
 * BEGCED – « De la donnée à l'action »
 *
 * Ajoute à la carte Leaflet existante trois couches gratuites mises à jour en continu :
 *  - Nuages en direct : Meteosat (EUMETSAT), canal infrarouge, toutes les 15 min.
 *    Les nuages d'orage apparaissent très froids (blancs), avant même la pluie.
 *  - Orages en direct : produit « Rapidly Developing Thunderstorms » de Meteosat,
 *    toutes les 15 min : cellules orageuses qui se forment ou grossissent.
 *  - Pluie mesurée par satellite : NASA GPM IMERG (estimation toutes les 30 min,
 *    disponible avec environ 4 à 6 h de retard). C'est la pluie réellement tombée.
 * Et un bouton « Signaler une inondation » qui ouvre WhatsApp BEGCED avec la
 * position (si la personne l'accepte) : aucune donnée n'est stockée par le site.
 *
 * Limite honnête : ces couches montrent les nuages et la pluie, pas les véhicules
 * ni les personnes. Aucun satellite public ne filme en continu.
 *
 * Utilisation : charger ce fichier APRÈS leaflet.js et après la création de la carte.
 * Il trouve la carte tout seul ; on peut aussi appeler UrbanRiskDirect.ajouter(maCarte).
 */
(function () {
  "use strict";
  var WHATSAPP = "243898929192";
  var RAFRAICHIR_MIN = 10;

  function trouverCarte() {
    if (!window.L || !L.Map) return null;
    for (var k in window) {
      try { if (window[k] instanceof L.Map) return window[k]; } catch (e) { /* propriété protégée */ }
    }
    return null;
  }

  function couches() {
    var eumet = "https://view.eumetsat.int/geoserver/ows";
    var attrE = "Meteosat © EUMETSAT";
    return {
      nuages: L.tileLayer.wms(eumet, {
        layers: "msg_fes:ir108", format: "image/png", transparent: true,
        opacity: 0.55, attribution: attrE, version: "1.3.0"
      }),
      orages: L.tileLayer.wms(eumet, {
        layers: "msg_fes:rdt", format: "image/png", transparent: true,
        opacity: 0.9, attribution: attrE, version: "1.3.0"
      }),
      pluie: L.tileLayer.wms("https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi", {
        layers: "IMERG_Precipitation_Rate", format: "image/png", transparent: true,
        opacity: 0.75, attribution: "Pluie GPM IMERG © NASA GIBS", version: "1.3.0"
      })
    };
  }

  function heureKin(d) {
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Kinshasa" });
  }

  function lienSignalement(lat, lon) {
    var txt = "Signalement UrbanRisk – inondation / érosion à Mont-Ngafula.\n" +
      "Quartier / avenue : \nCe que je vois (eau dans la rue, maison touchée, ravine qui avance) : \n" +
      (lat ? "Position : https://www.openstreetmap.org/?mlat=" + lat.toFixed(5) + "&mlon=" + lon.toFixed(5) + "#map=17/" + lat.toFixed(5) + "/" + lon.toFixed(5) + "\n" : "") +
      "Je joins une photo si possible.";
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(txt);
  }

  function ajouter(carte) {
    carte = carte || trouverCarte();
    if (!carte) return false;
    var c = couches();
    var actives = {};

    var Panneau = L.Control.extend({
      options: { position: "topright" },
      onAdd: function () {
        var div = L.DomUtil.create("div", "ur-direct");
        div.style.cssText = "background:#fff;color:#0A2A66;padding:8px 10px;border-radius:8px;" +
          "box-shadow:0 1px 6px rgba(0,0,0,.3);font:13px/1.45 system-ui,sans-serif;max-width:230px";
        div.innerHTML =
          "<strong>Météo en direct</strong>" +
          "<label style='display:block'><input type='checkbox' data-c='nuages'> Nuages (Meteosat, 15 min)</label>" +
          "<label style='display:block'><input type='checkbox' data-c='orages'> Orages qui se forment</label>" +
          "<label style='display:block'><input type='checkbox' data-c='pluie'> Pluie tombée (NASA, 30 min)</label>" +
          "<small class='ur-maj' style='display:block;opacity:.75'>Images actualisées toutes les " + RAFRAICHIR_MIN + " min</small>" +
          "<a class='ur-signal' href='" + lienSignalement() + "' target='_blank' rel='noopener' " +
          "style='display:block;margin-top:6px;background:#25D366;color:#fff;text-align:center;padding:5px;border-radius:6px;text-decoration:none;font-weight:600'>" +
          "Signaler une inondation</a>";
        L.DomEvent.disableClickPropagation(div);
        div.querySelectorAll("input[data-c]").forEach(function (box) {
          box.addEventListener("change", function () {
            var nom = box.getAttribute("data-c");
            if (box.checked) { c[nom].addTo(carte); actives[nom] = true; }
            else { carte.removeLayer(c[nom]); delete actives[nom]; }
          });
        });
        var lien = div.querySelector(".ur-signal");
        lien.addEventListener("click", function (e) {
          if (!navigator.geolocation) return;
          e.preventDefault();
          navigator.geolocation.getCurrentPosition(
            function (p) { window.open(lienSignalement(p.coords.latitude, p.coords.longitude), "_blank", "noopener"); },
            function () { window.open(lienSignalement(), "_blank", "noopener"); },
            { timeout: 8000 }
          );
        });
        this._maj = div.querySelector(".ur-maj");
        return div;
      }
    });
    var panneau = new Panneau().addTo(carte);

    setInterval(function () {
      Object.keys(actives).forEach(function (nom) { c[nom].setParams({ _t: Date.now() }); });
      if (panneau._maj) panneau._maj.textContent = "Dernière actualisation : " + heureKin(new Date());
    }, RAFRAICHIR_MIN * 60 * 1000);
    return true;
  }

  window.UrbanRiskDirect = { ajouter: ajouter };
  function auto() { if (!ajouter()) setTimeout(function () { ajouter(); }, 1500); }
  if (document.readyState === "complete") auto(); else window.addEventListener("load", auto);
})();
