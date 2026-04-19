const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  const html = await page.evaluate(() => document.documentElement.outerHTML);
  fs.writeFileSync('dom_dump.html', html);
  await browser.close();
})();
