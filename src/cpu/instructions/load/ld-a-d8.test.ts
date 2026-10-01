import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createCartridge } from '../../../cartridge.js';
import { createInterruptController } from '../../../interrupt-controller.js';
import { createPPU } from '../../../ppu.js';
import { createAPU } from '../../../apu.js';
import { createJoypad } from '../../../joypad.js';
import { createTimer } from '../../../timer.js';
import { createMMU } from '../../../mmu.js';
import { createSerial } from '../../../serial.js';
import type { Registers } from '../../cpu.js';
import { createLdAD8 } from './ld-a-d8.js';

suite('LD A,d8', () => {
  test('loads an 8-bit immediate value into A', () => {
    const cartridgeData = new Uint8Array(0x8000);
    cartridgeData[0x0101] = 0x42;

    const cartridge = createCartridge({
      data: cartridgeData,
    });

    const serial = createSerial({ output: { onByte: () => {} } });

    const mmu = createMMU({ apu: createAPU(),
      cartridge,
      serial,
      interruptController: createInterruptController(),
      timer: createTimer({ interruptController: createInterruptController() }),
      ppu: createPPU({ interruptController: createInterruptController() }),
      joypad: createJoypad({ interruptController: createInterruptController() }),
    });

    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const ldAD8 = createLdAD8({
      mmu,
      registers,
    });

    const cycles = ldAD8.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 8);
  });
});