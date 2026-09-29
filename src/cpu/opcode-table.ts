import { MMU } from '../mmu.js';
import type { Registers } from './cpu.js';
import { createIncB } from './instructions/arithmetic/inc-b.js';
import { createIncC } from './instructions/arithmetic/inc-c.js';
import { createIncD } from './instructions/arithmetic/inc-d.js';
import { createIncE } from './instructions/arithmetic/inc-e.js';
import { createIncH } from './instructions/arithmetic/inc-h.js';
import { createIncL } from './instructions/arithmetic/inc-l.js';
import { createIncA } from './instructions/arithmetic/inc-a.js';
import { createIncHLIndirect } from './instructions/arithmetic/inc-hl-indirect.js';
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
import { createLdHLD8 } from './instructions/load/ld-hl-d8.js';
import { createLdED8 } from './instructions/load/ld-e-d8.js';
import { createRet } from './instructions/control/ret.js';
import { createJp } from './instructions/control/jp.js';
import { createDi } from './instructions/control/di.js';
import { createLdSpD16 } from './instructions/load/ld-sp-d16.js';
import { createLdA16A } from './instructions/load/ld-a16-a.js';
import { createLdAD8 } from './instructions/load/ld-a-d8.js';
import { createLdhA8A } from './instructions/load/ldh-a8-a.js';
import { createLdHlD16 } from './instructions/load/ld-hl-d16.js';
import { createCall } from './instructions/control/call.js';
import { createLdAL } from './instructions/load/ld-a-l.js';
import { createLdAH } from './instructions/load/ld-a-h.js';
import { createJr } from './instructions/control/jr.js';
import { createPushHL } from './instructions/control/push-hl.js';
import { createPopHL } from './instructions/control/pop-hl.js';
import { createPushAF } from './instructions/control/push-af.js';
import { createIncHL } from './instructions/arithmetic/inc-hl.js';
import { createLdAHlInc } from './instructions/load/ld-a-hl-inc.js';

type Opcode = {
  mnemonic: string;
  bytes: number;
  execute: () => number;
};

type OpcodeTableDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createOpcodeTable = ({
  mmu,
  registers,
}: OpcodeTableDependencies): Array<Opcode | undefined> => {

  const opcodes: Array<Opcode | undefined> = [];

  opcodes[0x00] = createNop({ registers });
  opcodes[0x06] = createLdBD8({ mmu, registers });
  opcodes[0x0e] = createLdCD8({ mmu, registers });
  opcodes[0x16] = createLdDD8({ mmu, registers });
  opcodes[0x21] = createLdHlD16({ mmu, registers });
  opcodes[0x23] = createIncHL({ registers });
  opcodes[0x31] = createLdSpD16({ mmu, registers });
  opcodes[0x36] = createLdHLD8({ mmu, registers });
  opcodes[0x3e] = createLdAD8({ mmu, registers });
  opcodes[0xe0] = createLdhA8A({ mmu, registers });
  opcodes[0xea] = createLdA16A({ mmu, registers });
  opcodes[0x1e] = createLdED8({ mmu, registers });

  opcodes[0x3d] = createDecA({ registers });
  opcodes[0x04] = createIncB({ registers });
  opcodes[0x0c] = createIncC({ registers });
  opcodes[0x14] = createIncD({ registers });
  opcodes[0x18] = createJr({ mmu, registers });
  opcodes[0x1c] = createIncE({ registers });
  opcodes[0x24] = createIncH({ registers });
  opcodes[0x2a] = createLdAHlInc({ mmu, registers });
  opcodes[0x2c] = createIncL({ registers });
  opcodes[0x34] = createIncHLIndirect({ mmu, registers });
  opcodes[0x3c] = createIncA({ registers });

  opcodes[0x05] = createDecB({ registers });
  opcodes[0x0d] = createDecC({ registers });
  opcodes[0x15] = createDecD({ registers });
  opcodes[0x1d] = createDecE({ registers });
  opcodes[0x25] = createDecH({ registers });
  opcodes[0x2d] = createDecL({ registers });
  opcodes[0x35] = createDecHL({ mmu, registers });
  opcodes[0x7c] = createLdAH({ registers });
  opcodes[0x7d] = createLdAL({ registers });
  opcodes[0xc3] = createJp({ mmu, registers });
  opcodes[0xc9] = createRet({ mmu, registers });
  opcodes[0xcd] = createCall({ mmu, registers });
  opcodes[0xe1] = createPopHL({ mmu, registers });
  opcodes[0xe5] = createPushHL({ mmu, registers });
  opcodes[0xf3] = createDi({ registers });
  opcodes[0xf5] = createPushAF({ mmu, registers });
  return opcodes;
};

export { createOpcodeTable };
export type { Opcode };
