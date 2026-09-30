import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Res0HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createRes0HL = ({ mmu, registers }: Res0HLDependencies) => ({
  mnemonic: 'RES 0,(HL)',
  bytes: 1,
  execute: () => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr);
    mmu.write8(addr, val & ~(1 << 0) & 0xff);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createRes0HL };
