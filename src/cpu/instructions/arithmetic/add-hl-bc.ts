import type { Registers } from '../../cpu.js';

type AddHLBCDependencies = {
  registers: Registers;
};

const createAddHLBC = ({ registers }: AddHLBCDependencies) => {
  return {
    mnemonic: 'ADD HL,BC',
    bytes: 1,
    execute: (tick = () => {}) => {
      const hl = (registers.h << 8) | registers.l;
      const rr = (registers.b << 8) | registers.c;
      const result = hl + rr;

      const halfCarry = ((hl & 0x0fff) + (rr & 0x0fff)) > 0x0fff;
      const carry = result > 0xffff;

      const newHl = result & 0xffff;
      registers.h = newHl >> 8;
      registers.l = newHl & 0xff;

      registers.f = (registers.f & 0x80) | (halfCarry ? 0x20 : 0) | (carry ? 0x10 : 0);

      tick(); // internal M-cycle
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createAddHLBC };
