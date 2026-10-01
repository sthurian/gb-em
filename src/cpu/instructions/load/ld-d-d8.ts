import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdDD8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdDD8 = ({ mmu, registers }: LdDD8Dependencies) => ({
  mnemonic: 'LD D,d8',
  bytes: 2,

  execute: (tick = () => {}) => {
    registers.d = mmu.read8((registers.pc + 1) & 0xffff); tick();

    registers.pc = (registers.pc + 2) & 0xffff;

    return 8;
  },
});

export { createLdDD8 };