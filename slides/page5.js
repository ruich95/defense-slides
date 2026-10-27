window.slideFactories.page5=()=>{
 const root=document.getElementById('page5'),moving=root.querySelector('.page5-start-pyramid'),bar=root.querySelector('[data-page5-phase-bar]'),opening=root.querySelector('.page5-opening'),items=[...root.querySelectorAll('[data-page5-reveal]')];
 const qualifications='\n\nPresenter qualifications:\nThe diagram includes sample-history storage; the snippets receive an already supplied sample window. Exact streaming correspondence must also account for history updates and timing. The snippets use signed 16-bit samples and coefficients, with signed 64-bit arithmetic for the result. Do not suggest equivalence for arbitrary real inputs or unspecified arithmetic semantics. C and Verilog are alternative implementations here, not a verified translation chain. Different representations serve useful purposes; the challenge is maintaining their relationships while supporting executable operations and formal reasoning. The overarching research question follows on page 7.\n\nSources:\nRui Chen, PhD thesis introduction, printed pp. 3–4. Artwork: figures/svg/page5-draft.svg; figures/svg/fir4-equation-outlined.svg; figures/fir-representations/fir4-c.svg and fir4-verilog.svg. The edited draft controls panel geometry and language headings.';
 const states=[
  {name:'Different representations and tools',note:'As the page opens (continue after the 250 ms collapse): Let us look more closely at the representations used at these different stages.\n\nAfter the opening statement appears: Providing practical and formal support throughout the process is challenging because different abstraction levels involve different representations and tools.'},
  {name:'A mathematical specification',note:'For example, we can specify the required behaviour of a filter as a mathematical relationship between its input and output samples.'},
  {name:'A FIR model',note:'We then construct a model describing how to obtain that behaviour.'},
  {name:'Satisfying the specification',note:'We need to establish that this model satisfies the specification.'},
  {name:'A software implementation',note:'The computation can be implemented in software, as illustrated by this C description.'},
  {name:'A hardware implementation',note:'Alternatively, we can describe a hardware implementation in Verilog. Its execution semantics differ from those of C.'},
  {name:'Preserving the required behaviour',note:'For either implementation, we must establish that it preserves the required behaviour. The correspondence between the implementation and the model must account for their execution semantics.'},
  {name:'Supporting computation and formal reasoning',note:'We need to execute design steps across these representations and justify what they establish or preserve. This motivates investigating a common foundation for computation and formal reasoning.\n\nTransition to page 6: Type-theoretic languages offer both capabilities.'}
 ].map(s=>({...s,note:s.note+qualifications}));
 let step=0,busy=false,entering=false,generation=0,raf=0,resolveMotion=null,entranceElapsed=0,entranceCount=0,lastEntranceDuration=0;
 const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>x*x*(3-2*x),mix=(a,b,t)=>a+(b-a)*t,reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const reference=document.querySelector('#page4 .requirements-pyramid-region'),style=reference?getComputedStyle(reference):null;
 const start={left:style?parseFloat(style.left):1058,top:style?parseFloat(style.top):203,width:style?parseFloat(style.width):455,height:style?parseFloat(style.height):516};
 const end={left:1480,top:75,width:34,height:750},entranceDuration=250;
 moving.style.width=start.width+'px';moving.style.height=start.height+'px';
 const phaseLabels=[...moving.querySelectorAll('text')];
 function alpha(node,value){node.style.opacity=value;node.style.visibility=value>0?'visible':'hidden';node.setAttribute('aria-hidden',String(value===0))}
 function reveals(from,to,t){for(const node of items){const threshold=+node.dataset.page5Reveal;alpha(node,mix(from>=threshold?1:0,to>=threshold?1:0,t))}}
 function settled(target){alpha(moving,0);alpha(bar,1);alpha(opening,1);reveals(target,target,1);root.dataset.page5Mode='settled';entranceElapsed=entranceDuration;root.dataset.entranceElapsed=String(entranceDuration)}
 function renderEntrance(ms){const timeline=ms/entranceDuration*800;entranceElapsed=ms;root.dataset.page5Mode='entrance';root.dataset.entranceElapsed=String(ms);const e=ease(clamp((timeline-100)/550)),cross=clamp((timeline-500)/150);moving.style.transform=`translate(${mix(start.left,end.left,e)}px,${mix(start.top,end.top,e)}px) scale(${mix(start.width,end.width,e)/start.width},${mix(start.height,end.height,e)/start.height})`;alpha(moving,1-cross);for(const label of phaseLabels)label.style.opacity=1-clamp((timeline-100)/120);alpha(bar,cross);alpha(opening,clamp((timeline-650)/150));reveals(-1,-1,1)}
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done(false)}busy=false;entering=false}
 function motion(duration,draw,token){return new Promise(resolve=>{resolveMotion=resolve;const startTime=performance.now();function tick(now){if(token!==generation)return;const elapsed=Math.min(duration,now-startTime);draw(elapsed);if(elapsed<duration)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve(true)}}raf=requestAnimationFrame(tick)})}
 async function go(target,animate=true){cancel();const token=++generation,from=step;step=Math.max(0,Math.min(states.length-1,Math.round(target)));busy=true;alpha(moving,0);alpha(bar,1);alpha(opening,1);if(animate&&from!==step&&!reduced()){reveals(from,step,0);await motion(225,t=>reveals(from,step,ease(t/225)),token)}if(token===generation){settled(step);busy=false}}
 async function enter({playEntrance=false}={}){cancel();step=0;const token=++generation;busy=true;entering=true;if(!playEntrance||reduced()){settled(0);busy=false;entering=false;return}renderEntrance(0);await document.fonts.ready;if(token!==generation)return;entranceCount++;const began=performance.now(),completed=await motion(entranceDuration,renderEntrance,token);if(completed&&token===generation){lastEntranceDuration=performance.now()-began;settled(0);busy=false;entering=false}}
 function previewEntrance(ms){cancel();step=0;renderEntrance(Math.max(0,Math.min(entranceDuration,ms)))}
 renderEntrance(0);
 const api={go,enter,cancel,leave:cancel,states,previewEntrance,getState:()=>({step,busy,entering,count:states.length,entranceElapsed,entranceCount,lastEntranceDuration}),resize:()=>{}};
 root.page5Controller=api;
 return api;
};
