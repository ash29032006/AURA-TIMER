const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let errorFound = false;
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CRASH MSG:', msg.text());
      errorFound = true;
    }
  });
  page.on('pageerror', err => {
    console.log('CRASH ERR:', err.toString());
    errorFound = true;
  });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  console.log("Hovering elements...");
  
  const buttons = await page.$$('button');
  for (const btn of buttons) {
      await btn.hover();
      await new Promise(r => setTimeout(r, 200));
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  if (!errorFound) {
      console.log("No error found after hovering");
  }
  await browser.close();
})();
