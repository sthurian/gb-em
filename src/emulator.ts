import type { APU } from './apu.js';
import type { CPU } from './cpu/cpu.js';
import type { PPU } from './ppu.js';
import type { Timer } from './timer.js';

type Emulator = {
  step(): void;
  start(): void;
};

type EmulatorDependencies = {
  cpu: CPU;
  ppu: PPU;
  apu: APU;
  timer: Timer;
};

const createEmulator = (dependencies: EmulatorDependencies): Emulator => {
  const { cpu, ppu, apu, timer } = dependencies;

  const step = (): void => {
  const cycles = cpu.step();
    ppu.step(cycles);
    apu.step(cycles);
    timer.step(cycles);
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
