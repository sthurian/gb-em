import type { Registers } from '../../cpu.js';

type RrBDependencies = {
  registers: Registers;
};

const createRrB = ({ registers }: RrBDependencies) => ({
  mnemonic: 'RR B',
  bytes: 1,
  execute: () => {
    const val = registers.b;
    const oldCarry = (registers.f >> 4) & 1;
    const result = ((val >> 1) | (oldCarry << 7)) & 0xff;
    const carry = val & 1;
    registers.b = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRrB };
