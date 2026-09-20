import type { Registers } from '../../cpu.js';
import { createInc8 } from './create-inc8.js';

type IncADependencies = {
  registers: Registers;
};

const createIncA = ({ registers }: IncADependencies) => ({
  mnemonic: 'INC A',
  bytes: 1,

  ...createInc8({
    registers,
    getValue: () => registers.a,
    setValue: (value) => {
      registers.a = value;
    },
  }),
});

export { createIncA };