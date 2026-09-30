import type { Registers } from '../../cpu.js';

const createLdEC = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD E,C', bytes: 1,
  execute: () => { registers.e = registers.c; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdEC };
