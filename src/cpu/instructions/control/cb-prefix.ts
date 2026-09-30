import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

const createCbPrefix = ({ mmu, registers }: { mmu: MMU; registers: Registers }) => ({
  mnemonic: 'CB prefix',
  bytes: 1,
  execute: () => {
    const subOpcode = mmu.read8((registers.pc + 1) & 0xffff);
    throw new Error(`CB-prefixed opcode 0x${subOpcode.toString(16).padStart(2, '0')} not implemented`);
  },
});

export { createCbPrefix };
