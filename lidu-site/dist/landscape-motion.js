(()=>{
const cover=document.querySelector('#prologue'),canvas=document.querySelector('#landscape-motion'),ctx=canvas.getContext('2d'),media=matchMedia('(prefers-reduced-motion: reduce)'),image=new Image();let frame=0,last=0,clock=0;
image.src='lidu-night-mountains.png';
function stop(){cancelAnimationFrame(frame);frame=0;last=0}
function start(){if(image.complete&&image.naturalWidth&&!cover.hidden&&!document.hidden&&!frame)frame=requestAnimationFrame(paint)}
function paint(time){frame=0;if(cover.hidden||document.hidden){last=0;return}if(last&&time-last<42){frame=requestAnimationFrame(paint);return}clock+=last?Math.min((time-last)/1000,.12):0;last=time;const rect=cover.getBoundingClientRect(),w=rect.width,h=rect.height;if(!w||!h)return;const dpr=Math.min(devicePixelRatio||1,1.5);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const iw=image.naturalWidth,ih=image.naturalHeight,scale=Math.max(w/iw,h/ih),dw=iw*scale,dh=ih*scale,ox=(w-dw)*(w<700?.65:.5),oy=(h-dh)*.5;ctx.drawImage(image,ox,oy,dw,dh);
if(!media.matches){
// Warp only existing image pixels; all lighting and clouds come from the original artwork.
const patches=[{x:.07,y:.47,w:.72,h:.09,amplitude:8,speed:.12},{x:.12,y:.58,w:.69,h:.085,amplitude:6,speed:.10},{x:.50,y:.36,w:.48,h:.065,amplitude:4,speed:.09}];
for(let j=0;j<patches.length;j++){const p=patches[j],rows=Math.ceil(p.h*ih/3);for(let row=0;row<rows;row++){const t=row/rows,sy=(p.y+t*p.h)*ih,sh=Math.min(3,ih-sy),feather=Math.sin(t*Math.PI)**2;ctx.globalAlpha=feather*.8;const shift=(Math.sin(clock*p.speed+j+t*.9)-Math.sin(j+t*.9))*p.amplitude;const strips=18;for(let k=0;k<strips;k++){const u=(k+.5)/strips,sx=(p.x+k/strips*p.w)*iw,sw=p.w*iw/strips;ctx.globalAlpha=feather*Math.sin(u*Math.PI)**2*.85;ctx.drawImage(image,sx+shift,sy,sw,sh,ox+sx*scale,oy+sy*scale,sw*scale,sh*scale)}}}
ctx.globalAlpha=1;
// Refract the river's own silver reflection, following its winding shoreline.
for(let row=0;row<150;row++){const d=row/150,sy=(.705+d*.178)*ih;let center=d<.3?.751-d*.09:d<.67?.724+(d-.3)*.14:.776-(d-.67)*.45;const half=.006+d*.028,sx=(center-half)*iw,sw=half*2*iw,sh=.178*ih/150+1;const shift=Math.sin(clock*1.05+d*53)*(.7+d*2.6);const strips=12;for(let k=0;k<strips;k++){const u=(k+.5)/strips,part=sw/strips,x=sx+k*part;ctx.globalAlpha=Math.sin(u*Math.PI)**2*Math.sin(d*Math.PI)**.5;ctx.drawImage(image,x+shift,sy+Math.sin(clock*.8+d*45)*.4,part,sh,ox+x*scale,oy+sy*scale,part*scale,sh*scale)}}ctx.globalAlpha=1;
}
if(!media.matches)frame=requestAnimationFrame(paint)}
image.onload=start;new MutationObserver(()=>cover.hidden?stop():start()).observe(cover,{attributes:true,attributeFilter:['hidden','style']});document.addEventListener('visibilitychange',()=>document.hidden?stop():start());media.addEventListener('change',()=>{stop();start()});start();
})();
