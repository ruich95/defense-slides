window.slideFactories.page6=()=>{
 const root=document.getElementById('page6'),items=[...root.querySelectorAll('[data-page6-reveal]')];
 const references='\n\nSource and attribution:\nRui Chen and Ingo Sander. A Quantitative Type Based Framework for Synchronous System Design. AEiC 2026, slide 3 of final/AEiC-26.pptx: original paper images, red highlights, positions, crops, overlap and dual-capability motivation. Thesis abstract and Chapter 1, printed pp. 3–4 (PDF pp. 27–28), motivate type-theory-based proof assistants accommodating programming, general-purpose languages with advanced type systems, and reasoning about both models and design steps. No additional source attribution appears in the original slide notes. Paper titles and author information remain visible in the supplied images.\n\nPaper excerpts:\nA Brief Overview of Agda — A Functional Language with Dependent Types.\nIdris, a general-purpose dependently typed programming language: Design and implementation.\nThe Lean 4 Theorem Prover and Programming Language.\nIdris 2: Quantitative Type Theory in Practice.\n\nPresenter guidance:\nDistinguish the underlying language from its proof-assistant environment. These examples do not imply that every listed language originated as a theorem prover; Idris explicitly targets programming. Embedding a model or operation does not automatically prove its properties: definitions and proofs must still be supplied. Do not equate usage quantities directly with execution time or hardware-resource budgets.';
 const states=[
  {
    "name": "Type theory for programming and proof",
    "note": "Languages based on type theory support general-purpose programming alongside interactive theorem proving. The FIR example raises both kinds of activity: executing a design step and establishing what it preserves. This is an opportunity for a common language foundation, rather than a claim that every integration or correctness problem has already been solved."
  },
  {
    "name": "Agda",
    "note": "Agda is described as a functional language with dependent types. It illustrates programming development within type-theory-based proof environments. Distinguish that environment and its emphasis on proof from the programming capabilities of the underlying language."
  },
  {
    "name": "Idris",
    "note": "Idris explicitly targets general-purpose programming with dependent types. That goal differs from adding programming facilities to an interactive proof environment. Point to the title, which makes the general-purpose programming goal explicit."
  },
  {
    "name": "Lean 4",
    "note": "Lean 4 describes itself as both a theorem prover and a programming language. Computation and interactive reasoning can share a language environment, although the languages shown here have different type theories and capabilities."
  },
  {
    "name": "Idris2",
    "note": "Idris2 continues the general-purpose programming goal and develops Quantitative Type Theory in practice. These papers are examples of the broader programming-and-proof opportunity; they do not all use QTT. The research question will name Idris2 as the specific host investigated in this thesis."
  },
  {
    "name": "Executable models and reusable design steps",
    "note": "Programming lets us define executable models and reusable design steps. Models are terms whose interpretation we can execute. Design steps can be reusable functions that take models to models. This lets the host language support practical operations on both the models and the design process."
  },
  {
    "name": "Properties and checked proofs",
    "note": "Formal reasoning lets us state properties of models and design steps. Dependent types provide a way to express those properties, and a proof supplies evidence for a stated property. The type checker checks that proof against its type. We still supply the semantic definitions and assumptions; simply stating a property does not establish it."
  },
  {
    "name": "Embedding a component-based design framework",
    "note": "This opens the possibility of embedding a component-based design framework in the same language we use to reason about its models and design steps. The models and the functions operating on them share the same general-purpose host. Verification relies on the relevant semantic definitions, assumptions and proofs."
  }
].map(state=>({...state,note:state.note+references}));
 let step=0,busy=false,generation=0,raf=0,resolveMotion=null;
 const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>x*x*(3-2*x);
 function render(from,to,t){for(const item of items){const at=+item.dataset.page6Reveal,value=(from>=at?1:0)*(1-t)+(to>=at?1:0)*t;item.style.opacity=value;item.style.visibility=value>0?'visible':'hidden';item.setAttribute('aria-hidden',String(value===0))}}
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done()}busy=false}
 async function go(target,animate=true){cancel();const token=++generation,from=step;step=Math.max(0,Math.min(states.length-1,Math.round(target)));busy=true;if(animate&&from!==step&&!matchMedia('(prefers-reduced-motion: reduce)').matches){render(from,step,0);await new Promise(resolve=>{resolveMotion=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const t=clamp((now-start)/225);render(from,step,ease(t));if(t<1)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve()}}raf=requestAnimationFrame(tick)})}if(token===generation){render(step,step,1);busy=false}}
 render(0,0,1);
 return {go,cancel,leave:cancel,states,getState:()=>({step,busy,count:states.length})};
};
