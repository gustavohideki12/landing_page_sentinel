import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
const url = process.argv[2] || 'http://127.0.0.1:5173';
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
page.on('pageerror', (error) => errors.push(error.message));
const chapter = async (target, index) => {
  await target.getByRole('button', { name: 'Índice da apresentação', exact: true }).click();
  await target.getByRole('navigation', { name: 'Índice completo' }).getByRole('button').nth(index).click();
  await target.waitForTimeout(250);
};
const layout = async (target, label) => {
  const result = await target.locator('.scene-area').evaluate((el) => ({ width: el.scrollWidth - el.clientWidth, height: el.scrollHeight - el.clientHeight, doc: document.documentElement.scrollWidth - innerWidth }));
  assert.ok(result.width < 2 && result.doc < 2, `${label}: ${JSON.stringify(result)}`);
  return result;
};
try {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await chapter(page, 1);
  assert.equal(await page.locator('.stat-number > strong').innerText(), '472 mil');
  assert.deepEqual(await page.locator('.absence-chart .chart-bars span').allTextContents(), ['201.864', '283.471', '472.328']);
  assert.match(await page.locator('.calendar-date').innerText(), /MAIO 2026\s+26/);
  assert.match(await page.locator('.penalty-evidence').innerText(), /Autuações e multas/);
  assert.doesNotMatch(await page.locator('main').innerText(), /benefícios|trilhão/);
  await page.screenshot({ path: 'artifacts/v3-problem.png' });
  await chapter(page, 3);
  assert.equal(await page.locator('main img').count(), 0, 'Introduce the concept before showing product screenshots');
  await page.getByRole('tab', { name: /Compreender/ }).click();
  assert.match(await page.getByRole('tabpanel').innerText(), /Indicadores por setor/);
  await page.getByRole('tab', { name: /Agir/ }).click();
  assert.match(await page.getByRole('tabpanel').innerText(), /O gestor revisa/);
  await page.screenshot({ path: 'artifacts/v3-solution.png' });
  await chapter(page, 4);
  assert.match(await page.locator('.screen-pixels img').getAttribute('src'), /inicio-v2/);
  const rail = page.getByRole('navigation', { name: 'Etapas do produto' });
  const labels = ['Início', 'Empresa', 'Base de conhecimento', 'Criar pesquisa', 'Acompanhar ciclo', 'Dashboard', 'Plano de ação', 'Kanban', 'Dossiê e certificado', 'Denúncia anônima'];
  assert.equal(await rail.getByRole('button').count(), labels.length);
  for (let i = 0; i < labels.length; i++) {
    await rail.getByRole('button', { name: labels[i], exact: true }).click();
    await page.waitForTimeout(200);
    assert.equal(await rail.getByRole('button', { name: labels[i], exact: true }).getAttribute('aria-current'), 'step');
    assert.equal(await page.locator('.point-button,.screen-point,.mobile-screen-tools').count(), 0);
    if (i === 2) assert.equal(await page.locator('.knowledge-documents > div').count(), 3);
    else {
      const rect = await page.locator('.screen-canvas').boundingBox();
      assert.ok(rect.width > 200 && rect.height > 100, `Image too small at stage ${labels[i]}`);
      assert.equal(await page.locator('.screen-pixels img').evaluate((img) => img.complete && img.naturalWidth > 0), true);
    }
    await page.screenshot({ path: `artifacts/v3-demo-${i}.png` });
  }
  await rail.getByRole('button', { name: 'Dossiê e certificado', exact: true }).click();
  assert.match(await page.locator('.demo-notes').innerText(), /Certificado Sentinel/);
  await page.getByRole('button', { name: 'Ampliar Dossiê e certificado', exact: true }).click();
  assert.match(await page.locator('.original-image img').getAttribute('src'), /dossie/);
  await page.getByRole('button', { name: 'Tamanho original', exact: true }).click();
  assert.equal(await page.locator('.original-image.zoomed').count(), 1);
  await page.keyboard.press('Escape');
  await chapter(page, 5);
  assert.equal(await page.locator('.knowledge-flow').count(), 1);
  await page.getByRole('tab', { name: /Base científica/ }).click();
  await page.waitForFunction(() => document.querySelector('.screen-canvas')?.getBoundingClientRect().width > 200 && document.querySelector('.screen-pixels img')?.complete);
  assert.match(await page.locator('.screen-pixels img').getAttribute('src'), /rag-aplicado/);
  assert.match(await page.locator('.technical-foundation').innerText(), /TypeScript/);
  await page.screenshot({ path: 'artifacts/v3-science.png' });
  await page.getByRole('tab', { name: /Plano 5W2H/ }).click();
  assert.match(await page.locator('.screen-pixels img').getAttribute('src'), /plano-v2/);
  await page.getByRole('button', { name: 'Fontes e projeto', exact: true }).click();
  assert.equal(await page.locator('dialog .source-list > a').count(), 4);
  assert.match(await page.locator('dialog').innerText(), /26 de maio de 2026/);
  await page.keyboard.press('Escape');
  await chapter(page, 7);
  await page.screenshot({ path: 'artifacts/v3-value.png' });

  for (const viewport of [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1920, height: 1080 }, { width: 390, height: 844 }, { width: 320, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    for (let index = 0; index < 8; index++) {
      await chapter(page, index);
      const result = await layout(page, `${viewport.width}: scene ${index}`);
      // RAG may scroll on short displays rather than compressing its diagram
      // into neighboring sections. Containment is verified in verify-rag.mjs.
      if (viewport.width >= 1280 && index !== 5) assert.ok(result.height < 3, `Desktop vertical overflow: ${index}, ${result.height}`);
      if (viewport.width >= 1280) {
        const clipped = await page.locator('.rag-aside,.case-visual,.intro-route').evaluateAll((nodes) => nodes.map((el) => ({ name: el.className, overflow: el.scrollHeight - el.clientHeight })).filter((item) => item.overflow > 2));
        assert.deepEqual(clipped, [], `Clipped content in scene ${index} at ${viewport.width}`);
      }
    }
    await chapter(page, 4);
    for (const index of [2, 3, 5, 8, 9]) {
      await rail.getByRole('button').nth(index).click();
      await page.waitForTimeout(150);
      await layout(page, `${viewport.width}: demo ${index}`);
      if (viewport.width === 390) await page.screenshot({ path: `artifacts/v3-mobile-demo-${index}.png` });
    }
    if (viewport.width === 390) {
      await chapter(page, 1);
      await page.screenshot({ path: 'artifacts/v3-mobile-problem.png' });
      await chapter(page, 5);
      await page.screenshot({ path: 'artifacts/v3-mobile-rag.png' });
    }
  }

  const motion = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  motion.on('pageerror', (error) => errors.push(error.message));
  await motion.goto(url, { waitUntil: 'networkidle' });
  await chapter(motion, 4);
  await motion.waitForTimeout(7400);
  assert.equal(await motion.getByRole('navigation', { name: 'Etapas do produto' }).getByRole('button', { name: 'Empresa', exact: true }).getAttribute('aria-current'), 'step');
  await motion.getByRole('button', { name: 'Pausar percurso', exact: true }).click();
  await motion.getByRole('navigation', { name: 'Etapas do produto' }).getByRole('button', { name: 'Dashboard', exact: true }).click();
  await motion.getByRole('button', { name: 'Reproduzir percurso', exact: true }).click();
  await motion.waitForTimeout(4100);
  assert.match(await motion.locator('.screen-pixels img').getAttribute('src'), /dashboard-v2/);
  assert.ok((await motion.locator('.screen-canvas').boundingBox()).height < 350, 'Dashboard chart detail not shown');
  await motion.getByRole('button', { name: 'Pausar percurso', exact: true }).click();
  await motion.waitForTimeout(250);
  assert.ok((await motion.locator('.screen-canvas').boundingBox()).height < 350, 'Pausing must preserve the chart detail');
  await chapter(motion, 5);
  await motion.waitForTimeout(3700);
  assert.match(await motion.locator('.screen-pixels img').getAttribute('src'), /rag-aplicado/);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'passed', checks: ['eight pitch chapters', 'official absence series and legal dates', 'original product screenshots', 'no numbered overlays', 'ten product stages', 'RAG diagram and scientific methodology', 'dossier and Sentinel certificate', 'anonymous reports', 'automatic progression and dashboard chart view', 'full-resolution zoom', 'responsive desktop and mobile layouts', 'no runtime errors'] }, null, 2));
} finally {
  await browser.close();
}
