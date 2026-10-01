import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createJoypad } from './joypad.js';

const makeIC = () => ({ read8: () => 0, write8: () => {}, request: () => {} });

suite('Joypad', () => {
  test('can be created', () => {
    assert.ok(createJoypad({ interruptController: makeIC() }));
  });

  test('can press a button', () => {
    assert.doesNotThrow(() => createJoypad({ interruptController: makeIC() }).press('A'));
  });

  test('can release a button', () => {
    assert.doesNotThrow(() => createJoypad({ interruptController: makeIC() }).release('A'));
  });

  test('direction button press reflected when direction selected', () => {
    const joy = createJoypad({ interruptController: makeIC() });
    // bit4=0 selects directions, bit5=1 de-selects actions
    joy.write8(0xff00, 0x20);
    joy.press('RIGHT');
    assert.strictEqual(joy.read8(0xff00) & 0x01, 0, 'RIGHT bit low when pressed');
  });

  test('direction button released returns bit high', () => {
    const joy = createJoypad({ interruptController: makeIC() });
    joy.write8(0xff00, 0x20);
    joy.press('RIGHT');
    joy.release('RIGHT');
    assert.strictEqual(joy.read8(0xff00) & 0x01, 1, 'RIGHT bit high when released');
  });

  test('action button press reflected when action selected', () => {
    const joy = createJoypad({ interruptController: makeIC() });
    // bit5=0 selects actions, bit4=1 de-selects directions
    joy.write8(0xff00, 0x10);
    joy.press('A');
    assert.strictEqual(joy.read8(0xff00) & 0x01, 0, 'A bit low when pressed');
  });

  test('action button released returns bit high', () => {
    const joy = createJoypad({ interruptController: makeIC() });
    joy.write8(0xff00, 0x10);
    joy.press('B');
    joy.release('B');
    assert.strictEqual(joy.read8(0xff00) & 0x02, 2, 'B bit high when released');
  });

  test('press fires JOYPAD interrupt', () => {
    let requested = '';
    const ic = { read8: () => 0, write8: () => {}, request: (i: string) => { requested = i; } };
    const joy = createJoypad({ interruptController: ic as Parameters<typeof createJoypad>[0]['interruptController'] });
    joy.press('START');
    assert.strictEqual(requested, 'JOYPAD');
  });

  test('all direction buttons work', () => {
    const joy = createJoypad({ interruptController: makeIC() });
    joy.write8(0xff00, 0x20); // bit4=0 selects directions
    for (const [btn, bit] of [['RIGHT', 0], ['LEFT', 1], ['UP', 2], ['DOWN', 3]] as const) {
      joy.press(btn);
      assert.strictEqual((joy.read8(0xff00) >> bit) & 1, 0, `${btn} pressed`);
      joy.release(btn);
      assert.strictEqual((joy.read8(0xff00) >> bit) & 1, 1, `${btn} released`);
    }
  });

  test('all action buttons work', () => {
    const joy = createJoypad({ interruptController: makeIC() });
    joy.write8(0xff00, 0x10); // bit5=0 selects actions
    for (const [btn, bit] of [['A', 0], ['B', 1], ['SELECT', 2], ['START', 3]] as const) {
      joy.press(btn);
      assert.strictEqual((joy.read8(0xff00) >> bit) & 1, 0, `${btn} pressed`);
      joy.release(btn);
      assert.strictEqual((joy.read8(0xff00) >> bit) & 1, 1, `${btn} released`);
    }
  });

  test('neither group selected returns all bits high', () => {
    const joy = createJoypad({ interruptController: makeIC() });
    joy.write8(0xff00, 0x30); // neither selected
    joy.press('A');
    joy.press('RIGHT');
    assert.strictEqual(joy.read8(0xff00) & 0x0f, 0x0f, 'low nibble all high when nothing selected');
  });

  test('both groups selected returns AND of both states', () => {
    const joy = createJoypad({ interruptController: makeIC() });
    joy.write8(0xff00, 0x00); // both selected
    joy.press('RIGHT'); // direction bit 0 → low
    joy.press('A');     // action bit 0 → low
    assert.strictEqual(joy.read8(0xff00) & 0x01, 0, 'bit 0 low when both RIGHT and A pressed');
  });

  test('upper bits of read8 always set', () => {
    const joy = createJoypad({ interruptController: makeIC() });
    assert.strictEqual(joy.read8(0xff00) & 0xc0, 0xc0, 'bits 6-7 always 1');
  });

  test('write8 sets select bits', () => {
    const joy = createJoypad({ interruptController: makeIC() });
    joy.write8(0xff00, 0x10);
    assert.strictEqual(joy.read8(0xff00) & 0x30, 0x10, 'select bits reflected in read');
  });
});
