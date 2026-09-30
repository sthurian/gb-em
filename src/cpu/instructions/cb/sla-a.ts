import type { Registers } from '../../cpu.js';

type SlaADependencies = {
  registers: Registers;
};

const createSlaA = ({ registers }: SlaADependencies) => ({
  mnemonic: 'SLA A',
  bytes: 1,
  execute: () => {
    const val = registers.a;
    const result = (val << 1) & 0xff;
    const carry = (val >> 7) & 1;
    registers.a = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSlaA };
