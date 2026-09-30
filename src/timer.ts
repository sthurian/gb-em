import type { InterruptController } from './interrupt-controller.js';

type Timer = {
  read8(address: number): number;
  write8(address: number, value: number): void;
  step(cycles: number): void;
};

type TimerDependencies = {
  interruptController: InterruptController;
};

// TAC frequency bits → CPU cycles between TIMA increments
const TIMA_CYCLES: Record<number, number> = {
  0: 1024, // 4096 Hz
  1: 16,   // 262144 Hz
  2: 64,   // 65536 Hz
  3: 256,  // 16384 Hz
};

const createTimer = ({ interruptController }: TimerDependencies): Timer => {
  let div = 0;       // internal 16-bit counter; DIV register = high byte
  let tima = 0;
  let tma = 0;
  let tac = 0;
  let timaCounter = 0;
  let timaOverflowPending = false;

  return {
    read8: (address) => {
      if (address === 0xff04) return (div >> 8) & 0xff;
      if (address === 0xff05) return tima;
      if (address === 0xff06) return tma;
      return tac;
    },

    write8: (address, value) => {
      if (address === 0xff04) { div = 0; return; }
      if (address === 0xff05) { tima = value & 0xff; timaOverflowPending = false; return; }
      if (address === 0xff06) { tma = value & 0xff; return; }
      tac = value & 0x07;
    },

    step: (cycles) => {
      div = (div + cycles) & 0xffff;

      // Fire pending overflow from previous step
      if (timaOverflowPending) {
        timaOverflowPending = false;
        tima = tma;
        interruptController.request('TIMER');
      }

      const timerEnabled = (tac & 0x04) !== 0;
      if (!timerEnabled) return;

      const threshold = TIMA_CYCLES[tac & 0x03]!;
      timaCounter += cycles;

      while (timaCounter >= threshold) {
        timaCounter -= threshold;
        tima = (tima + 1) & 0xff;
        if (tima === 0) {
          timaOverflowPending = true;
        }
      }
    },
  };
};

export { createTimer };
export type { Timer };
