import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type OrD8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createOrD8 = ({ mmu, registers }: OrD8Dependencies) => {
  return {
    mnemonic: 'OR d8',
    bytes: 2,
    execute: () => {
      const value = mmu.read8(registers.pc + 1);
      const result = registers.a | value;

      registers.a = result;
      registers.f = result === 0 ? 0x80 : 0;
      registers.pc = (registers.pc + 2) & 0xffff;

      return 8;
    },
  };
};

export { createOrD8 };