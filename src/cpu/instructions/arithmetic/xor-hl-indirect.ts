import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type XorHLIndirectDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createXorHLIndirect = ({ mmu, registers }: XorHLIndirectDependencies) => {
  return {
    mnemonic: 'XOR (HL)',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.h << 8) | registers.l;
      registers.a = registers.a ^ mmu.read8(address);
      registers.f = registers.a === 0 ? 0x80 : 0x00;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createXorHLIndirect };
