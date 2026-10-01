import type { Registers } from '../../cpu.js';

type SwapEDependencies = {
  registers: Registers;
};

const createSwapE = ({ registers }: SwapEDependencies) => ({
  mnemonic: 'SWAP E',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.e;
    const result = ((val & 0x0f) << 4) | ((val & 0xf0) >> 4);
    registers.e = result;
    registers.f = result === 0 ? 0x80 : 0x00;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSwapE };
