/* Laila's Kitchen — hero slider and order builder. Edit MENU, PICKUP_DAYS and the rules below to update the site. */
(function () {
  "use strict";

  // ---- Settings -----------------------------------------------------------
  // Menus: [id, name, size (or ""), price, optional badge]. Item ids must be unique across both menus.
  var MENU = [
    { cat: "Signature Rice & Biryani", sub: "", items: [
      ["kacchi", "Kacchi Biryani", "750ml", 14],
      ["chbir", "Chicken Biryani", "650ml", 12, "Popular"],
      ["tehari", "Beef Tehari", "650ml", 12],
      ["polao", "Morog Polao", "650ml", 12]
    ]},
    { cat: "Chicken", sub: "Murgir Mangsho", items: [
      ["roast", "Traditional Chicken Roast", "¼ chicken", 6],
      ["chcurry", "Chicken Curry", "650ml", 12],
      ["dopiaza", "Chicken Dopiaza", "650ml", 12],
      ["korma", "Chicken Korma", "650ml", 12]
    ]},
    { cat: "Beef", sub: "Gorur Mangsho", items: [
      ["bcurry", "Beef Curry", "650ml", 15],
      ["kala", "Beef Kala Bhuna", "650ml", 15],
      ["rezala", "Beef Rezala", "650ml", 15],
      ["potato", "Beef with Potato", "650ml", 14],
      ["kolija", "Beef Kolija / Liver Bhuna", "650ml", 18],
      ["daal", "Daal Gosht", "650ml", 15]
    ]}
  ];
  var PARTY_MENU = [
    { cat: "Chicken Roast & Polao", sub: "", items: [
      ["p-rp", "Chicken Roast + Polao + Kebab", "per person", 14],
      ["p-rpc", "Chicken Roast + Polao + Kebab + Beef/Goat/Lamb Curry", "per person", 18]
    ]},
    { cat: "Chicken Biriyani", sub: "", items: [
      ["p-cb", "Chicken Biriyani", "per person", 12],
      ["p-cbk", "Chicken Biriyani + Kebab", "per person", 14],
      ["p-cbkc", "Chicken Biriyani + Kebab + Beef/Goat/Lamb Curry", "per person", 18]
    ]},
    { cat: "Kacchi Biriyani", sub: "", items: [
      ["p-kb", "Kacchi Biriyani", "per person", 14],
      ["p-kbk", "Kacchi Biriyani + Kebab", "per person", 16],
      ["p-kbkr", "Kacchi Biriyani + Kebab + Chicken Roast", "per person", 21],
      ["p-kbkz", "Kacchi Biriyani + Kebab + Beef/Goat/Lamb Rezala", "per person", 20]
    ]},
    { cat: "Tehari & Polao", sub: "", items: [
      ["p-th", "Beef Tehari", "per person", 12],
      ["p-mp", "Murog Polao", "per person", 12]
    ]},
    { cat: "Additional Items", sub: "", extra: true, items: [
      ["p-roast", "Chicken Roast", "¼ chicken, per piece", 6],
      ["p-veg", "Vegetables", "per person", 4],
      ["p-salad", "Salad", "per person", 3],
      ["p-firni", "Firni / Payesh", "per person", 2]
    ]}
  ];
  var MIN_ORDER = 30;           // dollars
  var PARTY_MIN_PEOPLE = 5;     // party orders: minimum number of people (package items only)
  var FIRST_ORDER_OFF = 0.20;   // 20% off the first order
  var PICKUP_DAYS = [2, 3, 5, 6]; // 0 = Sunday ... 6 = Saturday (Tue, Wed, Fri, Sat)
  var NOTICE_DAYS = 2;          // orders confirmed at least 48 hours ahead
  var SLIDE_MS = 5000;

  var $ = function (id) { return document.getElementById(id); };

  // ---- Hero slider --------------------------------------------------------
  (function slider() {
    var root = $("slider"); if (!root) return;
    var track = root.querySelector(".track"), slides = track.children, n = slides.length;
    var dots = root.querySelector(".dots"), vp = root.querySelector(".viewport");
    var i = 0, timer = null, paused = false;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.style.setProperty("--slide-ms", SLIDE_MS + "ms");
    if (reduce) root.classList.add("static");

    for (var k = 0; k < n; k++) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("aria-label", "Show photo " + (k + 1) + " of " + n);
      b.dataset.i = k; dots.appendChild(b);
    }
    function go(to) {
      i = (to + n) % n;
      track.style.transform = "translateX(" + (-100 * i) + "%)";
      for (var s = 0; s < n; s++) slides[s].setAttribute("aria-hidden", s === i ? "false" : "true");
      Array.prototype.forEach.call(dots.children, function (d, di) {
        d.removeAttribute("aria-current");
        if (di === i) { void d.offsetWidth; d.setAttribute("aria-current", "true"); }
      });
      clearTimeout(timer);
      if (!reduce && !paused) timer = setTimeout(function () { go(i + 1); }, SLIDE_MS);
    }
    function pause(p) {
      if (paused === p) return;
      paused = p; root.classList.toggle("paused", p);
      if (p) clearTimeout(timer); else go(i);
    }

    root.querySelector(".prev").addEventListener("click", function () { go(i - 1); });
    root.querySelector(".next").addEventListener("click", function () { go(i + 1); });
    dots.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) go(+b.dataset.i); });
    root.addEventListener("mouseenter", function () { pause(true); });
    root.addEventListener("mouseleave", function () { pause(false); });
    root.addEventListener("focusin", function () { pause(true); });
    root.addEventListener("focusout", function () { pause(false); });
    document.addEventListener("visibilitychange", function () { pause(document.hidden); });
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") go(i - 1);
      if (e.key === "ArrowRight") go(i + 1);
    });
    var x0 = null;
    vp.addEventListener("pointerdown", function (e) { x0 = e.clientX; });
    vp.addEventListener("pointerup", function (e) {
      if (x0 === null) return; var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
    });
    vp.addEventListener("pointercancel", function () { x0 = null; });
    go(0);
  })();

  // ---- Order builder ------------------------------------------------------
  var BY = {};
  [[MENU, "weekly"], [PARTY_MENU, "party"]].forEach(function (m) {
    m[0].forEach(function (c) { c.items.forEach(function (it) {
      BY[it[0]] = { name: it[1], size: it[2], price: it[3], badge: it[4], menu: m[1], pkg: m[1] === "party" && !c.extra, perPerson: /per person/.test(it[2]) };
    }); });
  });

  var cart = {};
  try { cart = JSON.parse(localStorage.getItem("lk-cart") || "{}") || {}; } catch (e) { cart = {}; }
  Object.keys(cart).forEach(function (k) { if (!BY[k] || !(cart[k] > 0)) delete cart[k]; });

  function money(v) { v = Math.round(v * 100) / 100; return "$" + (v % 1 ? v.toFixed(2) : String(v)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function menuHTML(groups) {
    return groups.map(function (c) {
      return '<div class="cat"><div class="cat-title"><h3>' + esc(c.cat) + "</h3>" + (c.sub ? '<span class="note">' + esc(c.sub) + "</span>" : "") +
        '</div><ul class="items">' + c.items.map(function (it) {
          var id = it[0], n = esc(it[1]);
          return '<li class="item" data-id="' + id + '"><div class="nm">' + n.replace(/ \+ /g, ' <span class="plus">+</span> ') + (it[4] ? "<small>" + esc(it[4]) + "</small>" : "") +
            '</div><div class="meta">' + (it[2] ? '<span class="sz">' + esc(it[2]) + "</span>" : "") + '<span class="pr num">$' + it[3] + "</span></div>" +
            '<div class="step" role="group" aria-label="Quantity of ' + n + '"><button type="button" data-d="-1" aria-label="Remove one ' + n + '">−</button>' +
            '<output class="num">0</output><button type="button" data-d="1" aria-label="Add one ' + n + '">+</button></div></li>';
        }).join("") + "</ul></div>";
    }).join("");
  }
  $("menuList").innerHTML = menuHTML(MENU);
  $("partyList").innerHTML = menuHTML(PARTY_MENU);

  // Menu tabs: Catering menu / Party catering
  var tabs = document.querySelectorAll('[role="tab"]');
  function selectTab(name, focus) {
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      $(t.getAttribute("aria-controls")).hidden = !on;
      if (on && focus) t.focus();
    });
  }
  tabs.forEach(function (t, k) {
    t.addEventListener("click", function () { selectTab(t.dataset.tab); });
    t.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var nx = tabs[(k + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(nx.dataset.tab, true);
    });
  });
  document.querySelectorAll('a[href="#party"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault(); selectTab("party");
      $("menu").scrollIntoView({ behavior: "smooth" });
      try { history.replaceState(null, "", "#party"); } catch (err) {}
    });
  });
  if (location.hash === "#party") selectTab("party");
  window.addEventListener("hashchange", function () { if (location.hash === "#party") { selectTab("party"); $("menu").scrollIntoView(); } });

  $("menus").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-d]"); if (!b) return;
    var id = b.closest(".item").dataset.id;
    cart[id] = Math.max(0, Math.min(99, (cart[id] || 0) + Number(b.dataset.d)));
    if (!cart[id]) delete cart[id];
    render();
  });

  // Pickup dates offered in the order form
  var DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var opts = [];
  for (var d = NOTICE_DAYS; opts.length < 6 && d < 40; d++) {
    var dt = new Date(today); dt.setDate(dt.getDate() + d);
    if (PICKUP_DAYS.indexOf(dt.getDay()) > -1) opts.push(DAY[dt.getDay()] + " " + dt.getDate() + " " + MON[dt.getMonth()]);
  }
  $("pday").innerHTML = opts.map(function (o) { return "<option>" + o + "</option>"; }).join("");

  function totals() {
    var ids = Object.keys(cart);
    var count = ids.reduce(function (a, k) { return a + cart[k]; }, 0);
    var sub = ids.reduce(function (a, k) { return a + BY[k].price * cart[k]; }, 0);
    var disc = $("first").checked ? sub * FIRST_ORDER_OFF : 0;
    var people = ids.reduce(function (a, k) { return a + (BY[k].pkg ? cart[k] : 0); }, 0);
    return { ids: ids, count: count, sub: sub, disc: disc, tot: sub - disc, people: people, partyOk: people === 0 || people >= PARTY_MIN_PEOPLE };
  }

  function message(t) {
    var L = ["Hi Laila's Kitchen, I'd like to place an order.", "", "Pickup: " + $("pday").value, ""];
    var weekly = t.ids.filter(function (k) { return BY[k].menu === "weekly"; });
    var party = t.ids.filter(function (k) { return BY[k].menu === "party"; });
    function line(k) {
      var it = BY[k], q = cart[k];
      if (it.perPerson) return it.name + " — " + q + (q === 1 ? " person" : " people") + " × " + money(it.price) + " = " + money(it.price * q);
      return q + " × " + it.name + (it.size ? " (" + it.size + ")" : "") + " — " + money(it.price * q);
    }
    if (weekly.length && party.length) L.push("Catering menu:");
    weekly.forEach(function (k) { L.push(line(k)); });
    if (weekly.length && party.length) L.push("");
    if (party.length) L.push("Party catering:");
    party.forEach(function (k) { L.push(line(k)); });
    L.push("", "Subtotal: " + money(t.sub));
    if (t.disc) L.push("First order 20% off: −" + money(t.disc));
    L.push("Total: " + money(t.tot));
    var name = $("cname").value.trim(), notes = $("notes").value.trim();
    if (name || notes) L.push("");
    if (name) L.push("Name: " + name);
    if (notes) L.push("Notes: " + notes);
    return L.join("\n");
  }

  function render() {
    try { localStorage.setItem("lk-cart", JSON.stringify(cart)); } catch (e) {}
    document.querySelectorAll(".item").forEach(function (li) {
      var q = cart[li.dataset.id] || 0;
      li.querySelector("output").textContent = q;
      li.classList.toggle("in", q > 0);
      li.querySelector('[data-d="-1"]').disabled = !q;
    });
    var t = totals(), minOk = t.sub >= MIN_ORDER, ok = minOk && t.partyOk;
    $("empty").hidden = !!t.count; $("totals").hidden = !t.count;
    $("lines").innerHTML = t.ids.map(function (k) {
      var q = cart[k] + (BY[k].perPerson ? (cart[k] === 1 ? " person" : " people") : "");
      return "<li><span>" + q + " × " + esc(BY[k].name) + (BY[k].menu === "party" ? ' <em class="tagp">Party</em>' : "") +
        "</span><span>" + money(BY[k].price * cart[k]) + "</span></li>";
    }).join("");
    $("sub").textContent = money(t.sub);
    $("discRow").hidden = !t.disc; $("disc").textContent = "−" + money(t.disc);
    $("tot").textContent = money(t.tot);
    $("meter").classList.toggle("ok", ok);
    $("meterFill").style.width = Math.min(100, t.sub / MIN_ORDER * 100) + "%";
    var msgs = [];
    if (!t.count) msgs.push("Minimum order is $" + MIN_ORDER + ".");
    else if (!minOk) msgs.push("Add " + money(MIN_ORDER - t.sub) + " more to reach the $" + MIN_ORDER + " minimum.");
    if (!t.partyOk) msgs.push("Party orders are for at least " + PARTY_MIN_PEOPLE + " people. Add " + (PARTY_MIN_PEOPLE - t.people) + " more.");
    $("minmsg").textContent = ok ? "Minimum order reached." : msgs.join(" ");
    $("copyOrder").disabled = !ok || !opts.length;
    $("preview").textContent = t.count ? message(t) : "Add dishes to see your order message.";
    $("bar").hidden = !t.count; document.body.classList.toggle("has-bar", !!t.count);
    $("barTot").textContent = money(t.tot);
    $("barCount").textContent = t.count + (t.count === 1 ? " item" : " items") + (ok ? "" : !t.partyOk ? " · party min. " + PARTY_MIN_PEOPLE + " people" : " · $" + MIN_ORDER + " minimum");
    return t;
  }
  ["first", "pday", "cname", "notes"].forEach(function (id) { $(id).addEventListener("input", render); });

  function copyText(text, el, done) {
    function fallback() {
      var r = document.createRange(); r.selectNodeContents(el);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      done(false);
    }
    try { navigator.clipboard.writeText(text).then(function () { done(true); }, fallback); } catch (e) { fallback(); }
  }
  $("copyOrder").addEventListener("click", function () {
    var t = render(), pre = $("preview");
    pre.closest("details").open = true;
    copyText(message(t), pre, function (ok) {
      $("toast").textContent = ok ? "Order message copied. Paste it into Messenger or a text message."
        : "Message selected. Copy it with your device's copy command.";
    });
  });
  document.querySelectorAll(".copy").forEach(function (b) {
    b.addEventListener("click", function () {
      copyText(b.dataset.copy, b.previousElementSibling, function (ok) {
        b.textContent = ok ? "Copied" : "Selected";
        setTimeout(function () { b.textContent = "Copy"; }, 1800);
      });
    });
  });

  $("yr").textContent = new Date().getFullYear();
  render();
})();
