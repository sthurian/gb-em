import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdHlDecADependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdHlDecA = ({ mmu, registers }: LdHlDecADependencies) => {
  return {
    mnemonic: 'LD (HL-),A',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.h << 8) | registers.l;

      mmu.write8(address, registers.a); tick();

      const hl = (address - 1) & 0xffff;
      registers.h = hl >> 8;
      registers.l = hl & 0xff;

      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdHlDecA };
