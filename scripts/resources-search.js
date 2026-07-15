/* ============================================================
 * AirAdmin8 Robotics / Resource Search
 * ------------------------------------------------------------
 * 資料ナビの絞り込み条件をまとめて適用します。
 * 入力中に結果が頻繁に変わらないよう、検索ボタンを主操作とします。
 * ============================================================ */

(() => {
  'use strict';

  const resourceList = document.getElementById('resource-list');
  const filterPanel = document.querySelector('.filters');

  if (!resourceList || !filterPanel) return;

  const manufacturerFilter = document.getElementById('manufacturer-filter');
  const productFilter = document.getElementById('product-filter');
  const typeFilter = document.getElementById('type-filter');
  const keywordFilter = document.getElementById('keyword-filter');

  /**
   * 現在の入力条件と一致する資料だけを表示します。
   */
  function applyFilters() {
    const manufacturer = manufacturerFilter.value;
    const product = productFilter.value;
    const type = typeFilter.value;
    const keyword = keywordFilter.value.trim().toLowerCase();

    let visibleCount = 0;

    resourceList.querySelectorAll('.resource').forEach((resource) => {
      const matchesManufacturer =
        manufacturer === 'all' || resource.dataset.manufacturer === manufacturer;
      const matchesProduct =
        product === 'all' ||
        resource.dataset.product === product ||
        resource.dataset.product === 'all';
      const matchesType = type === 'all' || resource.dataset.type === type;
      const matchesKeyword =
        keyword === '' || resource.textContent.toLowerCase().includes(keyword);

      const shouldShow =
        matchesManufacturer && matchesProduct && matchesType && matchesKeyword;

      resource.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });

    resultStatus.textContent = `${visibleCount}件の資料を表示しています。`;
  }

  /**
   * 条件を初期化し、全資料を再表示します。
   */
  function resetFilters() {
    manufacturerFilter.value = 'all';
    productFilter.value = 'all';
    typeFilter.value = 'all';
    keywordFilter.value = '';
    applyFilters();
  }

  const actionArea = document.createElement('div');
  actionArea.className = 'resource-search-actions';
  actionArea.innerHTML = `
    <button class="btn primary" type="button" data-resource-search>
      この条件で検索する
    </button>
    <button class="btn ghost" type="button" data-resource-reset>
      条件をクリア
    </button>
  `;

  const resultStatus = document.createElement('p');
  resultStatus.className = 'resource-search-status';
  resultStatus.setAttribute('role', 'status');
  resultStatus.setAttribute('aria-live', 'polite');

  filterPanel.append(actionArea, resultStatus);

  actionArea
    .querySelector('[data-resource-search]')
    .addEventListener('click', applyFilters);

  actionArea
    .querySelector('[data-resource-reset]')
    .addEventListener('click', resetFilters);

  keywordFilter.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    applyFilters();
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('manufacturer')) manufacturerFilter.value = params.get('manufacturer');
  if (params.get('product')) productFilter.value = params.get('product');
  if (params.get('type')) typeFilter.value = params.get('type');

  applyFilters();
})();