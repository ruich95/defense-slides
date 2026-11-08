window.slideFactories.candidate_foundation=()=>{
 const root=document.getElementById('candidate_foundation'),items=[...root.querySelectorAll('[data-candidate-reveal]')],figure=root.querySelector('#candidate-native-fir');
 const source="\n\nSources: thesis §§1.1.2–1.2.2 and Fig.1.3 for atomic components/constants, glues/functions and models/terms; §5.3.1 for the FIR balancing example. Native circuit: g11 from figures/svg/page5-draft.svg, reused from displayed P5 with only its outer panel removed.";
 const states=[
  {"name": "The FIR filter before the embedding cues", "note": "What would such an embedding look like for our FIR filter?"},
  {
    "name": "Atomic components as constants",
    "note": "The blue design terms are paired with their dark-green functional-programming interpretations. The ten blue outlines identify the atomic components: four multipliers, three adders and three sample delays. In the host language, constant names can represent these atoms. Combining them constructs a model term, as in Figure 1.3.\n\nPointing cue: identify the ten component symbols. The unhighlighted wires show their connections."
  },
  {
    "name": "Composition operators as functions",
    "note": "The blue wires and junctions show the connections specified by the composition operators. These operators, or glues, are functions that combine components into a model term. We can define and apply them in the functional host.\n\nPointing cue: trace the network connections built by the composition operators. Describe an individual wire as a connection specified by an operator."
  },
  {
    "name": "Transformations on model terms",
    "note": "Transformations are functions from models to models. The three blue adders and seven distinct blue wires identify the reduction in this input model: four product outputs and two intermediate sums enter the adders, and all three adder outputs are traced through the final output arrow. The two intermediate-sum wires are both outputs and inputs. Mathematically, this is a sum of four products. A transformation can reassociate that sum into a more balanced addition tree under associativity, while preserving operand order.\n\nPresenter guidance: this remains the original FIR model; the cue identifies the reduction to transform, not a displayed transformed result. Thesis §5.3.1 illustrates balancing. Behaviour preservation depends on the interpreted operation and its associativity, together with the relevant arithmetic, state and timing assumptions. A data-dependency graph does not by itself specify a processor schedule."
  },
  {
    "name": "Reuse the host language",
    "note": "Embedding lets designers reuse the host language’s abstractions, type checker and tools. The figure is neutral again. Models are terms in the host, and composition operators and transformations are functions we can define and reuse. Point to a delay: it carries the previous sample. Components must agree about which logical sample they are processing. This motivates the synchronous-system scope of the research question on the next page."
  }
].map(s=>({...s,note:s.note+source}));
 const figureCues=["Four-tap FIR filter with four multipliers, three adders and three sample delays, in its original base colours.", "Four-tap FIR filter. Ten atomic components are outlined in blue: four multipliers, three adders and three sample delays.", "Four-tap FIR filter. Eighteen wires and three junctions are blue, showing the connections specified by composition operators.", "Four-tap FIR filter. Three blue adder outlines and seven blue wires, including all six incoming paths and all three adder outputs through the final output arrow, identify the sum of four products in the input model.", "Four-tap FIR filter with four multipliers, three adders and three sample delays."];
 const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>x*x*(3-2*x);
 let step=0,busy=false,generation=0,raf=0,finish=null;
 function render(from,to,t){root.dataset.figureHold=String(to);figure.setAttribute('aria-label',figureCues[to]);for(const n of items){const at=+n.dataset.candidateReveal,value=(from>=at?1:0)*(1-t)+(to>=at?1:0)*t;n.style.opacity=value;n.style.visibility=value>0?'visible':'hidden';n.setAttribute('aria-hidden',String(value===0))}}
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(finish){const done=finish;finish=null;done()}busy=false}
 async function go(target,animate=true){cancel();const token=++generation,from=step;step=Math.max(0,Math.min(states.length-1,Math.round(target)));busy=true;if(animate&&from!==step&&!matchMedia('(prefers-reduced-motion: reduce)').matches){render(from,step,0);await new Promise(resolve=>{finish=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const t=clamp((now-start)/225);render(from,step,ease(t));if(t<1)raf=requestAnimationFrame(tick);else{raf=0;finish=null;resolve()}}raf=requestAnimationFrame(tick)})}if(token===generation){render(step,step,1);busy=false}}
 render(0,0,1);return{go,cancel,leave:cancel,states,getState:()=>({step,busy,count:states.length})};
};
