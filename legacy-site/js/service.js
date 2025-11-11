const SEM_DADOS = {
    "principal": [{
        "titulo": "Achamos que você vai precisar de um livro...",
        "descricao": "Não conseguimos buscar sua lista de filmes, então sugerimos que pesquise um pouco e descubra sozinho uma maneira de consertar isso. (ok, temos uma dica...)",
        "img": "./img/biblioteca.jpg",
        "url": "https://pt.stackoverflow.com/questions/259166/fetch-api-erro-cors",
        "urlTarget": "_blank",
        "ocultarBtnAssistir": true
    }],
    "categorias": [
        {
            "titulo": "Por Onde começar",
            "itens": [
                {
                    "titulo": "Use a cabeça! HTML e CSS",
                    "descricao": "Cansado de ler livros sobre HTML que só fazem sentido depois de você já ser um expert? Então está na hora de pegar o recém-revisado Use a Cabeça! HTML e CSS e realmente aprender HTML. Aprenda HTML e CSS para finalmente criar aquelas páginas web que sempre quis e se comunicar mais efetivamente com seus amigos, família, fãs e clientes fanáticos. E você também pode se dar bem usando os mais recentes padrões do HTML5, para que possa de fato manter e expandir suas páginas ao longo do tempo e para que elas funcionem em todos os browsers e dispositivos móveis.",
                    "img": "./img/use-cabeca.jpg",
                    "url": "https://www.amazon.com.br/Use-cabe%C3%A7a-HTML-Elisabeth-Freeman/dp/8576088622/ref=sr_1_3?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=html&qid=1625794730&rnid=6740748011&s=books&sr=1-3&ufe=app_do%3Aamzn1.fos.6121c6c4-c969-43ae-92f7-cc248fc6181d",
                    "urlTarget": "_blank"
                },  {
                    "titulo": "JSON Básico: Conheça o Formato de Dados Preferido da web",
                    "descricao": "JSON básico é o guia definitivo para JSON (JavaScript Object Notation, ou Notação de objetos JavaScript ), que é o padrão atual de formatação de dados na web. O livro começa pelo básico e descreve todos os aspectos relacionados ao uso do formato JSON.",
                    "img": "./img/json-basico.jpg",
                    "url": "https://www.amazon.com.br/Json-B%C3%A1sico-Conhe%C3%A7a-Formato-Preferido/dp/8575224360/ref=sr_1_8?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=servidor+http&qid=1625794586&s=books&sr=1-8&ufe=app_do%3Aamzn1.fos.6d798eae-cadf-45de-946a-f477d47705b9",
                    "urlTarget": "_blank"
                },  {
                    "titulo": "Nginx HTTP Server - Fourth Edition: Harness the power of Nginx to make the most of your infrastructure and serve pages faster than ever before, 4th Edition",
                    "descricao": "Nginx is a lightweight HTTP server designed for high-traffic websites, with network scalability as the primary objective. With the advent of high-speed internet access, short loading times and fast transfer rates have become a necessity.",
                    "img": "./img/nginx.jpg",
                    "url": "https://www.amazon.com.br/Nginx-HTTP-Server-Martin-Fjordvald/dp/178862355X/ref=sr_1_3?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=servidor+http&qid=1625794805&s=books&sr=1-3&ufe=app_do%3Aamzn1.fos.25548f35-0de7-44b3-b28e-0f56f3f96147",
                    "urlTarget": "_blank"
                },  {
                    "titulo": "Use a cabeça!: programação JavaScript",
                    "descricao": "O que você vai aprender com este livro?Este guia amigo do cérebro ensina tudo sobre a linguagem JavaScript, dos tópicos básicos até os avançados, incluindo objetos, funções e o document object model do navegador. Você não apenas lerá ― jogará jogos, resolverá quebra-cabeças, pensará em mistérios e interagirá com o JavaScript de maneiras que nunca imaginou. E você vai escrever código de verdade, um monte deles, de forma que possa começar a criar suas próprias aplicações web.O que há de tão especial neste livro?Usando as últimas pesquisas em neurobiologia, ciência cognitiva e teoria do aprendizado, o Use a Cabeça Programação JavaScript emprega um formato visualmente rico projetado para a maneira como seu cérebro trabalha, e não uma abordagem lotada de texto que vai lhe fazer dormir.",
                    "img": "./img/javascr.jpg",
                    "url": "https://www.amazon.com.br/cabe%C3%A7a-Programa%C3%A7%C3%A3o-JavaScript-Eric-Freeman/dp/8576089904/ref=sr_1_5?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=javascript&qid=1625794964&s=books&sr=1-5&ufe=app_do%3Aamzn1.fos.6121c6c4-c969-43ae-92f7-cc248fc6181d",
                    "urlTarget": "_blank"
                },  {
                    "titulo": "Aprendendo a desenvolver aplicações web: Desenvolva rapidamente com as tecnologias JavaScript mais modernas",
                    "descricao": "Domine os fundamentos do desenvolvimento de aplicações web implementando uma aplicação simples a partir do zero, baseada em banco de dados, usando HTML, JavaScript e outras ferramentas de código aberto. Por meio de tutoriais que permitem pôr a mão na massa, este guia prático mostra como criar uma interface de usuário, implementar um servidor, desenvolver uma comunicação cliente-servidor e usar um serviço baseado em nuvem para implantar a aplicação aos desenvolvedores inexperientes de aplicações web.",
                    "img": "./img/webmoderna.jpg",
                    "url": "https://www.amazon.com.br/Aprendendo-desenvolver-aplica%C3%A7%C3%B5es-web-rapidamente-ebook/dp/B07QHK1M9P/ref=sr_1_4?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=javascript+moderno&qid=1625795142&s=books&sr=1-4",
                    "urlTarget": "_blank"
                }
            ]
        }
    ]
}

const buscarDados = (callback, url = '/json/dados.json') => {      
    
    fetch(url)
        .then(respStream => { 
            if (respStream.status == 200) {
                return respStream.json()
            } else {                
                throw new Error('Falhou: ' + `status: ${respStream.status} - ${respStream.statusText} `)
            }
        }) 
        .then(data => callback(data))
        .catch(erroDeRede => {
            console.log('Erro de comunicação: ', erroDeRede)
            callback(SEM_DADOS)
        })    
}

