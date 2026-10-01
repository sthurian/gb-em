import type { Registers } from '../../cpu.js';

type SwapCDependencies = {
  registers: Registers;
};

const createSwapC = ({ registers }: SwapCDependencies) => ({
  mnemonic: 'SWAP C',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.c;
    const result = ((val & 0x0f) << 4) | ((val & 0xf0) >> 4);
    registers.c = result;
    registers.f = result === 0 ? 0x80 : 0x00;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSwapC };
