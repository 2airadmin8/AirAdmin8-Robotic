/* ============================================================
 * AirAdmin8 Robotics / Brand UI Controller
 * ------------------------------------------------------------
 * ヘッダー・フッターのブランド表示とCookie同意UIを全ページで統一します。
 * 旧HTMLに残る「A8」表記も、正式なブランドマークへ置き換えます。
 * ============================================================ */

(() => {
  'use strict';

  const BRAND_PATH = 'M94 126L84 138L78 154L78 170L81 180L86 189L137 240L152 249L159 251L171 252L187 248L197 242L205 234L209 228L214 215L214 210L215 209L214 195L211 186L205 176L194 166L181 160L171 159L170 158L155 160L144 165L134 173L128 181L119 203L117 205L101 189L105 179L113 165L123 154L134 146L151 139L164 137L149 122L141 118L128 115L114 116L105 119ZM237 164L230 154L219 143L209 136L198 131L195 124L187 112L174 99L160 90L147 85L132 82L116 82L115 83L105 84L93 88L83 93L72 101L64 109L54 123L49 134L45 150L45 159L44 160L45 170L34 174L24 180L17 186L8 198L5 204L1 218L1 236L5 250L13 263L23 273L37 281L53 285L64 285L80 281L94 273L108 258L115 265L129 275L140 280L154 284L174 285L175 284L182 284L199 279L215 270L230 256L237 246L242 236L246 224L247 214L248 213L247 191L242 174ZM59 217L62 224L69 227L61 232L59 238L56 231L48 227L54 225ZM226 169L232 181L236 198L236 212L232 229L226 241L221 248L207 261L192 269L174 273L162 273L147 270L134 264L124 257L75 208L66 203L55 202L45 206L38 213L34 222L35 235L38 241L44 247L49 250L59 252L60 251L65 251L72 248L79 241L84 232L99 247L96 254L86 264L78 269L69 272L64 272L63 273L48 272L31 264L22 255L16 245L13 235L13 219L15 211L19 203L25 195L35 187L47 182L59 181L57 173L57 150L61 136L69 122L80 110L90 103L100 98L117 94L131 94L132 95L142 96L157 102L166 108L178 120L184 129L188 140L202 146L211 152L221 162Z';

  const COOKIE_MESSAGE_KEYWORDS = [
    'クッキーを使用しています',
    'Cookieを使用しています',
    '利便性の向上を目的にクッキーを使用'
  ];

  /**
   * ブランドマークのSVGを生成します。
   *
   * @param {string} color マークの描画色
   * @returns {string} SVG文字列
   */
  function createBrandMark(color) {
    return `
      <svg viewBox="0 0 248 286" aria-hidden="true" focusable="false">
        <path d="${BRAND_PATH}" fill="${color}" fill-rule="evenodd" />
      </svg>
    `;
  }

  /**
   * 旧ページを含む全ページのヘッダー・フッターを正式ロゴへ統一します。
   */
  function normalizeBrandLogo() {
    const headerLogo = document.querySelector('header .logo');

    if (headerLogo) {
      headerLogo.innerHTML = `
        <span class="brand-mark">${createBrandMark('#211714')}</span>
        <span class="brand-name">AirAdmin8 Robotics</span>
      `;
      headerLogo.setAttribute('aria-label', 'AirAdmin8 Robotics ホーム');
    }

    document.querySelectorAll('footer strong').forEach((footerLogo) => {
      footerLogo.innerHTML = `
        <span class="footer-brand-mark">${createBrandMark('#ffffff')}</span>
        <span>AirAdmin8 Robotics</span>
      `;
    });
  }

  /**
   * 対象要素の文章がCookie同意文言に該当するか判定します。
   *
   * @param {Element} element 判定対象の要素
   * @returns {boolean} Cookie同意文言を含む場合はtrue
   */
  function containsCookieMessage(element) {
    const text = element.textContent?.replace(/\s+/g, ' ').trim() || '';
    return COOKIE_MESSAGE_KEYWORDS.some((keyword) => text.includes(keyword));
  }

  /**
   * Cookie文言を含む要素から、表示パネル本体を探します。
   *
   * @param {Element} element Cookie文言を含む要素
   * @returns {Element} 装飾対象のパネル要素
   */
  function findCookiePanel(element) {
    let current = element;

    for (let depth = 0; depth < 6 && current; depth += 1) {
      if (current.querySelectorAll('button, a').length >= 2) return current;
      current = current.parentElement;
    }

    return element.parentElement || element;
  }

  /**
   * 外部タグ等で追加されたCookie同意パネルへ共通クラスを付与します。
   */
  function normalizeCookiePanel() {
    for (const element of document.querySelectorAll('body *')) {
      if (!containsCookieMessage(element)) continue;

      const panel = findCookiePanel(element);
      if (panel.classList.contains('a8-cookie-panel')) return;

      panel.classList.add('a8-cookie-panel');
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Cookie設定');
      return;
    }
  }

  /**
   * 動的に追加されるCookie同意UIを監視します。
   */
  function observeDynamicUi() {
    const observer = new MutationObserver(normalizeCookiePanel);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function initializeBrandUi() {
    normalizeBrandLogo();
    normalizeCookiePanel();
    observeDynamicUi();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBrandUi, { once: true });
  } else {
    initializeBrandUi();
  }
})();