import type { InterruptController } from './interrupt-controller.js';

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
  read8(address: number): number;
  write8(address: number, value: number): void;
};

type JoypadDependencies = {
  interruptController: InterruptController;
};

// FF00: P1/JOYP
// Bit 5: select action buttons (0=select)
// Bit 4: select direction buttons (0=select)
// Bits 3-0: button state (0=pressed)
// Action:    Down/Up/Left/Right when bit4=0
// Direction: Start/Select/B/A when bit5=0

const DIRECTION_BITS: Record<string, number> = {
  RIGHT: 0x01, LEFT: 0x02, UP: 0x04, DOWN: 0x08,
};
const ACTION_BITS: Record<string, number> = {
  A: 0x01, B: 0x02, SELECT: 0x04, START: 0x08,
};

const createJoypad = ({ interruptController }: JoypadDependencies): Joypad => {
  let directionState = 0x0f; // all released (bits high)
  let actionState = 0x0f;
  let select = 0x30; // bits 4&5 high = nothing selected

  return {
    press: (button) => {
      if (button in DIRECTION_BITS) {
        directionState &= ~DIRECTION_BITS[button]!;
      } else {
        actionState &= ~ACTION_BITS[button]!;
      }
      interruptController.request('JOYPAD');
    },

    release: (button) => {
      if (button in DIRECTION_BITS) {
        directionState |= DIRECTION_BITS[button]!;
      } else {
        actionState |= ACTION_BITS[button]!;
      }
    },

    read8: (_address) => {
      const dirSelected = !(select & 0x10);
      const actSelected = !(select & 0x20);
      let low = 0x0f;
      if (dirSelected) low &= directionState;
      if (actSelected) low &= actionState;
      return (select & 0x30) | low | 0xc0;
    },

    write8: (_address, value) => {
      select = value & 0x30;
    },
  };
};

export { createJoypad };
export type { Button, Joypad };
