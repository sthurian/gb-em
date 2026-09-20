import type { Registers } from '../../cpu.js';
import { createInc8 } from './create-inc8.js';

type IncCDependencies = {
  registers: Registers;
};

const createIncC = ({ registers }: IncCDependencies) => ({
  mnemonic: 'INC C',
  bytes: 1,

  ...createInc8({
    registers,
    getValue: () => registers.c,
    setValue: (value) => {
      registers.c = value;
    },
  }),
});

export { createIncC };