import { MMU } from '../mmu.js';
import { createInstructions } from './instructions.js';

type CPU = {
  step(): number;
  getState(): CPUState;
};

type CPUDependencies = {
  mmu: MMU;
  registers?: Registers;
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
  const { mmu, registers = { a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0 } } =
    dependencies;

  const instructions = createInstructions({
    mmu,
    registers,
  });

  return {
    step: () => {
      const opcode = mmu.read8(registers.pc);
      const instruction = instructions[opcode];
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
