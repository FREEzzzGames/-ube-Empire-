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
  applyTheme(t) { try { document.documentElement.setAttribute('data-theme', t); } catch(e){} }
  toggleTheme() { let n = this.getTheme() === "dark" ? "rose" : (this.getTheme() === "rose" ? "light" : "dark"); this.setTheme(n); return n; }

  getLang() { return localStorage.getItem("freezzzLang") || "ru"; }
  setLang(l) { localStorage.setItem("freezzzLang", l); }
  toggleLang() { let n = this.getLang() === "ru" ? "de" : (this.getLang() === "de" ? "en" : "ru"); this.setLang(n); return n; }

  getSound() { return localStorage.getItem("freezzzSound") !== "false"; }
  playSound(type = 'click') {
    if (!this.getSound()) return;
    try {
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      let osc = this.audioCtx.createOscillator(), g = this.audioCtx.createGain();
      let freq = type === 'buy' ? 740 : (type === 'cash' ? 880 : 520);
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
