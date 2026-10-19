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
  await chapter(6);
  await page.screenshot({ path: 'artifacts/v4-case-signal.png' });
  await page.getByRole('navigation', { name: 'Etapas do caso' }).getByRole('button').nth(1).click();
  await page.getByRole('button', { name: 'Guia de liderança', exact: true }).click();
  assert.match(await page.locator('.retrieved-fragment').innerText(), /revisar prioridades/);
  assert.match(await page.locator('.context-suggestion').innerText(), /planejamento semanal/);
  await page.getByRole('button', { name: 'Contexto operacional', exact: true }).click();
  assert.match(await page.locator('.context-suggestion').innerText(), /ajustes de processo/);
  await page.screenshot({ path: 'artifacts/v4-case-context.png' });
  await page.getByRole('button', { name: 'Continuar o caso', exact: true }).click();
  assert.equal(await page.locator('.plan-grid > div').count(), 6);
  await page.getByRole('button', { name: 'Continuar o caso', exact: true }).click();
  const task = page.getByRole('button', { name: /Realizar revisão de capacidade/ });
  await task.click();
  assert.equal(await task.getAttribute('aria-pressed'), 'true');
  assert.match(await page.locator('.next-measure').innerText(), /O resultado ainda precisa ser observado/);
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
  assert.match(page.url(), /#valor$/);
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
      const size = await page.locator('main').evaluate((el) => ({ horizontal: el.scrollWidth - el.clientWidth, vertical: el.scrollHeight - el.clientHeight, doc: document.documentElement.scrollWidth - innerWidth }));
      assert.ok(size.horizontal < 2 && size.doc < 2, `Case ${stage}, ${viewport.width}: ${JSON.stringify(size)}`);
      if (viewport.width >= 1280) {
        assert.ok(size.vertical < 3, `Case projector overflow ${stage}: ${JSON.stringify(size)}`);
        assert.ok(await page.locator('.case-visual').evaluate((el) => el.scrollHeight - el.clientHeight < 3), `Clipped case content at stage ${stage}, ${viewport.width}`);
      }
      if (viewport.width === 390 && stage === 1) await page.screenshot({ path: 'artifacts/v4-mobile-context.png', fullPage: true });
    }
  }
  // Broken screenshot assets must yield an understandable fallback.
  await page.route('**/images/inicio-v2.png', (route) => route.abort());
  await chapter(4);
  await page.getByRole('status').filter({ hasText: /Não foi possível carregar/ }).waitFor();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'passed', checks: ['interactive before/after', 'four case decisions', 'document-dependent context', 'reversible task completion', 'rehearsal notes and timer', 'keyboard, scroll and deep links', 'fullscreen', 'all case states on six viewport sizes', 'image failure fallback', 'no runtime errors'] }, null, 2));
} finally {
  await browser.close();
}
