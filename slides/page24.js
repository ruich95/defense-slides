window.slideFactories.page24=()=>{
 const data=@@PAGE24_DATA@@,root=document.getElementById('page24'),nodes=new Map(data.shapes.map(s=>[s.id,root.querySelector('#p24-shape-'+s.id)]));
 const names=['Choose a representation and operations','Map atomic components to primitives','Map bindings to connections or operations','Execution evidence'];
 const states=names.map((name,i)=>({name,note:data.notes[i]+'\n\nSource: AEiC slide23; original cropped image82.svg, image83.png and image84.png. Thesis Figure1.6(c–d), pp27–28, and section4.3.3. Paragraph-level reveals of text box42 are preserved. Source map: assets/page24/effect-map.json. The trace is reused execution evidence, not a new simulation or the formal proof.'}));
 let step=0;
 function render(target=step){
  const visible=new Map(data.shapes.map(s=>[s.id,s.visible]));
  const cues=data.shapes.filter(s=>s.role==='emphasis'||s.role==='focus-code');
  for(let i=0;i<target;i++){
   for(const s of cues)visible.set(s.id,false);
   for(const e of data.groups[i].events){if(e.paragraph){for(let p=e.paragraph[0];p<=e.paragraph[1];p++)visible.set(e.id+'-p'+p,e.kind==='entr')}else visible.set(e.id,e.kind==='entr')}
  }
  for(const s of data.shapes){const n=nodes.get(s.id),v=visible.get(s.id);n.style.opacity=v?1:0;n.style.visibility=v?'visible':'hidden';n.setAttribute('aria-hidden',String(!v))}
 }
 function cancel(){}
 async function go(target=0){step=Math.max(0,Math.min(3,Math.round(target)));render()}
 async function enter(){step=0;render()}
 render();const api={go,enter,cancel,leave:cancel,states,getState:()=>({step,busy:false,count:4})};root.page24Controller=api;return api;
};
