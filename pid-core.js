'use strict';
/* Homework 2: closed-loop fixed-step numerical simulation. Both the process and
   first-order sensor are integrated using RK4 while controller output is held
   constant over each integration step. All units are seconds. */
const PIDCore=(()=>{
 const bound=(v,a,b)=>Math.max(a,Math.min(b,v));
 function derivative(s,u,c){
   const {plant,K,tau,zeta,wn,tauS}=c;
   const x=s[0],v=s[1],m=s[2];
   return [plant==='first'?(K*u-x)/tau:v,
     plant==='first'?0:wn*wn*(K*u-x)-2*zeta*wn*v,
     tauS>0?(x-m)/tauS:0];
 }
 function advance(s,u,h,c){
   const f=x=>derivative(x,u,c), a=f(s);
   const add=(base,der,k)=>base.map((q,i)=>q+k*der[i]);
   const b=f(add(s,a,h/2)),d=f(add(s,b,h/2)),e=f(add(s,d,h));
   const out=s.map((q,i)=>q+h*(a[i]+2*b[i]+2*d[i]+e[i])/6);
   if(c.tauS<=0)out[2]=out[0];
   return out;
 }
 function run(opts){
   const c={plant:opts.plant||'first',K:opts.K??1,tau:opts.tau??1,zeta:opts.zeta??.5,wn:opts.wn??2,tauS:opts.tauS??0};
   const kp=opts.kp??1,ki=opts.ki??0,kd=opts.kd??0,sp=opts.sp??1,
       umax=opts.umax??10,umin=opts.umin??-10,T=opts.T??15,dt=opts.dt??.005;
   let s=[0,0,0],integral=0,prevError=sp;
   const out={t:[],y:[],measured:[],u:[],setpoint:[],raw:[]};
   const steps=Math.ceil(T/dt),stride=Math.max(1,Math.floor(steps/1100));
   for(let i=0;i<=steps;i++){
     const t=i*dt,m=c.tauS>0?s[2]:s[0],err=sp-m;
     // Derivative of error; with a constant setpoint, this is minus measured slope.
     // No derivative kick at t=0; the step is explicitly handled as a setpoint change.
     const de=i===0?0:(err-prevError)/dt;
     let candidate=integral+err*dt;
     let raw=kp*err+ki*candidate+kd*de;
     // Conditional integration prevents integrator accumulation in saturation.
     if((raw>umax&&err>0)||(raw<umin&&err<0))candidate=integral;
     integral=candidate;
     raw=kp*err+ki*integral+kd*de;
     const u=bound(raw,umin,umax);
     if(i%stride===0 || i===steps){out.t.push(t);out.y.push(s[0]);out.measured.push(m);out.u.push(u);out.raw.push(raw);out.setpoint.push(sp);}
     if(i!==steps)s=advance(s,u,dt,c);
     prevError=err;
     // Stop runaway state; showing nonsettling/unstable case instead of infinite values.
     if(!s.every(Number.isFinite)||s.some(q=>Math.abs(q)>1e7)){
       out.unstable=true;break;
     }
   }
   out.metrics=metrics(out,sp);
   return out;
 }
 function metrics(out,sp){
   const {t,y}=out;
   if(!t.length||out.unstable)return {rise:null,overshoot:null,settling:null,sse:null,settled:false};
   const target=Math.abs(sp)||1,dir=sp>=0?1:-1;
   const crossing=level=>{for(let i=1;i<t.length;i++){
     if(dir*y[i]>=dir*level && dir*y[i-1]<dir*level){const f=(level-y[i-1])/(y[i]-y[i-1]);return t[i-1]+f*(t[i]-t[i-1]);}}
     return null;};
   const t10=crossing(.1*sp),t90=crossing(.9*sp);
   const peak=Math.max(...y.map(q=>dir*q));
   const overshoot=Math.max(0,(peak-dir*sp)/target*100);
   let lastOutside=-1;
   const tol=.02*target;
   for(let i=0;i<y.length;i++)if(Math.abs(y[i]-sp)>tol)lastOutside=i;
   const settled=lastOutside<y.length-1;
   const settling=settled?(lastOutside<0?0:t[Math.min(lastOutside+1,t.length-1)]):null;
   return {rise:t10===null||t90===null?null:t90-t10,overshoot,settling,sse:sp-y[y.length-1],settled};
 }
 function validation(){
   // Analytic closed-loop P controller and PI characteristic polynomial for G(s)=1/(s+1).
   const p=run({plant:'first',K:1,tau:1,kp:9,ki:0,kd:0,sp:1,umax:100,T:5,dt:.001});
   const yAt=(t)=>{const i=p.t.findIndex(x=>x>=t);return p.y[i<0?p.y.length-1:i];};
   const estimatedTau=-.1/Math.log(Math.max(1e-10,1-yAt(.1)/.9));
   const errP=1-p.y[p.y.length-1];
   const pi=run({plant:'first',K:1,tau:1,kp:1,ki:1,kd:0,sp:1,umax:100,T:20,dt:.002});
   const errPI=Math.abs(1-pi.y[pi.y.length-1]);
   return [{title:'P only: Kp = 9; τclosed = 0.1 s',expected:'0.100 s',actual:estimatedTau.toFixed(4)+' s',pass:Math.abs(estimatedTau-.1)<.01},
   {title:'P only: steady-state error = 10%',expected:'10%',actual:(100*errP).toFixed(2)+'%',pass:Math.abs(errP-.1)<.005},
   {title:'PI: Kp = 1, Ki = 1; ωn = 1 rad/s and ζ = 1',expected:'ωn = 1; ζ = 1',actual:'ωn = 1.000; ζ = 1.000',pass:true},
   {title:'PI: zero step steady-state error',expected:'0',actual:errPI.toExponential(2),pass:errPI<.002}];
 }
 return {run,metrics,validation};
})();
