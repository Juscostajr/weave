## Weave

Weave é uma interface leve para visualização de lineage (linhagem) construída com React e React Flow. Permite visualizar entidades (datasets, jobs, etc.) e suas dependências, navegar pela linhagem e usar um modo "foco" para inspecionar apenas os upstreams de um nó específico.

## Demonstração

- Live demo: https://juscostajr.github.io/weave/

## Objetivos

- Fornecer uma visualização interativa de linhagem de dados (data lineage).
- Facilitar análise rápida de dependências upstream (quem alimenta um dataset/job).
- Servir como base para integrar formatos de lineage (ex.: OpenLineage) e customizações de nós.

## Recursos principais

- Renderização de nós e arestas usando `reactflow`.
- Layout automático (via `dagre`) para posicionamento legível dos nós.
- Modo foco via query param `focus` (ex.: `/?focus=<nodeId>`) — mostra somente os nós e arestas upstream do nó informado.
- Clique em nós para destacar seus upstreams (arestas são coloridas/animadas e nós não relacionados ficam dessaturados).

## Requisitos

- Node.js 16+ (recomenda-se 18+)
- npm ou yarn

## Instalação e execução

1. Instale dependências:

```bash
npm install
# ou
yarn
```

2. Rodar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

Por padrão o Vite serve a aplicação em `http://localhost:5173` (confirme no terminal output).

Outros scripts úteis (definidos em `package.json`):

- `npm run build` — cria a versão de produção.
- `npm run preview` — visualiza a build gerada.
- `npm run lint` — roda o linter (ESLint).

## Modo foco (Focus Mode)

Existem duas formas principais de usar o modo foco nesta aplicação:

1. Query param `focus` na URL

- Passar `?focus=<nodeId>` na URL fará com que a aplicação filtre a visualização para exibir apenas o nó alvo e todo o seu conjunto de upstreams (nós que o alimentam direta e indiretamente) e as arestas correspondentes. Exemplo:

```
http://localhost:5173/?focus=dataset-123
```

- O `nodeId` deve existir no grafo. Caso não exista, a visualização completa será exibida.

2. Clique em um nó na UI

- Clicando em um nó, a aplicação calcula recursivamente todos os nós upstream (seguindo arestas onde `edge.target === currentNodeId`) e destaca apenas esses nós/arestas.
- O destaque visual utiliza:
  - `stroke` e `strokeWidth` maiores nas arestas upstream
  - animação nas arestas upstream
  - `zIndex` maior para trazer as arestas em foco
  - um campo `data.isHighlighted` nos nós para permitir estilos visuais customizados no `CustomNode`.

Dica: abra as ferramentas de desenvolvedor (DevTools) ou consulte o arquivo `src/data/openlineage-mock.json` para ver exemplos de `nodeId` usados nos dados mock.

## Estrutura do projeto (visão geral)

- `index.html` — raiz HTML usada pelo Vite.
- `src/main.jsx` — ponto de entrada do React.
- `src/App.jsx` — componente principal. Inicializa os nós/arestas, aplica layout, implementa o modo foco e o clique em nós.
- `src/Sidebar.jsx` — painel lateral para detalhes do nó selecionado (prop `selectedNode`).
- `src/CustomNode.jsx` — definição de um tipo de nó customizado usado por `reactflow`.
- `src/utils/lineageParser.js` — utilitários para parse do JSON de lineage (OpenLineage) e para aplicar layout (`getLayoutedElements`).
- `src/data/openlineage-mock.json` — dados de exemplo no formato OpenLineage (mock).
- `public/` — arquivos estáticos servidos pela aplicação.
- Configs: `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`.

## Sobre o parser e layout

- `parseOpenLineage(openLineageData)` converte o arquivo de dados (`openlineage-mock.json`) em um array de nós (`nodes`) e arestas (`edges`) compatíveis com `reactflow`.
- `getLayoutedElements(nodes, edges)` aplica um layout automático (provavelmente usando `dagre`) para gerar posições iniciais legíveis.

Se desejar suportar outro formato de lineage, adicione uma função de parsing que gere o mesmo shape de saída (arrays de `nodes` e `edges` no formato do React Flow).

## Como estender

- Adicionar novos tipos de nós: declare um novo componente de nó e registre em `nodeTypes` (em `App.jsx`).
- Suporte a múltiplos formatos de input: crie adaptadores em `src/utils/lineageParser.js` que detectem/convertam formatos diferentes para a representação interna.
- Interatividade: você pode customizar a aparência do destaque no `CustomNode` através do campo `data.isHighlighted`.

## Dicas de depuração

- Se o grafo não aparece, confirme que os dados foram parseados (`console.log` em `parseOpenLineage`) e que `getLayoutedElements` retorna `x`/`y` para os nós.
- Para identificar `nodeId`s válidos, abra `src/data/openlineage-mock.json` ou observe `nodes` no console logo após o `setNodes(layoutedNodes)` em `App.jsx`.

## Contribuição

- Abra uma issue para discutir mudanças grandes.
- Para correções rápidas: fork -> branch -> PR. Siga o padrão do repo e garanta que o linter (`npm run lint`) passe.


## Licença

Coloque aqui a licença do projeto (ex.: MIT). Se não houver uma, considere adicionar uma `LICENSE`.
