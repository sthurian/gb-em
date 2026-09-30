import type { Registers } from '../../cpu.js';

const createLdLB = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD L,B', bytes: 1,
  execute: () => { registers.l = registers.b; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdLB };
