import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type AndHLIndirectDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createAndHLIndirect = ({ mmu, registers }: AndHLIndirectDependencies) => {
  return {
    mnemonic: 'AND (HL)',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.h << 8) | registers.l;
      const val = mmu.read8(address); tick();
    registers.a = registers.a & val;
      registers.f = (registers.a === 0 ? 0x80 : 0x00) | 0x20;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createAndHLIndirect };
