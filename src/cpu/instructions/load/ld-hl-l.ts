import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdHlLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdHLL = ({ mmu, registers }: LdHlLDependencies) => {
  return {
    mnemonic: 'LD (HL),L',
    bytes: 1,
    execute: () => {
      const address = (registers.h << 8) | registers.l;

      mmu.write8(address, registers.l);

      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdHLL };
