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

for (const width of [360, 393, 430, 760]) {
  test(`手机 ${width}px：字体增大后顶栏不遮挡错题和工作台入口`, async () => {
    const page = await browser.newPage({ viewport: { width, height: 852 }, isMobile: true, hasTouch: true, colorScheme: 'dark' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto('http://localhost:3010/');
      // 模拟字体偏好，不通过锁定文字大小隐藏适配问题。
      await page.addStyleTag({ content: '.topbar-brand { height: auto; font-size: 24px; line-height: 3; }' });
      for (const [button, surface] of [['#mistakeToggle', '#mistakesRoot'], ['#workbenchToggle', '#kindSwitcher'], ['#practiceToggle', '#notebookRoot']]) {
        await page.locator(button).click();
        await page.locator(surface).waitFor({ state: 'visible' });
        await page.waitForTimeout(400);
        const rect = await page.evaluate(selector => {
          const header = document.querySelector('#topbar').getBoundingClientRect();
          const panel = document.querySelector(selector).getBoundingClientRect();
          return { bottom: header.bottom, panelTop: panel.top };
        }, surface);
        assert.ok(rect.panelTop >= rect.bottom - 1, JSON.stringify(rect));
      }
      if (width === 393) await page.screenshot({ path: join(tmpdir(), 'mobile-header-practice-after.png') });
      assert.deepEqual(errors, []);
    } finally { await page.close(); }
  });
}

test('手机滚动不再收缩正文占位，回顶及跨断点后布局稳定；桌面保留收起', async () => {
  const page = await browser.newPage({ viewport: { width: 393, height: 852 }, colorScheme: 'dark' });
  try {
    await page.goto('http://localhost:3010/');
    await page.locator('#workbenchToggle').click();
    await page.locator('.circuit-workbench').waitFor({ state: 'visible' });
    await page.waitForTimeout(700);
    await page.evaluate(() => scrollTo(0, 220));
    await page.waitForTimeout(400);
    assert.equal(await page.locator('#topbar').evaluate(e => getComputedStyle(e).transform), 'none');
    assert.equal(await page.locator('#shell').evaluate(e => getComputedStyle(e).paddingTop), '0px');
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(tmpdir(), 'mobile-header-workbench-after.png') });
    await page.setViewportSize({ width: 1440, height: 900 });
    // 桌面工作台可能不足一屏，改用长教材正文验证真实下滚。
    await page.locator('#workbenchToggle').click();
    await page.locator('#lessonBody').waitFor({ state: 'visible' });
    await page.waitForTimeout(300);
    await page.evaluate(() => scrollTo(0, 500));
    await page.waitForTimeout(400);
    assert.equal(await page.locator('#topbar').evaluate(e => e.classList.contains('is-hidden')), true);
    await page.setViewportSize({ width: 393, height: 852 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.locator('#mistakeToggle').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(tmpdir(), 'mobile-header-mistakes-after.png') });
    assert.equal(await page.locator('#topbar').evaluate(e => getComputedStyle(e).transform), 'none');
  } finally { await page.close(); }
});
