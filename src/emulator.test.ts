import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createEmulator } from './emulator.js';

suite('Emulator', () => {
  test('passes CPU cycles to the PPU, APU, and Timer', () => {
    const ppuCycles: number[] = [];
    const apuCycles: number[] = [];
    const timerCycles: number[] = [];

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

    const apu = {
      step: (cycles: number) => {
        apuCycles.push(cycles);
      },
    };

    const timer = {
      step: (cycles: number) => {
        timerCycles.push(cycles);
      },
    };

    const emulator = createEmulator({
      cpu,
      ppu,
      apu,
      timer,
    });

    emulator.step();

    assert.deepStrictEqual(ppuCycles, [4]);
    assert.deepStrictEqual(apuCycles, [4]);
    assert.deepStrictEqual(timerCycles, [4]);
  });
});