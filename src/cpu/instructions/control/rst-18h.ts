import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type RstDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createRst18h = ({ mmu, registers }: RstDependencies) => {
  return {
    mnemonic: 'RST 18H',
    bytes: 1,
    execute: (tick = () => {}) => {
      const returnAddress = (registers.pc + 1) & 0xffff;

      tick(); // internal cycle before push
      registers.sp = (registers.sp - 2) & 0xffff;
      mmu.write8(registers.sp, returnAddress & 0xff); tick();
      mmu.write8(registers.sp + 1, returnAddress >> 8); tick();

      registers.pc = 0x0018;

      return 16;
    },
  };
};

export { createRst18h };
