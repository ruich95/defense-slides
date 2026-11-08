window.slideFactories.page16=()=>{
 const data=@@PAGE16_DATA@@,root=document.getElementById('page16'),body=root.querySelector('.page16-body'),ns='http://www.w3.org/2000/svg',nodes=new Map(data.shapes.map(s=>[s.id,root.querySelector('#p16-shape-'+s.id)]));
 const states=[{name:'The single-step composition boundary',note:data.notes[0]+'\n\nSource: AEiC-26.pptx slide 11. A 750 ms internal boundary/port Morph from the network scene. Source mapping: assets/page16/morph-map.json.'}];
 let generation=0,busy=false,raf=0,resolveMotion=null;
 const overlay=document.createElement('div');overlay.className='page16-morph';overlay.hidden=true;root.append(overlay);
 const clamp=t=>Math.max(0,Math.min(1,t)),box=s=>({x:s.left,y:s.top,width:s.width*s.scale,height:s.height*s.scale});
 const mix=(a,b,t)=>a+(b-a)*t;
 function color(a,b,t){if(a==='none'||b==='none')return t<.5?a:b;const rgb=c=>{if(c[0]==='#'){if(c.length===4)c='#'+[...c.slice(1)].map(v=>v+v).join('');return [1,3,5].map(i=>parseInt(c.slice(i,i+2),16))}return c.match(/[\d.]+/g).slice(0,3).map(Number)};const x=rgb(a),y=rgb(b);return 'rgb('+x.map((v,i)=>Math.round(mix(v,y[i],t))).join(',')+')'}
 // Float64 samples and contour alignment are authored once, never measured on entry.
 @@MORPH_DECODER@@
 const geometry = decodeMorphGeometry(@@MORPH_GEOMETRY@@);
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
  const prefix='p16-morph-'+key+'-';const ids=new Map([...a.querySelectorAll('[id]')].map(n=>[n.id,prefix+n.id]));for(const n of [a,...a.querySelectorAll('*')])for(const attr of [...n.attributes]){let value=attr.value;if(attr.name==='id')value=ids.get(value)||value;else for(const [old,id] of ids)value=value.replaceAll('url(#'+old+')','url(#'+id+')').replace('#'+old,'#'+id);n.setAttribute(attr.name,value)}
  const aw=+a.getAttribute('width'),ah=+a.getAttribute('height'),bw=+b.getAttribute('width'),bh=+b.getAttribute('height');a.setAttribute('preserveAspectRatio','none');
  return {svg:a,render:t=>{for(const change of changes)change(t);a.setAttribute('viewBox',`0 0 ${mix(aw,bw,t)} ${mix(ah,bh,t)}`)}};
 }
 const diagnostics={exact:0,resampled:0};
 const records=[];
 for(const m of data.morph.matches){
  const dest=data.shapes.find(s=>s.id===m.targetId),node=document.createElement('div');node.className='page16-morph-object';node.dataset.sourceId=m.sourceId;node.dataset.targetId=m.targetId??'';
  let vectors=null,exact=null;const source=m.source;
  if(m.vectorMorph)exact=exactSvg(source.uri,nodes.get(dest.id).querySelector('img').src,m.sourceId);
  if(exact){node.append(exact.svg);diagnostics.exact++}
  else if(m.vectorMorph){diagnostics.resampled++;
   const svg=document.createElementNS(ns,'svg');node.append(svg);vectors=geometry[m.sourceId];
   if(!vectors)throw new Error('Missing precomputed page16 Morph geometry for '+m.sourceId);
   for(const v of vectors){if(v.ribbon){v.line=document.createElementNS(ns,'path');v.line.setAttribute('fill','none');v.line.setAttribute('stroke-linejoin','round');v.line.setAttribute('stroke-linecap','butt');svg.append(v.line)}v.node=document.createElementNS(ns,'path');v.node.setAttribute('stroke-linejoin','round');v.node.setAttribute('stroke-linecap','square');svg.append(v.node)}
   node._svg=svg;node._source=document.createElement('img');node._source.src=source.uri;node._source.alt='';node._source.style.cssText='position:absolute;inset:0';node._target=document.createElement('img');node._target.src=nodes.get(dest.id).querySelector('img').src;node._target.alt='';node._target.style.cssText='position:absolute;inset:0';node.append(node._source,node._target);
  }else if(source.uri){const img=document.createElement('img');img.src=source.uri;img.alt='';node.append(img)}else{node.innerHTML=source.html;node.classList.add('page16-explanation');if(source.role==='label')node.classList.add('page16-label')}
  overlay.append(node);records.push({m,dest,node,vectors,exact});
 }
 const matched=new Set(records.map(r=>r.dest?.id));
 const passThrough=records.find(r=>r.dest?.name==='!!RunF2');
 for(const s of data.shapes)if(s.visible&&!matched.has(s.id)){const node=nodes.get(s.id).cloneNode(true);node.removeAttribute('id');node.classList.remove('page16-item');node.classList.add('page16-morph-object');overlay.append(node);records.push({m:null,dest:s,node,vectors:null,anchor:null})}
 const order=new Map(data.shapes.map((s,i)=>[s.id,i]));for(const r of [...records].sort((a,b)=>(a.dest?order.get(a.dest.id):-1)-(b.dest?order.get(b.dest.id):-1)))overlay.append(r.node);
 function layout(node,b){node.style.left=b.x+'px';node.style.top=b.y+'px';node.style.width=b.width+'px';node.style.height=b.height+'px'}
 function morph(t){
  body.style.opacity='0';overlay.hidden=false;const q=t*t*(3-2*t);
  for(const {m,dest,node,vectors,anchor,exact} of records){node.style.visibility='visible';
   if(m&&dest){const a=m.box,b=box(dest),v={};for(const k of ['x','y','width','height'])v[k]=mix(a[k],b[k],q);layout(node,v);node.style.opacity=1;
    if(exact)exact.render(q);
    if(vectors){node._source.style.display=t===0?'block':'none';node._target.style.display=t===1?'block':'none';node._svg.style.visibility=t===0||t===1?'hidden':'visible';const destBox=b;node._svg.setAttribute('viewBox',`0 0 ${v.width} ${v.height}`);for(const p of vectors){const a=p.a||p.b,b=p.b||p.a;p.node.style.opacity=p.a&&p.b?1:p.a?1-q:q;p.node.setAttribute('fill',color(a.fill,b.fill,q));p.node.setAttribute('stroke',color(a.stroke,b.stroke,q));p.node.setAttribute('fill-opacity',mix(a.fillOpacity,b.fillOpacity,q));p.node.setAttribute('stroke-opacity',mix(a.strokeOpacity,b.strokeOpacity,q));p.node.setAttribute('stroke-width',mix(a.strokeWidth,b.strokeWidth,q));if(p.ribbon){p.line.style.opacity=p.a&&p.b?1:p.a?1-q:q;p.line.setAttribute('stroke',color(a.fill,b.fill,q));p.line.setAttribute('stroke-width',3);const part=p.parts[0];p.line.setAttribute('d',part.a.map((a,i)=>(i?'L':'M')+(mix(m.box.x+a[0]*m.box.width,destBox.x+part.b[i][0]*destBox.width,q)-v.x)+','+(mix(m.box.y+a[1]*m.box.height,destBox.y+part.b[i][1]*destBox.height,q)-v.y)).join(' '))}p.node.setAttribute('d',p.parts.filter(part=>!part.ribbon).map(part=>part.a.map((a,i)=>(i?'L':'M')+(mix(m.box.x+a[0]*m.box.width,destBox.x+part.b[i][0]*destBox.width,q)-v.x)+','+(mix(m.box.y+a[1]*m.box.height,destBox.y+part.b[i][1]*destBox.height,q)-v.y)).join(' ')+(part.closed?' Z':'')).join(' '))}}
   }else if(m){layout(node,m.box);node.style.opacity=1-q}else{let b=box(dest);if(anchor){const a=anchor.m.box,z=box(anchor.dest),start={x:a.x+(b.x-z.x)*a.width/z.width,y:a.y+(b.y-z.y)*a.height/z.height,width:b.width*a.width/z.width,height:b.height*a.height/z.height};for(const k of ['x','y','width','height'])b[k]=mix(start[k],b[k],q)}layout(node,b);node.style.opacity=q}
  }
 }
 function render(){overlay.hidden=true;body.style.opacity='';for(const s of data.shapes){const n=nodes.get(s.id);n.style.opacity=s.visible?1:0;n.style.visibility=s.visible?'visible':'hidden';n.setAttribute('aria-hidden',String(!s.visible))}}
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done()}busy=false;overlay.hidden=true;body.style.opacity=''}
 async function go(){cancel();render()}
 async function enter(context={}){cancel();render();if(context.reason!=='forward'||context.previousId!=='page15'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;busy=true;const token=++generation;morph(0);
  await new Promise(resolve=>{resolveMotion=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const t=clamp((now-start)/data.morph.duration);morph(t);if(t<1)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve()}}raf=requestAnimationFrame(tick)});if(token===generation){render();busy=false}}
 function previewEntrance(ms){cancel();render();morph(clamp(ms/data.morph.duration))}
 render();const api={go,enter,cancel,leave:cancel,states,previewEntrance,getState:()=>({step:0,busy,count:1,diagnostics})};root.page16Controller=api;return api;
};
