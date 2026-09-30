import type { Registers } from '../../cpu.js';

const createLdDD = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD D,D', bytes: 1,
  execute: () => { registers.d = registers.d; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdDD };
