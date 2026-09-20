import type { Registers } from '../../cpu.js';
import { createDec8 } from './create-dec8.js';

type DecEDependencies = {
  registers: Registers;
};

const createDecE = ({ registers }: DecEDependencies) => ({
  mnemonic: 'DEC E',
  bytes: 1,

  ...createDec8({
    registers,
    getValue: () => registers.e,
    setValue: (value) => {
      registers.e = value;
    },
  }),
});

export { createDecE };