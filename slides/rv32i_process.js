window.slideFactories.rv32i_process=()=>{
 const root=document.getElementById('rv32i_process'),items=[...root.querySelectorAll('[data-rv-first]')],halos=[...root.querySelectorAll('[data-rv-focus]')];
 const source='\n\nSource: thesis Fig. 3.10 (printed p. 80), §3.4 and §3.5; Chapter 4 opening and §4.1 for the shallow-embedding limitations; AEiC P18 for mapping, transformation and point-free accessibility needs. The complete supplied vector figure, language colours, legend, topology and labels are preserved. The range of design activities is complete; formal verification and automation are not. Selected proofs and property-based tests provide scoped evidence, not complete processor verification. Transformations and hardware mappings were manual. No new proof or experiment is run, and no automatic Verilog generation or equivalence of every figure arrow is claimed.';
 const states=[
  {name:'A larger design process',note:'The rising detector illustrates the construction on a small example. We also explored a larger case: an RV32-I instruction-set model, taken through a design process involving Idris2, C, Python and Verilog.\n\nIntroduce RV32-I orally as a processor instruction-set case study. Do not narrate every numbered path.'},
  {name:'Modelling and simulation',note:'O1 callback: this case provides scoped stateful, black-box composition evidence. The model combines stateful components behind interfaces. We can execute it for simulation without exposing their implementation details.\n\nPoint to A and B, and simulation paths 1 and 4. The original figure labels path 4 Verification, Simulation; preserve both roles.'},
  {name:'Reasoning and validation',note:'Contracts support proofs of selected instruction properties. Partial simulation and property-based tests provide further validation of implementations.\n\nPoint to verification paths 2 and 4, partial-simulation model C/path 10, and property-test path 9. Explain selected proofs and test evidence without presenting the entire processor or every implementation as formally verified. Do not repeat the Listing 3.3 tutorial from 16B.'},
  {name:'Manual implementation',note:'We manually transformed the model and mapped it to Verilog, integrating memory IP. This demonstrated feasibility, but it was not an automatic compilation flow.\n\nPoint to transformation 3, hardware mapping 5 and 8, and implementation E. The pipeline transformation changes the original model’s behaviour; Fig. 3.10 describes activities and connections, not a chain of established equivalences. Mention this when discussing pipeline/equivalence; do not suggest behaviour preservation merely from the arrows.'},
  {name:'Needs motivating SynQ',note:'The O2 bracket groups the first three unmet design-process needs; O3 identifies the readable-modelling need. These labels connect motivations to objectives, not achieved capabilities. Our shallow models are ordinary Idris2 functions. Their types do not restrict them to the supported component vocabulary, so replacing each component with its target implementation is not always sufficient (C2). Their execution is tied to Idris2’s evaluation semantics, which must be aligned with target interpretations (C3). Transforming these models requires manipulating Idris2 terms through restricted metaprogramming, making transformations difficult to implement and verify (C4). Point-free composition also becomes cumbersome for larger models. We therefore need systematic mapping, aligned interpretations, support for applying and verifying refinements and transformations, and readable modelling notation.\n\nThese are needs motivating the next approach, not claims that SynQ completely solves every aspect. Do not claim Idris2 terms have no structure, all shallow models are unmappable, or tagless-final embedding requires an explicit syntax tree. The regular rising-detector example already uses identifiable compositions; the limitation concerns what this modelling discipline guarantees for arbitrary well-typed models.\n\nThese needs motivate the next step: a modelling language with controlled construction, different interpretations, and support for refinement and transformation.'}
 ].map(s=>({...s,note:s.note+source}));
 let step=0,busy=false,generation=0,animations=[];
 const category=s=>s===1?'modelling':s===2?'reasoning':s>=3?'implementation':'';
 const visible=(n,s)=>s>=Number(n.dataset.rvFirst)&&s<=Number(n.dataset.rvLast);
 function show(n,v){n.style.opacity=v?'1':'0';n.style.visibility=v?'visible':'hidden';n.setAttribute('aria-hidden',String(!v));}
 function render(){const needs=root.querySelector('.rv-case-limitations ul'),group=root.querySelector('.rv-needs-o2');group.style.setProperty('--needs-group-height',(needs.children[3].offsetTop-needs.children[0].offsetTop-24)+'px');for(const n of items)show(n,visible(n,step));for(const n of halos)show(n,!!category(step)&&n.dataset.rvFocus.split(' ').includes(category(step)));root.dataset.state=String(step+1);root.dataset.focus=category(step);}
 function cancel(){generation++;for(const a of animations)a.cancel();animations=[];busy=false;render();}
 async function go(target,animate=true){
  const previous=step;cancel();step=Math.max(0,Math.min(states.length-1,Math.round(target)));
  const changed=step!==previous;if(!changed||!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){render();return;}
  const token=++generation;busy=true;
  const replacement=(previous===4)!==(step===4);
  if(replacement){
   // One 225 ms text replacement; the complete vector figure stays fixed.
   const outgoing=root.querySelector(previous===4?'.rv-case-limitations':'.rv-case-achievements');
   animations.push(outgoing.animate([{opacity:1},{opacity:0}],{duration:112.5,easing:'ease-out'}));
   await Promise.all(animations.map(a=>a.finished.catch(()=>{})));
   if(token!==generation)return;for(const a of animations)a.cancel();animations=[];render();
   const incoming=root.querySelector(step===4?'.rv-case-limitations':'.rv-case-achievements');
   animations.push(incoming.animate([{opacity:0},{opacity:1}],{duration:112.5,easing:'ease-in'}));
  }else{
   render();for(const n of items)if(visible(n,step)&&!visible(n,previous))animations.push(n.animate([{opacity:0},{opacity:1}],{duration:225,easing:'ease-out'}));
   for(const n of halos)if(category(step)&&n.dataset.rvFocus.split(' ').includes(category(step)))animations.push(n.animate([{opacity:0},{opacity:1}],{duration:225,easing:'ease-out'}));
  }
  await Promise.all(animations.map(a=>a.finished.catch(()=>{})));
  if(token===generation){for(const a of animations)a.cancel();animations=[];busy=false;render();}
 }
 render();const api={go,cancel,leave:cancel,states,getState:()=>({step,busy,count:5})};root.rv32i_processController=api;return api;
};
