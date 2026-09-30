import type { Registers } from '../../cpu.js';

const createLdHA = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD H,A', bytes: 1,
  execute: () => { registers.h = registers.a; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdHA };
