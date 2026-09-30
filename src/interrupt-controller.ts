type Interrupt =
  | 'VBLANK'
  | 'LCD_STAT'
  | 'TIMER'
  | 'SERIAL'
  | 'JOYPAD';

const INTERRUPT_BIT: Record<Interrupt, number> = {
  VBLANK:   0x01,
  LCD_STAT: 0x02,
  TIMER:    0x04,
  SERIAL:   0x08,
  JOYPAD:   0x10,
};

type InterruptController = {
  read8(address: number): number;
  write8(address: number, value: number): void;
  request(interrupt: Interrupt): void;
};

const createInterruptController = (): InterruptController => {
  let ie = 0x00;
  let ifl = 0x00;

  return {
    read8: (address) => {
      if (address === 0xffff) return ie;
      return ifl | 0xe0;
    },

    write8: (address, value) => {
      if (address === 0xffff) {
        ie = value & 0xff;
      } else {
        ifl = value & 0x1f;
      }
    },

    request: (interrupt) => {
      ifl |= INTERRUPT_BIT[interrupt];
    },
  };
};

export { createInterruptController };
export type { Interrupt, InterruptController };
