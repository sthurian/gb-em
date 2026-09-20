type MMU = {
  read8(address: number): number;
  write8(address: number, value: number): void;
};

type Memory = Uint8Array;

const assertAddress = (address: number): void => {
  if (!Number.isInteger(address) || address < 0 || address > 0xffff) {
    throw new RangeError(`Invalid address: ${address}`);
  }
};

const assertByte = (value: number): void => {
  if (!Number.isInteger(value) || value < 0 || value > 0xff) {
    throw new RangeError(`Invalid byte: ${value}`);
  }
};

const createMMU = (): MMU => {
  const memory: Memory = new Uint8Array(0x10000);
  return {
    read8: (address: number) => {
      assertAddress(address);
      return memory[address]!;
    },
    write8: (address, value) => {
      assertAddress(address);
      assertByte(value);
      memory[address] = value;
    },
  };
};

export { createMMU };
export type { MMU };
