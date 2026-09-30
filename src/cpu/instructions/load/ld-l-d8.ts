import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdLD8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdLD8 = ({ mmu, registers }: LdLD8Dependencies) => {
  return {
    mnemonic: 'LD L,d8',
    bytes: 2,
    execute: () => {
      registers.l = mmu.read8(registers.pc + 1);
      registers.pc = (registers.pc + 2) & 0xffff;

      return 8;
    },
  };
};

export { createLdLD8 };
