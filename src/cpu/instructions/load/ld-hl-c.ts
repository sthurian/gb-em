import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdHlCDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdHLC = ({ mmu, registers }: LdHlCDependencies) => {
  return {
    mnemonic: 'LD (HL),C',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.h << 8) | registers.l;

      mmu.write8(address, registers.c); tick();

      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdHLC };
