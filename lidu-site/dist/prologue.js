(()=>{
const cover=document.querySelector('#prologue'),app=document.querySelector('#poetry-app'),next=document.querySelector('#unfold'),lines=[...document.querySelectorAll('.story-line')];
let timer=null,leaving=false;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function stop(){clearTimeout(timer);timer=null}
function enter(){if(leaving)return;stop();leaving=true;cover.classList.add('leaving');const reveal=()=>{cover.hidden=true;cover.style.display='none';app.hidden=false;app.inert=false;app.classList.add('entering');window.scrollTo(0,0);window.dispatchEvent(new Event('atlas-enter'));document.querySelector('#map').focus({preventScroll:true});leaving=false};if(reduced()){reveal();return}window.playPoemEntrance(()=>{cover.hidden=true;cover.style.display='none'},reveal)}
function start(){stop();next.hidden=true;lines.forEach((line,i)=>{line.hidden=i>0;line.classList.toggle('revealed',i===0)});let step=1;function reveal(){if(step<lines.length){const line=lines[step++];line.hidden=false;line.classList.add('revealed');timer=setTimeout(reveal,3200)}else{next.hidden=false;timer=null}}timer=setTimeout(reveal,3200)}
next.addEventListener('click',enter);
document.querySelector('#skip-intro').addEventListener('click',enter);
document.querySelector('#replay-intro').addEventListener('click',()=>{app.hidden=true;app.inert=true;document.body.classList.remove('in-galaxy');cover.hidden=false;cover.style.display='';cover.classList.remove('leaving');window.scrollTo(0,0);start();document.querySelector('#skip-intro').focus({preventScroll:true})});
start();
})();
