import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdCD8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdCD8 = ({ mmu, registers }: LdCD8Dependencies) => ({
  mnemonic: 'LD C,d8',
  bytes: 2,

  execute: () => {
    registers.c = mmu.read8((registers.pc + 1) & 0xffff);

    registers.pc = (registers.pc + 2) & 0xffff;

    return 8;
  },
});

export { createLdCD8 };