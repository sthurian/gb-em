import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Res7HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createRes7HL = ({ mmu, registers }: Res7HLDependencies) => ({
  mnemonic: 'RES 7,(HL)',
  bytes: 1,
  execute: () => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr);
    mmu.write8(addr, val & ~(1 << 7) & 0xff);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createRes7HL };
