import type { Registers } from '../../cpu.js';

const createLdLH = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD L,H', bytes: 1,
  execute: () => { registers.l = registers.h; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdLH };
