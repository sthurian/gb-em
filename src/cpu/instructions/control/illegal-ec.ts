const createIllegal0xEC = (_deps: object) => ({
  mnemonic: 'illegal 0xEC',
  bytes: 1,
  execute: () => {
    throw new Error('illegal opcode');
  },
});

export { createIllegal0xEC };
