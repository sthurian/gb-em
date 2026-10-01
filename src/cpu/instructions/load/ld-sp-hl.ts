import type { Registers } from '../../cpu.js';

type LdSpHLDependencies = {
  registers: Registers;
};

const createLdSpHL = ({ registers }: LdSpHLDependencies) => {
  return {
    mnemonic: 'LD SP,HL',
    bytes: 1,
    execute: (tick = () => {}) => {
      registers.sp = (registers.h << 8) | registers.l;
      tick(); // internal M-cycle
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdSpHL };
