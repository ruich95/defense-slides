window.slideFactories.aeic25=()=>{
 const root=document.getElementById('aeic25'),items=[...root.querySelectorAll('[data-aeic25-reveal]')];
 const source='\n\nSource: final/AEiC-26.pptx, slide 25. Thesis Chapter 5 introduction, §5.1 and §5.2.1–2. Abstract interpretation here means the tagless-final mechanism for interpreting a model into another abstract model; it does not assume a particular lattice-based static analysis. Well-typedness alone does not establish behaviour preservation.';
 const states=[
  {name:'Changing the model',note:'So far, we have constructed, interpreted and validated models. Design also involves changing a model itself. Transformations are executable Idris2 functions on models or submodels. These functions compose into a design process, and their properties can be stated in QTT. There are two approaches to defining these transformations. Thesis Chapter 5 introduction, printed p. 129.'},
  {name:'Abstract interpretations',note:'One route uses an interpretation that produces another abstract model. We can interpret that result again for a target, rather than committing to an implementation during transformation.'},
  {name:'Type-driven construction',note:'Another route uses the host language to transform the types and terms from which a model is constructed. Both approaches remain available.\n\nTransition: First, let us see normalisation as an abstract interpretation. Then we will use type-driven construction for balancing.'}
 ].map(s=>({...s,note:s.note+source}));
 let step=0,busy=false,generation=0,animations=[];
 function render(){for(const n of items){const on=step>=Number(n.dataset.aeic25Reveal);n.style.opacity=on?'1':'0';n.style.visibility=on?'visible':'hidden';n.setAttribute('aria-hidden',String(!on));}root.dataset.state=String(step+1);}
 function cancel(){generation++;for(const a of animations)a.cancel();animations=[];busy=false;render();}
 async function go(target,animate=true){const previous=step;cancel();step=Math.max(0,Math.min(2,Math.round(target)));const token=++generation;render();if(!animate||previous===step||matchMedia('(prefers-reduced-motion: reduce)').matches)return;busy=true;animations=items.filter(n=>previous<Number(n.dataset.aeic25Reveal)&&step>=Number(n.dataset.aeic25Reveal)).map(n=>n.animate([{opacity:0},{opacity:1}],{duration:225,easing:'ease-out'}));await Promise.all(animations.map(a=>a.finished.catch(()=>{})));if(token!==generation)return;for(const a of animations)a.cancel();animations=[];busy=false;render();}
 render();const api={go,cancel,leave:cancel,states,getState:()=>({step,busy,count:states.length})};root.aeic25Controller=api;return api;
};
