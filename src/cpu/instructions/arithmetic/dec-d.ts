import type { Registers } from '../../cpu.js';
import { createDec8 } from './create-dec8.js';

type DecDDependencies = {
  registers: Registers;
};

const createDecD = ({ registers }: DecDDependencies) => ({
  mnemonic: 'DEC D',
  bytes: 1,

  ...createDec8({
    registers,
    getValue: () => registers.d,
    setValue: (value) => {
      registers.d = value;
    },
  }),
});

export { createDecD };