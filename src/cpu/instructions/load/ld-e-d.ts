import type { Registers } from '../../cpu.js';

const createLdED = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD E,D', bytes: 1,
  execute: () => { registers.e = registers.d; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdED };
