import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdHlEDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdHLE = ({ mmu, registers }: LdHlEDependencies) => {
  return {
    mnemonic: 'LD (HL),E',
    bytes: 1,
    execute: () => {
      const address = (registers.h << 8) | registers.l;

      mmu.write8(address, registers.e);

      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdHLE };
