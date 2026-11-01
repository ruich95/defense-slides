// Mirror the existing claim markers, including their ancestors' reveal opacity.
// The slide controllers remain the sole owners of reveal timing and navigation.
(()=>{
 const definitions={
  O1:'Support stateful, black-box components.',
  O2:'Express models and design steps in Idris2, supporting execution and verification.',
  O3:'Provide accessible modelling through Idris2’s language features and tools.'
 };
 const layouts={
  page8:{O1:[0,0],O3:[395,0],O2:[0,26]},
  page19:{},language_boundary:{},
  rv32i_process:{O3:[715,0]},
  page21:{},page22:{},page25:{},
  fm_model:{O3:[395,0]},
  normalisation:{},aeic26_27:{},product_elimination:{}
 };
 for(const [id,slots] of Object.entries(layouts)){
  const factory=window.slideFactories[id];if(!factory)continue;
  window.slideFactories[id]=()=>{
   const api=factory(),root=document.getElementById(id);
   const markers=[...root.querySelectorAll('.objective-tag[data-objective],.page8-objective')];
   const objective=node=>node.dataset.objective||node.textContent.trim();
   const area=document.createElement('div');area.className='objective-footnotes';area.setAttribute('aria-label','Objective definitions');
   const notes=new Map();
   for(const key of Object.keys(definitions))if(markers.some(n=>objective(n)===key)){
    const note=document.createElement('div'),label=document.createElement('strong');
    note.className='objective-footnote';note.dataset.objective=key;note.setAttribute('role','doc-footnote');note.setAttribute('aria-hidden','true');
    const [x,y]=slots[key]||[0,0];note.style.left=x+'px';note.style.top=y+'px';
    label.className='objective-footnote-label';label.textContent=key;
    note.append(label,document.createTextNode(' '+definitions[key]));area.append(note);notes.set(key,note);
   }
   root.append(area);
   function alpha(node){let value=1;for(let n=node;n&&n!==root.parentElement;n=n.parentElement){const css=getComputedStyle(n);if(n.hidden||css.display==='none'||css.visibility==='hidden'||css.visibility==='collapse')return 0;value*=Number(css.opacity);if(value===0)return 0;}return value;}
   function sync(){
    let visible=false;
    for(const [key,note] of notes){const value=Math.max(0,...markers.filter(n=>objective(n)===key).map(alpha)),opacity=String(value),hidden=String(value===0),visibility=value>0?'visible':'hidden';
     if(note.style.opacity!==opacity)note.style.opacity=opacity;
     if(note.style.visibility!==visibility)note.style.visibility=visibility;
     if(note.getAttribute('aria-hidden')!==hidden)note.setAttribute('aria-hidden',hidden);
     visible||=value>0;
    }
    if(['page19','page21'].includes(id)&&root.classList.contains('objective-footnote-replaces-footer')!==visible)root.classList.toggle('objective-footnote-replaces-footer',visible);
   }
   // Observe only marker ancestry. Footnote writes never trigger this observer.
   const ancestry=new Set();for(const marker of markers)for(let n=marker;n&&n!==root.parentElement;n=n.parentElement)ancestry.add(n);
   const observer=new MutationObserver(sync);for(const n of ancestry)observer.observe(n,{attributes:true,attributeFilter:['style','class','hidden','opacity']});
   let generation=0,frame=0;
   function stop(){generation++;if(frame)cancelAnimationFrame(frame);frame=0;}
   // Native Web Animations change computed opacity without DOM mutations.
   // Follow only the lifetime of a controller operation, then stop completely.
   for(const name of ['go','enter','cancel','leave','resize','previewTransition','previewInternal','previewReveal'])if(typeof api[name]==='function'){
    const original=api[name];api[name]=function(...args){
     if(name!=='resize')stop();const token=generation;let result;
     try{result=original.apply(this,args);}finally{sync();}
     if(result&&typeof result.then==='function'){
      const tick=()=>{if(token!==generation)return;sync();frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);
      return Promise.resolve(result).finally(()=>{if(token===generation){stop();sync();}});
     }
     return result;
    };
   }
   sync();return api;
  };
 }
})();
