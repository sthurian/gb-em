import type { Registers } from '../../cpu.js';

const createLdHE = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD H,E', bytes: 1,
  execute: () => { registers.h = registers.e; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdHE };
