/* ============================================================
 * AirAdmin8 Robotics / SEO, AEO & GEO Foundation
 * ------------------------------------------------------------
 * Canonical、OGP、構造化データ、FAQ、更新情報を統一します。
 * 検索エンジンだけに見せる隠し文言は追加せず、画面上の内容と
 * 構造化データが矛盾しないことを最優先にします。
 * ============================================================ */

(() => {
  'use strict';

  const OFFICIAL_ORIGIN = 'https://robotics.air-admin8.co.jp';
  const SITE_NAME = 'AirAdmin8 Robotics';
  const COMPANY_NAME = '株式会社AirAdmin8';
  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const pageMetadata = {
    'index.html': {
      path: '/',
      title: 'AIロボット比較・選定・導入支援｜AirAdmin8 Robotics',
      description: '人型、四足、ロボットアームを用途・予算・開発環境から比較し、見積、大学購買、PoC、導入・運用まで支援します。'
    },
    'solutions.html': {
      path: '/solutions.html',
      title: 'AIロボットを課題から探す｜研究・搬送・巡回・操作',
      description: '研究実証、データ収集、搬送、巡回点検、把持、実験室自動化など、実現したい仕事からAIロボット候補を整理します。'
    },
    'products-v3.html': {
      path: '/products-v3.html',
      title: 'AIロボット製品比較｜人型・四足・アーム',
      description: '人型、移動式ヒューマノイド、四足、ロボットアームを、用途、SDK、価格帯、導入条件で比較します.'
    },
    'manufacturers.html': {
      path: '/manufacturers.html',
      title: 'AIロボットメーカー比較・公式資料',
      description: 'AGIBOT、Unitreeなどの製品、SDK、OSS、GitHub、Hugging Face、公式資料をメーカー別に整理します。'
    },
    'resources.html': {
      path: '/resources.html',
      title: 'AIロボットSDK・ROS・GitHub・公式資料ナビ',
      description: 'メーカー、製品、情報種別、キーワードから、AIロボットのSDK、ROS、GitHub、Hugging Face、公式資料を探せます。'
    },
    'university-robot-purchase.html': {
      path: '/university-robot-purchase.html',
      title: '大学でロボットを購入する方法｜見積・二社見積・検収',
      description: '大学研究室がAIロボットを購入する際に必要な正式型番、二社見積、納期、保証、検収条件、購買手続きを整理します。',
      type: 'article',
      faq: [
        ['大学でロボットを購入する際に必要な情報は何ですか？', '正式型番、メーカー名、構成、数量、税込総額、納期、保証、納品先、検収条件を整理します。'],
        ['二社見積は必要ですか？', '大学や金額帯によって必要条件が異なるため、所属機関の購買規程を確認します。']
      ]
    },
    'humanoid-robot-comparison.html': {
      path: '/humanoid-robot-comparison.html',
      title: '人型ロボット比較｜用途・SDK・価格帯・導入難易度',
      description: '人型ロボットを用途、身体構成、SDK、ROS、価格帯、開発環境、導入難易度から比較します。',
      type: 'article'
    },
    'robot-quotation.html': {
      path: '/robot-quotation.html',
      title: 'ロボット見積の確認項目｜本体・付属品・送料・保証',
      description: 'AIロボットの見積で確認すべき本体、付属品、送料、保証、設置、開発支援、納期、検収条件を整理します。',
      type: 'article'
    },
    'robot-poc-cost.html': {
      path: '/robot-poc-cost.html',
      title: 'ロボットPoCの費用と期間｜KPI・構成・評価方法',
      description: 'ロボットPoCの機器費、設計費、開発費、評価費、期間、KPI、役割分担と導入判断の考え方を整理します。',
      type: 'article',
      faq: [
        ['ロボットPoCでは何を評価しますか？', '成功条件、精度、速度、安定性、安全性、運用負荷、追加開発量を評価します。'],
        ['PoCの前に製品を決める必要はありますか？', '必須ではありません。課題と成功条件を定義してから複数候補を比較できます。']
      ]
    },
    'robot-data-collection.html': {
      path: '/robot-data-collection.html',
      title: 'ロボットデータ収集方法｜テレオペ・VR・模倣学習・VLA',
      description: 'テレオペ、VR、モーションキャプチャ、シミュレーションを使ったロボットデータ収集とVLA・模倣学習への利用方法を整理します。',
      type: 'article'
    },
    'product-unitree-g1d.html': {
      path: '/product-unitree-g1d.html',
      title: 'Unitree G1-D｜SDK・見積・研究用途',
      description: 'Unitree G1-Dのデータ収集、VLA、模倣学習、構成比較、SDK、見積、大学購買、導入条件を整理します。',
      type: 'product',
      productName: 'Unitree G1-D',
      brand: 'Unitree'
    },
    'product-unitree-go2.html': {
      path: '/product-unitree-go2.html',
      title: 'Unitree Go2｜SDK・ROS 2・巡回PoC',
      description: 'Unitree Go2のSLAM、巡回、点検、SDK、ROS 2、センサー構成、PoC、導入条件を整理します。',
      type: 'product',
      productName: 'Unitree Go2',
      brand: 'Unitree'
    },
    'product-agibot-g2.html': {
      path: '/product-agibot-g2.html',
      title: 'AGIBOT G2｜製品比較・SDK・導入支援',
      description: 'AGIBOT G2の特徴、用途、SDK、開発資料、同カテゴリ比較、PoC、見積、導入条件を整理します。',
      type: 'product',
      productName: 'AGIBOT G2',
      brand: 'AGIBOT'
    },
    'case-keio-selection.html': {
      path: '/case-keio-selection.html',
      title: '慶應義塾大学研究室向けAIロボット選定・購買支援',
      description: 'Unitree G1-Dの構成比較、正式見積、二社見積、大学購買条件を整理している進行中の支援事例です。',
      type: 'article'
    },
    'contact.html': {
      path: '/contact.html',
      title: 'AIロボット導入・製品比較・PoC相談',
      description: 'AIロボットの研究、製品比較、PoC、大学購買、現場導入に関する相談を受け付けています。'
    }
  };

  /** meta要素を取得または生成し、属性を更新します。 */
  function setMeta(selector, attributes) {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      document.head.appendChild(element);
    }

    Object.entries(attributes).forEach(([name, value]) => {
      element.setAttribute(name, value);
    });
  }

  /** Canonical URLをページごとに1件だけ設定します。 */
  function setCanonical(url) {
    document.querySelectorAll('link[rel="canonical"]').forEach((link) => link.remove());

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = url;
    document.head.appendChild(canonical);
  }

  /** JSON-LDをID単位で差し替えます。 */
  function appendJsonLd(id, data) {
    document.getElementById(id)?.remove();

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /** ページ本文に存在する最終更新日を取得します。 */
  function getVisibleDateModified() {
    const element = document.querySelector('time[datetime], [data-updated]');
    return element?.getAttribute('datetime') || element?.getAttribute('data-updated') || undefined;
  }

  /** FAQ構造化データを、画面上の内容と矛盾しない登録ページだけへ追加します。 */
  function applyFaqSchema(metadata) {
    if (!metadata.faq?.length) return;

    appendJsonLd('faq-schema', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: metadata.faq.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer
        }
      }))
    });
  }

  /** ページ単位のSEO、AEO、GEO情報を適用します。 */
  function applySeoMetadata() {
    const metadata = pageMetadata[currentFile] || {
      path: currentFile === 'index.html' ? '/' : `/${currentFile}`,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || ''
    };

    const canonicalUrl = `${OFFICIAL_ORIGIN}${metadata.path}`;
    const titleWithBrand = metadata.title.includes(SITE_NAME)
      ? metadata.title
      : `${metadata.title}｜${SITE_NAME}`;

    document.title = titleWithBrand;

    setMeta('meta[name="description"]', {
      name: 'description',
      content: metadata.description
    });
    setCanonical(canonicalUrl);

    setMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: metadata.type === 'article' ? 'article' : 'website'
    });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: titleWithBrand });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: metadata.description });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'ja_JP' });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });

    appendJsonLd('organization-schema', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${OFFICIAL_ORIGIN}/#organization`,
      name: COMPANY_NAME,
      alternateName: SITE_NAME,
      url: `${OFFICIAL_ORIGIN}/`,
      email: 'airobot@robotics.air-admin8.co.jp',
      areaServed: 'JP',
      knowsAbout: [
        'AIロボット',
        'ヒューマノイドロボット',
        '四足歩行ロボット',
        'VLA',
        '模倣学習',
        '大学購買',
        'ロボットPoC'
      ]
    });

    appendJsonLd('website-schema', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${OFFICIAL_ORIGIN}/#website`,
      name: SITE_NAME,
      url: `${OFFICIAL_ORIGIN}/`,
      publisher: { '@id': `${OFFICIAL_ORIGIN}/#organization` },
      inLanguage: 'ja-JP'
    });

    appendJsonLd('webpage-schema', {
      '@context': 'https://schema.org',
      '@type': metadata.type === 'article' ? 'Article' : 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: titleWithBrand,
      description: metadata.description,
      isPartOf: { '@id': `${OFFICIAL_ORIGIN}/#website` },
      about: { '@id': `${OFFICIAL_ORIGIN}/#organization` },
      inLanguage: 'ja-JP',
      dateModified: getVisibleDateModified()
    });

    if (currentFile !== 'index.html') {
      appendJsonLd('breadcrumb-schema', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'ホーム',
            item: `${OFFICIAL_ORIGIN}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: document.querySelector('h1')?.textContent.trim() || metadata.title,
            item: canonicalUrl
          }
        ]
      });
    }

    if (metadata.type === 'product') {
      appendJsonLd('product-schema', {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: metadata.productName,
        brand: {
          '@type': 'Brand',
          name: metadata.brand
        },
        description: metadata.description,
        url: canonicalUrl,
        category: 'AIロボット'
      });
    }

    applyFaqSchema(metadata);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySeoMetadata, { once: true });
  } else {
    applySeoMetadata();
  }
})();
