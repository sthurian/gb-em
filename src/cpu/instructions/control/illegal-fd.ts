const createIllegal0xFD = (_deps: object) => ({
  mnemonic: 'illegal 0xFD',
  bytes: 1,
  execute: () => {
    throw new Error('illegal opcode');
  },
});

export { createIllegal0xFD };
