type Interrupt =
  | 'VBLANK'
  | 'LCD_STAT'
  | 'TIMER'
  | 'SERIAL'
  | 'JOYPAD';

type InterruptController = {
  request(interrupt: Interrupt): void;
};

const createInterruptController = (): InterruptController => {
  return {
    request: () => {},
  };
};

export { createInterruptController };
export type { Interrupt, InterruptController };