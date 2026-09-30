import type { Registers } from '../../cpu.js';

type SwapBDependencies = {
  registers: Registers;
};

const createSwapB = ({ registers }: SwapBDependencies) => ({
  mnemonic: 'SWAP B',
  bytes: 1,
  execute: () => {
    const val = registers.b;
    const result = ((val & 0x0f) << 4) | ((val & 0xf0) >> 4);
    registers.b = result;
    registers.f = result === 0 ? 0x80 : 0x00;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSwapB };
