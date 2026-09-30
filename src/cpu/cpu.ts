import { MMU } from '../mmu.js';
import { Opcode } from './opcode-table.js';

type TraceEntry = {
  pc: number;
  opcode: number;
  registers: Registers;
};

type CPU = {
  step(): number;
  getState(): CPUState;
  getTrace(): TraceEntry[];
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
  ime: boolean;
};

type CPUState = {
  registers: Registers;
};

const TRACE_SIZE = 100;

const createCPU = (dependencies: CPUDependencies): CPU => {
  const { mmu, registers, opcodeTable } = dependencies;

  const trace: TraceEntry[] = [];
  let traceIndex = 0;

  return {
    step: () => {
      const pc = registers.pc;
      const opcode = mmu.read8(pc);
      const instruction = opcodeTable[opcode];
      if (!instruction) {
        throw new Error(`Unsupported opcode: 0x${opcode.toString(16).padStart(2, '0')}`);
      }
      trace[traceIndex % TRACE_SIZE] = { pc, opcode, registers: { ...registers } };
      traceIndex++;
      return instruction.execute();
    },

    getState: () => {
      return {
        registers: { ...registers },
      };
    },

    getTrace: () => {
      if (traceIndex < TRACE_SIZE) return trace.slice(0, traceIndex);
      const start = traceIndex % TRACE_SIZE;
      return [...trace.slice(start), ...trace.slice(0, start)];
    },
  };
};

export { createCPU };
export type { CPU, CPUState, Registers };
