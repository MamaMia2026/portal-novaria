// Rulare: npx playwright test  (necesită @playwright/test)
// Opțional: PW_EXE = calea către un executabil Chromium deja instalat.
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  reporter: 'list',
  use: {
    browserName: 'chromium',
    launchOptions: process.env.PW_EXE ? { executablePath: process.env.PW_EXE } : {},
  },
});
