import type { Registers } from '../../cpu.js';
import { createInc8 } from './create-inc8.js';

type IncLDependencies = {
  registers: Registers;
};

const createIncL = ({ registers }: IncLDependencies) => ({
  mnemonic: 'INC L',
  bytes: 1,

  ...createInc8({
    registers,
    getValue: () => registers.l,
    setValue: (value) => {
      registers.l = value;
    },
  }),
});

export { createIncL };