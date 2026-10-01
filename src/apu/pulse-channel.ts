// Step:        0  1  2  3  4  5  6  7
// duty 0:      0  0  0  0  0  0  0  1  (12.5%)
// duty 1:      1  0  0  0  0  0  0  1  (25%)
// duty 2:      1  0  0  0  0  1  1  1  (50%)
// duty 3:      0  1  1  1  1  1  1  0  (75%)
const DUTY_PATTERNS = [0x01, 0x81, 0x87, 0x7e] as const;

type PulseChannel = {
  step(cycles: number): void;
  trigger(): void;
  clockLength(): void;
  clockEnvelope(): void;
  clockSweep(): void;
  isEnabled(): boolean;
  disable(): void;
  getDacOutput(): number;
  read8(address: number): number;
  write8(address: number, value: number): void;
};

type PulseChannelDeps = {
  hasSweep?: boolean;
  base: number;
};

const createPulseChannel = ({ hasSweep = false, base }: PulseChannelDeps): PulseChannel => {
  let enabled = false;
  let dacEnabled = false;
  let freqTimer = 4;
  let dutyStep = 0;
  let duty = 2;
  let lenCounter = 0;
  let lenEnable = false;
  let vol = 0;
  let envInit = 0;
  let envAdd = false;
  let envPeriod = 0;
  let envTimer = 0;
  let envRun = false;
  let freqLo = 0;
  let freqHi = 0;

  let swPeriod = 0;
  let swNeg = false;
  let swShift = 0;
  let swTimer = 0;
  let swEn = false;
  let shadow = 0;

  const freq = () => freqLo | (freqHi << 8);

  const sweepCalc = () => {
    const delta = shadow >> swShift;
    return swNeg ? shadow - delta : shadow + delta;
  };

  const trigger = () => {
    enabled = dacEnabled;
    if (lenCounter === 0) lenCounter = 64;
    freqTimer = (2048 - freq()) * 4;
    vol = envInit;
    envTimer = envPeriod || 8;
    envRun = true;
    if (hasSweep) {
      shadow = freq();
      swTimer = swPeriod || 8;
      swEn = swPeriod !== 0 || swShift !== 0;
      if (swShift !== 0 && sweepCalc() > 2047) enabled = false;
    }
  };

  return {
    isEnabled: () => enabled,
    disable: () => { enabled = false; dacEnabled = false; },
    trigger,

    step: (cycles) => {
      freqTimer -= cycles;
      while (freqTimer <= 0) {
        dutyStep = (dutyStep + 1) & 7;
        freqTimer += (2048 - freq()) * 4;
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

    clockSweep: () => {
      if (!hasSweep) return;
      if (--swTimer <= 0) {
        swTimer = swPeriod || 8;
        if (swEn && swPeriod !== 0) {
          const nf = sweepCalc();
          if (nf > 2047) {
            enabled = false;
          } else if (swShift !== 0) {
            shadow = nf;
            freqLo = nf & 0xff;
            freqHi = (nf >> 8) & 0x07;
            if (sweepCalc() > 2047) enabled = false;
          }
        }
      }
    },

    getDacOutput: () => {
      if (!enabled || !dacEnabled) return 0;
      const bit = (DUTY_PATTERNS[duty]! >> (7 - dutyStep)) & 1;
      return (bit * vol / 7.5) - 1.0;
    },

    read8: (address) => {
      switch (address - base) {
        case 0: return hasSweep ? (0x80 | (swPeriod << 4) | (swNeg ? 0x08 : 0) | swShift) : 0xff;
        case 1: return 0x3f | (duty << 6);
        case 2: return (envInit << 4) | (envAdd ? 0x08 : 0) | envPeriod;
        case 3: return 0xff;
        case 4: return 0xbf | (lenEnable ? 0x40 : 0);
        default: return 0xff;
      }
    },

    write8: (address, value) => {
      switch (address - base) {
        case 0:
          if (hasSweep) {
            swPeriod = (value >> 4) & 0x07;
            swNeg = (value & 0x08) !== 0;
            swShift = value & 0x07;
          }
          break;
        case 1:
          duty = (value >> 6) & 0x03;
          lenCounter = 64 - (value & 0x3f);
          break;
        case 2:
          envInit = (value >> 4) & 0x0f;
          envAdd = (value & 0x08) !== 0;
          envPeriod = value & 0x07;
          dacEnabled = (value & 0xf8) !== 0;
          if (!dacEnabled) enabled = false;
          break;
        case 3:
          freqLo = value;
          break;
        case 4:
          freqHi = value & 0x07;
          lenEnable = (value & 0x40) !== 0;
          if (value & 0x80) trigger();
          break;
      }
    },
  };
};

export { createPulseChannel };
export type { PulseChannel };
