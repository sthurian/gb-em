import type { Registers } from '../../cpu.js';
import { createDec8 } from './create-dec8.js';

type DecLDependencies = {
  registers: Registers;
};

const createDecL = ({ registers }: DecLDependencies) => ({
  mnemonic: 'DEC L',
  bytes: 1,

  ...createDec8({
    registers,
    getValue: () => registers.l,
    setValue: (value) => {
      registers.l = value;
    },
  }),
});

export { createDecL };