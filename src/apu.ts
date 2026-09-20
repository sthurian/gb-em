type APU = {
  step(cycles: number): void;
};

const createAPU = (): APU => {
  return {
    step: () => {},
  };
};

export { createAPU };
export type { APU };