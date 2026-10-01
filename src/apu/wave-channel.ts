type WaveChannel = {
  step(cycles: number): void;
  trigger(): void;
  clockLength(): void;
  isEnabled(): boolean;
  disable(): void;
  getDacOutput(): number;
  read8(address: number): number;
  write8(address: number, value: number): void;
};

const createWaveChannel = (): WaveChannel => {
  let enabled = false;
  let dacEnabled = false;
  let freqTimer = 2;
  let wavePos = 0;
  let outLevel = 0;
  let lenCounter = 0;
  let lenEnable = false;
  let freqLo = 0;
  let freqHi = 0;
  let sample = 0;
  const waveRam = new Uint8Array(16);

  const freq = () => freqLo | (freqHi << 8);

  const trigger = () => {
    enabled = dacEnabled;
    if (lenCounter === 0) lenCounter = 256;
    freqTimer = (2048 - freq()) * 2;
    wavePos = 0;
  };

  return {
    isEnabled: () => enabled,
    disable: () => { enabled = false; dacEnabled = false; },
    trigger,

    step: (cycles) => {
      freqTimer -= cycles;
      while (freqTimer <= 0) {
        wavePos = (wavePos + 1) & 31;
        const byte = waveRam[wavePos >> 1]!;
        sample = (wavePos & 1) ? byte & 0x0f : byte >> 4;
        freqTimer += (2048 - freq()) * 2;
      }
    },

    clockLength: () => {
      if (lenEnable && lenCounter > 0 && --lenCounter === 0) enabled = false;
    },

    getDacOutput: () => {
      if (!enabled || !dacEnabled) return 0;
      const shifted = outLevel > 0 ? sample >> (outLevel - 1) : 0;
      return (shifted / 7.5) - 1.0;
    },

    read8: (address) => {
      if (address >= 0xff30 && address <= 0xff3f) return waveRam[address - 0xff30]!;
      switch (address) {
        case 0xff1a: return 0x7f | (dacEnabled ? 0x80 : 0);
        case 0xff1b: return 0xff;
        case 0xff1c: return 0x9f | (outLevel << 5);
        case 0xff1d: return 0xff;
        case 0xff1e: return 0xbf | (lenEnable ? 0x40 : 0);
        default: return 0xff;
      }
    },

    write8: (address, value) => {
      if (address >= 0xff30 && address <= 0xff3f) {
        waveRam[address - 0xff30] = value;
        return;
      }
      switch (address) {
        case 0xff1a:
          dacEnabled = (value & 0x80) !== 0;
          if (!dacEnabled) enabled = false;
          break;
        case 0xff1b:
          lenCounter = 256 - value;
          break;
        case 0xff1c:
          outLevel = (value >> 5) & 0x03;
          break;
        case 0xff1d:
          freqLo = value;
          break;
        case 0xff1e:
          freqHi = value & 0x07;
          lenEnable = (value & 0x40) !== 0;
          if (value & 0x80) trigger();
          break;
      }
    },
  };
};

export { createWaveChannel };
export type { WaveChannel };
