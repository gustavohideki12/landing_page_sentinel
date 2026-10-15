# Sentinel: Pitch Interativo

Apresentacao por cenas em React e Tailwind CSS. O conteudo principal e as interacoes ficam em `src/App.jsx`. As capturas originais fornecidas pelo autor estao em `public/images`, sem recompressao.

## Executar

```sh
npm install
npm run dev
```

O Vite informa a URL local no terminal. Para gerar a versao de distribuicao:

```sh
npm run build
npm run preview
```

## Verificacao visual

Com o servidor local em execucao, instale o navegador de teste e rode:

```sh
npx playwright install chromium
node scripts/verify.mjs
```

O teste aceita a URL como primeiro argumento. A variavel `PLAYWRIGHT_CHANNEL` permite usar um navegador instalado, como `msedge`. Capturas de verificacao ficam em `artifacts/`, fora do Git.

## Sequencia do pitch

1. Abertura de impacto: demandas, pressao acumulada e sinais despercebidos.
2. Problema e relevancia: afastamentos por saude mental (2022-2024), vigencia da NR-1 e penalidades da NR-28.
3. Solucao: Sentinel, da escuta a acao, com capturas reais.
4. Demonstracao: inicio, empresa, conhecimento/RAG, criacao da pesquisa, acompanhamento/reavaliacao, dashboard, plano/assistente, Kanban, dossie/certificado e denuncias.
5. Diferenciais e funcionamento: contexto, recuperacao de evidencias e plano 5W2H.
6. Valor gerado: clareza, direcao e continuidade.

As cenas avancam pela barra superior, rodape ou teclas esquerda/direita. O movimento acontece automaticamente dentro das cenas: abertura animada, telas da demonstracao e fluxo RAG. A demonstracao usa dez etapas de 7,5 segundos; dashboard e plano incluem um segundo enquadramento. Pausa e selecao manual continuam disponiveis. A preferencia de movimento reduzido desativa a reproducao automatica.

Nao ha marcadores numerados sobre as capturas. O enquadramento preserva as imagens originais e limita ampliacao a 110% da resolucao nativa. Capturas completas, zoom, tela cheia e fontes/equipe continuam acessiveis. O RAG e representado por um esquema conceitual, pois nao foi fornecido print da tela de upload de documentos.

O prototipo nao chama o backend nem modelos de IA do produto. As animacoes ilustram a narrativa e o fluxo. Os prints e a descricao do RAG refletem os materiais e informacoes fornecidos pelo autor. Os arquivos originais sao preservados e ficam disponiveis no zoom. O valor apresentado e operacional, sem alegacao de reducao clinica ou financeira validada.

Dados de contexto verificados em 15/10/2026: serie do MPS reproduzida pelo INCA (apresentacao de maio de 2025), NR-1 e NR-28 no Ministerio do Trabalho e Emprego. A inclusao expressa dos fatores psicossociais no GRO vigora desde 26/05/2026. Multas variam por enquadramento, gravidade e numero de empregados; nao e apresentado um valor unico. Links disponiveis na pagina.

A arquitetura (Next.js, React, TypeScript, Supabase/PostgreSQL e RLS) vem do artigo do autor. O funcionamento atualizado do RAG, do certificado do Sentinel e do canal de denuncias segue sua descricao e as capturas fornecidas. O certificado e apresentado como emitido pelo Sentinel, sem alegacao de certificacao governamental.
