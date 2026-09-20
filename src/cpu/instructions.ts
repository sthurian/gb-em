import { MMU } from '../mmu.js';
import type { Registers } from './cpu.js';
import { createIncB } from './instructions/arithmetic/inc-b.js';
import { createIncC } from './instructions/arithmetic/inc-c.js';
import { createIncD } from './instructions/arithmetic/inc-d.js';
import { createIncE } from './instructions/arithmetic/inc-e.js';
import { createIncH } from './instructions/arithmetic/inc-h.js';
import { createIncL } from './instructions/arithmetic/inc-l.js';
import { createIncA } from './instructions/arithmetic/inc-a.js';
import { createIncHL } from './instructions/arithmetic/inc-hl.js';
import { createNop } from './instructions/control/nop.js';
import { createLdBD8 } from './instructions/load/ld-b-d8.js';
import { createDecB } from './instructions/arithmetic/dec-b.js';
import { createDecC } from './instructions/arithmetic/dec-c.js';
import { createDecD } from './instructions/arithmetic/dec-d.js';
import { createDecE } from './instructions/arithmetic/dec-e.js';
import { createDecH } from './instructions/arithmetic/dec-h.js';
import { createDecL } from './instructions/arithmetic/dec-l.js';
import { createDecA } from './instructions/arithmetic/dec-a.js';
import { createDecHL } from './instructions/arithmetic/dec-hl.js';
import { createLdCD8 } from './instructions/load/ld-c-d8.js';
import { createLdDD8 } from './instructions/load/ld-d-d8.js';

type Instruction = {
  mnemonic: string;
  bytes: number;
  execute: () => number;
};

type InstructionDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createInstructions = ({
  mmu,
  registers,
}: InstructionDependencies): Array<Instruction | undefined> => {

  const instructions: Array<Instruction | undefined> = [];

  instructions[0x00] = createNop({ registers });
  instructions[0x06] = createLdBD8({ mmu, registers });
  instructions[0x0e] = createLdCD8({ mmu, registers });
  instructions[0x16] = createLdDD8({ mmu, registers });
  instructions[0x04] = createIncB({ registers });
  instructions[0x0c] = createIncC({ registers });
  instructions[0x14] = createIncD({ registers });
  instructions[0x1c] = createIncE({ registers });
  instructions[0x24] = createIncH({ registers });
  instructions[0x2c] = createIncL({ registers });
  instructions[0x34] = createIncHL({ mmu, registers });
  instructions[0x3c] = createIncA({ registers });

  instructions[0x05] = createDecB({registers});
  instructions[0x0d] = createDecC({registers});
  instructions[0x15] = createDecD({registers});
  instructions[0x1d] = createDecE({registers});
  instructions[0x25] = createDecH({registers});
  instructions[0x2d] = createDecL({registers});
  instructions[0x35] = createDecHL({mmu, registers})
  instructions[0x3d] = createDecA({registers});

  return instructions;
};

export { createInstructions };
export type { Instruction };
