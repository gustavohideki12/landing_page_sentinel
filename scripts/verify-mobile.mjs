import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:5175';
const sizes = [[320, 568], [360, 640], [375, 667], [390, 844], [412, 915], [430, 932], [568, 260], [568, 320], [667, 375], [740, 360], [844, 390], [600, 960], [768, 1024]];
const issues = [];
const results = [];
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' });

function check(condition, size, message) {
  if (!condition) issues.push(`${size}: ${message}`);
}

async function inspectLayout(page, size) {
  const findings = await page.evaluate(() => {
    const problems = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) problems.push('document scrolls horizontally');
    for (const el of document.querySelectorAll('.c-hero-copy,.c-extra-card,.c-rag-workflow,.c-cycle-explainer,.c-comparison-summary,.c-journey-copy,.c-model-choice')) {
      if (el.clientWidth && el.scrollWidth > el.clientWidth + 2) problems.push(`content clipped inside ${el.className}`);
    }
    const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent.trim() || node.parentElement.closest('.c-capture-image,script,style')) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width && (rect.left < -2 || rect.right > innerWidth + 2)) {
          problems.push(`text outside viewport: ${node.textContent.trim().slice(0, 65)}`);
          break;
        }
      }
    }
    return [...new Set(problems)];
  });
  for (const finding of findings) check(false, size, finding);
}

async function inspectDialog(page, size) {
  const dialog = page.getByRole('dialog');
  const measurements = await dialog.evaluate(el => {
    const box = el.getBoundingClientRect();
    const close = el.querySelector('header button').getBoundingClientRect();
    const zoom = el.querySelector('footer button').getBoundingClientRect();
    const image = el.querySelector('.c-dialog-image').getBoundingClientRect();
    return { fits: box.top >= -1 && box.bottom <= innerHeight + 1 && box.left >= 0 && box.right <= innerWidth,
      close: close.top >= 0 && close.bottom <= innerHeight, zoom: zoom.top >= 0 && zoom.bottom <= innerHeight,
      image: image.height, scroll: el.scrollHeight - el.clientHeight };
  });
  check(measurements.fits, size, 'image viewer exceeds the screen');
  check(measurements.close, size, 'close button outside the screen');
  check(measurements.zoom, size, 'image zoom button outside the screen');
  check(measurements.image >= 45, size, 'image viewer leaves no usable room for the image');
  check(measurements.scroll < 3, size, 'whole image dialog overflows; controls can scroll out of reach');
  if (measurements.zoom) {
    await dialog.getByRole('button', { name: 'Ver em tamanho original', exact: true }).tap();
    check(await page.locator('.c-dialog-image.is-zoomed').count() === 1, size, 'original image zoom did not open');
    await dialog.getByRole('button', { name: 'Ajustar à tela', exact: true }).tap();
  }
  await page.keyboard.press('Escape');
}

try {
  for (const [width, height] of sizes) {
    const size = `${width}x${height}`;
    const page = await browser.newPage({ viewport: { width, height }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    page.setDefaultTimeout(7000);
    page.on('pageerror', error => check(false, size, error.message));
    try {
      await page.goto(`${base}/conheca/`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      check(await page.locator('meta[name="viewport"]').getAttribute('content').then(content => !/user-scalable=no|maximum-scale=1/.test(content)), size, 'browser zoom is disabled');
      const headerContact = await page.locator('.c-header-social').boundingBox();
      check(headerContact.x >= 0 && headerContact.x + headerContact.width <= width && headerContact.height >= 44, size, 'header LinkedIn button is clipped or too small');
      await inspectLayout(page, size);
      await page.screenshot({ path: `artifacts/mobile-${size}-inicio.png` });

      await page.getByRole('button', { name: 'Abrir menu', exact: true }).tap();
      const menu = await page.locator('.c-mobile-menu').evaluate(el => ({ bottom: el.getBoundingClientRect().bottom, viewport: innerHeight }));
      check(menu.bottom <= menu.viewport + 1, size, 'mobile menu extends below the screen');
      await page.getByRole('navigation', { name: 'Navegação do celular' }).getByRole('link', { name: 'Como funciona', exact: true }).tap();
      const tabs = page.getByRole('tablist', { name: 'Explore o Sentinel' }).getByRole('tab');
      for (let index = 0; index < 4; index++) {
        await tabs.nth(index).tap();
        check(await tabs.nth(index).getAttribute('aria-selected') === 'true', size, `journey step ${index + 1} could not be selected by touch`);
        await inspectLayout(page, size);
      }
      await page.getByRole('button', { name: 'Ampliar: Comparação entre pesquisa e reavaliação', exact: true }).tap();
      await inspectDialog(page, size);

      await page.locator('.c-rag-example > summary').tap();
      await inspectLayout(page, size);
      await page.getByRole('button', { name: 'Ver este plano no sistema', exact: true }).tap();
      await inspectDialog(page, size);
      await page.getByRole('button', { name: 'Denúncia anônima', exact: false }).tap();
      await inspectDialog(page, size);
      await page.getByRole('button', { name: 'Para a equipe', exact: true }).tap();
      await page.locator('.c-faq-list summary').filter({ hasText: 'O que é RAG' }).tap();
      await inspectLayout(page, size);
      await page.locator('#contato').evaluate(el => el.scrollIntoView());
      await page.screenshot({ path: `artifacts/mobile-${size}-contato.png` });
      results.push({ size, status: issues.some(issue => issue.startsWith(`${size}:`)) ? 'issues' : 'passed' });
      console.log(`${size}: reviewed`);
    } catch (error) {
      check(false, size, error.message.split('\n')[0]);
      results.push({ size, status: 'error' });
    } finally { await page.close(); }
  }
  await writeFile('artifacts/mobile-review.json', JSON.stringify({ results, issues }, null, 2));
  console.log(JSON.stringify({ results, issues }, null, 2));
  assert.deepEqual(issues, []);
} finally { await browser.close(); }
