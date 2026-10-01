import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createCartridge } from '../../../cartridge.js';
import { createInterruptController } from '../../../interrupt-controller.js';
import { createPPU } from '../../../ppu.js';
import { createJoypad } from '../../../joypad.js';
import { createTimer } from '../../../timer.js';
import { createMMU } from '../../../mmu.js';
import { createSerial } from '../../../serial.js';
import type { Registers } from '../../cpu.js';
import { createLdHlD16 } from './ld-hl-d16.js';

suite('LD HL,d16', () => {
  test('loads a 16-bit immediate value into HL', () => {
    const cartridgeData = new Uint8Array(0x8000);
    cartridgeData[0x0101] = 0x34;
    cartridgeData[0x0102] = 0x12;

    const cartridge = createCartridge({
      data: cartridgeData,
    });

    const serial = createSerial({ output: { onByte: () => {} } });

    const mmu = createMMU({
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

    const ldHlD16 = createLdHlD16({
      mmu,
      registers,
    });

    const cycles = ldHlD16.execute();

    assert.strictEqual(registers.h, 0x12);
    assert.strictEqual(registers.l, 0x34);
    assert.strictEqual(registers.pc, 0x0103);
    assert.strictEqual(cycles, 12);
  });
});