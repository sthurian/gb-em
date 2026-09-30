import type { Registers } from '../../cpu.js';

const createLdDB = ({ registers }: { registers: Registers }) => ({
  mnemonic: 'LD D,B', bytes: 1,
  execute: () => { registers.d = registers.b; registers.pc = (registers.pc + 1) & 0xffff; return 4; },
});

export { createLdDB };
