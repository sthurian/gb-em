import type { Registers } from '../../cpu.js';

type SwapDDependencies = {
  registers: Registers;
};

const createSwapD = ({ registers }: SwapDDependencies) => ({
  mnemonic: 'SWAP D',
  bytes: 1,
  execute: () => {
    const val = registers.d;
    const result = ((val & 0x0f) << 4) | ((val & 0xf0) >> 4);
    registers.d = result;
    registers.f = result === 0 ? 0x80 : 0x00;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSwapD };
