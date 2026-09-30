type HaltDependencies = {
  setHalted: () => void;
  registers: { pc: number };
};

const createHalt = ({ setHalted, registers }: HaltDependencies) => {
  return {
    mnemonic: 'HALT',
    bytes: 1,
    execute: () => {
      setHalted();
      registers.pc = (registers.pc + 1) & 0xffff;
      return 4;
    },
  };
};

export { createHalt };
