import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
try {
  await page.goto(process.argv[2] || 'http://127.0.0.1:5173', { waitUntil: 'networkidle' });
  const sizes = [];
  for (let i = 0; i < 8; i++) {
    await page.getByRole('navigation', { name: 'Cenas do pitch' }).getByRole('button').nth(i).click();
    await page.waitForTimeout(400);
    sizes.push(await page.locator('main').evaluate((el, scene) => ({ scene, width: el.scrollWidth - el.clientWidth, height: el.scrollHeight - el.clientHeight, children: [...el.querySelector('.scene').children].map((node) => ({ class: node.className, height: Math.round(node.getBoundingClientRect().height) })) }), i));
    await page.screenshot({ path: `artifacts/projector-${i}.png` });
    if (i === 5) {
      await page.getByRole('tab', { name: /Base científica/ }).click();
      await page.waitForTimeout(500);
      console.log('Science image:', await page.locator('.screen-canvas').evaluate((el) => ({ width: el.offsetWidth, height: el.offsetHeight, img: el.querySelector('img')?.naturalWidth })));
      await page.screenshot({ path: 'artifacts/projector-science.png' });
    }
  }
  console.log(JSON.stringify(sizes, null, 2));
} finally { await browser.close(); }
