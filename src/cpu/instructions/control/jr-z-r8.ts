import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type JrZDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createJrZ = ({ mmu, registers }: JrZDependencies) => {
  return {
    mnemonic: 'JR Z,r8',
    bytes: 2,
    execute: (tick = () => {}) => {
      const offset = mmu.read8(registers.pc + 1); tick();

      if ((registers.f & 0x80) !== 0) {
        const signedOffset = offset < 0x80 ? offset : offset - 0x100;
        registers.pc = (registers.pc + 2 + signedOffset) & 0xffff;

        tick(); // internal cycle after jump
      return 12;
      }

      registers.pc = (registers.pc + 2) & 0xffff;

      return 8;
    },
  };
};

export { createJrZ };