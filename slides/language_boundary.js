window.slideFactories.language_boundary=()=>{
 const root=document.getElementById('language_boundary'),items=[...root.querySelectorAll('[data-lb-reveal]')];
 const source='\n\nSource: thesis §3.3.4, printed pp. 78–79 (PDF pp. 102–103), Listing 3.3a–c. These are excerpts, not standalone compilable definitions. The source C tool-option comment is // require -wp-model Typed+Cast. The thesis reports external verification; this presentation does not run a new proof. readElim concerns preservation of memory, not correctness of the returned read value or read-after-write. Translation is not claimed to be automatic. No imported C proof term or verification of all memory behaviour is claimed.';
 const states=[
  {name:'A memory component across languages',note:'Consider a memory component implemented in C. We want to use it in an Idris2 system model and reason about its behaviour.'},
  {name:'The operation signatures',note:'These signatures describe the memory read on the two sides. In Idris2 it takes an address and a memory state and returns a value and a state. The FFI connects it to the C operation. What must we know about this operation to reason about the system?\n\nThe expanded memRead signature uses P15 presentation notation: an ordinary output–state pair. It is not a literal expansion of the thesis linear pair and is not standalone checked Idris2 code. The exact readElim field shown next still uses the thesis getSt projection.'},
  {name:'State the required property',note:'The required property is that reading does not change memory. We express this as a type: the state after reading equals the original state. Point to the highlighted equality. This is memory preservation, not correctness of the returned value. Keep the operation signature visible so the relationship is explicit.'},
  {name:'Translate the property across the boundary',note:'The C operation remains the same as its signature moves below the contract. We express the same requirement in ACSL and verify it against the C function. Follow the translation arrow and matching equalities without explaining every ACSL construct. FFI is background context now.'},
  {name:'Verification and the interface assumption',note:'O1 callback: explicit behavioural contracts support the use of a stateful black-box component across this language boundary. Verification against the C implementation supports the assumption we use at the Idris2 interface. Follow the return arrow from C verification back to the assumption used in system reasoning.\n\nTranslation and external verification are separate steps. The C proof is not automatically imported as an Idris2 proof term; believe_me supplies assumed evidence in the wrapper. Correspondence between the specification, wrapper and implementation remains part of this boundary. We report the thesis verification, not a new proof run.\n\nWith composition rules and behavioural contracts in place, we can now construct a system model. Continue to the rising detector.'}
 ].map(s=>({...s,note:s.note+source}));
 const operation=root.querySelector('.lb-c-operation');
 const operationY=s=>s>=3?230:0;
 let step=0,busy=false,generation=0,animations=[];
 function render(){for(const item of items){const visible=step>=Number(item.dataset.lbReveal)&&step<=Number(item.dataset.lbLast??Infinity);item.style.opacity=visible?'1':'0';item.style.visibility=visible?'visible':'hidden';item.setAttribute('aria-hidden',String(!visible));}operation.style.transform='translateY('+operationY(step)+'px)';root.dataset.state=String(step+1);}
 function cancel(){generation++;for(const animation of animations)animation.cancel();animations=[];busy=false;render();}
 async function go(target,animate=true){
  const previous=step;cancel();step=Math.max(0,Math.min(states.length-1,Math.round(target)));render();
  if(!animate||step===previous||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const token=++generation;busy=true;
  // Preserve the C signature object as it moves below the new contract.
  const moving=operationY(previous)!==operationY(step);
  if(moving)animations.push(operation.animate([{transform:'translateY('+operationY(previous)+'px)'},{transform:'translateY('+operationY(step)+'px)'}],{duration:400,easing:'ease-in-out'}));
  for(const item of items){const threshold=Number(item.dataset.lbReveal);if(threshold>previous&&threshold<=step)animations.push(item.animate([{opacity:0},{opacity:1}],{duration:225,delay:moving&&step===3?400:0,easing:'ease-out',fill:'backwards'}));}

  await Promise.all(animations.map(a=>a.finished.catch(()=>{})));
  if(token===generation){for(const animation of animations)animation.cancel();animations=[];busy=false;render();}
 }
 render();const api={go,cancel,leave:cancel,states,getState:()=>({step,busy,count:5})};root.languageBoundaryController=api;return api;
};
