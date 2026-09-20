import type { APU } from './apu.js';
import type { CPU } from './cpu/cpu.js';
import type { PPU } from './ppu.js';

type Emulator = {
  step(): void;
  start(): void;
};

type EmulatorDependencies = {
  cpu: CPU;
  ppu: PPU;
  apu: APU;
};

const createEmulator = (dependencies: EmulatorDependencies): Emulator => {
  const { cpu, ppu, apu } = dependencies;

  const step = (): void => {
  const cycles = cpu.step();
    ppu.step(cycles);
    apu.step(cycles);
  };

  return {
    step,
    start: () => {
      while (true) {
        step();
      }
    },
  };
};

export { createEmulator };
