# Sentinel: Pitch Interativo

## Apresentação aprimorada — outubro de 2026

O repositório contém uma apresentação navegável em dez cenas, pensada para um pitch de 7 minutos diante de avaliadores e público geral. Depois do problema e da proposta, o produto aparece na ordem em que funciona: primeiro a escuta, depois a base que a IA consulta e só então o plano gerado.

1. **Os sinais não esperam:** abertura com demandas, equipe e sinais despercebidos.
2. **O impacto já é real:** afastamentos, NR-1 e a necessidade de gestão.
3. **Ouvir é o começo:** comparação entre processo fragmentado e ciclo conectado.
4. **Sentinel:** escuta, compreensão e ação, sem capturas do sistema.
5. **O ciclo:** ciclo, questionários, dimensões e anonimato, dashboard e dossiê NR-1, sem falar de planos.
6. **A base:** perfil da empresa, documentos (RAG), histórico de ações e base científica, com o pipeline de geração.
7. **O plano:** plano real da Ápice com as fontes F1 a F6, a memória do que já falhou e o chat do plano.
8. **Aprendizado:** aprovação, Kanban, avaliação de eficácia e medição na próxima pesquisa (simulação local).
9. **Valor gerado:** clareza, direção, continuidade e conformidade.
10. **Contato:** LinkedIn e encerramento.

### Apresentar e ensaiar

- Role no fim de uma cena para avançar; conteúdos longos continuam rolando normalmente. Há um intervalo para evitar avanços acidentais pelo trackpad.
- Use as setas, Page Up / Page Down ou os controles do rodapé. Home / End levam ao início / fim.
- O índice permite retornar a qualquer cena, inclusive no celular.
- **F** alterna tela cheia; **N** abre o roteiro de ensaio com cronômetro e sugestões de fala para aproximadamente 7 minutos.
- O roteiro aparece na mesma tela da apresentação: feche-o antes de projetar.
- URLs com fragmentos, como `/#plano`, abrem diretamente uma cena.
- `prefers-reduced-motion` desativa animações e reprodução automática. Nos grupos de abas, as setas navegam pelas opções.

Para um pitch de 5 minutos, percorra apenas Empresa → Dashboard → Plano → Kanban na demonstração. Para 10 minutos, explore também pesquisa, reavaliação, dossiê e denúncias.

### Evidências e exemplos

As capturas vêm do ambiente demonstrativo (Ápice Contabilidade, empresa fictícia). O plano "Pausas fixas no Contábil", suas fontes F1 a F6, o histórico de ações e a conversa no chat são dados reais do sistema; o plano está pendente de revisão. O dossiê foi gerado pelo sistema para o Ciclo 2026. Na cena 8, aprovação, Kanban e avaliação são simulações locais, sem chamada à IA ou ao backend, e não há reavaliação nem redução de risco demonstrada. Escores não são porcentagem de colaboradores nem diagnóstico individual.

As fontes oficiais da série nacional, NR-1 e NR-28 foram revistas em 19/10/2026. A referência de Lewis et al. (2020) fundamenta o conceito de RAG e não valida a implementação do Sentinel. Os links estão em **Fontes e projeto**. Não há alegação de redução de afastamentos, retorno financeiro ou certificação governamental comprovados.

### Verificar

Com o servidor local ativo, `npm test` executa `scripts/verify-flow.mjs`, que percorre as dez cenas, as abas e as interações e confere os layouts de computador (1280×720 a 1920×1080). É possível utilizar o Edge instalado no Windows:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm test
```

Capturas do teste ficam em `artifacts/`, ignorado pelo Git.

As cenas 1 a 4 e 9 a 10 estão em `src/App.jsx` e `src/StoryScenes.jsx` (que também guarda o roteiro de ensaio). As cenas 5 a 8 ficam em `src/FlowScenes.jsx`, com estilos em `src/flow.css`. Os recortes das capturas e o componente de tela ficam em `src/shared.jsx`. `src/presentation.css` contém a camada visual geral. A infraestrutura permanece React + Vite, sem dependências adicionais.

## Executar localmente

```sh
npm install
npm run dev
```

O Vite informa a URL local. Para gerar os arquivos de distribuição:

```sh
npm run build
npm run preview
```

Os arquivos compilados ficam em `dist/`. A apresentação funciona sem backend. A fonte Inter é a mesma usada no aplicativo Sentinel e está incluída localmente em `public/fonts`, com sua licença SIL OFL; o carregamento não depende do Google Fonts. A abertura usa a mesma base clara das demais cenas, e os textos explicativos têm tamanhos adaptados à projeção e ao celular.
