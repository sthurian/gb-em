import type { Registers } from '../../cpu.js';

type CpLDependencies = {
  registers: Registers;
};

const createCpL = ({ registers }: CpLDependencies) => {
  return {
    mnemonic: 'CP L',
    bytes: 1,
    execute: () => {
      const value = registers.l;
      const result = registers.a - value;

      const zero = (result & 0xff) === 0;
      const halfCarry = (registers.a & 0x0f) < (value & 0x0f);
      const carry = registers.a < value;

      registers.f =
        (zero ? 0x80 : 0) |
        0x40 |
        (halfCarry ? 0x20 : 0) |
        (carry ? 0x10 : 0);

      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createCpL };
