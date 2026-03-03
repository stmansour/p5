/*jshint esversion: 6 */
// Simple sound effects using Web Audio API (no asset files required).
class SISound {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (this.ctx) { return; }
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log("Sound not available:", e);
        }
    }

    beep(freq, duration, type) {
        if (!this.ctx) { this.init(); }
        if (!this.ctx) { return; }
        if (this.ctx.state === "suspended") { this.ctx.resume(); }
        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.value = freq;
        osc.type = type || "square";
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    }

    shoot() {
        this.beep(880, 0.05, "square");
    }

    invaderHit() {
        this.beep(440, 0.1, "square");
    }

    mysteryHit() {
        this.beep(660, 0.15, "square");
    }

    playerExplosion() {
        if (!this.ctx) { this.init(); }
        if (!this.ctx) { return; }
        if (this.ctx.state === "suspended") { this.ctx.resume(); }
        let duration = 0.4;
        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    }

    bunkerHit() {
        this.beep(120, 0.04, "square");
    }
}
