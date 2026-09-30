const createIllegal0xE3 = (_deps: object) => ({
  mnemonic: 'illegal 0xE3',
  bytes: 1,
  execute: () => {
    throw new Error('illegal opcode');
  },
});

export { createIllegal0xE3 };
