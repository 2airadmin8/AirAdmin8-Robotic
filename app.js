const menu=document.querySelector('.menu');
const nav=document.querySelector('nav');

if(nav){
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const navItems=[
    ['solutions.html','ソリューション'],
    ['products-v3.html','製品比較'],
    ['physical-ai.html','技術・SDK'],
    ['index.html#process','導入プロセス'],
    ['contact.html','相談する']
  ];
  nav.innerHTML=navItems.map(([href,label],index)=>{
    const target=href.split('#')[0].toLowerCase();
    const current=path===target;
    const cls=index===navItems.length-1?' class="nav-cta"':'';
    const aria=current?' aria-current="page"':'';
    return `<a href="${href}"${cls}${aria}>${label}</a>`;
  }).join('');
}

if(menu&&nav){
  menu.addEventListener('click',()=>{
    const open=nav.classList.toggle('is-open');
    menu.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded','false');
  }));
  window.addEventListener('resize',()=>{
    if(window.innerWidth>1000){
      nav.classList.remove('is-open');
      menu.setAttribute('aria-expanded','false');
    }
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

document.querySelectorAll('a[href="index.html#solutions"]').forEach(link=>link.setAttribute('href','solutions.html'));
document.querySelectorAll('a[href="index.html#issues"]').forEach(link=>link.setAttribute('href','solutions.html'));

document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();
  alert('入力内容を確認しました。現在は送信先接続前のため、メールは送信されません。');
}));