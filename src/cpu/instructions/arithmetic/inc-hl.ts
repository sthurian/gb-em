import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';
import { increment8 } from '../../increment8.js';

type IncHLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const FLAG_Z = 0x80;
const FLAG_N = 0x40;
const FLAG_H = 0x20;

const createIncHL = ({ mmu, registers }: IncHLDependencies) => ({
  mnemonic: 'INC (HL)',
  bytes: 1,

  execute: () => {
    const address = (registers.h << 8) | registers.l;
    const value = mmu.read8(address);
    const result = increment8(value);

    mmu.write8(address, result.value);

    registers.f = result.zero
      ? registers.f | FLAG_Z
      : registers.f & ~FLAG_Z;

    registers.f &= ~FLAG_N;

    registers.f = result.halfCarry
      ? registers.f | FLAG_H
      : registers.f & ~FLAG_H;

    registers.pc = (registers.pc + 1) & 0xffff;

    return 12;
  },
});

export { createIncHL };