import { createEmulator } from '../../src/emulator.js';
import type { Button } from '../../src/joypad.js';

const canvas = document.getElementById('screen') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const romInput = document.getElementById('rom-input') as HTMLInputElement;

let rafId: number | null = null;

const emulator = createEmulator({
  onFrame: (pixels) => {
    ctx.putImageData(new ImageData(new Uint8ClampedArray(pixels), 160, 144), 0, 0);
  },
});

function startLoop() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  function frame() {
    emulator.runFrame();
    rafId = requestAnimationFrame(frame);
  }
  rafId = requestAnimationFrame(frame);
}

romInput.addEventListener('change', async () => {
  const file = romInput.files?.[0];
  if (!file) return;
  const buffer = await file.arrayBuffer();
  emulator.load(new Uint8Array(buffer));
  startLoop();
});

const KEY_MAP: Record<string, Button> = {
  ArrowRight: 'RIGHT',
  ArrowLeft: 'LEFT',
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  z: 'A',
  Z: 'A',
  x: 'B',
  X: 'B',
  Enter: 'START',
  Backspace: 'SELECT',
};

window.addEventListener('keydown', (e) => {
  const button = KEY_MAP[e.key];
  if (button) {
    e.preventDefault();
    emulator.pressButton(button);
  }
});

window.addEventListener('keyup', (e) => {
  const button = KEY_MAP[e.key];
  if (button) emulator.releaseButton(button);
});
