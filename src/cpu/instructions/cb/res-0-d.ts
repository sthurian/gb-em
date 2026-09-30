import type { Registers } from '../../cpu.js';

type Res0DDependencies = {
  registers: Registers;
};

const createRes0D = ({ registers }: Res0DDependencies) => ({
  mnemonic: 'RES 0,D',
  bytes: 1,
  execute: () => {
    registers.d = registers.d & ~(1 << 0) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes0D };
