type DecrementResult = {
  value: number;
  zero: boolean;
  halfBorrow: boolean;
};

const decrement8 = (value: number): DecrementResult => {
  const result = (value - 1) & 0xff;

  return {
    value: result,
    zero: result === 0,
    halfBorrow: (result & 0x0f) > (value & 0x0f),
  };
};

export { decrement8 };
export type { DecrementResult };
