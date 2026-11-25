(function () {
  const PANEL_ID = "custom-control-panel-root";
  const prev = document.getElementById(PANEL_ID);
  if (prev) prev.remove();

  const CONFIG = {
    panelTitle: "Control Panel",
    password: "12345678",
    demoBalance: 1000.00,
    liveBalance: 500.00
  };

  const state = {
    unlocked: false,
    title: CONFIG.panelTitle,
    activePassword: CONFIG.password,
    demoBalance: CONFIG.demoBalance,
    liveBalance: CONFIG.liveBalance,
    activeMode: "DEMO",
    totalProfit: 0.00,
    totalLoss: 0.00,
    entries: []
  };

  function money(n) {
    const val = Number(n) || 0;
    return "$" + val.toFixed(2);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const root = document.createElement("div");
  root.id = PANEL_ID;
  root.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 335px;
    max-width: 92vw;
    max-height: 86vh;
    overflow-y: auto;
    background: #070b14;
    color: #f1f5f9;
    border: 1px solid #22d3ee;
    box-shadow: 0 0 26px rgba(34, 211, 238, 0.22), 0 16px 36px rgba(0, 0, 0, 0.8);
    border-radius: 14px;
    padding: 14px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 13px;
    z-index: 2147483647;
  `;

  function showLock(errorText) {
    root.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:10px;border-bottom:1px solid #1e293b;margin-bottom:14px;">
        <span style="font-weight:700;font-size:14px;color:#22d3ee;">${escapeHtml(state.title)}</span>
        <button id="cp-close" style="background:#ef4444;color:#fff;border:none;border-radius:7px;padding:4px 9px;font-weight:700;cursor:pointer;">✕</button>
      </div>

      <div style="text-align:center;margin-bottom:12px;">
        <div style="font-weight:600;margin-bottom:4px;">পাসওয়ার্ড দিন</div>
        <div style="font-size:11px;color:#94a3b8;">প্যানেলটি ওপেন করতে পাসওয়ার্ড লিখুন</div>
      </div>

      <input id="cp-pass-input" type="password" placeholder="Password" style="width:100%;box-sizing:border-box;padding:9px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;margin-bottom:10px;text-align:center;">
      <button id="cp-unlock" style="width:100%;padding:9px;border-radius:8px;border:none;background:#22d3ee;color:#031218;font-weight:700;cursor:pointer;">Unlock</button>

      ${errorText ? `<div style="margin-top:8px;text-align:center;color:#f87171;font-size:12px;">${escapeHtml(errorText)}</div>` : ""}
    `;

    document.getElementById("cp-close").onclick = () => root.remove();

    const checkPass = () => {
      const entered = document.getElementById("cp-pass-input").value;
      if (entered === state.activePassword) {
        state.unlocked = true;
        showPanel();
      } else {
        showLock("পাসওয়ার্ড ভুল হয়েছে।");
      }
    };

    document.getElementById("cp-unlock").onclick = checkPass;
    document.getElementById("cp-pass-input").onkeydown = (e) => {
      if (e.key === "Enter") checkPass();
    };
  }

  function showPanel() {
    const net = state.totalProfit - state.totalLoss;
    const selectedBalance = state.activeMode === "DEMO" ? state.demoBalance : state.liveBalance;

    const listHtml = state.entries.length === 0
      ? `<div style="text-align:center;color:#64748b;font-size:12px;padding:8px 0;">কোনো এন্ট্রি নেই</div>`
      : state.entries.slice().reverse().map((row) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;margin-bottom:5px;border-radius:8px;background:#0f172a;border-left:3px solid ${row.kind === "PROFIT" ? "#22c55e" : "#ef4444"};">
            <div>
              <div style="font-size:12px;font-weight:700;color:${row.kind === "PROFIT" ? "#4ade80" : "#f87171"};">${row.kind} (${row.mode})</div>
              <div style="font-size:11px;color:#94a3b8;">${row.time}</div>
            </div>
            <div style="font-weight:700;color:${row.kind === "PROFIT" ? "#4ade80" : "#f87171"};">
              ${row.kind === "PROFIT" ? "+" : "-"}${money(row.amount)}
            </div>
          </div>
        `).join("");

    root.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:10px;border-bottom:1px solid #1e293b;margin-bottom:12px;">
        <span style="font-weight:700;font-size:14px;color:#22d3ee;">${escapeHtml(state.title)}</span>
        <button id="cp-close" style="background:#ef4444;color:#fff;border:none;border-radius:7px;padding:4px 9px;font-weight:700;cursor:pointer;">✕</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
        <div id="mode-demo" style="padding:10px;border-radius:10px;cursor:pointer;background:${state.activeMode === "DEMO" ? "#0e2938" : "#0f172a"};border:1px solid ${state.activeMode === "DEMO" ? "#22d3ee" : "#1e293b"};">
          <div style="font-size:11px;color:#94a3b8;">DEMO</div>
          <div style="font-size:16px;font-weight:700;margin-top:3px;">${money(state.demoBalance)}</div>
        </div>
        <div id="mode-live" style="padding:10px;border-radius:10px;cursor:pointer;background:${state.activeMode === "LIVE" ? "#251846" : "#0f172a"};border:1px solid ${state.activeMode === "LIVE" ? "#c084fc" : "#1e293b"};">
          <div style="font-size:11px;color:#94a3b8;">LIVE</div>
          <div style="font-size:16px;font-weight:700;margin-top:3px;">${money(state.liveBalance)}</div>
        </div>
      </div>

      <button id="cp-swap" style="width:100%;padding:7px;margin-bottom:12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f8fafc;font-weight:600;cursor:pointer;">
        ⇄ Swap DEMO & LIVE Balance
      </button>

      <div style="background:#0f172a;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">
        <div style="font-size:12px;font-weight:600;margin-bottom:6px;color:#cbd5e1;">Set ${state.activeMode} Balance ($)</div>
        <div style="display:flex;gap:6px;">
          <input id="cp-bal-input" type="number" step="0.01" value="${selectedBalance.toFixed(2)}" style="flex:1;padding:7px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;">
          <button id="cp-bal-save" style="padding:7px 12px;border-radius:8px;border:none;background:#22d3ee;color:#031218;font-weight:700;cursor:pointer;">Save</button>
        </div>
      </div>

      <div style="background:#0f172a;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">
        <div style="font-size:12px;font-weight:600;margin-bottom:6px;color:#cbd5e1;">Profit / Loss Entry ($)</div>
        <input id="cp-pl-input" type="number" step="0.01" value="50.00" style="width:100%;box-sizing:border-box;padding:7px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;margin-bottom:8px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <button id="cp-win" style="padding:8px;border-radius:8px;border:none;background:#16a34a;color:#fff;font-weight:700;cursor:pointer;">+ Profit</button>
          <button id="cp-loss" style="padding:8px;border-radius:8px;border:none;background:#dc2626;color:#fff;font-weight:700;cursor:pointer;">- Loss</button>
        </div>
      </div>

      <div style="background:#0f172a;padding:10px;border-radius:10px;border:1px solid #1e293b;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-weight:700;font-size:12px;color:#22d3ee;">Leaderboard / Session Summary</span>
          <button id="cp-clear" style="background:transparent;color:#94a3b8;border:1px solid #334155;border-radius:6px;padding:2px 7px;font-size:11px;cursor:pointer;">Clear</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center;margin-bottom:10px;">
          <div style="background:#020617;padding:6px;border-radius:8px;">
            <div style="font-size:10px;color:#94a3b8;">PROFIT</div>
            <div style="font-weight:700;color:#4ade80;font-size:12px;">+${money(state.totalProfit)}</div>
          </div>
          <div style="background:#020617;padding:6px;border-radius:8px;">
            <div style="font-size:10px;color:#94a3b8;">LOSS</div>
            <div style="font-weight:700;color:#f87171;font-size:12px;">-${money(state.totalLoss)}</div>
          </div>
          <div style="background:#020617;padding:6px;border-radius:8px;">
            <div style="font-size:10px;color:#94a3b8;">NET</div>
            <div style="font-weight:700;color:${net >= 0 ? "#4ade80" : "#f87171"};font-size:12px;">
              ${net >= 0 ? "+" : "-"}${money(Math.abs(net))}
            </div>
          </div>
        </div>
        <div style="max-height:130px;overflow-y:auto;">
          ${listHtml}
        </div>
      </div>

      <div style="background:#0f172a;padding:10px;border-radius:10px;border:1px solid #1e293b;">
        <div style="font-size:12px;font-weight:600;margin-bottom:6px;color:#cbd5e1;">Customize Panel Title & Password</div>
        <input id="cp-title-input" type="text" value="${escapeHtml(state.title)}" placeholder="Panel Title" style="width:100%;box-sizing:border-box;padding:6px;border-radius:7px;border:1px solid #334155;background:#020617;color:#fff;margin-bottom:6px;">
        <div style="display:flex;gap:6px;">
          <input id="cp-newpass-input" type="text" value="${escapeHtml(state.activePassword)}" placeholder="New Password" style="flex:1;padding:6px;border-radius:7px;border:1px solid #334155;background:#020617;color:#fff;">
          <button id="cp-meta-save" style="padding:6px 12px;border-radius:7px;border:none;background:#3b82f6;color:#fff;font-weight:700;cursor:pointer;">Update</button>
        </div>
      </div>
    `;

    document.getElementById("cp-close").onclick = () => root.remove();
    document.getElementById("mode-demo").onclick = () => { state.activeMode = "DEMO"; showPanel(); };
    document.getElementById("mode-live").onclick = () => { state.activeMode = "LIVE"; showPanel(); };

    document.getElementById("cp-swap").onclick = () => {
      const tmp = state.demoBalance;
      state.demoBalance = state.liveBalance;
      state.liveBalance = tmp;
      showPanel();
    };

    document.getElementById("cp-bal-save").onclick = () => {
      const val = parseFloat(document.getElementById("cp-bal-input").value);
      if (isNaN(val)) return;
      if (state.activeMode === "DEMO") state.demoBalance = val;
      else state.liveBalance = val;
      showPanel();
    };

    function recordEntry(kind) {
      const amt = parseFloat(document.getElementById("cp-pl-input").value);
      if (isNaN(amt) || amt <= 0) return;

      if (kind === "PROFIT") {
        state.totalProfit += amt;
        if (state.activeMode === "DEMO") state.demoBalance += amt;
        else state.liveBalance += amt;
      } else {
        state.totalLoss += amt;
        if (state.activeMode === "DEMO") state.demoBalance -= amt;
        else state.liveBalance -= amt;
      }

      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      state.entries.push({ kind, amount: amt, mode: state.activeMode, time });
      showPanel();
    }

    document.getElementById("cp-win").onclick = () => recordEntry("PROFIT");
    document.getElementById("cp-loss").onclick = () => recordEntry("LOSS");

    document.getElementById("cp-clear").onclick = () => {
      state.totalProfit = 0;
      state.totalLoss = 0;
      state.entries = [];
      showPanel();
    };

    document.getElementById("cp-meta-save").onclick = () => {
      const nextTitle = document.getElementById("cp-title-input").value.trim();
      const nextPass = document.getElementById("cp-newpass-input").value;
      if (nextTitle) state.title = nextTitle;
      if (nextPass.length > 0) state.activePassword = nextPass;
      showPanel();
    };
  }

  document.body.appendChild(root);
  showLock("");
})();
