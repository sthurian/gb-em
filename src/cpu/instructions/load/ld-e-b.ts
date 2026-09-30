import type { Registers } from '../../cpu.js';

const createLdEB = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD E,B', bytes: 1,
  execute: () => { registers.e = registers.b; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdEB };
