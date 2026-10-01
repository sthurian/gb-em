import type { MMU } from '../mmu.js';
import type { Opcode } from './opcode-table.js';

type TraceEntry = {
  pc: number;
  opcode: number;
  registers: Registers;
};

type CPU = {
  step(tick?: () => void): number;
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
  imeScheduled: boolean;
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

  const noop = () => {};

  const serviceInterrupt = (tick: () => void): number => {
    halted = false;
    registers.ime = false;
    tick(); tick(); // M1, M2 internal cycles
    // M3: push PC high byte (SP decrements before write)
    registers.sp = (registers.sp - 1) & 0xffff;
    mmu.write8(registers.sp, (registers.pc >> 8) & 0xff);
    tick();
    // M4: push PC low byte
    registers.sp = (registers.sp - 1) & 0xffff;
    mmu.write8(registers.sp, registers.pc & 0xff);
    tick();
    // M5: latch vector from IE & IF at this moment (timer/STAT may have fired during pushes)
    const ie5 = mmu.read8(0xffff);
    const ifl5 = mmu.read8(0xff0f);
    const pending5 = ie5 & ifl5 & 0x1f;
    let vector = 0x0000; // spurious interrupt if no longer pending
    let bit = 0;
    for (const [b, v] of INTERRUPT_VECTORS) {
      if (pending5 & b) { bit = b; vector = v; break; }
    }
    if (bit !== 0) mmu.write8(0xff0f, ifl5 & ~bit);
    registers.pc = vector;
    tick();
    return 20;
  };

  return {
    step: (tick: () => void = noop) => {
      const ie = mmu.read8(0xffff);
      const ifl = mmu.read8(0xff0f);
      const pending = ie & ifl & 0x1f;

      if (pending !== 0) {
        if (registers.ime) {
          return serviceInterrupt(tick);
        }
        halted = false;
      }

      if (halted) { tick(); return 4; }

      const pc = registers.pc;
      const opcode = mmu.read8(pc);
      tick(); // opcode fetch M-cycle
      const instruction = opcodeTable[opcode];
      if (!instruction) {
        throw new Error(`Unsupported opcode: 0x${opcode.toString(16).padStart(2, '0')}`);
      }
      trace[traceIndex % TRACE_SIZE] = { pc, opcode, registers: { ...registers } };
      traceIndex++;
      const cycles = instruction.execute(tick);
      if (registers.imeScheduled) {
        registers.imeScheduled = false;
        registers.ime = true;
      }
      return cycles;
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
export type { CPU, CPUState, Registers, OpcodeTableFactory, TraceEntry };
