import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const url = process.argv[2] || 'http://127.0.0.1:5173';
const failures = [];
try {
  await page.goto(`${url}/#inteligencia`, { waitUntil: 'networkidle' });
  for (const viewport of [{ width: 1536, height: 864 }, { width: 1920, height: 1080 }, { width: 1366, height: 768 }, { width: 1280, height: 720 }, { width: 1366, height: 650 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 320, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (let stage = 0; stage < 3; stage++) {
      await page.getByRole('tablist', { name: 'Etapas do RAG' }).getByRole('tab').nth(stage).click();
      await page.waitForTimeout(180);
      const issues = await page.locator('.rag-scene').evaluate((scene) => {
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
        const children = [...scene.children].filter((el) => el.getClientRects().length);
        for (let i = 1; i < children.length; i++) {
          if (rect(children[i]).top < rect(children[i - 1]).bottom - 1) issues.push(`Overlapping sections: ${children[i - 1].className} / ${children[i].className}`);
        }
        scene.querySelectorAll('.knowledge-flow,.knowledge-documents,.rag-detail,.rag-aside').forEach(childrenInside);
        const main = scene.closest('main');
        if (main.scrollWidth > main.clientWidth + 1) issues.push('Horizontal overflow');
        return issues;
      });
      if (issues.length) failures.push({ viewport, stage, issues });
      if ([1536, 1280, 390].includes(viewport.width)) await page.screenshot({ path: `artifacts/rag-${viewport.width}-${stage}.png` });
    }
  }
  // The same diagram is also used by the product walkthrough.
  for (const viewport of [{ width: 1536, height: 864 }, { width: 1280, height: 720 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`${url}/#produto`, { waitUntil: 'networkidle' });
    await page.getByRole('navigation', { name: 'Etapas do produto' }).getByRole('button', { name: 'Base de conhecimento', exact: true }).click();
    await page.waitForTimeout(180);
    const issues = await page.locator('.knowledge-flow').evaluate((flow) => {
      const frame = flow.getBoundingClientRect();
      return [...flow.children].filter((child) => {
        if (!child.getClientRects().length) return false;
        const box = child.getBoundingClientRect();
        return box.top < frame.top - 1 || box.bottom > frame.bottom + 1 || box.left < frame.left - 1 || box.right > frame.right + 1;
      }).map((child) => child.className);
    });
    if (issues.length) failures.push({ viewport, scene: 'product walkthrough', issues });
  }
  assert.deepEqual(failures, [], 'RAG sections and diagram must stay separated at every tested size');
  console.log('Passed: all three RAG stages across eight viewport sizes, plus the shared diagram in the product walkthrough.');
} finally { await browser.close(); }
