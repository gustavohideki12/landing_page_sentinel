import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const url = process.argv[2] || 'http://127.0.0.1:5173';
const failures = [];
try {
  await page.goto(`${url}/#produto`, { waitUntil: 'networkidle' });
  const rail = page.getByRole('navigation', { name: 'Etapas do produto' });
  for (const viewport of [{ width: 1536, height: 864 }, { width: 1920, height: 1080 }, { width: 1366, height: 768 }, { width: 1280, height: 720 }, { width: 1366, height: 650 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 320, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (let stage = 0; stage < 13; stage++) {
      await rail.getByRole('button').nth(stage).click();
      await page.waitForTimeout(150);
      const issues = await page.locator('.product-scene').evaluate((scene) => {
        const issues = [];
        const rect = (el) => el.getBoundingClientRect();
        const childrenInside = (container) => {
          const parent = rect(container);
          for (const child of container.children) {
            if (!child.getClientRects().length) continue;
            const box = rect(child);
            if (box.top < parent.top - 1 || box.bottom > parent.bottom + 1 || box.left < parent.left - 1 || box.right > parent.right + 1) issues.push(`Content outside ${container.className}: ${child.className}`);
          }
        };
        scene.querySelectorAll('.scientific-foundation,.science-cards,.science-card,.action-plan-visual,.plan-question-grid,.plan-question,.demo-notes,.rag-evidence,.rag-evidence-panels,.rag-evidence-card,.evidence-preview,.rag-model-choice').forEach(childrenInside);
        const main = scene.closest('main');
        if (main.scrollWidth > main.clientWidth + 1) issues.push('Horizontal overflow');
        return issues;
      });
      if (issues.length) failures.push({ viewport, stage, issues });
      if (viewport.width === 1536 || (viewport.width === 1280 && [0, 1, 3, 5, 6, 7, 9, 11].includes(stage)) || (viewport.width === 390 && [0, 3, 6, 7, 11].includes(stage))) await page.screenshot({ path: `artifacts/product-${viewport.width}-${stage}.png` });
    }
  }
  await page.goto(`${url}/#inteligencia`, { waitUntil: 'networkidle' });
  await page.waitForURL('**/#produto');
  assert.match(page.url(), /#produto$/);
  assert.equal(await page.getByRole('region', { name: 'Fontes da base científica' }).count(), 1);
  assert.deepEqual(failures, [], 'The unified product sequence must stay contained at every tested size');
  console.log('Passed: all thirteen product stages across eight viewport sizes, and the legacy AI link opens the merged product.');
} finally { await browser.close(); }
