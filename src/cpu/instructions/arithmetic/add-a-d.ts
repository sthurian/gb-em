import type { Registers } from '../../cpu.js';

type AddADDependencies = {
  registers: Registers;
};

const createAddAD = ({ registers }: AddADDependencies) => {
  return {
    mnemonic: 'ADD A,D',
    bytes: 1,
    execute: () => {
      const value = registers.d;
      const result = registers.a + value;

      const zero = (result & 0xff) === 0;
      const halfCarry = ((registers.a & 0x0f) + (value & 0x0f)) > 0x0f;
      const carry = result > 0xff;

      registers.a = result & 0xff;
      registers.f =
        (zero ? 0x80 : 0) |
        (halfCarry ? 0x20 : 0) |
        (carry ? 0x10 : 0);

      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createAddAD };
