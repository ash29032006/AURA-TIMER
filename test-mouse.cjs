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
  console.log("Moving mouse...");
  await page.mouse.move(100, 100);
  await page.mouse.move(200, 200, {steps: 10});
  await page.mouse.move(400, 400, {steps: 10});
  
  await new Promise(r => setTimeout(r, 1000));
  
  if (!errorFound) {
      console.log("No error found after moving mouse");
  }
  await browser.close();
})();
