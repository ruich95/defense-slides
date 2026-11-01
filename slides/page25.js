window.slideFactories.page25=()=>{
 const root=document.getElementById('page25');
 const states=[{name:'Induction on the arbitrary input prefix',note:`O2 callback: induction supplies verification evidence for this stated property, within the conditions below. This is the same property as before: if the last pair rises, the output ends in one. The proof proceeds by induction on the arbitrary prefix xs, not on the scalar samples or an infinite stream.

Base clause: When the prefix is empty, the two final inputs are x and y. The supplied comparison evidence rewrites the last result to one; the preceding output forms the witness. Point to the first clause without a new animation.

Inductive clause: For a non-empty prefix, process its head, update the initial state for the remaining sequence, and use the induction hypothesis. Prepend the first output to the witness and rewrite with the equality already obtained. Point to the recursive call and the returned pair.

The function supplies an output prefix together with equality evidence. Type checking checks this proof against the stated type. Explain Refl as equality by reduction if necessary. The source/thesis supplies this proof; this slide-building task has not run Idris2 to recheck it.

Scope: the displayed rising-pair implication concerns the Idris2/software interpretation under its comparison premise. This does not establish the non-rising case, the full behavioural equation, generated hardware equivalence, backend correctness or timing. Do not generalise this proof to every compiler or synthesis step.

Transition: The same framework also lets us define transformations of these models. Retain room later for the FM example and transformation contribution; the small detector is not the entire experimental evaluation.

Source: final/AEiC-26.pptx, slide24, original image79.svg and image85.png. Thesis Figure1.6(a), Eq1.14 and the two proof clauses on printed p27; the fuller behaviour is Eq1.13. Both clauses and every token are reused unchanged. There is one settled state, no entrance effect and no internal clicks.`}];
 function cancel(){}
 async function go(){}
 async function enter(){}
 const api={go,enter,cancel,leave:cancel,states,getState:()=>({step:0,busy:false,count:1})};root.page25Controller=api;return api;
};
