// core.js — Tube Empire Core (Fixed Profile & Avatar)
class GameCore {
  constructor() {
    this.initTelegram();
    this.applyTheme(this.getTheme());
  }
  initTelegram() {
    try { const tg = window.Telegram?.WebApp; if (tg && tg.ready) { tg.ready(); tg.expand(); } } catch(e){}
  }
  getMoney() { let v = Number(localStorage.getItem("zeitarbeitMoney")); return isNaN(v) ? 0 : v; }
  setMoney(v) { localStorage.setItem("zeitarbeitMoney", Number(v) || 0); }
  getEnergy() { let v = Number(localStorage.getItem("zeitarbeitEnergy")); return isNaN(v) ? 0 : v; }
  setEnergy(v) { localStorage.setItem("zeitarbeitEnergy", Number(v) || 0); }
  
  getTheme() { return localStorage.getItem("freezzzTheme") || "dark"; }
  setTheme(t) { localStorage.setItem("freezzzTheme", t); this.applyTheme(t); }
  applyTheme(t) { 
    try { 
      document.documentElement.setAttribute('data-theme', t);
      if(document.body) document.body.setAttribute('data-theme', t);
    } catch(e){}
  }
  toggleTheme() { 
    let cur = this.getTheme();
    let next = cur === "dark" ? "rose" : (cur === "rose" ? "light" : "dark");
    this.setTheme(next); return next; 
  }

  getLang() { return localStorage.getItem("freezzzLang") || "ru"; }
  setLang(l) { localStorage.setItem("freezzzLang", l); }
  toggleLang() { 
    let cur = this.getLang();
    let next = cur === "ru" ? "de" : (cur === "de" ? "en" : "ru");
    this.setLang(next); return next; 
  }

  getSound() { return localStorage.getItem("freezzzSound") !== "false"; }
  toggleSound() {
    let cur = this.getSound();
    localStorage.setItem("freezzzSound", (!cur).toString());
    return !cur;
  }
  
  playSound(type = 'click') {
    if (!this.getSound()) return;
    try {
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      let osc = this.audioCtx.createOscillator(), g = this.audioCtx.createGain();
      let freq = type === 'buy' ? 740 : (type === 'cash' ? 880 : (type === 'error' ? 140 : 520));
      osc.type = type === 'error' ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      g.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);
      osc.connect(g); g.connect(this.audioCtx.destination);
      osc.start(); osc.stop(this.audioCtx.currentTime + 0.1);
    } catch(e){}
  }
  
  haptic(style = 'light') {
    try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style); } catch(e){}
  }

  // Надежное получение никнейма ( Telegram -> localStorage -> Дефолт )
  getUserName(def = "Блогер") {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        let name = tg.initDataUnsafe.user.username ? `@${tg.initDataUnsafe.user.username}` : tg.initDataUnsafe.user.first_name;
        if (name) return name;
      }
    } catch(e){}
    let saved = localStorage.getItem("tube_empire_custom_name");
    if (saved) return saved;
    return def;
  }

  // Строгое чтение индекса аватара из актуального каталога кастомизации
  getAvatarString() {
    try {
      let cfg = JSON.parse(localStorage.getItem("tube_empire_studio_config") || '{"avatar":0}');
      const avatars = ['👦','👧','🧑‍💻','🧑‍🎤','🥷','🤖','🦊','🧛','👻','👽','🚀','👑','😇','🧠','🦁'];
      let idx = Number(cfg.avatar);
      return avatars[isNaN(idx) ? 0 : idx] || '👦';
    } catch(e) { return '👦'; }
  }

  isItemUnlocked(cat, id, cost) {
    if (cost === 0) return true;
    return localStorage.getItem(`unlocked_${cat}_${id}`) === "true";
  }
  unlockItem(cat, id, cost) {
    if (this.isItemUnlocked(cat, id, cost)) return true;
    if (this.getMoney() >= cost) {
      this.setMoney(this.getMoney() - cost);
      localStorage.setItem(`unlocked_${cat}_${id}`, "true");
      this.playSound('buy'); this.haptic('heavy');
      return true;
    }
    this.playSound('error');
    return false;
  }
}
const Core = new GameCore();
