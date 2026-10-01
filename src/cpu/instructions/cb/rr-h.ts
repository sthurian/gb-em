import type { Registers } from '../../cpu.js';

type RrHDependencies = {
  registers: Registers;
};

const createRrH = ({ registers }: RrHDependencies) => ({
  mnemonic: 'RR H',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.h;
    const oldCarry = (registers.f >> 4) & 1;
    const result = ((val >> 1) | (oldCarry << 7)) & 0xff;
    const carry = val & 1;
    registers.h = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRrH };
