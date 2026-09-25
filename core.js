// core.js — Tube Empire Core (v5.8 Full Architecture)
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
    try { 
      document.documentElement.setAttribute('data-theme', theme);
      if(document.body) document.body.setAttribute('data-theme', theme); 
    } catch(e){}
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
  playSound(type = 'click') {
    if (!this.getSound()) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') this.audioCtx.resume();
      if (this.audioCtx) {
        let osc = this.audioCtx.createOscillator(), gain = this.audioCtx.createGain();
        let freq = 520, dur = 0.08, oscType = 'square';
        if (type === 'tap') { freq = 580; dur = 0.05; oscType = 'triangle'; }
        else if (type === 'buy') { freq = 740; dur = 0.12; oscType = 'square'; }
        else if (type === 'error') { freq = 140; dur = 0.18; oscType = 'sawtooth'; }
        else if (type === 'cash') { freq = 880; dur = 0.2; oscType = 'square'; }
        else if (type === 'modal') { freq = 440; dur = 0.08; oscType = 'sine'; }

        osc.type = oscType; osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + dur);
        osc.connect(gain); gain.connect(this.audioCtx.destination);
        osc.start(); osc.stop(this.audioCtx.currentTime + dur);
      }
    } catch(e) {}
  }

  haptic(style = 'light') {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      try { window.Telegram.WebApp.HapticFeedback.impactOccurred(style); } catch(e){}
    }
  }

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
      trendData = { name: selected.name, mult: selected.mult, icon: selected.icon, expiresAt: now + 180000 };
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

  checkOfflineEarnings(eurPerSec, energyPerSec) {
    let lastActive = Number(localStorage.getItem("tube_empire_last_active") || 0);
    let now = Date.now();
    localStorage.setItem("tube_empire_last_active", now);
    if (!lastActive) return null;
    let diffSeconds = Math.floor((now - lastActive) / 1000);
    if (diffSeconds < 30 || diffSeconds > 86400) return null;
    let effectiveSeconds = Math.min(diffSeconds, 28800);
    let earnedMoney = effectiveSeconds * eurPerSec;
    let earnedEnergy = effectiveSeconds * energyPerSec;
    if (earnedMoney <= 0 && earnedEnergy <= 0) return null;
    this.setMoney(this.getMoney() + earnedMoney);
    this.setEnergy(this.getEnergy() + earnedEnergy);
    return { seconds: effectiveSeconds, money: earnedMoney, energy: earnedEnergy };
  }

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
      if (localStorage.getItem(asset.id) === "true") total += asset.incomePerSec;
    });
    return total;
  }

  isAssetOwned(id) { return localStorage.getItem(id) === "true"; }

  getAvatarString() {
    try {
      let s = JSON.parse(localStorage.getItem("tube_empire_avatar_config"));
      if(!s) return "👦";
      return ['👦','👧'][s.gender || 0] || '👦';
    } catch(e) { return "👦"; }
  }

  getUserName(def = "Блогер") {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        return tg.initDataUnsafe.user.username ? `@${tg.initDataUnsafe.user.username}` : (tg.initDataUnsafe.user.first_name || def);
      }
    } catch(e){}
    return localStorage.getItem("tube_empire_custom_name") || def;
  }
}
const Core = new GameCore();
