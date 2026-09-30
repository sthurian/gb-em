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
                    ime: false,
                },
            }),
            getTrace: () => [],
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
            read8: () => 0,
            write8: () => {},
        };

        const joypad = {
            press: () => { },
            release: () => { },
        };

        const interruptController = {
            request: () => { },
            read8: () => 0,
            write8: () => {},
        }

        const emulator = createEmulator({
            cpu,
            ppu,
            apu,
            timer,
            joypad,
            interruptController
        });

        emulator.step();

        assert.deepStrictEqual(ppuCycles, [4]);
        assert.deepStrictEqual(apuCycles, [4]);
        assert.deepStrictEqual(timerCycles, [4]);
    });

    test('starts stepping the emulator', () => {
        const cpu = {
            step: () => {
                throw new Error('stop');
            },
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
                    ime: false,
                },
            }),
            getTrace: () => [],
        };

        const ppu = {
            step: () => { },
        };

        const apu = {
            step: () => { },
        };

        const timer = {
            step: () => { },
            read8: () => 0,
            write8: () => {},
        };

        const joypad = {
            press: () => { },
            release: () => { },
        };

        const interruptController = {
            request: () => { },
            read8: () => 0,
            write8: () => {},
        };

        const emulator = createEmulator({
            cpu,
            ppu,
            apu,
            timer,
            joypad,
            interruptController,
        });

        assert.throws(() => emulator.start(), /stop/);
    });

  test('counts hits when PC equals 0x0430', () => {
    let callCount = 0;
    const cpu = {
      step: () => {
        callCount++;
        if (callCount > 1) throw new Error('stop');
        return 4;
      },
      getState: () => ({
        registers: { a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0430, ime: false },
      }),
      getTrace: () => [],
    };
    const ppu = { step: () => {} };
    const apu = { step: () => {} };
    const timer = { step: () => {}, read8: () => 0, write8: () => {} };
    const joypad = { press: () => {}, release: () => {} };
    const interruptController = { request: () => {}, read8: () => 0, write8: () => {} };
    const emulator = createEmulator({ cpu, ppu, apu, timer, joypad, interruptController });
    assert.throws(() => emulator.start(), /stop/);
  });
});
