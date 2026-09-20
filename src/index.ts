import { createCPU } from './cpu/cpu.js';
import { createInstructions } from './cpu/instructions.js';
import { createEmulator } from './emulator.js';
import { createMMU } from './mmu.js';

const mmu = createMMU();
const registers = { a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0 };
const instructions = createInstructions({mmu, registers});
const cpu = createCPU({ mmu, instructions, registers });
const emulator = createEmulator({
  cpu,
});

emulator.start();
