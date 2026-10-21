import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

const original = {
  'src/App.jsx': '2AC89DE4C1E7B678D192C0496AD2CF2C8B49DC7C335DBBA2944A9915DF568D45',
  'src/StoryScenes.jsx': '560650E880638A3DB80FBD350966625BC03255CFDCF3CAF5DAA5F1B64F4D1350',
  'src/FlowScenes.jsx': 'C91914931FD6FC0EAE184BBCA1D45686A16A639970C8F1863DCEACA3AA29F4D2',
  'src/shared.jsx': '14AB160A5535F9217F1A684D7C65AC17BB970996F8AC3D2AC4017C86B49A4E27',
  'src/main.jsx': '66416D29002BBCACB25D1AB401FD2DAC26F2F1D120FBA85695F027EB6CD9698D',
  'src/styles.css': 'BA1233C75F557ECC55239CE0716F5536FDB0728C49EA0B0D7D0AFFFE53A40B45',
  'src/presentation.css': 'DB189CBF921A61EF8672FE814FB13756357E481674B255FF14F4E8556C82F9F9',
  'src/flow.css': '654D81C03E9F1DA9DD4E5F0E4A1773DB38CBCC6CC9CC9E640DC454CC4D3DB1E5',
  'index.html': 'A45956F9C4ACCDE13BE409B6A8D5D1A87E65AAC3BA72F5CE42162BA8A585F4C6',
};
for (const [file, expected] of Object.entries(original)) {
  assert.equal(createHash('sha256').update(await readFile(file)).digest('hex').toUpperCase(), expected, `Presentation file changed: ${file}`);
}

const base = process.argv[2] || 'http://127.0.0.1:5175';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', isMobile: true, hasTouch: true });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

try {
  const response = await page.goto(`${base}/conheca/`, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  await page.evaluate(() => document.fonts.ready);
  assert.match(await page.title(), /Toda equipe merece ser ouvida/);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('.pitch-app').count(), 0);
  await page.screenshot({ path: 'artifacts/comercial-390-inicio.png' });

  await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
  assert.equal(await page.getByRole('navigation', { name: 'Navegação do celular' }).isVisible(), true);
  await page.getByRole('navigation', { name: 'Navegação do celular' }).getByRole('link', { name: 'Como funciona' }).click();
  assert.match(page.url(), /#como-funciona$/);
  assert.equal(await page.getByRole('button', { name: 'Abrir menu', exact: true }).getAttribute('aria-expanded'), 'false');

  for (const name of ['Sobrecarga', 'Falta de apoio', 'Conflitos']) {
    const button = page.getByRole('group', { name: 'Explore situações no trabalho' }).getByRole('button', { name, exact: true });
    await button.click();
    assert.equal(await button.getAttribute('aria-pressed'), 'true');
  }
  assert.match(await page.locator('.c-risk-copy').innerText(), /assédio/);
  assert.match(await page.getByRole('region', { name: 'Um ciclo, várias medições.' }).innerText(), /pesquisa base[\s\S]*reavaliações/);
  await page.getByRole('button', { name: 'Ver checklist do ciclo', exact: true }).click();
  assert.match(await page.locator('.c-dialog-image > img').getAttribute('src'), /checklist-ciclo/);
  assert.match(await page.getByRole('dialog').innerText(), /preenchimento dos itens/);
  await page.keyboard.press('Escape');

  const tabs = page.getByRole('tablist', { name: 'Explore o Sentinel' }).getByRole('tab');
  for (const [index, keyword] of [[0, 'instrumento'], [1, 'dashboard'], [2, 'gestor'], [3, 'comparar']]) {
    await tabs.nth(index).click();
    assert.equal(await tabs.nth(index).getAttribute('aria-selected'), 'true');
    assert.match((await page.getByRole('tabpanel').innerText()).toLowerCase(), new RegExp(keyword));
    await page.locator('.c-journey').screenshot({ path: `artifacts/comercial-390-etapa-${index}.png` });
  }
  const comparison = page.getByRole('table', { name: 'Exemplo de comparação da pesquisa base com a primeira reavaliação' });
  assert.deepEqual(await comparison.locator('tbody tr').nth(0).locator('td > strong').allTextContents(), ['48', '79']);
  assert.deepEqual(await comparison.locator('tbody tr').nth(1).locator('td > strong').allTextContents(), ['28', '12']);
  assert.match(await page.locator('.c-comparison-example').innerText(), /demonstrativo da Vértice/);
  await page.getByRole('button', { name: 'Ampliar: Comparação entre pesquisa e reavaliação', exact: true }).click();
  assert.match(await page.locator('.c-dialog-image > img').getAttribute('src'), /comparacao-ciclo/);
  await page.getByRole('button', { name: 'Ver em tamanho original', exact: true }).click();
  assert.equal(await page.locator('.c-dialog-image.is-zoomed').count(), 1);
  await page.keyboard.press('Escape');
  await tabs.nth(0).click();
  await tabs.nth(0).press('ArrowRight');
  assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
  assert.equal(await tabs.nth(1).evaluate((el) => document.activeElement === el), true);
  await page.getByRole('button', { name: 'Próximo: Agir', exact: true }).click();
  const preview = page.getByRole('button', { name: 'Ampliar: Plano de ação com IA', exact: true });
  await preview.click();
  assert.equal(await page.getByRole('dialog').isVisible(), true);
  assert.match(await page.locator('.c-dialog-image > img').getAttribute('src'), /plano-pausas/);
  await page.getByRole('button', { name: 'Ver em tamanho original', exact: true }).click();
  assert.equal(await page.locator('.c-dialog-image.is-zoomed').count(), 1);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  assert.equal(await preview.evaluate((el) => document.activeElement === el), true);
  assert.equal(await page.evaluate(() => document.body.style.overflow), '');

  for (const label of ['Planos em movimento', 'Evidências organizadas', 'O processo registrado', 'Denúncia anônima']) {
    await page.getByRole('button', { name: new RegExp(label) }).click();
    assert.equal(await page.getByRole('dialog').isVisible(), true);
    await page.locator('.c-dialog-image > img').evaluate((img) => img.decode());
    await page.getByRole('button', { name: 'Fechar imagem', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Veja a base de conhecimento', exact: true }).click();
  assert.match(await page.getByRole('dialog').innerText(), /Base de conhecimento/);
  await page.keyboard.press('Escape');
  assert.match(await page.getByRole('region', { name: 'A IA também é uma escolha da empresa.' }).innerText(), /modelos diferentes[\s\S]*Claude[\s\S]*GPT[\s\S]*Gemini[\s\S]*compatíveis/);

  await page.getByRole('button', { name: 'Para a equipe', exact: true }).click();
  assert.match(await page.locator('.c-audience-content').innerText(), /5 respostas/);
  await page.getByRole('button', { name: 'Para o RH', exact: true }).click();
  assert.match(await page.locator('.c-audience-content').innerText(), /Indicadores por dimensão/);
  await page.locator('summary').filter({ hasText: 'As respostas são anônimas?' }).click();
  assert.match(await page.locator('details[open]').innerText(), /cinco respostas/);
  for (const [question, expected] of [['Qual a diferença entre pesquisa e ciclo?', /mesmo histórico/], ['A empresa pode escolher a IA?', /outros modelos compatíveis/], ['Como funciona a denúncia anônima?', /protocolo/]]) {
    const item = page.locator('details').filter({ has: page.locator('summary').filter({ hasText: question }) });
    await item.locator('summary').click();
    assert.match(await item.innerText(), expected);
  }

  for (const link of await page.locator('a[target="_blank"]').all()) {
    const href = await link.getAttribute('href');
    assert.match(href, /^https:\/\/(www\.linkedin\.com\/company\/sentinel-gestao-de-seguranca|www\.gov\.br\/trabalho-e-emprego)/);
    assert.match(await link.getAttribute('rel'), /noopener/);
  }

  for (const viewport of [{ width: 320, height: 740 }, { width: 360, height: 800 }, { width: 390, height: 844 }, { width: 430, height: 932 }, { width: 844, height: 390 }, { width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `artifacts/comercial-${viewport.width}-inicio.png` });
    for (let index = 0; index < 4; index++) {
      await tabs.nth(index).click();
      const size = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth, body: document.body.scrollWidth }));
      assert.ok(size.document <= size.viewport + 1 && size.body <= size.viewport + 1, `Horizontal overflow at ${viewport.width}: ${JSON.stringify(size)}`);
    }
    if ([320, 390, 430, 1440].includes(viewport.width)) {
      const tableSize = await comparison.evaluate((el) => ({ content: el.scrollWidth, visible: el.clientWidth }));
      assert.ok(tableSize.content <= tableSize.visible + 1, `Comparison table overflow at ${viewport.width}`);
      await page.getByRole('tabpanel').scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, -90));
      await page.screenshot({ path: `artifacts/comercial-${viewport.width}-comparacao.png` });
    }
    if (viewport.width === 390 || viewport.width === 1440) {
      await tabs.nth(1).click();
      for (const [selector, name] of [['.c-problem','sinais'], ['.c-journey','percurso'], ['.c-ai','ia'], ['.c-beyond','recursos'], ['.c-audience','pessoas'], ['.c-questions','perguntas'], ['.c-contact','contato']]) {
        await page.locator(selector).screenshot({ path: `artifacts/comercial-${viewport.width}-${name}.png` });
      }
    }
  }

  const presentation = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await presentation.goto(base, { waitUntil: 'networkidle' });
  assert.equal(await presentation.getByRole('navigation', { name: 'Cenas do pitch' }).getByRole('button').count(), 10);
  assert.equal(await presentation.locator('.c-page').count(), 0);
  assert.equal(await presentation.locator('body').evaluate((el) => getComputedStyle(el).overflow), 'hidden');
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'passed', checks: ['separate page and stylesheet', 'original presentation files unchanged', '10 original pitch chapters', 'mobile menu and anchors', 'risk examples', 'plain-language research cycle', 'cycle evidence checklist', 'four interactive journey steps', 'base and reassessment comparison with supplied screenshot', 'comparison data labelled as demonstrative', 'anonymous reporting channel and protocol', 'company AI model choice', 'keyboard navigation', 'real screenshot dialogs and zoom', 'focus restoration', 'features and knowledge base', 'two audience perspectives', 'FAQ disclosures', 'LinkedIn and official source links', 'seven viewport sizes', 'no runtime or asset errors'] }, null, 2));
} finally { await browser.close(); }
