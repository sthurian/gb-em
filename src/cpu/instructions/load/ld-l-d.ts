import type { Registers } from '../../cpu.js';

const createLdLD = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD L,D', bytes: 1,
  execute: () => { registers.l = registers.d; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdLD };
