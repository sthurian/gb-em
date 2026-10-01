import type { Registers } from '../../cpu.js';

type IncDEDependencies = {
  registers: Registers;
};

const createIncDE = ({ registers }: IncDEDependencies) => {
  return {
    mnemonic: 'INC DE',
    bytes: 1,
    execute: (tick = () => {}) => {
      const de = (registers.d << 8) | registers.e;
      const result = (de + 1) & 0xffff;

      registers.d = result >> 8;
      registers.e = result & 0xff;
      tick(); // internal M-cycle
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createIncDE };
