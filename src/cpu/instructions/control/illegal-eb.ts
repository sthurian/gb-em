const createIllegal0xEB = (_deps: object) => ({
  mnemonic: 'illegal 0xEB',
  bytes: 1,
  execute: () => {
    throw new Error('illegal opcode');
  },
});

export { createIllegal0xEB };
