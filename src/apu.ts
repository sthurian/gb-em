type APU = {
  read8(address: number): number;
  write8(address: number, value: number): void;
  step(cycles: number): void;
};

type APUDependencies = {
  sampleRate?: number;
  onSample?: (left: number, right: number) => void;
};

// Step:        0  1  2  3  4  5  6  7
// duty 0:      0  0  0  0  0  0  0  1  (12.5%)
// duty 1:      1  0  0  0  0  0  0  1  (25%)
// duty 2:      1  0  0  0  0  1  1  1  (50%)
// duty 3:      0  1  1  1  1  1  1  0  (75%)
const DUTY_PATTERNS = [0x01, 0x81, 0x87, 0x7e] as const;

const NOISE_DIVISORS = [8, 16, 32, 48, 64, 80, 96, 112] as const;

const createAPU = ({ sampleRate = 44100, onSample }: APUDependencies = {}): APU => {
  // ── CH1: pulse + sweep ───────────────────────────────────────────
  let ch1En = false;
  let ch1DacEn = false;
  let ch1FreqTimer = 4;
  let ch1DutyStep = 0;
  let ch1Duty = 2;
  let ch1LenCounter = 0;
  let ch1LenEn = false;
  let ch1Vol = 0;
  let ch1EnvInit = 0;
  let ch1EnvAdd = false;
  let ch1EnvPeriod = 0;
  let ch1EnvTimer = 0;
  let ch1EnvRun = false;
  let ch1FreqLo = 0;
  let ch1FreqHi = 0;
  let ch1SwPeriod = 0;
  let ch1SwNeg = false;
  let ch1SwShift = 0;
  let ch1SwTimer = 0;
  let ch1SwEn = false;
  let ch1Shadow = 0;

  // ── CH2: pulse ───────────────────────────────────────────────────
  let ch2En = false;
  let ch2DacEn = false;
  let ch2FreqTimer = 4;
  let ch2DutyStep = 0;
  let ch2Duty = 2;
  let ch2LenCounter = 0;
  let ch2LenEn = false;
  let ch2Vol = 0;
  let ch2EnvInit = 0;
  let ch2EnvAdd = false;
  let ch2EnvPeriod = 0;
  let ch2EnvTimer = 0;
  let ch2EnvRun = false;
  let ch2FreqLo = 0;
  let ch2FreqHi = 0;

  // ── CH3: wave ────────────────────────────────────────────────────
  let ch3En = false;
  let ch3DacEn = false;
  let ch3FreqTimer = 2;
  let ch3WavePos = 0;
  let ch3OutLevel = 0;
  let ch3LenCounter = 0;
  let ch3LenEn = false;
  let ch3FreqLo = 0;
  let ch3FreqHi = 0;
  let ch3Sample = 0;
  const ch3WaveRam = new Uint8Array(16);

  // ── CH4: noise ───────────────────────────────────────────────────
  let ch4En = false;
  let ch4DacEn = false;
  let ch4FreqTimer = 8;
  let ch4Lfsr = 0x7fff;
  let ch4ClkShift = 0;
  let ch4Width7 = false;
  let ch4DivCode = 0;
  let ch4LenCounter = 0;
  let ch4LenEn = false;
  let ch4Vol = 0;
  let ch4EnvInit = 0;
  let ch4EnvAdd = false;
  let ch4EnvPeriod = 0;
  let ch4EnvTimer = 0;
  let ch4EnvRun = false;

  // ── Master ───────────────────────────────────────────────────────
  let apuEn = true;
  let nr50 = 0x77;
  let nr51 = 0xf3;

  // ── Frame sequencer (512 Hz = every 8192 T-cycles) ───────────────
  let fsCycles = 0;
  let fsStep = 0;

  // ── Sample clock ─────────────────────────────────────────────────
  const cyclesPerSample = 4194304 / sampleRate;
  let sampleAcc = 0;

  // ─────────────────────────────────────────────────────────────────

  const ch1Freq = () => ch1FreqLo | (ch1FreqHi << 8);
  const ch2Freq = () => ch2FreqLo | (ch2FreqHi << 8);
  const ch3Freq = () => ch3FreqLo | (ch3FreqHi << 8);

  const sweepCalc = () => {
    const delta = ch1Shadow >> ch1SwShift;
    return ch1SwNeg ? ch1Shadow - delta : ch1Shadow + delta;
  };

  const triggerCh1 = () => {
    ch1En = ch1DacEn;
    if (ch1LenCounter === 0) ch1LenCounter = 64;
    ch1FreqTimer = (2048 - ch1Freq()) * 4;
    ch1Vol = ch1EnvInit;
    ch1EnvTimer = ch1EnvPeriod || 8;
    ch1EnvRun = true;
    ch1Shadow = ch1Freq();
    ch1SwTimer = ch1SwPeriod || 8;
    ch1SwEn = ch1SwPeriod !== 0 || ch1SwShift !== 0;
    if (ch1SwShift !== 0 && sweepCalc() > 2047) ch1En = false;
  };

  const triggerCh2 = () => {
    ch2En = ch2DacEn;
    if (ch2LenCounter === 0) ch2LenCounter = 64;
    ch2FreqTimer = (2048 - ch2Freq()) * 4;
    ch2Vol = ch2EnvInit;
    ch2EnvTimer = ch2EnvPeriod || 8;
    ch2EnvRun = true;
  };

  const triggerCh3 = () => {
    ch3En = ch3DacEn;
    if (ch3LenCounter === 0) ch3LenCounter = 256;
    ch3FreqTimer = (2048 - ch3Freq()) * 2;
    ch3WavePos = 0;
  };

  const triggerCh4 = () => {
    ch4En = ch4DacEn;
    if (ch4LenCounter === 0) ch4LenCounter = 64;
    ch4FreqTimer = (NOISE_DIVISORS[ch4DivCode] ?? 8) << ch4ClkShift;
    ch4Lfsr = 0x7fff;
    ch4Vol = ch4EnvInit;
    ch4EnvTimer = ch4EnvPeriod || 8;
    ch4EnvRun = true;
  };

  const clockLength = () => {
    if (ch1LenEn && ch1LenCounter > 0 && --ch1LenCounter === 0) ch1En = false;
    if (ch2LenEn && ch2LenCounter > 0 && --ch2LenCounter === 0) ch2En = false;
    if (ch3LenEn && ch3LenCounter > 0 && --ch3LenCounter === 0) ch3En = false;
    if (ch4LenEn && ch4LenCounter > 0 && --ch4LenCounter === 0) ch4En = false;
  };

  const clockSweep = () => {
    if (--ch1SwTimer <= 0) {
      ch1SwTimer = ch1SwPeriod || 8;
      if (ch1SwEn && ch1SwPeriod !== 0) {
        const nf = sweepCalc();
        if (nf > 2047) {
          ch1En = false;
        } else if (ch1SwShift !== 0) {
          ch1Shadow = nf;
          ch1FreqLo = nf & 0xff;
          ch1FreqHi = (nf >> 8) & 0x07;
          if (sweepCalc() > 2047) ch1En = false;
        }
      }
    }
  };

  const clockEnv = (
    run: boolean, period: number, add: boolean, vol: number, timer: number
  ): [boolean, number, number] => {
    if (!run || period === 0) return [run, vol, timer];
    if (--timer <= 0) {
      timer = period;
      const nv = add ? vol + 1 : vol - 1;
      if (nv >= 0 && nv <= 15) return [true, nv, timer];
      return [false, vol, timer];
    }
    return [run, vol, timer];
  };

  const clockEnvelopes = () => {
    [ch1EnvRun, ch1Vol, ch1EnvTimer] = clockEnv(ch1EnvRun, ch1EnvPeriod, ch1EnvAdd, ch1Vol, ch1EnvTimer);
    [ch2EnvRun, ch2Vol, ch2EnvTimer] = clockEnv(ch2EnvRun, ch2EnvPeriod, ch2EnvAdd, ch2Vol, ch2EnvTimer);
    [ch4EnvRun, ch4Vol, ch4EnvTimer] = clockEnv(ch4EnvRun, ch4EnvPeriod, ch4EnvAdd, ch4Vol, ch4EnvTimer);
  };

  const tickFS = () => {
    switch (fsStep & 7) {
      case 0: clockLength(); break;
      case 2: clockLength(); clockSweep(); break;
      case 4: clockLength(); break;
      case 6: clockLength(); clockSweep(); break;
      case 7: clockEnvelopes(); break;
    }
    fsStep = (fsStep + 1) & 7;
  };

  // DAC: 0-15 → -1..+1 (0.0 when DAC disabled)
  const dac = (enabled: boolean, val: number) => enabled ? (val / 7.5) - 1.0 : 0.0;

  const emitSample = () => {
    if (!onSample) return;

    const d1 = (DUTY_PATTERNS[ch1Duty]! >> (7 - ch1DutyStep)) & 1;
    const d2 = (DUTY_PATTERNS[ch2Duty]! >> (7 - ch2DutyStep)) & 1;
    const w3 = ch3OutLevel > 0 ? ch3Sample >> (ch3OutLevel - 1) : 0;
    const n4 = ((ch4Lfsr & 1) ^ 1);

    const v1 = dac(ch1En && ch1DacEn, d1 * ch1Vol);
    const v2 = dac(ch2En && ch2DacEn, d2 * ch2Vol);
    const v3 = dac(ch3En && ch3DacEn, w3);
    const v4 = dac(ch4En && ch4DacEn, n4 * ch4Vol);

    const lv = ((nr50 >> 4) & 7) + 1;
    const rv = (nr50 & 7) + 1;

    const l = (
      ((nr51 & 0x01) ? v1 : 0) +
      ((nr51 & 0x02) ? v2 : 0) +
      ((nr51 & 0x04) ? v3 : 0) +
      ((nr51 & 0x08) ? v4 : 0)
    ) * lv / 32;

    const r = (
      ((nr51 & 0x10) ? v1 : 0) +
      ((nr51 & 0x20) ? v2 : 0) +
      ((nr51 & 0x40) ? v3 : 0) +
      ((nr51 & 0x80) ? v4 : 0)
    ) * rv / 32;

    onSample(l, r);
  };

  return {
    read8: (address) => {
      if (address >= 0xff30 && address <= 0xff3f) return ch3WaveRam[address - 0xff30]!;

      // Read masks — OR these with stored values so unused bits read as 1
      switch (address) {
        case 0xff10: return 0x80 | (ch1SwPeriod << 4) | (ch1SwNeg ? 0x08 : 0) | ch1SwShift;
        case 0xff11: return 0x3f | (ch1Duty << 6);
        case 0xff12: return (ch1EnvInit << 4) | (ch1EnvAdd ? 0x08 : 0) | ch1EnvPeriod;
        case 0xff13: return 0xff;
        case 0xff14: return 0xbf | (ch1LenEn ? 0x40 : 0);

        case 0xff15: return 0xff;
        case 0xff16: return 0x3f | (ch2Duty << 6);
        case 0xff17: return (ch2EnvInit << 4) | (ch2EnvAdd ? 0x08 : 0) | ch2EnvPeriod;
        case 0xff18: return 0xff;
        case 0xff19: return 0xbf | (ch2LenEn ? 0x40 : 0);

        case 0xff1a: return 0x7f | (ch3DacEn ? 0x80 : 0);
        case 0xff1b: return 0xff;
        case 0xff1c: return 0x9f | (ch3OutLevel << 5);
        case 0xff1d: return 0xff;
        case 0xff1e: return 0xbf | (ch3LenEn ? 0x40 : 0);

        case 0xff1f: return 0xff;
        case 0xff20: return 0xc0;
        case 0xff21: return (ch4EnvInit << 4) | (ch4EnvAdd ? 0x08 : 0) | ch4EnvPeriod;
        case 0xff22: return (ch4ClkShift << 4) | (ch4Width7 ? 0x08 : 0) | ch4DivCode;
        case 0xff23: return 0xbf | (ch4LenEn ? 0x40 : 0);

        case 0xff24: return nr50;
        case 0xff25: return nr51;
        case 0xff26: {
          const status =
            (ch1En ? 0x01 : 0) | (ch2En ? 0x02 : 0) |
            (ch3En ? 0x04 : 0) | (ch4En ? 0x08 : 0);
          return 0x70 | (apuEn ? 0x80 : 0) | status;
        }
        default: return 0xff;
      }
    },

    write8: (address, value) => {
      if (address >= 0xff30 && address <= 0xff3f) {
        ch3WaveRam[address - 0xff30] = value;
        return;
      }

      // NR52: master enable
      if (address === 0xff26) {
        apuEn = (value & 0x80) !== 0;
        if (!apuEn) {
          // Clear all channel registers
          ch1En = ch2En = ch3En = ch4En = false;
          ch1DacEn = ch2DacEn = ch3DacEn = ch4DacEn = false;
        }
        return;
      }

      if (!apuEn) return;

      switch (address) {
        // ── CH1 ──────────────────────────────────────────────────
        case 0xff10:
          ch1SwPeriod = (value >> 4) & 0x07;
          ch1SwNeg = (value & 0x08) !== 0;
          ch1SwShift = value & 0x07;
          break;
        case 0xff11:
          ch1Duty = (value >> 6) & 0x03;
          ch1LenCounter = 64 - (value & 0x3f);
          break;
        case 0xff12:
          ch1EnvInit = (value >> 4) & 0x0f;
          ch1EnvAdd = (value & 0x08) !== 0;
          ch1EnvPeriod = value & 0x07;
          ch1DacEn = (value & 0xf8) !== 0;
          if (!ch1DacEn) ch1En = false;
          break;
        case 0xff13:
          ch1FreqLo = value;
          break;
        case 0xff14:
          ch1FreqHi = value & 0x07;
          ch1LenEn = (value & 0x40) !== 0;
          if (value & 0x80) triggerCh1();
          break;

        // ── CH2 ──────────────────────────────────────────────────
        case 0xff16:
          ch2Duty = (value >> 6) & 0x03;
          ch2LenCounter = 64 - (value & 0x3f);
          break;
        case 0xff17:
          ch2EnvInit = (value >> 4) & 0x0f;
          ch2EnvAdd = (value & 0x08) !== 0;
          ch2EnvPeriod = value & 0x07;
          ch2DacEn = (value & 0xf8) !== 0;
          if (!ch2DacEn) ch2En = false;
          break;
        case 0xff18:
          ch2FreqLo = value;
          break;
        case 0xff19:
          ch2FreqHi = value & 0x07;
          ch2LenEn = (value & 0x40) !== 0;
          if (value & 0x80) triggerCh2();
          break;

        // ── CH3 ──────────────────────────────────────────────────
        case 0xff1a:
          ch3DacEn = (value & 0x80) !== 0;
          if (!ch3DacEn) ch3En = false;
          break;
        case 0xff1b:
          ch3LenCounter = 256 - value;
          break;
        case 0xff1c:
          ch3OutLevel = (value >> 5) & 0x03;
          break;
        case 0xff1d:
          ch3FreqLo = value;
          break;
        case 0xff1e:
          ch3FreqHi = value & 0x07;
          ch3LenEn = (value & 0x40) !== 0;
          if (value & 0x80) triggerCh3();
          break;

        // ── CH4 ──────────────────────────────────────────────────
        case 0xff20:
          ch4LenCounter = 64 - (value & 0x3f);
          break;
        case 0xff21:
          ch4EnvInit = (value >> 4) & 0x0f;
          ch4EnvAdd = (value & 0x08) !== 0;
          ch4EnvPeriod = value & 0x07;
          ch4DacEn = (value & 0xf8) !== 0;
          if (!ch4DacEn) ch4En = false;
          break;
        case 0xff22:
          ch4ClkShift = (value >> 4) & 0x0f;
          ch4Width7 = (value & 0x08) !== 0;
          ch4DivCode = value & 0x07;
          break;
        case 0xff23:
          ch4LenEn = (value & 0x40) !== 0;
          if (value & 0x80) triggerCh4();
          break;

        // ── Master ───────────────────────────────────────────────
        case 0xff24: nr50 = value; break;
        case 0xff25: nr51 = value; break;
      }
    },

    step: (cycles) => {
      // Frame sequencer
      fsCycles += cycles;
      while (fsCycles >= 8192) {
        fsCycles -= 8192;
        tickFS();
      }

      if (apuEn) {
        // CH1 frequency timer
        ch1FreqTimer -= cycles;
        while (ch1FreqTimer <= 0) {
          ch1DutyStep = (ch1DutyStep + 1) & 7;
          ch1FreqTimer += (2048 - ch1Freq()) * 4;
        }

        // CH2 frequency timer
        ch2FreqTimer -= cycles;
        while (ch2FreqTimer <= 0) {
          ch2DutyStep = (ch2DutyStep + 1) & 7;
          ch2FreqTimer += (2048 - ch2Freq()) * 4;
        }

        // CH3 frequency timer
        ch3FreqTimer -= cycles;
        while (ch3FreqTimer <= 0) {
          ch3WavePos = (ch3WavePos + 1) & 31;
          const byte = ch3WaveRam[ch3WavePos >> 1]!;
          ch3Sample = (ch3WavePos & 1) ? byte & 0x0f : byte >> 4;
          ch3FreqTimer += (2048 - ch3Freq()) * 2;
        }

        // CH4 LFSR
        ch4FreqTimer -= cycles;
        while (ch4FreqTimer <= 0) {
          const d = NOISE_DIVISORS[ch4DivCode] ?? 8;
          ch4FreqTimer += d << ch4ClkShift;
          const xbit = (ch4Lfsr ^ (ch4Lfsr >> 1)) & 1;
          ch4Lfsr = (ch4Lfsr >> 1) | (xbit << 14);
          if (ch4Width7) ch4Lfsr = (ch4Lfsr & ~0x40) | (xbit << 6);
        }
      }

      // Sample output
      sampleAcc += cycles;
      while (sampleAcc >= cyclesPerSample) {
        sampleAcc -= cyclesPerSample;
        emitSample();
      }
    },
  };
};

export { createAPU };
export type { APU, APUDependencies };
