import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

const createLdHHLIndirect = ({ mmu, registers }: { mmu: MMU; registers: Registers }) => ({
  mnemonic: 'LD H,(HL)', bytes: 1,
  execute: (tick = () => {}) => {
    registers.h = mmu.read8((registers.h << 8) | registers.l); tick();
    registers.pc = (registers.pc + 1) & 0xffff;
    return 8;
  },
});

export { createLdHHLIndirect };
