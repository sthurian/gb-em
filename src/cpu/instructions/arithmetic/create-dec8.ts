import type { Registers } from '../../cpu.js';
import { decrement8 } from '../../decrement8.js';

type CreateDec8Dependencies = {
  registers: Registers;
  getValue: () => number;
  setValue: (value: number) => void;
};

const FLAG_Z = 0x80;
const FLAG_N = 0x40;
const FLAG_H = 0x20;

const createDec8 = ({
  registers,
  getValue,
  setValue,
}: CreateDec8Dependencies) => ({
  execute: () => {
    const result = decrement8(getValue());

    setValue(result.value);

    registers.f = result.zero
      ? registers.f | FLAG_Z
      : registers.f & ~FLAG_Z;

    registers.f |= FLAG_N;

    registers.f = result.halfBorrow
      ? registers.f | FLAG_H
      : registers.f & ~FLAG_H;

    registers.pc = (registers.pc + 1) & 0xffff;

    return 4;
  },
});

export { createDec8 };