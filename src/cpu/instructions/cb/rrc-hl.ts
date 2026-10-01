import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type RrcHLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createRrcHL = ({ mmu, registers }: RrcHLDependencies) => ({
  mnemonic: 'RRC (HL)',
  bytes: 1,
  execute: (tick = () => {}) => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr); tick();
    const result = ((val >> 1) | (val << 7)) & 0xff;
    const carry = val & 1;
    mmu.write8(addr, result); tick();
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createRrcHL };
