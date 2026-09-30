import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

const createLdEHLIndirect = ({ mmu, registers }: { mmu: MMU; registers: Registers }) => ({
  mnemonic: 'LD E,(HL)', bytes: 1,
  execute: () => {
    registers.e = mmu.read8((registers.h << 8) | registers.l);
    registers.pc = (registers.pc + 1) & 0xffff;
    return 8;
  },
});

export { createLdEHLIndirect };
