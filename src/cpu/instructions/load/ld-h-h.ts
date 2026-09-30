import type { Registers } from '../../cpu.js';

const createLdHH = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD H,H', bytes: 1,
  execute: () => { registers.h = registers.h; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdHH };
