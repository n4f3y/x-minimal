// ==UserScript==
// @name         x-minimal
// @namespace    local.x-minimal
// @version      1
// @description  userscript for a serene x.com experience
// @match        https://x.com/*
// @match        https://www.x.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        window.onurlchange
// @noframes
// ==/UserScript==

(() => {
  'use strict'

  const primary = '[data-testid="primaryColumn"]'
  const tweet = '[data-testid="tweet"]'
  const nav = ':is(header, [role="banner"]) nav'
  const compose = '[data-testid="SideNav_NewTweet_Button"]'
  const account = '[data-testid="SideNav_AccountSwitcher_Button"]'
  const font = 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  const postTools = ':is([data-testid="caret"], [data-testid^="grok" i], button[aria-label="More" i][aria-haspopup="menu"], button[aria-label*="grok actions" i], button[aria-label^="ask grok" i])'
  const cell = '[data-testid="cellInnerDiv"]'
  const avatar = '[data-testid^="UserAvatar-Container"]'
  const tabs = '[role="tablist"]:not([data-testid="toolBar" i] *)'
  const feedContent = `${tabs}, ${tweet}, [data-testid="cellInnerDiv"], [role="feed"], [role="region"][aria-label^="Timeline:" i]`
  const composerContainer = '[data-testid="inlineComposer"], [data-testid="tweetComposer"], form'
  const composerParts = ':is([data-testid="tweetTextarea_0"], [data-testid="tweetButtonInline"], [data-testid="toolBar" i], [data-testid="fileInput"], .DraftEditor-root, [contenteditable="true"][role="textbox"])'
  const metadataRow = ':has(> a[href$="/analytics"]):has(> div > a > time, > a > time)'
  const postMetadata = `html[data-xmin-post] ${primary} ${metadataRow}`
  const replyComposer = `html[data-xmin-post] ${primary} [data-testid="inline_reply_offscreen"]`
  const replyPlaceholder = '.public-DraftEditorPlaceholder-inner'

  GM_addStyle(`
    :root { --xmin-label-size: 14px; --xmin-label-opacity: .8 }
    html:not([data-xmin-chat]) [data-testid="sidebarColumn"],
    html:not([data-xmin-chat]) :is([data-testid="chat-drawer-root"], [data-testid="xchatEmbedDrawer"]),
    [data-testid="GrokDrawer"], ${tweet} ${postTools},
    html[data-xmin-post] ${primary} ${postTools} { display: none !important }
    [data-xmin-tab-header] { position: relative !important; inset: auto !important; backdrop-filter: none !important }
    [data-xmin-duplicate-rule], [role="tooltip"], [data-testid="HoverLabel"] { display: none !important }
    html:not([data-xmin-chat]) ${primary} { border-inline-width: 0 !important }
    html[data-xmin-home] [data-xmin-composer] { display: none !important }

    html:not([data-xmin-chat]) :is([data-xmin-rail] ${account}, [data-xmin-logo], [data-xmin-rail] [data-testid="AppTabBar_More_Menu"]) { display: none !important }
    html:not([data-xmin-chat]) :is([data-xmin-frame], [data-xmin-content], [data-xmin-lane], :where(${primary}[data-xmin-content] > div, ${primary}[data-xmin-content] ${cell})) {
      box-sizing: border-box !important;
      width: 100% !important;
      min-width: 0 !important;
      max-width: none !important;
      margin-inline: 0 !important;
    }
    html:not([data-xmin-chat]) [data-xmin-shell] {
      box-sizing: border-box !important;
      --xmin-visible-gap: 12%;
      --xmin-gap: max(0%, calc(var(--xmin-visible-gap) - var(--xmin-post-inset, 0%)));
      --xmin-nav: var(--xmin-nav-width, 12%);
      --xmin-feed: var(--xmin-reading-width, calc(100% - var(--xmin-nav) - var(--xmin-gap)));
      width: calc(88.5% - var(--xmin-right, 14.5%)) !important;
      max-width: none !important;
      margin-inline: 11.5% auto !important;
      display: grid !important;
      grid-template-columns: var(--xmin-nav) clamp(2%, calc(100% - var(--xmin-nav) - var(--xmin-feed)), var(--xmin-gap)) var(--xmin-feed) !important;
      align-items: stretch !important;
    }
    html:not([data-xmin-chat]) [data-xmin-rail] { grid-column: 1; grid-row: 1 }
    html:not([data-xmin-chat]) [data-xmin-main] { grid-column: 3; grid-row: 1 }
    html:not([data-xmin-chat]) [data-xmin-rail],
    html:not([data-xmin-chat]) [data-xmin-dock] {
      box-sizing: border-box !important;
      width: 100% !important;
      min-width: 0 !important;
      max-width: none !important;
      align-items: start !important;
      margin-inline: 0 !important;
      padding-inline: 0 !important;
    }
    html:not([data-xmin-chat]) [data-xmin-dock="fixed"] {
      width: max-content !important;
      inset-inline: auto !important;
    }
    html:not([data-xmin-chat]) [data-xmin-nav] {
      width: max-content !important;
      min-width: 0 !important;
      display: grid !important;
      grid-template-columns: max-content max-content !important;
      grid-auto-rows: 2.2em !important;
      gap: 0 !important;
      margin: 0 !important;
      padding: var(--xmin-nav-top, 0%) 0 0 !important;
      font: 400 var(--xmin-label-size)/1.4 ${font} !important;
    }
    html:not([data-xmin-chat]) [data-xmin-nav] > :not([data-xmin-label]),
    html:not([data-xmin-chat]) [data-xmin-write-source] { display: none !important }
    html:not([data-xmin-chat]) [data-xmin-nav] > [data-xmin-label] {
      box-sizing: border-box !important;
      display: grid !important;
      grid-column: 1 / -1;
      grid-template-columns: subgrid;
      grid-template-rows: 100%;
      grid-auto-rows: 0;
      align-items: center !important;
      align-self: stretch !important;
      width: auto !important;
      min-width: 0 !important;
      height: 100% !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      background: transparent !important;
      color: inherit;
      font-size: 0 !important;
      line-height: 0 !important;
      text-decoration: none;
    }
    html:not([data-xmin-chat]) [data-xmin-nav] > [data-xmin-label] > :not([data-xmin-text]) { display: none !important }
    html:not([data-xmin-chat]) [data-xmin-text] { grid-area: 1 / 1; font: 400 var(--xmin-label-size)/1 ${font} }
    html:not([data-xmin-chat]) [data-xmin-text="label"] { opacity: var(--xmin-label-opacity) }
    html:not([data-xmin-chat]) [data-xmin-text="hint"]:not(:empty) { grid-column: 2; margin-inline-start: .6em; opacity: .6 }
    html:not([data-xmin-chat]) [data-xmin-nav] > [data-xmin-label]:hover,
    html:not([data-xmin-chat]) [data-xmin-nav] [data-xmin-text] { text-decoration: none !important }
    html[data-xmin-chat] [data-xmin-link] { display: none !important }

    ${postMetadata} {
      display: flex !important;
      flex-flow: row wrap !important;
      align-items: baseline !important;
      gap: 0 6px !important;
    }
    ${postMetadata} { opacity: var(--xmin-label-opacity) }
    ${postMetadata} > * { margin-inline: 0 !important; padding-inline: 0 !important }
    html[data-xmin-post] ${primary} div:has(> div > div > div > a[href$="/analytics"]):has(> div > div > div time) { margin-block: 6px 3px !important }
    html[data-xmin-post] [data-xmin-detail-counts] {
      height: auto !important;
      min-height: 0 !important;
      padding: 2px 0 6px !important;
    }
    ${postMetadata}, ${postMetadata} * { color: var(--xmin-nav-color, revert-layer) !important; text-transform: lowercase !important }
    ${postMetadata} time { text-transform: none !important }
    ${postMetadata}, ${postMetadata} *, [data-xmin-counts], [data-xmin-counts] [data-xmin-count],
    [data-xmin-counts] [data-xmin-count]::after, ${replyComposer} ${replyPlaceholder} {
      font: 400 var(--xmin-label-size)/20px ${font} !important;
    }
    ${replyComposer}:not(:focus-within):has(${replyPlaceholder}) :is(.DraftEditor-root, .DraftEditor-editorContainer, [data-testid="tweetTextarea_0RichTextInputContainer"], [data-testid="tweetTextarea_0"]) {
      font: 400 var(--xmin-label-size)/20px ${font} !important;
      min-height: 20px !important;
    }

    [data-xmin-counts] {
      display: flex !important;
      align-items: baseline !important;
      justify-content: flex-start !important;
      flex-wrap: wrap !important;
      gap: 0 6px !important;
    }
    [data-xmin-counts] > :not([data-xmin-slot]), [data-xmin-counts] [data-xmin-count]:not([data-xmin-count="share"]) > * { display: none !important }
    /* X uses the native icon wrapper to position the share menu. */
    [data-xmin-counts] [data-xmin-count="share"] > * {
      display: flex !important;
      position: absolute !important;
      inset: 0;
      opacity: 0 !important;
      pointer-events: none;
    }
    [data-xmin-counts] > [data-xmin-slot] {
      display: inline-flex !important;
      flex: 0 0 auto !important;
      flex-direction: row !important;
      align-items: baseline !important;
      width: auto !important;
      min-width: 0 !important;
      margin: 0 !important;
    }
    [data-xmin-slot="like"] { order: -3 }
    [data-xmin-slot="repost"] { order: -2 }
    [data-xmin-slot="reply"] { order: -1 }
    [data-xmin-slot="share"] { order: 1 }
    [data-xmin-counts] > :is([data-xmin-slot="repost"], [data-xmin-slot="reply"], [data-xmin-slot="save"], [data-xmin-slot="share"])::before { content: "·"; opacity: .55; margin-inline-end: 6px }
    [data-xmin-counts] [data-xmin-count] {
      display: inline-flex !important;
      align-items: baseline !important;
      min-height: 24px !important;
      padding: 0 !important;
      background: transparent !important;
      position: relative !important;
      white-space: nowrap;
    }
    [data-xmin-slot="like"] [data-xmin-count]::before { content: ""; position: absolute; inset: -2px; cursor: pointer }
    [data-xmin-slot="like"] [data-testid="unlike"]::after { color: rgb(249, 24, 128); opacity: 1 !important }
    [data-xmin-fallback-save] button { border: 0; margin: 0; color: inherit; cursor: pointer }
    [data-xmin-counts] [data-xmin-count]::after { content: attr(data-xmin-count); opacity: var(--xmin-label-opacity) }
    html :is(:hover, a:hover *, button:hover *, [role="link"]:hover *),
    html :hover::before, html :hover::after { text-decoration-line: none !important }
    [data-xmin-counts] [data-xmin-count]:focus-visible { outline: 2px solid currentColor; outline-offset: 2px }
  `)

  const nativeLinks = [
    ['home', 'a[href="/home"]'], ['explore', 'a[href="/explore"]'],
    ['notifications', 'a[href^="/notifications"]'], ['chat', 'a:is([href="/i/chat"], [href="/messages"])'],
    ['profile', 'a:is([data-testid="AppTabBar_Profile_Link"], [aria-label="Profile" i])']
  ]
  const customLinks = [
    ['bookmarks', '/i/history', 4], ['likes', '/i/history/likes', 5],
    ['write', '/compose/post', 7], ['search', '/explore', 8]
  ]
  const kinds = {
    like: 'like', unlike: 'like', reply: 'reply',
    retweet: 'repost', unretweet: 'repost', repost: 'repost', unrepost: 'repost',
    bookmark: 'save', removeBookmark: 'save', share: 'share', shareButton: 'share'
  }
  const countPatterns = { like: /([\d,.]+(?:\s*[KMB])?)\s+likes?\b/i, repost: /([\d,.]+(?:\s*[KMB])?)\s+(?:reposts?|retweets?)\b/i, reply: /([\d,.]+(?:\s*[KMB])?)\s+repl(?:y|ies)\b/i }
  const control = 'button, [role="button"]'
  const group = '[role="group"]'
  const formatter = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
  const pendingGroups = new Set()
  let layout = []
  let scheduled = false
  let searchDeadline = 0
  let tabHeader
  let tabPath
  let duplicateRule
  const layoutSize = new ResizeObserver(schedule_page_update)

  // Firefox changes screen.width as well as innerWidth during full-page zoom.
  // Keep one reference per tab so zoom cannot accidentally select a new baseline.
  let density = devicePixelRatio || 1
  let reference = [density, screen.availWidth]
  try {
    const saved = JSON.parse(sessionStorage.getItem('xmin-zoom-reference'))
    if (Array.isArray(saved) && saved.length === 2 && saved.every(n => Number.isFinite(n) && n > 0)) reference = saved
    else sessionStorage.setItem('xmin-zoom-reference', JSON.stringify(reference))
  } catch {}
  let zoomScale = 1
  let readingPosition, zoomFrame, zoomUntil

  function remember_reading_position() {
    if (zoomUntil || (devicePixelRatio || 1) !== density || !layout[1]) return
    const y = window.scrollY
    const post = y > 0 && [...layout[1].querySelectorAll(tweet)].find(el => el.getBoundingClientRect().bottom > 0)
    const rect = post && post.getBoundingClientRect()
    readingPosition = { path: location.pathname, y, post,
      href: post && post.querySelector('a:has(time)')?.getAttribute('href'),
      fraction: rect?.height ? Math.max(0, -rect.top / rect.height) : 0,
      above: rect ? Math.max(0, rect.top / innerHeight) : 0 }
  }

  function finish_zoom() {
    cancelAnimationFrame(zoomFrame)
    zoomUntil = 0
    remember_reading_position()
  }

  function restore_reading_position() {
    const pos = readingPosition
    if (!pos || pos.path !== location.pathname || performance.now() >= zoomUntil) return finish_zoom()
    let post = pos.post
    if (pos.href && (!post?.isConnected || post.querySelector('a:has(time)')?.getAttribute('href') !== pos.href)) {
      post = layout[1]?.querySelector(`a[href="${CSS.escape(pos.href)}"]:has(time)`)?.closest(tweet)
    }
    const r = post?.isConnected && post.getBoundingClientRect()
    const delta = r?.height ? r.top + pos.fraction * r.height - pos.above * innerHeight : pos.y - scrollY
    if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: 'instant' })
    zoomFrame = requestAnimationFrame(restore_reading_position)
  }

  function update_viewport_proportions() {
    const next = devicePixelRatio || 1
    const zoomChanged = next !== density
    density = next
    zoomScale = density / reference[0]
    const right = Math.max(8.5, Math.min(14.5, 88.5 - 74 * reference[1] / (innerWidth * zoomScale)))
    const root = document.documentElement
    if (!root) return
    root.style.setProperty('--xmin-right', `${right}%`)
    root.style.setProperty('--xmin-scale', zoomScale)
    if (zoomChanged && readingPosition && !root.hasAttribute('data-xmin-chat')) {
      cancelAnimationFrame(zoomFrame)
      zoomUntil = performance.now() + 800
      zoomFrame = requestAnimationFrame(restore_reading_position)
    }
  }

  function mark_layout_paths(navigation, column) {
    const header = navigation?.closest('header, [role="banner"]')
    if (!header || !column || (layout[0] === header && layout[1] === column && layout[2] === navigation)) return
    let shell = column.parentElement
    while (shell && !shell.contains(header)) shell = shell.parentElement
    if (!shell?.closest('#react-root') || header.contains(column)) return
    layoutSize.disconnect()
    layoutSize.observe(shell)
    layoutSize.observe(navigation)
    layout = [header, column, navigation]
    shell.setAttribute('data-xmin-shell', '')
    for (let el = shell.parentElement; el?.closest('#react-root'); el = el.parentElement) el.setAttribute('data-xmin-frame', '')
    for (let el = column; el !== shell; el = el.parentElement) {
      el.setAttribute('data-xmin-content', '')
      if (el.parentElement === shell) el.setAttribute('data-xmin-main', '')
    }
    let rail = header
    while (rail.parentElement !== shell) {
      rail.dataset.xminDock = getComputedStyle(rail).position === 'fixed' ? 'fixed' : ''
      rail = rail.parentElement
    }
    rail.setAttribute('data-xmin-rail', '')
    for (let el = navigation.parentElement; el !== header; el = el.parentElement) {
      if (!el.hasAttribute('data-xmin-dock')) el.dataset.xminDock = getComputedStyle(el).position === 'fixed' ? 'fixed' : ''
    }
  }

  function label_control(element, label) {
    if (element.dataset.xminLabel !== label) element.dataset.xminLabel = label
    if (!element.hasAttribute('aria-label')) element.setAttribute('aria-label', label)
    set_nav_text(element, 'label', label)
  }

  function set_nav_text(row, part, text) {
    let span = row.querySelector(`:scope > [data-xmin-text="${part}"]`)
    if (!span && text) {
      span = document.createElement('span')
      span.dataset.xminText = part
      if (part === 'hint') {
        span.setAttribute('aria-hidden', 'true')
      }
      row.append(span)
    }
    if (span && span.textContent !== text) span.textContent = text
  }

  function style_navigation(navigation, path) {
    if (!navigation) return
    const header = navigation.closest('header, [role="banner"]')
    navigation.setAttribute('data-xmin-nav', '')
    for (const [index, [label, selector]] of nativeLinks.entries()) {
      const row = navigation.querySelector(`:scope > ${selector}:not([data-xmin-link])`)
      if (!row) continue
      label_control(row, label)
      row.style.order = [0, 1, 2, 3, 6][index]
      if (index === 2 || index === 3) {
        const badge = row.querySelector('[aria-live], [data-testid*="badge" i]')
        const hint = (badge?.textContent.trim() || badge?.getAttribute('aria-label') || '').match(/\d+\+?/)?.[0] || ''
        set_nav_text(row, 'hint', hint)
      }
    }
    const logo = header.querySelector('a:has(svg):not(nav a):is([aria-label="X" i], [href="/"], [href="/home"])')
    if (logo) (logo.closest('h1, [role="heading"]') || logo).setAttribute('data-xmin-logo', '')
    header.querySelector(compose)?.setAttribute('data-xmin-write-source', '')
    for (const [label, href, order] of customLinks) {
      let link = navigation.querySelector(`[data-xmin-link="${label}"]`)
      if (!link) {
        link = document.createElement('a')
        link.href = href
        label_control(link, label)
        link.dataset.xminLink = label
        link.style.order = order
        if (label === 'write' || label === 'search') link.addEventListener('click', event => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
          if (label === 'write' ? open_native_composer() : open_native_search()) event.preventDefault()
        })
        navigation.append(link)
      }
      if (order <= 5 && path === href) link.setAttribute('aria-current', 'page')
      else link.removeAttribute('aria-current')
    }
  }

  function open_native_composer() {
    const button = document.querySelector(compose)
    if (!button) return false
    button.click()
    return true
  }

  function find_visible_search() {
    return [...document.querySelectorAll('input[data-testid="SearchBox_Search_Input"]')]
      .find(input => input.getClientRects().length && !input.disabled)
  }

  function open_native_search() {
    const input = find_visible_search()
    if (input) {
      input.focus()
      return true
    }
    const explore = document.querySelector(`${nav} > a[href="/explore"]:not([data-xmin-link])`)
    if (!explore) return false
    searchDeadline = Date.now() + 4000
    if (location.pathname !== '/explore') explore.click()
    schedule_page_update()
    return true
  }

  function mark_feed_width(node, column) {
    for (let el = node; el && el !== column && !el.hasAttribute('data-xmin-lane'); el = el.parentElement) {
      el.setAttribute('data-xmin-lane', '')
    }
  }

  function hide_home_composer(column) {
    for (const part of column?.querySelectorAll(composerParts) || []) {
      if (part.closest(`${feedContent}, [role="dialog"]`)) continue
      const form = part.closest(composerContainer)
      let wrapper = part
      while (wrapper.parentElement !== column && !wrapper.parentElement.querySelector(feedContent) &&
        (wrapper !== form || !wrapper.parentElement.querySelector('header, h1, h2'))) wrapper = wrapper.parentElement
      wrapper.setAttribute('data-xmin-composer', '')
    }
  }

  function format_post_timestamp() {
    const row = document.querySelector(postMetadata)
    const actions = row?.closest(tweet)?.querySelector(group + ':has([data-testid="reply"])')
    const previous = document.querySelector('[data-xmin-detail-counts]')
    if (previous !== actions) {
      previous?.removeAttribute('data-xmin-detail-counts')
      actions?.setAttribute('data-xmin-detail-counts', '')
    }
    const time = row?.querySelector('time')
    const text = time?.firstChild
    if (text?.nodeType !== Node.TEXT_NODE) return
    const parts = text.data.split('·').map(part => part.trim())
    if (parts.length !== 2) return
    const clock = parts.findIndex(part => /^\d{1,2}:\d{2}(?:\s*[ap]m)?$/i.test(part))
    if (clock === -1) return
    const label = `${parts[1 - clock]} · ${parts[clock].replace(/\s+/g, '').toLowerCase()}`
    if (text.data !== label) text.data = label
  }

  function find_tab_header(column, path) {
    let bar = [...column.querySelectorAll(tabs)].find(el => !el.closest(`${tweet}, [role="dialog"], [data-testid="cellInnerDiv"]`))
    if (!bar && path.startsWith('/i/history')) {
      const bookmarkTab = column.querySelector('a[href="/i/history"]')
      for (let el = bookmarkTab?.parentElement; el && el !== column && !el.querySelector(tweet); el = el.parentElement) {
        if (el.querySelector('a[href="/i/history/likes"]')) {
          bar = el
          break
        }
      }
    }
    if (!bar) return null
    let header = bar
    for (let el = bar; el && el !== column; el = el.parentElement) {
      if (el !== bar && (el.offsetHeight > bar.offsetHeight * 3 || el.querySelector(`${tweet}, [data-testid="cellInnerDiv"], [role="feed"], [data-testid="UserDescription"]`))) break
      const position = getComputedStyle(el).position
      if (position === 'sticky') return el
      header = el
    }
    return header
  }

  function unpin_tab_header(column, path) {
    if (tabPath === path && tabHeader?.isConnected && column?.contains(tabHeader)) return
    tabHeader?.removeAttribute('data-xmin-tab-header')
    tabHeader = column && find_tab_header(column, path)
    tabPath = path
    if (!tabHeader) return
    layoutSize.observe(tabHeader)
    tabHeader.setAttribute('data-xmin-tab-header', '')
    mark_feed_width(tabHeader, column)
  }

  function hide_duplicate_tab_rule(header) {
    if (!header || (duplicateRule?.isConnected && duplicateRule.parentElement === header.parentElement)) return
    duplicateRule?.removeAttribute('data-xmin-duplicate-rule')
    duplicateRule = null
    const rect = header.getBoundingClientRect()
    for (let el = header.querySelector(tabs); el && header.contains(el); el = el.parentElement) {
      const style = getComputedStyle(el)
      const stroke = parseFloat(style.borderBottomWidth)
      if (!stroke || el.getBoundingClientRect().width < rect.width * .99) continue
      for (let sibling = header.nextElementSibling; sibling; sibling = sibling.nextElementSibling) {
        const rule = sibling.getBoundingClientRect()
        if (!rule.height) continue
        if (!sibling.childNodes.length && rule.width >= rect.width * .99 &&
          Math.abs(rule.height - stroke) <= stroke * .25 && Math.abs(rule.top - rect.bottom) <= stroke * .25 &&
          getComputedStyle(sibling).backgroundColor === style.borderBottomColor) {
          sibling.setAttribute('data-xmin-duplicate-rule', '')
          duplicateRule = sibling
        }
        return
      }
    }
  }

  function apply_layout_percentages(navigation, column, path) {
    const shell = column?.closest('[data-xmin-shell]')
    if (!navigation || !shell || document.documentElement.hasAttribute('data-xmin-chat')) return
    const frame = shell.getBoundingClientRect()
    if (!frame.width) return
    const author = column.querySelector(`${cell} ${tweet} ${avatar}`)
    const inset = author && author.getBoundingClientRect().left - column.getBoundingClientRect().left
    if (inset != null && inset >= 0 && inset < frame.width * .1) shell.style.setProperty('--xmin-post-inset', `${100 * inset / frame.width}%`)
    const home = navigation.querySelector('[data-xmin-label="home"] > [data-xmin-text="label"]')
    if (!home) return
    if (path.includes('/status/')) column.style.setProperty('--xmin-nav-color', getComputedStyle(home).color)
    const nav = navigation.getBoundingClientRect()
    if (!nav.width) return
    shell.style.setProperty('--xmin-nav-width', `${100 * nav.width / frame.width}%`)
    // Give X's aspect-ratio boxes one stable CSS width. The browser magnifies the
    // entire post, including its native player and link preview, in a single pass.
    const gap = parseFloat(getComputedStyle(shell).getPropertyValue('--xmin-visible-gap')) / 100
    const width = frame.width * zoomScale * (1 - gap) - nav.width + (parseFloat(shell.style.getPropertyValue('--xmin-post-inset')) || 0) / 100 * frame.width
    shell.style.setProperty('--xmin-reading-width', `${width / parseFloat(getComputedStyle(document.documentElement).fontSize)}rem`)
    const label = home.getBoundingClientRect()
    const padding = parseFloat(getComputedStyle(navigation).paddingBlockStart) || 0
    const dock = navigation.closest('[data-xmin-dock="fixed"]')
    const top = dock ? nav.top : nav.top - frame.top
    const headerHeight = path === '/home' && tabHeader ? tabHeader.getBoundingClientRect().height : label.height * 4
    const offset = Math.max(0, headerHeight * 1.1 - top - (label.top - nav.top - padding))
    navigation.style.setProperty('--xmin-nav-top', `${offset / nav.width * 100}%`)
  }

  function format_post_count(button, kind) {
    const title = button.getAttribute('aria-label') || ''
    const value = (title.match(countPatterns[kind])?.[1] || button.textContent.trim()).replace(/[\s,]/g, '')
    const count = /^\d+$/u.test(value) ? formatter.format(Number(value)) :
      /^\d+(?:\.\d+)?[KMB]$/iu.test(value) ? value.toUpperCase() : '0'
    return `${count.toLowerCase()} ${count === '1' ? kind : kind === 'reply' ? 'replies' : `${kind}s`}`
  }

  // On narrow timelines X exposes bookmark through its B shortcut on the focused post.
  function add_narrow_save(row, slots) {
    let slot = row.querySelector(':scope > [data-xmin-fallback-save]')
    const post = row.closest(tweet)
    if (slots.has('save') || !post?.hasAttribute('tabindex')) {
      slot?.remove()
      return
    }
    if (!slot) {
      slot = document.createElement('div')
      slot.setAttribute('data-xmin-fallback-save', '')
      const button = document.createElement('button')
      button.type = 'button'
      button.setAttribute('aria-label', 'save post')
      button.addEventListener('click', event => {
        event.stopPropagation()
        post.focus({ preventScroll: true })
        if (document.activeElement !== post) return
        post.dispatchEvent(new KeyboardEvent('keypress', { key: 'b', code: 'KeyB', charCode: 98, keyCode: 98, which: 98, bubbles: true, cancelable: true }))
        button.focus({ preventScroll: true })
      })
      slot.append(button)
      row.append(slot)
    }
    slots.set('save', [slot, slot.firstElementChild, 'bookmark'])
  }

  function style_post_actions(row) {
    if (!row.isConnected || !(row.closest(tweet) || (location.pathname.includes('/status/') && row.closest(primary)))) return
    const slots = new Map()
    for (const button of row.querySelectorAll(control)) {
      if (button.closest(group) !== row) continue
      const id = button.dataset.testid
      const title = button.getAttribute('aria-label') || ''
      const kind = kinds[id] || (/^(?:remove )?bookmark\b/i.test(title) ? 'save' : /^share\b/i.test(title) ? 'share' : '')
      if (!kind || slots.has(kind)) continue
      let slot = button
      while (slot.parentElement !== row) slot = slot.parentElement
      slots.set(kind, [slot, button, id])
    }
    const countSlots = ['like', 'repost', 'reply'].map(kind => slots.get(kind)?.[0])
    if (countSlots.includes(undefined) || new Set(countSlots).size !== 3) {
      row.removeAttribute('data-xmin-counts')
      return
    }
    add_narrow_save(row, slots)
    row.setAttribute('data-xmin-counts', '')
    const usedSlots = new Set(countSlots)
    for (const [kind, [slot, button, id]] of slots) {
      if (!countSlots.includes(slot)) usedSlots.add(slot)
      else if (kind === 'save') continue
      slot.dataset.xminSlot = kind
      const label = kind === 'share' ? 'share' : kind === 'save' ? (id === 'removeBookmark' || /^remove /i.test(button.getAttribute('aria-label') || '') ? 'saved' : 'save') : format_post_count(button, kind)
      if (button.dataset.xminCount !== label) button.dataset.xminCount = label
    }
    for (const slot of row.children) if (!usedSlots.has(slot)) slot.removeAttribute('data-xmin-slot')
  }

  function queue_post_groups(node) {
    const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement
    if (!element) return
    const nearest = element.closest(group)
    if (nearest) pendingGroups.add(nearest)
    element.querySelectorAll(group).forEach(row => pendingGroups.add(row))
  }

  function sync_page_route() {
    const path = location.pathname.replace(/\/$/, '')
    document.documentElement?.toggleAttribute('data-xmin-chat', /^\/(?:i\/chat|messages)(?:\/|$)/.test(path))
    document.documentElement?.toggleAttribute('data-xmin-home', path === '/home')
    document.documentElement?.toggleAttribute('data-xmin-post', path.includes('/status/'))
    return path
  }

  function schedule_page_update() {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(() => {
      scheduled = false
      const path = sync_page_route()
      const navigation = document.querySelector(`${nav}:has(a[href="/home"])`)
      const column = document.querySelector(primary)
      mark_layout_paths(navigation, column)
      if (column) mark_feed_width(column.querySelector('[data-testid="cellInnerDiv"], [data-testid="tweet"]'), column)
      style_navigation(navigation, path)
      unpin_tab_header(column, path)
      if (path === '/home') hide_duplicate_tab_rule(tabHeader)
      apply_layout_percentages(navigation, column, path)
      if (path === '/home') hide_home_composer(column)
      else if (path.includes('/status/')) format_post_timestamp()
      pendingGroups.forEach(style_post_actions)
      pendingGroups.clear()
      remember_reading_position()
      if (searchDeadline > Date.now()) {
        const input = find_visible_search()
        if (input) {
          searchDeadline = 0
          input.focus()
        }
      }
    })
  }

  new MutationObserver(records => {
    for (const record of records) {
      const row = (record.target.nodeType === Node.ELEMENT_NODE ? record.target : record.target.parentElement)?.closest?.(group)
      if (row) pendingGroups.add(row)
      record.addedNodes.forEach(queue_post_groups)
    }
    schedule_page_update()
  }).observe(document, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'data-testid'] })

  function update_after_navigation() {
    sync_page_route()
    queue_post_groups(document.documentElement)
    schedule_page_update()
  }

  if (document.documentElement) update_viewport_proportions()
  else document.addEventListener('DOMContentLoaded', update_viewport_proportions, { once: true })
  window.addEventListener('resize', () => {
    update_viewport_proportions()
    schedule_page_update()
  }, { passive: true })
  window.addEventListener('scroll', remember_reading_position, { passive: true })
  for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
    window.addEventListener(type, event => {
      if (zoomUntil && !event.ctrlKey && !event.metaKey) finish_zoom()
    }, { passive: true, capture: true })
  }
  window.addEventListener('urlchange', update_after_navigation)
  window.addEventListener('popstate', update_after_navigation)
  update_after_navigation()

  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey ||
      !document.querySelector('[data-xmin-nav]') || !['n', '/'].includes(event.key) || document.documentElement.hasAttribute('data-xmin-chat') ||
      event.target.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]') ||
      document.querySelector('[aria-modal="true"]')) return
    if (event.key === 'n' ? !open_native_composer() : !open_native_search()) return
    event.preventDefault()
    event.stopImmediatePropagation()
  }, true)
})()
