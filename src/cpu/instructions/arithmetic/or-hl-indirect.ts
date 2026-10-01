import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type OrHLIndirectDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createOrHLIndirect = ({ mmu, registers }: OrHLIndirectDependencies) => {
  return {
    mnemonic: 'OR (HL)',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.h << 8) | registers.l;
      const val = mmu.read8(address); tick();
    registers.a = registers.a | val;
      registers.f = registers.a === 0 ? 0x80 : 0x00;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createOrHLIndirect };
