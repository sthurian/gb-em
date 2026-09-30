import type { Registers } from '../../cpu.js';

const createLdEE = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD E,E', bytes: 1,
  execute: () => { registers.e = registers.e; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdEE };
