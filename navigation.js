'use strict';
(()=>{
 const items=[['Home','index.html'],['M1','module1.html'],['M2','module2.html'],['M3','module3.html'],['M4','module4.html'],['P1','p1.html'],['P2','p2.html'],['P3','p3.html'],['P4','p4.html'],['My System','my-system.html']];
 const current=location.pathname.split('/').pop();
 const html=items.map(([label,href])=>`<a href="${href}"${href===current?' class="active" aria-current="page"':''}>${label}</a>`).join('');
 const nav=document.getElementById('mainNav');if(nav){nav.innerHTML=html;return;}
 const existing=document.querySelector('nav.nav');if(existing){existing.innerHTML=html;}
})();
