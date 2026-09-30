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
import type { SerialOutput } from './serial.js';
import { createRegisters } from './cpu/registers.js';
import { readFileSync } from 'node:fs';

const romPath = process.argv[2];
if (!romPath) {
  process.stderr.write('Usage: node index.js <rom>\n');
  process.exit(1);
}

const output: SerialOutput = {
  onByte: (value) => process.stdout.write(String.fromCharCode(value)),
};

const cartridge = createCartridge({ data: readFileSync(romPath) });
const serial = createSerial({ output });
const interruptController = createInterruptController();
const timer = createTimer({ interruptController });
const mmu = createMMU({ cartridge, interruptController, serial, timer });
const registers = createRegisters();
const cpu = createCPU({ mmu, registers, buildOpcodeTable: createOpcodeTable });
const ppu = createPPU();
const apu = createAPU();
const joypad = createJoypad();
const emulator = createEmulator({ cpu, ppu, apu, timer, joypad, interruptController });

emulator.start();
