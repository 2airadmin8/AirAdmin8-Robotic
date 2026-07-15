/*
 * AirAdmin8 Robotics 共通スクリプト
 *
 * ナビゲーション、ブランド表示、問い合わせフォームなど、
 * 全ページで共通利用する処理をまとめています。
 */

'use strict';

/**
 * GA4・GTM の共通計測スクリプトを読み込みます。
 */
const analyticsScript = document.createElement('script');
analyticsScript.src = 'analytics.js';
analyticsScript.defer = true;
document.head.appendChild(analyticsScript);

const menuButton = document.querySelector('.menu');
const navigation = document.querySelector('nav');
const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

/**
 * 現在のページに応じて、共通ナビゲーションを構築します。
 */
if (navigation) {
  const productPages = new Set([
    'products-v3.html',
    'series-mobile-humanoid.html',
    'series-quadruped.html',
    'series-robot-arm.html',
    'solution-vla-kit.html',
    'product-agibot-g2.html',
    'product-unitree-g1d.html',
    'product-unitree-go2.html'
  ]);

  const manufacturerPages = new Set([
    'manufacturers.html',
    'manufacturer-agibot.html',
    'manufacturer-unitree.html',
    'resources.html'
  ]);

  const solutionPages = new Set([
    'solutions.html',
    'task-lab-automation.html'
  ]);

  const supportPages = new Set([
    'support.html',
    'case-university-selection.html',
    'case-keio-selection.html'
  ]);

  const navigationItems = [
    {
      href: 'solutions.html',
      label: 'ソリューション',
      active: solutionPages.has(currentPage)
    },
    {
      href: 'products-v3.html',
      label: '製品比較',
      active: productPages.has(currentPage)
    },
    {
      href: 'manufacturers.html',
      label: 'メーカー・資料',
      active: manufacturerPages.has(currentPage)
    },
    {
      href: 'physical-ai.html',
      label: '技術・SDK',
      active: currentPage === 'physical-ai.html'
    },
    {
      href: 'support.html',
      label: '導入・サポート',
      active: supportPages.has(currentPage)
    },
    {
      href: 'contact.html',
      label: '相談する',
      active: currentPage === 'contact.html',
      cta: true
    }
  ];

  navigation.innerHTML = navigationItems
    .map((item) => {
      const className = item.cta ? ' class="nav-cta"' : '';
      const ariaCurrent = item.active ? ' aria-current="page"' : '';
      return `<a href="${item.href}"${className}${ariaCurrent}>${item.label}</a>`;
    })
    .join('');
}

/**
 * スマートフォン用メニューを開閉します。
 */
if (menuButton && navigation) {
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'メニューを開く');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute(
      'aria-label',
      isOpen ? 'メニューを閉じる' : 'メニューを開く'
    );
  });

  navigation
    .querySelectorAll('a')
    .forEach((link) => link.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1000) closeMenu();
  });
}

/**
 * フッターの共通リンクを統一します。
 */
document.querySelectorAll('footer div:last-child').forEach((links) => {
  const footerLinks = [
    ['index.html', 'ホーム'],
    ['solutions.html', 'ソリューション'],
    ['task-lab-automation.html', 'タスク比較'],
    ['products-v3.html', '製品比較'],
    ['manufacturers.html', 'メーカー'],
    ['resources.html', '開発資料ナビ'],
    ['case-university-selection.html', '支援事例'],
    ['support.html', '導入・サポート'],
    ['physical-ai.html', '技術・SDK'],
    ['contact.html', 'お問い合わせ']
  ];

  links.innerHTML = footerLinks
    .map(([href, label]) => `<a href="${href}">${label}</a>`)
    .join('');
});

/**
 * 旧ページ内リンクを現行ページへ統一します。
 */
document
  .querySelectorAll('a[href="index.html#solutions"], a[href="index.html#issues"]')
  .forEach((link) => {
    link.setAttribute('href', 'solutions.html');
  });

/**
 * 過去の表現を現在の事業方針に合わせて統一します。
 */
const wordingMap = new Map([
  ['日本導入', '国内導入・社会実装'],
  [
    '納期、保証、無線、電池、日文資料。',
    '調達、法規、安全、納期、保証、保守、運用体制。'
  ],
  [
    '価格、納期、保証、無線・電池、購買。',
    '調達、法規、安全、価格、納期、保証、保守、運用まで。'
  ]
]);

document.querySelectorAll('h3, th, p').forEach((element) => {
  const normalizedText = element.textContent.trim();
  if (wordingMap.has(normalizedText)) {
    element.textContent = wordingMap.get(normalizedText);
  }
});

/**
 * ホームにAirAdmin8の役割を明示するセクションを追加します。
 * 今後はHTMLへ静的移行し、JS依存を段階的に減らします。
 */
if (currentPage === 'index.html') {
  const hero = document.querySelector('main > section');

  if (hero && !document.getElementById('what-we-do')) {
    const section = document.createElement('section');
    section.id = 'what-we-do';
    section.className = 'section';
    section.innerHTML = `
      <div class="section-head">
        <p class="kicker">WHAT WE DO</p>
        <h2>AIロボットを、選ぶ・つなぐ・実装する。</h2>
        <p class="lead">メーカーや製品ありきではなく、課題・環境・予算から複数案を比較。ロボット本体、SDK・ROS、センサー、データ、VLAをつなぎ、PoCから調達・運用まで支援します。</p>
      </div>
      <div class="a8-role-grid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px">
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
}

/**
 * G2製品ページに比較・メーカー・開発資料への導線を追加します。
 */
if (currentPage === 'product-agibot-g2.html') {
  const main = document.querySelector('main');

  if (main && !document.getElementById('related-navigation')) {
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
}

/**
 * ロゴガイドラインに基づき、単色ロゴマークを共通表示します。
 */
const brandPath = 'M 94 126 L 84 138 L 78 154 L 78 170 L 81 180 L 86 189 L 137 240 L 152 249 L 159 251 L 171 252 L 187 248 L 197 242 L 205 234 L 209 228 L 214 215 L 214 210 L 215 209 L 214 195 L 211 186 L 205 176 L 194 166 L 181 160 L 171 159 L 170 158 L 155 160 L 144 165 L 134 173 L 128 181 L 119 203 L 117 205 L 101 189 L 105 179 L 113 165 L 123 154 L 134 146 L 151 139 L 164 137 L 149 122 L 141 118 L 128 115 L 114 116 L 105 119 Z M 237 164 L 230 154 L 219 143 L 209 136 L 198 131 L 195 124 L 187 112 L 174 99 L 160 90 L 147 85 L 132 82 L 116 82 L 115 83 L 105 84 L 93 88 L 83 93 L 72 101 L 64 109 L 54 123 L 49 134 L 45 150 L 45 159 L 44 160 L 45 170 L 34 174 L 24 180 L 17 186 L 8 198 L 5 204 L 1 218 L 1 236 L 5 250 L 13 263 L 23 273 L 37 281 L 53 285 L 64 285 L 80 281 L 94 273 L 108 258 L 115 265 L 129 275 L 140 280 L 154 284 L 174 285 L 175 284 L 182 284 L 199 279 L 215 270 L 230 256 L 237 246 L 242 236 L 246 224 L 247 214 L 248 213 L 247 191 L 242 174 Z M 59 217 L 62 224 L 69 227 L 61 232 L 59 238 L 56 231 L 48 227 L 54 225 Z M 226 169 L 232 181 L 236 198 L 236 212 L 232 229 L 226 241 L 221 248 L 207 261 L 192 269 L 174 273 L 162 273 L 147 270 L 134 264 L 124 257 L 75 208 L 66 203 L 55 202 L 45 206 L 38 213 L 34 222 L 35 235 L 38 241 L 44 247 L 49 250 L 59 252 L 60 251 L 65 251 L 72 248 L 79 241 L 84 232 L 99 247 L 96 254 L 86 264 L 78 269 L 69 272 L 64 272 L 63 273 L 48 272 L 31 264 L 22 255 L 16 245 L 13 235 L 13 219 L 15 211 L 19 203 L 25 195 L 35 187 L 47 182 L 59 181 L 57 173 L 57 150 L 61 136 L 69 122 L 80 110 L 90 103 L 100 98 L 117 94 L 131 94 L 132 95 L 142 96 L 157 102 L 166 108 L 178 120 L 184 129 L 188 140 L 202 146 L 211 152 L 221 162 Z';

const brandMark = (color = '#211714') => `
  <svg viewBox="0 0 248 286" aria-hidden="true" focusable="false">
    <path d="${brandPath}" fill="${color}" fill-rule="evenodd" />
  </svg>
`;

const headerLogo = document.querySelector('header .logo');
if (headerLogo) {
  headerLogo.innerHTML = `
    <span class="brand-mark">${brandMark()}</span>
    <span class="brand-name">AirAdmin8 Robotics</span>
  `;
  headerLogo.setAttribute('aria-label', 'AirAdmin8 Robotics ホーム');
}

document.querySelectorAll('footer strong').forEach((element) => {
  element.innerHTML = `
    <span class="footer-brand-mark">${brandMark('#ffffff')}</span>
    <span>AirAdmin8 Robotics</span>
  `;
});

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/svg+xml';
favicon.href = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 248 286">
    <path d="${brandPath}" fill="#211714" fill-rule="evenodd" />
  </svg>
`)}`;
document.head.appendChild(favicon);

const brandStyle = document.createElement('style');
brandStyle.textContent = `
  header .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-mark {
    display: inline-flex;
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
  }

  .brand-mark svg,
  .footer-brand-mark svg {
    width: 100%;
    height: 100%;
  }

  .brand-name {
    font-weight: 900;
    white-space: nowrap;
  }

  .footer-brand-mark {
    display: inline-flex;
    width: 36px;
    height: 36px;
    margin-right: 10px;
    vertical-align: middle;
  }

  footer strong {
    display: flex;
    align-items: center;
  }

  .navy .choice-flow div,
  .navy .choice-flow h3,
  .navy .choice-flow p,
  .navy .choice-flow small {
    color: #0b2533;
  }

  .navy .choice-flow b {
    color: #009bd2;
  }

  @media (max-width: 640px) {
    .brand-name {
      font-size: 1rem;
    }

    .brand-mark {
      width: 36px;
      height: 36px;
      flex-basis: 36px;
    }
  }
`;
document.head.appendChild(brandStyle);

/**
 * 導入プロセスの表示内容を全ページで統一します。
 */
const processSection = document.getElementById('process');
if (processSection) {
  const cards = [...processSection.querySelectorAll('.choice-flow > div')];
  const steps = [
    ['01', '課題整理', '目的・現場・成功条件を確認'],
    ['02', '候補比較', '形態・メーカー・構成を比較'],
    ['03', 'PoC設計', 'KPI・期間・役割分担を定義'],
    ['04', '調達・導入', '見積・安全・初期設定を実施'],
    ['05', '運用・改善', '教育・保守・データで継続改善']
  ];

  cards.slice(0, 5).forEach((card, index) => {
    const [number, title, description] = steps[index];
    card.innerHTML = `
      <b>${number}</b>
      <span>${title}</span>
      <small>${description}</small>
    `;
  });
}

/**
 * WADAX上のPHPエンドポイントへ問い合わせを送信します。
 * HTMLが返ってきた場合は、PHP未配備またはサーバー設定不備として扱います。
 */
const liveContactForm = document.querySelector('form[data-live-form]');
if (liveContactForm) {
  const submitButton = liveContactForm.querySelector('[type="submit"]');
  const statusElement = liveContactForm.querySelector('[data-form-status]');

  liveContactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!liveContactForm.reportValidity()) return;

    submitButton.disabled = true;
    submitButton.textContent = '送信しています…';

    if (statusElement) {
      statusElement.textContent = '';
      statusElement.setAttribute('role', 'status');
    }

    if (window.AirAdmin8Analytics) {
      window.AirAdmin8Analytics.trackEvent('generate_lead_start', {
        form_name: 'robotics_contact'
      });
    }

    try {
      const response = await fetch(liveContactForm.action, {
        method: 'POST',
        body: new FormData(liveContactForm),
        headers: {
          Accept: 'application/json'
        }
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          '問い合わせ送信機能がサーバーに反映されていません。管理者へご連絡ください。'
        );
      }

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.message || '送信に失敗しました。');
      }

      liveContactForm.reset();
      if (statusElement) {
        statusElement.textContent =
          'お問い合わせを受け付けました。確認メールをお送りします。';
      }

      if (window.AirAdmin8Analytics) {
        window.AirAdmin8Analytics.trackEvent('generate_lead', {
          form_name: 'robotics_contact',
          value: 1,
          currency: 'JPY'
        });
      }
    } catch (error) {
      console.error('[AirAdmin8 Contact]', error);
      if (statusElement) {
        statusElement.textContent =
          error.message ||
          '送信できませんでした。時間をおいて再度お試しください。';
      }
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = '相談内容を送信する';
    }
  });
}
