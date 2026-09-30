import type { Registers } from '../../cpu.js';

const createLdDL = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD D,L', bytes: 1,
  execute: () => { registers.d = registers.l; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdDL };
