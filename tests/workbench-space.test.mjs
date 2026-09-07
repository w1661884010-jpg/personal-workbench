import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Lenovo/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

test('手机画布优先：工具栏紧凑，元件可搜索且边缘拖动坐标准确', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 }, colorScheme: 'dark' });
  try {
    await page.goto('http://localhost:3010');
    await page.locator('#workbenchToggle').click();
    const canvas = page.locator('.cw-canvas:visible');
    await canvas.waitFor();
    await page.waitForTimeout(700);
    assert.ok((await canvas.boundingBox()).height >= 400, '画布不能为了去空带缩成小图');
    assert.ok((await page.locator('.cw-canvas-toolbar:visible').boundingBox()).height <= 120);
    const search = page.getByRole('searchbox', { name: '查找元件' });
    await search.fill('switch');
    assert.equal(await page.locator('.cw-palette-list:visible button').count(), 1);
    await page.locator('.cw-palette-list:visible button').click();
    await search.fill('不存在');
    await page.getByText('没有匹配的元件').waitFor();
    await search.fill('开关');
    assert.equal(await page.locator('.cw-palette-list:visible button').count(), 1);
    await search.fill('');
    assert.ok(await page.locator('.cw-palette-list:visible button').count() > 4);
    assert.equal(await page.locator('.cw-palette-list:visible').evaluate(e => e.scrollWidth <= e.clientWidth), true);
    await canvas.scrollIntoViewIfNeeded();
    for (const fraction of [0.12, 0.88]) {
      const target = await canvas.evaluate((e, fraction) => {
        const r = e.getBoundingClientRect(), x = r.left + r.width * .7, y = r.top + r.height * fraction;
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('application/x-circuit-component', 'switch');
        e.dispatchEvent(new DragEvent('drop', { bubbles: true, clientX: x, clientY: y, dataTransfer }));
        return { x, y };
      }, fraction);
      await page.waitForTimeout(80);
      const actual = await canvas.locator('.cw-component > rect').last().boundingBox();
      assert.ok(Math.abs(actual.x + actual.width / 2 - target.x) < 2 && Math.abs(actual.y + actual.height / 2 - target.y) < 2, '扩展区域不能被旧边界夹回中央');
    }
    const component = canvas.locator('.cw-component').last();
    const before = await component.locator(':scope > rect').boundingBox();
    await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2);
    await page.mouse.down();
    await page.mouse.move(before.x + before.width / 2 - 30, before.y + before.height / 2 - 25, { steps: 5 });
    await page.mouse.up();
    const after = await component.locator(':scope > rect').boundingBox();
    assert.ok(Math.abs(after.x - before.x + 30) < 2 && Math.abs(after.y - before.y + 25) < 2);
    await page.locator('.cw-canvas-panel:visible').screenshot({ path: 'C:/Users/Lenovo/AppData/Local/Temp/workbench-expanded-after.png' });
  } finally { await browser.close(); }
});
