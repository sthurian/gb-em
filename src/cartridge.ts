type Cartridge = {
  read8(address: number): number;
  write8(address: number, value: number): void;
};

type CartridgeDependencies = {
  data: Uint8Array;
};

const createCartridge = ({ data }: CartridgeDependencies): Cartridge => {
  const mbcType = data[0x147] ?? 0x00;
  const isMbc1 = mbcType === 0x01 || mbcType === 0x02 || mbcType === 0x03;

  let romBank = 1;

  return {
    read8: (address) => {
      if (!Number.isInteger(address) || address < 0 || address >= data.length) {
        throw new RangeError(`Invalid address: ${address}`);
      }

      if (isMbc1 && address >= 0x4000 && address <= 0x7fff) {
        const bankOffset = romBank * 0x4000;
        return data[bankOffset + (address - 0x4000)] ?? 0xff;
      }

      return data[address]!;
    },

    write8: (address, value) => {
      if (!isMbc1) return;

      if (address >= 0x2000 && address <= 0x3fff) {
        const bank = value & 0x1f;
        romBank = bank === 0 ? 1 : bank;
      }
    },
  };
};

export { createCartridge };
export type { Cartridge };
