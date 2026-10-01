import type { Registers } from '../../cpu.js';

type SwapLDependencies = {
  registers: Registers;
};

const createSwapL = ({ registers }: SwapLDependencies) => ({
  mnemonic: 'SWAP L',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.l;
    const result = ((val & 0x0f) << 4) | ((val & 0xf0) >> 4);
    registers.l = result;
    registers.f = result === 0 ? 0x80 : 0x00;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSwapL };
