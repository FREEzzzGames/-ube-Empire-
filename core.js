// core.js — Tube Empire Core (v4 with Corporate Holdings)
class GameCore {
  constructor() {
    this.initTelegram();
    this.applyTheme(this.getTheme());
    this.initTrendsSystem();
  }
  initTelegram() {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg && typeof tg.ready === 'function') { tg.ready(); tg.expand(); }
    } catch(e) {}
  }
  getMoney() { 
    let val = Number(localStorage.getItem("zeitarbeitMoney"));
    return isNaN(val) ? 0 : val; 
  }
  setMoney(val) { localStorage.setItem("zeitarbeitMoney", Number(val) || 0); }
  
  getEnergy() { 
    let val = Number(localStorage.getItem("zeitarbeitEnergy"));
    return isNaN(val) ? 0 : val; 
  }
  setEnergy(val) { localStorage.setItem("zeitarbeitEnergy", Number(val) || 0); }

  getTheme() { return localStorage.getItem("freezzzTheme") || "dark"; }
  setTheme(theme) { localStorage.setItem("freezzzTheme", theme); this.applyTheme(theme); }
  applyTheme(theme) { 
    try { document.body.setAttribute('data-theme', theme); } catch(e){}
  }
  toggleTheme() {
    let cur = this.getTheme();
    let next = cur === "dark" ? "rose" : (cur === "rose" ? "light" : "dark");
    this.setTheme(next);
    return next;
  }

  getLang() { return localStorage.getItem("freezzzLang") || "ru"; }
  setLang(lang) { localStorage.setItem("freezzzLang", lang); }
  toggleLang() {
    let cur = this.getLang();
    let next = cur === "ru" ? "de" : (cur === "de" ? "en" : "ru");
    this.setLang(next);
    return next;
  }

  getSound() { return localStorage.getItem("freezzzSound") !== "false"; }
  toggleSound() {
    let state = !this.getSound();
    localStorage.setItem("freezzzSound", state);
    return state;
  }

  playSound(freq = 520, type = 'square', duration = 0.08) {
    if (!this.getSound()) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (this.audioCtx) {
        let osc = this.audioCtx.createOscillator(), gain = this.audioCtx.createGain();
        osc.type = type; osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
        osc.connect(gain); gain.connect(this.audioCtx.destination);
        osc.start(); osc.stop(this.audioCtx.currentTime + duration);
      }
    } catch(e) {}
  }

  haptic(style = 'light') {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      try { window.Telegram.WebApp.HapticFeedback.impactOccurred(style); } catch(e){}
    }
  }

  // --- СИСТЕМА ТРЕНДОВ АЛГОРИТМОВ ---
  initTrendsSystem() {
    let trendData = JSON.parse(localStorage.getItem("tube_empire_trend") || "null");
    let now = Date.now();
    if (!trendData || now > trendData.expiresAt) {
      const trends = [
        { name: "🎮 Gaming Challenge", mult: 2.0, icon: "🔥" },
        { name: "🎧 ASMR / Podcast", mult: 1.5, icon: "✨" },
        { name: "🚀 Viral Shorts / Reels", mult: 3.0, icon: "⚡" },
        { name: "💡 Tech Review & Setup", mult: 1.8, icon: "💎" }
      ];
      let selected = trends[Math.floor(Math.random() * trends.length)];
      trendData = {
        name: selected.name,
        mult: selected.mult,
        icon: selected.icon,
        expiresAt: now + 180000 
      };
      localStorage.setItem("tube_empire_trend", JSON.stringify(trendData));
    }
  }

  getCurrentTrend() {
    this.initTrendsSystem();
    try { return JSON.parse(localStorage.getItem("tube_empire_trend")); } 
    catch(e) { return { name: "🎮 Gaming", mult: 2.0, icon: "🔥", expiresAt: Date.now() + 180000 }; }
  }

  getTrendMultiplier() {
    let trend = this.getCurrentTrend();
    return trend ? trend.mult : 1.0;
  }

  // --- КОРПОРАТИВНЫЕ АКТИВЫ (БИЗНЕСЫ) ---
  getCorporationAssets() {
    return [
      { id: 'corp_merch', cost: 50000, incomePerSec: 15, icon: '👕', name: { ru: 'Мерч-магазин', de: 'Merch Shop', en: 'Merch Shop' } },
      { id: 'corp_agency', cost: 500000, incomePerSec: 120, icon: '📈', name: { ru: 'Рекламное агентство', de: 'Werbeagentur', en: 'Ad Agency' } },
      { id: 'corp_esports', cost: 5000000, incomePerSec: 950, icon: '🎮', name: { ru: 'Киберспортивный клуб', de: 'eSports Team', en: 'eSports Club' } },
      { id: 'corp_soft', cost: 50000000, incomePerSec: 7500, icon: '💻', name: { ru: 'Студия софта и игр', de: 'Software-Studio', en: 'Game Studio' } },
      { id: 'corp_conglomerate', cost: 1000000000, incomePerSec: 65000, icon: '🌐', name: { ru: 'Медиа-Конгломерат', de: 'Medien-Konglomerat', en: 'Media Conglomerate' } }
    ];
  }

  getTotalCorporationIncome() {
    let assets = this.getCorporationAssets();
    let total = 0;
    assets.forEach(asset => {
      if (localStorage.getItem(asset.id) === "true") {
        total += asset.incomePerSec;
      }
    });
    return total;
  }

  buyCorporationAsset(id) {
    let assets = this.getCorporationAssets();
    let asset = assets.find(a => a.id === id);
    if (!asset) return false;
    if (localStorage.getItem(id) === "true") return false; // Уже куплено

    let money = this.getMoney();
    if (money >= asset.cost) {
      money -= asset.cost;
      this.setMoney(money);
      localStorage.setItem(id, "true");
      return true;
    }
    return false;
  }

  isAssetOwned(id) {
    return localStorage.getItem(id) === "true";
  }

  getAvatarString() {
    try {
      let s = JSON.parse(localStorage.getItem("tube_empire_avatar_config"));
      if(!s) return "👦\n👤\n👕\n👖";
      let o = {
        gender: ['👦','👧'],
        head: ['👤','🧢','🎧','🕶️','👑'],
        torso: ['👕','🧥','👔','🥼','👚'],
        legs: ['👖','🩳','🏃','👗','🥻'],
        accessory: ['❌','🎙️','📷','📱','💵']
      };
      let g = o.gender[s.gender||0] || '👦';
      let h = o.head[s.head||0] || '👤';
      let t = o.torso[s.torso||0] || '👕';
      let l = o.legs[s.legs||0] || '👖';
      let acc = o.accessory[s.accessory||0] || '❌';
      return `${g} ${h} ${t} ${l}` + (acc !== '❌' ? ` ${acc}` : '');
    } catch(e) { return "👦 👤 👕 👖"; }
  }

  getUserName(def = "TUBE EMPIRE") {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        return tg.initDataUnsafe.user.first_name || tg.initDataUnsafe.user.username || def;
      }
    } catch(e){}
    return def;
  }
}
const Core = new GameCore();
