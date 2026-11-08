window.slideFactories.page20=()=>{
 const data=@@PAGE20_DATA@@,root=document.getElementById('page20'),body=root.querySelector('.page20-body'),opening=root.querySelector('.page20-opening'),ns='http://www.w3.org/2000/svg';
 const clamp=t=>Math.max(0,Math.min(1,t)),mix=(a,b,t)=>a+(b-a)*t,box=s=>({x:s.left,y:s.top,width:s.width*s.scale,height:s.height*s.scale});
 function color(a,b,t){if(a==='none'||b==='none')return t<.5?a:b;const rgb=c=>{if(c[0]==='#'){if(c.length===4)c='#'+[...c.slice(1)].map(v=>v+v).join('');return [1,3,5].map(i=>parseInt(c.slice(i,i+2),16))}return c.match(/[\d.]+/g).slice(0,3).map(Number)};const x=rgb(a),y=rgb(b);return 'rgb('+x.map((v,i)=>Math.round(mix(v,y[i],t))).join(',')+')'}
 const sceneNodes=Object.fromEntries(Object.entries(data.scenes).map(([name,scene])=>[name,new Map(scene.shapes.map(s=>[s.id,root.querySelector('#p20-'+name+'-'+s.id)]))]));
 const names=['Rising adjacent samples','Copy the current input','Construct the forward delay','Compare adjacent samples','Complete feedback','Compositions and atomic components'];
 const states=names.map((name,i)=>({name,note:data.notes[i]+'\n\nSemantic reference: thesis section3.3.2, Listing3.2; Chapter4 opening and section4.1, printed pp95–97. Source: AEiC slides17–18. Source-state mapping: assets/page20/effect-map.json.'}));
 let step=0,busy=false,generation=0,raf=0,resolveMotion=null;
 const diagnostics={exact:0,resampled:0};
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
  const prefix='p20-morph-'+key+'-';const ids=new Map([...a.querySelectorAll('[id]')].map(n=>[n.id,prefix+n.id]));for(const n of [a,...a.querySelectorAll('*')])for(const attr of [...n.attributes]){let value=attr.value;if(attr.name==='id')value=ids.get(value)||value;else for(const [old,id] of ids)value=value.replaceAll('url(#'+old+')','url(#'+id+')').replace('#'+old,'#'+id);n.setAttribute(attr.name,value)}
  const aw=+a.getAttribute('width'),ah=+a.getAttribute('height'),bw=+b.getAttribute('width'),bh=+b.getAttribute('height');a.setAttribute('preserveAspectRatio','none');
  return {svg:a,render:t=>{for(const change of changes)change(t);a.setAttribute('viewBox',`0 0 ${mix(aw,bw,t)} ${mix(ah,bh,t)}`)}};
 }
 function makeMorph(config,targetShapes,targetNodes,label){
 const overlay=document.createElement('div');overlay.className='page20-morph';overlay.dataset.transition=label;overlay.hidden=true;root.append(overlay);
 const records=[];
 for(const m of config.matches){
  const dest=targetShapes.find(s=>s.id===m.targetId),node=document.createElement('div');node.className='page20-morph-object';node.dataset.sourceId=m.sourceId;node.dataset.targetId=m.targetId??'';
  let vectors=null,exact=null;const source=m.source;
  if(m.vectorMorph)exact=exactSvg(source.uri,targetNodes.get(dest.id).querySelector('img').src,label+'-'+m.sourceId);
  if(exact){node.append(exact.svg);diagnostics.exact++}
  else if(m.vectorMorph){diagnostics.resampled++;
   vectors = geometry[m.sourceId];
   if (!vectors) throw new Error('Missing prepared geometry for page20 object ' + m.sourceId);
   const svg = document.createElementNS(ns, 'svg');
   node.append(svg);
   for (const vector of vectors) {
    if (vector.ribbon) {
     vector.line = document.createElementNS(ns, 'path');
     vector.line.setAttribute('fill', 'none');
     vector.line.setAttribute('stroke-linejoin', 'round');
     vector.line.setAttribute('stroke-linecap', 'butt');
     svg.append(vector.line);
    }
    vector.node = document.createElementNS(ns, 'path');
    vector.node.setAttribute('stroke-linejoin', 'round');
    vector.node.setAttribute('stroke-linecap', 'square');
    svg.append(vector.node);
   }
   node._svg=svg;node._source=document.createElement('img');node._source.src=source.uri;node._source.alt='';node._source.style.cssText='position:absolute;inset:0';node._target=document.createElement('img');node._target.src=targetNodes.get(dest.id).querySelector('img').src;node._target.alt='';node._target.style.cssText='position:absolute;inset:0';node.append(node._source,node._target);
  }else if(source.uri){const img=document.createElement('img');img.src=source.uri;img.alt='';node.append(img)}else{node.innerHTML=source.html;node.classList.add('page20-explanation');if(source.role==='label')node.classList.add('page20-label')}
  overlay.append(node);records.push({m,dest,node,vectors,exact});
 }
 const matched=new Set(records.map(r=>r.dest?.id));
 const passThrough=records.find(r=>r.dest?.name==='!!RunF2');
 for(const s of targetShapes)if(s.visible&&!matched.has(s.id)){const node=targetNodes.get(s.id).cloneNode(true);node.removeAttribute('id');node.classList.remove('page20-item');node.classList.add('page20-morph-object');if(s.html)node.classList.add('page20-explanation');overlay.append(node);records.push({m:null,dest:s,node,vectors:null,anchor:null})}
 const order=new Map(targetShapes.map((s,i)=>[s.id,i]));for(const r of [...records].sort((a,b)=>(a.dest?order.get(a.dest.id):-1)-(b.dest?order.get(b.dest.id):-1)))overlay.append(r.node);
 function layout(node,b){node.style.left=b.x+'px';node.style.top=b.y+'px';node.style.width=b.width+'px';node.style.height=b.height+'px'}
 function morph(t){
  body.style.opacity='0';overlay.hidden=false;const q=t*t*(3-2*t);
  for(const {m,dest,node,vectors,anchor,exact} of records){node.style.visibility='visible';
   if(m&&dest){const a=m.box,b=box(dest),v={};for(const k of ['x','y','width','height'])v[k]=mix(a[k],b[k],q);layout(node,v);node.style.opacity=1;
    if(exact)exact.render(q);
    if(vectors){node._source.style.display=t===0?'block':'none';node._target.style.display=t===1?'block':'none';node._svg.style.visibility=t===0||t===1?'hidden':'visible';const destBox=b;node._svg.setAttribute('viewBox',`0 0 ${v.width} ${v.height}`);for(const p of vectors){const a=p.a||p.b,b=p.b||p.a;p.node.style.opacity=p.a&&p.b?1:p.a?1-q:q;p.node.setAttribute('fill',color(a.fill,b.fill,q));p.node.setAttribute('stroke',color(a.stroke,b.stroke,q));p.node.setAttribute('fill-opacity',mix(a.fillOpacity,b.fillOpacity,q));p.node.setAttribute('stroke-opacity',mix(a.strokeOpacity,b.strokeOpacity,q));p.node.setAttribute('stroke-width',mix(a.strokeWidth,b.strokeWidth,q));if(p.ribbon){p.node.setAttribute('fill',color(a.stroke!=='none'?a.stroke:a.fill,b.stroke!=='none'?b.stroke:b.fill,q));p.line.style.opacity=p.a&&p.b?1:p.a?1-q:q;p.line.setAttribute('stroke',color(a.stroke!=='none'?a.stroke:a.fill,b.stroke!=='none'?b.stroke:b.fill,q));p.line.setAttribute('stroke-width',mix(a.stroke!=='none'?a.strokeWidth:3,b.stroke!=='none'?b.strokeWidth:3,q));const part=p.parts[0];p.line.setAttribute('d',part.a.map((a,i)=>(i?'L':'M')+(mix(m.box.x+a[0]*m.box.width,destBox.x+part.b[i][0]*destBox.width,q)-v.x)+','+(mix(m.box.y+a[1]*m.box.height,destBox.y+part.b[i][1]*destBox.height,q)-v.y)).join(' '))}p.node.setAttribute('d',p.parts.filter(part=>!part.ribbon).map(part=>part.a.map((a,i)=>(i?'L':'M')+(mix(m.box.x+a[0]*m.box.width,destBox.x+part.b[i][0]*destBox.width,q)-v.x)+','+(mix(m.box.y+a[1]*m.box.height,destBox.y+part.b[i][1]*destBox.height,q)-v.y)).join(' ')+(part.closed?' Z':'')).join(' '))}}
   }else if(m){layout(node,m.box);node.style.opacity=clamp(1-t/.35)}else{layout(node,box(dest));node.style.opacity=clamp((t-.6)/.4)}
  }
 }
 return {draw:morph,hide:()=>{overlay.hidden=true}};
 }
 const internal=makeMorph(data.internal,data.scenes.structure.shapes,sceneNodes.structure,'internal');
 function render(target=step){internal.hide();body.style.opacity='';opening.style.opacity='';
  for(const [name,scene] of Object.entries(data.scenes)){
   root.querySelector('[data-page20-scene="'+name+'"]').style.display=(target<5?name==='construction':name==='structure')?'block':'none';
   const visible=new Map(scene.shapes.map(s=>[s.id,s.visible]));const groups=name==='construction'?Math.min(4,target):Math.max(0,target-5);
   for(let i=0;i<groups;i++)for(const e of scene.groups[i].events)visible.set(e.id,e.kind==='entr');
   for(const s of scene.shapes){const node=sceneNodes[name].get(s.id),v=visible.get(s.id);node.style.opacity=v?1:0;node.style.visibility=v?'visible':'hidden';node.setAttribute('aria-hidden',String(!v))}
  }
 }
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done()}busy=false;internal.hide();body.style.opacity='';opening.style.opacity=''}
 async function motion(){const token=++generation;busy=true;internal.draw(0);
  await new Promise(resolve=>{resolveMotion=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const t=clamp((now-start)/500);internal.draw(t);if(t<1)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve()}}raf=requestAnimationFrame(tick)});
  if(token===generation){render();busy=false}
 }
 async function go(target=0,animate=true){cancel();const from=step;step=Math.max(0,Math.min(5,Math.round(target)));if(animate&&from===4&&step===5&&!matchMedia('(prefers-reduced-motion: reduce)').matches){render(4);await motion()}else render()}
 async function enter(){cancel();step=0;render()}
 function previewInternal(ms){cancel();step=5;render(4);internal.draw(clamp(ms/500))}
 render();const api={go,enter,cancel,leave:cancel,states,previewInternal,getState:()=>({step,busy,count:6,diagnostics})};root.page20Controller=api;return api;
};
