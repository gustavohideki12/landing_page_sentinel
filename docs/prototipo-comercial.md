# Página comercial para visitantes do estande

Protótipo local em `/conheca/`, adicionado em 21/10/2026. A apresentação continua em `/`.

## Organização

- `conheca/index.html`: entrada e metadados próprios para a página comercial.
- `src/commercial/`: aplicação React e CSS independentes. Não importa componentes ou folhas de estilo da apresentação.
- `public/comercial/`: identidade oficial e certificado fornecido pela equipe.
- `vite.config.js`: build com duas entradas HTML. Publicar o diretório `dist` inclui as duas páginas.

Não foram alterados os arquivos de interface da apresentação. O sistema Sentinel foi consultado pela API do GitHub em modo de leitura; não foi clonado nem alterado. Nenhum formulário coleta dados ou envia respostas. As interações são locais e os contatos levam ao LinkedIn já utilizado na apresentação.

## Funcionalidades conferidas no sistema

Referência: [brunostorti/Sentinel, commit 8282778f64a329007e220bdf42621b694c578320](https://github.com/brunostorti/Sentinel/tree/8282778f64a329007e220bdf42621b694c578320), consultado em 21/10/2026.

| Tema | Fontes consultadas |
| --- | --- |
| Ciclos, pesquisa base e reavaliações | `src/lib/surveys/cycle.ts`, página de gerenciamento de pesquisas |
| Instrumentos e seus diferentes escopos | `docs/instrumentos/2026-10-12-instrumentos.md` |
| Resultados agregados e proteção para grupos pequenos | páginas de privacidade e segurança, pipeline de geração |
| Documentos da empresa e fontes consultadas pela IA | `docs/rag/2026-10-09-design-rag.md`, página da base de conhecimento |
| Perfil, histórico e geração de planos | `src/lib/ai/pipeline/orchestrator.ts` |
| Aprovação e tarefas no Kanban | `src/app/api/action-plans/[id]/approve/route.ts` |
| Acompanhamento das ações | página de relatórios de eficácia |
| Dossiê e documentação de apoio ao PGR | `docs/nr1/2026-10-09-dossie-nr1.md` |
| Certificados por etapas e validação | `src/app/api/certificates/generate/route.ts` |
| Canal de denúncias e protocolo | `src/app/api/reports/submit/route.ts` |
| Escolha de modelos para planos e chat | página sobre modelos de IA |

As descrições comerciais não prometem redução de afastamentos, garantia de anonimato absoluto, certificação governamental ou conformidade automática. O certificado é apresentado como registro da plataforma. Não foram anunciadas licenças comerciais de questionários nem planos de preço.

## Interações e acessibilidade

Exemplos de situações de trabalho; percurso de quatro etapas; imagens reais ampliáveis com zoom; recursos adicionais; perspectivas de RH e equipe; perguntas frequentes; navegação móvel; contato fixo durante a leitura. Sem reprodução automática ou interação que dependa de hover. Navegação por teclado, foco do diálogo, redução de movimento e zoom do navegador são preservados.

## Revisão para quem está conhecendo o projeto

Mantidos a estrutura, a identidade e os quatro passos aprovados. Os novos prints de comparação e checklist foram fornecidos pela equipe em 21/10/2026.

| Pergunta de uma pessoa nova | Onde fica a resposta |
| --- | --- |
| O Sentinel é o quê e para quem? | Abertura identifica uma plataforma para o RH ouvir a equipe e acompanhar ações. |
| O que são riscos psicossociais? | Exemplos de sobrecarga, apoio e conflitos; explicação nas perguntas frequentes. |
| O que é uma pesquisa e o que é um ciclo? | Explicação antes do percurso: pesquisa base e reavaliações do mesmo questionário no mesmo histórico. |
| Como começar e o que o colaborador faz? | Escutar explica questionário, setores, participantes e convite para responder. |
| O que são dimensões e dashboard? | Entender apresenta dimensões como temas e dashboard como painel de resultados. |
| Quem decide e acompanha as ações? | Agir explica revisão do gestor, quadro de tarefas, responsáveis e prazos. |
| Como comparar a pesquisa com sua reavaliação? | Reavaliar mostra duas medições, números legíveis e a captura completa ampliável. |
| Esses números são resultados comerciais comprovados? | Identificação explícita do ciclo demonstrativo da Vértice, separado das outras capturas. |
| O que o checklist mostra? | Link no resumo do ciclo abre a tela e explica que o percentual acompanha os itens registrados na plataforma. |
| É possível escolher a IA? | Bloco de escolha de modelos e FAQ, com Claude, GPT, Gemini e outros modelos compatíveis com os provedores integrados. |
| Existe denúncia anônima? | Cartão com esse nome, explicação do protocolo, perspectiva da equipe e FAQ. |
| Qual o próximo passo? | Contato da equipe no LinkedIn. |

A comparação usa os números da captura: índice de saúde 48 → 79 e dimensões em atenção 28 → 12. A nova captura mostra um ambiente demonstrativo; não foi tratada como prova de efeito causal das ações nem promessa de melhora para clientes. A tela de configuração dos modelos serviu como referência da funcionalidade; a página explica a escolha sem depender de mostrar campos técnicos de API.

## Executar e conferir

A abertura comercial usa o slogan da campanha da equipe no LinkedIn: **“Por trás de cada meta, existe uma pessoa.”**, acompanhado de **“Como a sua empresa cuida delas?”**. A referência visual aparece no azul profundo, nos detalhes em ciano, nos contornos de luz e na identificação Eureka 2026 · Stand 26. A abertura e o contato recebem a identidade da campanha; as explicações e as capturas do produto mantêm a estrutura clara aprovada.

```powershell
npm run dev -- --port 5175
```

Prévia: `http://127.0.0.1:5175/conheca/`. Esse endereço é local. O QR code do estande deve usar a URL pública após a revisão e publicação.

```powershell
$env:PLAYWRIGHT_CHANNEL='msedge'
node scripts/verify-commercial.mjs http://127.0.0.1:5175
node scripts/verify-mobile.mjs http://127.0.0.1:5175
node scripts/verify-flow.mjs http://127.0.0.1:5175
npm run build
```

O build inclui a apresentação em `/` e a página comercial em `/conheca/`. A publicação do site usa o diretório `dist`; o envio do código ao GitHub não configura hospedagem por si só.

## Revisão de responsividade mobile

`verify-mobile.mjs` confere 13 formatos em emulação com toque no Edge/Chromium: 320×568, 360×640, 375×667, 390×844, 412×915, 430×932, 568×260, 568×320, 667×375, 740×360, 844×390, 600×960 e 768×1024. A altura de 260 px cobre uma situação de pouco espaço útil na horizontal. O relatório é salvo em `artifacts/mobile-review.json`.

A revisão verifica texto e cartões sem corte horizontal, menu, abas, comparação, exemplo do RAG, denúncias e controles do visualizador de imagens. A imagem e a explicação rolam dentro do diálogo, mantendo fechar e zoom acessíveis. O menu tem rolagem própria quando a altura é curta; a barra de contato inferior é ocultada em telas baixas, que mantêm o LinkedIn no cabeçalho. As margens consideram as áreas seguras do aparelho e o zoom do navegador permanece habilitado.

Também foram conferidos o último link do menu em tela baixa, a rolagem da imagem no tamanho original e a mudança de orientação sem recarregar. Esta validação usa emulação no Edge/Chromium; não representa um teste em iPhones ou Androids físicos nem uma execução do Safari.
