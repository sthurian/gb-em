import type { Registers } from '../../cpu.js';

const createLdLE = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD L,E', bytes: 1,
  execute: () => { registers.l = registers.e; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdLE };
