import { useSyncExternalStore } from "react";

export type TrackId = "tidal" | "nightdrive";

export interface TrackInfo {
  id: TrackId;
  name: string;
  tagline: string;
  description: string;
  tempo: string;
  mood: string;
}

export const TRACKS: TrackInfo[] = [
  {
    id: "tidal",
    name: "Tidal",
    tagline: "Soft, breathing pads",
    description:
      "Slow-moving chords and airy bells that swell and recede like water. Built for quiet rooms and long stares at the object in front of you.",
    tempo: "Ambient · slow",
    mood: "Calm",
  },
  {
    id: "nightdrive",
    name: "Night Drive",
    tagline: "Low-slung chill beat",
    description:
      "A mellow kick, warm bass and muted stabs — a late-night pulse that makes the robot feel like it just switched on.",
    tempo: "88 BPM · lo-fi",
    mood: "Energetic",
  },
];

type Listener = () => void;

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private padBus: BiquadFilterNode | null = null;
  private padLfo: OscillatorNode | null = null;
  private bassBus: BiquadFilterNode | null = null;

  private track: TrackId | null = null;
  private timer: number | null = null;
  private bar = 0;
  private nextTime = 0;
  private listeners = new Set<Listener>();

  subscribe = (cb: Listener) => {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  };

  getCurrent = () => this.track;

  private emit() {
    this.listeners.forEach((cb) => cb());
  }

  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) throw new Error("Web Audio is not supported on this device");
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private getNoise(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuffer) {
      const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buf;
    }
    return this.noiseBuffer;
  }

  async toggle(id: TrackId): Promise<boolean> {
    if (this.track === id) {
      this.stop();
      return false;
    }
    this.stop();
    this.start(id);
    return true;
  }

  private start(id: TrackId) {
    try {
      const ctx = this.ensureCtx();
      this.track = id;

      // Crossfade the master bus in.
      const t0 = ctx.currentTime;
      const master = this.master!;
      master.gain.cancelScheduledValues(t0);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t0);
      master.gain.linearRampToValueAtTime(id === "tidal" ? 0.5 : 0.55, t0 + 1.2);

      if (id === "tidal") this.setupTidalBus(ctx);
      if (id === "nightdrive") this.setupNightBus(ctx);

      this.nextTime = ctx.currentTime + 0.08;
      this.bar = 0;
      const step = id === "tidal" ? 8 : 60 / 88 / 2;
      const lookahead = 0.3;

      const tick = () => {
        if (!this.ctx || this.track !== id) return;
        while (this.nextTime < this.ctx.currentTime + lookahead) {
          if (id === "tidal") this.scheduleTidal(this.ctx, this.nextTime, this.bar);
          else this.scheduleNightDrive(this.ctx, this.nextTime, this.bar);
          this.bar++;
          this.nextTime += step;
        }
      };
      tick();
      this.timer = window.setInterval(tick, 60);
      this.emit();
    } catch (err) {
      console.warn("[ambient] Failed to start audio:", err);
      this.track = null;
      this.emit();
    }
  }

  private stop() {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    this.teardownBuses();
    const ctx = this.ctx;
    if (ctx && this.master) {
      const t = ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), t);
      this.master.gain.linearRampToValueAtTime(0.0001, t + 0.6);
      window.setTimeout(() => {
        if (this.track === null && ctx.state === "running") void ctx.suspend();
      }, 800);
    }
    this.track = null;
    this.emit();
  }

  private setupTidalBus(ctx: AudioContext) {
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 950;
    f.Q.value = 0.4;
    const g = ctx.createGain();
    g.gain.value = 0.95;
    f.connect(g);
    g.connect(this.master!);
    this.padBus = f;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 380;
    lfo.connect(lfoGain);
    lfoGain.connect(f.frequency);
    lfo.start();
    this.padLfo = lfo;
  }

  private setupNightBus(ctx: AudioContext) {
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 340;
    f.Q.value = 0.3;
    f.connect(this.master!);
    this.bassBus = f;
  }

  private teardownBuses() {
    try {
      this.padLfo?.stop();
      this.padBus?.disconnect();
      this.bassBus?.disconnect();
    } catch {
      /* already stopped */
    }
    this.padLfo = null;
    this.padBus = null;
    this.bassBus = null;
  }

  // ---- shared voice helpers ----

  private envelope(
    g: GainNode,
    when: number,
    peak: number,
    attack: number,
    release: number,
    duration: number,
  ) {
    const ctx = g.context;
    const p = Math.max(peak, 0.0002);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(p, when + attack);
    const releaseStart = when + Math.max(attack, duration - release);
    g.gain.setValueAtTime(p, releaseStart);
    g.gain.exponentialRampToValueAtTime(0.0001, releaseStart + release);
  }

  private voice(
    ctx: AudioContext,
    dest: AudioNode,
    when: number,
    type: OscillatorType,
    freq: number,
    peak: number,
    attack: number,
    release: number,
    duration: number,
    detune = 0,
  ) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    const g = ctx.createGain();
    this.envelope(g, when, peak, attack, release, duration);
    o.connect(g);
    g.connect(dest);
    o.start(when);
    o.stop(when + duration + 0.1);
  }

  private noiseVoice(
    ctx: AudioContext,
    dest: AudioNode,
    when: number,
    filterType: BiquadFilterType,
    freq: number,
    q: number,
    peak: number,
    attack: number,
    release: number,
    duration: number,
  ) {
    const src = ctx.createBufferSource();
    src.buffer = this.getNoise(ctx);
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = filterType;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    this.envelope(g, when, peak, attack, release, duration);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(when);
    src.stop(when + duration + 0.1);
  }

  // ---- Tidal: soft ambient pads ----

  private tidalChords = [
    { sub: 43.65, tones: [87.31, 110, 130.81, 164.81, 174.61] }, // Fmaj7
    { sub: 55, tones: [110, 130.81, 164.81, 196, 220] }, // Am7
    { sub: 73.42, tones: [146.83, 174.61, 220, 329.63] }, // Dm9
    { sub: 65.41, tones: [130.81, 164.81, 196, 246.94, 261.63] }, // Cmaj7
  ];

  private scheduleTidal(ctx: AudioContext, when: number, bar: number) {
    const chord = this.tidalChords[bar % 4];
    const bus = this.padBus ?? this.master!;

    this.voice(ctx, bus, when, "sine", chord.sub, 0.16, 2.8, 4.5, 10);
    chord.tones.forEach((f, i) => {
      this.voice(ctx, bus, when, "sine", f, 0.05, 2.8, 4.5, 10, (i % 2 ? 3.5 : -3.5) + i * 1.2);
      this.voice(ctx, bus, when, "triangle", f * 2, 0.016, 3.2, 5, 10, i % 2 ? -2 : 2);
    });

    // Sparse shimmering bells.
    const bells = 1 + Math.floor(Math.random() * 2);
    const scale = [chord.tones[0], ...chord.tones.slice(1), chord.tones[0] * 2];
    for (let i = 0; i < bells; i++) {
      const t = when + 0.8 + Math.random() * 5.5;
      const f = scale[Math.floor(Math.random() * scale.length)];
      this.voice(ctx, bus, t, "sine", f * 2, 0.026, 0.02, 3.8, 4.6);
      this.voice(ctx, bus, t, "sine", f * 3, 0.01, 0.02, 3.2, 4.2);
    }
  }

  // ---- Night Drive: lo-fi chill beat ----

  private nightChords = [
    { root: 55, triad: [110, 130.81, 164.81] }, // Am
    { root: 43.65, triad: [87.31, 110, 130.81] }, // F
    { root: 65.41, triad: [130.81, 164.81, 196] }, // C
    { root: 49, triad: [98, 123.47, 146.83] }, // G
  ];

  private scheduleNightDrive(ctx: AudioContext, when: number, bar: number) {
    const barIdx = Math.floor(bar / 8);
    const chord = this.nightChords[Math.floor(barIdx / 2) % 4];
    const pos = bar % 8;
    const m = this.master!;

    if (pos === 0 || pos === 4) this.kick(ctx, when);
    if (pos === 4) this.clap(ctx, when + 0.02, barIdx % 2 === 1 ? 0.1 : 0.055);
    this.hat(ctx, when, pos % 2 === 0 ? (pos === 2 || pos === 6 ? 0.055 : 0.03) : 0.02);
    if (pos === 0 || pos === 4) {
      this.voice(ctx, this.bassBus ?? m, when, "sine", chord.root, pos === 0 ? 0.17 : 0.12, 0.012, 0.22, 0.3);
    }
    if (pos === 0) {
      chord.triad.forEach((f) => {
        this.voice(ctx, m, when, "triangle", f, 0.05, 0.02, 1.7, 1.9);
      });
    }
  }

  private kick(ctx: AudioContext, when: number) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(160, when);
    o.frequency.exponentialRampToValueAtTime(46, when + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.5, when + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.34);
    o.connect(g);
    g.connect(this.master!);
    o.start(when);
    o.stop(when + 0.4);
  }

  private clap(ctx: AudioContext, when: number, peak: number) {
    this.noiseVoice(ctx, this.master!, when, "bandpass", 1800, 1.1, peak, 0.002, 0.22, 0.28);
  }

  private hat(ctx: AudioContext, when: number, peak: number) {
    this.noiseVoice(ctx, this.master!, when, "highpass", 7600, 0.7, peak, 0.001, 0.05, 0.07);
  }
}

export const engine = new AmbientEngine();

export function useAmbientTrack(): TrackId | null {
  return useSyncExternalStore(engine.subscribe, engine.getCurrent, engine.getCurrent);
}
