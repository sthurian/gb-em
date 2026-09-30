import type { Registers } from '../../cpu.js';

type Res3LDependencies = {
  registers: Registers;
};

const createRes3L = ({ registers }: Res3LDependencies) => ({
  mnemonic: 'RES 3,L',
  bytes: 1,
  execute: () => {
    registers.l = registers.l & ~(1 << 3) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes3L };
