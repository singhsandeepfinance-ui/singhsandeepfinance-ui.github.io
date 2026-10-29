(function () {
  "use strict";

  /* ---------- Light / dark theme ---------- */
  var root = document.documentElement;
  var themeBtn = document.querySelector(".theme-toggle");
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return mq && mq.matches ? "dark" : "light";
  }
  function labelTheme() {
    if (!themeBtn) return;
    var dark = currentTheme() === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    themeBtn.setAttribute("data-current", dark ? "dark" : "light");
  }
  if (themeBtn) {
    labelTheme();
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      labelTheme();
      window.dispatchEvent(new Event("resize")); // let charts redraw in the new colours
    });
    if (mq && mq.addEventListener) mq.addEventListener("change", labelTheme);
  }

  /* ---------- Reading progress + contents list on articles ---------- */
  var bar = document.querySelector(".read-progress span");
  var prose = document.querySelector(".post .prose");
  if (bar && prose) {
    var onScroll = function () {
      var rect = prose.getBoundingClientRect();
      var total = rect.height - window.innerHeight * 0.6;
      var done = Math.min(Math.max(-rect.top + window.innerHeight * 0.2, 0), Math.max(total, 1));
      bar.style.transform = "scaleX(" + (done / Math.max(total, 1)) + ")";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  var toc = document.querySelector(".toc");
  if (toc && prose) {
    var heads = prose.querySelectorAll("h2");
    if (heads.length >= 3) {
      var list = toc.querySelector("ol");
      heads.forEach(function (h, i) {
        if (!h.id) h.id = "section-" + (i + 1) + "-" + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        list.appendChild(li);
      });
      toc.hidden = false;
    }
  }

  /* ---------- Glossary search ---------- */
  var gInput = document.querySelector("[data-glossary-search]");
  if (gInput) {
    var termsEl = document.getElementById("terms");
    var gEmpty = document.querySelector("[data-glossary-empty]");
    gInput.addEventListener("input", function () {
      var q = gInput.value.trim().toLowerCase();
      var shown = 0, children = Array.prototype.slice.call(termsEl.children);
      children.forEach(function (node) {
        if (node.hasAttribute("data-letter")) return;
        var ok = !q || node.getAttribute("data-search").indexOf(q) !== -1;
        node.hidden = !ok;
        if (ok) shown++;
      });
      // hide letter headings with no visible terms after them
      children.forEach(function (node, i) {
        if (!node.hasAttribute("data-letter")) return;
        var any = false;
        for (var j = i + 1; j < children.length && !children[j].hasAttribute("data-letter"); j++) {
          if (!children[j].hidden) { any = true; break; }
        }
        node.hidden = !any;
      });
      gEmpty.hidden = shown !== 0;
    });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Filter chips + search (Blog and PDF library) ---------- */
  document.querySelectorAll("[data-filter-list]").forEach(function (bar) {
    var list = document.getElementById(bar.getAttribute("data-filter-list"));
    if (!list) return;
    var attr = list.getAttribute("data-attr");
    var items = Array.prototype.slice.call(list.children);
    var chips = bar.querySelectorAll("[data-filter]");
    var input = bar.querySelector("[data-search-input]");
    var empty = list.parentNode.querySelector("[data-empty]");
    var current = "all";

    function apply() {
      var q = input ? input.value.trim().toLowerCase() : "";
      var shown = 0;
      items.forEach(function (li) {
        var okFilter = current === "all" || li.getAttribute("data-" + attr) === current;
        var okSearch = !q || (li.getAttribute("data-search") || "").indexOf(q) !== -1;
        var show = okFilter && okSearch;
        li.hidden = !show;
        if (show) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    }

    function select(value) {
      current = value;
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", c.getAttribute("data-filter") === value ? "true" : "false");
      });
      apply();
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var value = chip.getAttribute("data-filter");
        select(value);
        try {
          var url = new URL(window.location.href);
          if (value === "all") url.searchParams.delete(attr); else url.searchParams.set(attr, value);
          history.replaceState(null, "", url);
        } catch (e) {}
      });
    });
    if (input) input.addEventListener("input", apply);

    // Open a topic directly from a link such as /blog/?topic=markets
    try {
      var fromUrl = new URL(window.location.href).searchParams.get(attr);
      if (fromUrl && bar.querySelector('[data-filter="' + fromUrl + '"]')) select(fromUrl);
    } catch (e) {}
  });

  /* ---------- SIP calculator ---------- */
  var sip = document.getElementById("sip");
  if (sip) {
    var amount = document.getElementById("sip-amount");
    var years = document.getElementById("sip-years");
    var rate = document.getElementById("sip-rate");
    var inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

    function words(n) {
      if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2) + " crore";
      if (n >= 1e5) return "₹" + (n / 1e5).toFixed(1) + " lakh";
      return "₹" + inr.format(Math.round(n));
    }

    function update() {
      var p = Number(amount.value);
      var y = Number(years.value);
      var annual = Number(rate.value);
      var r = annual / 12 / 100;
      var n = y * 12;
      // Future value of a monthly SIP, with each instalment made at the start of the month.
      var fv = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      var invested = p * n;
      var growth = Math.max(fv - invested, 0);

      document.getElementById("sip-amount-out").textContent = "₹" + inr.format(p);
      document.getElementById("sip-years-out").textContent = y + (y === 1 ? " year" : " years");
      document.getElementById("sip-rate-out").textContent = annual + "%";
      document.getElementById("sip-total").textContent = words(fv);
      document.getElementById("sip-invested").textContent = words(invested);
      document.getElementById("sip-growth").textContent = words(growth);
      var share = fv > 0 ? (invested / fv) * 100 : 100;
      document.getElementById("sip-bar-invested").style.width = share + "%";
      document.getElementById("sip-bar-growth").style.width = (100 - share) + "%";
    }

    [amount, years, rate].forEach(function (el) { el.addEventListener("input", update); });
    update();
  }

  /* ---------- Copy link button on articles ---------- */
  document.querySelectorAll(".copy-link").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var url = btn.getAttribute("data-url") || window.location.href;
      var done = function () {
        btn.textContent = "Link copied";
        setTimeout(function () { btn.textContent = "Copy link"; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { window.prompt("Copy this link:", url); });
      } else {
        window.prompt("Copy this link:", url);
      }
    });
  });
})();
