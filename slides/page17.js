window.slideFactories.page17=()=>{
 const data=@@PAGE17_DATA@@,root=document.getElementById('page17'),body=root.querySelector('.page17-body'),ns='http://www.w3.org/2000/svg',nodes=new Map(data.shapes.map(s=>[s.id,root.querySelector('#p17-shape-'+s.id)]));
 const names=['Behaviour, single step and type','First argument: g','Second argument: f','Composite result','Clean comparison'];
 const states=names.map((name,i)=>({name,note:data.notes[i]+'\n\nSource: AEiC-26.pptx slide 12. Entrance 750 ms from P16; four original highlight clicks. Mapping: assets/page17/morph-map.json.'}));
 let step=0;
 let generation=0,busy=false,raf=0,resolveMotion=null;
 const overlay=document.createElement('div');overlay.className='page17-morph';overlay.hidden=true;root.append(overlay);
 const clamp=t=>Math.max(0,Math.min(1,t)),box=s=>({x:s.left,y:s.top,width:s.width*s.scale,height:s.height*s.scale});
 const mix=(a,b,t)=>a+(b-a)*t;
 function color(a,b,t){if(a==='none'||b==='none')return t<.5?a:b;const rgb=c=>{if(c[0]==='#'){if(c.length===4)c='#'+[...c.slice(1)].map(v=>v+v).join('');return [1,3,5].map(i=>parseInt(c.slice(i,i+2),16))}return c.match(/[\d.]+/g).slice(0,3).map(Number)};const x=rgb(a),y=rgb(b);return 'rgb('+x.map((v,i)=>Math.round(mix(v,y[i],t))).join(',')+')'}
 function sample(uri,bounds){
  const svg=new DOMParser().parseFromString(atob(uri.split(',')[1]),'image/svg+xml').documentElement;
  svg.style.cssText='position:absolute;opacity:0;pointer-events:none';root.append(svg);
  const width=+svg.getAttribute('width'),height=+svg.getAttribute('height'),items=[];
  for(const shape of svg.querySelectorAll('path,rect,circle,ellipse,polygon,polyline')){
   if(shape.closest('defs'))continue;
   const style=getComputedStyle(shape),matrix=shape.getCTM(),parts=[];
   const segments=shape.tagName==='path'?shape.getAttribute('d').split(/(?=[Mm])/).filter(Boolean):[null];
   for(const segment of segments){
    let probe=shape;if(segment){probe=document.createElementNS(ns,'path');probe.setAttribute('d',segment);shape.parentNode.append(probe)}
    const length=probe.getTotalLength(),points=[];
    for(let i=0;i<192;i++){const p=probe.getPointAtLength(length*i/191).matrixTransform(matrix);points.push([p.x/width,p.y/height])}
    const centerline=[];for(let i=0;i<192;i++){const u=length*i/191/2,a=probe.getPointAtLength(u).matrixTransform(matrix),b=probe.getPointAtLength(length-u).matrixTransform(matrix);centerline.push([(a.x+b.x)/2/width,(a.y+b.y)/2/height])}
    parts.push({points,centerline,closed:segment?/[zZ]\s*$/.test(segment):!['line','polyline'].includes(shape.tagName)});if(segment)probe.remove();
   }
   items.push({kind:shape.tagName,parts,fill:style.fill,stroke:style.stroke,fillOpacity:+style.fillOpacity,strokeOpacity:+style.strokeOpacity,strokeWidth:parseFloat(style.strokeWidth)*bounds.width/width});
  }
  svg.remove();return items;
 }
 function align(a,b,closed){
  if(!closed)return b;let best=Infinity,offset=0,direction=1;const n=191;
  for(const dir of [1,-1])for(let k=0;k<n;k++){let score=0;for(let j=0;j<n;j+=4){const q=b[(k+dir*j+n)%n];score+=(a[j][0]-q[0])**2+(a[j][1]-q[1])**2}if(score<best){best=score;offset=k;direction=dir}}
  const points=Array.from({length:n},(_,j)=>b[(offset+direction*j+n)%n]);points.push(points[0]);return points;
 }
 function exactSvg(aUri,bUri,key){
  const parse=uri=>new DOMParser().parseFromString(atob(uri.split(',')[1]),'image/svg+xml').documentElement;
  const a=parse(aUri),b=parse(bUri),aa=[a,...a.querySelectorAll('*')],bb=[b,...b.querySelectorAll('*')],changes=[];
  if(aa.length!==bb.length||aa.some((n,i)=>n.tagName!==bb[i].tagName))return null;
  const pattern=/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi;
  for(let i=0;i<aa.length;i++)for(const name of new Set([...aa[i].attributes,...bb[i].attributes].map(n=>n.name))){
   if(['id','xmlns','xmlns:xlink','width','height'].includes(name)&&i===0||name==='id')continue;
   const x=aa[i].getAttribute(name),y=bb[i].getAttribute(name);if(x===y)continue;
   if(name==='fill'||name==='stroke'){if(x&&y&&x!=='none'&&y!=='none')changes.push(t=>aa[i].setAttribute(name,color(x,y,t)));else changes.push(t=>{if(t<.5){if(x!==null)aa[i].setAttribute(name,x);else aa[i].removeAttribute(name)}else{if(y!==null)aa[i].setAttribute(name,y);else aa[i].removeAttribute(name)}});continue}
   if(name==='stroke-dasharray'){
    const target=(y&&y!=='none'?y:x).match(pattern).map(Number),source=x&&x!=='none'?x.match(pattern).map(Number):target.map((v,j)=>j%2?0:v),dest=y&&y!=='none'?target:source.map((v,j)=>j%2?0:v);
    changes.push(t=>aa[i].setAttribute(name,source.map((v,j)=>mix(v,dest[j],t)).join(' ')));continue;
   }
   if(x!==null&&y!==null&&x.replace(pattern,'#').replace(/[\s,]/g,'')===y.replace(pattern,'#').replace(/[\s,]/g,'')){
    const av=(x.match(pattern)||[]).map(Number),bv=(y.match(pattern)||[]).map(Number);if(av.length!==bv.length)return null;
    changes.push(t=>{let k=0;aa[i].setAttribute(name,x.replace(pattern,()=>String(mix(av[k],bv[k++],t))))});
   }else if(name==='d'||name==='transform')return null;
   else changes.push(t=>{const value=t<.5?x:y;if(value===null)aa[i].removeAttribute(name);else aa[i].setAttribute(name,value)});
  }
  const prefix='p17-morph-'+key+'-';const ids=new Map([...a.querySelectorAll('[id]')].map(n=>[n.id,prefix+n.id]));for(const n of [a,...a.querySelectorAll('*')])for(const attr of [...n.attributes]){let value=attr.value;if(attr.name==='id')value=ids.get(value)||value;else for(const [old,id] of ids)value=value.replaceAll('url(#'+old+')','url(#'+id+')').replace('#'+old,'#'+id);n.setAttribute(attr.name,value)}
  const aw=+a.getAttribute('width'),ah=+a.getAttribute('height'),bw=+b.getAttribute('width'),bh=+b.getAttribute('height');a.setAttribute('preserveAspectRatio','none');
  return {svg:a,render:t=>{for(const change of changes)change(t);a.setAttribute('viewBox',`0 0 ${mix(aw,bw,t)} ${mix(ah,bh,t)}`)}};
 }
 const diagnostics={exact:0,resampled:0};
 const records=[];
 for(const m of data.morph.matches){
  const dest=data.shapes.find(s=>s.id===m.targetId),node=document.createElement('div');node.className='page17-morph-object';node.dataset.sourceId=m.sourceId;node.dataset.targetId=m.targetId??'';
  let vectors=null,exact=null;const source=m.source;
  if(m.vectorMorph)exact=exactSvg(source.uri,nodes.get(dest.id).querySelector('img').src,m.sourceId);
  if(exact){node.append(exact.svg);diagnostics.exact++}
  else if(m.vectorMorph){diagnostics.resampled++;
   const from=sample(source.uri,m.box),to=sample(nodes.get(dest.id).querySelector('img').src,box(dest)),svg=document.createElementNS(ns,'svg');node.append(svg);vectors=[];
   // Match native primitives by kind, paint and relative location. Additional
   // interface ports are new primitives, not a resize of an existing port.
   const used=new Set();
   for(const a of from){let index=-1,best=Infinity;for(let j=0;j<to.length;j++){if(used.has(j))continue;const b=to[j];let cost=(a.kind===b.kind?0:3)+(a.fill===b.fill?0:1)+Math.hypot(a.parts[0].points[0][0]-b.parts[0].points[0][0],a.parts[0].points[0][1]-b.parts[0].points[0][1]);if(cost<best){best=cost;index=j}}
    const b=index<0?null:to[index];if(b)used.add(index);vectors.push({a,b});
   }
   for(let j=0;j<to.length;j++)if(!used.has(j))vectors.push({a:null,b:to[j]});
   for(const v of vectors){v.ribbon=/^!!(?:Get|Set)/.test(m.sourceName)&&v.a?.parts.length===2&&v.b?.parts.length===2;if(v.ribbon){v.line=document.createElementNS(ns,'path');v.line.setAttribute('fill','none');v.line.setAttribute('stroke-linejoin','round');v.line.setAttribute('stroke-linecap','butt');svg.append(v.line)}v.node=document.createElementNS(ns,'path');v.node.setAttribute('stroke-linejoin','round');v.node.setAttribute('stroke-linecap','square');svg.append(v.node);v.parts=[];
    const a=v.a||v.b,b=v.b||v.a;
    for(let i=0;i<Math.max(a.parts.length,b.parts.length);i++){const aa=a.parts[i],bb=b.parts[i],collapsed=p=>({points:Array.from({length:192},()=>p.points[0]),closed:p.closed});const x=aa||collapsed(bb),y=bb||collapsed(aa);v.parts.push(v.ribbon&&i===0?{a:x.centerline,b:y.centerline,closed:false,ribbon:true}:{a:x.points,b:align(x.points,y.points,x.closed&&y.closed),closed:x.closed||y.closed})}
   }
   node._svg=svg;node._source=document.createElement('img');node._source.src=source.uri;node._source.alt='';node._source.style.cssText='position:absolute;inset:0';node._target=document.createElement('img');node._target.src=nodes.get(dest.id).querySelector('img').src;node._target.alt='';node._target.style.cssText='position:absolute;inset:0';node.append(node._source,node._target);
  }else if(source.uri){const img=document.createElement('img');img.src=source.uri;img.alt='';node.append(img)}else{node.innerHTML=source.html;node.classList.add('page17-explanation');if(source.role==='label')node.classList.add('page17-label')}
  overlay.append(node);records.push({m,dest,node,vectors,exact});
 }
 const matched=new Set(records.map(r=>r.dest?.id));
 const passThrough=records.find(r=>r.dest?.name==='!!RunF2');
 for(const s of data.shapes)if(s.visible&&!matched.has(s.id)){const node=nodes.get(s.id).cloneNode(true);node.removeAttribute('id');node.classList.remove('page17-item');node.classList.add('page17-morph-object');overlay.append(node);records.push({m:null,dest:s,node,vectors:null,anchor:null})}
 const order=new Map(data.shapes.map((s,i)=>[s.id,i]));for(const r of [...records].sort((a,b)=>(a.dest?order.get(a.dest.id):-1)-(b.dest?order.get(b.dest.id):-1)))overlay.append(r.node);
 function layout(node,b){node.style.left=b.x+'px';node.style.top=b.y+'px';node.style.width=b.width+'px';node.style.height=b.height+'px'}
 function morph(t){
  body.style.opacity='0';overlay.hidden=false;const q=t*t*(3-2*t);
  for(const {m,dest,node,vectors,anchor,exact} of records){node.style.visibility='visible';
   if(m&&dest){const a=m.box,b=box(dest),v={};for(const k of ['x','y','width','height'])v[k]=mix(a[k],b[k],q);layout(node,v);node.style.opacity=1;
    if(exact)exact.render(q);
    if(vectors){node._source.style.display=t===0?'block':'none';node._target.style.display=t===1?'block':'none';node._svg.style.visibility=t===0||t===1?'hidden':'visible';const destBox=b;node._svg.setAttribute('viewBox',`0 0 ${v.width} ${v.height}`);for(const p of vectors){const a=p.a||p.b,b=p.b||p.a;p.node.style.opacity=p.a&&p.b?1:p.a?1-q:q;p.node.setAttribute('fill',color(a.fill,b.fill,q));p.node.setAttribute('stroke',color(a.stroke,b.stroke,q));p.node.setAttribute('fill-opacity',mix(a.fillOpacity,b.fillOpacity,q));p.node.setAttribute('stroke-opacity',mix(a.strokeOpacity,b.strokeOpacity,q));p.node.setAttribute('stroke-width',mix(a.strokeWidth,b.strokeWidth,q));if(p.ribbon){p.line.style.opacity=p.a&&p.b?1:p.a?1-q:q;p.line.setAttribute('stroke',color(a.fill,b.fill,q));p.line.setAttribute('stroke-width',3);const part=p.parts[0];p.line.setAttribute('d',part.a.map((a,i)=>(i?'L':'M')+(mix(m.box.x+a[0]*m.box.width,destBox.x+part.b[i][0]*destBox.width,q)-v.x)+','+(mix(m.box.y+a[1]*m.box.height,destBox.y+part.b[i][1]*destBox.height,q)-v.y)).join(' '))}p.node.setAttribute('d',p.parts.filter(part=>!part.ribbon).map(part=>part.a.map((a,i)=>(i?'L':'M')+(mix(m.box.x+a[0]*m.box.width,destBox.x+part.b[i][0]*destBox.width,q)-v.x)+','+(mix(m.box.y+a[1]*m.box.height,destBox.y+part.b[i][1]*destBox.height,q)-v.y)).join(' ')+(part.closed?' Z':'')).join(' '))}}
   }else if(m){layout(node,m.box);node.style.opacity=/^!!(?:Run|State|Get|Set)/.test(m.sourceName)?clamp(1-t/.5):1-q}else{let b=box(dest);if(anchor){const a=anchor.m.box,z=box(anchor.dest),start={x:a.x+(b.x-z.x)*a.width/z.width,y:a.y+(b.y-z.y)*a.height/z.height,width:b.width*a.width/z.width,height:b.height*a.height/z.height};for(const k of ['x','y','width','height'])b[k]=mix(start[k],b[k],q)}layout(node,b);node.style.opacity=dest.role==='code'?clamp((t-.8)/.2):q}
  }
 }
 function render(target=step){overlay.hidden=true;body.style.opacity='';const visible=new Map(data.shapes.map(s=>[s.id,s.visible]));for(let i=0;i<target;i++)for(const e of data.groups[i].events)visible.set(e.id,e.kind==='entr');for(const s of data.shapes){const n=nodes.get(s.id),v=visible.get(s.id);n.style.opacity=v?1:0;n.style.visibility=v?'visible':'hidden';n.setAttribute('aria-hidden',String(!v))}}
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done()}busy=false;overlay.hidden=true;body.style.opacity=''}
 async function go(target=0){cancel();step=Math.max(0,Math.min(4,Math.round(target)));render()}
 async function enter(context={}){cancel();step=0;render();if(context.reason!=='forward'||context.previousId!=='page16'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;busy=true;const token=++generation;morph(0);
  await new Promise(resolve=>{resolveMotion=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const t=clamp((now-start)/data.morph.duration);morph(t);if(t<1)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve()}}raf=requestAnimationFrame(tick)});if(token===generation){render();busy=false}}
 function previewEntrance(ms){cancel();step=0;render();morph(clamp(ms/data.morph.duration))}
 render();const api={go,enter,cancel,leave:cancel,states,previewEntrance,getState:()=>({step,busy,count:5,diagnostics})};root.page17Controller=api;return api;
};
