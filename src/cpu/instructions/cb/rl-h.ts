import type { Registers } from '../../cpu.js';

type RlHDependencies = {
  registers: Registers;
};

const createRlH = ({ registers }: RlHDependencies) => ({
  mnemonic: 'RL H',
  bytes: 1,
  execute: () => {
    const val = registers.h;
    const oldCarry = (registers.f >> 4) & 1;
    const result = ((val << 1) | oldCarry) & 0xff;
    const carry = (val >> 7) & 1;
    registers.h = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRlH };
