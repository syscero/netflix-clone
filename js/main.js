// service.js precisa estar declarado antes de main.js no html
const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ICON_PLAY =
    '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>'
const ICON_INFO =
    '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'

/**
 * Escapa texto para inserção segura em HTML.
 * @param {*} value
 * @returns {string}
 */
const escapeHtml = (value) => {
    if (value == null) return ''
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

/**
 * Escapa valor para uso em atributo HTML entre aspas duplas.
 * @param {*} value
 * @returns {string}
 */
const escapeAttr = (value) => escapeHtml(value)

/**
 * Aceita apenas http(s) absoluto ou path relativo local (./ ou /).
 * Bloqueia javascript:, data:, etc.
 * @param {*} raw
 * @returns {string|null}
 */
const sanitizeUrl = (raw) => {
    if (raw == null || raw === '') return null
    const value = String(raw).trim()
    if (!value) return null

    if (value.startsWith('./') || value.startsWith('/')) {
        if (value.includes('://') || value.toLowerCase().includes('javascript:')) {
            return null
        }
        return value
    }

    try {
        const parsed = new URL(value, window.location.origin)
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return parsed.href
        }
    } catch (_) {
        return null
    }
    return null
}

/**
 * Targets de link permitidos.
 * @param {*} raw
 * @returns {string}
 */
const sanitizeTarget = (raw) => {
    const allowed = new Set(['_blank', '_self', '_parent', '_top'])
    const value = String(raw || '').trim()
    return allowed.has(value) ? value : '_blank'
}

/**
 * Valor seguro para CSS url('...').
 * @param {*} raw
 * @returns {string|null}
 */
const sanitizeCssUrl = (raw) => {
    const url = sanitizeUrl(raw)
    if (!url) return null
    if (/["')\\\s]/.test(url)) return null
    return url
}

const init = () => {
    const perfil = initPerfil()
    const arquivo = ['dados', 'piadas', 'livros']
    const url = perfil ? `/json/${arquivo[perfil]}.json` : '/json/dados.json'
    buscarDados((dados) => {
        setarDadosApp(dados, perfil)
        document.body.classList.remove('is-loading')
        document.querySelector('main')?.setAttribute('aria-busy', 'false')
        document.querySelector('section')?.setAttribute('aria-busy', 'false')
    }, url)
}

const initPerfil = () => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())

    if (params['hero'] || params['handicapped']) {
        const options = document.querySelector('header select')
        const idx = params['hero'] ? 2 : 1
        options[idx].selected = true
        return idx
    }

    return 0
}

const setarDadosApp = (data, perfil) => {
    setarDadosPrincipal(data.principal, perfil)
    setarDadosCategorias(data.categorias)
}

/**
 * @param {*} dadosPrincipal
 * @param {*} perfil
 */
const setarDadosPrincipal = (dadosPrincipal, perfil) => {
    const ESTILO_CAROUSEL_MAIN = '.main .owl-carousel'
    const mainCarousel = document.querySelector(ESTILO_CAROUSEL_MAIN)
    mainCarousel.innerHTML = ''

    for (let dados of dadosPrincipal) {
        criarItemPrincipal(perfil, mainCarousel, dados)
    }

    const $carousel = $(ESTILO_CAROUSEL_MAIN)
    if ($carousel.hasClass('owl-loaded')) {
        $carousel.trigger('destroy.owl.carousel')
        $carousel.removeClass('owl-loaded owl-hidden')
        $carousel.find('.owl-stage-outer').children().unwrap()
    }

    $carousel.owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        autoplay: !prefersReducedMotion(),
        autoplayTimeout: 8000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            }
        }
    })
}

/**
 * @param {*} dadosCategoria
 */
const setarDadosCategorias = (dadosCategoria) => {
    const ESTILO_PRINCIPAL = 'section .carrossel-filmes'
    const divPrincipal = document.querySelector(ESTILO_PRINCIPAL)
    divPrincipal.innerHTML = ''
    for (let dados of dadosCategoria) {
        criarCategoria(divPrincipal, dados)
    }

    $('.carrossel-filmes .owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            600: {
                items: 3
            },
            800: {
                items: 4
            },
            1000: {
                items: 5
            },
            1200: {
                items: 6
            },
            1600: {
                items: 7
            },
            2000: {
                items: 8
            }
        }
    })
}

/**
 * @param {*} divPrincipal
 * @param {*} param1
 */
const criarCategoria = (divPrincipal, { titulo, itens }) => {
    const novoDiv = document.createElement('div')
    novoDiv.className = 'categoria-filme'
    novoDiv.innerHTML = `<h2>${escapeHtml(titulo)}</h2>
        <div class="owl-carousel owl-theme">
            ${criarItensCategoria(itens)}
        </div>`

    divPrincipal.appendChild(novoDiv)
}

/**
 * @param {*} itens
 * @returns
 */
const criarItensCategoria = (itens) => {
    let linhas = []
    for (let dadosItem of itens) {
        linhas.push(criarItemCategoria(dadosItem))
    }
    return linhas.join('')
}

/**
 * @param {*} param0
 * @returns
 */
const criarItemCategoria = ({ titulo, descricao, img, url, urlTarget }) => {
    const safeTitulo = escapeHtml(titulo)
    const safeImg = sanitizeUrl(img)
    const safeUrl = sanitizeUrl(url)
    const resumo = descricao ? escapeHtml(truncarSeMaior(descricao, 110)) : ''
    const overlay = `<div class="banner-overlay">
            <span class="banner-titulo">${safeTitulo}</span>
            ${resumo ? `<span class="banner-descricao">${resumo}</span>` : ''}
        </div>`
    const imgTag = safeImg
        ? `<img src="${escapeAttr(safeImg)}" alt="${escapeAttr(titulo)}" loading="lazy" width="300" height="450">`
        : `<div class="banner-placeholder" role="img" aria-label="${escapeAttr(titulo || 'Sem imagem')}"></div>`
    const mainDiv = `<div class="item banner">
            ${imgTag}
            ${overlay}
        </div>`
    if (!safeUrl) return mainDiv
    const target = sanitizeTarget(urlTarget)
    const targetAttr =
        target === '_blank'
            ? `target="${target}" rel="noopener noreferrer"`
            : `target="${target}"`
    return `<a href="${escapeAttr(safeUrl)}" ${targetAttr}>${mainDiv}</a>`
}

/**
 * @param {HTMLElement} button
 * @param {string} url
 * @param {string} target
 */
const bindOpenUrl = (button, url, target) => {
    button.addEventListener('click', () => {
        const win = window.open(url, target)
        if (win) win.opener = null
    })
}

/**
 * @param {*} perfilUsuario
 * @param {*} mainCarousel
 * @param {*} param1
 */
const criarItemPrincipal = (
    perfilUsuario,
    mainCarousel,
    { titulo, descricao, img, url, urlTarget, ocultarBtnAssistir }
) => {
    const novoDiv = document.createElement('div')
    const safeUrl = sanitizeUrl(url)
    const target = sanitizeTarget(urlTarget)
    const cssImg = sanitizeCssUrl(img)

    novoDiv.className = 'filme-principal item'
    if (perfilUsuario == 2) {
        novoDiv.classList.add('perfil-livros')
    }
    if (cssImg) {
        novoDiv.style.setProperty('--hero-image', `url('${cssImg}')`)
    }

    const mostrarAssistir = !ocultarBtnAssistir && safeUrl
    const assistirBtn = mostrarAssistir
        ? `<button type="button" data-action="open-url">
                ${ICON_PLAY}
                ASSISTIR AGORA
            </button>`
        : ocultarBtnAssistir
          ? ''
          : `<button type="button" disabled title="Sem link de reprodução para este título">
                ${ICON_PLAY}
                ASSISTIR AGORA
            </button>`

    const infoBtn = safeUrl
        ? `<button type="button" data-action="open-url">
                ${ICON_INFO}
                MAIS INFORMAÇÕES
            </button>`
        : `<button type="button" disabled title="Sem informações adicionais">
                ${ICON_INFO}
                MAIS INFORMAÇÕES
            </button>`

    novoDiv.innerHTML = `<div class="container">
                <h3 class="titulo">${escapeHtml(titulo)}</h3>
                <p class="descricao">${escapeHtml(truncarSeMaior(descricao, 200))}</p>
                <div class="botoes">
                    ${assistirBtn}
                    ${infoBtn}
                </div>
            </div>`

    if (safeUrl) {
        novoDiv.querySelectorAll('button[data-action="open-url"]').forEach((btn) => {
            bindOpenUrl(btn, safeUrl, target)
        })
    }

    mainCarousel.appendChild(novoDiv)
}

const truncarSeMaior = (str, n) =>
    !str ? '' : str.length > n ? str.substr(0, n - 1) + '…' : str
