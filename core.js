// core.js — Единое ядро Tube Empire
class GameCore {
  constructor() {
    this.initTelegram();
    this.applyTheme(this.getTheme());
  }
  initTelegram() {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.ready) { tg.ready(); tg.expand(); }
  }
  getMoney() { return Number(localStorage.getItem("zeitarbeitMoney") || 0); }
  setMoney(val) { localStorage.setItem("zeitarbeitMoney", val); }
  getEnergy() { return Number(localStorage.getItem("zeitarbeitEnergy") || 0); }
  setEnergy(val) { localStorage.setItem("zeitarbeitEnergy", val); }
  getTheme() { return localStorage.getItem("freezzzTheme") || "dark"; }
  setTheme(theme) { localStorage.setItem("freezzzTheme", theme); this.applyTheme(theme); }
  applyTheme(theme) { document.body.setAttribute('data-theme', theme); }
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
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      let osc = this.audioCtx.createOscillator(), gain = this.audioCtx.createGain();
      osc.type = type; osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain); gain.connect(this.audioCtx.destination);
      osc.start(); osc.stop(this.audioCtx.currentTime + duration);
    } catch(e) {}
  }
  haptic(style = 'light') {
    if (this.getSound() && window.Telegram?.WebApp?.HapticFeedback) {
      try { window.Telegram.WebApp.HapticFeedback.impactOccurred(style); } catch(e){}
    }
  }
  getAvatarString() {
    try {
      let s = JSON.parse(localStorage.getItem("tube_empire_avatar_config"));
      if(!s) return "👦👤👕👖";
      let o = {
        gender: ['👦','👧'],
        head: ['👤','🧢','🎧','🕶️','👑'],
        torso: ['👕','🧥','👔','🥼','👚'],
        legs: ['👖','🩳','🏃','👗','🥻'],
        accessory: ['❌','🎙️','📷','📱','💵']
      };
      let a = o.gender[s.gender||0] + o.head[s.head||0] + o.torso[s.torso||0] + o.legs[s.legs||0];
      let acc = o.accessory[s.accessory||0];
      return a + (acc !== '❌' ? acc : '');
    } catch(e) { return "👦👤👕👖"; }
  }
  getUserName(def = "TUBE EMPIRE PRO") {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      return tg.initDataUnsafe.user.first_name || tg.initDataUnsafe.user.username || def;
    }
    return def;
  }
}
const Core = new GameCore();
