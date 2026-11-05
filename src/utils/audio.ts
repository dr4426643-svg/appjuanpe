/**
 * Procedural Web Audio API sound generator for Basketball Conditioning
 * Generates referee whistle, shot clock buzzer, and interval beeps without any external files.
 */

class BasketballSoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Authentic referee pea-whistle blast (Dual frequency with ~28Hz modulation)
   */
  public playWhistle(duration = 0.55): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.28, now + 0.04);
    masterGain.gain.setValueAtTime(0.28, now + duration - 0.08);
    masterGain.gain.linearRampToValueAtTime(0.001, now + duration);
    masterGain.connect(ctx.destination);

    // Oscillator 1 (carrier ~2800 Hz)
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(2850, now);

    // Oscillator 2 (slightly detuned ~2980 Hz for metallic beat frequency)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2990, now);

    // Modulator for the vibrating pea inside whistle (~32 Hz)
    const mod = ctx.createOscillator();
    mod.type = 'sine';
    mod.frequency.setValueAtTime(32, now);

    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(350, now);

    mod.connect(modGain);
    modGain.connect(osc1.frequency);
    modGain.connect(osc2.frequency);

    osc1.connect(masterGain);
    osc2.connect(masterGain);

    mod.start(now);
    osc1.start(now);
    osc2.start(now);

    mod.stop(now + duration);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  /**
   * Double short whistle blast for starting sets or high energy cue
   */
  public playDoubleWhistle(): void {
    this.playWhistle(0.2);
    setTimeout(() => {
      this.playWhistle(0.35);
    }, 240);
  }

  /**
   * Arena Horn / End of Period Buzzer
   */
  public playBuzzer(duration = 0.8): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gain.gain.setValueAtTime(0.3, now + duration - 0.05);
    gain.gain.linearRampToValueAtTime(0.001, now + duration);
    gain.connect(ctx.destination);

    // Basketball arena horn is harsh saw waves stacked at ~115Hz and 230Hz
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(115, now);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(172, now);

    osc1.connect(gain);
    osc2.connect(gain);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  /**
   * Timer interval countdown beep (3, 2, 1, GO)
   */
  public playBeep(isFinal = false): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.35 : 0.12));
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isFinal ? 1200 : 780, now);
    osc.connect(gain);

    osc.start(now);
    osc.stop(now + (isFinal ? 0.36 : 0.13));
  }

  /**
   * Basketball hardwood bounce thud
   */
  public playBounce(): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
    osc.connect(gain);

    osc.start(now);
    osc.stop(now + 0.17);
  }
}

export const soundEffects = new BasketballSoundEffects();
