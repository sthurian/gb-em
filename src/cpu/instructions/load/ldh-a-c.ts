import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdhACDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdhAC = ({ mmu, registers }: LdhACDependencies) => {
  return {
    mnemonic: 'LD A,(C)',
    bytes: 1,
    execute: (tick = () => {}) => {
      registers.a = mmu.read8(0xff00 + registers.c); tick();
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdhAC };
