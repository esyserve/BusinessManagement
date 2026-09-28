const plans={
 static:{
  name:"Static Portfolio Website",
  annual:null,
  lifetime:[3600,3900,4200,4500,4800,5100,5400,5700,6000,6300],
  stepLifetime:300,
  billing:"lifetime",
  best:["Personal portfolios","Small business websites","Professional presence"],
  note:"Static website is lifetime-only. Domain + hosting are external. Future editing or changes are charged separately."
 },
 dynamic:{
  name:"Dynamic Portfolio Website",
  annual:[8000,9000,10000,11000,12000,13000,14000,15000,16000,17000],
  lifetime:[21000],
  stepAnnual:1000,
  stepLifetime:0,
  billing:"annual",
  best:["Manageable portfolio","Content-driven businesses","Growing brands"],
  note:"Dynamic Portfolio is available yearly or lifetime. Employee/user capacity depends on hosting/server resources. Domain + hosting are external."
 },
 management:{
  name:"Full Management System",
  annual:[16000,18000,20000,22000,24000,26000,28000,30000,32000,34000],
  lifetime:null,
  stepAnnual:2000,
  billing:"annual",
  best:["Employee operations","Attendance & leave","Business administration"],
  note:"Management System is a yearly software/support plan. Domain + hosting are external."
 },
 workforce:{
  name:"Complete Workforce",
  annual:[35000,39000,43000,47000,51000,55000,59000,63000,67000,71000],
  lifetime:null,
  stepAnnual:4000,
  billing:"annual",
  best:["Growing teams","Attendance ecosystem","HR + workforce operations"],
  note:"Complete Workforce is a yearly software/support plan. Domain + hosting and physical hardware are external."
 }
};
const money=n=>"₹"+Number(n).toLocaleString("en-IN");
function activeBilling(key){ return plans[key].billing; }
function priceAt(key,units){
 const p=plans[key],billing=p.billing,arr=billing==="lifetime"?p.lifetime:p.annual;
 if(key==="dynamic") return billing==="lifetime"?arr[0]:arr[0];
 const step=billing==="lifetime"?(p.stepLifetime||p.step):(p.stepAnnual||p.step),blocks=Math.max(1,Math.ceil(units/100));
 return blocks<=10?arr[blocks-1]:arr[9]+(blocks-10)*step;
}

const body=document.querySelector("#pricingBody"),note=document.querySelector("#pricingNote"),tabs=document.querySelectorAll(".pricing-tab"),priceHeading=document.querySelector("#priceHeading"),calcPlan=document.querySelector("#calcPlan"),calcUnits=document.querySelector("#calcUnits"),calcScale=document.querySelector("#calcScale"),calcDesc=document.querySelector("#calcDesc"),billingWrap=document.querySelector("#billingWrap"),dynamicAnnualBtn=document.querySelector("#dynamicAnnualBtn"),dynamicLifetimeBtn=document.querySelector("#dynamicLifetimeBtn");
let dynamicBilling="annual";

function renderTable(key){
 const p=plans[key],billing=key==="dynamic"?dynamicBilling:p.billing,arr=billing==="lifetime"?p.lifetime:p.annual,step=billing==="lifetime"?(p.stepLifetime||p.step):(p.stepAnnual||p.step);
 priceHeading.textContent=key==="dynamic"?"Price":(billing==="lifetime"?"Lifetime Price":"Annual Price");
 body.innerHTML="";
 if(key==="dynamic"){
  const rows=billing==="lifetime"?[{scale:"Lifetime",price:arr[0],best:"One-time software license"}]:arr.map((price,i)=>({scale:`${(i+1)*100}`,price,best:"Annual software & support"}));
  rows.forEach((row,i)=>body.insertAdjacentHTML("beforeend",`<tr><td><strong>${row.scale}</strong></td><td><strong>${money(row.price)}</strong> <span class='table-badge'>${billing==="lifetime"?"Lifetime":"Yearly"}</span></td><td>${row.best}. Employee/user limit depends on the selected hosting plan.</td><td><a class="row-action" href="#contact">Get Quote <i class="bi bi-arrow-right"></i></a></td></tr>`));
 } else {
  for(let i=0;i<10;i++){
   const n=(i+1)*100,price=money(arr[i]);
   const badge=i===0?"<span class='table-badge'>Starting Plan</span>":key==="management"&&i===4?"<span class='table-badge'>Business</span>":key==="workforce"&&i===9?"<span class='table-badge'>Enterprise</span>":"";
   body.insertAdjacentHTML("beforeend",`<tr><td><strong>${n}</strong></td><td><strong>${price}</strong> ${badge}</td><td>${p.best[i<3?i%3:2]}</td><td><a class="row-action" href="#contact">Get Quote <i class="bi bi-arrow-right"></i></a></td></tr>`);
  }
 }
 note.textContent=p.note+` Pricing shown ${billing==="lifetime"?"as a one-time lifetime software amount.":"per year."} Domain + hosting remain external.`;
}
function priceAtCurrent(key,units){
 const p=plans[key],billing=key==="dynamic"?dynamicBilling:p.billing,arr=billing==="lifetime"?p.lifetime:p.annual;
 if(key==="dynamic") return arr[0];
 const step=billing==="lifetime"?(p.stepLifetime||p.step):(p.stepAnnual||p.step),blocks=Math.max(1,Math.ceil(units/100));
 return blocks<=10?arr[blocks-1]:arr[9]+(blocks-10)*step;
}
function syncBillingControls(key){
 const fixed=plans[key].billing;
 const isDynamic=key==="dynamic";
 const annualActive=isDynamic ? dynamicBilling==="annual" : fixed==="annual";
 const lifetimeActive=isDynamic ? dynamicBilling==="lifetime" : fixed==="lifetime";
 dynamicAnnualBtn.classList.toggle("active",annualActive);
 dynamicLifetimeBtn.classList.toggle("active",lifetimeActive);
 dynamicAnnualBtn.disabled=!isDynamic && fixed!=="annual";
 dynamicLifetimeBtn.disabled=!isDynamic && fixed!=="lifetime";
 dynamicAnnualBtn.setAttribute("aria-pressed",annualActive);
 dynamicLifetimeBtn.setAttribute("aria-pressed",lifetimeActive);
 dynamicAnnualBtn.setAttribute("aria-disabled",String(dynamicAnnualBtn.disabled));
 dynamicLifetimeBtn.setAttribute("aria-disabled",String(dynamicLifetimeBtn.disabled));
 billingWrap.dataset.plan=key;
}
function updateCalc(){
 const key=calcPlan.value,n=Math.max(1,parseInt(calcUnits.value||1,10));
 calcScale.textContent=key==="dynamic"?"Employee/user limit: based on your hosting plan":`Requirement scale: ${(Math.ceil(n/100)*100).toLocaleString("en-IN")}`;
 calcDesc.textContent=`${key==="dynamic"?"Employee/user capacity depends on hosting/server resources. ":""}Domain + hosting are external. Pricing is shown only in the Pricing section.`;
 syncBillingControls(key);
 tabs.forEach(t=>t.classList.toggle("active",t.dataset.plan===key));
}
tabs.forEach(t=>t.addEventListener("click",()=>{calcPlan.value=t.dataset.plan;renderTable(t.dataset.plan);updateCalc()}));
dynamicAnnualBtn.addEventListener("click",()=>{if(dynamicAnnualBtn.disabled)return;dynamicBilling="annual";if(calcPlan.value==="dynamic")renderTable("dynamic");updateCalc()});
dynamicLifetimeBtn.addEventListener("click",()=>{if(dynamicLifetimeBtn.disabled)return;dynamicBilling="lifetime";if(calcPlan.value==="dynamic")renderTable("dynamic");updateCalc()});
calcPlan.addEventListener("change",()=>{renderTable(calcPlan.value);updateCalc()});
calcUnits.addEventListener("input",updateCalc);
renderTable("static");updateCalc();

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");const bars=e.target.querySelectorAll(".progress-bar");bars.forEach(b=>b.style.width=(b.dataset.width||0)+"%");observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(e=>observer.observe(e));

const nav=document.querySelector("#siteNav"),back=document.querySelector("#backTop");
addEventListener("scroll",()=>{nav.classList.toggle("scrolled",scrollY>18);back.classList.toggle("show",scrollY>500)},{passive:true});
back.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
document.querySelectorAll("#navMenu .nav-link").forEach(a=>a.addEventListener("click",()=>{const menu=document.querySelector("#navMenu");if(menu.classList.contains("show"))bootstrap.Collapse.getOrCreateInstance(menu).hide()}));
document.querySelector("#year").textContent=new Date().getFullYear();

const canvas=document.querySelector("#priceChart"),ctx=canvas.getContext("2d");
function roundRect(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath()}
function drawChart(){
 const dpr=devicePixelRatio||1,w=canvas.clientWidth,h=350;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const labels=["Static","Dynamic","Management","Workforce"],vals=[3600,8000,16000,35000],max=40000,p={l:62,r:25,t:35,b:70},cw=w-p.l-p.r,ch=h-p.t-p.b;
 ctx.font="11px Inter";ctx.textAlign="right";ctx.fillStyle="#858893";ctx.strokeStyle="#e8e8ee";ctx.lineWidth=1;
 for(let i=0;i<=4;i++){let y=p.t+ch-(ch*i/4);ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(w-p.r,y);ctx.stroke();ctx.fillText(money(max*i/4),p.l-9,y+4)}
 const gap=cw/4,bw=Math.min(95,gap*.55);
 labels.forEach((lab,i)=>{const bh=ch*vals[i]/max,x=p.l+gap*i+gap/2-bw/2,y=p.t+ch-bh;const g=ctx.createLinearGradient(0,y,0,p.t+ch);g.addColorStop(0,"#6C5CE7");g.addColorStop(1,"#9b92ee");ctx.fillStyle=g;roundRect(ctx,x,y,bw,bh,10);ctx.fill();ctx.fillStyle="#24252b";ctx.textAlign="center";ctx.font="800 12px Inter";ctx.fillText(money(vals[i]),x+bw/2,y-9);ctx.fillStyle="#70747D";ctx.font="600 11px Inter";ctx.fillText(lab,x+bw/2,p.t+ch+25)});
}
addEventListener("resize",drawChart);drawChart();
