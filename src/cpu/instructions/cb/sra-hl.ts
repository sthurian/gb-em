import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type SraHLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createSraHL = ({ mmu, registers }: SraHLDependencies) => ({
  mnemonic: 'SRA (HL)',
  bytes: 1,
  execute: () => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr);
    const result = ((val >> 1) | (val & 0x80)) & 0xff;
    const carry = val & 1;
    mmu.write8(addr, result);
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createSraHL };
