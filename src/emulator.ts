import type { CPU } from './cpu/cpu.js';
import type { PPU } from './ppu.js';

type Emulator = {
  step(): void;
  start(): void;
};

type EmulatorDependencies = {
  cpu: CPU;
  ppu: PPU;
};

const createEmulator = (dependencies: EmulatorDependencies): Emulator => {
  const { cpu, ppu } = dependencies;

  const step = (): void => {
  const cycles = cpu.step();
    ppu.step(cycles);
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
