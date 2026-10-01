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
import { createLdA16A } from './ld-a16-a.js';

suite('LD (a16),A', () => {
  test('stores A at the specified address', () => {
    const cartridgeData = new Uint8Array(0x8000);
    cartridgeData[0x0101] = 0x00;
    cartridgeData[0x0102] = 0xc0;

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
      a: 0x42,
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

    const ldA16A = createLdA16A({
      mmu,
      registers,
    });

    const cycles = ldA16A.execute();

    assert.strictEqual(mmu.read8(0xc000), 0x42);
    assert.strictEqual(registers.pc, 0x0103);
    assert.strictEqual(cycles, 16);
  });
});