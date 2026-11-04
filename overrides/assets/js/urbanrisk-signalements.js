/*
 * UrbanRisk Mont-Ngafula – « Inondations signalées » (novembre 2026)
 * BEGCED – « De la donnée à l'action »
 *
 * Les habitants signalent une inondation ou une ravine, avec une photo, à l'endroit
 * exact. La carte montre tout de suite le point (type, date) ; le texte et la photo
 * n'apparaissent qu'après vérification par BEGCED (champ « valide » dans la base).
 * Aucun nom ni numéro de téléphone n'est demandé.
 *
 * Base : Supabase « begced-donnees-publiques ». Les clés ci-dessous sont des clés
 * publiques (anon / publishable), faites pour être dans une page web ; les règles
 * de la base limitent ce qu'elles permettent (envoyer un signalement, lire la liste).
 */
(function () {
  "use strict";
  var URL_BASE = "https://dznfdcpwkgjmdcfqblkh.supabase.co";
  var CLE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6bmZkY3B3a2dqbWRjZnFibGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NDUzNjEsImV4cCI6MjEwOTMyMTM2MX0.tm40vfqXKs-RdyFIlu8Zoyn0WTDUsHDotJJ2vFjOEnY";
  var ENTETES = { apikey: CLE_ANON, Authorization: "Bearer " + CLE_ANON };
  var BOITE = { latMin: -4.75, latMax: -4.25, lonMin: 15.05, lonMax: 15.55 };
  var TYPES = { inondation: "Inondation", erosion: "Érosion / ravine", autre: "Autre danger" };
  var COULEURS = { inondation: "#1565c0", erosion: "#8d4e1a", autre: "#6a1b9a" };

  var carte = null, couche = null, choixPosition = null, marqueurChoix = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function dateKin(iso) {
    return new Date(iso).toLocaleString("fr-FR", { timeZone: "Africa/Kinshasa", weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16);
    });
  }
  function dansZone(lat, lon) {
    return lat >= BOITE.latMin && lat <= BOITE.latMax && lon >= BOITE.lonMin && lon <= BOITE.lonMax;
  }

  // Réduit la photo (1600 px max, JPEG) pour passer sur un réseau lent
  function compresser(fichier) {
    return new Promise(function (ok, ko) {
      var img = new Image(), url = URL.createObjectURL(fichier);
      img.onload = function () {
        var max = 1600, w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, max / Math.max(w, h));
        var c = document.createElement("canvas"); c.width = Math.round(w * k); c.height = Math.round(h * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? ok(b) : ko(new Error("photo")); }, "image/jpeg", 0.8);
      };
      img.onerror = function () { URL.revokeObjectURL(url); ko(new Error("photo")); };
      img.src = url;
    });
  }

  function charger() {
    if (!couche) return;
    fetch(URL_BASE + "/rest/v1/rpc/ur_signalements_publics", {
      method: "POST", headers: Object.assign({ "Content-Type": "application/json" }, ENTETES), body: "{}"
    }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (liste) {
      couche.clearLayers();
      liste.forEach(function (s) {
        var html = "<strong>" + esc(TYPES[s.type] || s.type) + "</strong><br><small>" + esc(dateKin(s.cree_le)) + "</small>";
        if (s.valide) {
          if (s.quartier) html += "<br>" + esc(s.quartier);
          if (s.description) html += "<br>" + esc(s.description);
          if (s.photo) html += "<br><a href='" + URL_BASE + "/storage/v1/object/public/signalements/" + encodeURIComponent(s.photo) +
            "' target='_blank' rel='noopener'><img src='" + URL_BASE + "/storage/v1/object/public/signalements/" + encodeURIComponent(s.photo) +
            "' alt='Photo du signalement' style='max-width:220px;margin-top:6px;border-radius:6px'></a>";
          html += "<br><small style='color:#1b8a3a'>Vérifié par BEGCED</small>";
        } else {
          html += "<br><small>En attente de vérification par BEGCED</small>";
        }
        L.circleMarker([Number(s.lat), Number(s.lon)], {
          radius: 8, color: "#fff", weight: 2, fillColor: COULEURS[s.type] || "#1565c0",
          fillOpacity: s.valide ? 0.95 : 0.55
        }).bindPopup(html).addTo(couche);
      });
    }).catch(function () { /* service indisponible : la carte reste utilisable */ });
  }

  function envoyer(donnees, photo) {
    var envoiPhoto = Promise.resolve(null);
    if (photo) {
      var nom = uuid() + ".jpg";
      envoiPhoto = compresser(photo).then(function (blob) {
        return fetch(URL_BASE + "/storage/v1/object/signalements/" + nom, {
          method: "POST", headers: Object.assign({ "Content-Type": "image/jpeg", "x-upsert": "false" }, ENTETES), body: blob
        });
      }).then(function (r) { if (!r.ok) throw new Error("photo"); return nom; });
    }
    return envoiPhoto.then(function (nomPhoto) {
      donnees.photo = nomPhoto;
      return fetch(URL_BASE + "/rest/v1/ur_signalements", {
        method: "POST",
        headers: Object.assign({ "Content-Type": "application/json", Prefer: "return=minimal" }, ENTETES),
        body: JSON.stringify(donnees)
      });
    }).then(function (r) { if (!r.ok) throw new Error("envoi"); });
  }

  function formulaire() {
    var f = document.createElement("div");
    f.className = "ur-sig";
    f.setAttribute("role", "dialog");
    f.setAttribute("aria-label", "Signaler une inondation");
    f.style.cssText = "position:fixed;inset:auto 12px 12px 12px;max-width:420px;margin:auto;z-index:2000;background:#fff;color:#0A2A66;" +
      "border-radius:12px;box-shadow:0 6px 30px rgba(0,0,0,.35);padding:14px 16px;font:14px/1.45 system-ui,sans-serif;max-height:85vh;overflow:auto";
    f.innerHTML =
      "<div style='display:flex;justify-content:space-between;align-items:center'><strong style='font-size:16px'>Signaler une inondation</strong>" +
      "<button type='button' class='ur-x' aria-label='Fermer' style='border:0;background:none;font-size:22px;cursor:pointer'>×</button></div>" +
      "<form>" +
      "<label style='display:block;margin-top:8px'>Ce que je vois<br><select name='type' required style='width:100%'>" +
      Object.keys(TYPES).map(function (k) { return "<option value='" + k + "'>" + TYPES[k] + "</option>"; }).join("") + "</select></label>" +
      "<div style='margin-top:8px'>Endroit : <span class='ur-pos'>pas encore choisi</span><br>" +
      "<button type='button' class='btn ur-gps' style='margin-top:4px'>📍 Ma position</button> " +
      "<button type='button' class='btn ur-clic' style='margin-top:4px'>Toucher la carte</button></div>" +
      "<label style='display:block;margin-top:8px'>Quartier / avenue (facultatif)<br><input name='quartier' maxlength='80' style='width:100%'></label>" +
      "<label style='display:block;margin-top:8px'>Description (facultatif)<br><textarea name='description' maxlength='500' rows='2' style='width:100%' placeholder='Eau dans la rue, maison touchée, ravine qui avance…'></textarea></label>" +
      "<label style='display:block;margin-top:8px'>Photo (facultatif, de l'eau ou de la ravine, pas des personnes)<br><input name='photo' type='file' accept='image/*' capture='environment'></label>" +
      "<button type='submit' class='btn' style='margin-top:10px;width:100%;background:#1565c0;color:#fff'>Envoyer le signalement</button>" +
      "<p class='ur-etat' style='margin:8px 0 0;font-size:13px'></p>" +
      "<p style='margin:6px 0 0;font-size:12px;opacity:.75'>Aucun nom ni numéro demandé. Le point apparaît tout de suite sur la carte ; " +
      "le texte et la photo après vérification par BEGCED. En cas de danger immédiat, appelez les secours.</p>" +
      "</form>";
    document.body.appendChild(f);

    var pos = null, etat = f.querySelector(".ur-etat");
    function placer(lat, lon, source) {
      if (!dansZone(lat, lon)) { etat.textContent = "Cet endroit est hors de la zone couverte (Mont-Ngafula et alentours)."; return; }
      pos = { lat: Math.round(lat * 1e4) / 1e4, lon: Math.round(lon * 1e4) / 1e4 };
      f.querySelector(".ur-pos").textContent = source + " (" + pos.lat.toFixed(4) + ", " + pos.lon.toFixed(4) + ")";
      if (marqueurChoix) carte.removeLayer(marqueurChoix);
      marqueurChoix = L.marker([pos.lat, pos.lon]).addTo(carte);
      etat.textContent = "";
    }
    function fermer() {
      if (marqueurChoix) { carte.removeLayer(marqueurChoix); marqueurChoix = null; }
      choixPosition = null; f.remove();
    }
    f.querySelector(".ur-x").addEventListener("click", fermer);
    f.querySelector(".ur-gps").addEventListener("click", function () {
      if (!navigator.geolocation) { etat.textContent = "Localisation indisponible : touchez la carte."; return; }
      etat.textContent = "Recherche de votre position…";
      navigator.geolocation.getCurrentPosition(function (p) { placer(p.coords.latitude, p.coords.longitude, "ma position"); },
        function () { etat.textContent = "Position refusée : touchez la carte à la place."; }, { enableHighAccuracy: true, timeout: 15000 });
    });
    f.querySelector(".ur-clic").addEventListener("click", function () {
      etat.textContent = "Touchez l'endroit sur la carte.";
      f.style.opacity = "0.35";
      choixPosition = function (lat, lon) { f.style.opacity = "1"; placer(lat, lon, "point choisi"); choixPosition = null; };
    });
    f.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      if (!pos) { etat.textContent = "Choisissez d'abord l'endroit (ma position ou toucher la carte)."; return; }
      var form = e.target, bouton = form.querySelector("button[type=submit]");
      bouton.disabled = true; etat.textContent = "Envoi en cours…";
      envoyer({
        type: form.type.value, lat: pos.lat, lon: pos.lon,
        quartier: form.quartier.value.trim() || null, description: form.description.value.trim() || null
      }, form.photo.files[0] || null).then(function () {
        etat.innerHTML = "<strong style='color:#1b8a3a'>Merci, signalement envoyé.</strong>";
        charger();
        setTimeout(fermer, 2500);
      }).catch(function () {
        bouton.disabled = false;
        etat.innerHTML = "Envoi impossible (réseau ?). Réessayez, ou envoyez la photo sur " +
          "<a href='https://wa.me/243898929192' target='_blank' rel='noopener'>WhatsApp BEGCED</a>.";
      });
    });
  }

  function installer(c) {
    carte = c || window.urMap;
    if (!carte || couche) return !!couche;
    couche = L.layerGroup().addTo(carte);
    carte.on("click", function (e) { if (choixPosition) { L.DomEvent.stop(e); choixPosition(e.latlng.lat, e.latlng.lng); } });
    charger();
    setInterval(charger, 5 * 60 * 1000);
    return true;
  }

  window.UrbanRiskSignalements = {
    ouvrir: function () { if (installer()) formulaire(); },
    couche: function () { return couche; },
    choixEnCours: function () { return !!choixPosition; }
  };
  function auto() { if (!installer()) setTimeout(installer, 1500); }
  if (document.readyState === "complete") auto(); else window.addEventListener("load", auto);
})();
