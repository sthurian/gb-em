import { createEmulator } from './emulator.js';

const romPath = process.argv[2];
if (!romPath) {
  process.stderr.write('Usage: node index.js <rom>\n');
  process.exit(1);
}

const emulator = createEmulator({
  onSerialByte: (value) => process.stdout.write(String.fromCharCode(value)),
});

emulator.start(romPath);
