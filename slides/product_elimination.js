window.slideFactories.product_elimination=()=>{
 const root=document.getElementById('product_elimination'),items=[...root.querySelectorAll('[data-pe-first]')];
 const source='\n\nSource: thesis §5.1.3, printed pp. 138–140, and §5.3.2, printed pp. 150–152; exact full-model example on printed p. 150 (PDF p. 174), complete Fig. 5.8 and selected 20-iteration entries from Table 5.1 on printed p. 151 (PDF p. 175). The example reuses actual network blocks, ports, outlined labels and wires from the user-supplied figures/svg/prod-elim-draft.svg, with separate group positioning and shortened route arrows. The source SVG is unchanged. Fig. 5.8 retains every upper model/IR arrow and label, lower cost ellipse and High/Low legend. No new compiler run, proof check, benchmark or experiment is reported.';
 const notation='\n\nPresentation notation omits explicit const/BV constructors and type annotations and simplifies x_0/x_1 to x0/x1. Removing only type annotations from the thesis IR leaves state: !(), which is preserved here. This is the combinational Comb context, not a stateful effect-elimination example.';
 const states=[
  {name:'A projected-product model',note:'The preceding target mappings concerned execution-step opportunities and communications. Now consider a different design-process cost: generating IR for the transformed model. Direct code generation can emit computations whose results are unused. The original network computes two additions, pairs their results, and projects the first result. Entry holds only this network and the opening sentence.'},
  {name:'Generate the first submodel',note:'Follow the simple direct generator bottom-up. The highlighted add 1 1 submodel generates x0 = 1 + 1. The input/output/state headers describe the currently highlighted submodel, not yet the entire original network. Input is empty, output is x0, and state is !(). The code layout reserves the output tuple width and a fifth line for the next step.'},
  {name:'Generate the product submodel',note:'The highlight moves to add 2 3 and prod. The currently interpreted product submodel returns (x0, x1), so its IR now contains x1 = 2 + 3 as well as the unchanged first assignment. Constructing prod requires no additional arithmetic instruction. The output header describes this highlighted submodel, not a change to the complete original model’s meaning.'},
  {name:'Project the first result',note:'The highlight moves to proj1. This is the first displayed IR for the complete original network. Its output is x0, but the direct bottom-up, context-independent generator has already emitted both assignments. Keep the second assignment in its normal styling. The projection changes only the output header at this step; the unused-code emphasis begins on the next click. A generator that handles each subcomponent independently is simple to implement and reason about, but it still pays for the unused branch.'},
  {name:'Eliminate dead code after generation',note:'The dashed lower arrow is an alternative IR-level route: dead-code elimination removes the unused assignment and produces the right-hand IR. This click first highlights x1 coral as unused. The original generated code and its highlighted line stay visible for comparison. The result remains x0 = 1 + 1; this is not constant folding. Removing dead code afterwards cannot recover the time already spent generating it.'},
  {name:'Eliminate projected products before generation',note:'Product elimination is an implemented model transformation expressed as an Idris2 function. There is no objective tag at this stage. In one click, follow the solid upper product-elimination arrow, then the simplified add 1 1 network, then its downward code-generation arrow. The existing right-hand IR stays fixed throughout. Applying proj1 (prod x y) = x at model level avoids generating the discarded branch. It retains the simple bottom-up generator. The result remains a SynQ model over Comb, a horizontal transformation, distinct from normalisation’s CombL target. This is model simplification, not constant folding. These sections do not supply a new general behaviour-preservation proof for this transformation. Do not claim it removes all dead code, every product or necessary state/resource effects.'},
  {name:'The general generation-cost picture',note:'The complete original Fig. 5.8 generalises this concrete Comb example. Its upper model transformation and subsequent code generation correspond to the solid route just followed on the left. The dashed alternative generates IR first and eliminates dead code afterwards. The lower panel and High/Low legend show why generation cost differs between those routes: later IR elimination does not refund generation work. Keep the completed example visible alongside the complete source figure. The method sentence under the figure reads “Eliminate projected products before generating IR.” Its O2 label identifies an executable design step, not a proof. Figure and method sentence reveal together; this is the first O2 on this page.'},
  {name:'IR-generation measurements',note:'The figure and its method sentence with O2 remain fixed on the right while the timing table replaces only the left example. O2 continues to identify elimination of projected products before IR generation; there is no second tag beside the timing heading. These reported generation-cost results support executable design steps and are measured evidence, not a preservation proof. The table compares IR-generation seconds at the same tap count and the same 20 balancing iterations, before versus after product elimination. For 32 taps the values are 483.1 s and 0.091 s. Before elimination, 64 and 128 taps reach the two-hour timeout; after elimination they take 0.143 s and 0.605 s. The machine was an Intel Core i7-9750H with 64 GB RAM. These are generation times, not execution times, clock cycles or hardware areas. Do not calculate exact speedups from timeouts. The thesis’s around-6000-times sentence compares 20 versus 10 iterations before elimination, not the shown before/after columns.\n\nBackup B16 preserves all Table 5.1 rows, including 10 iterations and 16/256 taps. The measured sequence is balancing, product elimination, then IR generation. Normalisation is not asserted to be part of that measured sequence.\n\nTransition: Balancing changes the reducer structure; product elimination makes generating its implementation practical. Together, these examples illustrate support for the design process. I will now conclude with the contributions and remaining work.'}
 ].map(s=>({...s,note:s.note+notation+source}));
 let step=0,busy=false,generation=0,animations=[];
 const visible=(n,s)=>s>=Number(n.dataset.peFirst)&&s<=Number(n.dataset.peLast);
 function show(n,on){n.style.opacity=on?'1':'0';n.style.visibility=on?'visible':'hidden';n.setAttribute('aria-hidden',String(!on));}
 function render(){
  for(const n of items)show(n,visible(n,step));
  root.querySelector('.pe-output').textContent=step===2?'output: (x0, x1)':'output: x0';
  root.querySelector('.pe-second-assignment').classList.toggle('pe-unused',step>=4);
  for(const n of root.querySelectorAll('.pe-active-block'))n.classList.remove('pe-active-block');
  const selected=step===1?['rect28-6-6-37']:step===2?['rect28-6-6-37-8','rect28-6-6-37-7']:step===3?['rect28-6-6-37-7-1']:[];
  for(const id of selected)root.querySelector('#pe-native-'+id).classList.add('pe-active-block');
  root.dataset.state=String(step+1);
 }
 function cancel(){generation++;for(const a of animations)a.cancel();animations=[];busy=false;render();}
 function reveal(nodes,duration=225,delay=0){return nodes.map(n=>n.animate([{opacity:0},{opacity:1}],{duration,delay,fill:'both',easing:'ease-in-out'}));}
 async function go(target,animate=true){
  const previous=step;cancel();step=Math.max(0,Math.min(states.length-1,Math.round(target)));
  if(step===previous||!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){render();return;}
  const token=++generation;busy=true;
  if((previous===7)!==(step===7)){
   const outgoing=root.querySelector(previous===7?'.pe-results':'.pe-problem');
   animations=[outgoing.animate([{opacity:1},{opacity:0}],{duration:112.5,easing:'ease-out'})];
   await Promise.all(animations.map(a=>a.finished.catch(()=>{})));
   if(token!==generation)return;for(const a of animations)a.cancel();animations=[];render();
   animations=reveal([root.querySelector(step===7?'.pe-results':'.pe-problem')],112.5);
  }else{
   render();
   if(previous===4&&step===5){
    // One continuous 500ms route: arrow -> network -> downward generation.
    animations=[...reveal([root.querySelector('#pe-native-pe-product-route'),root.querySelector('.pe-product-label')],220,0),
     ...reveal([root.querySelector('#pe-native-pe-simplified-network')],220,140),
     ...reveal([root.querySelector('#pe-native-pe-simplified-generation'),root.querySelector('.pe-simplified-label')],220,280)];
   }else animations=reveal(items.filter(n=>visible(n,step)&&!visible(n,previous)));
  }
  await Promise.all(animations.map(a=>a.finished.catch(()=>{})));
  if(token!==generation)return;for(const a of animations)a.cancel();animations=[];busy=false;render();
 }
 render();const api={go,cancel,leave:cancel,states,getState:()=>({step,busy,count:states.length})};root.product_eliminationController=api;return api;
};
