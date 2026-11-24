(()=>{
const app=document.querySelector('#poetry-app');
const cover=document.querySelector('#prologue');
cover.hidden=true;
cover.style.display='none';
document.querySelector('#poem-entrance').hidden=true;
document.querySelector('#replay-intro').hidden=true;
app.hidden=false;
app.inert=false;
window.scrollTo(0,0);
window.dispatchEvent(new Event('atlas-enter'));
document.querySelector('#map').focus({preventScroll:true});
})();
