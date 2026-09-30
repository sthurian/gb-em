import type { Registers } from '../../cpu.js';

type SwapHDependencies = {
  registers: Registers;
};

const createSwapH = ({ registers }: SwapHDependencies) => ({
  mnemonic: 'SWAP H',
  bytes: 1,
  execute: () => {
    const val = registers.h;
    const result = ((val & 0x0f) << 4) | ((val & 0xf0) >> 4);
    registers.h = result;
    registers.f = result === 0 ? 0x80 : 0x00;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSwapH };
