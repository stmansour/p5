/*jshint esversion: 6 */
// Arcade-style sound effects using Web Audio API (no asset files required).
class SISound {
    constructor() {
        this.ctx = null;
        this.master = null;
        this.noiseBuffer = null;
        this.marchStep = 0;
        this.nextMarchTime = 0;
        this.marchNotes = [55, 49, 44, 39];
        this.mysteryOsc = null;
        this.mysteryLfo = null;
    }

    init() {
        if (this.ctx) { return; }
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            let compressor = this.ctx.createDynamicsCompressor();
            compressor.threshold.value = -18;
            compressor.knee.value = 18;
            compressor.ratio.value = 8;
            compressor.attack.value = 0.003;
            compressor.release.value = 0.18;

            this.master = this.ctx.createGain();
            this.master.gain.value = 0.55;
            this.master.connect(compressor);
            compressor.connect(this.ctx.destination);
            this.noiseBuffer = this.createNoiseBuffer(1);
        } catch (e) {
            console.log("Sound not available:", e);
        }
    }

    ensureContext() {
        if (!this.ctx) { this.init(); }
        if (!this.ctx) { return false; }
        if (this.ctx.state === "suspended") { this.ctx.resume(); }
        return true;
    }

    createNoiseBuffer(duration) {
        let sampleRate = this.ctx.sampleRate;
        let buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate);
        let data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    envelope(gain, start, duration, volume) {
        gain.gain.cancelScheduledValues(start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    }

    tone(freq, duration, type, volume) {
        if (!this.ensureContext()) { return; }
        let now = this.ctx.currentTime;
        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.master);
        osc.type = type || "square";
        osc.frequency.value = freq;
        this.envelope(gain, now, duration, volume || 0.16);
        osc.start(now);
        osc.stop(now + duration);
    }

    sweep(startFreq, endFreq, duration, type, volume) {
        if (!this.ensureContext()) { return; }
        let now = this.ctx.currentTime;
        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.master);
        osc.type = type || "square";
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
        this.envelope(gain, now, duration, volume || 0.18);
        osc.start(now);
        osc.stop(now + duration);
    }

    noiseBurst(duration, volume, filterType, frequency) {
        if (!this.ensureContext()) { return; }
        let now = this.ctx.currentTime;
        let noise = this.ctx.createBufferSource();
        let filter = this.ctx.createBiquadFilter();
        let gain = this.ctx.createGain();
        noise.buffer = this.noiseBuffer;
        filter.type = filterType || "bandpass";
        filter.frequency.value = frequency || 900;
        filter.Q.value = 3;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.master);
        this.envelope(gain, now, duration, volume || 0.2);
        noise.start(now);
        noise.stop(now + duration);
    }

    updateInvaderMarch(activeInvaders, totalInvaders) {
        if (!this.ctx || this.ctx.state === "suspended") { return; }
        if (activeInvaders <= 0) { return; }

        let now = this.ctx.currentTime;
        let ratio = activeInvaders / totalInvaders;
        let interval = 0.16 + ratio * 0.56;
        if (now < this.nextMarchTime) { return; }

        let note = this.marchNotes[this.marchStep % this.marchNotes.length];
        this.tone(note, 0.075, "square", 0.09);
        this.marchStep++;
        this.nextMarchTime = now + interval;
    }

    shoot() {
        this.sweep(1450, 75, 0.14, "sawtooth", 0.19);
        this.noiseBurst(0.055, 0.08, "highpass", 1800);
    }

    invaderHit() {
        this.noiseBurst(0.13, 0.22, "bandpass", 420);
        this.sweep(260, 90, 0.12, "square", 0.09);
    }

    mysteryHit() {
        this.mysteryStop();
        this.sweep(900, 120, 0.22, "square", 0.18);
        this.noiseBurst(0.18, 0.14, "bandpass", 1100);
    }

    playerExplosion() {
        if (!this.ensureContext()) { return; }
        let now = this.ctx.currentTime;
        let duration = 0.65;
        let noise = this.ctx.createBufferSource();
        let filter = this.ctx.createBiquadFilter();
        let gain = this.ctx.createGain();
        noise.buffer = this.noiseBuffer;
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1600, now);
        filter.frequency.exponentialRampToValueAtTime(90, now + duration);
        filter.Q.value = 1.2;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.master);
        this.envelope(gain, now, duration, 0.34);
        noise.start(now);
        noise.stop(now + duration);
        this.sweep(130, 35, duration, "sawtooth", 0.16);
    }

    bunkerHit() {
        this.noiseBurst(0.055, 0.12, "bandpass", 220);
    }

    mysteryStart() {
        if (!this.ensureContext() || this.mysteryOsc) { return; }
        let now = this.ctx.currentTime;
        let osc = this.ctx.createOscillator();
        let lfo = this.ctx.createOscillator();
        let lfoGain = this.ctx.createGain();
        let gain = this.ctx.createGain();

        osc.type = "square";
        osc.frequency.value = 520;
        lfo.type = "triangle";
        lfo.frequency.value = 8;
        lfoGain.gain.value = 80;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        osc.connect(gain);
        gain.connect(this.master);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);

        osc.start(now);
        lfo.start(now);
        this.mysteryOsc = { osc: osc, gain: gain };
        this.mysteryLfo = lfo;
    }

    mysteryStop() {
        if (!this.ctx || !this.mysteryOsc) { return; }
        let now = this.ctx.currentTime;
        this.mysteryOsc.gain.gain.cancelScheduledValues(now);
        this.mysteryOsc.gain.gain.setValueAtTime(this.mysteryOsc.gain.gain.value || 0.0001, now);
        this.mysteryOsc.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        this.mysteryOsc.osc.stop(now + 0.06);
        this.mysteryLfo.stop(now + 0.06);
        this.mysteryOsc = null;
        this.mysteryLfo = null;
    }
}
