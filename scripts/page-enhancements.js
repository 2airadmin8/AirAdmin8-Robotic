/* ============================================================
 * AirAdmin8 Robotics / Page Enhancements
 * ------------------------------------------------------------
 * 既存ページに必要な補助導線と表示内容を追加します。
 * SEO上重要な本文は今後HTMLへ静的移行し、この処理を縮小します。
 * ============================================================ */

(() => {
  'use strict';

  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /**
   * 旧ページ内リンクを現行ページへ統一します。
   */
  function normalizeLegacyLinks() {
    document
      .querySelectorAll('a[href="index.html#solutions"], a[href="index.html#issues"]')
      .forEach((link) => link.setAttribute('href', 'solutions.html'));
  }

  /**
   * ホームにAirAdmin8の役割を示す3つのカードを追加します。
   */
  function addRoleSectionToHome() {
    if (currentPage !== 'index.html' || document.getElementById('what-we-do')) return;

    const hero = document.querySelector('main > section');
    if (!hero) return;

    const section = document.createElement('section');
    section.id = 'what-we-do';
    section.className = 'section';
    section.innerHTML = `
      <div class="section-head">
        <p class="kicker">WHAT WE DO</p>
        <h2>AIロボットを、選ぶ・つなぐ・実装する。</h2>
        <p class="lead">
          メーカーや製品ありきではなく、課題・環境・予算から複数案を比較します。
          本体、SDK、ROS、センサー、データ、VLAをつなぎ、PoCから調達・運用まで支援します。
        </p>
      </div>
      <div class="a8-role-grid">
        <article class="card">
          <b>01 選ぶ</b>
          <h3>最適な候補を比較する</h3>
          <p>同じタスクに複数の形態・メーカーを並べ、強み、弱み、未確認事項を整理します。</p>
        </article>
        <article class="card">
          <b>02 つなぐ</b>
          <h3>技術とシステムを接続する</h3>
          <p>本体、ハンド、センサー、SDK、ROS、API、データ収集、VLAを一つの構成にします。</p>
        </article>
        <article class="card">
          <b>03 実装する</b>
          <h3>現場で使える状態まで進める</h3>
          <p>PoC、評価、調達、安全、初期設定、教育、保守・運用まで一貫して支援します。</p>
        </article>
      </div>
      <div class="center-cta">
        <a class="btn primary" href="solutions.html">課題から探す</a>
        <a class="btn ghost" href="manufacturers.html">メーカーから探す</a>
      </div>
    `;

    hero.insertAdjacentElement('afterend', section);
  }

  /**
   * AGIBOT G2ページへ比較、メーカー、開発資料の導線を追加します。
   */
  function addRelatedNavigationToG2() {
    if (currentPage !== 'product-agibot-g2.html') return;

    const main = document.querySelector('main');
    if (!main || document.getElementById('related-navigation')) return;

    const section = document.createElement('section');
    section.id = 'related-navigation';
    section.className = 'section soft';
    section.innerHTML = `
      <div class="section-head">
        <p class="kicker">RELATED NAVIGATION</p>
        <h2>比較・メーカー・開発資料を行き来する。</h2>
      </div>
      <div class="center-cta">
        <a class="btn primary" href="series-mobile-humanoid.html">同カテゴリと比較する</a>
        <a class="btn ghost" href="manufacturer-agibot.html">AGIBOT全体を見る</a>
        <a class="btn ghost" href="resources.html?manufacturer=agibot&product=g2">G2の開発資料を見る</a>
      </div>
    `;

    main.appendChild(section);
  }

  /**
   * 導入プロセスの表示内容を全ページで統一します。
   */
  function normalizeProcessSection() {
    const processSection = document.getElementById('process');
    if (!processSection) return;

    const steps = [
      ['01', '課題整理', '目的・現場・成功条件を確認'],
      ['02', '候補比較', '形態・メーカー・構成を比較'],
      ['03', 'PoC設計', 'KPI・期間・役割分担を定義'],
      ['04', '調達・導入', '見積・安全・初期設定を実施'],
      ['05', '運用・改善', '教育・保守・データで継続改善']
    ];

    const cards = processSection.querySelectorAll('.choice-flow > div');
    cards.forEach((card, index) => {
      const step = steps[index];
      if (!step) return;

      const [number, title, description] = step;
      card.innerHTML = `
        <b>${number}</b>
        <span>${title}</span>
        <small>${description}</small>
      `;
    });
  }

  normalizeLegacyLinks();
  addRoleSectionToHome();
  addRelatedNavigationToG2();
  normalizeProcessSection();
})();