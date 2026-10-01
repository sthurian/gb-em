import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type JrDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createJr = ({ mmu, registers }: JrDependencies) => {
  return {
    mnemonic: 'JR r8',
    bytes: 2,
    execute: (tick = () => {}) => {
      const offset = mmu.read8(registers.pc + 1); tick();
      const signedOffset = offset < 0x80 ? offset : offset - 0x100;

      registers.pc = (registers.pc + 2 + signedOffset) & 0xffff;
      tick(); // internal cycle after jump

      return 12;
    },
  };
};

export { createJr };