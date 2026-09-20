import { createAPU } from './apu.js';
import { createCPU } from './cpu/cpu.js';
import { createOpcodeTable } from './cpu/opcode-table.js';
import { createEmulator } from './emulator.js';
import { createInterruptController } from './interrupt-controller.js';
import { createJoypad } from './joypad.js';
import { createMMU } from './mmu.js';
import { createPPU } from './ppu.js';
import { createTimer } from './timer.js';

const mmu = createMMU();
const registers = { a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0 };
const opcodeTable = createOpcodeTable({mmu, registers});
const cpu = createCPU({ mmu, opcodeTable, registers });
const ppu = createPPU();
const apu = createAPU();
const timer = createTimer();
const joypad = createJoypad();
const interruptController = createInterruptController();
const emulator = createEmulator({
  cpu,
  ppu,
  apu,
  timer,
  joypad,
  interruptController
});

emulator.start();
