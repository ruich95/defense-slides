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
 // Keep the native image at every held endpoint. During a loop reveal, clip
 // its original shaft and head separately so the head enters only after the turn.
 const loopDraws=new Map();
 for(const [id,cx,cy,aspect,start,sweep,headTop,headBottom] of [
  [25,56.25,62.5,32/36,-50,260,29.16,57.28],
  [144,50,50,1,-51,273,18.34,36.45]
 ]){
  const node=nodes.routes.get(id),image=node.querySelector('img');
  function part(kind){
   const svg=new DOMParser().parseFromString(atob(image.src.split(',')[1]),'image/svg+xml').documentElement;
   if(id===25){const path=svg.querySelector('path'),parts=path.getAttribute('d').split(/(?=[Mm])/).filter(Boolean);path.setAttribute('d',parts[kind==='shaft'?0:1])}
   else svg.querySelector(kind==='shaft'?'polygon':'path').remove();
   const prefix='p22-loop-'+id+'-'+kind+'-',ids=new Map([...svg.querySelectorAll('[id]')].map(n=>[n.id,prefix+n.id]));
   for(const n of [svg,...svg.querySelectorAll('*')])for(const attr of [...n.attributes]){let value=attr.value;if(attr.name==='id')value=ids.get(value)||value;else for(const [old,key]of ids)value=value.replaceAll('url(#'+old+')','url(#'+key+')');n.setAttribute(attr.name,value)}
   svg.style.cssText='display:block;width:100%;height:100%';svg.setAttribute('aria-hidden','true');
   const holder=document.createElement('div');holder.dataset.arrowPart=kind;holder.style.cssText='position:absolute;inset:0;pointer-events:none';holder.hidden=true;holder.append(svg);node.append(holder);return holder;
  }
  loopDraws.set(id,{image,shaft:part('shaft'),head:part('head'),cx,cy,aspect,start,sweep,headTop,headBottom});
 }
 function drawLoop(id,fraction){
  const r=loopDraws.get(id);if(!r)return;
  const moving=fraction!==null&&fraction<1;r.image.style.visibility=moving?'hidden':'';r.shaft.hidden=r.head.hidden=!moving;if(!moving)return;
  const q=clamp(fraction/.88),points=[`${r.cx}% ${r.cy}%`],segments=Math.max(1,Math.ceil(q*r.sweep/8));
  for(let i=0;i<=segments;i++){const angle=(r.start+r.sweep*q*i/segments)*Math.PI/180;points.push(`${r.cx+200*Math.cos(angle)}% ${r.cy+200*r.aspect*Math.sin(angle)}%`)}
  r.shaft.style.clipPath='polygon('+points.join(',')+')';
  const head=clamp((fraction-.88)/.12);r.head.style.clipPath=head===0?'inset(100% 0 0 0)':`inset(${mix(r.headBottom,r.headTop,head)}% 0 0 0)`;
 }
 const rightwardArrows=new Set([6,17,22,129,18,214,147,218]);
 function filterClip(filter,t,id){
  if(t<1){
  if(loopDraws.has(id))return 'none';
  if(rightwardArrows.has(id))return `inset(0 ${(1-t)*100}% 0 0)`;
  if(id===23){
   if(t<=.5)return `inset(84% ${(1-t*2)*100}% 0 0)`;
   const top=84*(2-2*t);return `polygon(0 84%,77% 84%,77% ${top}%,100% ${top}%,100% 100%,0 100%)`;
  }

  }
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
   const values=new Map(scene.shapes.map(s=>[s.id,{alpha:s.visible?1:0,clip:'none',loop:null}]));const count=name==='abstract'?Math.min(5,target):Math.max(0,target-6);
   for(let i=0;i<count;i++){const time=name===active&&i===count-1?elapsed:Infinity;for(const e of scene.groups[i].events){if(time<e.start)continue;const v=values.get(e.id),t=clamp((time-e.start)/e.duration);if(e.kind==='exit'){v.alpha=0;v.clip='none'}else{v.alpha=e.duration<=1?1:e.filter==='fade'?t:1;v.clip=e.duration<=1?'none':filterClip(e.filter,t,e.id);if(loopDraws.has(e.id))v.loop=t}}}
   for(const [id,v] of values){const n=nodes[name].get(id);n.style.opacity=v.alpha;n.style.visibility=v.alpha>0?'visible':'hidden';n.style.clipPath=v.clip;if(name==='routes')drawLoop(id,v.loop);n.setAttribute('aria-hidden',String(v.alpha===0))}
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
