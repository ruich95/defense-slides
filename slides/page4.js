window.slideFactories.page4=()=>{
const root=document.getElementById('page4'),items=[...root.querySelectorAll('[data-requirements-reveal]')];
const automation=root.querySelector('.requirements-challenges>li'),support=root.querySelector('.automation-support');
const references='\n\nReferences and attribution:\nRui Chen and Ingo Sander, A Quantitative Type Based Framework for Synchronous System Design, AEiC 2026, first content slide (slide 2 in final/AEiC-26.pptx): the motivation pairs executable models with formal semantics, and applicable design steps with formal accountability.\n\nJoseph Sifakis, System Design Automation: Challenges and Limitations, Proceedings of the IEEE 103(11), 2015, pp. 2093–2103. https://www-verimag.imag.fr/~sifakis/papers_pdfs/SystemDesignautomationNov2015.pdf\nSection II motivates accountability throughout the process; Sections III–IV discuss modelling and component support; Sections V–VI develop semantic coherency and correctness by construction; Section VII recognises the continuing role of human judgement in design.\n\nAutomation and correctness organise this slide as a synthesis for this presentation. They are not a quoted two-part classification from Sifakis, whose paper develops four interrelated design principles.\n\nDiagram guidance: The cone schematically represents specification satisfaction. Its geometry is neither a proof nor a quantitative measure of the design space. It includes the PLL alternative, the quadrature alternative, and the transformed model. Specification satisfaction and meeting the earlier multiplier-budget constraint are different conditions. The multiplier budget alone does not establish overall implementation feasibility.';
const states=[
 {name:'The design-process problem',note:'In practice, this process often relies on manual, ad hoc steps, which can be error-prone. Carrying it out raises two challenges: automating the design steps and establishing their correctness.\n\nPresenter guidance: The retained trace connects the statement to the receiver example. Introduce these as challenges; the support requirements follow in Steps 4 and 5.'},
 {name:'Automation',note:'In the receiver example, we transformed a parallel filter into an architecture with shared arithmetic. We would like to express such a step as a reusable operation that a tool can apply to different models. Together with executable models, these operations provide a basis for design automation.\n\nPresenter guidance: Point to the transformation arrow when referring to resource sharing. Automation here means executing and reusing design operations; it does not imply automatically selecting an entire design flow.'},
 {name:'Correctness',note:'Being able to execute a design step is only part of the problem. A specification admits a set of acceptable models, represented here by this region. We need to establish that our chosen model satisfies the specification, and that subsequent transformations preserve the required properties. Refinement must also account for the implementation constraints.\n\nPresenter guidance: Point first to the specification point, then to the cone’s modelling region. Refer back to the multiplier-budget ellipse on the preceding page as the earlier example of an implementation constraint. The geometric placement illustrates the intended relationships; establishing them is precisely the challenge being motivated.'},
 {name:'Practical support',note:'To support automation, we need models that we can execute and design steps that we can apply and reuse.'},
 {name:'Formal support',note:'To support correctness, we need precise meanings for those models and a formal account of what each design step establishes or preserves.\n\nPresenter guidance: Formal support concerns both models and design steps. It includes reasoning about construction and property preservation throughout the process.\n\nTransition to page 5, Connecting Formal Reasoning and Executable Design:\nBoth forms of support must apply to the same models and design steps. We therefore need to connect executable design operations with formal reasoning about them.'}
].map(state=>({...state,note:state.note+references}));
let step=0,busy=false;
const height=node=>parseFloat(getComputedStyle(node).height);
async function go(target,animate=true){
 if(busy)return;
 target=Math.max(0,Math.min(states.length-1,Math.round(target)));
 const fade=animate&&target!==step&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 step=target;busy=true;
 layoutSupport(fade);
 for(const item of items){
  const visible=target>=Number(item.dataset.requirementsReveal);
  const wasVisible=item.getAttribute('aria-hidden')==='false';
  item.style.transition=fade?(visible&&item.dataset.requirementsReveal==='3'?'opacity 150ms ease 100ms':'opacity 250ms ease'):'none';
  item.style.visibility=visible||(fade&&wasVisible)?'visible':'hidden';
  item.style.opacity=visible?'1':'0';
  item.setAttribute('aria-hidden',String(!visible));
 }
 if(fade)await new Promise(resolve=>setTimeout(resolve,250));
 for(const item of items)if(item.getAttribute('aria-hidden')==='true')item.style.visibility='hidden';
 busy=false;
}
function layoutSupport(animate=false){
 support.style.transition=animate?'height 250ms ease':'none';
 automation.style.transition=animate?'margin-bottom 250ms ease':'none';
 support.style.height=step>=3?height(support.firstElementChild)+'px':'0px';
 automation.style.marginBottom=step>=3?'36px':'18px';
}
function positionText(){
 const text=root.querySelector('.requirements-text'),list=root.querySelector('.requirements-challenges');
 const correctness=list.children[1],formal=correctness.querySelector('.requirements-support');
 // Measure the complete composition in local CSS units, independently of the
 // current reveal, the animated gap, and the stage's viewport scale.
 const fullHeight=height(text.querySelector('p'))+parseFloat(getComputedStyle(list).marginTop)
  +height(automation.querySelector('div'))+height(support.firstElementChild)+36
  +height(correctness.querySelector('div'))+parseFloat(getComputedStyle(formal).marginTop)+height(formal.firstElementChild);
 text.style.top=(900-fullHeight)/2+'px';
}
function positionCaption(){
 const rim=root.querySelector('#specification-cone-rim-1'),leader=root.querySelector('#specification-leader');
 const point=rim.getPointAtLength(0);
 const tip=point.matrixTransform(leader.getScreenCTM().inverse().multiply(rim.getScreenCTM()));
 const caption=root.querySelector('.specification-caption').getBoundingClientRect();
 const start=new DOMPoint(caption.left+caption.width/2,caption.bottom).matrixTransform(leader.getScreenCTM().inverse());
 leader.setAttribute('d',`M${start.x} ${start.y+8} L${tip.x-6} ${tip.y}`);
}
go(0,false);
const resize=()=>{layoutSupport();positionText();positionCaption()};
resize();
document.fonts.ready.then(resize);
return {go,next:()=>go(step+1),previous:()=>go(step-1),states,getState:()=>({step,busy,count:states.length}),resize};
};
