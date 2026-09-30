import type { Registers } from '../../cpu.js';

type RlcaDependencies = {
  registers: Registers;
};

const createRlca = ({ registers }: RlcaDependencies) => {
  return {
    mnemonic: 'RLCA',
    bytes: 1,
    execute: () => {
      const a = registers.a;
      const result = ((a << 1) | (a >> 7)) & 0xff;
      const c = (a >> 7) & 1;

      registers.a = result;
      registers.f = c ? 0x10 : 0x00;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createRlca };
