import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

const createLdHD8 = ({ mmu, registers }: { mmu: MMU; registers: Registers }) => ({
  mnemonic: 'LD H,d8',
  bytes: 2,
  execute: (tick = () => {}) => {
    registers.h = mmu.read8((registers.pc + 1) & 0xffff); tick();
    registers.pc = (registers.pc + 2) & 0xffff;
    return 8;
  },
});

export { createLdHD8 };
