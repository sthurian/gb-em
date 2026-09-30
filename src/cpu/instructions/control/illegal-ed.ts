const createIllegal0xED = (_deps: object) => ({
  mnemonic: 'illegal 0xED',
  bytes: 1,
  execute: () => {
    throw new Error('illegal opcode');
  },
});

export { createIllegal0xED };
