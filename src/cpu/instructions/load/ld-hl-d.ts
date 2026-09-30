import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdHlDDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdHLD = ({ mmu, registers }: LdHlDDependencies) => {
  return {
    mnemonic: 'LD (HL),D',
    bytes: 1,
    execute: () => {
      const address = (registers.h << 8) | registers.l;

      mmu.write8(address, registers.d);

      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdHLD };
