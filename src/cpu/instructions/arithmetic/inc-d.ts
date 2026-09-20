import type { Registers } from '../../cpu.js';
import { createInc8 } from './create-inc8.js';

type IncDDependencies = {
  registers: Registers;
};

const createIncD = ({ registers }: IncDDependencies) => ({
  mnemonic: 'INC D',
  bytes: 1,

  ...createInc8({
    registers,
    getValue: () => registers.d,
    setValue: (value) => {
      registers.d = value;
    },
  }),
});

export { createIncD };