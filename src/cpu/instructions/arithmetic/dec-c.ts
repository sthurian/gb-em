import type { Registers } from '../../cpu.js';
import { createDec8 } from './create-dec8.js';

type DecCDependencies = {
  registers: Registers;
};

const createDecC = ({ registers }: DecCDependencies) => ({
  mnemonic: 'DEC C',
  bytes: 1,

  ...createDec8({
    registers,
    getValue: () => registers.c,
    setValue: (value) => {
      registers.c = value;
    },
  }),
});

export { createDecC };