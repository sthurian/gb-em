import type { Registers } from '../../cpu.js';

const createLdHC = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD H,C', bytes: 1,
  execute: () => { registers.h = registers.c; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdHC };
