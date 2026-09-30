const createIllegal0xE4 = (_deps: object) => ({
  mnemonic: 'illegal 0xE4',
  bytes: 1,
  execute: () => {
    throw new Error('illegal opcode');
  },
});

export { createIllegal0xE4 };
