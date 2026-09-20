type PPU = {
  step(cycles: number): void;
};

const createPPU = (): PPU => {
  return {
    step: () => {},
  };
};

export { createPPU };
export type { PPU };