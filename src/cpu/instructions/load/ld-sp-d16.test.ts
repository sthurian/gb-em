import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createCartridge } from '../../../cartridge.js';
import { createMMU } from '../../../mmu.js';
import { createSerial } from '../../../serial.js';
import type { Registers } from '../../cpu.js';
import { createLdSpD16 } from './ld-sp-d16.js';

suite('LD SP,d16', () => {
  test('loads a 16-bit immediate value into SP', () => {
    const cartridgeData = new Uint8Array(0x8000);
    cartridgeData[0x0101] = 0x34;
    cartridgeData[0x0102] = 0x12;

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
    };

    const ldSpD16 = createLdSpD16({
      mmu,
      registers,
    });

    const cycles = ldSpD16.execute();

    assert.strictEqual(registers.sp, 0x1234);
    assert.strictEqual(registers.pc, 0x0103);
    assert.strictEqual(cycles, 12);
  });
});