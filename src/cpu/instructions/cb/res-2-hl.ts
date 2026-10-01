import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Res2HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createRes2HL = ({ mmu, registers }: Res2HLDependencies) => ({
  mnemonic: 'RES 2,(HL)',
  bytes: 1,
  execute: (tick = () => {}) => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr); tick();
    mmu.write8(addr, val & ~(1 << 2) & 0xff); tick();
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createRes2HL };
