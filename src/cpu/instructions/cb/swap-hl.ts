import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type SwapHLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createSwapHL = ({ mmu, registers }: SwapHLDependencies) => ({
  mnemonic: 'SWAP (HL)',
  bytes: 1,
  execute: () => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr);
    const result = ((val & 0x0f) << 4) | ((val & 0xf0) >> 4);
    mmu.write8(addr, result);
    registers.f = result === 0 ? 0x80 : 0x00;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createSwapHL };
