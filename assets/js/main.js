(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};

  function waLink(text) {
    return "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(text || "");
  }

  // Links de WhatsApp e e-mail a partir do config.js
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.href = waLink(el.getAttribute("data-wa"));
    el.target = "_blank";
    el.rel = "noopener";
    if (el.hasAttribute("data-wa-label") && cfg.whatsappLabel) el.textContent = cfg.whatsappLabel;
  });
  document.querySelectorAll("[data-email]").forEach(function (el) {
    el.href = "mailto:" + cfg.email;
    el.textContent = cfg.email;
  });

  document.getElementById("ano").textContent = new Date().getFullYear();

  // Header com sombra ao rolar
  var header = document.querySelector(".header");
  var toTop = document.getElementById("toTop");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
    toTop.classList.toggle("is-visible", window.scrollY > 700);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menu mobile
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  burger.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // Destaque do item de menu da seção atual + animações de entrada
  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); revealObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el, i) {
      if (el.parentElement.classList.contains("cards") || el.parentElement.classList.contains("steps__list") || el.parentElement.classList.contains("rights__grid")) {
        el.style.transitionDelay = (Array.prototype.indexOf.call(el.parentElement.children, el) % 3) * 0.1 + "s";
      }
      revealObs.observe(el);
    });

    var links = {};
    nav.querySelectorAll('a[href^="#"]:not(.btn)').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var link = links[en.target.id];
        if (link && en.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) navObs.observe(s); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  // FAQ: mantém só um item aberto por vez
  var details = document.querySelectorAll(".accordion details");
  details.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) details.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // Máscara simples de telefone
  var tel = document.getElementById("tel");
  tel.addEventListener("input", function () {
    var v = tel.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) tel.value = "(" + v.slice(0, 2) + ") " + v.slice(2, v.length - 4) + "-" + v.slice(-4);
    else if (v.length > 2) tel.value = "(" + v.slice(0, 2) + ") " + v.slice(2);
    else tel.value = v;
  });

  // Formulário -> WhatsApp
  var form = document.getElementById("form");
  var err = document.getElementById("formError");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = form.nome, area = form.area, lgpd = document.getElementById("lgpd");
    var ok = true;
    [nome, tel, area].forEach(function (f) {
      var bad = !f.value.trim() || (f === tel && f.value.replace(/\D/g, "").length < 10);
      f.classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    if (!lgpd.checked) ok = false;
    err.hidden = ok;
    if (!ok) return;

    var texto =
      "Olá, Dra. Letícia! Vim pelo site.\n\n" +
      "*Nome:* " + nome.value.trim() + "\n" +
      "*Telefone:* " + tel.value.trim() + "\n" +
      "*Assunto:* " + area.value + "\n" +
      (form.msg.value.trim() ? "*Resumo:* " + form.msg.value.trim() : "");
    window.open(waLink(texto), "_blank", "noopener");
  });
})();
