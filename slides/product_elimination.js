window.slideFactories.product_elimination=()=>{
 const root=document.getElementById('product_elimination'),items=[...root.querySelectorAll('[data-pe-first]')];
 const source='\n\nSource: thesis §5.1.3, printed pp. 138–140, and §5.3.2, printed pp. 150–152; complete Fig. 5.8 and selected 20-iteration entries from Table 5.1 on printed p. 151 (PDF p. 175). Figure 5.8 is a proportional vector crop of the supplied thesis PDF, preserving the upper Comb/IR models, all arrows and intrinsic labels, the lower code-generation-cost ellipses and High/Low legend. The external caption and table are excluded from the figure asset. No new compiler run, proof check, benchmark or experiment is reported.';
 const states=[
  {name:'Generating unused computations',note:'We have seen how balancing changes execution-step opportunities and communications across target mappings. Now consider a different cost: generating IR for that transformed model. The measurements on this page concern IR-generation time, distinct from the preceding target-mapping metrics. A simple direct generator visits all subcomponents bottom-up and independently, so it emits both additions in this combinational example even though the output is x0. The x1 assignment is unused.\n\nThe source expression and IR use shortened presentation notation. The thesis includes const/BV constructors, bit-vector type annotations and input/output/state headers. The displayed expression omits these details without changing its projection/product structure. This is not a stateful effect-elimination example.'},
  {name:'Simplify the model before IR generation',note:'Apply proj1 (prod x y) = x at model level: the expression becomes add 1 1. This is product elimination, not constant folding; do not replace the result by 2. The unused branch disappears before generating IR, so only the x0 assignment is needed. The hidden second line illustrates avoided generation, not an actual compiler execution or a chosen post-generation dead-code pass.\n\nThe complete figure contrasts the routes. Product elimination transforms the model within Comb, then the direct generator produces IR. Its lower panel illustrates generation cost. Eliminating dead code after generating IR cannot recover time already spent generating it. Simplifying the projected products first retains a simple bottom-up generator. This is a horizontal transformation: the result remains a SynQ model over Comb, unlike normalisation\u0027s CombL target. Do not claim it eliminates all dead code or every product, removes necessary state/resource effects, or has a new general behaviour-preservation proof.'},
  {name:'IR-generation measurements',note:'The table compares IR-generation time in seconds for the same FIR tap count and the same 20 balancing iterations, before versus after product elimination. For 32 taps, the reported values are 483.1 s and 0.091 s. For 64 and 128 taps, before elimination reaches the two-hour timeout; after elimination takes 0.143 s and 0.605 s. Measurements used an Intel Core i7-9750H with 64 GB RAM. These measure the cost of generating IR, not execution time, clock cycles or hardware area. Do not compute an exact speedup from a timeout. The thesis\u0027s around-6000-times sentence compares 20 versus 10 iterations before elimination, not these before/after columns.\n\nBackup B16 retains all Table 5.1 rows, including 10 iterations and 16/256 taps. The measured application sequence is balancing, product elimination, then IR generation. Normalisation is not asserted to be part of this measured sequence.\n\nTransition: Balancing changes the reducer structure; product elimination makes generating its implementation practical. Together, these examples illustrate support for the design process. I will now conclude with the contributions and remaining work.'}
 ].map(s=>({...s,note:s.note+source}));
 let step=0,busy=false,generation=0,animations=[];
 const visible=(n,s)=>s>=Number(n.dataset.peFirst)&&s<=Number(n.dataset.peLast);
 function show(n,on){n.style.opacity=on?'1':'0';n.style.visibility=on?'visible':'hidden';n.setAttribute('aria-hidden',String(!on));}
 function render(){for(const n of items)show(n,visible(n,step));root.dataset.state=String(step+1);}
 function cancel(){generation++;for(const a of animations)a.cancel();animations=[];busy=false;render();}
 async function go(target,animate=true){
  const previous=step;cancel();step=Math.max(0,Math.min(states.length-1,Math.round(target)));
  if(step===previous||!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){render();return;}
  const token=++generation;busy=true;
  if((previous===2)!==(step===2)){
   const outgoing=root.querySelector(previous===2?'.pe-results':'.pe-problem');
   animations=[outgoing.animate([{opacity:1},{opacity:0}],{duration:112.5,easing:'ease-out'})];
   await Promise.all(animations.map(a=>a.finished.catch(()=>{})));
   if(token!==generation)return;for(const a of animations)a.cancel();animations=[];render();
   const incoming=root.querySelector(step===2?'.pe-results':'.pe-problem');
   animations=[incoming.animate([{opacity:0},{opacity:1}],{duration:112.5,easing:'ease-in'})];
  }else{
   // Avoided generation: hide the unused assignment as the model rewrite appears.
   render();animations=items.filter(n=>visible(n,step)&&!visible(n,previous)).map(n=>n.animate([{opacity:0},{opacity:1}],{duration:225,easing:'ease-out'}));
  }
  await Promise.all(animations.map(a=>a.finished.catch(()=>{})));
  if(token!==generation)return;for(const a of animations)a.cancel();animations=[];busy=false;render();
 }
 render();const api={go,cancel,leave:cancel,states,getState:()=>({step,busy,count:states.length})};root.product_eliminationController=api;return api;
};
