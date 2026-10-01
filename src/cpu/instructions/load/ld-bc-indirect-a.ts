import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdBcIndirectADependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdBcIndirectA = ({
  mmu,
  registers,
}: LdBcIndirectADependencies) => {
  return {
    mnemonic: 'LD (BC),A',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.b << 8) | registers.c;

      mmu.write8(address, registers.a); tick();
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdBcIndirectA };
