window.slideFactories.normalisation=()=>{
 const root=document.getElementById('normalisation'),items=[...root.querySelectorAll('[data-norm-first]')];
 const provenance='\n\nSource: thesis §5.1.2, Proposition 5.1 and Fig. 5.1, printed pp. 135–138 (PDF pp. 159–162). Figure 5.1 is a proportional vector crop of the supplied thesis PDF, including every intrinsic label and excluding the external caption. It is not redrawn or simplified. Abstract interpretation here is the tagless-final mechanism for interpreting a SynQ model into another abstract model, not a claim about a particular lattice-based static analysis. No new proof, normalisation run or hardware-cost experiment is reported.';
 const states=[
  {name:'Normalisation as an interpretation',note:'The first route interprets a SynQ model into a transformed model. Here we reduce model-level function applications before interpreting the result for a target. The complete figure stays fixed throughout this page. Its upper region contains models over Comb. Dashed arrows show normalisation into CombL, within the implementation space.'},
  {name:'Beta-reduction',note:'For combinational terms, app (lam f) x becomes the direct Idris2 function application f x. This is beta-reduction: paired app and lam disappear before target interpretation. Point to the two equivalent source forms mapping to the normalised form. Do not claim that every abstraction or every remaining lam is removed.'},
  {name:'An abstract result model',note:'O2 callback: the executable normalisation transformation is an Idris2 function from a SynQ model to another abstract model. This implemented design step is O2 evidence. Result form, totality and per-model behaviour-preservation obligations remain distinct. The result is a model over CombL that can be interpreted again. CombL excludes app, while abst maps unreduced lam constructors into CombL. The source language remains expressive, and the result remains abstract rather than being committed to hardware or software. The negative occurrence and the internal V/E separation used to obtain a total implementation are available in backup B14.'},
  {name:'Result form',note:'There are distinct questions about correctness. The result form is controlled by the target vocabulary: CombL excludes app. This type-correct construction is distinct from termination and from semantic equivalence.'},
  {name:'Totality',note:'The thesis presents a normaliser whose totality can be asserted. An initial internal higher-order representation has a negative occurrence of E, which obstructs this totality argument. Separating values V from expressions E, together with NotUnit and the impossible branch in app\u0027, supports the accepted total implementation. These internal choices do not restrict the expressive source language. The details stay in backup B14.'},
  {name:'Behaviour preservation per model',note:'Verification remains a per-model obligation here, not an already established general preservation theorem. Per-model contracts support checked proofs on demand. Each contract states the particular behaviour-preservation property for that model. The thesis does not obtain a general theorem for every model in this encoding. contract sys generates the proposition for a particular system. The auto proof argument requests construction and checking of that proof on demand. Merely constructing the contract does not prove it, and auto is not claimed complete for all instances. Do not generalise this limitation into a claim that Idris2 cannot prove propositions quantified over functions. Type-correct result construction and totality are separate from behaviour preservation. Backup B15 retains the general proposition and exact contract.\n\nTransition: The next approach transforms the description from which a model is constructed, allowing a general behaviour-preservation proof under associativity.'}
 ].map(s=>({...s,note:s.note+provenance}));
 let step=0,busy=false,generation=0,animations=[];
 const visible=(n,s)=>s>=Number(n.dataset.normFirst)&&s<=Number(n.dataset.normLast);
 function show(n,on){n.style.opacity=on?'1':'0';n.style.visibility=on?'visible':'hidden';n.setAttribute('aria-hidden',String(!on));}
 function render(){for(const n of items)show(n,visible(n,step));root.dataset.state=String(step+1);}
 function cancel(){generation++;for(const a of animations)a.cancel();animations=[];busy=false;render();}
 async function go(target,animate=true){
  const previous=step;cancel();step=Math.max(0,Math.min(states.length-1,Math.round(target)));
  if(step===previous||!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){render();return;}
  const token=++generation;busy=true;
  render();animations=items.filter(n=>visible(n,step)&&!visible(n,previous)).map(n=>n.animate([{opacity:0},{opacity:1}],{duration:225,easing:'ease-out'}));
  await Promise.all(animations.map(a=>a.finished.catch(()=>{})));
  if(token!==generation)return;for(const a of animations)a.cancel();animations=[];busy=false;render();
 }
 render();const api={go,cancel,leave:cancel,states,getState:()=>({step,busy,count:states.length})};root.normalisationController=api;return api;
};
