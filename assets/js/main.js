(function () {
  "use strict";

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
