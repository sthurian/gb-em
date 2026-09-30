const createIllegal0xDD = (_deps: object) => ({
  mnemonic: 'illegal 0xDD',
  bytes: 1,
  execute: () => {
    throw new Error('illegal opcode');
  },
});

export { createIllegal0xDD };
