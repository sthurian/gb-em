import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Bit5HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createBit5HL = ({ mmu, registers }: Bit5HLDependencies) => ({
  mnemonic: 'BIT 5,(HL)',
  bytes: 1,
  execute: (tick = () => {}) => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr); tick();
    registers.f = ((val & (1 << 5)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 12;
  },
});

export { createBit5HL };
