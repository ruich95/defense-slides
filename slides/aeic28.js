window.slideFactories.aeic28=()=>{
 const root=document.getElementById('aeic28'),reveals=[...root.querySelectorAll('[data-aeic28-reveal]')],figure=root.querySelector('#aeic28-native-fir'),annotations=[...root.querySelectorAll('[data-fir-annotation]')],components=[...root.querySelectorAll('[data-fir-component]')],wires=[...root.querySelectorAll('[data-fir-wire]')],code=[...root.querySelectorAll('[data-code-focus]')];
 const source='\n\nSource: final/AEiC-26.pptx slide28; original code image91.svg–image93.svg unchanged. Native figure derives from g208 in AEiC-26/drawing.svg (the fir-viz.png export). This presentation copy omits the original background bands/route fills and tap label/bracket; remaining circuit and annotation geometry and component colours are unchanged. Thesis §5.3.1/Fig.5.5, printed pp.146–147; preservation refers to Proposition5.2 under associativity. Highlights explain correspondence, not a sample-flow/scheduling simulation or a newly run proof/experiment.';
 const connection='\n\nCallback to the introduction: This is the FIR computation already used to illustrate a structural design choice. The receiver’s compensation FIR is sequential, whereas this experiment uses the direct-form model. If making the connection, say: “Unrolling the computation for one output sample exposes its products and sum, while retaining the sample history.” Do not say “remove all registers.” A verified SynQ conversion from the receiver’s sequential FIR to this direct-form model is not claimed.';
 const states=[
  {"name": "Original FIR model and network", "note": "This direct-form FIR contains the reduction just discussed. The original circuit, code, xin and o are visible. Sample history remains in the delay line. The cur/weighted/nxt annotations are initially hidden. The presentation has no tap label, dashed bracket or background highlight bands."},
  {"name": "Read and extend the current history", "note": "Read cur from the stored sample history, then form cur′ by pairing xin with cur. Blue wire traces and the cur annotation show correspondence to the input and retained history, not a time-domain simulation."},
  {"name": "Form the weighted collection", "note": "The exact weighted line applies multKs to the coefficients and current sample collection. Blue outlines emphasize the native multipliers and wire traces emphasize their outputs; the original weighted annotation appears."},
  {"name": "Reduce the original weighted collection", "note": "The o = sum << weighted line and original reduce add are emphasized together with the original adder chain and o. This remains the source direct-form network; no balanced network is drawn."},
  {"name": "Store the next sample history", "note": "The nxt = dropLast cur′ and set nxt lines correspond to the original next-history path and nxt annotation. Previous live emphasis clears while annotations accumulate. Dropping the oldest sample and storing the next history are retained in the model."},
  {"name": "Balance before reducing", "note": "The arrow and original compact transformed sum appear. Dark-red emphasis first marks balance x, then blue emphasis marks reduce add; both remain highlighted at the endpoint. The four weighted-output/input wires stay dark red with balance x; adder outlines and the other sum/output wires stay blue with reduce add. Balance reshapes the weighted collection before reduction. The drawn network remains the original chain, and the sample-history update is unchanged. Preservation depends on associativity of the chosen adder; finite-precision arithmetic requires its stated assumptions. The compact dependent-pair presentation is retained unchanged.\n\nTransition: A shallower reduction tree exposes more parallelism. How does that affect the design choices available on a platform?"}
 ].map(s=>({...s,note:s.note+connection+source}));
 const focus=['','cur','weighted','sum','nxt','sum'],targets=[[],['history-get','history-prod'],['weighted'],['output','reduce-original'],['next-drop','next-set'],['balance','reduce-balanced']],at={cur:1,weighted:2,nxt:4};
 const clamp=x=>Math.max(0,Math.min(1,x)),mix=(a,b,t)=>a+(b-a)*t,ease=t=>t*t*(3-2*t);
 let step=0,busy=false,generation=0,raf=0,finish=null;
 function alpha(n,v){n.style.opacity=String(v);n.style.visibility=v>0?'visible':'hidden';n.setAttribute('aria-hidden',String(v===0));}
 function render(from,to,t){
  root.dataset.state=String(to+1);root.dataset.motionProgress=String(t);
  const finalMove=to===5&&from!==5&&t<1,first=clamp(t*2),second=clamp(t*2-1);
  for(const n of annotations)alpha(n,mix(from>=at[n.dataset.firAnnotation]?1:0,to>=at[n.dataset.firAnnotation]?1:0,t));
  for(const n of code){
   const old=targets[from].includes(n.dataset.codeFocus)?1:0,next=targets[to].includes(n.dataset.codeFocus)?1:0;
   let v=mix(old,next,t);
   if(finalMove){v=old*(1-first);if(n.dataset.codeFocus==='balance')v=first;if(n.dataset.codeFocus==='reduce-balanced')v=second;}
   alpha(n,v);
  }
  for(const n of reveals)alpha(n,finalMove?first:mix(from===5?1:0,to===5?1:0,t));
  const active=finalMove&&t<=.5?'weighted-input':focus[to];root.dataset.firFocus=active;
  for(const n of components)n.classList.toggle('fir-active-component',(active==='cur'&&n.dataset.firComponent==='delay')||(active==='weighted'&&n.dataset.firComponent==='multiplier')||(active==='sum'&&n.dataset.firComponent==='adder'));
  for(const n of wires)n.classList.toggle('fir-active-wire',active==='weighted-input'?n.dataset.firWire.split(' ').includes('weighted'):n.dataset.firWire.split(' ').includes(active)&&active!=='');
  figure.setAttribute('aria-label',states[to].name+'. Original direct-form FIR chain and retained sample history.');
 }
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(finish){const done=finish;finish=null;done();}busy=false;render(step,step,1);}
 async function go(target,animate=true){cancel();const token=++generation,from=step;step=Math.max(0,Math.min(states.length-1,Math.round(target)));if(!animate||from===step||matchMedia('(prefers-reduced-motion: reduce)').matches){render(step,step,1);return;}busy=true;const duration=step===5?450:225;render(from,step,0);await new Promise(resolve=>{finish=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const t=clamp((now-start)/duration);render(from,step,ease(t));if(t<1)raf=requestAnimationFrame(tick);else{raf=0;finish=null;resolve();}}raf=requestAnimationFrame(tick);});if(token===generation){busy=false;render(step,step,1);}}
 render(0,0,1);const api={go,cancel,leave:cancel,states,getState:()=>({step,busy,count:6})};root.aeic28Controller=api;return api;
};
