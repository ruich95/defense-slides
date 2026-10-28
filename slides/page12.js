window.slideFactories.page12=()=>{
 const data=@@PAGE12_DATA@@,root=document.getElementById('page12'),nodes=new Map(data.shapes.map(s=>[s.id,root.querySelector('#p12-shape-'+s.id)]));
 const names=['Single-step lifting','Initial resources and inputs','First reaction','Next reaction','Later and final reactions','Unfolding and folding'];
 const states=names.map((name,i)=>({name,note:data.notes[i]+'\n\nSource: final/AEiC-26.pptx, slide 7. Mapping: defense-html/assets/page12/effect-map.json. st is initial state, xs is the input vector, fs is the collection of linear component-use resources. n is their common finite length. This schematic conference signature retains its original Resource notation; the thesis gives the full typed construction. State is threaded along logical reactions; repeated functions do not imply physical replication.'}));
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.style.display='none';root.append(svg);
 const paths=new Map();for(const group of data.groups)for(const e of group.events)if(e.path){const shape=data.shapes.find(s=>s.id===e.id),p=document.createElementNS(svg.namespaceURI,'path');let axis=0;const d=e.path.replace(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi,n=>{const v=Number(n)*(axis++%2===0?1600:900)*shape.scale;return String(v)});p.setAttribute('d',d);svg.append(p);paths.set(e.sourceTimingId,p)}
 const clamp=x=>Math.max(0,Math.min(1,x));
 function ease(t,a,d){const v=1/(1-(a+d)/2);if(a&&t<a)return v*t*t/(2*a);if(d&&t>1-d)return 1-v*(1-t)*(1-t)/(2*d);return v*(t-a/2)}
 let step=0,busy=false,generation=0,raf=0,resolveMotion=null;
 function render(target,elapsed=Infinity){
  const values=new Map(data.shapes.map(s=>[s.id,{alpha:s.visible?1:0,x:0,y:0,clip:"none"}]));
  for(let i=0;i<target;i++){const time=i===target-1?elapsed:Infinity;for(const e of data.groups[i].events){if(time<e.start)continue;const value=values.get(e.id);if(!value)continue;const t=clamp((time-e.start)/e.duration);if(e.kind==='entr'||e.kind==='exit'){const entering=e.kind==='entr';if(e.filter&&e.filter.startsWith('wipe')){value.alpha=t<1?1:(entering?1:0);const hidden=(entering?1-t:t)*100;const side=e.filter==='wipe(up)'?2:e.filter==='wipe(right)'?3:1;const insets=[0,0,0,0];insets[side]=hidden;value.clip='inset('+insets.map(v=>v+'%').join(' ')+')'}else value.alpha=entering?(e.duration<=1?1:t):0}else{const p=paths.get(e.sourceTimingId),point=p.getPointAtLength(p.getTotalLength()*ease(t,e.accel,e.decel));value.x=point.x;value.y=point.y}}}
  for(const [id,v] of values){const n=nodes.get(id);n.style.opacity=v.alpha;n.style.clipPath=v.clip;n.style.visibility=v.alpha>0?'visible':'hidden';n.style.transform=`translate(${v.x}px,${v.y}px)`;n.setAttribute('aria-hidden',String(v.alpha===0))}
 }
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done()}busy=false}
 async function go(target,animate=true){cancel();const token=++generation,from=step;step=Math.max(0,Math.min(5,Math.round(target)));busy=true;
  if(animate&&step===from+1&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const duration=data.groups[step-1].duration;render(step,0);await new Promise(resolve=>{resolveMotion=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const ms=Math.min(duration,now-start);render(step,ms);if(ms<duration)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve()}}raf=requestAnimationFrame(tick)})}
  if(token===generation){render(step);busy=false}
 }
 function preview(group,ms){cancel();step=group;render(group,ms)}
 render(0);const api={go,cancel,leave:cancel,states,preview,getState:()=>({step,busy,count:6})};root.page12Controller=api;return api;
};
