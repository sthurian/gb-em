import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIllegalOpcode } from './illegal-opcode.js';

const ILLEGAL_OPCODES = [0xd3, 0xdb, 0xdd, 0xe3, 0xe4, 0xeb, 0xec, 0xed, 0xf4, 0xfc, 0xfd];

suite('illegal opcodes', () => {
  for (const opcode of ILLEGAL_OPCODES) {
    test(`0x${opcode.toString(16).toUpperCase()} throws illegal opcode`, () => {
      const op = createIllegalOpcode(opcode);
      assert.throws(() => op.execute(), /illegal opcode/);
    });

    test(`0x${opcode.toString(16).toUpperCase()} has correct mnemonic`, () => {
      const op = createIllegalOpcode(opcode);
      assert.strictEqual(op.mnemonic, `illegal 0x${opcode.toString(16).toUpperCase()}`);
    });
  }
});
