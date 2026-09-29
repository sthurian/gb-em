import { createAPU } from './apu.js';
import { createCartridge } from './cartridge.js';
import { createCPU } from './cpu/cpu.js';
import { createOpcodeTable } from './cpu/opcode-table.js';
import { createEmulator } from './emulator.js';
import { createInterruptController } from './interrupt-controller.js';
import { createJoypad } from './joypad.js';
import { createMMU } from './mmu.js';
import { createPPU } from './ppu.js';
import { createTimer } from './timer.js';
import { createSerial } from './serial.js';
import { readFileSync } from 'node:fs';
import { createRegisters } from './cpu/registers.js';

const cartridge = createCartridge({
  data: readFileSync('./roms/cpu_instrs.gb'),
});

const serial = createSerial({
  onByte: (value) => {
    process.stdout.write(String.fromCharCode(value));
  },
});
const mmu = createMMU({ cartridge, serial });
const registers = createRegisters();
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
