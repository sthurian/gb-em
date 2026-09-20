import type { Registers } from '../../cpu.js';
import { createInc8 } from './create-inc8.js';

type IncHDependencies = {
  registers: Registers;
};

const createIncH = ({ registers }: IncHDependencies) => ({
  mnemonic: 'INC H',
  bytes: 1,

  ...createInc8({
    registers,
    getValue: () => registers.h,
    setValue: (value) => {
      registers.h = value;
    },
  }),
});

export { createIncH };