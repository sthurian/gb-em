import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdAD8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdAD8 = ({ mmu, registers }: LdAD8Dependencies) => {
  return {
    mnemonic: 'LD A,d8',
    bytes: 2,
    execute: () => {
      registers.a = mmu.read8(registers.pc + 1);
      registers.pc = (registers.pc + 2) & 0xffff;

      return 8;
    },
  };
};

export { createLdAD8 };