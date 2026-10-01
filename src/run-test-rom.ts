import { readFileSync } from 'node:fs';
import { createEmulator } from './emulator.js';

const romPath = process.argv[2] ?? './roms/cpu_instrs.gb';

let serialOutput = '';
let lastDumpedAt = 0;

const emulator = createEmulator({
  cycleLimit: 400_000_000,
  onCycleLimit: (cycles, em) => {
    const trace = em.getTrace();
    const lastPc = trace.at(-1)?.pc;
    // blargg mem_timing ROMs halt at JR $ after storing result in A to 0xa000.
    // If we detect the halt loop, the test completed — 0xa000=0 means passed.
    // Halted = stuck in JR $ (last 10 trace entries all same PC)
    const last10 = trace.slice(-10);
    const halted = last10.length === 10 && last10.every(e => e.pc === lastPc);
    if (halted) {
      const result = em.read8(0xa000);
      if (result === 0) {
        process.stdout.write('Passed\n');
        process.exit(0);
      } else {
        process.stdout.write(`Failed (${result} subtest(s) failed)\n`);
      }
    } else {
      const ie = em.read8(0xffff);
      const ifl = em.read8(0xff0f);
      process.stderr.write(`\n[TIMEOUT — ${cycles} cycles, last PC: 0x${lastPc?.toString(16)}  IE:0x${ie.toString(16).padStart(2,'0')}  IF:0x${ifl.toString(16).padStart(2,'0')}]\n`);
    }
    const deduped: typeof trace = [];
    for (const entry of trace) {
      if (deduped.length === 0 || deduped[deduped.length - 1]!.pc !== entry.pc) {
        deduped.push(entry);
      }
    }
    for (const entry of deduped.slice(-20)) {
      const flags = `Z:${(entry.registers.f >> 7) & 1} N:${(entry.registers.f >> 6) & 1} H:${(entry.registers.f >> 5) & 1} C:${(entry.registers.f >> 4) & 1}`;
      process.stderr.write(
        `  PC:${entry.pc.toString(16).padStart(4, '0')}  OP:${entry.opcode.toString(16).padStart(2, '0')}  A:${entry.registers.a.toString(16).padStart(2, '0')}  BC:${entry.registers.b.toString(16).padStart(2, '0')}${entry.registers.c.toString(16).padStart(2, '0')}  DE:${entry.registers.d.toString(16).padStart(2, '0')}${entry.registers.e.toString(16).padStart(2, '0')}  HL:${entry.registers.h.toString(16).padStart(2, '0')}${entry.registers.l.toString(16).padStart(2, '0')}  SP:${entry.registers.sp.toString(16).padStart(4, '0')}  IME:${entry.registers.ime ? 1 : 0}  ${flags}\n`
      );
    }
    process.exit(1);
  },
  onSerialByte: (value, em) => {
    const char = String.fromCharCode(value);
    process.stdout.write(char);
    serialOutput += char;

    const failMatch = serialOutput.slice(lastDumpedAt).match(/[^\n]+:02/);
    if (failMatch) {
      lastDumpedAt = serialOutput.length;
      process.stderr.write('\n[TRACE at failure]\n');
      for (const entry of em.getTrace()) {
        const flags = `Z:${(entry.registers.f >> 7) & 1} N:${(entry.registers.f >> 6) & 1} H:${(entry.registers.f >> 5) & 1} C:${(entry.registers.f >> 4) & 1}`;
        process.stderr.write(
          `  PC:${entry.pc.toString(16).padStart(4, '0')}  OP:${entry.opcode.toString(16).padStart(2, '0')}  A:${entry.registers.a.toString(16).padStart(2, '0')}  BC:${entry.registers.b.toString(16).padStart(2, '0')}${entry.registers.c.toString(16).padStart(2, '0')}  DE:${entry.registers.d.toString(16).padStart(2, '0')}${entry.registers.e.toString(16).padStart(2, '0')}  HL:${entry.registers.h.toString(16).padStart(2, '0')}${entry.registers.l.toString(16).padStart(2, '0')}  SP:${entry.registers.sp.toString(16).padStart(4, '0')}  ${flags}\n`
        );
      }
      process.stderr.write('\n');
      process.exit(1);
    }

    if (serialOutput.includes('Passed') || serialOutput.includes('Failed')) {
      em.stop();
    }
  },
});

emulator.load(new Uint8Array(readFileSync(romPath)));
let totalCycles = 0;
const cycleLimit = 400_000_000;
while (totalCycles < cycleLimit) {
  emulator.runFrame();
  totalCycles += 70224;
}
