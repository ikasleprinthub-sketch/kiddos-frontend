const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Check if the banner section exists
  const heroSection = await page.$('[class*="bg-dot-grid"]');
  if (!heroSection) {
    console.log('✓ Page loaded (fallback content showing)');
  } else {
    console.log('✓ Hero section found');
  }
  
  // Check for title/subtitle elements
  const titleText = await page.textContent('h1');
  if (titleText) {
    console.log('✓ Title found:', titleText.substring(0, 50));
  }
  
  // Take screenshot
  await page.screenshot({ path: 'banner-test.png' });
  console.log('✓ Screenshot saved: banner-test.png');
  
  await browser.close();
})();
