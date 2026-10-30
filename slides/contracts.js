window.slideFactories.contracts = () => {
 const root=document.getElementById('contracts'),items=[...root.querySelectorAll('.c3-item')];
 const states=[
  {
    "name": "Interface without behaviour",
    "note": "The type discipline restricts how we use components and their state. But it does not yet say that a register actually stores the value we give it. Here is a setter with the expected interface.\n\nSource: thesis §3.3.4, printed pp.77–79 (PDF pages101–103). Shallow approach before SynQ. The spec field is a record-field excerpt, with no additional multiplicity. Its equality concerns the full component result including state. This law specifies an aspect of behaviour, not a complete register specification. regBad does not satisfy the law generally, rather than failing for every individual execution. The left memory sentence informally describes writeElim1. The ACSL example on the right concerns the different readElim law, which preserves state. believe_me is an Idris2 assumption, not verification of foreign code. Do not claim every C memory contract was verified. Full records and FFI details: backup B3–B4."
  },
  {
    "name": "Unchanged state",
    "note": "It returns the old state unchanged. It can satisfy the original interface while failing the behaviour we intended.\n\nSource: thesis §3.3.4, printed pp.77–79 (PDF pages101–103). Shallow approach before SynQ. The spec field is a record-field excerpt, with no additional multiplicity. Its equality concerns the full component result including state. This law specifies an aspect of behaviour, not a complete register specification. regBad does not satisfy the law generally, rather than failing for every individual execution. The left memory sentence informally describes writeElim1. The ACSL example on the right concerns the different readElim law, which preserves state. believe_me is an Idris2 assumption, not verification of foreign code. Do not claim every C memory contract was verified. Full records and FFI details: backup B3–B4."
  },
  {
    "name": "A behavioural contract",
    "note": "Dependent types let us add a law to the interface. For any input and state, setting and then getting must agree with getting from the updated state. An implementation of the refined record must supply evidence for this equality. This law specifies an aspect of behaviour; it is not a complete register specification.\n\nSource: thesis §3.3.4, printed pp.77–79 (PDF pages101–103). Shallow approach before SynQ. The spec field is a record-field excerpt, with no additional multiplicity. Its equality concerns the full component result including state. This law specifies an aspect of behaviour, not a complete register specification. regBad does not satisfy the law generally, rather than failing for every individual execution. The left memory sentence informally describes writeElim1. The ACSL example on the right concerns the different readElim law, which preserves state. believe_me is an Idris2 assumption, not verification of foreign code. Do not claim every C memory contract was verified. Full records and FFI details: backup B3–B4."
  },
  {
    "name": "Reasoning about memory",
    "note": "The same idea applies to a memory whose internals are hidden. Its operations come with laws, such as reading back the value written to an address. These laws allow reasoning without opening the implementation.\n\nSource: thesis §3.3.4, printed pp.77–79 (PDF pages101–103). Shallow approach before SynQ. The spec field is a record-field excerpt, with no additional multiplicity. Its equality concerns the full component result including state. This law specifies an aspect of behaviour, not a complete register specification. regBad does not satisfy the law generally, rather than failing for every individual execution. The left memory sentence informally describes writeElim1. The ACSL example on the right concerns the different readElim law, which preserves state. believe_me is an Idris2 assumption, not verification of foreign code. Do not claim every C memory contract was verified. Full records and FFI details: backup B3–B4."
  },
  {
    "name": "Evidence for foreign code",
    "note": "For foreign code, a law assumed in Idris2 is not automatically a proof of that implementation. The thesis demonstrates verifying a C memory-read law—reading preserves state—using ACSL. The contract then provides an interface for system-level reasoning.\n\nTransition: Let us see how one of these component laws supports reasoning about a processor model.\n\nSource: thesis §3.3.4, printed pp.77–79 (PDF pages101–103). Shallow approach before SynQ. The spec field is a record-field excerpt, with no additional multiplicity. Its equality concerns the full component result including state. This law specifies an aspect of behaviour, not a complete register specification. regBad does not satisfy the law generally, rather than failing for every individual execution. The left memory sentence informally describes writeElim1. The ACSL example on the right concerns the different readElim law, which preserves state. believe_me is an Idris2 assumption, not verification of foreign code. Do not claim every C memory contract was verified. Full records and FFI details: backup B3–B4."
  }
];
 let step=0;
 function render(){
  for(const node of items){const visible=step>=Number(node.dataset.first)&&step<=Number(node.dataset.last);node.style.opacity=visible?'1':'0';node.style.visibility=visible?'visible':'hidden';node.setAttribute('aria-hidden',String(!visible));}
  root.classList.toggle('contracts-returned',step>=1&&step<=2);
  root.dataset.state=String(step+1);
 }
 function go(target){step=Math.max(0,Math.min(states.length-1,Math.round(target)));render();return Promise.resolve();}
 function cancel(){} // Immediate reveals have no running frames or timers.
 render();
 const api={go,cancel,leave:cancel,states,getState:()=>({step,busy:false,count:states.length})};
 root.contractsController=api;return api;
};
