import type { Registers } from '../../cpu.js';
import { createDec8 } from './create-dec8.js';

type DecHDependencies = {
  registers: Registers;
};

const createDecH = ({ registers }: DecHDependencies) => ({
  mnemonic: 'DEC H',
  bytes: 1,

  ...createDec8({
    registers,
    getValue: () => registers.h,
    setValue: (value) => {
      registers.h = value;
    },
  }),
});

export { createDecH };