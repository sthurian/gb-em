import type { Registers } from '../../cpu.js';

const createLdHL = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD H,L', bytes: 1,
  execute: () => { registers.h = registers.l; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdHL };
