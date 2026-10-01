import type { Registers } from '../../cpu.js';

type RlDDependencies = {
  registers: Registers;
};

const createRlD = ({ registers }: RlDDependencies) => ({
  mnemonic: 'RL D',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.d;
    const oldCarry = (registers.f >> 4) & 1;
    const result = ((val << 1) | oldCarry) & 0xff;
    const carry = (val >> 7) & 1;
    registers.d = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRlD };
