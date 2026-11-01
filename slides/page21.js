window.slideFactories.page21=()=>{
 const data=@@PAGE21_DATA@@,root=document.getElementById('page21'),body=root.querySelector('.page21-body'),objective=root.querySelector('.objective-tag');
 const clamp=x=>Math.max(0,Math.min(1,x)),mix=(a,b,t)=>a+(b-a)*t,box=s=>({x:s.left,y:s.top,width:s.width*s.scale,height:s.height*s.scale});
 const nodes=Object.fromEntries(Object.entries(data.scenes).map(([name,scene])=>[name,new Map(scene.shapes.map(s=>[s.id,root.querySelector('#p21-'+name+'-'+s.id)]))]));
 const names=['One model, different interpretations','Abstract the representation','State, input and output indices','Supplied composition','Resulting component','Model construction','Choose an interpretation','Executable Idris2 interpretation','IR and other representations','Type-encoded properties','Verilog HDL generation','LLVM IR generation'];
 const states=names.map((name,i)=>({name,note:data.notes[i]+(i>=8?'\n\nO2 callback: models are Idris2 terms, and interpretations and design steps are Idris2 functions. This enables specification and verification within Idris2; it does not establish blanket semantic equivalence between interpretations or verify every backend. Source: thesis §1.2.4, printed pp. 23–24, and §4.3.3, printed pp. 114–117.':'')+'\n\nSource: AEiC slides19–20; thesis sections4.2.1–4.2.3 and4.3.1–4.3.3. The abstract seq fragment is pedagogical, with foo/bar supplied in context, and is not a new standalone checked definition. Source timing: assets/page21/effect-map.json.'}));
 let step=0,busy=false,generation=0,raf=0,resolveMotion=null;
 const overlay=document.createElement('div');overlay.className='page21-morph';overlay.hidden=true;root.append(overlay);
 const records=[];
 for(const m of data.internal.matches){
  const node=document.createElement('div');node.className='page21-morph-object';node.dataset.sourceId=m.sourceId;node.dataset.targetId=m.targetId??'';
  if(m.source.uri){const image=document.createElement('img');image.src=m.source.uri;image.alt='';node.append(image)}else{node.innerHTML=m.source.html;node.classList.add('page21-explanation')}
  const dest=data.scenes.routes.shapes.find(s=>s.id===m.targetId);overlay.append(node);records.push({m,dest,node});
 }
 const matched=new Set(records.map(r=>r.dest?.id));
 for(const s of data.scenes.routes.shapes)if(s.visible&&!matched.has(s.id)){const node=nodes.routes.get(s.id).cloneNode(true);node.removeAttribute('id');node.classList.remove('page21-item');node.classList.add('page21-morph-object');overlay.append(node);records.push({m:null,dest:s,node})}
 function layout(n,b){n.style.left=b.x+'px';n.style.top=b.y+'px';n.style.width=b.width+'px';n.style.height=b.height+'px'}
 function drawMorph(t){objective.style.opacity='0';objective.style.visibility='hidden';objective.setAttribute('aria-hidden','true');body.style.opacity='0';overlay.hidden=false;const q=t*t*(3-2*t);for(const {m,dest,node} of records){node.style.visibility='visible';if(m&&dest){const a=m.box,b=box(dest),v={};for(const k of ['x','y','width','height'])v[k]=mix(a[k],b[k],q);layout(node,v);node.style.opacity=1}else if(m){layout(node,m.box);node.style.opacity=clamp(1-t/.55)}else{layout(node,box(dest));node.style.opacity=clamp((t-.5)/.5)}}}
 function filterClip(filter,t){
  const p=(1-t)*100;
  if(filter==='wipe(down)')return `inset(0 0 ${p}% 0)`;
  if(filter==='wipe(left)')return `inset(0 0 0 ${p}%)`;
  if(filter==='wipe(right)')return `inset(0 ${p}% 0 0)`;
  if(filter==='barn(outVertical)')return `inset(0 ${p/2}% 0 ${p/2}%)`;
  return 'none';
 }
 function render(target=step,elapsed=Infinity){const showObjective=target>=8;objective.style.opacity=showObjective?'1':'0';objective.style.visibility=showObjective?'visible':'hidden';objective.setAttribute('aria-hidden',String(!showObjective));overlay.hidden=true;body.style.opacity='';const active=target<=5?'abstract':'routes';
  for(const [name,scene] of Object.entries(data.scenes)){
   root.querySelector('[data-page21-scene="'+name+'"]').style.display=name===active?'block':'none';
   const values=new Map(scene.shapes.map(s=>[s.id,{alpha:s.visible?1:0,clip:'none'}]));const count=name==='abstract'?Math.min(5,target):Math.max(0,target-6);
   for(let i=0;i<count;i++){const time=name===active&&i===count-1?elapsed:Infinity;for(const e of scene.groups[i].events){if(time<e.start)continue;const v=values.get(e.id),t=clamp((time-e.start)/e.duration);if(e.kind==='exit'){v.alpha=0;v.clip='none'}else{v.alpha=e.duration<=1?1:e.filter==='fade'?t:1;v.clip=filterClip(e.filter,t)}}}
   for(const [id,v] of values){const n=nodes[name].get(id);n.style.opacity=v.alpha;n.style.visibility=v.alpha>0?'visible':'hidden';n.style.clipPath=v.clip;n.setAttribute('aria-hidden',String(v.alpha===0))}
  }
 }
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done()}busy=false;overlay.hidden=true;body.style.opacity=''}
 async function animate(duration,draw){const token=++generation;busy=true;draw(0);await new Promise(resolve=>{resolveMotion=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const ms=Math.min(duration,now-start);draw(ms);if(ms<duration)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve()}}raf=requestAnimationFrame(tick)});if(token===generation){render();busy=false}}
 async function go(target=0,play=true){cancel();const from=step;step=Math.max(0,Math.min(names.length-1,Math.round(target)));const motion=play&&step===from+1&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(motion&&step===6){render(5);await animate(500,ms=>drawMorph(ms/500))}
  else if(motion&&step>=7){const group=data.scenes.routes.groups[step-7];await animate(group.duration,ms=>render(step,ms))}
  else render();
 }
 async function enter(){cancel();step=0;render()}
 function previewInternal(ms){cancel();step=6;render(5);drawMorph(clamp(ms/500))}
 function previewReveal(group,ms){cancel();step=6+group;render(step,ms)}
 render();const api={go,enter,cancel,leave:cancel,states,previewInternal,previewReveal,getState:()=>({step,busy,count:names.length,timings:data.scenes.routes.groups.map(g=>g.duration)})};root.page21Controller=api;return api;
};
