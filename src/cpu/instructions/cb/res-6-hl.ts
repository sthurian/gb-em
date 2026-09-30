import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Res6HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createRes6HL = ({ mmu, registers }: Res6HLDependencies) => ({
  mnemonic: 'RES 6,(HL)',
  bytes: 1,
  execute: () => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr);
    mmu.write8(addr, val & ~(1 << 6) & 0xff);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createRes6HL };
