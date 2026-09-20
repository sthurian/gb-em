import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdED8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdED8 = ({
  mmu,
  registers,
}: LdED8Dependencies) => ({
  mnemonic: 'LD E,d8',
  bytes: 2,
  execute: () => {
    const value = mmu.read8((registers.pc + 1) & 0xffff);

    registers.e = value;
    registers.pc = (registers.pc + 2) & 0xffff;

    return 8;
  },
});

export { createLdED8 };