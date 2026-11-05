window.slideFactories.page22=()=>{
 const data=@@PAGE22_DATA@@,root=document.getElementById('page22'),nodes=new Map(data.shapes.map(s=>[s.id,root.querySelector('#p22-shape-'+s.id)]));
 const names=['The same detector in SynQ','Complete model and type roles','Available component interfaces','Exactly one register resource','Unpack get and set','Bind input xin','Read previous value pre','Supply the next value','Compare pre and xin','Connect the system output'];
 const states=names.map((name,i)=>({name,note:data.notes[i]+(i===9?'\n\nO3 callback at P23.10: variables make the completed detector connections readable; this is modelling evidence, not its behavioural proof.':'')+'\n\nSource: AEiC slide21; original image71.svg and image72–78.png. Thesis Figure1.6(b), pp26–27, and sections4.3.1–4.3.2. Adaptation: full code remains visible, earlier callout text remains while only the current code emphasis and guide are active, and only the most recent transparent diagram frame is painted. The structural signature is not a proof of rising detection. Detailed source map: assets/page22/effect-map.json.'}));
 let step=0;
 function render(target=step){const tag=root.querySelector(".objective-tag"),on=target===9;tag.style.opacity=on?1:0;tag.style.visibility=on?"visible":"hidden";tag.setAttribute("aria-hidden",String(!on));
  const visible=new Map(data.shapes.map(s=>[s.id,s.visible]));
  // As on displayed P19, explanations remain but emphasis follows the current step.
  const cues=data.shapes.filter(s=>s.role==='focus'||s.role==='guide');
  for(let i=0;i<target;i++){
   for(const s of cues)visible.set(s.id,false);
   for(const e of data.groups[i].events)visible.set(e.id,e.kind==='entr');
  }
  const currentFrame=[...data.frames].reverse().find(id=>visible.get(id));
  for(const s of data.shapes){const n=nodes.get(s.id),logical=visible.get(s.id),paint=logical&&(s.role!=='frame'||s.id===currentFrame);n.style.opacity=paint?1:0;n.style.visibility=paint?'visible':'hidden';n.dataset.logicalVisible=String(logical);n.setAttribute('aria-hidden',String(!paint))}
 }
 function cancel(){}
 async function go(target=0){step=Math.max(0,Math.min(9,Math.round(target)));render()}
 async function enter(){step=0;render()}
 render();const api={go,enter,cancel,leave:cancel,states,getState:()=>({step,busy:false,count:10})};root.page22Controller=api;return api;
};
