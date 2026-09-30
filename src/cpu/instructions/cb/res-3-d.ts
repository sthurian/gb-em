import type { Registers } from '../../cpu.js';

type Res3DDependencies = {
  registers: Registers;
};

const createRes3D = ({ registers }: Res3DDependencies) => ({
  mnemonic: 'RES 3,D',
  bytes: 1,
  execute: () => {
    registers.d = registers.d & ~(1 << 3) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes3D };
