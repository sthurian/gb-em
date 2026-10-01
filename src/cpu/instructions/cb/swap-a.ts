import type { Registers } from '../../cpu.js';

type SwapADependencies = {
  registers: Registers;
};

const createSwapA = ({ registers }: SwapADependencies) => ({
  mnemonic: 'SWAP A',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.a;
    const result = ((val & 0x0f) << 4) | ((val & 0xf0) >> 4);
    registers.a = result;
    registers.f = result === 0 ? 0x80 : 0x00;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSwapA };
