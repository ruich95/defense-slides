window.slideFactories.page10=()=>{
 const root=document.getElementById('page10'),example=root.querySelector('.page10-example'),items=[...root.querySelectorAll('[data-page10-reveal]')],guides=[...root.querySelectorAll('[data-page10-guide]')],focus=[...root.querySelectorAll('[data-page10-focus]')],underlines=[...root.querySelectorAll('[data-page10-underline]')];
 const guidance='\n\nPresenter guidance: This is an illustrative type signature, not a standalone runnable program. R is an unspecified result-type family indexed by x and y; no definition of foo or R is assumed. Do not suggest that every arbitrary R makes such a function implementable. The unrestricted z is deliberately absent from R x y. Dependence is on terms, not only on evaluated values. Type-level occurrences do not count as runtime uses of an argument. The multiplicities describe the Idris2/QTT setting here and concern usage rather than clock cycles, execution time, energy, or hardware area. Annotation-to-code guides and underlines persist after reveal. The two binder-to-result dependency curves appear only in state 2. The mathematical omega is not inserted into the code.';
 const references='\n\nSources: final/AEiC-26.pptx, slide 5, lower half: illustrative signature and syntax-colour vocabulary, extended here with the ordinary unrestricted binder z. Thesis, Section 1.2.3 (printed pp. 20–21): dependent types for formal specification and reasoning, and multiplicities for construction and use. Section 4.2.1 (printed pp. 97–98): multiplicity 0 on abstract type parameters supports parametricity and restricts model construction to permitted constructors in the supplied context. Idris2 tutorial, Multiplicities: https://idris2.readthedocs.io/en/latest/tutorial/multiplicities.html . Layout follows defense-draft.pptx slide 5 and the preceding Synchronous Systems page.';
 const states=[
  {name:'A schematic Idris2 function type',note:'We now turn to the language foundation. QTT combines dependent types and linear types through usage multiplicities. Here is a schematic Idris2 function type. Read the arrows as successive arguments followed by a result: foo takes three natural-number arguments, x, y and z, and produces a result of type R x y. I will explain the annotations in a moment.'},
  {name:'Types depend on terms',note:'Types can depend on terms. Here R stands for a family of result types indexed by x and y. The guides connect the result occurrences to their binders. This is the dependent-type part: types can refer to terms and express their properties. Dependence is not restricted to already evaluated values.'},
  {name:'Zero: erased at run time',note:'Multiplicity zero means that x is erased at run time. It can still occur in types, as it does here, but it is not available as an ordinary runtime argument. This Nat argument illustrates erasure. It does not itself illustrate the abstract-type parametricity used later in SynQ.'},
  {name:'One: exactly one runtime use',note:'Multiplicity one requires exactly one runtime use of y. This is linearity. The language checks this usage discipline. Mentioning y in the result type does not consume its runtime use.'},
  {name:'Unrestricted usage',note:'The remaining multiplicity is unrestricted, conventionally written omega. The z binder has this multiplicity and may be used freely, including not at all. In ordinary Idris2 source, unrestricted arguments need no explicit multiplicity annotation. The result remains R x y, independently of z.'},
  {name:'Roles in system modelling',note:'These features have two roles in the framework. Dependent types support formal specification and reasoning. Usage multiplicities constrain how system models can be constructed and used. Multiplicity one supports disciplined use of state and resources. Multiplicity zero permits reasoning about linear terms without consuming them. On abstract type parameters, multiplicity zero also supports parametricity: together with the supplied constructor context, it restricts construction to permitted model constructors. That later use is distinct from the erased Nat x shown here.\n\nTransition: Let us first see how linear terms can represent resources and state. The next page is Linear Terms as Resources.'}
 ].map(state=>({...state,note:state.note+guidance+references}));
 const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},mix=(a,b,t)=>a*(1-t)+b*t;
 const stateAt=s=>({levels:[1,2,3,4,5].map(at=>s>=at?1:0),focus:[1,2,3,4].map(at=>s===at?1:0),compact:s===5?1:0});
 let step=0,busy=false,generation=0,raf=0,resolveMotion=null,visual=stateAt(0);
 function alpha(node,value){node.style.opacity=value;node.style.visibility=value>0?'visible':'hidden';node.setAttribute('aria-hidden',String(value===0))}
 function render(value){
  visual=value;
  for(const node of items)alpha(node,value.levels[+node.dataset.page10Reveal-1]);
  for(const node of guides)alpha(node,value.levels[+node.dataset.page10Guide-1]);
  alpha(root.querySelector('[data-page10-dependencies-only]'),value.focus[0]);
  for(const node of underlines)node.style.setProperty('--p10-link',value.levels[+node.dataset.page10Underline-1]);
  for(const node of focus)node.style.setProperty('--p10-focus',value.focus[+node.dataset.page10Focus-1]);
  example.style.transform=`translateY(${-85*value.compact}px) scale(${1-.07*value.compact})`;
  root.querySelector('.page10-multiplicities').style.transform=`translateY(${-50*value.compact}px)`;
  for(const [selector,dx] of [['.page10-zero',180],['.page10-one',75],['.page10-unrestricted',-20]])root.querySelector(selector).style.transform=`translateX(${dx*value.compact}px)`;
  root.querySelector('.page10-dependency').style.transform=`translateY(${18*value.compact}px)`;
  root.querySelector('.page10-takeaways').style.transform=`translateY(${-45*value.compact}px)`;
  prepareGuides();
 }
 function interpolate(from,to,ms,duration,finalMove){
  const t=ease(ms/duration),value={levels:from.levels.map((v,i)=>mix(v,to.levels[i],t)),focus:from.focus.map((v,i)=>mix(v,to.focus[i],t)),compact:mix(from.compact,to.compact,t)};
  if(finalMove){const forward=to.compact>from.compact;value.compact=mix(from.compact,to.compact,ease((ms-(forward?0:150))/400));value.levels[4]=mix(from.levels[4],to.levels[4],ease((ms-(forward?400:0))/150))}
  return value;
 }
 function prepareGuides(){
  // Coordinates are local to the one transformed composition, including during motion.
  const bounds=example.getBoundingClientRect(),scale=bounds.width/1600;
  if(!scale)return;
  const rect=node=>{const b=node.getBoundingClientRect();return{left:(b.left-bounds.left)/scale,right:(b.right-bounds.left)/scale,top:(b.top-bounds.top)/scale,bottom:(b.bottom-bounds.top)/scale,width:b.width/scale}};
  const token=id=>rect(root.querySelector('#'+id)),anchor=(id,edge,offset=9)=>{const b=token(id);return{x:(b.left+b.right)/2,y:edge==='top'?b.top-offset:b.bottom+offset}};
  const code=token('p10-signature'),x=anchor('p10-result-x','top',16),bx=anchor('p10-binder-x','top',16),y=anchor('p10-result-y','bottom'),by=anchor('p10-binder-y','bottom');
  const path=(id,d)=>root.querySelector('#'+id).setAttribute('d',d),upper=code.top-55,lower=code.bottom+55;
  path('p10-guide-x',`M${x.x} ${x.y} C${x.x} ${upper} ${bx.x} ${upper} ${bx.x} ${bx.y}`);
  path('p10-guide-y',`M${y.x} ${y.y} C${y.x} ${lower} ${by.x} ${lower} ${by.x} ${by.y}`);
  const result=token('p10-result'),dependency=rect(root.querySelector('.page10-dependency'));
  path('p10-guide-dependency',`M${result.right-10} ${code.top-9} L${result.right-10} ${dependency.bottom+15} L${dependency.left+dependency.width*.75} ${dependency.bottom+15} L${dependency.left+dependency.width*.75} ${dependency.bottom+7}`);
  for(const [id,binder,group] of [['p10-guide-zero','p10-zero','.page10-zero'],['p10-guide-one','p10-one','.page10-one']]){
   const a=anchor(binder,'bottom'),b=rect(root.querySelector(group+' .page10-symbol strong'));
   // These routes sit to the left of the lower y-dependency arc.
   path(id,`M${a.x} ${a.y} L${a.x} ${b.top-30} L${b.left+b.width/2} ${b.top-30} L${b.left+b.width/2} ${b.top-9}`);
  }
  const z=anchor('p10-unrestricted','bottom'),omega=rect(root.querySelector('.page10-unrestricted .page10-symbol strong'));
  // Match the other multiplicity guides with a short elbow below the code.
  // The x/y dependency curves have already disappeared when omega is revealed.
  path('p10-guide-unrestricted',`M${z.x} ${z.y} L${z.x} ${omega.top-30} L${omega.left+omega.width/2} ${omega.top-30} L${omega.left+omega.width/2} ${omega.top-9}`);
 }
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done()}busy=false}
 async function go(target,animate=true){
  cancel();const token=++generation,from=visual;step=Math.max(0,Math.min(states.length-1,Math.round(target)));const to=stateAt(step);busy=true;
  await document.fonts.load('34px DefenseCode');if(token!==generation)return;prepareGuides();
  const finalMove=from.compact!==to.compact,duration=finalMove?550:225;
  if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   await new Promise(resolve=>{resolveMotion=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const ms=Math.min(now-start,duration);render(interpolate(from,to,ms,duration,finalMove));if(ms<duration)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve()}}raf=requestAnimationFrame(tick)});
  }
  if(token===generation){render(to);busy=false}
 }
 function previewTransition(ms,reverse=false){cancel();step=reverse?4:5;prepareGuides();render(interpolate(stateAt(reverse?5:4),stateAt(reverse?4:5),clamp(ms/550)*550,550,true))}
 render(visual);
 const api={go,cancel,leave:cancel,states,resize:prepareGuides,previewTransition,getState:()=>({step,busy,count:states.length})};root.page10Controller=api;return api;
};
