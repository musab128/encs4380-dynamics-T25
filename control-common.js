'use strict';
const byId=id=>document.getElementById(id);
const color={paper:'#162238',font:'#ecf3ff',grid:'#34445a'};
const plotConfig={responsive:true,displaylogo:false,modeBarButtonsToRemove:['lasso2d','select2d']};
function graphLayout(ylab='Response') {return {paper_bgcolor:color.paper,plot_bgcolor:color.paper,font:{color:color.font,size:12},margin:{l:60,r:22,t:12,b:62},xaxis:{title:'Time (s)',gridcolor:color.grid},yaxis:{title:ylab,gridcolor:color.grid},legend:{orientation:'h',y:-.26,x:0},hovermode:'x unified'};}
function getVal(id){return +byId(id).value;}
function slider(id,d=2,unit=''){byId(id+'Value').textContent=getVal(id).toFixed(d)+unit;return getVal(id);}
function fmt(n,unit='',dec=3){return n===null||!Number.isFinite(n)?'Not reached':n.toFixed(dec)+unit;}
function showMetrics(data){let m=data.metrics;byId('metrics').innerHTML=[['Rise time (10–90%)',fmt(m.rise,' s')],['Overshoot',fmt(m.overshoot,' %',1)],['Settling time (±2%)',fmt(m.settling,' s')],['Steady-state error at end',fmt(m.sse,'',4)]].map(([a,b])=>`<div class="metric"><span>${a}</span><strong>${b}</strong></div>`).join('');}
function validationUI(){byId('validation').innerHTML=PIDCore.validation().map(c=>`<div class="test"><div><strong>${c.title}</strong><div class="hint">Expected: ${c.expected} · Computed: ${c.actual}</div></div><strong class="${c.pass?'pass':'fail'}">${c.pass?'PASS':'FAIL'}</strong></div>`).join('');}
function predict(set){let idx=0;const q=byId('question'),a=byId('answers'),r=byId('predictionResult');function next(){let p=set[idx];q.textContent=p.q;a.innerHTML=p.answers.map(([val,name])=>`<label class="choice"><input type="radio" name="prediction" value="${val}"> ${name}</label>`).join('');r.textContent='Choose an answer, then check the plots.';}byId('checkPrediction').onclick=()=>{let selected=document.querySelector('[name=prediction]:checked');r.textContent=!selected?'Choose one answer first.':(selected.value===set[idx].right?'Correct. ':'Try again. ')+set[idx].explain;};byId('newQuestion').onclick=()=>{idx=(idx+1)%set.length;next();};next();}
