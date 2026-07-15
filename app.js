const menu=document.querySelector('.menu');
const nav=document.querySelector('nav');

if(nav){
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const productPages=new Set([
    'products-v3.html','series-mobile-humanoid.html','series-quadruped.html',
    'series-robot-arm.html','solution-vla-kit.html','product-agibot-g2.html',
    'product-unitree-g1d.html','product-unitree-go2.html'
  ]);
  const manufacturerPages=new Set(['manufacturers.html','manufacturer-agibot.html','resources.html']);
  const solutionPages=new Set(['solutions.html','task-lab-automation.html']);
  const supportPages=new Set(['support.html','case-university-selection.html']);
  const navItems=[
    {href:'solutions.html',label:'ソリューション',active:solutionPages.has(path)},
    {href:'products-v3.html',label:'製品比較',active:productPages.has(path)},
    {href:'manufacturers.html',label:'メーカー・資料',active:manufacturerPages.has(path)},
    {href:'physical-ai.html',label:'技術・SDK',active:path==='physical-ai.html'},
    {href:'support.html',label:'導入・サポート',active:supportPages.has(path)},
    {href:'contact.html',label:'相談する',active:path==='contact.html',cta:true}
  ];
  nav.innerHTML=navItems.map(item=>{
    const cls=item.cta?' class="nav-cta"':'';
    const aria=item.active?' aria-current="page"':'';
    return `<a href="${item.href}"${cls}${aria}>${item.label}</a>`;
  }).join('');
}

if(menu&&nav){
  const closeMenu=()=>{
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','メニューを開く');
  };
  menu.addEventListener('click',()=>{
    const open=nav.classList.toggle('is-open');
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く');
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  window.addEventListener('resize',()=>{if(window.innerWidth>1000) closeMenu();});
}

document.querySelectorAll('footer div:last-child').forEach(links=>{
  links.innerHTML=[
    ['index.html','ホーム'],['solutions.html','ソリューション'],
    ['task-lab-automation.html','タスク比較'],['products-v3.html','製品比較'],
    ['manufacturers.html','メーカー'],['resources.html','開発資料ナビ'],
    ['case-university-selection.html','支援事例'],['support.html','導入・サポート'],
    ['physical-ai.html','技術・SDK'],['contact.html','お問い合わせ']
  ].map(([href,label])=>`<a href="${href}">${label}</a>`).join('');
});

document.querySelectorAll('a[href="index.html#solutions"],a[href="index.html#issues"]').forEach(link=>{
  link.setAttribute('href','solutions.html');
});

const wordingMap=new Map([
  ['日本導入','国内導入・社会実装'],
  ['納期、保証、無線、電池、日文資料。','調達、法規、安全、納期、保証、保守、運用体制。'],
  ['価格、納期、保証、無線・電池、購買。','調達、法規、安全、価格、納期、保証、保守、運用まで。']
]);
document.querySelectorAll('h3,th,p').forEach(element=>{
  const normalized=element.textContent.trim();
  if(wordingMap.has(normalized)) element.textContent=wordingMap.get(normalized);
});

// ホームでは、社会的な目的の直後に「何をする会社か」を明示する。
const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
if(page==='index.html'){
  const hero=document.querySelector('main > section');
  if(hero&&!document.getElementById('what-we-do')){
    const section=document.createElement('section');
    section.id='what-we-do';
    section.className='section';
    section.innerHTML=`
      <div class="section-head">
        <p class="kicker">WHAT WE DO</p>
        <h2>AIロボットを、選ぶ・つなぐ・実装する。</h2>
        <p class="lead">メーカーや製品ありきではなく、課題・環境・予算から複数案を比較。ロボット本体、SDK・ROS、センサー、データ、VLAをつなぎ、PoCから調達・運用まで支援します。</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px" class="a8-role-grid">
        <article class="card"><b>01 選ぶ</b><h3>最適な候補を比較する</h3><p>同じタスクに複数の形態・メーカーを並べ、強み、弱み、未確認事項を整理します。</p></article>
        <article class="card"><b>02 つなぐ</b><h3>技術とシステムを接続する</h3><p>本体、ハンド、センサー、SDK、ROS、API、データ収集、VLAを一つの構成にします。</p></article>
        <article class="card"><b>03 実装する</b><h3>現場で使える状態まで進める</h3><p>PoC、評価、調達、安全、初期設定、教育、保守・運用まで一貫して支援します。</p></article>
      </div>
      <div class="center-cta"><a class="btn primary" href="solutions.html">課題から探す</a><a class="btn ghost" href="manufacturers.html">メーカーから探す</a></div>`;
    hero.insertAdjacentElement('afterend',section);
  }
}

// 製品詳細から、同カテゴリ比較・メーカー全体・製品資料へ迷わず移動できるようにする。
if(page==='product-agibot-g2.html'){
  const main=document.querySelector('main');
  if(main&&!document.getElementById('related-navigation')){
    const section=document.createElement('section');
    section.id='related-navigation';
    section.className='section soft';
    section.innerHTML=`<div class="section-head"><p class="kicker">RELATED NAVIGATION</p><h2>比較・メーカー・開発資料を行き来する。</h2></div><div class="center-cta"><a class="btn primary" href="series-mobile-humanoid.html">同カテゴリと比較する</a><a class="btn ghost" href="manufacturer-agibot.html">AGIBOT全体を見る</a><a class="btn ghost" href="resources.html?manufacturer=agibot&product=g2">G2の開発資料を見る</a></div>`;
    main.appendChild(section);
  }
}

document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();
  alert('入力内容を確認しました。現在は送信先接続前のため、メールは送信されません。');
}));