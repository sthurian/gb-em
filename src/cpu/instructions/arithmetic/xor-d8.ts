import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type XorD8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createXorD8 = ({ mmu, registers }: XorD8Dependencies) => {
  return {
    mnemonic: 'XOR d8',
    bytes: 2,
    execute: (tick = () => {}) => {
      const value = mmu.read8(registers.pc + 1); tick();
      const result = registers.a ^ value;

      registers.a = result;
      registers.f = result === 0 ? 0x80 : 0;
      registers.pc = (registers.pc + 2) & 0xffff;

      return 8;
    },
  };
};

export { createXorD8 };
