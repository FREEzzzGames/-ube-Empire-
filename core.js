// core.js — Tube Empire Core with YouTube Algorithm Trends
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

  // --- СИСТЕМА ТРЕНДОВ АЛГОРИТМОВ YOUTUBE ---
  initTrendsSystem() {
    let trendData = JSON.parse(localStorage.getItem("tube_empire_trend") || "null");
    let now = Date.now();
    // Если тренда нет или он устарел (живет 3 минуты = 180000 мс)
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
        expiresAt: now + 180000 // 3 минуты тренд актуален
      };
      localStorage.setItem("tube_empire_trend", JSON.stringify(trendData));
    }
  }

  getCurrentTrend() {
    this.initTrendsSystem();
    try {
      return JSON.parse(localStorage.getItem("tube_empire_trend"));
    } catch(e) {
      return { name: "🎮 Gaming", mult: 2.0, icon: "🔥", expiresAt: Date.now() + 180000 };
    }
  }

  getTrendMultiplier() {
    let trend = this.getCurrentTrend();
    return trend ? trend.mult : 1.0;
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
