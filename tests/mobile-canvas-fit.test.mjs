import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Lenovo/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
let browser;
test.before(async () => { browser = await chromium.launch({ channel: 'chrome', headless: true }); });
test.after(async () => { await browser?.close(); });

for (const [width, height] of [[320, 740], [375, 852], [393, 852], [760, 1024], [900, 1024], [844, 393], [1440, 900]]) {
  test(`${width}×${height}: 数字/模拟有效坐标铺满画布，避免不可操作的上下空带`, async () => {
    const page = await browser.newPage({ viewport: { width, height }, colorScheme: 'dark' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto('http://localhost:3010/');
      await page.locator('#workbenchToggle').click();
      for (const kind of ['Digital', 'Analog']) {
        await page.locator(`#kindTab${kind}`).click();
        const svg = page.locator('.cw-canvas:visible');
        await svg.waitFor();
        await page.waitForTimeout(700);
        const geometry = await svg.evaluate(e => {
          const r = e.getBoundingClientRect(), v = e.viewBox.baseVal, m = e.getScreenCTM();
          return { top: m.d * v.y + m.f - r.top, bottom: r.bottom - (m.d * (v.y + v.height) + m.f), scaleDiff: m.a - m.d };
        });
        assert.ok(Math.abs(geometry.top) <= 1 && Math.abs(geometry.bottom) <= 1, JSON.stringify(geometry));
        assert.ok(Math.abs(geometry.scaleDiff) < 0.001, '不得以拉伸图形消除空带');
        assert.equal(await svg.evaluate(e => {
          const v = e.viewBox.baseVal, grid = e.querySelector('rect');
          return ['x', 'y', 'width', 'height'].every(k => Math.abs(grid[k].baseVal.value - v[k]) < 0.01);
        }), true, '背景网格覆盖整个有效坐标范围');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        if (width === 393 && kind === 'Digital') await page.locator('.cw-canvas-panel:visible').screenshot({ path: join(tmpdir(), 'mobile-canvas-fit-after.png') });
        await page.locator('.cw-canvas-panel:visible').getByRole('button', { name: '放大', exact: true }).click();
        assert.equal(await svg.evaluate(e => {
          const r = e.getBoundingClientRect(), v = e.viewBox.baseVal, m = e.getScreenCTM();
          return Math.abs(m.a * v.width - r.width) < 1 && Math.abs(m.d * v.height - r.height) < 1;
        }), true, '缩放后坐标范围仍完整填充外框');
      }
      assert.deepEqual(errors, []);
    } finally { await page.close(); }
  });
}
