/*
 * AirAdmin8 Robotics 計測・共通拡張基盤
 *
 * GA4、Google Tag Manager、ブランド表示、進行中事例への導線を
 * 全ページへ共通適用します。ページ側では app.js から読み込みます。
 */
(() => {
  'use strict';

  const GA4_MEASUREMENT_ID = 'G-XJYBMMPWWX';
  const GTM_CONTAINER_ID = 'GT-5NXF29HN';

  /**
   * Google Tag Manager を読み込みます。
   */
  const loadGoogleTagManager = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': Date.now(),
      event: 'gtm.js'
    });

    const firstScript = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_CONTAINER_ID)}`;
    firstScript.parentNode.insertBefore(script, firstScript);
  };

  /**
   * GA4 の gtag.js を読み込みます。
   */
  const loadGoogleAnalytics = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_MEASUREMENT_ID)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA4_MEASUREMENT_ID, {
      send_page_view: true,
      transport_type: 'beacon'
    });
  };

  /**
   * GTM と GA4 の両方へ同じイベントを送信します。
   */
  const trackEvent = (eventName, parameters = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...parameters
    });

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, parameters);
    }
  };

  /**
   * 電話・メール・資料・外部開発リソースのクリックを計測します。
   */
  const bindLinkTracking = () => {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href') || '';
      const label = (link.textContent || '').trim().slice(0, 120);

      if (href.startsWith('tel:')) {
        trackEvent('phone_click', { link_url: href, link_text: label });
        return;
      }

      if (href.startsWith('mailto:')) {
        trackEvent('email_click', { link_url: href, link_text: label });
        return;
      }

      if (/\.(pdf|zip|xlsx?|docx?|pptx?)(\?|#|$)/i.test(href)) {
        trackEvent('file_download', { link_url: href, link_text: label });
        return;
      }

      if (/github\.com/i.test(href)) {
        trackEvent('github_click', { link_url: href, link_text: label });
        return;
      }

      if (/huggingface\.co/i.test(href)) {
        trackEvent('huggingface_click', { link_url: href, link_text: label });
        return;
      }

      if (/^https?:\/\//i.test(href) && !href.includes(window.location.hostname)) {
        trackEvent('outbound_click', { link_url: href, link_text: label });
      }
    });
  };

  /**
   * ブランド表示用の追加CSSとfaviconを読み込みます。
   * faviconはChromeのショートカットにも利用されます。
   */
  const applyBrandAssets = () => {
    if (!document.querySelector('link[href="site-enhancements.css"]')) {
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'site-enhancements.css';
      document.head.appendChild(stylesheet);
    }

    document.querySelectorAll('link[rel~="icon"]').forEach((link) => link.remove());

    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = 'assets/favicon.svg';
    document.head.appendChild(favicon);
  };

  /**
   * ホームに進行中の大学支援事例を表示します。
   * 大学ロゴは使用せず、案件の事実と進捗を文字で明示します。
   */
  const addCaseProofToHome = () => {
    const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (currentPage !== 'index.html' || document.getElementById('case-proof')) return;

    const processSection = document.getElementById('process');
    const main = document.querySelector('main');
    if (!main) return;

    const section = document.createElement('section');
    section.id = 'case-proof';
    section.className = 'section case-proof-section';
    section.innerHTML = `
      <div class="section-head">
        <p class="kicker">CASE / UNIVERSITY PROCUREMENT</p>
        <h2>比較・見積・大学購買まで、実務を前に進める。</h2>
        <p class="lead">製品を紹介するだけでなく、正式型番、構成、納期、保証、二社見積、大学内手続きまで整理します。</p>
      </div>
      <article class="case-proof-card">
        <div class="case-proof-label">
          <div>
            <span class="case-proof-status">進行中｜2026年7月</span>
            <h3 class="case-proof-school">慶應義塾大学<br>研究室向け支援</h3>
          </div>
          <a class="btn primary" href="case-keio-selection.html">支援内容と進捗を見る</a>
        </div>
        <div>
          <h3>Unitree G1-Dの選定・正式見積・購買条件整理</h3>
          <p>研究用途と開発環境を確認し、ハンド構成、SDK、付属品、納期、保証、検収条件、大学指定の二社見積を整理しています。</p>
          <ol class="case-proof-steps">
            <li>研究要件</li>
            <li>製品比較</li>
            <li>正式見積</li>
            <li class="is-current">大学内手続き</li>
            <li>納品・導入</li>
          </ol>
          <p class="case-proof-note">※進行中案件です。大学ロゴ、個人名、具体価格、未承認の推薦コメントは掲載していません。</p>
        </div>
      </article>
    `;

    if (processSection) {
      processSection.insertAdjacentElement('beforebegin', section);
    } else {
      main.appendChild(section);
    }
  };

  loadGoogleTagManager();
  loadGoogleAnalytics();
  bindLinkTracking();
  applyBrandAssets();
  addCaseProofToHome();

  window.AirAdmin8Analytics = Object.freeze({ trackEvent });
})();
