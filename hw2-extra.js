'use strict';
/* Zero-order-hold digital PID. Plant integrated by RK4 in substeps; control is
   recalculated only every Ts. Finite-duration simulation, conditional antiwindup. */
const H2Extra=(()=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function digital(o){
  const K=o.K??1,tau=o.tau??1,kp=o.kp??1,ki=o.ki??0,kd=o.kd??0,Ts=o.Ts??.05,sp=o.sp??1;
  const T=o.T??14,umax=o.umax??10,umin=o.umin??-umax,anti=o.anti!==false;
  const h=Ts/Math.max(1,Math.ceil(Ts/.004));
  let y=0,u=0,integ=0,prevErr=sp,raw=0;
  const out={t:[],y:[],u:[],raw:[],setpoint:[],samples:[]};
  const f=(x)=> (K*u-x)/tau;
  const evolve=(x,dt)=>{const a=f(x),b=f(x+a*dt/2),c=f(x+b*dt/2),d=f(x+c*dt);return x+dt*(a+2*b+2*c+d)/6;};
  let t=0;const n=Math.ceil(T/Ts);
  for(let k=0;k<=n;k++){
   let error=sp-y;
   let cand=integ+error*Ts;
   let deriv=k===0?0:(error-prevErr)/Ts;
   raw=kp*error+ki*cand+kd*deriv;
   if(anti&&((raw>umax&&error>0)||(raw<umin&&error<0)))cand=integ;
   integ=cand;raw=kp*error+ki*integ+kd*deriv;
   u=clamp(raw,umin,umax);prevErr=error;
   out.samples.push({t,y,u,error});
   const dtFull=Math.min(T-t,Ts);
   if(dtFull<0)break;
   let remaining=dtFull;
   while(remaining>1e-10){
    const dt=Math.min(h,remaining);
    out.t.push(t);out.y.push(y);out.u.push(u);out.raw.push(raw);out.setpoint.push(sp);
    y=evolve(y,dt);t+=dt;remaining-=dt;
    if(!Number.isFinite(y)||Math.abs(y)>1e7){out.unstable=true;break;}
   }
   if(out.unstable||t>=T-1e-8)break;
  }
  out.t.push(t);out.y.push(y);out.u.push(u);out.raw.push(raw);out.setpoint.push(sp);
  out.metrics=PIDCore.metrics(out,sp);return out;
 }
 function arduino(o){
 const N=n=>Number(n).toFixed(3);
 return `// Educational Arduino PID template — adjust pins and sensor scaling.\n// Generated from current gains. Sampling interval Ts = ${N(o.Ts)} s.\nconst int PWM_PIN = 9;\nconst int SENSOR_PIN = A0;\nconst float Kp = ${N(o.kp)}f;\nconst float Ki = ${N(o.ki)}f;\nconst float Kd = ${N(o.kd)}f;\nconst float Ts = ${N(o.Ts)}f;\nconst float SETPOINT = ${N(o.sp)}f;\nconst float U_MIN = 0.0f, U_MAX = 255.0f;\nfloat integral = 0.0f, lastError = 0.0f;\nunsigned long lastStep = 0;\nvoid setup() { pinMode(PWM_PIN, OUTPUT); lastStep = millis(); }\nvoid loop() {\n  const unsigned long period = (unsigned long)(Ts * 1000.0f);\n  if (millis() - lastStep < period) return;\n  lastStep += period;\n  // Replace with calibration and units matching SETPOINT.\n  const float measurement = analogRead(SENSOR_PIN) / 1023.0f;\n  const float error = SETPOINT - measurement;\n  const float derivative = (error - lastError) / Ts;\n  const float candidate = integral + error * Ts;\n  float proposed = Kp * error + Ki * candidate + Kd * derivative;\n  ${o.anti?'// Conditional integration: prevent windup while saturated.':'// Anti-windup disabled for this demonstration.'}\n  ${o.anti?'if (!((proposed > U_MAX && error > 0) || (proposed < U_MIN && error < 0))) integral = candidate;':'integral = candidate;'}\n  proposed = Kp * error + Ki * integral + Kd * derivative;\n  const float bounded = constrain(proposed, U_MIN, U_MAX);\n  analogWrite(PWM_PIN, (int)bounded);\n  lastError = error;\n}`;
 }
 return {digital,arduino};
})();
