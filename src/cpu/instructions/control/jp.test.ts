import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createCartridge } from '../../../cartridge.js';
import { createInterruptController } from '../../../interrupt-controller.js';
import { createTimer } from '../../../timer.js';
import { createMMU } from '../../../mmu.js';
import { createSerial } from '../../../serial.js';
import type { Registers } from '../../cpu.js';
import { createJp } from './jp.js';

suite('JP a16', () => {
  test('jumps to the specified address', () => {
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

    const jp = createJp({
      mmu,
      registers,
    });

    const cycles = jp.execute();

    assert.strictEqual(registers.pc, 0x1234);
    assert.strictEqual(cycles, 16);
  });
});