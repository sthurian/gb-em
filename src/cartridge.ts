type Cartridge = {
  read8(address: number): number;
};

type CartridgeDependencies = {
  data: Uint8Array;
};

const createCartridge = ({ data }: CartridgeDependencies): Cartridge => {
  return {
    read8: (address) => {
      if (!Number.isInteger(address) || address < 0 || address >= data.length) {
        throw new RangeError(`Invalid address: ${address}`);
      }

      return data[address]!;
    },
  };
};

export { createCartridge };
export type { Cartridge };