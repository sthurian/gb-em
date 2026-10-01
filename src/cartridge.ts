type Cartridge = {
  read8(address: number): number;
  write8(address: number, value: number): void;
  hasExternalRam: boolean;
};

type CartridgeDependencies = {
  data: Uint8Array;
};

// Header offsets
const HDR_TYPE    = 0x147;
const HDR_ROM_SZ  = 0x148;
const HDR_RAM_SZ  = 0x149;

const RAM_SIZES = [0, 0x800, 0x2000, 0x8000, 0x20000, 0x10000];

const createCartridge = ({ data }: CartridgeDependencies): Cartridge => {
  const mbcType = data[HDR_TYPE] ?? 0x00;
  const romSizeCode = data[HDR_ROM_SZ] ?? 0x00;
  const ramSizeCode = data[HDR_RAM_SZ] ?? 0x00;

  const numRomBanks = 2 << romSizeCode;
  const ramSize = RAM_SIZES[ramSizeCode] ?? 0;
  const ram = new Uint8Array(ramSize);

  // MBC type groups
  const isMbc1 = mbcType >= 0x01 && mbcType <= 0x03;
  const isMbc3 = mbcType >= 0x0f && mbcType <= 0x13;
  const isMbc5 = mbcType >= 0x19 && mbcType <= 0x1e;
  const hasMbc = isMbc1 || isMbc3 || isMbc5;

  // Shared state
  let romBankLo = 1;
  let romBankHi = 0; // MBC1: bits 5-6 of ROM bank or RAM bank; MBC5: bit 8 of ROM bank
  let ramBank = 0;
  let ramEnabled = false;
  let mbc1Mode = 0; // 0=ROM banking, 1=RAM banking

  function romBank0(): number {
    // MBC1 mode 1: upper bits select 0x00/0x20/0x40/0x60
    if (isMbc1 && mbc1Mode === 1) return (romBankHi << 5) & (numRomBanks - 1);
    return 0;
  }

  function romBank1(): number {
    if (isMbc1) {
      const bank = ((romBankHi << 5) | romBankLo) & (numRomBanks - 1);
      return bank === 0 ? 1 : bank;
    }
    if (isMbc3) return romBankLo & (numRomBanks - 1) || 1;
    if (isMbc5) return ((romBankHi << 8) | romBankLo) & (numRomBanks - 1);
    return romBankLo;
  }

  function activeRamBank(): number {
    if (isMbc1) return mbc1Mode === 1 ? romBankHi : 0;
    return ramBank;
  }

  return {
    hasExternalRam: ram.length > 0,

    read8: (address) => {
      if (address >= 0 && address <= 0x3fff) {
        return data[romBank0() * 0x4000 + address] ?? 0xff;
      }
      if (address >= 0x4000 && address <= 0x7fff) {
        return data[romBank1() * 0x4000 + (address - 0x4000)] ?? 0xff;
      }
      if (address >= 0xa000 && address <= 0xbfff) {
        if (!ramEnabled || ram.length === 0) return 0xff;
        const offset = activeRamBank() * 0x2000 + (address - 0xa000);
        return ram[offset] ?? 0xff;
      }
      throw new RangeError(`Invalid cartridge address: ${address}`);
    },

    write8: (address, value) => {
      if (!hasMbc) return;

      // RAM enable: 0x0000-0x1fff, value 0x0A enables
      if (address <= 0x1fff) {
        ramEnabled = (value & 0x0f) === 0x0a;
        return;
      }

      if (isMbc1) {
        if (address >= 0x2000 && address <= 0x3fff) {
          romBankLo = value & 0x1f || 1;
        } else if (address >= 0x4000 && address <= 0x5fff) {
          romBankHi = value & 0x03;
        } else if (address >= 0x6000 && address <= 0x7fff) {
          mbc1Mode = value & 0x01;
        } else if (address >= 0xa000 && address <= 0xbfff) {
          if (!ramEnabled || ram.length === 0) return;
          const offset = activeRamBank() * 0x2000 + (address - 0xa000);
          ram[offset] = value;
        }
        return;
      }

      if (isMbc3) {
        if (address >= 0x2000 && address <= 0x3fff) {
          romBankLo = value & 0x7f || 1;
        } else if (address >= 0x4000 && address <= 0x5fff) {
          ramBank = value & 0x03;
        } else if (address >= 0xa000 && address <= 0xbfff) {
          if (!ramEnabled || ram.length === 0) return;
          const offset = ramBank * 0x2000 + (address - 0xa000);
          ram[offset] = value;
        }
        return;
      }

      if (isMbc5) {
        if (address >= 0x2000 && address <= 0x2fff) {
          romBankLo = value & 0xff;
        } else if (address >= 0x3000 && address <= 0x3fff) {
          romBankHi = value & 0x01;
        } else if (address >= 0x4000 && address <= 0x5fff) {
          ramBank = value & 0x0f;
        } else if (address >= 0xa000 && address <= 0xbfff) {
          if (!ramEnabled || ram.length === 0) return;
          const offset = ramBank * 0x2000 + (address - 0xa000);
          ram[offset] = value;
        }
        return;
      }
    },
  };
};

export { createCartridge };
export type { Cartridge };
