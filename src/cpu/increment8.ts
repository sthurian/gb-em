type IncrementResult = {
  value: number;
  zero: boolean;
  halfCarry: boolean;
};

const increment8 = (value: number): IncrementResult => {
  const result = (value + 1) & 0xff;

  return {
    value: result,
    zero: result === 0,
    halfCarry: (result & 0x0f) < (value & 0x0f),
  };
};

export { increment8 };
export type { IncrementResult };
