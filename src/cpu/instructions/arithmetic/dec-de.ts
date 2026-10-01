import type { Registers } from '../../cpu.js';

type DecDEDependencies = {
  registers: Registers;
};

const createDecDE = ({ registers }: DecDEDependencies) => {
  return {
    mnemonic: 'DEC DE',
    bytes: 1,
    execute: (tick = () => {}) => {
      const de = (registers.d << 8) | registers.e;
      const result = (de - 1) & 0xffff;

      registers.d = result >> 8;
      registers.e = result & 0xff;
      tick(); // internal M-cycle
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createDecDE };
