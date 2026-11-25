(function () {
  const PANEL_ID = "shadow-custom-sim-panel";
  const ACCESS_PASS = "1234"; // এখানে নিজের পছন্দমতো পাসওয়ার্ড বসান

  const existing = document.getElementById(PANEL_ID);
  if (existing) existing.remove();

  const state = {
    unlocked: false,
    demoBalance: 1000.00,
    liveBalance: 250.00,
    activeView: "DEMO",
    totalProfit: 0.00,
    totalLoss: 0.00,
    logs: []
  };

  function fmt(num) {
    const n = Number(num) || 0;
    return "$" + n.toFixed(2);
  }

  function netPL() {
    return state.totalProfit - state.totalLoss;
  }

  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 330px;
    max-width: 92vw;
    max-height: 86vh;
    overflow-y: auto;
    background: #090d16;
    color: #f8fafc;
    border: 1px solid #00f5d4;
    box-shadow: 0 0 24px rgba(0, 245, 212, 0.25), 0 14px 35px rgba(0, 0, 0, 0.75);
    border-radius: 14px;
    padding: 14px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 13px;
    z-index: 2147483647;
  `;

  function renderLockScreen(errorMsg) {
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:10px;border-bottom:1px solid #1e293b;margin-bottom:14px;">
        <div style="font-weight:700;font-size:14px;color:#00f5d4;">Access Lock</div>
        <button id="sim-close-btn" style="background:#ef4444;color:#fff;border:none;border-radius:8px;padding:4px 10px;font-weight:700;cursor:pointer;">✕</button>
      </div>

      <div style="text-align:center;margin-bottom:12px;">
        <div style="font-size:13px;font-weight:600;color:#e2e8f0;margin-bottom:4px;">পাসওয়ার্ড দিন</div>
        <div style="font-size:11px;color:#94a3b8;">প্যানেল আনলক করতে আপনার পাসওয়ার্ড লিখুন</div>
      </div>

      <input id="sim-pass-input" type="password" placeholder="Password লিখুন" style="width:100%;box-sizing:border-box;padding:9px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;margin-bottom:10px;text-align:center;">
      <button id="sim-unlock-btn" style="width:100%;padding:9px;border-radius:8px;border:none;background:#00f5d4;color:#041014;font-weight:700;cursor:pointer;">Unlock</button>

      ${errorMsg ? `<div id="sim-pass-err" style="margin-top:8px;text-align:center;font-size:12px;color:#f87171;">${errorMsg}</div>` : ""}
    `;

    document.getElementById("sim-close-btn").onclick = () => panel.remove();

    const tryUnlock = () => {
      const val = document.getElementById("sim-pass-input").value;
      if (val === ACCESS_PASS) {
        state.unlocked = true;
        renderDashboard();
      } else {
        renderLockScreen("ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।");
      }
    };

    document.getElementById("sim-unlock-btn").onclick = tryUnlock;
    document.getElementById("sim-pass-input").onkeydown = (e) => {
      if (e.key === "Enter") tryUnlock();
    };
  }

  function renderDashboard() {
    const net = netPL();
    const currentBal = state.activeView === "DEMO" ? state.demoBalance : state.liveBalance;

    const logHtml = state.logs.length === 0
      ? `<div style="color:#64748b;font-size:12px;text-align:center;padding:8px 0;">এখনো কোনো প্রফিট বা লস এন্ট্রি নেই</div>`
      : state.logs.slice().reverse().map((item) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;margin-bottom:5px;border-radius:8px;background:#111827;border-left:3px solid ${item.type === "WIN" ? "#22c55e" : "#ef4444"};">
            <div>
              <div style="font-weight:600;font-size:12px;color:${item.type === "WIN" ? "#4ade80" : "#f87171"};">
                ${item.type === "WIN" ? "PROFIT" : "LOSS"} (${item.mode})
              </div>
              <div style="font-size:11px;color:#94a3b8;">${item.time}</div>
            </div>
            <div style="font-weight:700;color:${item.type === "WIN" ? "#4ade80" : "#f87171"};">
              ${item.type === "WIN" ? "+" : "-"}${fmt(item.amount)}
            </div>
          </div>
        `).join("");

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:10px;border-bottom:1px solid #1e293b;margin-bottom:12px;">
        <div>
          <div style="font-weight:700;font-size:14px;color:#00f5d4;">Custom Session & Balance View</div>
          <div style="font-size:11px;color:#94a3b8;">Local Screen Simulation Only</div>
        </div>
        <button id="sim-close-btn" style="background:#ef4444;color:#fff;border:none;border-radius:8px;padding:4px 10px;font-weight:700;cursor:pointer;">✕</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
        <div id="card-demo" style="padding:10px;border-radius:10px;cursor:pointer;background:${state.activeView === "DEMO" ? "#0f292e" : "#111827"};border:1px solid ${state.activeView === "DEMO" ? "#00f5d4" : "#1e293b"};">
          <div style="font-size:11px;color:#94a3b8;">DEMO DISPLAY</div>
          <div style="font-size:16px;font-weight:700;margin-top:3px;color:#f8fafc;">${fmt(state.demoBalance)}</div>
        </div>
        <div id="card-live" style="padding:10px;border-radius:10px;cursor:pointer;background:${state.activeView === "LIVE" ? "#1e1b4b" : "#111827"};border:1px solid ${state.activeView === "LIVE" ? "#a855f7" : "#1e293b"};">
          <div style="font-size:11px;color:#94a3b8;">LIVE DISPLAY</div>
          <div style="font-size:16px;font-weight:700;margin-top:3px;color:#f8fafc;">${fmt(state.liveBalance)}</div>
        </div>
      </div>

      <button id="sim-swap-btn" style="width:100%;padding:7px;margin-bottom:12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-weight:600;cursor:pointer;">
        ⇄ Swap Demo & Live Balance Display
      </button>

      <div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">
        <div style="font-size:12px;font-weight:600;margin-bottom:8px;color:#cbd5e1;">Customize Balance (${state.activeView})</div>
        <div style="display:flex;gap:6px;">
          <input id="sim-custom-bal" type="number" step="0.01" value="${currentBal.toFixed(2)}" style="flex:1;padding:7px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;">
          <button id="sim-save-bal" style="padding:7px 12px;border-radius:8px;border:none;background:#00f5d4;color:#041014;font-weight:700;cursor:pointer;">Apply</button>
        </div>
      </div>

      <div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">
        <div style="font-size:12px;font-weight:600;margin-bottom:8px;color:#cbd5e1;">Add Profit / Loss ($)</div>
        <input id="sim-trade-amt" type="number" step="0.01" value="25.00" style="width:100%;box-sizing:border-box;padding:7px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;margin-bottom:8px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <button id="sim-add-win" style="padding:8px;border-radius:8px;border:none;background:#16a34a;color:#fff;font-weight:700;cursor:pointer;">+ Profit</button>
          <button id="sim-add-loss" style="padding:8px;border-radius:8px;border:none;background:#dc2626;color:#fff;font-weight:700;cursor:pointer;">- Loss</button>
        </div>
      </div>

      <div style="background:#111827;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-weight:700;font-size:12px;color:#00f5d4;">Session Leaderboard / Summary</span>
          <button id="sim-reset-btn" style="background:transparent;color:#94a3b8;border:1px solid #334155;border-radius:6px;padding:2px 7px;font-size:11px;cursor:pointer;">Reset</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center;margin-bottom:10px;">
          <div style="background:#020617;padding:6px;border-radius:8px;">
            <div style="font-size:10px;color:#94a3b8;">PROFIT</div>
            <div style="font-weight:700;color:#4ade80;font-size:12px;">+${fmt(state.totalProfit)}</div>
          </div>
          <div style="background:#020617;padding:6px;border-radius:8px;">
            <div style="font-size:10px;color:#94a3b8;">LOSS</div>
            <div style="font-weight:700;color:#f87171;font-size:12px;">-${fmt(state.totalLoss)}</div>
          </div>
          <div style="background:#020617;padding:6px;border-radius:8px;">
            <div style="font-size:10px;color:#94a3b8;">NET P/L</div>
            <div style="font-weight:700;color:${net >= 0 ? "#4ade80" : "#f87171"};font-size:12px;">
              ${net >= 0 ? "+" : "-"}${fmt(Math.abs(net))}
            </div>
          </div>
        </div>
        <div style="max-height:130px;overflow-y:auto;">
          ${logHtml}
        </div>
      </div>
    `;

    document.getElementById("sim-close-btn").onclick = () => panel.remove();
    document.getElementById("card-demo").onclick = () => { state.activeView = "DEMO"; renderDashboard(); };
    document.getElementById("card-live").onclick = () => { state.activeView = "LIVE"; renderDashboard(); };

    document.getElementById("sim-swap-btn").onclick = () => {
      const temp = state.demoBalance;
      state.demoBalance = state.liveBalance;
      state.liveBalance = temp;
      renderDashboard();
    };

    document.getElementById("sim-save-bal").onclick = () => {
      const val = parseFloat(document.getElementById("sim-custom-bal").value);
      if (isNaN(val)) return;
      if (state.activeView === "DEMO") state.demoBalance = val;
      else state.liveBalance = val;
      renderDashboard();
    };

    function applyResult(type) {
      const amt = parseFloat(document.getElementById("sim-trade-amt").value);
      if (isNaN(amt) || amt <= 0) return;

      if (type === "WIN") {
        state.totalProfit += amt;
        if (state.activeView === "DEMO") state.demoBalance += amt;
        else state.liveBalance += amt;
      } else {
        state.totalLoss += amt;
        if (state.activeView === "DEMO") state.demoBalance -= amt;
        else state.liveBalance -= amt;
      }

      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      state.logs.push({ type, amount: amt, mode: state.activeView, time: now });
      renderDashboard();
    }

    document.getElementById("sim-add-win").onclick = () => applyResult("WIN");
    document.getElementById("sim-add-loss").onclick = () => applyResult("LOSS");

    document.getElementById("sim-reset-btn").onclick = () => {
      state.totalProfit = 0;
      state.totalLoss = 0;
      state.logs = [];
      renderDashboard();
    };
  }

  document.body.appendChild(panel);
  renderLockScreen("");
})();
