type Timer = {
  step(cycles: number): void;
};

const createTimer = (): Timer => {
  return {
    step: () => {},
  };
};

export { createTimer };
export type { Timer };