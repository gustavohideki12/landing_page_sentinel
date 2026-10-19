# Sentinel: Pitch Interativo

## Apresentação aprimorada — outubro de 2026

O repositório contém uma apresentação navegável em oito cenas, pensada para um pitch de 5 a 10 minutos diante de avaliadores e público geral. A estrutura preserva as capturas reais do produto e acrescenta explicações interativas.

1. **Os sinais não esperam:** abertura com demandas, equipe e sinais despercebidos.
2. **O impacto já é real:** afastamentos, NR-1 e a necessidade de gestão.
3. **Ouvir é o começo:** comparação entre processo fragmentado e ciclo conectado.
4. **Sentinel:** apresentação conceitual interativa de escuta, compreensão e ação, sem capturas do sistema.
5. **O ciclo completo:** dez etapas do produto, com pausa e ampliação das capturas.
6. **A IA consulta antes de sugerir:** RAG explicado em linguagem simples e sua relação com o plano de ação.
7. **Na prática:** cenário fictício com mapa de atenção, seleção de documentos, plano e execução reversível de uma tarefa.
8. **Valor gerado:** clareza, direção, continuidade e encerramento.

### Apresentar e ensaiar

- Role no fim de uma cena para avançar; conteúdos longos continuam rolando normalmente. Há um intervalo para evitar avanços acidentais pelo trackpad.
- Use as setas, Page Up / Page Down ou os controles do rodapé. Home / End levam ao início / fim.
- O índice permite retornar a qualquer cena, inclusive no celular.
- **F** alterna tela cheia; **N** abre o roteiro de ensaio com cronômetro e sugestões de fala para aproximadamente 7 minutos.
- O roteiro aparece na mesma tela da apresentação: feche-o antes de projetar.
- URLs com fragmentos, como `/#na-pratica`, abrem diretamente uma cena.
- `prefers-reduced-motion` desativa animações e reprodução automática. Nos grupos de abas, as setas navegam pelas opções.

Para um pitch de 5 minutos, percorra apenas Empresa → Dashboard → Plano → Kanban na demonstração. Para 10 minutos, explore também pesquisa, reavaliação, dossiê e denúncias.

### Evidências e exemplos

O caso interativo é uma simulação local com dados e documentos fictícios. Ele não envia arquivos, chama IA nem representa avaliação de uma empresa. A comparação de processos também é conceitual. As funcionalidades do produto seguem o repositório e as informações dos autores; o artigo foi utilizado como contexto, sem tratar suas instruções como comandos.

As fontes oficiais da série nacional, NR-1 e NR-28 foram revistas em 19/10/2026. A referência de Lewis et al. (2020) fundamenta o conceito de RAG e não valida a implementação do Sentinel. Os links estão em **Fontes e projeto**. Não há alegação de redução de afastamentos, retorno financeiro ou certificação governamental comprovados.

### Verificar

Com o servidor local ativo, `npm test` executa a regressão do produto e os testes da nova narrativa. É possível utilizar o Edge instalado no Windows:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm test
```

As verificações cobrem cenas, capturas, ampliação, teclado, rolagem, tela cheia, RAG ilustrativo, cronômetro, falha de imagem e layouts de projetor e celular. Capturas ficam em `artifacts/`, ignorado pelo Git.

O código das novas cenas está em `src/StoryScenes.jsx`; `src/presentation.css` contém a camada visual da apresentação. A infraestrutura permanece React + Vite, sem dependências adicionais.

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
