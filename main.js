(function () {
  var PASS = "12345678";
  var ID = "custom_panel_view_box";

  var old = document.getElementById(ID);
  if (old) old.remove();

  var state = {
    title: "CUSTOM PANEL",
    demo: 1000.00,
    live: 500.00,
    mode: "DEMO",
    profit: 0.00,
    loss: 0.00,
    logs: []
  };

  function fmt(n) {
    var x = parseFloat(n);
    if (isNaN(x)) x = 0;
    return "$" + x.toFixed(2);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  var box = document.createElement("div");
  box.id = ID;
  box.style.cssText =
    "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:330px;max-width:92vw;max-height:86vh;overflow-y:auto;background:#090d16;color:#f8fafc;border:1.5px solid #00f5d4;border-radius:14px;padding:14px;box-shadow:0 0 25px rgba(0,245,212,0.3),0 14px 34px rgba(0,0,0,0.85);font-family:sans-serif;font-size:13px;z-index:2147483647;";

  function renderLock(err) {
    box.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:14px;">' +
        '<strong style="color:#00f5d4;font-size:14px;">' + esc(state.title) + '</strong>' +
        '<button id="p_close" style="background:#ef4444;color:#fff;border:none;border-radius:7px;padding:4px 9px;font-weight:bold;cursor:pointer;">X</button>' +
      '</div>' +
      '<div style="text-align:center;margin-bottom:12px;">' +
        '<div style="font-size:14px;font-weight:bold;margin-bottom:4px;">পাসওয়ার্ড দিন</div>' +
        '<div style="font-size:11px;color:#94a3b8;">প্যানেল ওপেন করতে পাসওয়ার্ড লিখুন</div>' +
      '</div>' +
      '<input id="p_input" type="password" placeholder="Password" style="width:100%;box-sizing:border-box;padding:9px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;text-align:center;margin-bottom:10px;font-size:14px;">' +
      '<button id="p_unlock" style="width:100%;padding:9px;border-radius:8px;border:none;background:#00f5d4;color:#041014;font-weight:bold;cursor:pointer;">UNLOCK</button>' +
      (err ? '<div style="margin-top:8px;text-align:center;color:#f87171;font-size:12px;">' + esc(err) + '</div>' : '');

    document.getElementById("p_close").onclick = function () { box.remove(); };
    function verify() {
      var v = document.getElementById("p_input").value;
      if (v === PASS) renderApp();
      else renderLock("পাসওয়ার্ড সঠিক নয়!");
    }
    document.getElementById("p_unlock").onclick = verify;
    document.getElementById("p_input").onkeydown = function (e) { if (e.key === "Enter") verify(); };
  }

  function renderApp() {
    var net = state.profit - state.loss;
    var cur = state.mode === "DEMO" ? state.demo : state.live;
    var list = "";

    if (state.logs.length === 0) {
      list = '<div style="text-align:center;color:#64748b;font-size:12px;padding:8px 0;">কোনো এন্ট্রি নেই</div>';
    } else {
      for (var i = state.logs.length - 1; i >= 0; i--) {
        var r = state.logs[i];
        var win = r.type === "PROFIT";
        list +=
          '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;margin-bottom:5px;border-radius:8px;background:#111827;border-left:3px solid ' + (win ? "#22c55e" : "#ef4444") + ';">' +
            '<div>' +
              '<div style="font-size:12px;font-weight:bold;color:' + (win ? "#4ade80" : "#f87171") + ';">' + r.type + ' (' + r.mode + ')</div>' +
              '<div style="font-size:11px;color:#94a3b8;">' + r.time + '</div>' +
            '</div>' +
            '<div style="font-weight:bold;color:' + (win ? "#4ade80" : "#f87171") + ';">' + (win ? "+" : "-") + fmt(r.amt) + '</div>' +
          '</div>';
      }
    }

    box.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">' +
        '<strong style="color:#00f5d4;font-size:14px;">' + esc(state.title) + '</strong>' +
        '<button id="p_close" style="background:#ef4444;color:#fff;border:none;border-radius:7px;padding:4px 9px;font-weight:bold;cursor:pointer;">X</button>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">' +
        '<div id="m_demo" style="padding:10px;border-radius:10px;cursor:pointer;background:' + (state.mode === "DEMO" ? "#0f292e" : "#111827") + ';border:1px solid ' + (state.mode === "DEMO" ? "#00f5d4" : "#1e293b") + ';">' +
          '<div style="font-size:11px;color:#94a3b8;">DEMO</div>' +
          '<div style="font-size:16px;font-weight:bold;margin-top:3px;">' + fmt(state.demo) + '</div>' +
        '</div>' +
        '<div id="m_live" style="padding:10px;border-radius:10px;cursor:pointer;background:' + (state.mode === "LIVE" ? "#241744" : "#111827") + ';border:1px solid ' + (state.mode === "LIVE" ? "#c084fc" : "#1e293b") + ';">' +
          '<div style="font-size:11px;color:#94a3b8;">LIVE</div>' +
          '<div style="font-size:16px;font-weight:bold;margin-top:3px;">' + fmt(state.live) + '</div>' +
        '</div>' +
      '</div>' +
      '<button id="p_swap" style="width:100%;padding:7px;margin-bottom:12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#fff;font-weight:bold;cursor:pointer;">⇄ Swap DEMO & LIVE</button>' +
      '<div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">' +
        '<div style="font-size:12px;font-weight:bold;margin-bottom:6px;color:#cbd5e1;">Set ' + state.mode + ' Balance ($)</div>' +
        '<div style="display:flex;gap:6px;">' +
          '<input id="p_bal" type="number" step="0.01" value="' + cur.toFixed(2) + '" style="flex:1;padding:7px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;">' +
          '<button id="p_set_bal" style="padding:7px 12px;border-radius:8px;border:none;background:#00f5d4;color:#041014;font-weight:bold;cursor:pointer;">Set</button>' +
        '</div>' +
      '</div>' +
      '<div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">' +
        '<div style="font-size:12px;font-weight:bold;margin-bottom:6px;color:#cbd5e1;">Profit / Loss ($)</div>' +
        '<input id="p_amt" type="number" step="0.01" value="50.00" style="width:100%;box-sizing:border-box;padding:7px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;margin-bottom:8px;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
          '<button id="p_win" style="padding:8px;border-radius:8px;border:none;background:#16a34a;color:#fff;font-weight:bold;cursor:pointer;">+ Profit</button>' +
          '<button id="p_loss" style="padding:8px;border-radius:8px;border:none;background:#dc2626;color:#fff;font-weight:bold;cursor:pointer;">- Loss</button>' +
        '</div>' +
      '</div>' +
      '<div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
          '<strong style="font-size:12px;color:#00f5d4;">Leaderboard / Summary</strong>' +
          '<button id="p_reset" style="background:transparent;color:#94a3b8;border:1px solid #334155;border-radius:6px;padding:2px 7px;font-size:11px;cursor:pointer;">Reset</button>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center;margin-bottom:10px;">' +
          '<div style="background:#020617;padding:6px;border-radius:8px;"><div style="font-size:10px;color:#94a3b8;">PROFIT</div><div style="font-weight:bold;color:#4ade80;font-size:12px;">+' + fmt(state.profit) + '</div></div>' +
          '<div style="background:#020617;padding:6px;border-radius:8px;"><div style="font-size:10px;color:#94a3b8;">LOSS</div><div style="font-weight:bold;color:#f87171;font-size:12px;">-' + fmt(state.loss) + '</div></div>' +
          '<div style="background:#020617;padding:6px;border-radius:8px;"><div style="font-size:10px;color:#94a3b8;">NET</div><div style="font-weight:bold;color:' + (net >= 0 ? "#4ade80" : "#f87171") + ';font-size:12px;">' + (net >= 0 ? "+" : "-") + fmt(Math.abs(net)) + '</div></div>' +
        '</div>' +
        '<div style="max-height:130px;overflow-y:auto;">' + list + '</div>' +
      '</div>' +
      '<div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;">' +
        '<div style="font-size:12px;font-weight:bold;margin-bottom:6px;color:#cbd5e1;">Customize Title & Password</div>' +
        '<input id="p_title" type="text" value="' + esc(state.title) + '" style="width:100%;box-sizing:border-box;padding:6px;border-radius:7px;border:1px solid #334155;background:#020617;color:#fff;margin-bottom:6px;">' +
        '<div style="display:flex;gap:6px;">' +
          '<input id="p_pass" type="text" value="' + esc(PASS) + '" style="flex:1;padding:6px;border-radius:7px;border:1px solid #334155;background:#020617;color:#fff;">' +
          '<button id="p_save_cfg" style="padding:6px 12px;border-radius:7px;border:none;background:#2563eb;color:#fff;font-weight:bold;cursor:pointer;">Save</button>' +
        '</div>' +
      '</div>';

    document.getElementById("p_close").onclick = function () { box.remove(); };
    document.getElementById("m_demo").onclick = function () { state.mode = "DEMO"; renderApp(); };
    document.getElementById("m_live").onclick = function () { state.mode = "LIVE"; renderApp(); };
    document.getElementById("p_swap").onclick = function () {
      var tmp = state.demo;
      state.demo = state.live;
      state.live = tmp;
      renderApp();
    };
    document.getElementById("p_set_bal").onclick = function () {
      var v = parseFloat(document.getElementById("p_bal").value);
      if (isNaN(v)) return;
      if (state.mode === "DEMO") state.demo = v;
      else state.live = v;
      renderApp();
    };
    function pushLog(type) {
      var amt = parseFloat(document.getElementById("p_amt").value);
      if (isNaN(amt) || amt <= 0) return;
      if (type === "PROFIT") {
        state.profit += amt;
        if (state.mode === "DEMO") state.demo += amt;
        else state.live += amt;
      } else {
        state.loss += amt;
        if (state.mode === "DEMO") state.demo -= amt;
        else state.live -= amt;
      }
      var t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      state.logs.push({ type: type, amt: amt, mode: state.mode, time: t });
      renderApp();
    }
    document.getElementById("p_win").onclick = function () { pushLog("PROFIT"); };
    document.getElementById("p_loss").onclick = function () { pushLog("LOSS"); };
    document.getElementById("p_reset").onclick = function () { state.profit = 0; state.loss = 0; state.logs = []; renderApp(); };
    document.getElementById("p_save_cfg").onclick = function () {
      var nt = document.getElementById("p_title").value.trim();
      var np = document.getElementById("p_pass").value;
      if (nt) state.title = nt;
      if (np.length > 0) PASS = np;
      renderApp();
    };
  }

  function mount() {
    if (!document.body) return;
    document.body.appendChild(box);
    renderLock("");
  }

  if (document.body) mount();
  else window.addEventListener("DOMContentLoaded", mount);
})();
