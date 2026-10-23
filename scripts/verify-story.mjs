import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const url = process.argv[2] || 'http://127.0.0.1:5173';
const chapter = async (index) => {
  await page.getByRole('button', { name: 'Índice da apresentação', exact: true }).click();
  await page.getByRole('navigation', { name: 'Índice completo' }).getByRole('button').nth(index).click();
  await page.waitForTimeout(300);
};
try {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'artifacts/v4-opening.png' });
  await chapter(2);
  assert.match(await page.locator('.gap-takeaway').innerText(), /Dados só ajudam/);
  await page.getByRole('button', { name: 'Com Sentinel', exact: true }).click();
  assert.equal(await page.locator('.is-connected').count(), 1);
  assert.match(await page.locator('.decision-chain').innerText(), /Sugestões com o contexto/);
  await page.screenshot({ path: 'artifacts/v4-connected.png' });
  await chapter(5);
  assert.deepEqual(await page.locator('.case-indicator > b').allTextContents(), ['69', '67', '56']);
  assert.match(await page.locator('.case-priority').innerText(), /Setor Contábil/);
  await page.getByRole('button', { name: 'Ver dashboard', exact: true }).click();
  assert.match(await page.locator('dialog img').getAttribute('src'), /dashboard-v2/);
  await page.keyboard.press('Escape');
  await page.screenshot({ path: 'artifacts/v4-case-signal.png' });
  await page.getByRole('navigation', { name: 'Etapas do caso' }).getByRole('button').nth(1).click();
  assert.match(await page.locator('.case-context-fact').innerText(), /49 colaboradores/);
  await page.getByRole('button', { name: 'Política de jornada', exact: true }).click();
  assert.match(await page.locator('.case-context-fact').innerText(), /item 5/);
  assert.match(await page.locator('.case-context-effect').innerText(), /fechamento/);
  await page.getByRole('button', { name: 'Viabilidade', exact: true }).click();
  assert.match(await page.locator('.case-context-effect').innerText(), /coordenador/);
  await page.screenshot({ path: 'artifacts/v4-case-context.png' });
  await page.getByRole('button', { name: 'Continuar o caso', exact: true }).click();
  assert.match(await page.locator('.case-action-plan').innerText(), /Pausas fixas/);
  assert.match(await page.locator('.case-plan-facts').innerText(), /R\$ 0–540/);
  await page.getByRole('button', { name: 'Aprovar plano do exemplo', exact: true }).click();
  const reapply = page.getByRole('button', { name: 'Preparar reaplicação do COPSOQ II', exact: true });
  assert.equal(await reapply.isDisabled(), true);
  const task = page.getByRole('button', { name: /Definir e registrar os horários de pausa/ });
  await task.click();
  assert.equal(await task.getAttribute('aria-pressed'), 'true');
  assert.match(await page.locator('.case-reassessment').innerText(), /comparar os indicadores/);
  await reapply.click();
  assert.match(await page.locator('.case-reassessment').innerText(), /Ainda não há resultado de melhora/);
  await task.click();
  assert.equal(await task.getAttribute('aria-pressed'), 'false');
  await task.click();
  await page.screenshot({ path: 'artifacts/v4-case-followup.png' });
  await page.keyboard.press('n');
  assert.equal(await page.getByRole('complementary', { name: 'Roteiro de ensaio' }).count(), 1);
  await page.getByRole('button', { name: 'Iniciar cronômetro', exact: true }).click();
  await page.waitForTimeout(1200);
  assert.notEqual(await page.getByLabel('Tempo de ensaio').innerText(), '00:00');
  await page.getByRole('button', { name: 'Pausar cronômetro', exact: true }).click();
  await page.getByRole('button', { name: 'Zerar cronômetro', exact: true }).click();
  assert.equal(await page.getByLabel('Tempo de ensaio').innerText(), '00:00');
  await page.getByRole('button', { name: 'Fechar roteiro', exact: true }).click();
  await page.locator('main').focus();
  await page.keyboard.press('Home');
  assert.match(page.url(), /#abertura$/);
  await page.keyboard.press('ArrowDown');
  assert.match(page.url(), /#problema$/);
  await page.keyboard.press('End');
  assert.match(page.url(), /#contato$/);
  await page.getByRole('button', { name: 'Reiniciar pitch', exact: true }).click();
  assert.match(page.url(), /#abertura$/);
  await page.waitForTimeout(1050);
  await page.locator('main').hover();
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(200);
  assert.match(page.url(), /#problema$/);
  await page.goto(`${url}/#na-pratica`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.case-scene').count(), 1);
  await page.getByRole('button', { name: 'Tela cheia', exact: true }).click();
  assert.equal(await page.evaluate(() => !!document.fullscreenElement), true);
  await page.getByRole('button', { name: 'Sair da tela cheia', exact: true }).click();
  assert.equal(await page.evaluate(() => !!document.fullscreenElement), false);
  // Every case state must fit projector screens and allow natural mobile scroll.
  for (const viewport of [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1920, height: 1080 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 320, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (let stage = 0; stage < 4; stage++) {
      await page.getByRole('navigation', { name: 'Etapas do caso' }).getByRole('button').nth(stage).click();
      await page.waitForTimeout(150);
      if (stage === 1) for (const name of ['Perfil da empresa', 'Política de jornada', 'Viabilidade']) {
        await page.getByRole('button', { name, exact: true }).click();
        if (viewport.width >= 1280) assert.ok(await page.locator('.case-visual').evaluate((el) => {
          const outer = el.getBoundingClientRect();
          const inner = el.firstElementChild.getBoundingClientRect();
          return inner.top >= outer.top && inner.bottom <= outer.bottom;
        }), `Context ${name} clipped at ${viewport.width}`);
      }
      const size = await page.locator('main').evaluate((el) => ({ horizontal: el.scrollWidth - el.clientWidth, vertical: el.scrollHeight - el.clientHeight, doc: document.documentElement.scrollWidth - innerWidth }));
      assert.ok(size.horizontal < 2 && size.doc < 2, `Case ${stage}, ${viewport.width}: ${JSON.stringify(size)}`);
      if (viewport.width >= 1280) {
        assert.ok(size.vertical < 3, `Case projector overflow ${stage}: ${JSON.stringify(size)}`);
        assert.ok(await page.locator('.case-visual').evaluate((el) => el.scrollHeight - el.clientHeight < 3), `Clipped case content at stage ${stage}, ${viewport.width}`);
      }
      if (viewport.width === 1280) await page.screenshot({ path: `artifacts/case-projector-${stage}.png` });
      if (viewport.width === 390 && stage === 1) await page.screenshot({ path: 'artifacts/v4-mobile-context.png', fullPage: true });
    }
  }
  // Broken screenshot assets must yield an understandable fallback.
  await page.route('**/images/contexto-v2.png', (route) => route.abort());
  await chapter(4);
  await page.getByRole('navigation', { name: 'Etapas do produto' }).getByRole('button', { name: 'Contexto da empresa', exact: true }).click();
  await page.getByRole('status').filter({ hasText: /Não foi possível carregar/ }).waitFor();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'passed', checks: ['interactive before/after', 'source screenshot evidence', 'one accounting case across four stages', 'company context and policy', 'plan review and simulated approval', 'reversible task completion', 'reapplication without fabricated improvement', 'rehearsal notes and timer', 'keyboard, scroll and deep links', 'fullscreen', 'all case states on six viewport sizes', 'image failure fallback', 'no runtime errors'] }, null, 2));
} finally {
  await browser.close();
}
