import { createEmulator } from '../../src/emulator.js';
import type { Button } from '../../src/joypad.js';

const canvas = document.getElementById('screen') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const romInput = document.getElementById('rom-input') as HTMLInputElement;

let rafId: number | null = null;

// Web Audio setup
const SAMPLE_RATE = 44100;
const BUFFER_SIZE = 512;
const RING_SIZE   = 8192; // must be power of 2
const RING_MASK   = RING_SIZE - 1;
// Keep ~2 frames worth of headroom; drop samples if emulator runs too hot
const RING_MAX_FILL = RING_SIZE - BUFFER_SIZE * 2;

const audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE });

const ringLeft  = new Float32Array(RING_SIZE);
const ringRight = new Float32Array(RING_SIZE);
let ringWrite = 0;
let ringRead  = 0;

const scriptNode = audioCtx.createScriptProcessor(BUFFER_SIZE, 0, 2);
scriptNode.onaudioprocess = (e) => {
  const outL = e.outputBuffer.getChannelData(0);
  const outR = e.outputBuffer.getChannelData(1);
  for (let i = 0; i < BUFFER_SIZE; i++) {
    if (ringRead !== ringWrite) {
      outL[i] = ringLeft[ringRead & RING_MASK]!;
      outR[i] = ringRight[ringRead & RING_MASK]!;
      ringRead++;
    } else {
      outL[i] = 0;
      outR[i] = 0;
    }
  }
};
scriptNode.connect(audioCtx.destination);

const emulator = createEmulator({
  onFrame: (pixels) => {
    ctx.putImageData(new ImageData(new Uint8ClampedArray(pixels), 160, 144), 0, 0);
  },
  apuOptions: {
    sampleRate: SAMPLE_RATE,
    onSample: (l, r) => {
      // Drop sample if ring is almost full to prevent overflow glitches
      if ((ringWrite - ringRead) < RING_MAX_FILL) {
        ringLeft[ringWrite & RING_MASK]  = l;
        ringRight[ringWrite & RING_MASK] = r;
        ringWrite++;
      }
    },
  },
});

const GB_CLOCK = 4194304; // T-cycles per second
const MAX_CYCLES_PER_RAF = 70224 * 2; // cap at 2 frames to avoid spiral-of-death

function startLoop() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  if (audioCtx.state === 'suspended') audioCtx.resume();

  let lastTs: number | null = null;

  function frame(ts: number) {
    if (lastTs !== null) {
      const elapsed = (ts - lastTs) / 1000;
      const cycles = Math.min(Math.round(elapsed * GB_CLOCK), MAX_CYCLES_PER_RAF);
      emulator.runFrame(cycles);
    }
    lastTs = ts;
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
