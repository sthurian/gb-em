import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdAIndirectDeDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdAIndirectDe = ({
  mmu,
  registers,
}: LdAIndirectDeDependencies) => {
  return {
    mnemonic: 'LD A,(DE)',
    bytes: 1,
    execute: () => {
      const address = (registers.d << 8) | registers.e;

      registers.a = mmu.read8(address);
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdAIndirectDe };