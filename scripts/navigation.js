/* ============================================================
 * AirAdmin8 Robotics / Navigation
 * ------------------------------------------------------------
 * 共通ナビゲーション、スマートフォンメニュー、フッターリンクを
 * 一元管理します。ページごとの差分は配列定義だけで調整できます。
 * ============================================================ */

(() => {
  'use strict';

  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const navigation = document.querySelector('header nav');
  const menuButton = document.querySelector('.menu');

  const pageGroups = {
    solutions: new Set(['solutions.html', 'task-lab-automation.html']),
    products: new Set([
      'products-v3.html',
      'series-mobile-humanoid.html',
      'series-quadruped.html',
      'series-robot-arm.html',
      'solution-vla-kit.html',
      'product-agibot-g2.html',
      'product-agibot-link-x1.html',
      'product-agibot-omnihand-pro.html',
      'product-unitree-g1d.html',
      'product-unitree-go2.html'
    ]),
    manufacturers: new Set([
      'manufacturers.html',
      'manufacturer-agibot.html',
      'manufacturer-unitree.html',
      'resources.html'
    ]),
    knowledge: new Set([
      'knowledge-hub.html',
      'robot-guide.html',
      'robot-guides.html',
      'guide-university-robot-purchase.html',
      'guide-humanoid-robot-price.html',
      'guide-vla-data-collection.html',
      'guide-robot-poc.html'
    ]),
    services: new Set([
      'service-packages.html',
      'package-university-research.html',
      'package-inspection-poc.html',
      'package-vla-data.html',
      'support.html',
      'safety-support.html',
      'case-university-selection.html',
      'case-keio-selection.html'
    ])
  };

  const navigationItems = [
    ['solutions.html', '課題から探す', pageGroups.solutions.has(currentPage)],
    ['products-v3.html', '製品を比較する', pageGroups.products.has(currentPage)],
    ['manufacturers.html', 'メーカー・資料', pageGroups.manufacturers.has(currentPage)],
    ['knowledge-hub.html', '判断ハブ', pageGroups.knowledge.has(currentPage)],
    ['service-packages.html', '支援・事例', pageGroups.services.has(currentPage)],
    ['contact.html', '相談する', currentPage === 'contact.html', true]
  ];

  const footerItems = [
    ['index.html', 'ホーム'],
    ['solutions.html', '課題から探す'],
    ['products-v3.html', '製品比較'],
    ['manufacturers.html', 'メーカー'],
    ['resources.html', '開発資料'],
    ['knowledge-hub.html', '判断ハブ'],
    ['service-packages.html', '支援パッケージ'],
    ['case-university-selection.html', '支援事例'],
    ['safety-support.html', '安全・保守'],
    ['contact.html', 'お問い合わせ']
  ];

  /**
   * ヘッダーの共通ナビゲーションを描画します。
   */
  function renderNavigation() {
    if (!navigation) return;

    navigation.innerHTML = navigationItems
      .map(([href, label, active, cta]) => {
        const classes = cta ? ' class="nav-cta"' : '';
        const ariaCurrent = active ? ' aria-current="page"' : '';
        return `<a href="${href}"${classes}${ariaCurrent}>${label}</a>`;
      })
      .join('');
  }

  /**
   * スマートフォン用メニューの開閉状態を更新します。
   */
  function bindMobileMenu() {
    if (!menuButton || !navigation) return;

    const closeMenu = () => {
      navigation.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'メニューを開く');
    };

    menuButton.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1000) closeMenu();
    });
  }

  /**
   * 全ページのフッターリンクを同じ順序へ統一します。
   */
  function renderFooterLinks() {
    document.querySelectorAll('footer > div:last-child').forEach((container) => {
      container.innerHTML = footerItems
        .map(([href, label]) => `<a href="${href}">${label}</a>`)
        .join('');
    });
  }

  renderNavigation();
  bindMobileMenu();
  renderFooterLinks();
})();
