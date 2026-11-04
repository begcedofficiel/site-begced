/*
 * Mbongo Nzela – module « Liquidité des villages » (prototype, novembre 2026)
 * BEGCED – « De la donnée à l'action »
 *
 * Ce module ajoute au prototype ce que le projet Interledger décrit :
 * un agent de monnaie mobile SIGNALE un manque de liquidité (pas assez de
 * cash, ou pas assez d'unités électroniques), et chacun voit l'état du jour
 * village par village, pour être orienté vers un agent qui peut servir.
 *
 * Principes :
 *  - aucun argent ne circule, aucun code PIN, aucun numéro de compte demandé ;
 *  - fonctionne sans connexion : les signalements restent sur le téléphone
 *    (stockage du navigateur) et partent par SMS ou WhatsApp quand il y a du réseau ;
 *  - un signalement vieux de plus de 6 h est affiché « à confirmer ».
 * Pendant la phase pilote, les signalements arrivent sur le WhatsApp BEGCED ;
 * une base de données partagée pourra être branchée plus tard sans changer l'écran.
 *
 * Utilisation : <div id="mn-liquidite"></div> dans mbongo-nzela.html, puis ce script.
 * Sans ce bloc, le module se place automatiquement avant le pied de page.
 */
(function () {
  "use strict";
  var NUMERO_BEGCED = "243898929192";
  // Base partagée BEGCED (Supabase). Clé « publishable » : publique par conception,
  // les règles de la base n'autorisent que l'envoi d'un état et la lecture des 48 dernières heures.
  var BASE = "https://dznfdcpwkgjmdcfqblkh.supabase.co/rest/v1/mn_signalements";
  var CLE_PUB = "sb_publishable_Wbr8rCL0uVgcj0JSZJlA-g_hN-qczEA";
  var ENTETES = { apikey: CLE_PUB, "Content-Type": "application/json" };
  var FILE = "mbongo-nzela-a-envoyer-v1";
  var partages = [];
  var CLE = "mbongo-nzela-signalements-v1";
  var VALIDITE_H = 6;
  var VILLAGES = [
    { nom: "Dongo", zone: "Secteur de Dongo" },
    { nom: "Imesse", zone: "Secteur de Dongo" },
    { nom: "Inyele", zone: "Secteur de Dongo" },
    { nom: "Bokona", zone: "Secteur de Dongo" },
    { nom: "Gemena", zone: "Ville (corridor)" },
    { nom: "Kinshasa", zone: "Ville (corridor)" }
  ];
  var RESEAUX = ["M-Pesa (Vodacom)", "Orange Money", "Airtel Money", "Afrimoney"];
  var ETATS = {
    ok: { txt: "Peut servir", coul: "#1b8a3a" },
    cash: { txt: "Manque de cash", coul: "#d97706" },
    unites: { txt: "Manque d'unités électroniques", coul: "#d97706" },
    rien: { txt: "Ne peut pas servir", coul: "#c62828" }
  };

  function lire() {
    try { return JSON.parse(localStorage.getItem(CLE) || "[]"); } catch (e) { return []; }
  }
  function ecrire(liste) {
    try { localStorage.setItem(CLE, JSON.stringify(liste.slice(-200))); } catch (e) { /* stockage bloqué */ }
  }
  function echapper(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function ilYa(iso) {
    var min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (min < 60) return "il y a " + Math.max(min, 1) + " min";
    var h = Math.round(min / 60);
    return h < 48 ? "il y a " + h + " h" : "il y a " + Math.round(h / 24) + " j";
  }

  function lireFile() { try { return JSON.parse(localStorage.getItem(FILE) || "[]"); } catch (e) { return []; } }
  function ecrireFile(l) { try { localStorage.setItem(FILE, JSON.stringify(l.slice(-50))); } catch (e) { /* bloqué */ } }

  // Envoie à la base partagée ; sans réseau, garde en file et réessaie au retour du réseau
  function envoyer(s) {
    var corps = { village: s.village, reseau: s.reseau, etat: s.etat, besoin: s.besoin ? parseInt(s.besoin, 10) : null };
    return fetch(BASE, { method: "POST", headers: ENTETES, body: JSON.stringify(corps) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return true; });
  }
  function viderFile(apres) {
    var file = lireFile(); if (!file.length) return;
    var reste = [];
    Promise.all(file.map(function (s) { return envoyer(s).catch(function () { reste.push(s); }); }))
      .then(function () { ecrireFile(reste); if (apres) apres(); });
  }
  function chargerPartages(apres) {
    var depuis = new Date(Date.now() - 48 * 3600e3).toISOString();
    fetch(BASE + "?select=village,reseau,etat,besoin,cree_le&cree_le=gt." + encodeURIComponent(depuis) +
      "&order=cree_le.desc&limit=300", { headers: { apikey: CLE_PUB } })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (rows) {
        partages = rows.map(function (x) { return { village: x.village, reseau: x.reseau, etat: x.etat, iso: x.cree_le, partage: true }; });
        if (apres) apres();
      })
      .catch(function () { /* hors ligne : on garde l'affichage local */ });
  }

  // Message court : moins de 160 caractères pour tenir dans un SMS
  function messageSMS(s) {
    return ("MN " + s.village + " " + s.reseau.split(" ")[0] + " " + ETATS[s.etat].txt +
      (s.besoin ? " besoin " + s.besoin + " FC" : "") + " " + s.heure).slice(0, 160);
  }

  function html() {
    return "" +
      "<section class='section mn-liq' style='padding:24px 0'><div class='wrap'>" +
      "<p class='eyebrow'>Phase pilote · secteur de Dongo</p>" +
      "<h2>Liquidité des villages</h2>" +
      "<p>Les agents de Dongo, Imesse, Inyele et Bokona indiquent s'ils peuvent servir les clients. " +
      "Un client sait ainsi où aller avant de faire le trajet. <strong>Aucun argent ne passe par ce service. " +
      "BEGCED ne demande jamais votre code PIN.</strong></p>" +
      "<div class='mn-grille' style='display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))'>" +
      "<form class='card mn-form' style='padding:16px'>" +
      "<h3 style='margin-top:0'>Je suis agent : je signale mon état</h3>" +
      "<label>Village<br><select name='village' required>" +
      VILLAGES.map(function (v) { return "<option>" + v.nom + "</option>"; }).join("") + "</select></label><br>" +
      "<label>Réseau<br><select name='reseau' required>" +
      RESEAUX.map(function (r) { return "<option>" + r + "</option>"; }).join("") + "</select></label><br>" +
      "<label>Mon état maintenant<br><select name='etat' required>" +
      Object.keys(ETATS).map(function (k) { return "<option value='" + k + "'>" + ETATS[k].txt + "</option>"; }).join("") +
      "</select></label><br>" +
      "<label>Montant qui manque (FC, facultatif)<br><input name='besoin' type='number' min='0' step='1000' inputmode='numeric'></label><br>" +
      "<button type='submit' class='btn' style='margin-top:8px'>Enregistrer et envoyer</button>" +
      "<p class='mn-envoi' style='font-size:13px;margin:8px 0 0'></p>" +
      "</form>" +
      "<div class='card' style='padding:16px'>" +
      "<h3 style='margin-top:0'>État des villages aujourd'hui</h3>" +
      "<div class='mn-tableau'></div>" +
      "<p style='font-size:12px;opacity:.75'>Phase pilote : signalements partagés par les agents des 48 dernières heures. Au-delà de " + VALIDITE_H + " h, l'état est « à confirmer ».</p>" +
      "</div></div></div></section>";
  }

  function dessinerTableau(racine) {
    var liste = lire().concat(partages);
    var lignes = VILLAGES.map(function (v) {
      var derniers = liste.filter(function (s) { return s.village === v.nom; })
        .sort(function (a, b) { return b.iso.localeCompare(a.iso); });
      var d = derniers[0];
      var etat = d ? ETATS[d.etat] : null;
      var vieux = d && (Date.now() - new Date(d.iso).getTime()) > VALIDITE_H * 3600e3;
      return "<tr><td><strong>" + v.nom + "</strong><br><small>" + v.zone + "</small></td><td>" +
        (d ? "<span style='color:" + (vieux ? "#666" : etat.coul) + ";font-weight:600'>" + etat.txt +
          (vieux ? " (à confirmer)" : "") + "</span><br><small>" + echapper(d.reseau) + " · " + ilYa(d.iso) + "</small>"
          : "<small>Pas encore de signalement</small>") +
        "</td></tr>";
    }).join("");
    racine.querySelector(".mn-tableau").innerHTML =
      "<table style='width:100%;border-collapse:collapse;font-size:14px'>" + lignes + "</table>";
  }

  function monter() {
    var racine = document.getElementById("mn-liquidite");
    if (!racine) {
      racine = document.createElement("div");
      racine.id = "mn-liquidite";
      var pied = document.querySelector("footer");
      if (pied && pied.parentNode) pied.parentNode.insertBefore(racine, pied); else document.body.appendChild(racine);
    }
    racine.innerHTML = html();
    dessinerTableau(racine);
    function rafraichir() { chargerPartages(function () { dessinerTableau(racine); }); }
    viderFile(rafraichir);
    rafraichir();
    window.addEventListener("online", function () { viderFile(rafraichir); });
    setInterval(rafraichir, 5 * 60 * 1000);

    racine.querySelector(".mn-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target;
      var maintenant = new Date();
      var s = {
        village: f.village.value, reseau: f.reseau.value, etat: f.etat.value,
        besoin: f.besoin.value ? String(Math.max(0, parseInt(f.besoin.value, 10) || 0)) : "",
        iso: maintenant.toISOString(),
        heure: maintenant.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Kinshasa" })
      };
      var liste = lire(); liste.push(s); ecrire(liste);
      dessinerTableau(racine);
      var msg = messageSMS(s);
      var zone = racine.querySelector(".mn-envoi");
      envoyer(s).then(function () {
        zone.insertAdjacentHTML("afterbegin", "<strong style='color:#1b8a3a'>Partagé avec tous les villages.</strong> ");
        chargerPartages(function () { dessinerTableau(racine); });
      }).catch(function () {
        var file = lireFile(); file.push(s); ecrireFile(file);
        zone.insertAdjacentHTML("afterbegin", "<strong>Pas de réseau : partage automatique au retour d'internet.</strong> ");
      });
      zone.innerHTML =
        "Enregistré sur ce téléphone. Prévenir aussi BEGCED : " +
        "<a href='https://wa.me/" + NUMERO_BEGCED + "?text=" + encodeURIComponent(msg) + "' target='_blank' rel='noopener'>WhatsApp</a> ou " +
        "<a href='sms:+" + NUMERO_BEGCED + "?body=" + encodeURIComponent(msg) + "'>SMS</a> (sans internet).";
    });
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { messageSMS: messageSMS, ETATS: ETATS, VILLAGES: VILLAGES };
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", monter);
  } else { monter(); }
})();
