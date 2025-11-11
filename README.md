# Netflix Clone (React + Vite)

Este repositório agora expõe diretamente a versão em React do projeto NETPHLIX. O código legado em HTML/CSS/JS foi movido para `legacy-site/` caso precise consultar o material original.

## Scripts

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção
npm run preview  # servir o build gerado
npm run lint     # regras do eslint
```

## Estrutura

```
src/
 ├── components/         # Layout, cards, listas e estados compartilhados
 ├── pages/home          # Página principal do catálogo
 ├── data/               # Perfis e conteúdo de fallback
 ├── hooks/              # Lógica de busca/estado assíncrono
 ├── services/           # Acesso aos arquivos json públicos
 ├── styles/             # Estilos globais (adaptados do projeto clássico)
 └── utils/              # Funções auxiliares (normalização, truncamento, etc)
public/
 ├── img/                # Assets estáticos
 └── json/               # Catálogos por perfil
```

## Perfis e dados

- `Sou Normal` → `json/dados.json`
- `Sou Terraplanista` → `json/piadas.json`
- `Prefiro Livros` → `json/livros.json`

A troca de perfil acontece no `<select>` do cabeçalho e dispara um novo fetch. Em caso de falha de rede, o app renderiza `fallbackContent` com sugestões de livros.

> **Legado**  
> Todos os arquivos do primeiro protótipo estão preservados em `legacy-site/`. Basta subir um `http-server` dentro dessa pasta para visualizar a versão clássica.
