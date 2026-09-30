import type { Registers } from '../../cpu.js';

type DaaDependencies = {
  registers: Registers;
};

const createDaa = ({ registers }: DaaDependencies) => {
  return {
    mnemonic: 'DAA',
    bytes: 1,
    execute: () => {
      const n = (registers.f >> 6) & 1;
      const h = (registers.f >> 5) & 1;
      const c = (registers.f >> 4) & 1;

      let a = registers.a;
      let newCarry = 0;

      if (!n) {
        if (c || a > 0x99) { a += 0x60; newCarry = 1; }
        if (h || (a & 0x0f) > 0x09) { a += 0x06; }
      } else {
        if (c) { a -= 0x60; newCarry = 1; }
        if (h) { a -= 0x06; }
      }

      a &= 0xff;
      registers.a = a;
      registers.f = (a === 0 ? 0x80 : 0x00) | (n ? 0x40 : 0x00) | (newCarry ? 0x10 : 0x00);
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createDaa };
