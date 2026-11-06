window.slideFactories.future_work=()=>{
 const root=document.getElementById('future_work'),quotation=root.querySelector('.future-work-quotation');
 const source='\n\nSource: final/AEiC-26.pptx, slide31, and thesis Chapter6. The future-work bullets and Turner quotation are moved unchanged from the former combined conclusion page. The quotation is attributed to D. A. Turner (2004), Total Functional Programming; it is a closing perspective, not an established claim about SynQ automation.';
 const states=[
  {name:'Future-work priorities',note:'The next challenge is to move further up the abstraction hierarchy and make more of the design and proof process automatic.\n\nExtend support to higher abstraction levels. Develop domain-specific specification together with design automation and proof automation. These are future directions, not capabilities already demonstrated for all levels.'},
  {name:'A hierarchy of languages',note:'We can have a hierarchy of languages, of ascending power, each of which can express the interpreters of those below it.\n\nD. A. Turner (2004), Total Functional Programming.\n\nUse this as a closing perspective on the language/framework relation. It does not establish that SynQ already automates all higher-level design. The quotation and attribution appear together, with no extra bullet click or page-entry Morph.'}
 ].map(s=>({...s,note:s.note+source}));
 let step=0;
 function render(){const show=step===1;quotation.style.opacity=show?'1':'0';quotation.style.visibility=show?'visible':'hidden';quotation.setAttribute('aria-hidden',String(!show));root.dataset.state=String(step+1);}
 function go(target){step=Math.max(0,Math.min(states.length-1,Math.round(target)));render();return Promise.resolve();}
 function cancel(){}
 render();return{go,cancel,leave:cancel,states,getState:()=>({step,busy:false,count:2})};
};
