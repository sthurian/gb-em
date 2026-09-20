import type { Registers } from '../../cpu.js';
import { createDec8 } from './create-dec8.js';

type DecBDependencies = {
  registers: Registers;
};

const createDecB = ({ registers }: DecBDependencies) => ({
  mnemonic: 'DEC B',
  bytes: 1,

  ...createDec8({
    registers,
    getValue: () => registers.b,
    setValue: (value) => {
      registers.b = value;
    },
  }),
});

export { createDecB };