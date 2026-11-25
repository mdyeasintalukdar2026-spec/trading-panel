(function () {
  var PASS = "12345678";
  var ROOT_ID = "qx_ui_custom_panel_v1";

  var oldEl = document.getElementById(ROOT_ID);
  if (oldEl) oldEl.remove();

  var app = {
    title: "LIVE PANEL",
    mode: "DEMO",
    demoBal: 1000.00,
    liveBal: 500.00,
    profitSum: 0.00,
    lossSum: 0.00,
    records: []
  };

  function fmtMoney(n) {
    var v = parseFloat(n);
    if (isNaN(v)) v = 0;
    return "$" + v.toFixed(2);
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var box = document.createElement("div");
  box.id = ROOT_ID;
  box.setAttribute(
    "style",
    "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:330px;max-width:92vw;max-height:86vh;overflow-y:auto;background:#090d16;color:#f8fafc;border:1.5px solid #00f5d4;border-radius:14px;padding:14px;box-shadow:0 0 24px rgba(0,245,212,0.28),0 14px 34px rgba(0,0,0,0.85);font-family:sans-serif;font-size:13px;z-index:2147483647;"
  );

  function showPassScreen(errText) {
    box.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:14px;">' +
        '<strong style="color:#00f5d4;font-size:14px;">' + escHtml(app.title) + '</strong>' +
        '<button id="u_close" style="background:#ef4444;color:#fff;border:none;border-radius:7px;padding:4px 9px;font-weight:bold;cursor:pointer;">X</button>' +
      '</div>' +
      '<div style="text-align:center;margin-bottom:12px;">' +
        '<div style="font-size:14px;font-weight:bold;margin-bottom:4px;">পাসওয়ার্ড দিন</div>' +
        '<div style="font-size:11px;color:#94a3b8;">প্যানেল ওপেন করতে পাসওয়ার্ড লিখুন</div>' +
      '</div>' +
      '<input id="u_pass" type="password" placeholder="Password" style="width:100%;box-sizing:border-box;padding:9px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;text-align:center;margin-bottom:10px;font-size:14px;">' +
      '<button id="u_enter" style="width:100%;padding:9px;border-radius:8px;border:none;background:#00f5d4;color:#041014;font-weight:bold;cursor:pointer;">UNLOCK</button>' +
      (errText ? '<div style="margin-top:8px;text-align:center;color:#f87171;font-size:12px;">' + escHtml(errText) + '</div>' : '');

    document.getElementById("u_close").onclick = function () { box.remove(); };

    function checkPass() {
      var val = document.getElementById("u_pass").value;
      if (val === PASS) {
        showMainPanel();
      } else {
        showPassScreen("ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।");
      }
    }

    document.getElementById("u_enter").onclick = checkPass;
    document.getElementById("u_pass").onkeydown = function (e) {
      if (e.key === "Enter") checkPass();
    };
  }

  function showMainPanel() {
    var isLive = app.mode === "LIVE";
    var curBal = isLive ? app.liveBal : app.demoBal;
    var net = app.profitSum - app.lossSum;

    var logRows = "";
    if (app.records.length === 0) {
      logRows = '<div style="text-align:center;color:#64748b;font-size:12px;padding:8px 0;">এখনো কোনো প্রফিট বা লস নেই</div>';
    } else {
      for (var i = app.records.length - 1; i >= 0; i--) {
        var item = app.records[i];
        var isProfit = item.type === "PROFIT";
        logRows +=
          '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;margin-bottom:5px;border-radius:8px;background:#111827;border-left:3px solid ' + (isProfit ? "#22c55e" : "#ef4444") + ';">' +
            '<div>' +
              '<div style="font-size:12px;font-weight:bold;color:' + (isProfit ? "#4ade80" : "#f87171") + ';">' + item.type + ' (' + item.mode + ')</div>' +
              '<div style="font-size:11px;color:#94a3b8;">' + item.time + '</div>' +
            '</div>' +
            '<div style="font-weight:bold;color:' + (isProfit ? "#4ade80" : "#f87171") + ';">' + (isProfit ? "+" : "-") + fmtMoney(item.amt) + '</div>' +
          '</div>';
      }
    }

    box.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">' +
        '<div>' +
          '<strong style="color:' + (isLive ? "#c084fc" : "#00f5d4") + ';font-size:14px;">' + escHtml(app.title) + '</strong>' +
          '<div style="font-size:11px;color:#94a3b8;">Active: <strong style="color:#fff;">' + app.mode + '</strong></div>' +
        '</div>' +
        '<button id="u_close" style="background:#ef4444;color:#fff;border:none;border-radius:7px;padding:4px 9px;font-weight:bold;cursor:pointer;">X</button>' +
      '</div>' +

      '<button id="u_go_live" style="width:100%;padding:9px;margin-bottom:10px;border-radius:8px;border:none;background:' + (isLive ? "#16a34a" : "#9333ea") + ';color:#fff;font-weight:bold;cursor:pointer;font-size:13px;">' +
        (isLive ? "✓ LIVE MODE ACTIVE (Switch to DEMO)" : "⚡ AUTO SWITCH TO LIVE") +
      '</button>' +

      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">' +
        '<div id="u_card_demo" style="padding:10px;border-radius:10px;cursor:pointer;background:' + (!isLive ? "#0f292e" : "#111827") + ';border:1px solid ' + (!isLive ? "#00f5d4" : "#1e293b") + ';">' +
          '<div style="font-size:11px;color:#94a3b8;">DEMO</div>' +
          '<div style="font-size:16px;font-weight:bold;margin-top:3px;">' + fmtMoney(app.demoBal) + '</div>' +
        '</div>' +
        '<div id="u_card_live" style="padding:10px;border-radius:10px;cursor:pointer;background:' + (isLive ? "#241744" : "#111827") + ';border:1px solid ' + (isLive ? "#c084fc" : "#1e293b") + ';">' +
          '<div style="font-size:11px;color:#94a3b8;">LIVE</div>' +
          '<div style="font-size:16px;font-weight:bold;margin-top:3px;">' + fmtMoney(app.liveBal) + '</div>' +
        '</div>' +
      '</div>' +

      '<button id="u_swap" style="width:100%;padding:7px;margin-bottom:12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#fff;font-weight:bold;cursor:pointer;">⇄ Swap DEMO & LIVE Balance</button>' +

      '<div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">' +
        '<div style="font-size:12px;font-weight:bold;margin-bottom:6px;color:#cbd5e1;">Set ' + app.mode + ' Balance ($)</div>' +
        '<div style="display:flex;gap:6px;">' +
          '<input id="u_bal_inp" type="number" step="0.01" value="' + curBal.toFixed(2) + '" style="flex:1;padding:7px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;">' +
          '<button id="u_bal_set" style="padding:7px 12px;border-radius:8px;border:none;background:#00f5d4;color:#041014;font-weight:bold;cursor:pointer;">Set</button>' +
        '</div>' +
      '</div>' +

      '<div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">' +
        '<div style="font-size:12px;font-weight:bold;margin-bottom:6px;color:#cbd5e1;">Profit / Loss ($)</div>' +
        '<input id="u_amt_inp" type="number" step="0.01" value="50.00" style="width:100%;box-sizing:border-box;padding:7px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;margin-bottom:8px;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
          '<button id="u_win_btn" style="padding:8px;border-radius:8px;border:none;background:#16a34a;color:#fff;font-weight:bold;cursor:pointer;">+ Profit</button>' +
          '<button id="u_loss_btn" style="padding:8px;border-radius:8px;border:none;background:#dc2626;color:#fff;font-weight:bold;cursor:pointer;">- Loss</button>' +
        '</div>' +
      '</div>' +

      '<div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
          '<strong style="font-size:12px;color:#00f5d4;">Leaderboard / P&L Log</strong>' +
          '<button id="u_reset_btn" style="background:transparent;color:#94a3b8;border:1px solid #334155;border-radius:6px;padding:2px 7px;font-size:11px;cursor:pointer;">Reset</button>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center;margin-bottom:10px;">' +
          '<div style="background:#020617;padding:6px;border-radius:8px;"><div style="font-size:10px;color:#94a3b8;">PROFIT</div><div style="font-weight:bold;color:#4ade80;font-size:12px;">+' + fmtMoney(app.profitSum) + '</div></div>' +
          '<div style="background:#020617;padding:6px;border-radius:8px;"><div style="font-size:10px;color:#94a3b8;">LOSS</div><div style="font-weight:bold;color:#f87171;font-size:12px;">-' + fmtMoney(app.lossSum) + '</div></div>' +
          '<div style="background:#020617;padding:6px;border-radius:8px;"><div style="font-size:10px;color:#94a3b8;">NET</div><div style="font-weight:bold;color:' + (net >= 0 ? "#4ade80" : "#f87171") + ';font-size:12px;">' + (net >= 0 ? "+" : "-") + fmtMoney(Math.abs(net)) + '</div></div>' +
        '</div>' +
        '<div style="max-height:130px;overflow-y:auto;">' + logRows + '</div>' +
      '</div>' +

      '<div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;">' +
        '<div style="font-size:12px;font-weight:bold;margin-bottom:6px;color:#cbd5e1;">Customize Title & Password</div>' +
        '<input id="u_title_inp" type="text" value="' + escHtml(app.title) + '" style="width:100%;box-sizing:border-box;padding:6px;border-radius:7px;border:1px solid #334155;background:#020617;color:#fff;margin-bottom:6px;">' +
        '<div style="display:flex;gap:6px;">' +
          '<input id="u_pass_inp" type="text" value="' + escHtml(PASS) + '" style="flex:1;padding:6px;border-radius:7px;border:1px solid #334155;background:#020617;color:#fff;">' +
          '<button id="u_save_cfg" style="padding:6px 12px;border-radius:7px;border:none;background:#2563eb;color:#fff;font-weight:bold;cursor:pointer;">Save</button>' +
        '</div>' +
      '</div>';

    document.getElementById("u_close").onclick = function () { box.remove(); };

    document.getElementById("u_go_live").onclick = function () {
      app.mode = isLive ? "DEMO" : "LIVE";
      showMainPanel();
    };

    document.getElementById("u_card_demo").onclick = function () {
      app.mode = "DEMO";
      showMainPanel();
    };

    document.getElementById("u_card_live").onclick = function () {
      app.mode = "LIVE";
      showMainPanel();
    };

    document.getElementById("u_swap").onclick = function () {
      var t = app.demoBal;
      app.demoBal = app.liveBal;
      app.liveBal = t;
      showMainPanel();
    };

    document.getElementById("u_bal_set").onclick = function () {
      var val = parseFloat(document.getElementById("u_bal_inp").value);
      if (isNaN(val)) return;
      if (app.mode === "LIVE") app.liveBal = val;
      else app.demoBal = val;
      showMainPanel();
    };

    function addRecord(kind) {
      var amt = parseFloat(document.getElementById("u_amt_inp").value);
      if (isNaN(amt) || amt <= 0) return;

      if (kind === "PROFIT") {
        app.profitSum += amt;
        if (app.mode === "LIVE") app.liveBal += amt;
        else app.demoBal += amt;
      } else {
        app.lossSum += amt;
        if (app.mode === "LIVE") app.liveBal -= amt;
        else app.demoBal -= amt;
      }

      var nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      app.records.push({ type: kind, amt: amt, mode: app.mode, time: nowStr });
      showMainPanel();
    }

    document.getElementById("u_win_btn").onclick = function () { addRecord("PROFIT"); };
    document.getElementById("u_loss_btn").onclick = function () { addRecord("LOSS"); };

    document.getElementById("u_reset_btn").onclick = function () {
      app.profitSum = 0;
      app.lossSum = 0;
      app.records = [];
      showMainPanel();
    };

    document.getElementById("u_save_cfg").onclick = function () {
      var nt = document.getElementById("u_title_inp").value.trim();
      var np = document.getElementById("u_pass_inp").value;
      if (nt) app.title = nt;
      if (np.length > 0) PASS = np;
      showMainPanel();
    };
  }

  function mountBox() {
    if (!document.body) return;
    document.body.appendChild(box);
    showPassScreen("");
  }

  if (document.body) mountBox();
  else window.addEventListener("DOMContentLoaded", mountBox);
})();
