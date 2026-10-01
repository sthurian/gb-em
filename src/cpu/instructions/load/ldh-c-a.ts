import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdhCADependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdhCA = ({ mmu, registers }: LdhCADependencies) => {
  return {
    mnemonic: 'LD (C),A',
    bytes: 1,
    execute: (tick = () => {}) => {
      mmu.write8(0xff00 + registers.c, registers.a); tick();
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdhCA };
