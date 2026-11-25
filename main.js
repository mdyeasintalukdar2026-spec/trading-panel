(function () {
  if (document.getElementById("custom-sim-overlay")) return;

  const state = {
    modeLabel: "Practice Mode",
    balance: 1000.00,
    profit: 0.00,
    loss: 0.00,
    trades: []
  };

  const box = document.createElement("div");
  box.id = "custom-sim-overlay";
  box.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 280px;
    background: #111827;
    color: #f9fafb;
    border: 1px solid #374151;
    border-radius: 12px;
    padding: 14px;
    font-family: system-ui, sans-serif;
    font-size: 13px;
    z-index: 999999;
    box-shadow: 0 10px 25px rgba(0,0,0,0.45);
  `;

  function netResult() {
    return state.profit - state.loss;
  }

  function render() {
    const net = netResult();
    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <strong>Custom Session Tracker</strong>
        <button id="sim-close" style="background:#ef4444;color:#fff;border:none;border-radius:6px;padding:2px 8px;cursor:pointer;">X</button>
      </div>

      <div style="background:#1f2937;padding:10px;border-radius:8px;margin-bottom:10px;">
        <div style="font-size:11px;color:#9ca3af;">${state.modeLabel}</div>
        <div id="sim-balance-view" style="font-size:20px;font-weight:700;margin-top:2px;">$${state.balance.toFixed(2)}</div>
      </div>

      <label style="display:block;font-size:11px;color:#9ca3af;margin-bottom:4px;">Set Display Balance ($)</label>
      <div style="display:flex;gap:6px;margin-bottom:10px;">
        <input id="sim-bal-input" type="number" step="0.01" value="${state.balance}" style="flex:1;padding:6px;border-radius:6px;border:1px solid #4b5563;background:#030712;color:#fff;">
        <button id="sim-set-bal" style="padding:6px 10px;border:none;border-radius:6px;background:#2563eb;color:#fff;cursor:pointer;">Set</button>
      </div>

      <label style="display:block;font-size:11px;color:#9ca3af;margin-bottom:4px;">Trade Amount ($)</label>
      <input id="sim-amt-input" type="number" step="0.01" value="50" style="width:100%;box-sizing:border-box;padding:6px;border-radius:6px;border:1px solid #4b5563;background:#030712;color:#fff;margin-bottom:8px;">

      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <button id="sim-win" style="flex:1;padding:7px;border:none;border-radius:6px;background:#16a34a;color:#fff;font-weight:600;cursor:pointer;">+ Profit</button>
        <button id="sim-lose" style="flex:1;padding:7px;border:none;border-radius:6px;background:#dc2626;color:#fff;font-weight:600;cursor:pointer;">- Loss</button>
      </div>

      <div style="background:#1f2937;padding:10px;border-radius:8px;">
        <div style="font-weight:600;margin-bottom:6px;">Local Session Summary</div>
        <div>Total Profit: <span style="color:#4ade80;">+$${state.profit.toFixed(2)}</span></div>
        <div>Total Loss: <span style="color:#f87171;">-$${state.loss.toFixed(2)}</span></div>
        <div style="margin-top:4px;font-weight:700;">
          Net P/L: <span style="color:${net >= 0 ? "#4ade80" : "#f87171"};">${net >= 0 ? "+" : ""}$${net.toFixed(2)}</span>
        </div>
      </div>
    `;

    document.getElementById("sim-close").onclick = () => box.remove();

    document.getElementById("sim-set-bal").onclick = () => {
      const val = parseFloat(document.getElementById("sim-bal-input").value);
      if (!isNaN(val)) {
        state.balance = val;
        render();
      }
    };

    document.getElementById("sim-win").onclick = () => {
      const amt = parseFloat(document.getElementById("sim-amt-input").value);
      if (!isNaN(amt) && amt > 0) {
        state.profit += amt;
        state.balance += amt;
        render();
      }
    };

    document.getElementById("sim-lose").onclick = () => {
      const amt = parseFloat(document.getElementById("sim-amt-input").value);
      if (!isNaN(amt) && amt > 0) {
        state.loss += amt;
        state.balance -= amt;
        render();
      }
    };
  }

  document.body.appendChild(box);
  render();
})();
