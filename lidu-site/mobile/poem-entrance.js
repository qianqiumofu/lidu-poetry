(()=>{
const layer=document.querySelector('#poem-entrance'),canvas=document.querySelector('#entrance-canvas'),ctx=canvas.getContext('2d'),skip=document.querySelector('#skip-entrance');let frame=0,finish=null;
const n=i=>{const v=Math.sin(i*127.1+47.7)*43758.5453;return v-Math.floor(v)},mix=(a,b,t)=>a+(b-a)*t,ease=t=>t*t*(3-2*t),clamp=t=>Math.max(0,Math.min(1,t));
window.playPoemEntrance=(hideIntro,reveal)=>{if(finish)return;let start=null,shown=false,lastFrame=-Infinity;const textCache=new Map();let buildBudget=0;const phrases=Array.from({length:500},(_,i)=>{const row=LIDU.pairs[Math.floor(n(i+18)*LIDU.pairs.length)];return{text:row[i%2?3:1].replace(/[\p{P}\s]/gu,''),side:(i+Math.floor(i/64))%2?1:-1,depth:n(i+71),lane:i%64,delay:.12+4.5*Math.pow(i/499,.38)+n(i+45)*.12,duration:3.0+n(i+29)*.6}});const originalOverflow=document.body.style.overflow;document.body.style.overflow='hidden';layer.hidden=false;layer.style.opacity='1';hideIntro();
finish=()=>{if(!finish)return;cancelAnimationFrame(frame);if(!shown){reveal();shown=true}layer.hidden=true;ctx.clearRect(0,0,canvas.width,canvas.height);textCache.clear();document.body.style.overflow=originalOverflow;finish=null;document.querySelector('#map').focus({preventScroll:true})};skip.onclick=()=>finish?.();
function paint(time){if(time-lastFrame<32){frame=requestAnimationFrame(paint);return}const delta=Number.isFinite(lastFrame)?Math.min((time-lastFrame)/1000,.1):.033;lastFrame=time;buildBudget=8;if(start===null)start=time;const t=(time-start)/1000,w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,1.25);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const span=Math.min(w*.88,h*1.1),gather=ease(clamp((t-2)/2.8));
// Full-bleed parallel verse streams with restrained cinematic depth.
const ambient=ctx.createRadialGradient(w*.5,h*.5,0,w*.5,h*.5,w*.7);ambient.addColorStop(0,'rgba(53,87,108,.12)');ambient.addColorStop(.6,'rgba(16,35,51,.06)');ambient.addColorStop(1,'rgba(7,18,28,0)');ctx.fillStyle=ambient;ctx.fillRect(0,0,w,h);
for(let i=0;i<100;i++){ctx.globalAlpha=.10+n(i+87)*.18;ctx.fillStyle='#a8c0d1';ctx.fillRect(n(i+201)*w,n(i+301)*h,.6,.6)}ctx.globalAlpha=1;
for(let i=0;i<phrases.length;i++){
 const p=phrases[i],travel=(t-p.delay)/p.duration;if(travel<0||travel>1)continue;
 // A perspective crossing: distant verses emerge at the sides, pass through
 // a shared focal region and drift beyond the viewer, without fixed rows.
 const v=ease(travel),depth=.26+Math.pow(travel,1.7)*1.4;
 const initialY=(n(i+880)-.5)*h*1.5,oppositeY=(n(i+1880)-.5)*h*1.2;
 const bend=Math.sin(travel*Math.PI),x=w/2+p.side*(.70-v*1.52)*w*depth;
 const y=h/2+mix(initialY,oppositeY,v)*depth+Math.sin(i*2.399)*h*.12*bend;
 const fade=ease(clamp(travel*5))*ease(clamp((1-travel)*5));
 const hush=1-ease(clamp((t-7.2)/1.0));
 if(x< -300||x>w+300||y< -40||y>h+40||fade*hush<.015)continue;ctx.globalAlpha=fade*(.16+p.depth*.55)*hush;
 const size=((w<700?10:13)+p.depth*5)*(.65+depth*.65);
 const key=p.side+':'+p.text;let sprite=textCache.get(key);if(!sprite){if(buildBudget<=0)continue;buildBudget--;const tmp=document.createElement('canvas'),tc=tmp.getContext('2d');tc.font='18px "KaiTi", "STKaiti", "FangSong", serif';const sw=Math.ceil(tc.measureText(p.text).width)+20;tmp.width=sw;tmp.height=32;tc.font='18px "KaiTi", "STKaiti", "FangSong", serif';tc.fillStyle=p.side===1?'#e1d5bc':'#bcd4e3';tc.textBaseline='middle';tc.fillText(p.text,10,16);sprite=tmp;textCache.set(key,tmp)}const scale=size/18,sw=sprite.width*scale,sh=32*scale;ctx.drawImage(sprite,x-sw/2,y-sh/2,sw,sh);

}
const dots=ease(clamp((t-7.2)/1.6));if(dots>0)for(let i=0;i<positions.length;i+=6){const p=positions[i],swirl=(1-dots)*2.2,radius=Math.hypot(p.x-.5,p.y-.5),a=Math.atan2(p.y-.5,p.x-.5)+swirl,rr=radius*(1+(1-dots)*1.6),x=w/2+Math.cos(a)*rr*span,y=h/2+(Math.sin(a)*rr*.72+p.z*.7)*span;ctx.globalAlpha=dots*.8;ctx.fillStyle=p.bulge?'#fff0d7':p.arm?'#dec29c':'#c1d3e6';ctx.fillRect(x,y,Math.max(.5,p.radius),Math.max(.5,p.radius))}ctx.globalAlpha=1;const glow=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,span*.12);glow.addColorStop(0,'rgba(255,226,189,'+dots*.35+')');glow.addColorStop(1,'rgba(220,210,190,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
layer.querySelector('.entrance-caption').style.opacity=1-ease(clamp((t-8.2)/.6));if(t>8.8&&!shown){reveal();shown=true}layer.style.background=t>8.8?'transparent':'#0b1722';layer.style.opacity=String(1-ease(clamp((t-8.8)/1.0)));if(t>=9.8){finish();return}frame=requestAnimationFrame(paint)}frame=requestAnimationFrame(paint);
};
})();
