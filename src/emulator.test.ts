import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createEmulator } from './emulator.js';

suite('Emulator', () => {
  test('passes CPU cycles to the PPU', () => {
    const ppuCycles: number[] = [];

    const cpu = {
      step: () => 4,
      getState: () => ({
        registers: {
          a: 0,
          f: 0,
          b: 0,
          c: 0,
          d: 0,
          e: 0,
          h: 0,
          l: 0,
          sp: 0,
          pc: 0,
        },
      }),
    };

    const ppu = {
      step: (cycles: number) => {
        ppuCycles.push(cycles);
      },
    };

    const emulator = createEmulator({ cpu, ppu });

    emulator.step();

    assert.deepStrictEqual(ppuCycles, [4]);
  });
});