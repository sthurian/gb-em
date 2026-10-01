import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdhA8ADependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdhA8A = ({ mmu, registers }: LdhA8ADependencies) => {
  return {
    mnemonic: 'LDH (a8),A',
    bytes: 2,
    execute: (tick = () => {}) => {
      const offset = mmu.read8(registers.pc + 1); tick();

      mmu.write8(0xff00 + offset, registers.a); tick();
      registers.pc = (registers.pc + 2) & 0xffff;

      return 12;
    },
  };
};

export { createLdhA8A };