import type { Registers } from '../../cpu.js';
import { createInc8 } from './create-inc8.js';

type IncBDependencies = {
  registers: Registers;
};

const createIncB = ({ registers }: IncBDependencies) => ({
  mnemonic: 'INC B',
  bytes: 1,

  ...createInc8({
    registers,
    getValue: () => registers.b,
    setValue: (value) => {
      registers.b = value;
    },
  }),
});

export { createIncB };