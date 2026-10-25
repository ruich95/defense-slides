window.slideFactories.page1=()=>{
const root=document.getElementById('page1'),items=[...root.querySelectorAll('[data-es-reveal]')];
const sources='\n\nBackground references:\nIngo Sander, System Modeling and Design Refinement in ForSyDe (2003), §1.1.1, pp. 1–2: https://people.kth.se/~ingo/Papers/Thesis_Sander_2003.pdf\nIngo Sander, Platform-Based Design of Heterogeneous Embedded Systems, RTiS 2009, slides 3–4: https://people.kth.se/~ingo/presentations/handouts_RTiS2009.pdf\nArm, Cortex-A Series Programmer’s Guide, Embedded systems: https://support.arm.com/documentation/den0013/d/Introduction/Embedded-systems\nEdward A. Lee, Embedded Software (2001), especially Reactivity: https://ptolemy.eecs.berkeley.edu/publications/papers/01/embsoft/embsoft.pdf\nArm, Cloud-based Embedded Development to Supercharge IoT, Software updates for deployed systems: https://newsroom.arm.com/blog/cloud-based-embedded-development\nThese are common introductory characteristics, with application-dependent qualifications. Stability of the intended role is a typical design intention, not a necessary property; functionality can evolve through updates.\n\nIllustrations: AI-generated with the built-in image-generation tool, iteratively edited and approved by Rui Chen, 24 October 2026. Source drafts and prompts: figures/embedded-systems-drafts/v6/README.md.';
const states=[
 {name:'Embedded systems are everywhere',note:'My subject is embedded-system design. Let us begin with embedded systems themselves. They are everywhere.'},
 {name:'Braking controller',note:'For example, controlling the brakes in a car.'},
 {name:'Robot controller',note:'Coordinating an industrial robot.'},
 {name:'Aircraft attitude control',note:'Or controlling the attitude of an aircraft.'},
 {name:'What characterises these systems?',note:'What characterises these systems?'},
 {name:'Computational systems',note:'They are computational systems, but not merely small computers. Their role within the application shapes how they are designed.'},
 {name:'Specialised functionality',note:'They are designed for specialised functionality within a larger system. A braking controller, for example, has a specific role within the car. That intended role typically remains stable throughout its life cycle, even as its software is updated or its functionality evolves.'},
 {name:'Reactive behaviour',note:'They are often reactive, continually responding to inputs and events from their environment.'},
 {name:'Requirements beyond functionality',note:'They must also satisfy requirements beyond functionality: responding within a required time, for example, or operating within limited memory, energy, or hardware resources.\n\nTransition:\nDesigning these systems therefore means obtaining an implementation that provides the required functionality while meeting these constraints. Let us look at how that design process proceeds.'}
].map(state=>({...state,note:state.note+sources}));
let step=0,busy=false;
async function go(target,animate=true){
 if(busy)return;
 target=Math.max(0,Math.min(states.length-1,Math.round(target)));
 const changed=target!==step,reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 step=target;busy=true;
 for(const item of items){
  const visible=target>=Number(item.dataset.esReveal);
  item.style.transition=animate&&!reduced?'opacity 200ms ease':'none';
  item.style.opacity=visible?'1':'0';
  item.style.visibility=visible?'visible':'hidden';
  item.setAttribute('aria-hidden',String(!visible));
 }
 if(changed&&animate&&!reduced)await new Promise(resolve=>setTimeout(resolve,200));
 busy=false;
}
go(0,false);
return {go,next:()=>go(step+1),previous:()=>go(step-1),states,getState:()=>({step,busy,count:states.length})};
};
