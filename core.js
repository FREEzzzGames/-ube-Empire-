// core.js — Tube Empire Central Core (v2)
class GameCore {
  constructor() {
    this.initTelegram();
    this.applyTheme(this.getTheme());
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
