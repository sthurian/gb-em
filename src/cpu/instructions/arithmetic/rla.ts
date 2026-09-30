import type { Registers } from '../../cpu.js';

type RlaDependencies = {
  registers: Registers;
};

const createRla = ({ registers }: RlaDependencies) => {
  return {
    mnemonic: 'RLA',
    bytes: 1,
    execute: () => {
      const a = registers.a;
      const old_c = (registers.f >> 4) & 1;
      const result = ((a << 1) | old_c) & 0xff;
      const c = (a >> 7) & 1;

      registers.a = result;
      registers.f = c ? 0x10 : 0x00;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createRla };
