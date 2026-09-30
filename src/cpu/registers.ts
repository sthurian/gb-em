import type { Registers } from './cpu.js';

const createRegisters = (): Registers => {
  return {
    a: 0x01,
    f: 0xb0,
    b: 0x00,
    c: 0x13,
    d: 0x00,
    e: 0xd8,
    h: 0x01,
    l: 0x4d,
    sp: 0xfffe,
    pc: 0x0100,
    ime: false,
    imeScheduled: false,
  };
};

export { createRegisters };