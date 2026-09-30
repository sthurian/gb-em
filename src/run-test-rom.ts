import { createEmulator } from './emulator.js';

const romPath = process.argv[2] ?? './roms/cpu_instrs.gb';

let serialOutput = '';
let lastDumpedAt = 0;

const emulator = createEmulator({
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

emulator.start(romPath);
