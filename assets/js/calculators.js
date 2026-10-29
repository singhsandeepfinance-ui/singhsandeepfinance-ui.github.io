(function () {
  "use strict";

  var inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

  // ₹ in words: ₹8.2 lakh, ₹1.32 crore, ₹45,000
  function money(n) {
    var a = Math.abs(n);
    if (a >= 1e7) return "₹" + (n / 1e7).toFixed(2) + " crore";
    if (a >= 1e5) return "₹" + (n / 1e5).toFixed(1) + " lakh";
    return "₹" + inr.format(Math.round(n));
  }
  // Short axis label: ₹50L, ₹1.5Cr, ₹20K
  function short(n) {
    if (n >= 1e7) return "₹" + +(n / 1e7).toFixed(1) + "Cr";
    if (n >= 1e5) return "₹" + +(n / 1e5).toFixed(1) + "L";
    if (n >= 1e3) return "₹" + +(n / 1e3).toFixed(0) + "K";
    return "₹" + Math.round(n);
  }
  function full(n) { return "₹" + inr.format(Math.round(n)); }

  function val(id) {
    var el = document.getElementById(id);
    var v = parseFloat(el.value);
    return isNaN(v) ? parseFloat(el.min) : v;
  }
  function out(key, text) {
    document.querySelectorAll('[data-out="' + key + '"]').forEach(function (el) { el.textContent = text; });
  }

  /* ---------------- Calculations ---------------- */

  function calcSip() {
    var p = val("sip-p"), y = val("sip-y"), r = val("sip-r") / 1200, s = val("sip-s") / 100;
    var bal = 0, inv = 0, rows = [], monthly = p;
    for (var yr = 1; yr <= y; yr++) {
      for (var m = 0; m < 12; m++) {
        bal = (bal + monthly) * (1 + r); // instalment at the start of each month
        inv += monthly;
      }
      rows.push([yr, inv, bal - inv, bal]);
      monthly = monthly * (1 + s);
    }
    out("sip-total", money(bal));
    out("sip-invested", money(inv));
    out("sip-growth", money(bal - inv));
    draw("sip", rows);
  }

  function calcLump() {
    var p = val("lump-p"), y = val("lump-y"), r = val("lump-r") / 100;
    var rows = [], v = p;
    for (var yr = 1; yr <= y; yr++) { v = v * (1 + r); rows.push([yr, p, v - p, v]); }
    out("lump-total", money(v));
    out("lump-invested", money(p));
    out("lump-growth", money(v - p));
    draw("lump", rows);
  }

  function calcEmi() {
    var p = val("emi-p"), r = val("emi-r") / 1200, n = val("emi-y") * 12;
    var emi = r === 0 ? p / n : p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    var bal = p, rows = [], yp = 0, yi = 0;
    for (var m = 1; m <= n; m++) {
      var interest = bal * r, principal = emi - interest;
      bal -= principal; yp += principal; yi += interest;
      if (m % 12 === 0) { rows.push([m / 12, yp, yi, yp + yi]); yp = 0; yi = 0; }
    }
    out("emi-emi", full(emi));
    out("emi-interest", money(emi * n - p));
    out("emi-total", money(emi * n));
    draw("emi", rows);
  }

  function calcGoal() {
    var c = val("goal-c"), y = val("goal-y"), i = val("goal-i") / 100, ra = val("goal-r") / 100;
    var future = c * Math.pow(1 + i, y);
    var r = ra / 12, n = y * 12;
    var sip = future * r / ((Math.pow(1 + r, n) - 1) * (1 + r));
    var lump = future / Math.pow(1 + ra, y);
    out("goal-future", money(future));
    out("goal-sip", full(sip));
    out("goal-lump", money(lump));
    out("goal-explain", "With " + val("goal-i") + "% inflation, something that costs " + money(c) +
      " today will cost about " + money(future) + " in " + y + (y === 1 ? " year" : " years") +
      ". At an expected " + val("goal-r") + "% a year, a monthly SIP of " + full(sip) + " would get you there.");
  }

  function calcInfl() {
    var a = val("infl-a"), y = val("infl-y"), i = val("infl-i") / 100;
    var mult = Math.pow(1 + i, y);
    out("infl-future", money(a * mult));
    out("infl-power", money(a / mult));
    out("infl-mult", mult.toFixed(2) + "×");
    out("infl-explain", "At " + val("infl-i") + "% inflation, prices multiply by " + mult.toFixed(2) + " in " + y +
      (y === 1 ? " year" : " years") + ". So " + money(a) + " kept as cash would then buy only what " +
      money(a / mult) + " buys today.");
  }

  var CALCS = { sip: calcSip, lump: calcLump, emi: calcEmi, goal: calcGoal, infl: calcInfl };

  /* ---------------- Chart: stacked bars, one per year ---------------- */

  var NS = "http://www.w3.org/2000/svg";
  function el(name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  // Round top of the axis so each of the 4 gridlines lands on a round number.
  function niceMax(v) {
    if (v <= 0) return 4;
    var raw = v / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
    var step = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return step * p * 4;
  }
  // Bar whose top corners are rounded (radius r), sitting on its bottom edge.
  function topRounded(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    return "M" + x + "," + (y + h) + "V" + (y + r) + "Q" + x + "," + y + " " + (x + r) + "," + y +
      "H" + (x + w - r) + "Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) + "V" + (y + h) + "Z";
  }

  var last = {};
  function draw(id, rows) {
    last[id] = rows;
    var fig = document.querySelector('[data-chart="' + id + '"]');
    if (!fig) return;
    var plot = fig.querySelector("[data-plot]");
    var tip = fig.querySelector(".chart-tip");
    var W = Math.max(plot.clientWidth, 280), H = 260;
    var m = { t: 12, r: 8, b: 28, l: 56 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var max = niceMax(Math.max.apply(null, rows.map(function (d) { return d[1] + d[2]; })));
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, width: W, height: H, role: "img",
      "aria-label": "Bar chart by year. Use the table below for exact values." });

    // grid + y labels
    for (var g = 0; g <= 4; g++) {
      var gy = m.t + ih - (ih * g) / 4;
      svg.appendChild(el("line", { x1: m.l, x2: W - m.r, y1: gy, y2: gy, class: g === 0 ? "axis" : "grid" }));
      var t = el("text", { x: m.l - 8, y: gy + 4, class: "tick", "text-anchor": "end" });
      t.textContent = short((max * g) / 4);
      svg.appendChild(t);
    }

    var n = rows.length, band = iw / n, gap = Math.max(1, Math.min(6, band * 0.25));
    var bw = Math.max(2, band - gap);
    var everyN = band >= 30 ? 1 : band >= 16 ? 2 : 5;

    rows.forEach(function (d, i) {
      var x = m.l + i * band + gap / 2;
      var h1 = (d[1] / max) * ih, h2 = (d[2] / max) * ih;
      var base = m.t + ih;
      var spacer = h1 > 0 && h2 > 0 ? 2 : 0; // 2px surface gap between segments
      if (h2 > 0) {
        if (h1 > 0) svg.appendChild(el("rect", { x: x, y: base - h1, width: bw, height: h1, class: "s1" }));
        svg.appendChild(el("path", { d: topRounded(x, base - h1 - h2, bw, Math.max(h2 - spacer, 0.5), Math.min(4, bw / 2)), class: "s2" }));
      } else if (h1 > 0) {
        svg.appendChild(el("path", { d: topRounded(x, base - h1, bw, h1, Math.min(4, bw / 2)), class: "s1" }));
      }
      var isLast = i === n - 1, rem = d[0] % everyN;
      var label = d[0] === 1 || rem === 0 || (isLast && rem >= everyN / 2);
      if (label) {
        var lx = el("text", { x: x + bw / 2, y: H - 8, class: "tick", "text-anchor": "middle" });
        lx.textContent = d[0];
        svg.appendChild(lx);
      }
      // hit target: full band height, wider than the bar
      var hit = el("rect", { x: m.l + i * band, y: m.t, width: band, height: ih, class: "hit" });
      hit.addEventListener("mouseenter", function () { show(i); });
      hit.addEventListener("mousemove", function () { show(i); });
      svg.appendChild(hit);
    });
    var hover = el("rect", { x: 0, y: m.t, width: band, height: ih, class: "hover-band", visibility: "hidden" });
    svg.insertBefore(hover, svg.firstChild);
    svg.addEventListener("mouseleave", function () { tip.hidden = true; hover.setAttribute("visibility", "hidden"); });

    var labels = fig.querySelectorAll(".chart-legend span");
    var n1 = labels[0].textContent, n2 = labels[1].textContent;
    function show(i) {
      var d = rows[i];
      hover.setAttribute("x", m.l + i * band);
      hover.setAttribute("visibility", "visible");
      tip.innerHTML = "<strong>Year " + d[0] + "</strong>" +
        "<span><i class='key key-s1'></i>" + n1 + "<b>" + money(d[1]) + "</b></span>" +
        "<span><i class='key key-s2'></i>" + n2 + "<b>" + money(d[2]) + "</b></span>" +
        "<span class='tip-total'>Total<b>" + money(d[3]) + "</b></span>";
      tip.hidden = false;
      var px = ((m.l + i * band + band / 2) / W) * plot.clientWidth;
      var tw = tip.offsetWidth, pw = plot.clientWidth;
      var left = px + 12;
      if (left + tw > pw) left = px - tw - 12;
      tip.style.left = Math.max(0, left) + "px";
    }

    plot.innerHTML = "";
    plot.appendChild(svg);

    // table view
    var tbody = fig.querySelector("[data-table] tbody");
    tbody.innerHTML = rows.map(function (d) {
      return "<tr><td>" + d[0] + "</td><td>" + full(d[1]) + "</td><td>" + full(d[2]) + "</td><td>" + full(d[3]) + "</td></tr>";
    }).join("");
  }

  /* ---------------- Wiring ---------------- */

  document.querySelectorAll(".calc").forEach(function (panel) {
    var kind = panel.getAttribute("data-calc");
    panel.querySelectorAll("input[data-pair]").forEach(function (input) {
      input.addEventListener("input", function () {
        var id = input.getAttribute("data-pair");
        var range = document.getElementById(id), num = document.getElementById(id + "-n");
        if (input === range) num.value = range.value;
        else if (input.value !== "" && !isNaN(parseFloat(input.value))) range.value = input.value;
        CALCS[kind]();
      });
      input.addEventListener("change", function () {
        // clamp typed numbers into range
        var id = input.getAttribute("data-pair");
        var range = document.getElementById(id), num = document.getElementById(id + "-n");
        var v = parseFloat(num.value);
        if (isNaN(v)) v = parseFloat(range.value);
        v = Math.min(parseFloat(num.max), Math.max(parseFloat(num.min), v));
        num.value = v; range.value = v;
        CALCS[kind]();
      });
    });
  });

  // Tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.calc-tabs [role="tab"]'));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
    var kind = document.getElementById(tab.getAttribute("aria-controls")).getAttribute("data-calc");
    CALCS[kind]();
    try { history.replaceState(null, "", "#" + kind); } catch (e) {}
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var j = null;
      if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") j = 0;
      if (e.key === "End") j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); select(tabs[j], true); }
    });
  });

  var start = (location.hash || "").slice(1);
  var startTab = tabs.filter(function (t) {
    return document.getElementById(t.getAttribute("aria-controls")).getAttribute("data-calc") === start;
  })[0];
  select(startTab || tabs[0], false);

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { for (var k in last) draw(k, last[k]); }, 150);
  });
})();
