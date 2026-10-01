import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

const createLdDHLIndirect = ({ mmu, registers }: { mmu: MMU; registers: Registers }) => ({
  mnemonic: 'LD D,(HL)', bytes: 1,
  execute: (tick = () => {}) => {
    registers.d = mmu.read8((registers.h << 8) | registers.l); tick();
    registers.pc = (registers.pc + 1) & 0xffff;
    return 8;
  },
});

export { createLdDHLIndirect };
