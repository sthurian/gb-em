import type { Registers } from '../../cpu.js';

const createLdLC = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD L,C', bytes: 1,
  execute: () => { registers.l = registers.c; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdLC };
