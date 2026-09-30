import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdAHlDecDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdAHlDec = ({ mmu, registers }: LdAHlDecDependencies) => {
  return {
    mnemonic: 'LD A,(HL-)',
    bytes: 1,
    execute: () => {
      const address = (registers.h << 8) | registers.l;

      registers.a = mmu.read8(address);

      const hl = (address - 1) & 0xffff;
      registers.h = hl >> 8;
      registers.l = hl & 0xff;

      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdAHlDec };
