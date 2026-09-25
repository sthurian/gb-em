import { Factory } from 'fishery';
import type { MMU } from '../mmu.js';

type MMUTransientParams = {
  memory?: Uint8Array;
};

const mmuFactory = Factory.define<MMU, MMUTransientParams>(
  ({ transientParams }) => {
    const memory = transientParams.memory ?? new Uint8Array(0x10000);

    return {
      read8: (address) => memory[address]!,
      write8: (address, value) => {
        memory[address] = value;
      },
    };
  },
);

export { mmuFactory };