import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type AndD8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createAndD8 = ({ mmu, registers }: AndD8Dependencies) => {
  return {
    mnemonic: 'AND d8',
    bytes: 2,
    execute: () => {
      const value = mmu.read8(registers.pc + 1);

      registers.a = registers.a & value;
      registers.f = (registers.a === 0 ? 0x80 : 0x00) | 0x20;

      registers.pc = (registers.pc + 2) & 0xffff;

      return 8;
    },
  };
};

export { createAndD8 };
