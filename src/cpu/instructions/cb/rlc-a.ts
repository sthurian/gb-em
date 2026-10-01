import type { Registers } from '../../cpu.js';

type RlcADependencies = {
  registers: Registers;
};

const createRlcA = ({ registers }: RlcADependencies) => ({
  mnemonic: 'RLC A',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.a;
    const result = ((val << 1) | (val >> 7)) & 0xff;
    const carry = (val >> 7) & 1;

    registers.a = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRlcA };
