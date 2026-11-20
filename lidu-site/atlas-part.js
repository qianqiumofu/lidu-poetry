const canvas=$('#map'),ctx=canvas.getContext('2d');let view={scale:1,x:0,y:0},width=1200,height=700,activeNodes=[],drag=null,hover=null,frame=0;
const noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
// A stable pair of interwoven river currents; positions are poetic, not a similarity projection.
let yaw=-.22,pitch=.55;
// Loose spiral arms, a thick central bulge and a dispersed stellar halo.
const positions=all.map(({r,id})=>{const u=noise(id+1),v=noise(id+9),arm=id%2,bulge=noise(id+81)<.22;let radius,angle,z;if(bulge){radius=.105*Math.pow(u,.7);angle=v*Math.PI*2;z=(noise(id+51)-.5)*.055}else{radius=.008+.425*Math.pow(u,1.02);const scatter=noise(id+22)+noise(id+23)+noise(id+24)-1.5;angle=arm*Math.PI+Math.log(1+radius*17)*2.7+scatter*(.62+.48*Math.exp(-radius*16));z=(noise(id+51)+noise(id+52)-1)*.022}return{x:.5+Math.cos(angle)*radius,y:.5+Math.sin(angle)*radius,z,radius:.20+(r[4]-7000)/3000*.82,arm,bulge,glint:false}});

let mode='galaxy',phase=0,lastTime=0,lastPaint=0;const reduced=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function draw(){cancelAnimationFrame(frame);frame=requestAnimationFrame(paint)}
function paint(time=0){textureBuilds=0;frame=0;const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height){lastTime=0;return}if(time-lastPaint<32&&time){frame=requestAnimationFrame(paint);return}const dt=lastTime?Math.min((time-lastTime)/1000,.1):0;lastTime=time;lastPaint=time;if(mode==='galaxy'&&!reduced())phase+=dt*.035;
width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);const dark=mode==='galaxy',span=Math.min(width*.88,height*1.1),project=p=>{let x=p.x-.5,y=p.y-.5;const xx=x*Math.cos(phase)-y*Math.sin(phase),yy=x*Math.sin(phase)+y*Math.cos(phase);return{x:width/2+view.x+(dark?xx:x)*span*view.scale,y:height/2+view.y+(dark?yy*.72+(p.z||0)*.7:y*.86)*span*view.scale,depth:p.z||0}};
ctx.fillStyle=dark?'#0b1722':'#f4f1e7';ctx.fillRect(0,0,width,height);activeNodes=[];
if(dark){
// A deep field of cold stars and diffuse clouds, independent of the rotating galaxy.
ctx.save();ctx.globalCompositeOperation='lighter';
for(let i=0;i<16;i++){const x=noise(i+870)*width,y=noise(i+970)*height,rr=Math.max(width,height)*(.12+noise(i+1070)*.22),g=ctx.createRadialGradient(x,y,0,x,y,rr);const color=i%3===0?'104,72,121':i%3===1?'46,84,129':'69,97,113';g.addColorStop(0,'rgba('+color+','+(.025+noise(i+1100)*.035)+')');g.addColorStop(.4,'rgba('+color+',.015)');g.addColorStop(1,'rgba('+color+',0)');ctx.fillStyle=g;ctx.fillRect(x-rr,y-rr,rr*2,rr*2)}
for(let i=0;i<1150;i++){const depth=noise(i+777),px=noise(i+900)*width,py=noise(i+1900)*height,r=.23+depth*depth*.9,pulse=1;ctx.globalAlpha=pulse;ctx.fillStyle='rgba(208,224,247,'+(.12+depth*.49)+')';ctx.fillRect(px,py,r,r);if(false){const rr=5+depth*4,g=ctx.createRadialGradient(px,py,0,px,py,rr);g.addColorStop(0,'rgba(224,235,255,.45)');g.addColorStop(.15,'rgba(164,199,249,.18)');g.addColorStop(1,'rgba(122,170,240,0)');ctx.fillStyle=g;ctx.fillRect(px-rr,py-rr,rr*2,rr*2);ctx.strokeStyle='rgba(207,226,255,.26)';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(px-3,py);ctx.lineTo(px+3,py);ctx.moveTo(px,py-3);ctx.lineTo(px,py+3);ctx.stroke()}}
ctx.globalAlpha=1;const core=project({x:.5,y:.5,z:0});for(const [size,alpha] of [[.36,.10],[.19,.12],[.08,.23],[.028,.42],[.009,.75]]){const rr=span*size*view.scale,g=ctx.createRadialGradient(core.x,core.y,0,core.x,core.y,rr);g.addColorStop(0,'rgba(255,228,194,'+alpha+')');g.addColorStop(.38,'rgba(202,185,163,'+(alpha*.35)+')');g.addColorStop(1,'rgba(170,183,210,0)');ctx.fillStyle=g;ctx.fillRect(core.x-rr,core.y-rr,rr*2,rr*2)}
// Cloudy luminous knots follow both arms, leaving darker channels between them.
for(let i=0;i<44;i++){const rad=.012+i/44*.398,angle=Math.log(1+rad*17)*2.7+(i%2)*Math.PI,p=project({x:.5+Math.cos(angle)*rad,y:.5+Math.sin(angle)*rad,z:0}),rr=span*(.025+rad*.09)*view.scale,g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rr);g.addColorStop(0,i%3?'rgba(119,158,210,.075)':'rgba(205,151,112,.08)');g.addColorStop(1,'rgba(100,130,180,0)');ctx.fillStyle=g;ctx.fillRect(p.x-rr,p.y-rr,rr*2,rr*2)}ctx.restore();
}
const source=dark?all:filtered;
for(const o of source){const p=positions[o.id],s=project(p),r=p.radius*Math.pow(view.scale,.87)*(dark?1:1.3);if(s.x< -r*3||s.x>width+r*3||s.y< -r*3||s.y>height+r*3)continue;activeNodes.push({x:s.x,y:s.y,id:o.id,r});const twinkle=1;ctx.globalAlpha=twinkle;if(r<3||!dark){ctx.beginPath();ctx.arc(s.x,s.y,r,0,Math.PI*2);ctx.fillStyle=dark?(p.bulge?'#fff1d9':p.arm?'#dec29c':'#c1d3e6'):(p.arm?'#a27c61':'#557b68');ctx.fill();if(dark&&p.glint){const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,7+r*4);g.addColorStop(0,'rgba(240,242,255,.5)');g.addColorStop(1,'rgba(190,215,240,0)');ctx.fillStyle=g;ctx.fillRect(s.x-7-r*4,s.y-7-r*4,14+r*8,14+r*8)}}else planet(s.x,s.y,r,o.id,p.arm)}ctx.globalAlpha=1;
if(!dark&&chosen!==null){const o=all[chosen],a=project(positions[chosen]);for(const n of activeNodes){const b=all[n.id];if(n.id===chosen||(b.r[5]!==o.r[5]&&b.r[7]!==o.r[7]))continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(n.x,n.y);ctx.strokeStyle='rgba(98,124,103,.25)';ctx.lineWidth=.4+(Math.min(o.r[4],b.r[4])-7000)/1800;ctx.stroke()}ctx.beginPath();ctx.arc(a.x,a.y,9,0,Math.PI*2);ctx.strokeStyle='#9e4d3f';ctx.stroke()}
if(pointerPosition)previewStar();$('#count').textContent=(dark?all.length:filtered.length).toLocaleString()+' 颗墨星 · 同一片诗的星河';if(dark&&!reduced())frame=requestAnimationFrame(paint);}
let pointerPosition=null;
let previewId=null;
function previewStar(){const tip=$('#star-preview');if(!pointerPosition){tip.hidden=true;return}const id=nearest(pointerPosition.x,pointerPosition.y);if(id===null){previewId=null;tip.hidden=true;canvas.style.cursor='default';return}const r=all[id].r;if(previewId!==id){previewId=id;tip.innerHTML='<span>李白 · '+esc(r[0])+'</span><p>'+esc(r[1])+'</p><span>杜甫 · '+esc(r[2])+'</span><p>'+esc(r[3])+'</p>';}tip.hidden=false;const tw=tip.offsetWidth||280,th=tip.offsetHeight||150;tip.style.left=Math.max(10,Math.min(pointerPosition.x+18,width-tw-12))+'px';tip.style.top=Math.max(10,Math.min(pointerPosition.y+18,height-th-12))+'px';canvas.style.cursor='pointer'}
canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const rect=canvas.getBoundingClientRect();pointerPosition={x:e.clientX-rect.left,y:e.clientY-rect.top};previewStar()});
canvas.addEventListener('pointerleave',()=>{pointerPosition=null;$('#star-preview').hidden=true;canvas.style.cursor='default'});
function zoom(f,anchorX=width/2,anchorY=height/2){const old=view.scale;view.scale=Math.max(.7,Math.min(65,old*f));const ratio=view.scale/old;view.x=anchorX-width/2-(anchorX-width/2-view.x)*ratio;view.y=anchorY-height/2-(anchorY-height/2-view.y)*ratio;draw()}
function nearest(x,y){let hit=null,d=Infinity;for(const n of activeNodes){const q=(n.x-x)**2+(n.y-y)**2;if(q<Math.max(10,n.r+3)**2&&q<d){d=q;hit=n.id}}return hit}
canvas.addEventListener('wheel',e=>{e.preventDefault();const rect=canvas.getBoundingClientRect();zoom(Math.exp(-e.deltaY*.0015),e.clientX-rect.left,e.clientY-rect.top)},{passive:false});
canvas.addEventListener('click',e=>{if(mode==='galaxy')return;const r=canvas.getBoundingClientRect(),id=nearest(e.clientX-r.left,e.clientY-r.top);if(id!==null)select(all[id])});
canvas.addEventListener('keydown',e=>{if(['+','=','-'].includes(e.key)){e.preventDefault();zoom(e.key==='-'?1/1.3:1.3)}else if(e.key==='Enter'&&mode==='paper')random()});
$('#zoom-in').onclick=()=>zoom(1.4);$('#zoom-out').onclick=()=>zoom(1/1.4);$('#reset-view').onclick=()=>{view={scale:1,x:0,y:0};draw()};new ResizeObserver(draw).observe(canvas);
function setMode(next){pointerPosition=null;$('#star-preview').hidden=true;mode=next;document.querySelector('#poetry-app').classList.toggle('galaxy-mode',mode==='galaxy');document.body.classList.toggle('in-galaxy',mode==='galaxy');view={scale:1,x:0,y:0};lastTime=0;$('#detail').classList.remove('open');$('#to-paper').hidden=mode!=='galaxy';window.scrollTo(0,0);draw()}
$('#to-paper').onclick=()=>setMode('paper');$('#to-galaxy').onclick=()=>setMode('galaxy');window.addEventListener('atlas-enter',()=>setMode('galaxy'));document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);lastTime=0}else draw()});
const planetSurfaces=new Map();let textureBuilds=0;
function planet(x,y,r,id,arm){
const variant=(id%12)+(arm?12:0);let surface=planetSurfaces.get(variant);
if(!surface&&textureBuilds>=1){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=arm?'#e9cda0':'#a8d5c8';ctx.fill();return}
if(!surface){textureBuilds++;id=variant;
 const size=96,half=size/2,sprite=document.createElement('canvas');sprite.width=sprite.height=size;const sc=sprite.getContext('2d'),pixels=sc.createImageData(size,size),seed=noise(id+40)*20;
 for(let py=0;py<size;py++)for(let px=0;px<size;px++){
  const nx=(px+.5-half)/(half-2),ny=(py+.5-half)/(half-2),rr=nx*nx+ny*ny;if(rr>1)continue;const nz=Math.sqrt(1-rr),longitude=Math.atan2(nx,nz),latitude=Math.asin(ny);
  const broad=Math.sin(longitude*4+Math.sin(latitude*7+seed)*1.1+seed)*Math.cos(latitude*6-seed);
  const middle=Math.sin(longitude*13+latitude*17+Math.sin(latitude*11)*2+seed)*.35;
  const fine=Math.sin(longitude*51+Math.sin(latitude*31+seed)*3)*Math.cos(latitude*63+seed)*.12;
  const texture=broad+middle+fine,light=Math.max(0,-nx*.46-ny*.48+nz*.74),diffuse=.34+.94*Math.pow(light,.72),rim=Math.pow(1-nz,4);
  let base;
  if(arm){const band=Math.sin(latitude*25+Math.sin(longitude*5+seed)*.8+texture*.7);base=[224+texture*25+band*13,185+texture*23+band*13,132+texture*20+band*11]}
  else{const land=texture>.19;base=land?[125+texture*22,180+texture*25,148+texture*16]:[72+texture*12,146+texture*20,166+texture*22];const cloud=Math.max(0,Math.sin(longitude*12+Math.sin(latitude*9+seed)*3)+Math.cos(latitude*19-longitude*5)-1.25)*.65;base=base.map(c=>c*(1-cloud)+219*cloud)}
  const spec=arm?0:Math.pow(Math.max(0,-nx*.23-ny*.24+nz*.94),30)*23;const i=(py*size+px)*4;
  for(let ch=0;ch<3;ch++)pixels.data[i+ch]=Math.min(255,(base[ch]*.84+238*.16)*diffuse+rim*(arm?[35,26,12]:[17,37,48])[ch]*Math.max(.15,light)+spec);
  pixels.data[i+3]=Math.min(255,(1-Math.sqrt(rr))*half*255);
 }sc.putImageData(pixels,0,0);surface=sprite;planetSurfaces.set(variant,sprite);
}
ctx.drawImage(surface,x-r,y-r,r*2,r*2);
}
