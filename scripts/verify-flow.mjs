import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
const url = process.argv[2] || 'http://127.0.0.1:5173';
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => { if (message.type() === 'error' && !/404/.test(message.text())) errors.push(message.text()); });
const chapter = async (index) => {
  await page.getByRole('button', { name: 'Índice da apresentação', exact: true }).click();
  await page.getByRole('navigation', { name: 'Índice completo' }).getByRole('button').nth(index).click();
  await page.waitForTimeout(250);
};
const tab = (list, name) => page.getByRole('tablist', { name: list }).getByRole('tab', { name: new RegExp(name) });
const screenLoaded = async (file) => {
  await page.waitForFunction(() => document.querySelector('.screen-pixels img')?.complete && document.querySelector('.screen-canvas')?.getBoundingClientRect().width > 200);
  const sources = await page.locator('.screen-pixels img').evaluateAll((images) => images.map((img) => img.getAttribute('src')));
  assert.ok(sources.some((src) => src.includes(file)), `Expected ${file}, got ${sources}`);
};
const openAndClose = async (button, file) => {
  await button.click();
  assert.match(await page.locator('.original-image img').getAttribute('src'), new RegExp(file));
  await page.keyboard.press('Escape');
};
const layout = async (label) => {
  const result = await page.locator('.scene-area').evaluate((el) => ({ width: el.scrollWidth - el.clientWidth, height: el.scrollHeight - el.clientHeight, doc: document.documentElement.scrollWidth - innerWidth }));
  assert.ok(result.width < 2 && result.doc < 2, `${label}: ${JSON.stringify(result)}`);
  return result;
};

try {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.getByRole('navigation', { name: 'Cenas do pitch' }).getByRole('button').count(), 10);

  // 01–04: abertura mantida.
  await chapter(1);
  assert.equal(await page.locator('.stat-number > strong').innerText(), '472 mil');
  assert.deepEqual(await page.locator('.absence-chart .chart-bars span').allTextContents(), ['201.864', '283.471', '472.328']);
  await chapter(2);
  await page.getByRole('button', { name: 'Com Sentinel', exact: true }).click();
  assert.equal(await page.locator('.is-connected').count(), 1);
  await chapter(3);
  assert.equal(await page.locator('main img').count(), 0, 'Introduce the concept before showing product screenshots');

  // 05: ciclo, questionários, dimensões e dossiê, sem falar de planos.
  await chapter(4);
  await screenLoaded('ciclos-v3');
  await tab('Etapas do ciclo', 'Os questionários').click();
  await screenLoaded('criar-ciclo');
  assert.match(await page.locator('.flow-aside').innerText(), /COPSOQ III/);
  await tab('Etapas do ciclo', 'Dimensões').click();
  assert.equal(await page.locator('.dimension-card').count(), 8);
  await openAndClose(page.getByRole('button', { name: 'Ver no dossiê', exact: true }), 'dossie-pdf-p1');
  await tab('Etapas do ciclo', 'Dashboard').click();
  await screenLoaded('dashboard-v2');
  await openAndClose(page.getByRole('button', { name: 'Ver gráficos e ranking', exact: true }), 'dashboard-v2');
  await tab('Etapas do ciclo', 'Dossiê').click();
  await screenLoaded('dossie-pdf-p2');
  assert.match(await page.locator('.flow-extras').innerText(), /Denúncia anônima/);
  assert.doesNotMatch(await page.locator('.flow-workspace').innerText(), /Plano de ação|5W2H/);
  await page.screenshot({ path: 'artifacts/flow-ciclo.png' });

  // 06: base por trás dos planos, com o pipeline destacado por fonte.
  await chapter(5);
  const expectedFeeds = { 'Perfil da empresa': ['Curadoria'], Documentos: ['Busca (RAG)', 'Redação'], 'Histórico de ações': ['Curadoria', 'Aprendizado'], 'Base científica': ['Busca (RAG)', 'Redação'] };
  const files = { 'Perfil da empresa': 'configuracoes-v2', Documentos: 'base-conhecimento', 'Histórico de ações': 'historico-acoes', 'Base científica': 'metodologia-ia' };
  for (const [name, feeds] of Object.entries(expectedFeeds)) {
    await tab('Fontes da IA', name).click();
    await screenLoaded(files[name]);
    assert.deepEqual(await page.locator('.pipeline-aside li.fed b').allTextContents(), feeds);
  }
  assert.match(await page.locator('.guardrail').innerText(), /descartada pelo servidor/);
  await page.screenshot({ path: 'artifacts/flow-base.png' });

  // 07: plano com fontes, memória da empresa e chat.
  await chapter(6);
  await screenLoaded('plano-pausas');
  await tab('Partes do plano', 'Fontes citadas').click();
  assert.deepEqual(await page.locator('.source-ref').allTextContents(), ['F1', 'F2', 'F3', 'F4', 'F5', 'F6']);
  assert.equal(await page.locator('.source-cards li.company').count(), 2);
  await tab('Partes do plano', 'Memória da empresa').click();
  assert.match(await page.locator('.memory-visual').innerText(), /erro do PAE/);
  assert.match(await page.locator('.memory-visual').innerText(), /Não funcionou/);
  await openAndClose(page.getByRole('button', { name: 'Ver histórico no sistema', exact: true }), 'historico-acoes');
  await tab('Partes do plano', 'Discutir com a IA').click();
  await screenLoaded('chat-plano');
  assert.equal(await page.locator('.chat-points li').count(), 4);
  await openAndClose(page.getByRole('button', { name: 'Ampliar Discutir com a IA', exact: true }), 'chat-plano');
  await page.screenshot({ path: 'artifacts/flow-plano.png' });

  // 08: aprovação, Kanban, avaliação e aprendizado.
  await chapter(7);
  await page.getByRole('button', { name: 'Aprovar plano do exemplo' }).click();
  assert.equal(await page.locator('.kanban-card').count(), 4);
  for (let i = 0; i < 6; i++) await page.getByRole('button', { name: /Avançar a execução/ }).click();
  assert.equal(await page.locator('.kanban-column').nth(3).locator('.kanban-card').count(), 4);
  await page.getByRole('button', { name: /Avaliar o resultado/ }).click();
  await page.getByRole('button', { name: 'Não funcionou', exact: true }).click();
  assert.match(await page.locator('.outcome-result').innerText(), /origem: Kanban/);
  assert.match(await page.locator('.outcome-result').innerText(), /Sai das próximas sugestões/);
  await tab('Etapas após o plano', 'Medir e aprender').click();
  assert.match(await page.locator('.loop-note').innerText(), /não há reavaliação/);
  await page.screenshot({ path: 'artifacts/flow-aprendizado.png' });

  // 09–10: valor resumido e contato.
  await chapter(8);
  assert.equal(await page.locator('.value-card').count(), 4);
  assert.match(await page.locator('.value-close').innerText(), /ainda não mensurados/);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250);
  assert.match(await page.locator('.contact-scene').innerText(), /LinkedIn/);
  assert.match(await page.locator('.scene-counter').innerText(), /10\s*\/\s*10/);

  // Roteiro e fontes.
  await page.keyboard.press('n');
  assert.match(await page.locator('.presenter-panel').innerText(), /Contato e encerramento/);
  await page.keyboard.press('n');
  await page.getByRole('button', { name: 'Fontes e projeto', exact: true }).click();
  assert.equal(await page.locator('dialog .source-list > a').count(), 4);
  await page.keyboard.press('Escape');

  // Layouts de PC (a apresentação é feita no computador): sem rolagem horizontal
  // e as cenas do fluxo cabem na tela.
  for (const viewport of [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(viewport);
    for (let index = 0; index < 10; index++) {
      await chapter(index);
      const tabs = page.locator('.flow-stages [role="tab"]');
      const count = await tabs.count();
      for (let t = 0; t < Math.max(1, count); t++) {
        if (count) { await tabs.nth(t).click(); await page.waitForTimeout(120); }
        const result = await layout(`${viewport.width}: scene ${index + 1}, tab ${t + 1}`);
        if (index >= 4 && index <= 8) assert.ok(result.height < 3, `Desktop vertical overflow: scene ${index + 1}, tab ${t + 1}, ${result.height}px`);
      }
    }
  }

  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'passed', checks: ['ten chapters', 'opening scenes kept', 'cycle without plans', 'pipeline fed by each source', 'plan sources F1–F6', 'company memory', 'plan chat', 'approve → kanban → outcome → learning', 'value and contact', 'presenter notes', 'desktop layouts', 'no runtime errors'] }, null, 2));
} finally {
  await browser.close();
}
