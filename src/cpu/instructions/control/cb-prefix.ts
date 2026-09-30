import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';
import { createCbOpcodeTable } from '../../cb-opcode-table.js';

const createCbPrefix = ({ mmu, registers }: { mmu: MMU; registers: Registers }) => {
  const cbOpcodeTable = createCbOpcodeTable({ mmu, registers });

  return {
    mnemonic: 'CB prefix',
    bytes: 2,
    execute: () => {
      const subOpcode = mmu.read8((registers.pc + 1) & 0xffff);
      const instruction = cbOpcodeTable[subOpcode];
      if (!instruction) {
        throw new Error(`CB-prefixed opcode 0x${subOpcode.toString(16).padStart(2, '0')} not implemented`);
      }
      registers.pc = (registers.pc + 1) & 0xffff;
      return instruction.execute();
    },
  };
};

export { createCbPrefix };
