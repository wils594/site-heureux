(function () {
  "use strict";

  var CFG = window.HG_CONFIG || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Coordonnées issues de config.js ---------- */
  var waNumber = String(CFG.whatsapp || "").replace(/\D/g, "");
  var phone = String(CFG.telephone || "").trim();
  var phoneDigits = phone.replace(/[^\d+]/g, "");
  var email = String(CFG.email || "").trim();
  var address = String(CFG.adresse || "").trim();
  var mapUrl = String(CFG.carteUrl || "").trim();
  var endpoint = String(CFG.formEndpoint || "").trim();

  function waLink(text) {
    return "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(text);
  }
  function currentService() {
    var s = $("#service");
    return s && s.value ? s.value : "";
  }
  function genericWaMessage() {
    var svc = currentService();
    return "Bonjour Heureux Gagnant, " + (svc ? "je souhaite des informations concernant : " + svc + "." : "je souhaite des informations sur vos services.");
  }

  function setupContacts() {
    var anyDirect = false;
    if (address) { $("#c-adresse").textContent = address + (CFG.ville ? ", " + CFG.ville : ""); }
    else { $("#c-adresse").textContent = CFG.ville || "Lomé, Togo"; }

    if (phone && phoneDigits) {
      var t = $("#c-tel"); t.textContent = phone; t.href = "tel:" + phoneDigits;
      $("#c-tel-li").hidden = false;
      var call = $("#btn-call"); call.href = "tel:" + phoneDigits; call.hidden = false;
      anyDirect = true;
    }
    if (email) {
      var m = $("#c-mail"); m.textContent = email; m.href = "mailto:" + email;
      $("#c-mail-li").hidden = false; anyDirect = true;
    }
    if (waNumber) {
      var wa = $("#btn-whatsapp"); wa.href = waLink(genericWaMessage()); wa.hidden = false; anyDirect = true;
    }
    if (mapUrl) {
      var mp = $("#btn-map"); mp.href = mapUrl; mp.hidden = false;
    }
    if (!anyDirect) $("#contact-unset").hidden = false;

    // Pied de page
    var fc = $("#footer-contact");
    fc.innerHTML = "";
    function li(html) { var l = document.createElement("li"); l.innerHTML = html; fc.appendChild(l); return l; }
    var place = document.createElement("li"); place.textContent = address ? address + (CFG.ville ? ", " + CFG.ville : "") : (CFG.ville || "Lomé, Togo"); fc.appendChild(place);
    if (phone && phoneDigits) { var lt = li(""); var a1 = document.createElement("a"); a1.href = "tel:" + phoneDigits; a1.textContent = phone; lt.appendChild(a1); }
    if (email) { var le = li(""); var a2 = document.createElement("a"); a2.href = "mailto:" + email; a2.textContent = email; le.appendChild(a2); }

    var socials = $("#socials");
    var nets = CFG.reseaux || {};
    var labels = { facebook: "Facebook", instagram: "Instagram", linkedin: "LinkedIn" };
    Object.keys(labels).forEach(function (k) {
      var url = String(nets[k] || "").trim();
      if (!/^https?:\/\//i.test(url)) return;
      var item = document.createElement("li");
      var a = document.createElement("a");
      a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = labels[k];
      item.appendChild(a); socials.appendChild(item);
    });
    if (!socials.children.length) socials.remove();

    $("#annee").textContent = new Date().getFullYear();
  }

  function refreshWaLink() {
    if (!waNumber) return;
    $("#btn-whatsapp").href = waLink(genericWaMessage());
  }

  /* ---------- En-tête et menu mobile ---------- */
  var header = $(".site-header");
  var toggle = $(".menu-toggle");
  var nav = $("#menu");

  function setMenu(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    document.body.style.overflow = open && window.innerWidth <= 900 ? "hidden" : "";
  }
  toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); }
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 900) setMenu(false); });

  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Lien actif selon la section visible
  if ("IntersectionObserver" in window) {
    var links = {};
    $$(".main-nav ul a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.toggle("active", k === en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Apparition au défilement ---------- */
  var reveals = $$(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    // décalage léger entre éléments frères
    $$(".cards, .steps, .why-grid").forEach(function (group) {
      $$(".reveal", group).forEach(function (el, i) { el.style.setProperty("--d", (i * 0.08) + "s"); });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- FAQ (accordéon animé) ---------- */
  $$(".faq-a").forEach(function (p) { p.hidden = false; p.setAttribute("inert", ""); });
  $$(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("open", !open);
      if (open) panel.setAttribute("inert", ""); else panel.removeAttribute("inert");
    });
  });

  /* ---------- Boutons des cartes de service ---------- */
  var form = $("#contact-form");
  var fields = {
    nom: $("#nom"), tel: $("#tel"), email: $("#email"), service: $("#service"), message: $("#message")
  };

  $$("[data-service]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var svc = btn.getAttribute("data-service");
      fields.service.value = svc;
      markValidity(fields.service);
      if (!fields.message.value.trim()) {
        fields.message.value = "Bonjour, je souhaite des informations concernant : " + svc + ".";
      }
      refreshWaLink();
      $("#contact").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      setTimeout(function () { fields.nom.focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
    });
  });
  fields.service.addEventListener("change", refreshWaLink);

  /* ---------- Validation ---------- */
  var rules = {
    nom: function (v) {
      v = v.trim();
      if (!v) return "Veuillez indiquer votre nom.";
      if (v.length < 2) return "Votre nom semble trop court.";
      return "";
    },
    tel: function (v) {
      v = v.trim();
      if (!v) return "Veuillez indiquer un numéro de téléphone.";
      if (!/^[+\d][\d\s().-]*$/.test(v)) return "Utilisez uniquement des chiffres, espaces et le signe +.";
      var d = v.replace(/\D/g, "").length;
      if (d < 8 || d > 15) return "Le numéro doit contenir entre 8 et 15 chiffres.";
      return "";
    },
    email: function (v) {
      v = v.trim();
      if (!v) return "";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Cette adresse e-mail ne semble pas valide.";
    },
    service: function (v) { return v ? "" : "Veuillez choisir le service concerné."; },
    message: function (v) {
      v = v.trim();
      if (!v) return "Veuillez écrire votre message.";
      if (v.length < 10) return "Votre message est un peu court : précisez votre besoin (10 caractères minimum).";
      return "";
    }
  };

  function markValidity(input) {
    var key = Object.keys(fields).filter(function (k) { return fields[k] === input; })[0];
    var err = rules[key](input.value);
    var wrap = input.closest(".field");
    var out = wrap.querySelector(".error");
    out.textContent = err;
    wrap.classList.toggle("invalid", !!err);
    wrap.classList.toggle("valid", !err && input.value.trim() !== "");
    input.setAttribute("aria-invalid", err ? "true" : "false");
    return !err;
  }

  Object.keys(fields).forEach(function (k) {
    var el = fields[k];
    // On ne valide au blur que les champs remplis : évite un décalage de mise en page
    // qui ferait « manquer » le clic sur le bouton d'envoi.
    el.addEventListener("blur", function () { if (el.value.trim() !== "") markValidity(el); });
    el.addEventListener("input", function () { if (el.closest(".field").classList.contains("invalid")) markValidity(el); });
  });

  /* ---------- Envoi ---------- */
  var submitBtn = $("#submit-btn");
  var label = $(".btn-label", submitBtn);
  var status = $("#form-status");

  // Libellé du bouton selon la configuration réelle
  var mode = endpoint ? "endpoint" : (waNumber ? "whatsapp" : "none");
  label.textContent = mode === "whatsapp" ? "Envoyer via WhatsApp" : "Envoyer ma demande";

  function showStatus(type, html) {
    status.innerHTML = "";
    var box = document.createElement("div");
    box.className = "msg " + type;
    box.innerHTML = html;
    status.appendChild(box);
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }

  function composeText() {
    var lines = [
      "Bonjour Heureux Gagnant,",
      "Service concerné : " + fields.service.value,
      "Nom : " + fields.nom.value.trim(),
      "Téléphone : " + fields.tel.value.trim()
    ];
    if (fields.email.value.trim()) lines.push("E-mail : " + fields.email.value.trim());
    lines.push("", fields.message.value.trim());
    return lines.join("\n");
  }

  function setLoading(on) {
    submitBtn.classList.toggle("loading", on);
    submitBtn.setAttribute("aria-busy", String(on));
    submitBtn.disabled = on;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.innerHTML = "";

    var firstInvalid = null;
    Object.keys(fields).forEach(function (k) {
      if (!markValidity(fields[k]) && !firstInvalid) firstInvalid = fields[k];
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    if (mode === "endpoint") {
      setLoading(true);
      var payload = {
        nom: fields.nom.value.trim(),
        telephone: fields.tel.value.trim(),
        email: fields.email.value.trim(),
        service: fields.service.value,
        message: fields.message.value.trim()
      };
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        $$(".field", form).forEach(function (f) { f.classList.remove("valid", "invalid"); });
        showStatus("success", "<strong>Votre message a bien été transmis.</strong><br>Nous reviendrons vers vous afin de préciser les prochaines étapes.");
      }).catch(function () {
        var extra = waNumber ? '<br><a class="btn btn-whatsapp" target="_blank" rel="noopener" href="' + esc(waLink(composeText())) + '">Envoyer plutôt via WhatsApp</a>' : "";
        showStatus("error-box", "<strong>L’envoi n’a pas abouti.</strong><br>Votre message n’a pas été transmis. Vérifiez votre connexion et réessayez." + extra);
      }).then(function () { setLoading(false); });
      return;
    }

    if (mode === "whatsapp") {
      var url = waLink(composeText());
      var win = window.open(url, "_blank", "noopener");
      showStatus("info",
        "<strong>Votre message est prêt dans WhatsApp.</strong><br>Il n’est envoyé qu’une fois que vous appuyez sur « Envoyer » dans WhatsApp." +
        (win ? "" : '<br><a class="btn btn-whatsapp" target="_blank" rel="noopener" href="' + esc(url) + '">Ouvrir WhatsApp</a>'));
      return;
    }

    // Aucun canal configuré : on ne simule pas d'envoi
    var mailto = email ? '<br><a class="btn btn-outline" href="mailto:' + esc(email) + "?subject=" + encodeURIComponent("Demande : " + fields.service.value) + "&body=" + encodeURIComponent(composeText()) + '">Écrire par e-mail</a>' : "";
    showStatus("error-box", "<strong>Le message n’a pas été envoyé.</strong><br>Le formulaire n’est pas encore relié à un canal de réception (WhatsApp ou service d’envoi)." + mailto);
  });

  /* ---------- Boîtes de dialogue ---------- */
  $$("[data-dialog]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var d = document.getElementById(btn.getAttribute("data-dialog"));
      if (d && typeof d.showModal === "function") d.showModal();
    });
  });
  $$("dialog").forEach(function (d) {
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
  });

  setupContacts();
})();
