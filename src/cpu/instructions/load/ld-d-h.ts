import type { Registers } from '../../cpu.js';

const createLdDH = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD D,H', bytes: 1,
  execute: () => { registers.d = registers.h; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdDH };
