import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createEmulator } from './emulator.js';

suite('Emulator', () => {
  test('starts and stops via stop()', () => {
    let stopped = false;
    const emulator = createEmulator({
      onSerialByte: (_value, em) => em.stop(),
    });

    // ROM that writes to serial then halts
    const rom = new Uint8Array(0x8000);
    rom[0x0100] = 0x3e; // LD A, 0x41
    rom[0x0101] = 0x41;
    rom[0x0102] = 0xe0; // LDH (0x01), A  → triggers serial (0xff01)
    rom[0x0103] = 0x01;
    rom[0x0104] = 0x3e; // LD A, 0x81
    rom[0x0105] = 0x81;
    rom[0x0106] = 0xe0; // LDH (0x02), A  → triggers serial transfer (0xff02)
    rom[0x0107] = 0x02;
    rom[0x0108] = 0x76; // HALT

    emulator.load(rom); for (let i = 0; i < 1000; i++) emulator.runFrame();
    stopped = true;

    assert.ok(stopped);
  });

  test('onSerialByte receives emitted bytes', () => {
    const received: number[] = [];

    const emulator = createEmulator({
      onSerialByte: (value, em) => {
        received.push(value);
        em.stop();
      },
    });

    const rom = new Uint8Array(0x8000);
    rom[0x0100] = 0x3e; // LD A, 0x42
    rom[0x0101] = 0x42;
    rom[0x0102] = 0xe0; // LDH (0x01), A
    rom[0x0103] = 0x01;
    rom[0x0104] = 0x3e; // LD A, 0x81
    rom[0x0105] = 0x81;
    rom[0x0106] = 0xe0; // LDH (0x02), A → serial transfer
    rom[0x0107] = 0x02;
    rom[0x0108] = 0x76; // HALT

    emulator.load(rom); for (let i = 0; i < 1000; i++) emulator.runFrame();

    assert.deepStrictEqual(received, [0x42]);
  });

  test('getTrace returns entries after start', () => {
    const emulator = createEmulator({
      onSerialByte: (_value, em) => em.stop(),
    });

    const rom = new Uint8Array(0x8000);
    rom[0x0100] = 0x3e; rom[0x0101] = 0x41; // LD A, 0x41
    rom[0x0102] = 0xe0; rom[0x0103] = 0x01; // LDH (0xff01), A
    rom[0x0104] = 0x3e; rom[0x0105] = 0x81; // LD A, 0x81
    rom[0x0106] = 0xe0; rom[0x0107] = 0x02; // LDH (0xff02), A → serial
    rom[0x0108] = 0x76;                      // HALT

    emulator.load(rom); for (let i = 0; i < 1000; i++) emulator.runFrame();

    const trace = emulator.getTrace();
    assert.ok(trace.length > 0);
  });
});
