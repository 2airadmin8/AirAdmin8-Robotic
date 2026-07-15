/* ============================================================
 * AirAdmin8 Robotics / Resource Navigation SEO
 * ------------------------------------------------------------
 * 資料ナビを検索エンジンと生成AIが理解しやすいCollectionPageとして定義します。
 * 画面に表示している資料だけを構造化し、非表示キーワードは追加しません。
 * ============================================================ */

(() => {
  'use strict';

  const resourceList = document.getElementById('resource-list');
  if (!resourceList) return;

  const officialUrl = 'https://robotics.air-admin8.co.jp/resources.html';

  const items = [...resourceList.querySelectorAll('.resource')].map(
    (resource, index) => {
      const link = resource.querySelector('a[href]');
      const heading = resource.querySelector('strong')?.textContent.trim() || '';
      const description = resource.querySelector('p')?.textContent.trim() || '';

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: heading,
          description,
          url: link ? new URL(link.href, window.location.href).href : officialUrl
        }
      };
    }
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AIロボット製品・開発資料ナビ',
    description:
      'AIロボットの製品資料、SDK、ROS、OSS、GitHub、動画をメーカー・製品・情報種別から検索できます。',
    url: officialUrl,
    inLanguage: 'ja-JP',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items
    }
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'resource-collection-schema';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
})();