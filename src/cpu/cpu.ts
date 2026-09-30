import { MMU } from '../mmu.js';
import type { Opcode } from './opcode-table.js';

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

type OpcodeTableFactory = (deps: {
  mmu: MMU;
  registers: Registers;
  setHalted: () => void;
}) => Array<Opcode | undefined>;

type CPUDependencies = {
  mmu: MMU;
  registers: Registers;
  buildOpcodeTable: OpcodeTableFactory;
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

const INTERRUPT_VECTORS: [number, number][] = [
  [0x01, 0x0040], // VBLANK
  [0x02, 0x0048], // LCD_STAT
  [0x04, 0x0050], // TIMER
  [0x08, 0x0058], // SERIAL
  [0x10, 0x0060], // JOYPAD
];

const createCPU = (dependencies: CPUDependencies): CPU => {
  const { mmu, registers } = dependencies;

  const trace: TraceEntry[] = [];
  let traceIndex = 0;
  let halted = false;

  const opcodeTable = dependencies.buildOpcodeTable({
    mmu,
    registers,
    setHalted: () => { halted = true; },
  });

  const serviceInterrupt = (bit: number, vector: number): number => {
    halted = false;
    registers.ime = false;
    const ifl = mmu.read8(0xff0f);
    mmu.write8(0xff0f, ifl & ~bit);
    mmu.write8(registers.sp - 1, (registers.pc >> 8) & 0xff);
    mmu.write8(registers.sp - 2, registers.pc & 0xff);
    registers.sp = (registers.sp - 2) & 0xffff;
    registers.pc = vector;
    return 20;
  };

  return {
    step: () => {
      const ie = mmu.read8(0xffff);
      const ifl = mmu.read8(0xff0f);
      const pending = ie & ifl & 0x1f;

      if (pending !== 0) {
        if (registers.ime) {
          for (const [bit, vector] of INTERRUPT_VECTORS) {
            if (pending & bit) {
              return serviceInterrupt(bit, vector);
            }
          }
        }
        halted = false;
      }

      if (halted) return 4;

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
export type { CPU, CPUState, Registers, OpcodeTableFactory };
