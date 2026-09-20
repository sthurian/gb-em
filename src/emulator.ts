import type { CPU } from './cpu/cpu.js';

type Emulator = {
  start(): void;
};

type EmulatorDependencies = {
  cpu: CPU;
};

const createEmulator = (dependencies: EmulatorDependencies): Emulator => {
  const { cpu } = dependencies;
  return {
    start: () => {
      while (true) {
        const cycles = cpu.step();
      }
    },
  };
};

export { createEmulator };
