const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  const html = await page.evaluate(() => document.documentElement.outerHTML);
  console.log("HTML:", html.substring(0, 500));
  console.log("...");
  console.log("HTML END:", html.substring(html.length - 1000));
  await browser.close();
})();
