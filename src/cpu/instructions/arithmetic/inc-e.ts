import type { Registers } from '../../cpu.js';
import { createInc8 } from './create-inc8.js';

type IncEDependencies = {
  registers: Registers;
};

const createIncE = ({ registers }: IncEDependencies) => ({
  mnemonic: 'INC E',
  bytes: 1,

  ...createInc8({
    registers,
    getValue: () => registers.e,
    setValue: (value) => {
      registers.e = value;
    },
  }),
});

export { createIncE };