import type { Registers } from '../../cpu.js';

const createLdDA = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD D,A', bytes: 1,
  execute: () => { registers.d = registers.a; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdDA };
