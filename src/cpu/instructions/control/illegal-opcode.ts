const createIllegalOpcode = (opcode: number) => ({
  mnemonic: `illegal 0x${opcode.toString(16).toUpperCase()}`,
  bytes: 1,
  execute: (): never => {
    throw new Error('illegal opcode');
  },
});

export { createIllegalOpcode };
