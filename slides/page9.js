window.slideFactories.page9=()=>{
 const root=document.getElementById('page9'),process=root.querySelector('#p9-process-view'),pairing=root.querySelector('#p9-pairing'),inputHighlight=root.querySelector('#p9-instant-highlight'),outputHighlight=root.querySelector('#p9-output-highlight'),definition=root.querySelector('.page9-synchrony'),isomorphism=root.querySelector('.page9-isomorphism');
 const guidance='\n\nPresenter guidance: The last figure compares representations of the two input signals. It does not claim that the preceding process P is the pairing operation or is invertible. Do not imply a fixed physical sampling rate. Defer absent events, clock calculi, scheduling and full semantics.';
 const references='\n\nSources: AEiC-26 slide 5 (pairing artwork); thesis section 3.3 (synchronous isomorphism in composition); ForSyDe methodology, https://people.kth.se/~ingo/Papers/DATE2003.pdf (processing input and output events at the same tag).\n\nArtwork: crisp vector signal cells and mathematical lettering, approximately 33.4 px at the slide scale. The generic P node uses the rounded pale-coral body, small square ports, thin rounded connections and dart arrowheads of displayed P3’s PLL-demodulator model (figures/svg/fm-demod-pll.svg). No travelling events or physical-time delay are animated.';
 const states=[
  {name:'A synchronous process',note:'Let us first make precise what we mean by synchronous systems. This process has two input signals and one output signal. We describe their behaviour at discrete logical clock ticks: x₁, y₁ and z₁ belong to the first logical clock tick, and so on.'},
  {name:'Perfect synchrony',note:'Under the perfect-synchrony hypothesis, the reaction to the inputs at a logical clock tick produces its output at that same logical clock tick. Here x₂, y₂ and z₂ share the same logical clock tick. The physical implementation still takes time; the model abstracts from that duration. A reaction may use stored state, so this does not exclude dependence on earlier inputs.'},
  {name:'Synchronous isomorphism',note:'All these signals share the same logical clock ticks. We can therefore also describe their relationship structurally: two synchronous signals can be viewed as one signal of pairs. Pairing and separating the values at each instant are inverse operations. This synchronous isomorphism will be useful when we describe composition.\n\nTransition to P10: With the behavioural model in place, let us turn to the language foundation: Quantitative Type Theory.'}
 ].map(state=>({...state,note:state.note+guidance+references}));
 const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>x*x*(3-2*x),mix=(a,b,t)=>a*(1-t)+b*t,presence=(at,from,to,t)=>mix(from>=at?1:0,to>=at?1:0,t);
 let step=0,busy=false,generation=0,raf=0,resolveMotion=null;
 function alpha(node,value){node.style.opacity=value;node.style.visibility=value>0?'visible':'hidden';node.setAttribute('aria-hidden',String(value===0))}
 function render(from,to,t){
  const selected=presence(1,from,to,t);alpha(inputHighlight,selected);alpha(outputHighlight,selected);alpha(definition,selected);
  // Only P/connections, the central relation arrow and output text swap.
  // All sequence outlines and selected events are common, stationary artwork.
  if(from<2&&to===2){alpha(process,clamp(1-2*t));alpha(pairing,clamp(2*t-1));alpha(isomorphism,clamp(2*t-1))}
  else if(from===2&&to<2){alpha(pairing,clamp(1-2*t));alpha(isomorphism,clamp(1-2*t));alpha(process,clamp(2*t-1))}
  else{alpha(process,to<2?1:0);alpha(pairing,to===2?1:0);alpha(isomorphism,to===2?1:0)}
 }
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done()}busy=false}
 async function go(target,animate=true){cancel();const token=++generation,from=step;step=Math.max(0,Math.min(states.length-1,Math.round(target)));busy=true;
  if(animate&&from!==step&&!matchMedia('(prefers-reduced-motion: reduce)').matches){render(from,step,0);await new Promise(resolve=>{resolveMotion=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const t=clamp((now-start)/225);render(from,step,ease(t));if(t<1)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve()}}raf=requestAnimationFrame(tick)})}
  if(token===generation){render(step,step,1);busy=false}
 }
 render(0,0,1);
 const api={go,cancel,leave:cancel,states,getState:()=>({step,busy,count:states.length})};root.page9Controller=api;return api;
};
