(()=>{
const cover=document.querySelector('#prologue'),app=document.querySelector('#poetry-app');
let entering=false;
cover.hidden=true;cover.style.display='none';
function enter(){
 if(entering)return;entering=true;
 const reveal=()=>{app.hidden=false;app.inert=false;app.classList.add('entering');window.scrollTo(0,0);window.dispatchEvent(new Event('atlas-enter'));document.querySelector('#map').focus({preventScroll:true});entering=false};
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){reveal();return}
 window.playPoemEntrance(()=>{},reveal);
}
document.querySelector('#replay-intro').addEventListener('click',()=>{app.hidden=true;app.inert=true;enter()});
enter();
})();
