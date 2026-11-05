window.slideFactories.page23=()=>{
 const data=@@PAGE23_DATA@@,root=document.getElementById('page23'),nodes=new Map(data.shapes.map(s=>[s.id,root.querySelector('#p23-shape-'+s.id)]));
 const names=['A rising-pair requirement','Arbitrary initial state','Arbitrary prefix and final inputs','Evidence of the rising premise','Output prefix and evidence','The software interpretation','The complete input sequence','Output ending in one'];
 const states=names.map((name,i)=>({name,note:data.notes[i]+'\n\nSource: AEiC slide22; original image79.svg, image80.png and image81.svg. Thesis Eq1.13–1.14 and Figure1.6(a), pp26–28. The displayed type encodes one implication, not the non-rising case or generated-hardware correctness. Source mapping: assets/page23/effect-map.json. Each click replaces the previous correspondence emphasis, matching displayed P19.'}));
 let step=0;
 function render(target=step){
  const visible=new Map(data.shapes.map(s=>[s.id,s.visible]));
  const cues=data.shapes.filter(s=>s.role.startsWith('focus-')||s.role==='guide');
  for(let i=0;i<target;i++){
   for(const s of cues)visible.set(s.id,false);
   for(const e of data.groups[i].events)visible.set(e.id,e.kind==='entr');
  }
  for(const s of data.shapes){const n=nodes.get(s.id),v=visible.get(s.id);n.style.opacity=v?1:0;n.style.visibility=v?'visible':'hidden';n.setAttribute('aria-hidden',String(!v))}
 }
 function cancel(){}
 async function go(target=0){step=Math.max(0,Math.min(7,Math.round(target)));render()}
 async function enter(){step=0;render()}
 render();const api={go,enter,cancel,leave:cancel,states,getState:()=>({step,busy:false,count:8})};root.page23Controller=api;return api;
};
