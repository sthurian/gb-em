import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdHLD8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdHLD8 = ({
  mmu,
  registers,
}: LdHLD8Dependencies) => ({
  mnemonic: 'LD (HL),d8',
  bytes: 2,
  execute: () => {
    const value = mmu.read8((registers.pc + 1) & 0xffff);
    const address = (registers.h << 8) | registers.l;

    mmu.write8(address, value);

    registers.pc = (registers.pc + 2) & 0xffff;

    return 12;
  },
});

export { createLdHLD8 };