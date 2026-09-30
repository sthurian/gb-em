const createIllegal0xF4 = (_deps: object) => ({
  mnemonic: 'illegal 0xF4',
  bytes: 1,
  execute: () => {
    throw new Error('illegal opcode');
  },
});

export { createIllegal0xF4 };
