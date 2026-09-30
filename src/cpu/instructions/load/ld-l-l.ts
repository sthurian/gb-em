import type { Registers } from '../../cpu.js';

const createLdLL = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD L,L', bytes: 1,
  execute: () => { registers.l = registers.l; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdLL };
