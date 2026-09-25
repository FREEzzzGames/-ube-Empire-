class GameEconomy {
  constructor() {
    this.initTrendsSystem();
  }
  initTrendsSystem() {
    let td = JSON.parse(localStorage.getItem("tube_empire_trend") || "null");
    let now = Date.now();
    if (!td || now > td.expiresAt) {
      const trends = [
        { name: "🎮 Gaming Challenge", mult: 2.0, icon: "🔥" },
        { name: "🎧 ASMR / Podcast", mult: 1.5, icon: "✨" },
        { name: "🚀 Viral Shorts", mult: 3.0, icon: "⚡" },
        { name: "💡 Tech Review", mult: 1.8, icon: "💎" }
      ];
      let sel = trends[Math.floor(Math.random() * trends.length)];
      td = { name: sel.name, mult: sel.mult, icon: sel.icon, expiresAt: now + 180000 };
      localStorage.setItem("tube_empire_trend", JSON.stringify(td));
    }
  }
  getCurrentTrend() {
    this.initTrendsSystem();
    try { return JSON.parse(localStorage.getItem("tube_empire_trend")); } 
    catch(e) { return { name: "🎮 Gaming", mult: 2.0, icon: "🔥", expiresAt: Date.now() + 180000 }; }
  }
  getTrendMultiplier() { return this.getCurrentTrend().mult; }

  checkOfflineEarnings(eurPerSec, energyPerSec) {
    let last = Number(localStorage.getItem("tube_empire_last_active") || 0);
    let now = Date.now();
    localStorage.setItem("tube_empire_last_active", now);
    if (!last) return null;
    let diff = Math.floor((now - last) / 1000);
    if (diff < 30 || diff > 86400) return null;
    let eff = Math.min(diff, 28800);
    let m = eff * eurPerSec, e = eff * energyPerSec;
    if (m <= 0 && e <= 0) return null;
    Core.setMoney(Core.getMoney() + m);
    Core.setEnergy(Core.getEnergy() + e);
    return { seconds: eff, money: m, energy: e };
  }

  getCorporationAssets() {
    return [
      { id: 'corp_merch', cost: 50000, incomePerSec: 15 },
      { id: 'corp_agency', cost: 500000, incomePerSec: 120 },
      { id: 'corp_esports', cost: 5000000, incomePerSec: 950 },
      { id: 'corp_soft', cost: 50000000, incomePerSec: 7500 },
      { id: 'corp_conglomerate', cost: 1000000000, incomePerSec: 65000 }
    ];
  }
  getTotalCorporationIncome() {
    let total = 0;
    this.getCorporationAssets().forEach(a => {
      if (localStorage.getItem(a.id) === "true") total += a.incomePerSec;
    });
    return total;
  }
}
const Economy = new GameEconomy();
