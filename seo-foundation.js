/*
 * AirAdmin8 Robotics SEO・表現統一基盤
 *
 * 正式ドメインへのCanonical統一、OGP、構造化データ、
 * 日本国内の利用者に不自然な「日本導入」表現の修正を共通適用します。
 */
(() => {
  'use strict';

  const OFFICIAL_ORIGIN = 'https://robotics.air-admin8.co.jp';
  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /**
   * 公開ページのSEO情報です。
   * 未登録ページは既存のtitle・descriptionを維持します。
   */
  const pageMetadata = {
    'index.html': {
      path: '/',
      title: 'AIロボット導入支援・製品比較・PoC｜AirAdmin8 Robotics',
      description: '大学・企業向けに、AIロボットの製品比較、PoC設計、見積、購買、導入・運用まで一括支援します。'
    },
    'products-v3.html': {
      path: '/products-v3.html',
      title: 'AIロボット製品比較｜人形・四足・アーム｜AirAdmin8 Robotics',
      description: '人形、移動式ヒューマノイド、四足、ロボットアームを、用途・SDK・価格・導入条件で比較します。'
    },
    'manufacturers.html': {
      path: '/manufacturers.html',
      title: 'AIロボットメーカー比較・公式資料｜AirAdmin8 Robotics',
      description: 'AGIBOT、Unitreeなどの製品、SDK、OSS、公式資料、開発エコシステムをメーカー別に整理します。'
    },
    'manufacturer-agibot.html': {
      path: '/manufacturer-agibot.html',
      title: 'AGIBOT製品・SDK・OSS・開発資料｜AirAdmin8 Robotics',
      description: 'AGIBOTの製品、Link-U OS、AimRT、AgibotWorld、開発プラットフォーム、公式資料を整理しています。'
    },
    'manufacturer-unitree.html': {
      path: '/manufacturer-unitree.html',
      title: 'Unitree製品・SDK・ROS・開発資料｜AirAdmin8 Robotics',
      description: 'Unitreeの人形・四足ロボット、SDK、ROS 2、GitHub、Hugging Face、VLA関連資料を整理しています。'
    },
    'product-unitree-g1d.html': {
      path: '/product-unitree-g1d.html',
      title: 'Unitree G1-D｜SDK・見積・研究用途｜AirAdmin8 Robotics',
      description: 'Unitree G1-Dのデータ収集、VLA、模倣学習、構成比較、SDK、見積、大学購買、導入条件を整理します。',
      type: 'product',
      productName: 'Unitree G1-D',
      brand: 'Unitree'
    },
    'product-unitree-go2.html': {
      path: '/product-unitree-go2.html',
      title: 'Unitree Go2｜SDK・ROS 2・巡回PoC｜AirAdmin8 Robotics',
      description: 'Unitree Go2のSLAM、巡回、点検、SDK、ROS 2、センサー構成、PoC、導入条件を整理します。',
      type: 'product',
      productName: 'Unitree Go2',
      brand: 'Unitree'
    },
    'product-agibot-g2.html': {
      path: '/product-agibot-g2.html',
      title: 'AGIBOT G2｜製品比較・SDK・導入支援｜AirAdmin8 Robotics',
      description: 'AGIBOT G2の特徴、用途、SDK、開発資料、同カテゴリ比較、PoC、見積、導入条件を整理します。',
      type: 'product',
      productName: 'AGIBOT G2',
      brand: 'AGIBOT'
    },
    'case-keio-selection.html': {
      path: '/case-keio-selection.html',
      title: '慶應義塾大学研究室向けAIロボット選定・購買支援｜AirAdmin8 Robotics',
      description: 'Unitree G1-Dの構成比較、正式見積、二社見積、大学購買条件を整理している進行中の支援事例です。',
      type: 'article'
    },
    'contact.html': {
      path: '/contact.html',
      title: 'AIロボット導入・製品比較・PoC相談｜AirAdmin8 Robotics',
      description: 'AIロボットの研究、製品比較、PoC、大学購買、現場導入に関するご相談を受け付けています。'
    }
  };

  /**
   * 国内利用者に不自然な表現を、通常の導入・運用表現へ統一します。
   */
  const wordingRules = [
    [/AI ROBOT INTEGRATION FOR JAPAN/g, 'AI ROBOT IMPLEMENTATION'],
    [/国内導入・社会実装/g, '導入・社会実装'],
    [/日本導入/g, '導入・運用'],
    [/日本での使用条件/g, '導入時の使用条件'],
    [/日本の仕事・人・環境/g, '現場の仕事・人・環境'],
    [/日本市場向け/g, '導入現場向け']
  ];

  const normalizeText = () => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    while (walker.nextNode()) {
      const node = walker.currentNode;
      let value = node.nodeValue;
      wordingRules.forEach(([pattern, replacement]) => {
        value = value.replace(pattern, replacement);
      });
      node.nodeValue = value;
    }

    document.querySelectorAll('[content]').forEach((element) => {
      let value = element.getAttribute('content') || '';
      wordingRules.forEach(([pattern, replacement]) => {
        value = value.replace(pattern, replacement);
      });
      element.setAttribute('content', value);
    });
  };

  const setMeta = (selector, attributes) => {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      document.head.appendChild(element);
    }
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  };

  const setCanonical = (url) => {
    document.querySelectorAll('link[rel="canonical"]').forEach((link) => link.remove());
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = url;
    document.head.appendChild(canonical);
  };

  const appendJsonLd = (id, data) => {
    document.getElementById(id)?.remove();
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };

  const applySeoMetadata = () => {
    const metadata = pageMetadata[currentFile] || {
      path: currentFile === 'index.html' ? '/' : `/${currentFile}`,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || ''
    };

    const canonicalUrl = `${OFFICIAL_ORIGIN}${metadata.path}`;
    document.title = metadata.title;

    setMeta('meta[name="description"]', {
      name: 'description',
      content: metadata.description
    });
    setCanonical(canonicalUrl);

    setMeta('meta[property="og:type"]', { property: 'og:type', content: metadata.type === 'article' ? 'article' : 'website' });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'AirAdmin8 Robotics' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: metadata.title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: metadata.description });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'ja_JP' });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: metadata.title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: metadata.description });

    appendJsonLd('organization-schema', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: '株式会社AirAdmin8',
      alternateName: 'AirAdmin8 Robotics',
      url: `${OFFICIAL_ORIGIN}/`,
      email: 'airobot@robotics.air-admin8.co.jp'
    });

    appendJsonLd('website-schema', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'AirAdmin8 Robotics',
      url: `${OFFICIAL_ORIGIN}/`,
      inLanguage: 'ja-JP'
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

    if (metadata.type === 'article') {
      appendJsonLd('article-schema', {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: metadata.title,
        description: metadata.description,
        mainEntityOfPage: canonicalUrl,
        author: {
          '@type': 'Organization',
          name: '株式会社AirAdmin8'
        },
        publisher: {
          '@type': 'Organization',
          name: '株式会社AirAdmin8'
        },
        inLanguage: 'ja-JP'
      });
    }
  };

  const run = () => {
    normalizeText();
    applySeoMetadata();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
