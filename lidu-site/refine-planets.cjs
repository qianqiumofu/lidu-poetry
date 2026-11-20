const fs=require('fs');const planet=`const planetSurfaces=new Map();
function planet(x,y,r,id,arm){
let surface=planetSurfaces.get(id);
if(!surface){
 const size=160,half=size/2,sprite=document.createElement('canvas');sprite.width=sprite.height=size;const sc=sprite.getContext('2d'),pixels=sc.createImageData(size,size),seed=noise(id+40)*20;
 for(let py=0;py<size;py++)for(let px=0;px<size;px++){
  const nx=(px+.5-half)/(half-2),ny=(py+.5-half)/(half-2),rr=nx*nx+ny*ny;if(rr>1)continue;const nz=Math.sqrt(1-rr),longitude=Math.atan2(nx,nz),latitude=Math.asin(ny);
  const broad=Math.sin(longitude*4+Math.sin(latitude*7+seed)*1.1+seed)*Math.cos(latitude*6-seed);
  const middle=Math.sin(longitude*13+latitude*17+Math.sin(latitude*11)*2+seed)*.35;
  const fine=Math.sin(longitude*51+Math.sin(latitude*31+seed)*3)*Math.cos(latitude*63+seed)*.12;
  const texture=broad+middle+fine,light=Math.max(0,-nx*.46-ny*.48+nz*.74),diffuse=.13+.87*Math.pow(light,.9),rim=Math.pow(1-nz,4);
  let base;
  if(arm){const band=Math.sin(latitude*25+Math.sin(longitude*5+seed)*.8+texture*.7);base=[174+texture*25+band*13,132+texture*23+band*13,85+texture*20+band*11]}
  else{const land=texture>.19;base=land?[83+texture*22,126+texture*25,101+texture*16]:[40+texture*12,91+texture*20,105+texture*22];const cloud=Math.max(0,Math.sin(longitude*12+Math.sin(latitude*9+seed)*3)+Math.cos(latitude*19-longitude*5)-1.25)*.65;base=base.map(c=>c*(1-cloud)+219*cloud)}
  const spec=arm?0:Math.pow(Math.max(0,-nx*.23-ny*.24+nz*.94),30)*23;const i=(py*size+px)*4;
  for(let ch=0;ch<3;ch++)pixels.data[i+ch]=Math.min(255,base[ch]*diffuse+rim*(arm?[35,26,12]:[17,37,48])[ch]*Math.max(.15,light)+spec);
  pixels.data[i+3]=Math.min(255,(1-Math.sqrt(rr))*half*255);
 }sc.putImageData(pixels,0,0);surface=sprite;planetSurfaces.set(id,sprite);if(planetSurfaces.size>96)planetSurfaces.delete(planetSurfaces.keys().next().value);
}
ctx.save();const glow=ctx.createRadialGradient(x,y,r*.94,x,y,r*1.16);glow.addColorStop(0,arm?'rgba(231,176,105,.15)':'rgba(114,186,214,.18)');glow.addColorStop(1,'rgba(100,150,190,0)');ctx.fillStyle=glow;ctx.fillRect(x-r*1.16,y-r*1.16,r*2.32,r*2.32);ctx.drawImage(surface,x-r,y-r,r*2,r*2);ctx.restore();
}
`;
for(const p of ['lidu-site/dist/app.js','lidu-site/atlas-part.js']){let s=fs.readFileSync(p,'utf8');const start=s.indexOf('function planet('),end=p.endsWith('app.js')?s.indexOf('function poem(',start):s.length;s=s.slice(0,start)+planet+s.slice(end);fs.writeFileSync(p,s)}
