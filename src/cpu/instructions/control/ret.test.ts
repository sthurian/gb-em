import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createCartridge } from '../../../cartridge.js';
import { createInterruptController } from '../../../interrupt-controller.js';
import { createTimer } from '../../../timer.js';
import { createMMU } from '../../../mmu.js';
import { createSerial } from '../../../serial.js';
import type { Registers } from '../../cpu.js';
import { createRet } from './ret.js';

suite('RET', () => {
  test('pops the return address from the stack', () => {
    const cartridge = createCartridge({
      data: new Uint8Array(0x8000),
    });

    const serial = createSerial({
      onByte: () => {},
    });

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
      sp: 0x8000,
      pc: 0,
      ime: false
    };

    mmu.write8(0x8000, 0x34);
    mmu.write8(0x8001, 0x12);

    const ret = createRet({
      mmu,
      registers,
    });

    const cycles = ret.execute();

    assert.strictEqual(registers.pc, 0x1234);
    assert.strictEqual(registers.sp, 0x8002);
    assert.strictEqual(cycles, 16);
  });
});