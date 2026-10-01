import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdDeIndirectADependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdDeIndirectA = ({
  mmu,
  registers,
}: LdDeIndirectADependencies) => {
  return {
    mnemonic: 'LD (DE),A',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.d << 8) | registers.e;

      mmu.write8(address, registers.a); tick();
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdDeIndirectA };
