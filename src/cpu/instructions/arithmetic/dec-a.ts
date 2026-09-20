import type { Registers } from '../../cpu.js';
import { createDec8 } from './create-dec8.js';

type DecADependencies = {
  registers: Registers;
};

const createDecA = ({ registers }: DecADependencies) => ({
  mnemonic: 'DEC A',
  bytes: 1,

  ...createDec8({
    registers,
    getValue: () => registers.a,
    setValue: (value) => {
      registers.a = value;
    },
  }),
});

export { createDecA };