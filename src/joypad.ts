type Button =
  | 'A'
  | 'B'
  | 'SELECT'
  | 'START'
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT';

type Joypad = {
  press(button: Button): void;
  release(button: Button): void;
};

const createJoypad = (): Joypad => {
  return {
    press: () => {},
    release: () => {},
  };
};

export { createJoypad };
export type { Button, Joypad };