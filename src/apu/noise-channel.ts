const NOISE_DIVISORS = [8, 16, 32, 48, 64, 80, 96, 112] as const;

type NoiseChannel = {
  step(cycles: number): void;
  trigger(): void;
  clockLength(): void;
  clockEnvelope(): void;
  isEnabled(): boolean;
  disable(): void;
  getDacOutput(): number;
  read8(address: number): number;
  write8(address: number, value: number): void;
};

const createNoiseChannel = (): NoiseChannel => {
  let enabled = false;
  let dacEnabled = false;
  let freqTimer = 8;
  let lfsr = 0x7fff;
  let clkShift = 0;
  let width7 = false;
  let divCode = 0;
  let lenCounter = 0;
  let lenEnable = false;
  let vol = 0;
  let envInit = 0;
  let envAdd = false;
  let envPeriod = 0;
  let envTimer = 0;
  let envRun = false;

  const trigger = () => {
    enabled = dacEnabled;
    if (lenCounter === 0) lenCounter = 64;
    freqTimer = (NOISE_DIVISORS[divCode] ?? 8) << clkShift;
    lfsr = 0x7fff;
    vol = envInit;
    envTimer = envPeriod || 8;
    envRun = true;
  };

  return {
    isEnabled: () => enabled,
    disable: () => { enabled = false; dacEnabled = false; },
    trigger,

    step: (cycles) => {
      freqTimer -= cycles;
      while (freqTimer <= 0) {
        const d = NOISE_DIVISORS[divCode] ?? 8;
        freqTimer += d << clkShift;
        const xbit = (lfsr ^ (lfsr >> 1)) & 1;
        lfsr = (lfsr >> 1) | (xbit << 14);
        if (width7) lfsr = (lfsr & ~0x40) | (xbit << 6);
      }
    },

    clockLength: () => {
      if (lenEnable && lenCounter > 0 && --lenCounter === 0) enabled = false;
    },

    clockEnvelope: () => {
      if (!envRun || envPeriod === 0) return;
      if (--envTimer <= 0) {
        envTimer = envPeriod;
        const nv = envAdd ? vol + 1 : vol - 1;
        if (nv >= 0 && nv <= 15) vol = nv;
        else envRun = false;
      }
    },

    getDacOutput: () => {
      if (!enabled || !dacEnabled) return 0;
      const out = ((lfsr & 1) ^ 1) * vol;
      return (out / 7.5) - 1.0;
    },

    read8: (address) => {
      switch (address) {
        case 0xff1f: return 0xff;
        case 0xff20: return 0xc0;
        case 0xff21: return (envInit << 4) | (envAdd ? 0x08 : 0) | envPeriod;
        case 0xff22: return (clkShift << 4) | (width7 ? 0x08 : 0) | divCode;
        case 0xff23: return 0xbf | (lenEnable ? 0x40 : 0);
        default: return 0xff;
      }
    },

    write8: (address, value) => {
      switch (address) {
        case 0xff20:
          lenCounter = 64 - (value & 0x3f);
          break;
        case 0xff21:
          envInit = (value >> 4) & 0x0f;
          envAdd = (value & 0x08) !== 0;
          envPeriod = value & 0x07;
          dacEnabled = (value & 0xf8) !== 0;
          if (!dacEnabled) enabled = false;
          break;
        case 0xff22:
          clkShift = (value >> 4) & 0x0f;
          width7 = (value & 0x08) !== 0;
          divCode = value & 0x07;
          break;
        case 0xff23:
          lenEnable = (value & 0x40) !== 0;
          if (value & 0x80) trigger();
          break;
      }
    },
  };
};

export { createNoiseChannel };
export type { NoiseChannel };
