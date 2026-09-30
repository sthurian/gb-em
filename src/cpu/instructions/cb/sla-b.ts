import type { Registers } from '../../cpu.js';

type SlaBDependencies = {
  registers: Registers;
};

const createSlaB = ({ registers }: SlaBDependencies) => ({
  mnemonic: 'SLA B',
  bytes: 1,
  execute: () => {
    const val = registers.b;
    const result = (val << 1) & 0xff;
    const carry = (val >> 7) & 1;
    registers.b = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSlaB };
