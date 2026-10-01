import type { Registers } from '../../cpu.js';

type SlaEDependencies = {
  registers: Registers;
};

const createSlaE = ({ registers }: SlaEDependencies) => ({
  mnemonic: 'SLA E',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.e;
    const result = (val << 1) & 0xff;
    const carry = (val >> 7) & 1;
    registers.e = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSlaE };
