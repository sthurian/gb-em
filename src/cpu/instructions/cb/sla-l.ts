import type { Registers } from '../../cpu.js';

type SlaLDependencies = {
  registers: Registers;
};

const createSlaL = ({ registers }: SlaLDependencies) => ({
  mnemonic: 'SLA L',
  bytes: 1,
  execute: () => {
    const val = registers.l;
    const result = (val << 1) & 0xff;
    const carry = (val >> 7) & 1;
    registers.l = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSlaL };
