const createIllegal0xD3 = (_deps: object) => ({
  mnemonic: 'illegal 0xD3',
  bytes: 1,
  execute: () => {
    throw new Error('illegal opcode');
  },
});

export { createIllegal0xD3 };
