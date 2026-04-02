const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 3600, deviceScaleFactor: 2 });

  const htmlPath = path.resolve(__dirname, 'generate-banners.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  // Wait for fonts
  await page.waitForFunction(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 1000));

  const banners = ['banner1', 'banner2', 'banner3', 'banner4'];
  const names = [
    'ad-fee-collection.png',
    'ad-ai-chatbot-hindi.png',
    'ad-whatsapp-integration.png',
    'ad-all-in-one-modules.png'
  ];

  for (let i = 0; i < banners.length; i++) {
    const el = await page.$(`#${banners[i]}`);
    await el.screenshot({
      path: path.resolve(__dirname, names[i]),
      type: 'png'
    });
    console.log(`Saved: ${names[i]}`);
  }

  await browser.close();
  console.log('Done! 4 banners saved.');
})();
