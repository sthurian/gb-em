import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdHlIncADependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdHlIncA = ({ mmu, registers }: LdHlIncADependencies) => {
  return {
    mnemonic: 'LD (HL+),A',
    bytes: 1,
    execute: () => {
      const address = (registers.h << 8) | registers.l;

      mmu.write8(address, registers.a);

      const hl = (address + 1) & 0xffff;
      registers.h = hl >> 8;
      registers.l = hl & 0xff;

      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdHlIncA };
