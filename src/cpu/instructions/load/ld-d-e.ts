import type { Registers } from '../../cpu.js';

const createLdDE = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD D,E', bytes: 1,
  execute: () => { registers.d = registers.e; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdDE };
