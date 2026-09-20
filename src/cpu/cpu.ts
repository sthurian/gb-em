import { MMU } from '../mmu.js';
import { Opcode } from './opcode-table.js';

type CPU = {
  step(): number;
  getState(): CPUState;
};

type CPUDependencies = {
  mmu: MMU;
  registers: Registers;
  opcodeTable: Array<Opcode | undefined>;
};

type Registers = {
  a: number;
  f: number;
  b: number;
  c: number;
  d: number;
  e: number;
  h: number;
  l: number;
  sp: number;
  pc: number;
};

type CPUState = {
  registers: Registers;
};

const createCPU = (dependencies: CPUDependencies): CPU => {
  const { mmu, registers, opcodeTable } =
    dependencies;

  return {
    step: () => {
      const opcode = mmu.read8(registers.pc);
      const instruction = opcodeTable[opcode];
      if (!instruction) {
        throw new Error(`Unsupported opcode: 0x${opcode.toString(16).padStart(2, '0')}`);
      }
      return instruction.execute();
    },

    getState: () => {
      return {
        registers: { ...registers },
      };
    },
  };
};

export { createCPU };
export type { CPU, CPUState, Registers };
