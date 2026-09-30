const createIllegal0xFC = (_deps: object) => ({
  mnemonic: 'illegal 0xFC',
  bytes: 1,
  execute: () => {
    throw new Error('illegal opcode');
  },
});

export { createIllegal0xFC };
