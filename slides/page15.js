window.slideFactories.page15=()=>{
 const data=@@PAGE15_DATA@@,root=document.getElementById('page15'),body=root.querySelector('.page15-body'),ns='http://www.w3.org/2000/svg',nodes=new Map(data.shapes.map(s=>[s.id,root.querySelector('#p15-shape-'+s.id)]));
 const states=[{name:'Networks and composite components',note:data.notes[0]+'\n\nSource: AEiC-26.pptx slide 10. A 750 ms internal object Morph from the composition scene. Source mapping: assets/page15/morph-map.json.'}];
 let generation=0,busy=false,raf=0,resolveMotion=null;
 const overlay=document.createElement('div');overlay.className='page15-morph';overlay.hidden=true;root.append(overlay);
 const clamp=t=>Math.max(0,Math.min(1,t)),box=s=>({x:s.left,y:s.top,width:s.width*s.scale,height:s.height*s.scale});
 const mix=(a,b,t)=>a+(b-a)*t;
 function color(a,b,t){if(a==='none'||b==='none')return t<.5?a:b;const rgb=c=>{if(c[0]==='#'){if(c.length===4)c='#'+[...c.slice(1)].map(v=>v+v).join('');return [1,3,5].map(i=>parseInt(c.slice(i,i+2),16))}return c.match(/[\d.]+/g).slice(0,3).map(Number)};const x=rgb(a),y=rgb(b);return 'rgb('+x.map((v,i)=>Math.round(mix(v,y[i],t))).join(',')+')'}
 // Float64 samples and contour alignment are authored once, never measured on entry.
 @@MORPH_DECODER@@
 const geometry = decodeMorphGeometry(@@MORPH_GEOMETRY@@);
 const records=[];
 for(const m of data.morph.matches){
  const dest=data.shapes.find(s=>s.id===m.targetId),node=document.createElement('div');node.className='page15-morph-object';node.dataset.sourceId=m.sourceId;node.dataset.targetId=m.targetId??'';
  let vectors=null;const source=m.source;
  if(m.vectorMorph){
   const svg=document.createElementNS(ns,'svg');node.append(svg);vectors=geometry[m.sourceId];
   if(!vectors)throw new Error('Missing precomputed page15 Morph geometry for '+m.sourceId);
   for(const v of vectors){v.node=document.createElementNS(ns,'path');v.node.setAttribute('stroke-linejoin','round');v.node.setAttribute('stroke-linecap','square');svg.append(v.node)}
   node._svg=svg;
  }else if(source.uri){const img=document.createElement('img');img.src=source.uri;img.alt='';node.append(img)}else{node.innerHTML=source.html;node.classList.add('page15-explanation');if(source.role==='label')node.classList.add('page15-label')}
  overlay.append(node);records.push({m,dest,node,vectors});
 }
 const matched=new Set(records.map(r=>r.dest?.id));
 const passThrough=records.find(r=>r.dest?.name==='!!RunF2');
 for(const s of data.shapes)if(s.visible&&!matched.has(s.id)){const node=nodes.get(s.id).cloneNode(true);node.removeAttribute('id');node.classList.remove('page15-item');node.classList.add('page15-morph-object');overlay.append(node);records.push({m:null,dest:s,node,vectors:null,anchor:[399,401,419,420].includes(s.id)?passThrough:null})}
 const order=new Map(data.shapes.map((s,i)=>[s.id,i]));for(const r of [...records].sort((a,b)=>(a.dest?order.get(a.dest.id):-1)-(b.dest?order.get(b.dest.id):-1)))overlay.append(r.node);
 function layout(node,b){node.style.left=b.x+'px';node.style.top=b.y+'px';node.style.width=b.width+'px';node.style.height=b.height+'px'}
 function morph(t){
  body.style.opacity='0';overlay.hidden=false;const q=t*t*(3-2*t);
  for(const {m,dest,node,vectors,anchor} of records){node.style.visibility='visible';
   if(m&&dest){const a=m.box,b=box(dest),v={};for(const k of ['x','y','width','height'])v[k]=mix(a[k],b[k],q);layout(node,v);node.style.opacity=1;
    if(vectors){const destBox=b;node._svg.setAttribute('viewBox',`0 0 ${v.width} ${v.height}`);for(const p of vectors){const a=p.a||p.b,b=p.b||p.a;p.node.style.opacity=p.a&&p.b?1:p.a?1-q:q;p.node.setAttribute('fill',color(a.fill,b.fill,q));p.node.setAttribute('stroke',color(a.stroke,b.stroke,q));p.node.setAttribute('fill-opacity',mix(a.fillOpacity,b.fillOpacity,q));p.node.setAttribute('stroke-opacity',mix(a.strokeOpacity,b.strokeOpacity,q));p.node.setAttribute('stroke-width',mix(a.strokeWidth,b.strokeWidth,q));p.node.setAttribute('d',p.parts.map(part=>part.a.map((a,i)=>(i?'L':'M')+(mix(m.box.x+a[0]*m.box.width,destBox.x+part.b[i][0]*destBox.width,q)-v.x)+','+(mix(m.box.y+a[1]*m.box.height,destBox.y+part.b[i][1]*destBox.height,q)-v.y)).join(' ')+(part.closed?' Z':'')).join(' '))}}
   }else if(m){layout(node,m.box);node.style.opacity=1-q}else{let b=box(dest);if(anchor){const a=anchor.m.box,z=box(anchor.dest),start={x:a.x+(b.x-z.x)*a.width/z.width,y:a.y+(b.y-z.y)*a.height/z.height,width:b.width*a.width/z.width,height:b.height*a.height/z.height};for(const k of ['x','y','width','height'])b[k]=mix(start[k],b[k],q)}layout(node,b);node.style.opacity=q}
  }
 }
 function render(){overlay.hidden=true;body.style.opacity='';for(const s of data.shapes){const n=nodes.get(s.id);n.style.opacity=s.visible?1:0;n.style.visibility=s.visible?'visible':'hidden';n.setAttribute('aria-hidden',String(!s.visible))}}
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done()}busy=false;overlay.hidden=true;body.style.opacity=''}
 async function go(){cancel();render()}
 async function enter(context={}){cancel();render();if(context.reason!=='forward'||context.previousId!=='page14'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;busy=true;const token=++generation;morph(0);
  await new Promise(resolve=>{resolveMotion=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const t=clamp((now-start)/data.morph.duration);morph(t);if(t<1)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve()}}raf=requestAnimationFrame(tick)});if(token===generation){render();busy=false}}
 function previewEntrance(ms){cancel();render();morph(clamp(ms/data.morph.duration))}
 render();const api={go,enter,cancel,leave:cancel,states,previewEntrance,getState:()=>({step:0,busy,count:1})};root.page15Controller=api;return api;
};
