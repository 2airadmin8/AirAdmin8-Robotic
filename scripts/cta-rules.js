/* ============================================================
 * AirAdmin8 Robotics V2 / CTA Rules
 * ------------------------------------------------------------
 * ページの目的に合わせて、相談ボタンを具体的な次の行動へ置き換えます。
 * 漠然とした「相談する」を減らし、比較・見積・PoC・資料確認へ誘導します。
 * ============================================================ */

(() => {
  'use strict';

  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const rules = [
    {
      match: (page) => page.startsWith('product-'),
      items: [
        ['同カテゴリと比較する', 'products-v3.html'],
        ['価格・納期を確認する', 'contact.html?intent=quote'],
        ['SDK公開範囲を確認する', 'resources.html?type=sdk']
      ]
    },
    {
      match: (page) => page.includes('university') || page.includes('keio'),
      items: [
        ['大学向け見積を依頼する', 'contact.html?intent=university-quote'],
        ['二社見積の条件を整理する', 'guide-university-robot-purchase.html'],
        ['研究テーマから候補を出す', 'contact.html?intent=research-selection']
      ]
    },
    {
      match: (page) => page.includes('poc'),
      items: [
        ['PoC構成案を依頼する', 'contact.html?intent=poc-design'],
        ['KPIと期間を整理する', 'guide-robot-poc.html']
      ]
    },
    {
      match: (page) => page === 'resources.html',
      items: [
        ['開発資料を絞り込む', '#resource-filter'],
        ['不足資料を問い合わせる', 'contact.html?intent=resource-request']
      ]
    },
    {
      match: (page) => page === 'knowledge-hub.html',
      items: [
        ['目的から判断方法を探す', '#decision-paths'],
        ['15分だけ相談する', 'contact.html?intent=quick-consultation']
      ]
    }
  ];

  /**
   * 現在ページに対応するCTA定義を返します。
   *
   * @returns {Array<[string, string]>}
   */
  function resolveItems() {
    return rules.find((rule) => rule.match(currentPage))?.items || [];
  }

  /**
   * ページ末尾へ共通CTAを追加します。
   * 既に専用CTAがある場合は重複表示しません。
   */
  function renderCta() {
    const items = resolveItems();
    const main = document.querySelector('main');
    if (!items.length || !main || document.getElementById('contextual-cta')) return;

    const section = document.createElement('section');
    section.id = 'contextual-cta';
    section.className = 'section contextual-cta';
    section.innerHTML = `
      <div class="section-head">
        <p class="kicker">NEXT ACTION</p>
        <h2>次に確認することを、具体的に選ぶ。</h2>
      </div>
      <div class="center-cta">
        ${items
          .map(([label, href], index) => `<a class="btn ${index === 0 ? 'primary' : 'ghost'}" href="${href}">${label}</a>`)
          .join('')}
      </div>
    `;

    main.appendChild(section);
  }

  renderCta();
})();
