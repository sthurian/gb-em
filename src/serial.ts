type Serial = {
  read8(address: number): number;
  write8(address: number, value: number): void;
};

type SerialOutput = {
  onByte(value: number): void;
};

type SerialDependencies = {
  output: SerialOutput;
};

const createSerial = ({ output }: SerialDependencies): Serial => {
  let data = 0;

  return {
    read8: () => data,

    write8: (address, value) => {
      if (address === 0xff01) {
        data = value;
      }

      if (address === 0xff02 && value === 0x81) {
        output.onByte(data);
      }
    },
  };
};

export { createSerial };
export type { Serial, SerialOutput };