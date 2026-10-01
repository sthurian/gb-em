import type { Registers } from '../../cpu.js';

type RrcLDependencies = {
  registers: Registers;
};

const createRrcL = ({ registers }: RrcLDependencies) => ({
  mnemonic: 'RRC L',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.l;
    const result = ((val >> 1) | (val << 7)) & 0xff;
    const carry = val & 1;
    registers.l = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRrcL };
