import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createCartridge } from '../../../cartridge.js';
import { createMMU } from '../../../mmu.js';
import { createSerial } from '../../../serial.js';
import type { Registers } from '../../cpu.js';
import { createLdhA8A } from './ldh-a8-a.js';

suite('LDH (a8),A', () => {
  test('stores A at FF00 plus the immediate offset', () => {
    const cartridgeData = new Uint8Array(0x8000);
    cartridgeData[0x0101] = 0x42;

    const cartridge = createCartridge({
      data: cartridgeData,
    });

    const serial = createSerial({
      onByte: () => {},
    });

    const mmu = createMMU({
      cartridge,
      serial,
    });

    const registers: Registers = {
      a: 0xab,
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
    };

    const ldhA8A = createLdhA8A({
      mmu,
      registers,
    });

    const cycles = ldhA8A.execute();

    assert.strictEqual(mmu.read8(0xff42), 0xab);
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 12);
  });
});