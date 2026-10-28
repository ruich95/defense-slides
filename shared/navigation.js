(()=>{
const $=id=>document.getElementById(id),manifest=window.deckManifest,sections=manifest.map(s=>$(s.id)),instances=new Map();
let slide=0,step=0,busy=false,navigationGeneration=0;
function controller(index){const entry=manifest[index];if(!instances.has(index)){const factory=window.slideFactories[entry.id];instances.set(index,factory?factory():{go:()=>Promise.resolve(),states:[{name:'Cover',note:entry.notes||''}],getState:()=>({step:0,busy:false,count:1})})}return instances.get(index)}
function count(index){return manifest[index].steps||1}
function render(){document.body.classList.toggle('busy',busy);$('previous').disabled=busy||(slide===0&&step===0);$('next').disabled=busy||(slide===manifest.length-1&&step===count(slide)-1);$('restart').disabled=busy;const state=controller(slide).states[step];$('status').textContent=`Slide ${slide+1} / ${manifest.length}`+(count(slide)>1?` · Step ${step+1} / ${count(slide)}`:'');$('notes-heading').textContent=manifest[slide].title+(count(slide)>1?` · ${state.name}`:'');$('notes-text').textContent=state.note||manifest[slide].notes||'';history.replaceState(null,'',manifest.length===1&&count(0)>1?`#${step+1}`:`#${slide+1}${count(slide)>1?'.'+(step+1):''}`)}
async function go(targetSlide,targetStep=0,animate=true,options={}){
 const reason=options.reason||'programmatic';
 if(busy){if(!['programmatic','hash','initial'].includes(reason))return;const active=instances.get(slide);if(active&&active.cancel)active.cancel()}
 const token=++navigationGeneration,old=slide;
 const destination=Math.max(0,Math.min(manifest.length-1,Math.round(targetSlide)));
 if(destination!==old){const leaving=instances.get(old);if(leaving&&leaving.leave)leaving.leave()}
 slide=destination;step=Math.max(0,Math.min(count(slide)-1,Math.round(targetStep)));busy=true;
 sections.forEach((section,i)=>section.classList.toggle('active',i===slide));
 try{
  const api=controller(slide);if(api.resize)api.resize();render();
  const playEntrance=step===0&&(['initial','restart','hash'].includes(reason)||(reason==='forward'&&old!==slide));
  if(playEntrance&&api.enter)await api.enter({playEntrance:true,reason,previousId:manifest[old].id});
  else await api.go(step,animate&&old===slide);
 }finally{if(token===navigationGeneration){busy=false;render()}}
}
function next(){if(busy)return;if(step+1<count(slide))return go(slide,step+1,true,{reason:'forward'});if(slide+1<manifest.length)return go(slide+1,0,true,{reason:'forward'})}
function previous(){if(busy)return;if(step)return go(slide,step-1,true,{reason:'backward'});if(slide)return go(slide-1,count(slide-1)-1,true,{reason:'backward'})}
function resize(){const v=$('viewport');$('stage').style.transform=`translate(-50%,-50%) scale(${Math.min(v.clientWidth/1600,v.clientHeight/900)})`;const api=instances.get(slide);if(api&&api.resize)api.resize()}
function notes(){const open=$('notes-dialog').classList.toggle('open');$('notes').setAttribute('aria-expanded',String(open))}
async function fullscreen(){if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}
$('stage').addEventListener('click',()=>{if(!getSelection().toString())next()});$('previous').onclick=previous;$('next').onclick=next;$('restart').onclick=()=>go(0,0,false,{reason:'restart'});$('notes').onclick=notes;$('fullscreen').onclick=fullscreen;$('close-notes').onclick=()=>{$('notes-dialog').classList.remove('open');$('notes').setAttribute('aria-expanded','false')};
document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(e.target.tagName)||e.target.isContentEditable)return;if(e.target.tagName==='BUTTON'&&e.code==='Space'&&!document.fullscreenElement)return;if(['Space','ArrowRight','PageDown'].includes(e.code)){e.preventDefault();next()}else if(['ArrowLeft','PageUp'].includes(e.code)){e.preventDefault();previous()}else if(e.code==='Home')go(0,0,false);else if(e.code==='End')go(manifest.length-1,count(manifest.length-1)-1,false);else if(e.key.toLowerCase()==='r')go(slide,0,false,{reason:'restart'});else if(e.key.toLowerCase()==='f')fullscreen();else if(e.key.toLowerCase()==='s')notes();else if(e.key==='Escape')$('notes-dialog').classList.remove('open')});
window.addEventListener('resize',resize);document.addEventListener('fullscreenchange',()=>{document.body.classList.toggle('full',!!document.fullscreenElement);resize()});
window.defenseDeck={go,next,previous,manifest,getState:()=>({slide,step,busy,slides:manifest.length,steps:count(slide)})};
if(manifest.length===1&&manifest[0].id==='page2')window.defenseSlide={go:(s,a=true)=>go(0,s,a),next,previous,getState:()=>({step,busy,count:count(0)}),get states(){return controller(0).states}};
function fromHash(initial=false){const hash=location.hash.match(/^#(\d+)(?:\.(\d+))?$/),single=manifest.length===1&&count(0)>1;return go(hash&&!single?+hash[1]-1:0,hash?(single?+hash[1]-1:+(hash[2]||1)-1):0,false,{reason:initial?'initial':'hash'})}
window.addEventListener('hashchange',()=>fromHash(false));resize();fromHash(true);
})();
