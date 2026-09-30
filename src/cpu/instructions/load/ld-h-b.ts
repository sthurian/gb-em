import type { Registers } from '../../cpu.js';

const createLdHB = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD H,B', bytes: 1,
  execute: () => { registers.h = registers.b; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdHB };
