import type { Registers } from '../../cpu.js';

const createLdLA = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD L,A', bytes: 1,
  execute: () => { registers.l = registers.a; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdLA };
