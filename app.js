const menu=document.querySelector('.menu');
const nav=document.querySelector('nav');

if(nav){
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const productPages=new Set([
    'products-v3.html',
    'series-mobile-humanoid.html',
    'series-quadruped.html',
    'series-robot-arm.html',
    'solution-vla-kit.html',
    'product-agibot-g2.html',
    'product-unitree-g1d.html',
    'product-unitree-go2.html'
  ]);
  const navItems=[
    {href:'solutions.html',label:'ソリューション',active:path==='solutions.html'},
    {href:'products-v3.html',label:'製品比較',active:productPages.has(path)},
    {href:'physical-ai.html',label:'技術・SDK',active:path==='physical-ai.html'},
    {href:'index.html#process',label:'導入プロセス',active:false},
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
  window.addEventListener('resize',()=>{
    if(window.innerWidth>1000) closeMenu();
  });
}

document.querySelectorAll('footer div:last-child').forEach(links=>{
  links.innerHTML=[
    ['index.html','ホーム'],
    ['solutions.html','ソリューション'],
    ['products-v3.html','製品比較'],
    ['physical-ai.html','技術・SDK'],
    ['contact.html','お問い合わせ']
  ].map(([href,label])=>`<a href="${href}">${label}</a>`).join('');
});

document.querySelectorAll('a[href="index.html#solutions"],a[href="index.html#issues"]').forEach(link=>{
  link.setAttribute('href','solutions.html');
});

document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();
  alert('入力内容を確認しました。現在は送信先接続前のため、メールは送信されません。');
}));