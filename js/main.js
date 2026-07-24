// service.js precisa estar declarado antes de main.js no html
const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ICON_PLAY =
    '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>'
const ICON_INFO =
    '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'

let categoriaIdSeq = 0

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

/**
 * Anuncia mensagem para leitores de tela.
 * @param {string} message
 */
const announceStatus = (message) => {
    const el = document.getElementById('status-carregamento')
    if (!el) return
    el.textContent = ''
    // Força reanúncio em alguns leitores
    window.setTimeout(() => {
        el.textContent = message
    }, 50)
}

/**
 * Define aria-hidden e tabindex em slides Owl (ativos vs clones/inativos).
 * @param {JQuery} $carousel
 */
const syncCarouselSlideA11y = ($carousel) => {
    const root = $carousel[0]
    if (!root) return

    root.querySelectorAll('.owl-item').forEach((item) => {
        const isActive = item.classList.contains('active')
        const isCloned = item.classList.contains('cloned')
        const hide = !isActive || isCloned
        item.setAttribute('aria-hidden', hide ? 'true' : 'false')
        if ('inert' in item) {
            item.inert = hide
        }
        item.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((el) => {
            if (hide) {
                if (!el.hasAttribute('data-a11y-tabindex')) {
                    el.setAttribute('data-a11y-tabindex', el.getAttribute('tabindex') ?? '')
                }
                el.setAttribute('tabindex', '-1')
            } else {
                const prev = el.getAttribute('data-a11y-tabindex')
                if (prev === null) return
                if (prev === '') el.removeAttribute('tabindex')
                else el.setAttribute('tabindex', prev)
                el.removeAttribute('data-a11y-tabindex')
            }
        })
    })
}

/**
 * Nomeia setas e dots do Owl.
 * @param {JQuery} $carousel
 * @param {string} contextLabel
 * @param {{ labelDots?: boolean }} [options]
 */
const enhanceOwlControls = ($carousel, contextLabel, options = {}) => {
    const root = $carousel[0]
    if (!root) return
    const prev = root.querySelector('.owl-prev')
    const next = root.querySelector('.owl-next')
    if (prev) {
        prev.setAttribute('type', 'button')
        prev.setAttribute('aria-label', `Anterior: ${contextLabel}`)
    }
    if (next) {
        next.setAttribute('type', 'button')
        next.setAttribute('aria-label', `Próximo: ${contextLabel}`)
    }

    if (options.labelDots) {
        root.querySelectorAll('.owl-dot').forEach((dot, index) => {
            dot.setAttribute('type', 'button')
            dot.setAttribute('aria-label', `Ir para destaque ${index + 1}`)
        })
    }
}

/**
 * Botão pausar/retomar autoplay do hero.
 * @param {JQuery} $carousel
 */
const setupHeroAutoplayToggle = ($carousel) => {
    const wrap = document.querySelector('.hero-carousel-wrap')
    if (!wrap) return

    const existing = wrap.querySelector('.hero-autoplay-toggle')
    if (existing) existing.remove()

    if (prefersReducedMotion()) return

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'hero-autoplay-toggle'
    btn.setAttribute('aria-pressed', 'false')
    btn.textContent = 'Pausar rotação'

    let paused = false
    btn.addEventListener('click', () => {
        paused = !paused
        if (paused) {
            $carousel.trigger('stop.owl.autoplay')
            btn.textContent = 'Retomar rotação'
            btn.setAttribute('aria-pressed', 'true')
        } else {
            $carousel.trigger('play.owl.autoplay', [8000])
            btn.textContent = 'Pausar rotação'
            btn.setAttribute('aria-pressed', 'false')
        }
    })

    wrap.appendChild(btn)
}

const init = () => {
    announceStatus('Carregando catálogo')
    const perfil = initPerfil()
    const arquivo = ['dados', 'piadas', 'livros']
    const url = perfil ? `/json/${arquivo[perfil]}.json` : '/json/dados.json'
    buscarDados((dados) => {
        setarDadosApp(dados, perfil)
        document.body.classList.remove('is-loading')
        document.querySelector('main')?.setAttribute('aria-busy', 'false')
        document.getElementById('catalogo-categorias')?.setAttribute('aria-busy', 'false')
        announceStatus('Catálogo carregado')
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
    mainCarousel.setAttribute('aria-label', 'Destaques')
    mainCarousel.setAttribute('aria-roledescription', 'carrossel')

    for (let dados of dadosPrincipal) {
        criarItemPrincipal(perfil, mainCarousel, dados)
    }

    const $carousel = $(ESTILO_CAROUSEL_MAIN)
    if ($carousel.hasClass('owl-loaded')) {
        $carousel.trigger('destroy.owl.carousel')
        $carousel.removeClass('owl-loaded owl-hidden')
        $carousel.find('.owl-stage-outer').children().unwrap()
    }

    $carousel.off('.a11y')
    $carousel.on('initialized.owl.carousel.a11y changed.owl.carousel.a11y', () => {
        syncCarouselSlideA11y($carousel)
        enhanceOwlControls($carousel, 'destaques', { labelDots: true })
    })

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

    syncCarouselSlideA11y($carousel)
    enhanceOwlControls($carousel, 'destaques', { labelDots: true })
    setupHeroAutoplayToggle($carousel)
}

/**
 * @param {*} dadosCategoria
 */
const setarDadosCategorias = (dadosCategoria) => {
    const ESTILO_PRINCIPAL = 'section .carrossel-filmes'
    const divPrincipal = document.querySelector(ESTILO_PRINCIPAL)
    divPrincipal.innerHTML = ''
    categoriaIdSeq = 0
    for (let dados of dadosCategoria) {
        criarCategoria(divPrincipal, dados)
    }

    document.querySelectorAll('.carrossel-filmes .categoria-filme').forEach((cat) => {
        const titulo = cat.querySelector('h2')?.textContent?.trim() || 'categoria'
        const $carousel = $(cat).find('.owl-carousel')
        $carousel.off('.a11y')
        $carousel.on('initialized.owl.carousel.a11y changed.owl.carousel.a11y', () => {
            syncCarouselSlideA11y($carousel)
            enhanceOwlControls($carousel, titulo)
        })
    })

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

    document.querySelectorAll('.carrossel-filmes .categoria-filme').forEach((cat) => {
        const titulo = cat.querySelector('h2')?.textContent?.trim() || 'categoria'
        const $carousel = $(cat).find('.owl-carousel')
        syncCarouselSlideA11y($carousel)
        enhanceOwlControls($carousel, titulo)
    })
}

/**
 * @param {*} divPrincipal
 * @param {*} param1
 */
const criarCategoria = (divPrincipal, { titulo, itens }) => {
    const novoDiv = document.createElement('section')
    const headingId = `categoria-titulo-${++categoriaIdSeq}`
    novoDiv.className = 'categoria-filme'
    novoDiv.setAttribute('role', 'region')
    novoDiv.setAttribute('aria-labelledby', headingId)
    novoDiv.innerHTML = `<h2 id="${headingId}">${escapeHtml(titulo)}</h2>
        <div class="owl-carousel owl-theme" aria-label="${escapeAttr(titulo)}" aria-roledescription="carrossel">
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
    const overlay = `<div class="banner-overlay" aria-hidden="true">
            <span class="banner-titulo">${safeTitulo}</span>
            ${resumo ? `<span class="banner-descricao">${resumo}</span>` : ''}
        </div>`

    if (safeUrl) {
        const imgTag = safeImg
            ? `<img src="${escapeAttr(safeImg)}" alt="" loading="lazy" width="300" height="450">`
            : `<div class="banner-placeholder" aria-hidden="true"></div>`
        const mainDiv = `<div class="item banner">
            ${imgTag}
            ${overlay}
        </div>`
        const target = sanitizeTarget(urlTarget)
        const targetAttr =
            target === '_blank'
                ? `target="${target}" rel="noopener noreferrer"`
                : `target="${target}"`
        const label = resumo
            ? `${escapeAttr(titulo)}. ${escapeAttr(truncarSeMaior(descricao, 80))}`
            : escapeAttr(titulo || 'Título')
        return `<a href="${escapeAttr(safeUrl)}" ${targetAttr} aria-label="${label}">${mainDiv}</a>`
    }

    const imgTag = safeImg
        ? `<img src="${escapeAttr(safeImg)}" alt="${escapeAttr(titulo || 'Sem título')}" loading="lazy" width="300" height="450">`
        : `<div class="banner-placeholder" role="img" aria-label="${escapeAttr(titulo || 'Sem imagem')}"></div>`
    return `<div class="item banner">
            ${imgTag}
            ${overlay}
        </div>`
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
    const nome = titulo || 'este título'

    novoDiv.className = 'filme-principal item'
    if (perfilUsuario == 2) {
        novoDiv.classList.add('perfil-livros')
    }
    if (cssImg) {
        novoDiv.style.setProperty('--hero-image', `url('${cssImg}')`)
    }

    const mostrarAssistir = !ocultarBtnAssistir && safeUrl
    const assistirBtn = mostrarAssistir
        ? `<button type="button" data-action="open-url" aria-label="Assistir ${escapeAttr(nome)}">
                ${ICON_PLAY}
                ASSISTIR AGORA
            </button>`
        : ocultarBtnAssistir
          ? ''
          : `<button type="button" disabled title="Sem link de reprodução para este título" aria-label="Assistir ${escapeAttr(nome)} (indisponível)">
                ${ICON_PLAY}
                ASSISTIR AGORA
            </button>`

    const infoBtn = safeUrl
        ? `<button type="button" data-action="open-url" aria-label="Mais informações sobre ${escapeAttr(nome)}">
                ${ICON_INFO}
                MAIS INFORMAÇÕES
            </button>`
        : `<button type="button" disabled title="Sem informações adicionais" aria-label="Mais informações sobre ${escapeAttr(nome)} (indisponível)">
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
