import type { Registers } from '../../cpu.js';

const createLdEA = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD E,A', bytes: 1,
  execute: () => { registers.e = registers.a; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdEA };
