const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const URL_INDEX = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;

const VIEWPORTS = [
  { nume: 'desktop 1440px', width: 1440, height: 900, mobil: false },
  { nume: 'mobil 390px', width: 390, height: 844, mobil: true },
];

for (const vp of VIEWPORTS) {
  test.describe(vp.nume, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('fără erori JS, fără scroll orizontal, navigație corectă', async ({ page }) => {
      const erori = [];
      page.on('pageerror', (e) => erori.push('pageerror: ' + e.message));
      page.on('console', (m) => {
        if (m.type() === 'error') erori.push('console.error: ' + m.text());
      });

      await page.goto(URL_INDEX, { waitUntil: 'load' });
      await page.waitForTimeout(500);

      // 1. zero erori JS
      expect(erori, erori.join('\n')).toEqual([]);

      // 2. fără depășire pe orizontală
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width);

      // 3. navigația
      const hamburger = page.locator('#hb');
      const meniuJos = page.locator('.bn');
      if (vp.mobil) {
        const hbVizibil = (await hamburger.count()) > 0 && (await hamburger.first().isVisible());
        const bnVizibil = (await meniuJos.count()) > 0 && (await meniuJos.first().isVisible());
        expect(hbVizibil || bnVizibil, 'pe 390px trebuie vizibil .bn sau #hb').toBe(true);
      } else {
        await expect(hamburger).toBeHidden();
      }
    });
  });
}
