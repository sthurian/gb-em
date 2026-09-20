import { createCPU } from './cpu/cpu.js';
import { createEmulator } from './emulator.js';
import { createMMU } from './mmu.js';

const mmu = createMMU();
const cpu = createCPU({ mmu });
const emulator = createEmulator({
  cpu,
});

emulator.start();
