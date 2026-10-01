import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdHlBDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdHLB = ({ mmu, registers }: LdHlBDependencies) => {
  return {
    mnemonic: 'LD (HL),B',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.h << 8) | registers.l;

      mmu.write8(address, registers.b); tick();

      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdHLB };
