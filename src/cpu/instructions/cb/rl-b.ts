import type { Registers } from '../../cpu.js';

type RlBDependencies = {
  registers: Registers;
};

const createRlB = ({ registers }: RlBDependencies) => ({
  mnemonic: 'RL B',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.b;
    const oldCarry = (registers.f >> 4) & 1;
    const result = ((val << 1) | oldCarry) & 0xff;
    const carry = (val >> 7) & 1;
    registers.b = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRlB };
