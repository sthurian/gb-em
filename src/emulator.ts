import type { APU } from './apu.js';
import type { CPU } from './cpu/cpu.js';
import { InterruptController } from './interrupt-controller.js';
import { Joypad } from './joypad.js';
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
  joypad: Joypad;
  interruptController: InterruptController;
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
      let hits = 0;

      for (let i = 0; i < 1_000_000; i++) {
        if (cpu.getState().registers.pc === 0x0430) {
          hits++;
        }

        step();
      }
      /* c8 ignore next 4 */
      console.log({
        hits,
        state: cpu.getState(),
      });
    },
  };
};

export { createEmulator };
