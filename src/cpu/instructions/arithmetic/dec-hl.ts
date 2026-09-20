import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';
import { decrement8 } from '../../decrement8.js';

type DecHLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const FLAG_Z = 0x80;
const FLAG_N = 0x40;
const FLAG_H = 0x20;

const createDecHL = ({ mmu, registers }: DecHLDependencies) => ({
  mnemonic: 'DEC (HL)',
  bytes: 1,

  execute: () => {
    const address = (registers.h << 8) | registers.l;
    const value = mmu.read8(address);
    const result = decrement8(value);

    mmu.write8(address, result.value);

    registers.f = result.zero
      ? registers.f | FLAG_Z
      : registers.f & ~FLAG_Z;

    registers.f |= FLAG_N;

    registers.f = result.halfBorrow
      ? registers.f | FLAG_H
      : registers.f & ~FLAG_H;

    registers.pc = (registers.pc + 1) & 0xffff;

    return 12;
  },
});

export { createDecHL };