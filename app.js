/* ============================================================
 * AirAdmin8 Robotics V2 / Application Bootstrap
 * ------------------------------------------------------------
 * 全ページで利用するCSSとJavaScriptを、依存関係を保ちながら読み込みます。
 * 個別機能はこのファイルへ実装せず、役割ごとのモジュールへ分離します。
 * ============================================================ */

(() => {
  'use strict';

  const stylesheetPaths = [
    'assets/css/v2/foundation.css',
    'assets/css/v2/layout.css',
    'assets/css/v2/components.css',
    'assets/css/v2/responsive.css'
  ];

  const modulePaths = [
    'analytics.js',
    'scripts/navigation.js',
    'scripts/page-enhancements.js',
    'scripts/resources-search.js',
    'scripts/resources-seo.js',
    'scripts/contact-form.js'
  ];

  /**
   * CSSファイルを1つ読み込みます。
   * 同じパスが既に存在する場合は、重複して追加しません。
   *
   * @param {string} href CSSファイルのパス
   * @returns {Promise<void>}
   */
  function loadStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = href;
      stylesheet.addEventListener('load', () => resolve(), { once: true });
      stylesheet.addEventListener(
        'error',
        () => reject(new Error(`CSSの読み込みに失敗しました: ${href}`)),
        { once: true }
      );
      document.head.appendChild(stylesheet);
    });
  }

  /**
   * JavaScriptファイルを1つ読み込みます。
   * 同じパスが既に存在する場合は、重複して追加しません。
   *
   * @param {string} source JavaScriptファイルのパス
   * @returns {Promise<void>}
   */
  function loadModule(source) {
    if (document.querySelector(`script[src="${source}"]`)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = source;
      script.defer = true;
      script.addEventListener('load', () => resolve(), { once: true });
      script.addEventListener(
        'error',
        () => reject(new Error(`JavaScriptの読み込みに失敗しました: ${source}`)),
        { once: true }
      );
      document.head.appendChild(script);
    });
  }

  /**
   * V2共通CSSを先に読み込み、その後にJavaScriptモジュールを起動します。
   * 表示崩れを抑えるため、CSSは並列、JavaScriptは定義順に読み込みます。
   */
  async function bootstrap() {
    try {
      await Promise.all(stylesheetPaths.map((path) => loadStylesheet(path)));

      for (const modulePath of modulePaths) {
        await loadModule(modulePath);
      }

      document.documentElement.classList.add('a8-v2-ready');
    } catch (error) {
      console.error('[AirAdmin8 V2 Bootstrap]', error);
    }
  }

  bootstrap();
})();