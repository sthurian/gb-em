import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdBD8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdBD8 = ({ mmu, registers }: LdBD8Dependencies) => ({
  mnemonic: 'LD B,d8',
  bytes: 2,

  execute: (tick = () => {}) => {
    registers.b = mmu.read8((registers.pc + 1) & 0xffff); tick();

    registers.pc = (registers.pc + 2) & 0xffff;

    return 8;
  },
});

export { createLdBD8 };