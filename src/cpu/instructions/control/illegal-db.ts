const createIllegal0xDB = (_deps: object) => ({
  mnemonic: 'illegal 0xDB',
  bytes: 1,
  execute: () => {
    throw new Error('illegal opcode');
  },
});

export { createIllegal0xDB };
