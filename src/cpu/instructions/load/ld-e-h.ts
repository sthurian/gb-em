import type { Registers } from '../../cpu.js';

const createLdEH = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD E,H', bytes: 1,
  execute: () => { registers.e = registers.h; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdEH };
