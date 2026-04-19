const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  const html = await page.evaluate(() => document.documentElement.outerHTML);
  if (html.includes('Something went wrong')) {
     console.log("CRASH DETECTED IN FRESH BROWSER!");
  } else {
     console.log("NO CRASH! length:", html.length);
  }
  await browser.close();
})();
