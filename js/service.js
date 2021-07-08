const SEM_DADOS = {
    "principal": [{
        "titulo": "Achamos que você vai precisar de um livro...",
        "descricao": "Não conseguimos buscar sua lista de filmes, então sugerimos que estude um pouco e descubra sozinho uma maneira de consertar isso.",
        "img": "./img/biblioteca.jpg",
        "url": "https://pt.stackoverflow.com/questions/259166/fetch-api-erro-cors",
        "urlTarget": "_blank",
        "ocultarBtnAssistir": true
    }],
    "categorias": [{
        "titulo": "Por Onde começar",
        "itens": [
            {
                "titulo": "Hamilton Item",
                "descricao": "Hamilton Item: An American Musical é um musical sobre a vida do pai-fundador americano Alexander Hamilton, de música, letra e livro criados por Lin-Manuel Miranda. O espetáculo, inspirado pela biografia de 2004 \"Alexander Hamilton\" do historiador Ron Chernow, alcançou aclamação da crítica e sucesso de bilheteria.",
                "img": "./img/hamilton.jpg",
                "url": "https://google.com",
                "urlTarget": "_blank"
            }]
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

