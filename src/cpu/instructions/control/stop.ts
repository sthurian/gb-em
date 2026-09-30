import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type StopDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createStop = ({ mmu, registers }: StopDependencies) => {
  return {
    mnemonic: 'STOP',
    bytes: 2,
    execute: () => {
      mmu.read8(registers.pc + 1); // discard next byte
      throw new Error('STOP not implemented');
    },
  };
};

export { createStop };
