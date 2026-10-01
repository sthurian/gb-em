import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type RlHLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createRlHL = ({ mmu, registers }: RlHLDependencies) => ({
  mnemonic: 'RL (HL)',
  bytes: 1,
  execute: (tick = () => {}) => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr); tick();
    const oldCarry = (registers.f >> 4) & 1;
    const result = ((val << 1) | oldCarry) & 0xff;
    const carry = (val >> 7) & 1;
    mmu.write8(addr, result); tick();
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createRlHL };
