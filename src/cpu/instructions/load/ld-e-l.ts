import type { Registers } from '../../cpu.js';

const createLdEL = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD E,L', bytes: 1,
  execute: () => { registers.e = registers.l; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdEL };
