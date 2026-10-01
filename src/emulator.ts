import { createAPU } from './apu.js';
import type { APUDependencies } from './apu.js';
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
  onFrame?(pixels: Uint8ClampedArray): void;
  apuOptions?: APUDependencies;
  cycleLimit?: number;
};

type Emulator = {
  load(rom: Uint8Array): void;
  runFrame(cycles?: number): void;
  stop(): void;
  pressButton(button: import('./joypad.js').Button): void;
  releaseButton(button: import('./joypad.js').Button): void;
  getTrace(): TraceEntry[];
  read8(address: number): number;
};

const CYCLES_PER_FRAME = 70224;

const createEmulator = (hooks: EmulatorHooks = {}): Emulator => {
  let cpu: ReturnType<typeof createCPU> | null = null;
  let lastTrace: TraceEntry[] = [];
  let mmu: ReturnType<typeof createMMU> | null = null;
  let joypad: ReturnType<typeof createJoypad> | null = null;
  let ppu: ReturnType<typeof createPPU> | null = null;
  let apu: ReturnType<typeof createAPU> | null = null;
  let timer: ReturnType<typeof createTimer> | null = null;
  let tick: () => void = () => {};
  let getTrace: () => TraceEntry[] = () => [];

  const emulator: Emulator = {
    load: (rom) => {
      const data = rom;

      const cartridge = createCartridge({ data });
      const interruptController = createInterruptController();
      timer = createTimer({ interruptController });
      ppu = createPPU({ interruptController, onFrame: hooks.onFrame });
      const registers = createRegisters();
      const serial = createSerial({
        output: {
          onByte: (value) => hooks.onSerialByte?.(value, emulator),
        },
      });
      joypad = createJoypad({ interruptController });
      apu = createAPU(hooks.apuOptions);
      mmu = createMMU({ apu, cartridge, interruptController, joypad, ppu, serial, timer });
      cpu = createCPU({ mmu, registers, buildOpcodeTable: createOpcodeTable });

      getTrace = () => { lastTrace = cpu?.getTrace() ?? lastTrace; return lastTrace; };
      emulator.read8 = (address) => mmu!.read8(address);
      tick = () => { ppu!.step(4); apu!.step(4); timer!.step(4); };
    },

    runFrame: (frameCycles) => {
      if (!cpu) return;

      const cycleLimit = frameCycles ?? hooks.cycleLimit ?? CYCLES_PER_FRAME;
      let cycles = 0;
      let sameCount = 0;

      while (cpu && cycles < cycleLimit) {
        const registers = cpu.getState().registers;
        const pc = registers.pc;
        const stepped = cpu.step(tick);
        cycles += stepped;

        if (cpu && cpu.getState().registers.pc === pc && !cpu.isHalted()) {
          sameCount++;
          if (sameCount >= 100) {
            hooks.onCycleLimit?.(cycles, emulator);
            return;
          }
        } else {
          sameCount = 0;
        }
      }
    },

    stop: () => {
      if (cpu) lastTrace = cpu.getTrace();
      cpu = null;
    },

    pressButton: (button) => joypad?.press(button),
    releaseButton: (button) => joypad?.release(button),
    getTrace: () => getTrace(),
    read8: (_address) => 0xff,
  };

  return emulator;
};

export { createEmulator };
export type { Emulator, EmulatorHooks };
