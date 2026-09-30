import type { Registers } from '../../cpu.js';

const createLdHD = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD H,D', bytes: 1,
  execute: () => { registers.h = registers.d; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdHD };
