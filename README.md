# NETPHLIX (netflix-clone)

Clone didático do layout da Netflix, feito em HTML, CSS e JavaScript. Nasceu em um curso de reciclagem: a partir das aulas iniciais, o desafio era recriar a interface e deixar as listas divertidas.

Há catálogos inspirados no Framboesa de Ouro, um perfil “terraplanista” e uma opção para quem prefere livros.

## Funcionalidades

- Layout no estilo Netflix: header, hero em carrossel e fileiras por categoria
- Três perfis que trocam o catálogo (JSON local via `fetch`)
- Fallback educativo quando o `fetch` falha (por exemplo, abrindo com `file://` / CORS)
- Layout responsivo

## Tecnologias

- HTML5, CSS3 e JavaScript (vanilla)
- [Owl Carousel](https://owlcarousel2.github.io/OwlCarousel2/) + jQuery 3.7.1 (incluídos no repositório)
- Ícones SVG locais (sem CDN de fontes/ícones)
- Dados em JSON carregados com a Fetch API

Não há build, bundler nem dependências de Node.

## Como rodar

O conteúdo completo depende de um servidor HTTP (o `fetch` dos JSON não funciona bem via `file://`).

```bash
git clone https://github.com/syscero/netflix-clone.git
cd netflix-clone
python3 -m http.server 8000
```

Abra [http://localhost:8000](http://localhost:8000).

Qualquer servidor estático na raiz do projeto também serve (por exemplo, `npx serve .`).

Abrir o `index.html` direto no navegador (`file://`) deixa o conteúdo limitado: a aplicação cai no fallback `SEM_DADOS`.

## Perfis

No seletor do header:

| Perfil | Query | Arquivo |
|--------|-------|---------|
| Sou Normal | _(nenhuma)_ | `json/dados.json` |
| Sou Terraplanista | `?handicapped=true` | `json/piadas.json` |
| Prefiro Livros | `?hero=true` | `json/livros.json` |

## Estrutura do projeto

```
netflix-clone/
├── index.html          # Página principal
├── js/
│   ├── main.js         # Inicialização e renderização
│   ├── service.js      # fetch + fallback SEM_DADOS
│   ├── acoes.js        # Troca de perfil
│   └── owl/            # jQuery e Owl Carousel
├── style/
│   ├── main.css
│   ├── responsive.css
│   └── owl/
├── json/
│   ├── dados.json
│   ├── piadas.json
│   └── livros.json
└── img/                # Capas e imagens locais
```

## Extender o conteúdo

Os catálogos seguem este formato:

```json
{
  "principal": [
    {
      "titulo": "Título no hero",
      "descricao": "Sinopse curta",
      "img": "./img/capa.jpg",
      "url": "https://opcional.com",
      "urlTarget": "_blank",
      "ocultarBtnAssistir": false
    }
  ],
  "categorias": [
    {
      "titulo": "Nome da fileira",
      "itens": [
        {
          "titulo": "Item",
          "descricao": "Descrição",
          "img": "./img/poster.jpg",
          "url": "https://opcional.com"
        }
      ]
    }
  ]
}
```

Campos como `url`, `urlTarget` e `ocultarBtnAssistir` são opcionais.

## Observações

- Projeto estático de aprendizado: sem backend e sem autenticação real
- O link de Login é apenas visual
- Sirva a aplicação na raiz do host/porta para que paths como `/json/...` funcionem

## Segurança e modelo de confiança

Os catálogos em `json/` são tratados como conteúdo do aplicativo. Na renderização, textos são escapados e `url`/`img` só aceitam `http:`/`https:` ou paths relativos locais (`./` ou `/`). Mesmo assim, edite os JSON com o mesmo cuidado de código — um PR malicioso nesses arquivos ainda pode apontar imagens/links externos indesejados.

Não há secrets, sessões nem APIs mutáveis. Em deploy, o host pode reforçar a superfície com headers, por exemplo:

```http
Content-Security-Policy: default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'self'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

(`img-src https:` cobre capas remotas usadas nos JSON didáticos; restrinja se passar a servir só imagens locais.)
