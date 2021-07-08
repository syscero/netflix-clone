// service.js precisa estar declarado antes de main.js no html
const init = () => {  
    const perfil = initPerfil()
    const arquivo = ['dados', 'piadas', 'livros']
    const url = perfil ? `/json/${arquivo[perfil]}.json` : '/json/dados.json'
    buscarDados(setarDadosApp, url)
}

const initPerfil = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (params['hero'] || params['handicapped']) {
        const options = document.querySelector('header select')
        const idx = params['hero'] ? 2 : 1
        options[idx].selected = true
        return idx;
    }

    return 0
}

const setarDadosApp = (data) => {
    setarDadosPrincipal(data.principal)
    setarDadosCategorias(data.categorias)   
}

/**
 * 
 * @param {*} dadosPrincipal 
 */
const setarDadosPrincipal = (dadosPrincipal) => {
    const ESTILO_CAROUSEL_MAIN = ".main .owl-carousel"
    const mainCarousel = document.querySelector(ESTILO_CAROUSEL_MAIN)
    mainCarousel.innerHTML = ''

    for (let dados of dadosPrincipal) {
        criarItemPrincipal(mainCarousel, dados)
    }

    $(ESTILO_CAROUSEL_MAIN).owlCarousel({
        loop:true,
        margin:10,
        nav:true,
        autoplay:true,
        autoplayTimeout:8000,
        autoplayHoverPause:true,
        responsive:{
            0:{
                items:1
            }
        }
    })       
    
}

/**
 * 
 * @param {*} dadosCategoria 
 */
const setarDadosCategorias = (dadosCategoria) => {
    const ESTILO_PRINCIPAL = "section .carrossel-filmes"
    const divPrincipal = document.querySelector(ESTILO_PRINCIPAL)
    divPrincipal.innerHTML = ''    
    for (let dados of dadosCategoria) {
        criarCategoria(divPrincipal, dados)
    }

    $('.carrossel-filmes .owl-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1000:{
                items:5
            },
            1500:{
                items:8
            },
            1900:{
                items:9
            }
        }
    })
}

/**
 * 
 * @param {*} divPrincipal 
 * @param {*} param1 
 */
const criarCategoria = (divPrincipal, {titulo, itens}) => {
    const novoDiv = document.createElement("div")
    novoDiv.className = "categoria-filme"    
    novoDiv.innerHTML = 
        `<h2>${titulo}</h2>        
        <div class="owl-carousel owl-theme">
            ${criarItensCategoria(itens)}           
        </div>`

    divPrincipal.appendChild(novoDiv)
}

/**
 * 
 * @param {*} itens 
 * @returns 
 */
const criarItensCategoria = (itens) => {
    let linhas = []
    for (let dadosItem of itens) {
        linhas.push(criarItemCategoria(dadosItem))
    }    
    return linhas.join()
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const criarItemCategoria = ( {titulo, descricao, img, url, urlTarget }) =>{
    const mainDiv = `<div class="item"><img src="${img}" alt="${titulo}"></div>`
    const mtarget = urlTarget ? ` target="${urlTarget}" ` : ''
    const ret = url ? `<a href="${url}" ${mtarget}>${mainDiv}</a>` : mainDiv    
    return  ret
}


/**
 * 
 * @param {*} mainCarousel 
 * @param {*} param1 
 */
const criarItemPrincipal = (mainCarousel, {titulo, descricao, img, url, urlTarget, ocultarBtnAssistir}) => {        
    const novoDiv = document.createElement("div")
    const ocultar = ocultarBtnAssistir ? 'style="display:none"' : ''
    novoDiv.className = "filme-principal item"
    novoDiv.style.backgroundImage = `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)100%), url('${img}')`
    
    const mtarget = urlTarget ? urlTarget : '_blank'
    const onclick = url ? `onclick="window.open('${url}', '${mtarget}')"` : ''    

    novoDiv.innerHTML = 
        `<div class="container">
                <h3 class="titulo">${titulo}</h3>
                <p class="descricao">${descricao}</p>
                <div class="botoes">
                    <button role="button" onclick="alert(1)" ${ocultar} >
                        <i class="fas fa-play"></i>
                        ASSISTIR AGORA
                    </button>
                    <button role="button" ${onclick}>
                        <i class="fas fa-info-circle"></i>
                        MAIS INFORMACOES
                    </button>
                    </div>
            </div>`
    mainCarousel.appendChild(novoDiv)

}

