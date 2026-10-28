window.slideFactories.page14=()=>{
 const data=@@PAGE14_DATA@@,root=document.getElementById('page14'),body=root.querySelector('.page14-body'),nodes=new Map(data.shapes.map(s=>[s.id,root.querySelector('#p14-shape-'+s.id)]));
 const states=[{name:'Three forms of synchronous composition',note:data.notes[0]+'\n\nSource: AEiC-26.pptx slide 9. Half-second entrance from P13; no internal clicks. Native correspondence and limitations: assets/page14/morph-map.json.'}];
 const mixColor=(a,b,t)=>{const rgb=c=>{c=c||'#000000';if(c[0]==='#'){if(c.length===4)c='#'+[...c.slice(1)].map(v=>v+v).join('');return [1,3,5].map(i=>parseInt(c.slice(i,i+2),16))}return c.match(/[\d.]+/g).slice(0,3).map(Number)};const x=rgb(a),y=rgb(b);return 'rgb('+x.map((v,i)=>Math.round(v+(y[i]-v)*t)).join(',')+')'};
 let step=0,busy=false,generation=0,raf=0,resolveMotion=null;
 const overlay=document.createElement('div');overlay.className='page14-morph';overlay.hidden=true;root.append(overlay);
 const records=[],ns='http://www.w3.org/2000/svg';
 function sample(uri){
  const svg=new DOMParser().parseFromString(atob(uri.split(',')[1]),'image/svg+xml').documentElement;
  svg.style.cssText='position:absolute;opacity:0;pointer-events:none';root.append(svg);
  const width=+svg.getAttribute('width'),height=+svg.getAttribute('height'),result=[];
  for(const p of svg.querySelectorAll('path')){
   const matrix=p.getCTM();
   for(const segment of p.getAttribute('d').split(/(?=[Mm])/).filter(Boolean)){
    const probe=document.createElementNS(ns,'path');probe.setAttribute('d',segment);p.parentNode.append(probe);
    const length=probe.getTotalLength(),points=[];
    for(let k=0;k<256;k++){const q=probe.getPointAtLength(length*k/255).matrixTransform(matrix);points.push([q.x/width,q.y/height])}
    probe.remove();
    const stroke=p.getAttribute('stroke'),sw=+(p.getAttribute('stroke-width')||1);
    if(p.getAttribute('fill')==='none'&&stroke){
     const left=[],right=[];
     for(let j=0;j<points.length;j++){const a=points[Math.max(0,j-1)],b=points[Math.min(points.length-1,j+1)],dx=(b[0]-a[0])*width,dy=(b[1]-a[1])*height,len=Math.hypot(dx,dy)||1,ox=-dy/len*sw/2/width,oy=dx/len*sw/2/height;left.push([points[j][0]+ox,points[j][1]+oy]);right.push([points[j][0]-ox,points[j][1]-oy])}
     const poly=left.concat(right.reverse());poly.push(poly[0]);const distances=[0];for(let j=1;j<poly.length;j++)distances.push(distances[j-1]+Math.hypot(poly[j][0]-poly[j-1][0],poly[j][1]-poly[j-1][1]));
     const outline=[];let j=1;for(let k=0;k<256;k++){const dist=distances.at(-1)*k/255;while(j<distances.length-1&&distances[j]<dist)j++;const q=(dist-distances[j-1])/(distances[j]-distances[j-1]||1);outline.push(poly[j-1].map((v,i)=>v+(poly[j][i]-v)*q))}
     result.push({points:outline,fill:stroke});
    }else result.push({points,fill:p.getAttribute('fill')||'#000'});
   }
  }
  svg.remove();return result;
 }
 for(const match of data.morph.matches){
  const dest=data.shapes.find(s=>s.id===match.targetId),n=document.createElement('div');n.className='page14-morph-object';n.dataset.sourceId=match.sourceId;n.dataset.targetId=match.targetId??'';
  const source=match.source;n.classList.toggle('page14-explanation',source.role==='explanation');let paths=null,paints=null;
  if(match.pathMorph){
   const from=sample(source.uri),to=sample(nodes.get(dest.id).querySelector('img').src);
   // Changed native outlines can gain an arrowhead while folding. Grow that
   // contour continuously from a point instead of fading the matched connector.
   const collapse=part=>({fill:part.fill,points:Array.from({length:256},()=>part.points[0].slice())});
   while(from.length<to.length)from.push(collapse(from.at(-1)));
   while(to.length<from.length)to.push(collapse(to.at(-1)));
   const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1 1');svg.setAttribute('preserveAspectRatio','none');
   function align(a,b){
    const count=255;let best=Infinity,offset=0,direction=1;
    for(const dir of [1,-1])for(let k=0;k<count;k++){let score=0;for(let j=0;j<count;j+=3){const q=b[(k+dir*j+count)%count];score+=(a[j][0]-q[0])**2+(a[j][1]-q[1])**2}if(score<best){best=score;offset=k;direction=dir}}
    const result=Array.from({length:count},(_,j)=>b[(offset+direction*j+count)%count]);result.push(result[0]);return result;
   }
   paths=from.map((a,i)=>{const p=document.createElementNS(ns,'path');p.setAttribute('fill',a.fill);svg.append(p);return {node:p,a:a.points,b:align(a.points,to[i].points),fromFill:a.fill,toFill:to[i].fill}});n.append(svg);
  }else if(match.processMorph){
   const svg=new DOMParser().parseFromString(atob(source.uri.split(',')[1]),'image/svg+xml').documentElement;
   svg.setAttribute('viewBox','0 0 '+svg.getAttribute('width')+' '+svg.getAttribute('height'));svg.setAttribute('preserveAspectRatio','none');
   const target=new DOMParser().parseFromString(atob(nodes.get(dest.id).querySelector('img').src.split(',')[1]),'image/svg+xml').documentElement;
   const rects=[...target.querySelectorAll('rect')];paints=[...svg.querySelectorAll('rect')].flatMap((r,i)=>['fill','stroke'].map(attr=>({node:r,attr,a:r.getAttribute(attr),b:rects[i].getAttribute(attr)})));n.append(svg);
  }else if(source.uri){const img=document.createElement('img');img.src=source.uri;img.alt='';n.append(img)}else n.innerHTML=source.html;
  overlay.append(n);records.push({match,dest,n,paths,paints});
 }
 const matched=new Set(records.map(r=>r.dest?.id));
 // Only genuinely new ellipses enter; all matched native objects move individually.
 for(const s of data.shapes)if(s.visible&&!matched.has(s.id)){
  const n=nodes.get(s.id).cloneNode(true);n.removeAttribute('id');n.classList.remove('page14-item');n.classList.add('page14-morph-object');
  if(s.id===217){
   const signature=e=>e.tagName+JSON.stringify([...e.attributes].map(a=>[a.name,a.value]).sort((a,b)=>a[0].localeCompare(b[0])));
   const signatures=new Set([174,121,153,154,158,160].flatMap(id=>[...new DOMParser().parseFromString(atob(nodes.get(id).querySelector('img').src.split(',')[1]),'image/svg+xml').querySelectorAll('path,rect')].map(signature)));
   const image=n.querySelector('img'),svg=new DOMParser().parseFromString(atob(image.src.split(',')[1]),'image/svg+xml');for(const e of svg.querySelectorAll('path,rect'))if(signatures.has(signature(e)))e.remove();image.src='data:image/svg+xml;base64,'+btoa(new XMLSerializer().serializeToString(svg));
  }
  overlay.append(n);records.push({match:null,dest:s,n,paths:null});
 }
 // Restore the source's paint order: run enclosures below process/state objects.
 const order=new Map(data.shapes.map((s,i)=>[s.id,i]));for(const r of [...records].sort((a,b)=>(a.dest?order.get(a.dest.id): -1)-(b.dest?order.get(b.dest.id): -1)))overlay.append(r.n);
 const box=s=>({x:s.left,y:s.top,width:s.width*s.scale,height:s.height*s.scale});
 function layout(n,b){n.style.left=b.x+'px';n.style.top=b.y+'px';n.style.width=b.width+'px';n.style.height=b.height+'px'}
 function renderMorph(t){
  body.style.opacity='0';overlay.hidden=false;
  const q=t*t*(3-2*t);
  for(const r of records){const {match,dest,n,paths,paints}=r;
   n.style.visibility='visible';
   if(match&&dest){const a=match.box,b=box(dest),v={};for(const key of ['x','y','width','height'])v[key]=a[key]+(b[key]-a[key])*q;layout(n,v);n.style.opacity=1;
    if(paints)for(const paint of paints)paint.node.setAttribute(paint.attr,mixColor(paint.a,paint.b,q));
    if(paths)for(const p of paths){p.node.setAttribute('fill',mixColor(p.fromFill,p.toFill,q));p.node.setAttribute('d',p.a.map((a,i)=>(i?'L':'M')+(a[0]+(p.b[i][0]-a[0])*q)+','+(a[1]+(p.b[i][1]-a[1])*q)).join(' ')+' Z')}
   }else if(match){layout(n,match.box);n.style.opacity=match.source.role!=='diagram'?Math.max(0,1-t/.4):1-q}else{layout(n,box(dest));n.style.opacity=dest.role==='diagram'?q:Math.max(0,(t-.4)/.6)}
  }
 }
 function render(target){
  overlay.hidden=true;body.style.opacity='';const visible=new Map(data.shapes.map(s=>[s.id,s.visible]));
  for(let i=0;i<target;i++)for(const e of data.groups[i].events)visible.set(e.id,e.kind==='entr');
  for(const [id,n] of nodes){const v=visible.get(id);n.style.opacity=v?1:0;n.style.visibility=v?'visible':'hidden';n.setAttribute('aria-hidden',String(!v))}
 }
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done()}busy=false;overlay.hidden=true;body.style.opacity=''}
 async function go(target){cancel();step=Math.max(0,Math.min(0,Math.round(target)));render(step)}
 async function enter(context={}){
  cancel();step=0;render(0);
  if(context.reason!=='forward'||context.previousId!=='page13'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  busy=true;const token=++generation;renderMorph(0);
  await new Promise(resolve=>{resolveMotion=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const t=Math.min(1,(now-start)/data.morph.duration);renderMorph(t);if(t<1)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve()}}raf=requestAnimationFrame(tick)});
  if(token===generation){render(0);busy=false}
 }
 function previewEntrance(ms){cancel();step=0;render(0);renderMorph(Math.max(0,Math.min(1,ms/data.morph.duration)))}
 render(0);const api={go,enter,cancel,leave:cancel,states,previewEntrance,getState:()=>({step,busy,count:1})};root.page14Controller=api;return api;
};
