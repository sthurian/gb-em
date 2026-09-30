import type { Registers } from '../../cpu.js';

type AdcAEDependencies = {
  registers: Registers;
};

const createAdcAE = ({ registers }: AdcAEDependencies) => {
  return {
    mnemonic: 'ADC A,E',
    bytes: 1,
    execute: () => {
      const value = registers.e;
      const carry = (registers.f >> 4) & 1;
      const result = registers.a + value + carry;

      const zero = (result & 0xff) === 0;
      const halfCarry = ((registers.a & 0x0f) + (value & 0x0f) + carry) > 0x0f;
      const newCarry = result > 0xff;

      registers.a = result & 0xff;
      registers.f =
        (zero ? 0x80 : 0) |
        (halfCarry ? 0x20 : 0) |
        (newCarry ? 0x10 : 0);

      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createAdcAE };
