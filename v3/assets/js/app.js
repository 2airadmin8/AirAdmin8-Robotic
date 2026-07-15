(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-button');
  const navigation = document.querySelector('.global-nav');
  const productList = document.getElementById('product-list');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navigation.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  async function renderProducts() {
    if (!productList) return;

    try {
      const response = await fetch('data/products.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const products = await response.json();

      productList.innerHTML = products
        .map((product) => `
          <article class="product-card">
            <p class="eyebrow">${product.maker}</p>
            <h3>${product.name}</h3>
            <p>${product.summary}</p>
            <div class="meta">
              <span class="tag">${product.category}</span>
              <span class="tag">${product.status}</span>
            </div>
            <p>${product.uses.join('・')}</p>
          </article>
        `)
        .join('');
    } catch (error) {
      console.error('製品データの読み込みに失敗しました。', error);
      productList.innerHTML = '<p>製品情報を読み込めませんでした。</p>';
    }
  }

  renderProducts();
})();