import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Res1HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createRes1HL = ({ mmu, registers }: Res1HLDependencies) => ({
  mnemonic: 'RES 1,(HL)',
  bytes: 1,
  execute: (tick = () => {}) => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr); tick();
    mmu.write8(addr, val & ~(1 << 1) & 0xff); tick();
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createRes1HL };
