import type { Registers } from '../../cpu.js';

type RrcDDependencies = {
  registers: Registers;
};

const createRrcD = ({ registers }: RrcDDependencies) => ({
  mnemonic: 'RRC D',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.d;
    const result = ((val >> 1) | (val << 7)) & 0xff;
    const carry = val & 1;
    registers.d = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRrcD };
