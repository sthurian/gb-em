import { createPulseChannel } from './apu/pulse-channel.js';
import { createWaveChannel } from './apu/wave-channel.js';
import { createNoiseChannel } from './apu/noise-channel.js';

type APU = {
  read8(address: number): number;
  write8(address: number, value: number): void;
  step(cycles: number): void;
};

type APUDependencies = {
  sampleRate?: number;
  onSample?: (left: number, right: number) => void;
};

const createAPU = ({ sampleRate = 44100, onSample }: APUDependencies = {}): APU => {
  const ch1 = createPulseChannel({ hasSweep: true, base: 0xff10 });
  const ch2 = createPulseChannel({ hasSweep: false, base: 0xff15 });
  const ch3 = createWaveChannel();
  const ch4 = createNoiseChannel();

  let apuEn = true;
  let nr50 = 0x77;
  let nr51 = 0xf3;

  let fsCycles = 0;
  let fsStep = 0;

  const cyclesPerSample = 4194304 / sampleRate;
  let sampleAcc = 0;

  const tickFS = () => {
    switch (fsStep & 7) {
      case 0: ch1.clockLength(); ch2.clockLength(); ch3.clockLength(); ch4.clockLength(); break;
      case 2:
        ch1.clockLength(); ch2.clockLength(); ch3.clockLength(); ch4.clockLength();
        ch1.clockSweep(); ch2.clockSweep();
        break;
      case 4: ch1.clockLength(); ch2.clockLength(); ch3.clockLength(); ch4.clockLength(); break;
      case 6:
        ch1.clockLength(); ch2.clockLength(); ch3.clockLength(); ch4.clockLength();
        ch1.clockSweep(); ch2.clockSweep();
        break;
      case 7: ch1.clockEnvelope(); ch2.clockEnvelope(); ch4.clockEnvelope(); break;
    }
    fsStep = (fsStep + 1) & 7;
  };

  const emitSample = () => {
    if (!onSample) return;
    const v1 = ch1.getDacOutput();
    const v2 = ch2.getDacOutput();
    const v3 = ch3.getDacOutput();
    const v4 = ch4.getDacOutput();

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
      if (address >= 0xff30 && address <= 0xff3f) return ch3.read8(address);
      if (address >= 0xff10 && address <= 0xff14) return ch1.read8(address);
      if (address >= 0xff15 && address <= 0xff19) return ch2.read8(address);
      if (address >= 0xff1a && address <= 0xff1e) return ch3.read8(address);
      if (address >= 0xff1f && address <= 0xff23) return ch4.read8(address);
      switch (address) {
        case 0xff24: return nr50;
        case 0xff25: return nr51;
        case 0xff26: {
          const status =
            (ch1.isEnabled() ? 0x01 : 0) | (ch2.isEnabled() ? 0x02 : 0) |
            (ch3.isEnabled() ? 0x04 : 0) | (ch4.isEnabled() ? 0x08 : 0);
          return 0x70 | (apuEn ? 0x80 : 0) | status;
        }
        default: return 0xff;
      }
    },

    write8: (address, value) => {
      if (address >= 0xff30 && address <= 0xff3f) {
        ch3.write8(address, value);
        return;
      }

      if (address === 0xff26) {
        apuEn = (value & 0x80) !== 0;
        if (!apuEn) {
          ch1.disable(); ch2.disable(); ch3.disable(); ch4.disable();
        }
        return;
      }

      if (!apuEn) return;

      if (address >= 0xff10 && address <= 0xff14) { ch1.write8(address, value); return; }
      if (address >= 0xff15 && address <= 0xff19) { ch2.write8(address, value); return; }
      if (address >= 0xff1a && address <= 0xff1e) { ch3.write8(address, value); return; }
      if (address >= 0xff1f && address <= 0xff23) { ch4.write8(address, value); return; }
      switch (address) {
        case 0xff24: nr50 = value; break;
        case 0xff25: nr51 = value; break;
      }
    },

    step: (cycles) => {
      fsCycles += cycles;
      while (fsCycles >= 8192) {
        fsCycles -= 8192;
        tickFS();
      }

      if (apuEn) {
        ch1.step(cycles);
        ch2.step(cycles);
        ch3.step(cycles);
        ch4.step(cycles);
      }

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
