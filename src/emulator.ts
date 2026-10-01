import { readFileSync } from 'node:fs';
import { createAPU } from './apu.js';
import { createCartridge } from './cartridge.js';
import { createCPU } from './cpu/cpu.js';
import { createOpcodeTable } from './cpu/opcode-table.js';
import type { TraceEntry } from './cpu/cpu.js';
import { createInterruptController } from './interrupt-controller.js';
import { createJoypad } from './joypad.js';
import { createMMU } from './mmu.js';
import { createPPU } from './ppu.js';
import { createRegisters } from './cpu/registers.js';
import { createSerial } from './serial.js';
import { createTimer } from './timer.js';

type EmulatorHooks = {
  onSerialByte?(value: number, emulator: Emulator): void;
  onCycleLimit?(totalCycles: number, emulator: Emulator): void;
  cycleLimit?: number;
};

type Emulator = {
  start(rom: string | Uint8Array): void;
  stop(): void;
  getTrace(): TraceEntry[];
  read8(address: number): number;
};

const createEmulator = (hooks: EmulatorHooks = {}): Emulator => {
  let stopped = false;
  let getTrace: () => TraceEntry[] = () => [];

  const emulator: Emulator = {
    start: (rom) => {
      const data = typeof rom === 'string' ? readFileSync(rom) : rom;

      const cartridge = createCartridge({ data });
      const interruptController = createInterruptController();
      const timer = createTimer({ interruptController });
      const ppu = createPPU({ interruptController });
      const registers = createRegisters();
      const serial = createSerial({
        output: {
          onByte: (value) => hooks.onSerialByte?.(value, emulator),
        },
      });
      const mmu = createMMU({ cartridge, interruptController, ppu, serial, timer });
      const cpu = createCPU({ mmu, registers, buildOpcodeTable: createOpcodeTable });
      const apu = createAPU();
      const joypad = createJoypad();

      getTrace = () => cpu.getTrace();
      emulator.read8 = (address) => mmu.read8(address);
      stopped = false;

      let totalCycles = 0;
      const cycleLimit = hooks.cycleLimit ?? Infinity;
      const tick = () => { ppu.step(4); apu.step(4); timer.step(4); };

      let lastPc = -1;
      let sameCount = 0;

      while (!stopped) {
        const pc = registers.pc;
        const cycles = cpu.step(tick);
        totalCycles += cycles;
        if (registers.pc === pc) {
          sameCount++;
          if (sameCount >= 100) {
            hooks.onCycleLimit?.(totalCycles, emulator);
            break;
          }
        } else {
          sameCount = 0;
        }
        lastPc = pc;
        if (totalCycles >= cycleLimit) {
          hooks.onCycleLimit?.(totalCycles, emulator);
          break;
        }
      }
    },

    stop: () => {
      stopped = true;
    },

    getTrace: () => getTrace(),
    read8: (_address) => 0xff,
  };

  return emulator;
};

export { createEmulator };
export type { Emulator, EmulatorHooks };
