import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdhA8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdhA8 = ({ mmu, registers }: LdhA8Dependencies) => {
  return {
    mnemonic: 'LDH A,(a8)',
    bytes: 2,
    execute: () => {
      const offset = mmu.read8(registers.pc + 1);
      registers.a = mmu.read8(0xff00 + offset);

      registers.pc = (registers.pc + 2) & 0xffff;

      return 12;
    },
  };
};

export { createLdhA8 };