import type { Registers } from '../../cpu.js';

type SubADependencies = {
  registers: Registers;
};

const createSubA = ({ registers }: SubADependencies) => {
  return {
    mnemonic: 'SUB A',
    bytes: 1,
    execute: () => {
      const value = registers.a;
      const result = registers.a - value;

      const zero = (result & 0xff) === 0;
      const halfCarry = (registers.a & 0x0f) < (value & 0x0f);
      const carry = registers.a < value;

      registers.a = result & 0xff;
      /* c8 ignore next 5 */
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

export { createSubA };
