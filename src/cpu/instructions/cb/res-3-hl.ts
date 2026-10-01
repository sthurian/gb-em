import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Res3HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createRes3HL = ({ mmu, registers }: Res3HLDependencies) => ({
  mnemonic: 'RES 3,(HL)',
  bytes: 1,
  execute: (tick = () => {}) => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr); tick();
    mmu.write8(addr, val & ~(1 << 3) & 0xff); tick();
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createRes3HL };
