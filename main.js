(function () {
  var PASS = "12345678";
  var BOX_ID = "live_sim_box_9001";

  var oldBox = document.getElementById(BOX_ID);
  if (oldBox) oldBox.remove();

  var data = {
    title: "LIVE TRADING PANEL",
    demo: 1000.00,
    live: 500.00,
    mode: "DEMO",
    profit: 0.00,
    loss: 0.00,
    history: []
  };

  function usd(num) {
    var n = parseFloat(num);
    if (isNaN(n)) n = 0;
    return "$" + n.toFixed(2);
  }

  function safeText(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var box = document.createElement("div");
  box.id = BOX_ID;
  box.setAttribute(
    "style",
    "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:330px;max-width:92vw;max-height:86vh;overflow-y:auto;background:#090d16;color:#f8fafc;border:1.5px solid #00f5d4;border-radius:14px;padding:14px;box-shadow:0 0 25px rgba(0,245,212,0.28),0 14px 34px rgba(0,0,0,0.85);font-family:sans-serif;font-size:13px;z-index:2147483647;"
  );

  function drawLock(msg) {
    box.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:14px;">' +
        '<strong style="color:#00f5d4;font-size:14px;">' + safeText(data.title) + '</strong>' +
        '<button id="btn_close_box" style="background:#ef4444;color:#fff;border:none;border-radius:7px;padding:4px 9px;font-weight:bold;cursor:pointer;">X</button>' +
      '</div>' +
      '<div style="text-align:center;margin-bottom:12px;">' +
        '<div style="font-size:14px;font-weight:bold;margin-bottom:4px;">পাসওয়ার্ড দিন</div>' +
        '<div style="font-size:11px;color:#94a3b8;">প্যানেল ওপেন করতে পাসওয়ার্ড লিখুন</div>' +
      '</div>' +
      '<input id="inp_pass" type="password" placeholder="Password" style="width:100%;box-sizing:border-box;padding:9px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;text-align:center;margin-bottom:10px;font-size:14px;">' +
      '<button id="btn_unlock" style="width:100%;padding:9px;border-radius:8px;border:none;background:#00f5d4;color:#041014;font-weight:bold;cursor:pointer;font-size:13px;">UNLOCK</button>' +
      (msg ? '<div style="margin-top:8px;text-align:center;color:#f87171;font-size:12px;">' + safeText(msg) + '</div>' : '');

    document.getElementById("btn_close_box").onclick = function () {
      box.remove();
    };

    function check() {
      var val = document.getElementById("inp_pass").value;
      if (val === PASS) {
        drawMain();
      } else {
        drawLock("পাসওয়ার্ড সঠিক নয়!");
      }
    }

    document.getElementById("btn_unlock").onclick = check;
    document.getElementById("inp_pass").onkeydown = function (e) {
      if (e.key === "Enter") check();
    };
  }

  function drawMain() {
    var net = data.profit - data.loss;
    var activeBal = data.mode === "DEMO" ? data.demo : data.live;

    var rows = "";
    if (data.history.length === 0) {
      rows = '<div style="text-align:center;color:#64748b;font-size:12px;padding:8px 0;">কোনো প্রফিট বা লস নেই</div>';
    } else {
      for (var i = data.history.length - 1; i >= 0; i--) {
        var item = data.history[i];
        var isWin = item.kind === "PROFIT";
        rows +=
          '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;margin-bottom:5px;border-radius:8px;background:#111827;border-left:3px solid ' + (isWin ? "#22c55e" : "#ef4444") + ';">' +
            '<div>' +
              '<div style="font-size:12px;font-weight:bold;color:' + (isWin ? "#4ade80" : "#f87171") + ';">' + item.kind + ' (' + item.mode + ')</div>' +
              '<div style="font-size:11px;color:#94a3b8;">' + item.time + '</div>' +
            '</div>' +
            '<div style="font-weight:bold;color:' + (isWin ? "#4ade80" : "#f87171") + ';">' + (isWin ? "+" : "-") + usd(item.amt) + '</div>' +
          '</div>';
      }
    }

    box.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">' +
        '<strong style="color:#00f5d4;font-size:14px;">' + safeText(data.title) + '</strong>' +
        '<button id="btn_close_box" style="background:#ef4444;color:#fff;border:none;border-radius:7px;padding:4px 9px;font-weight:bold;cursor:pointer;">X</button>' +
      '</div>' +

      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">' +
        '<div id="sel_demo" style="padding:10px;border-radius:10px;cursor:pointer;background:' + (data.mode === "DEMO" ? "#0f292e" : "#111827") + ';border:1px solid ' + (data.mode === "DEMO" ? "#00f5d4" : "#1e293b") + ';">' +
          '<div style="font-size:11px;color:#94a3b8;">DEMO</div>' +
          '<div style="font-size:16px;font-weight:bold;margin-top:3px;">' + usd(data.demo) + '</div>' +
        '</div>' +
        '<div id="sel_live" style="padding:10px;border-radius:10px;cursor:pointer;background:' + (data.mode === "LIVE" ? "#241744" : "#111827") + ';border:1px solid ' + (data.mode === "LIVE" ? "#c084fc" : "#1e293b") + ';">' +
          '<div style="font-size:11px;color:#94a3b8;">LIVE</div>' +
          '<div style="font-size:16px;font-weight:bold;margin-top:3px;">' + usd(data.live) + '</div>' +
        '</div>' +
      '</div>' +

      '<button id="btn_swap" style="width:100%;padding:7px;margin-bottom:12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#fff;font-weight:bold;cursor:pointer;">⇄ Swap DEMO & LIVE</button>' +

      '<div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">' +
        '<div style="font-size:12px;font-weight:bold;margin-bottom:6px;color:#cbd5e1;">Set ' + data.mode + ' Balance ($)</div>' +
        '<div style="display:flex;gap:6px;">' +
          '<input id="inp_bal" type="number" step="0.01" value="' + activeBal.toFixed(2) + '" style="flex:1;padding:7px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;">' +
          '<button id="btn_set_bal" style="padding:7px 12px;border-radius:8px;border:none;background:#00f5d4;color:#041014;font-weight:bold;cursor:pointer;">Set</button>' +
        '</div>' +
      '</div>' +

      '<div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">' +
        '<div style="font-size:12px;font-weight:bold;margin-bottom:6px;color:#cbd5e1;">Profit / Loss ($)</div>' +
        '<input id="inp_amt" type="number" step="0.01" value="50.00" style="width:100%;box-sizing:border-box;padding:7px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;margin-bottom:8px;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
          '<button id="btn_win" style="padding:8px;border-radius:8px;border:none;background:#16a34a;color:#fff;font-weight:bold;cursor:pointer;">+ Profit</button>' +
          '<button id="btn_loss" style="padding:8px;border-radius:8px;border:none;background:#dc2626;color:#fff;font-weight:bold;cursor:pointer;">- Loss</button>' +
        '</div>' +
      '</div>' +

      '<div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
          '<strong style="font-size:12px;color:#00f5d4;">Leaderboard / Summary</strong>' +
          '<button id="btn_clear" style="background:transparent;color:#94a3b8;border:1px solid #334155;border-radius:6px;padding:2px 7px;font-size:11px;cursor:pointer;">Reset</button>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center;margin-bottom:10px;">' +
          '<div style="background:#020617;padding:6px;border-radius:8px;">' +
            '<div style="font-size:10px;color:#94a3b8;">PROFIT</div>' +
            '<div style="font-weight:bold;color:#4ade80;font-size:12px;">+' + usd(data.profit) + '</div>' +
          '</div>' +
          '<div style="background:#020617;padding:6px;border-radius:8px;">' +
            '<div style="font-size:10px;color:#94a3b8;">LOSS</div>' +
            '<div style="font-weight:bold;color:#f87171;font-size:12px;">-' + usd(data.loss) + '</div>' +
          '</div>' +
          '<div style="background:#020617;padding:6px;border-radius:8px;">' +
            '<div style="font-size:10px;color:#94a3b8;">NET</div>' +
            '<div style="font-weight:bold;color:' + (net >= 0 ? "#4ade80" : "#f87171") + ';font-size:12px;">' + (net >= 0 ? "+" : "-") + usd(Math.abs(net)) + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="max-height:130px;overflow-y:auto;">' + rows + '</div>' +
      '</div>' +

      '<div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;">' +
        '<div style="font-size:12px;font-weight:bold;margin-bottom:6px;color:#cbd5e1;">Customize Title & Password</div>' +
        '<input id="inp_title" type="text" value="' + safeText(data.title) + '" style="width:100%;box-sizing:border-box;padding:6px;border-radius:7px;border:1px solid #334155;background:#020617;color:#fff;margin-bottom:6px;">' +
        '<div style="display:flex;gap:6px;">' +
          '<input id="inp_newpass" type="text" value="' + safeText(PASS) + '" style="flex:1;padding:6px;border-radius:7px;border:1px solid #334155;background:#020617;color:#fff;">' +
          '<button id="btn_save_cfg" style="padding:6px 12px;border-radius:7px;border:none;background:#2563eb;color:#fff;font-weight:bold;cursor:pointer;">Save</button>' +
        '</div>' +
      '</div>';

    document.getElementById("btn_close_box").onclick = function () {
      box.remove();
    };

    document.getElementById("sel_demo").onclick = function () {
      data.mode = "DEMO";
      drawMain();
    };

    document.getElementById("sel_live").onclick = function () {
      data.mode = "LIVE";
      drawMain();
    };

    document.getElementById("btn_swap").onclick = function () {
      var temp = data.demo;
      data.demo = data.live;
      data.live = temp;
      drawMain();
    };

    document.getElementById("btn_set_bal").onclick = function () {
      var val = parseFloat(document.getElementById("inp_bal").value);
      if (isNaN(val)) return;
      if (data.mode === "DEMO") data.demo = val;
      else data.live = val;
      drawMain();
    };

    function addEntry(kind) {
      var amt = parseFloat(document.getElementById("inp_amt").value);
      if (isNaN(amt) || amt <= 0) return;

      if (kind === "PROFIT") {
        data.profit += amt;
        if (data.mode === "DEMO") data.demo += amt;
        else data.live += amt;
      } else {
        data.loss += amt;
        if (data.mode === "DEMO") data.demo -= amt;
        else data.live -= amt;
      }

      var now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      data.history.push({ kind: kind, amt: amt, mode: data.mode, time: now });
      drawMain();
    }

    document.getElementById("btn_win").onclick = function () {
      addEntry("PROFIT");
    };

    document.getElementById("btn_loss").onclick = function () {
      addEntry("LOSS");
    };

    document.getElementById("btn_clear").onclick = function () {
      data.profit = 0;
      data.loss = 0;
      data.history = [];
      drawMain();
    };

    document.getElementById("btn_save_cfg").onclick = function () {
      var t = document.getElementById("inp_title").value.trim();
      var p = document.getElementById("inp_newpass").value;
      if (t) data.title = t;
      if (p.length > 0) PASS = p;
      drawMain();
    };
  }

  document.body.appendChild(box);
  drawLock("");
})();
