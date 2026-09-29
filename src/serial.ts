type Serial = {
  read8(address: number): number;
  write8(address: number, value: number): void;
};

type SerialDependencies = {
  onByte: (value: number) => void;
};

const createSerial = ({ onByte }: SerialDependencies): Serial => {
  let data = 0;

  return {
    read8: () => data,

    write8: (address, value) => {
      if (address === 0xff01) {
        data = value;
      }

      if (address === 0xff02 && value === 0x81) {
        onByte(data);
      }
    },
  };
};

export { createSerial };
export type { Serial };