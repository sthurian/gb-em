import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdHlADependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdHlA = ({ mmu, registers }: LdHlADependencies) => {
  return {
    mnemonic: 'LD (HL),A',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.h << 8) | registers.l;

      mmu.write8(address, registers.a); tick();

      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdHlA };