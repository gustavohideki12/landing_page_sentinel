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
  assert.match(await page.locator('.screen-pixels img').getAttribute('src'), /criar-ciclo/);
  assert.equal(await page.getByRole('navigation', { name: 'Cenas do pitch' }).getByRole('button').count(), 8);
  const rail = page.getByRole('navigation', { name: 'Etapas do produto' });
  const labels = ['Criar pesquisa', 'Ciclo de pesquisa', 'Dashboard', 'Base científica', 'Contexto da empresa', 'Base de conhecimento + RAG', 'Plano de ação', 'RAG na prática', 'Kanban', 'Reavaliação', 'Dossiê', 'Certificado Sentinel', 'Denúncia anônima'];
  assert.equal(await rail.getByRole('button').count(), labels.length);
  for (let i = 0; i < labels.length; i++) {
    await rail.getByRole('button', { name: labels[i], exact: true }).click();
    await page.waitForTimeout(200);
    assert.equal(await rail.getByRole('button', { name: labels[i], exact: true }).getAttribute('aria-current'), 'step');
    assert.equal(await page.locator('.point-button,.screen-point,.mobile-screen-tools').count(), 0);
    if (i === 3) assert.equal(await page.locator('.science-card').count(), 3);
    else if (i === 6) assert.equal(await page.locator('.plan-question').count(), 6);
    else if (i === 7) assert.equal(await page.locator('.evidence-preview').count(), 2);
    else {
      const rect = await page.locator('.screen-canvas').boundingBox();
      assert.ok(rect.width > 200 && rect.height > 100, `Image too small at stage ${labels[i]}`);
      assert.equal(await page.locator('.screen-pixels img').evaluate((img) => img.complete && img.naturalWidth > 0), true);
    }
    await page.screenshot({ path: `artifacts/v3-demo-${i}.png` });
  }
  await rail.getByRole('button', { name: 'Dashboard', exact: true }).click();
  await page.getByRole('button', { name: 'Como escolher as ações?', exact: true }).click();
  assert.match(page.url(), /#produto$/);
  assert.equal(await page.getByRole('region', { name: 'Fontes da base científica' }).count(), 1);
  await rail.getByRole('button', { name: 'Base de conhecimento + RAG', exact: true }).click();
  assert.match(await page.locator('.screen-pixels img').getAttribute('src'), /rag-aplicado/);
  await rail.getByRole('button', { name: 'Plano de ação', exact: true }).click();
  await page.getByRole('button', { name: 'Ver print do plano', exact: true }).click();
  assert.match(await page.locator('.original-image img').getAttribute('src'), /plano-v2/);
  await page.getByRole('button', { name: 'Tamanho original', exact: true }).click();
  assert.equal(await page.locator('.original-image.zoomed').count(), 1);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Ver a justificativa e o chat', exact: true }).click();
  assert.equal(await page.getByRole('region', { name: 'Justificativa e chat com RAG' }).count(), 1);
  assert.match(await page.locator('.rag-model-choice').innerText(), /custo de tokens/);
  await page.getByRole('tab', { name: 'Documentos consultados', exact: true }).click();
  assert.equal(await page.getByRole('img', { name: 'Documentos da empresa e referências consultadas na elaboração do plano', exact: true }).count(), 1);
  await page.getByRole('tab', { name: 'Política e referência', exact: true }).click();
  assert.equal(await page.getByRole('img', { name: 'Trecho do chat com política interna, pausas e referência número 4', exact: true }).count(), 1);
  for (const [label, filename] of [['Ampliar justificativa e fontes do plano', 'rag-justificativa'], ['Ampliar chat sobre o plano de ação', 'rag-chat-plano']]) {
    await page.getByRole('button', { name: label, exact: true }).click();
    assert.match(await page.locator('.original-image img').getAttribute('src'), new RegExp(filename));
    await page.getByRole('button', { name: 'Tamanho original', exact: true }).click();
    assert.equal(await page.locator('.original-image.zoomed').count(), 1);
    await page.keyboard.press('Escape');
  }
  await page.getByRole('button', { name: 'Acompanhar a execução', exact: true }).click();
  assert.equal(await rail.getByRole('button', { name: 'Kanban', exact: true }).getAttribute('aria-current'), 'step');
  await rail.getByRole('button', { name: 'Dossiê', exact: true }).click();
  assert.match(await page.locator('.demo-notes').innerText(), /Inventário de riscos e medidas/);
  await page.getByRole('button', { name: 'Ampliar Dossiê', exact: true }).click();
  assert.match(await page.locator('.original-image img').getAttribute('src'), /dossie/);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Próxima etapa', exact: true }).click();
  assert.equal(await rail.getByRole('button', { name: 'Certificado Sentinel', exact: true }).getAttribute('aria-current'), 'step');
  assert.match(await page.locator('.demo-notes').innerText(), /Comprovação da aplicação/);
  await page.getByRole('button', { name: 'Ampliar Certificado Sentinel', exact: true }).click();
  assert.match(await page.locator('.original-image img').getAttribute('src'), /certificado\.png$/);
  await page.getByRole('button', { name: 'Tamanho original', exact: true }).click();
  assert.equal(await page.locator('.original-image.zoomed').count(), 1);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Fontes e projeto', exact: true }).click();
  assert.equal(await page.locator('dialog .source-list > a').count(), 4);
  assert.match(await page.locator('dialog').innerText(), /26 de maio de 2026/);
  await page.keyboard.press('Escape');
  await chapter(page, 6);
  await page.screenshot({ path: 'artifacts/v3-value.png' });

  for (const viewport of [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1920, height: 1080 }, { width: 390, height: 844 }, { width: 320, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    for (let index = 0; index < 8; index++) {
      await chapter(page, index);
      const result = await layout(page, `${viewport.width}: scene ${index}`);
      // RAG may scroll on short displays rather than compressing its diagram
      // into neighboring sections. Containment is verified in verify-rag.mjs.
      if (viewport.width >= 1280 && index !== 4) assert.ok(result.height < 3, `Desktop vertical overflow: ${index}, ${result.height}`);
      if (viewport.width >= 1280) {
        const clipped = await page.locator('.rag-aside,.case-visual,.intro-route').evaluateAll((nodes) => nodes.map((el) => ({ name: el.className, overflow: el.scrollHeight - el.clientHeight })).filter((item) => item.overflow > 2));
        assert.deepEqual(clipped, [], `Clipped content in scene ${index} at ${viewport.width}`);
      }
    }
    await chapter(page, 4);
    for (const index of [0, 2, 6, 7, 9, 10, 11, 12]) {
      await rail.getByRole('button').nth(index).click();
      await page.waitForTimeout(150);
      await layout(page, `${viewport.width}: demo ${index}`);
      if (viewport.width === 390) await page.screenshot({ path: `artifacts/v3-mobile-demo-${index}.png` });
    }
    if (viewport.width === 390) {
      await chapter(page, 1);
      await page.screenshot({ path: 'artifacts/v3-mobile-problem.png' });
      await chapter(page, 4);
      await rail.getByRole('button', { name: 'Base de conhecimento + RAG', exact: true }).click();
      await page.screenshot({ path: 'artifacts/v3-mobile-rag.png' });
    }
  }

  const motion = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  motion.on('pageerror', (error) => errors.push(error.message));
  await motion.goto(url, { waitUntil: 'networkidle' });
  await chapter(motion, 4);
  await motion.getByRole('button', { name: 'Reproduzir percurso', exact: true }).click();
  await motion.waitForTimeout(7700);
  assert.equal(await motion.getByRole('navigation', { name: 'Etapas do produto' }).getByRole('button', { name: 'Ciclo de pesquisa', exact: true }).getAttribute('aria-current'), 'step');
  await motion.getByRole('button', { name: 'Pausar percurso', exact: true }).click();
  await motion.getByRole('navigation', { name: 'Etapas do produto' }).getByRole('button', { name: 'Dashboard', exact: true }).click();
  await motion.getByRole('button', { name: 'Reproduzir percurso', exact: true }).click();
  await motion.waitForTimeout(4100);
  assert.match(await motion.locator('.screen-pixels img').getAttribute('src'), /dashboard-v2/);
  assert.ok((await motion.locator('.screen-canvas').boundingBox()).height < 350, 'Dashboard chart detail not shown');
  await motion.getByRole('button', { name: 'Pausar percurso', exact: true }).click();
  await motion.waitForTimeout(250);
  assert.ok((await motion.locator('.screen-canvas').boundingBox()).height < 350, 'Pausing must preserve the chart detail');
  await motion.getByRole('navigation', { name: 'Etapas do produto' }).getByRole('button', { name: 'Base de conhecimento + RAG', exact: true }).click();
  assert.match(await motion.locator('.screen-pixels img').getAttribute('src'), /rag-aplicado/);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'passed', checks: ['eight pitch chapters', 'official absence series and legal dates', 'original product screenshots', 'no numbered overlays', 'thirteen product stages in a single chapter', 'scientific sources, RAG and action plan without repeating the tour', 'dossier followed by Sentinel certificate with full-resolution zoom', 'anonymous reports', 'automatic progression and dashboard chart view', 'full-resolution zoom', 'responsive desktop and mobile layouts', 'no runtime errors'] }, null, 2));
} finally {
  await browser.close();
}
