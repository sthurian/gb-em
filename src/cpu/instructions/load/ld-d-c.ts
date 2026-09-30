import type { Registers } from '../../cpu.js';

const createLdDC = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD D,C', bytes: 1,
  execute: () => { registers.d = registers.c; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdDC };
