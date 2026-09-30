import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdAIndirectBCDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdAIndirectBC = ({
  mmu,
  registers,
}: LdAIndirectBCDependencies) => {
  return {
    mnemonic: 'LD A,(BC)',
    bytes: 1,
    execute: () => {
      const address = (registers.b << 8) | registers.c;

      registers.a = mmu.read8(address);
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdAIndirectBC };
