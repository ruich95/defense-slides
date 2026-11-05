window.slideFactories.contracts=()=>{
 const root=document.getElementById('contracts'),$=id=>root.querySelector('#contracts-'+id);
 const names=['Same interface, different behaviour','The behavioural question','Unfold across time','Sequential composition with shared state','Required temporal handover','A dependent contract'];
 const notes=[
  'These two setters have the same interface. One stores the incoming value; the other preserves the old state. The type discipline constrains use but this interface alone does not establish intended behaviour.',
  'Now treat get and set as black boxes. We expect the value computed in one reaction to pass to the next. The right chain represents successive reactions of the same system.',
  'Within a reaction we get, compute and set. Unfolding reveals set followed by get at the boundary. The lifting function run carries state across that boundary. The delay\'s role is explained orally through temporal order and state threading. The unfolded clouds represent successive reactions, not physically duplicated combinational hardware.',
  'The pair has the shared-state sequential-composition structure introduced earlier. The small dotted unit-data connection is distinct from the coral state thread. We can ask for a law about this composition without opening the implementations. This is the handover we require—not something the interfaces alone guarantee.',
  'For the expected temporal behaviour, the boundary must transfer the computed value onward like a wire. This is a required behavioural equivalence, not something inferred from the interface alone. run supplies the temporal state threading. The coral question preserves what this data-transfer view leaves unspecified.',
  'This slide uses an alternative partial contract inspired by thesis section 3.3.4; it is not an equivalent rewriting or exact thesis excerpt. For every initial state st and input x, there is some resulting state st′ such that setting x and then getting returns the output x together with st′. The tuple is output first, then state, matching the component-result convention on P13. The black wire expresses identity on the returned data; the coral question mark leaves the resulting state unspecified. That state may depend on x and st. The contract asserts neither state identity nor retention, and it does not determine both primitive implementations completely. Implementations must satisfy this contract and supply evidence; it supports reasoning about a black-box component without inspecting its internals. No new machine-checked proof or experiment is reported. Next, reason across the language boundary of a component implemented in C.'
 ];
 const narrativeStates=names.map((name,i)=>({name,note:notes[i]+'\n\nSources: thesis §3.3.4, printed pp. 77–79 (PDF pp. 101–103), and §3.3.1, Fig. 3.8. Shallow approach before the later SynQ EDSL. Visual source: figures/svg/draft-p16a.svg; shared-state composition matches P16.'}));
 const openingCitation=narrativeStates[0].note.slice(narrativeStates[0].note.indexOf('\n\nSources:'));
 const states=[
  {name:'Interfaces only',note:'We begin with two empty components exposing the same ports. The interface constrains how they connect, while leaving their intended behaviour open.'+openingCitation},
  {name:'Expected setter',note:'This is the expected setter. Its black inner path transfers the incoming data value to the outgoing state. The second component still exposes only its interface.'+openingCitation},
  narrativeStates[0],...narrativeStates.slice(1)
 ];
 const sceneNames=[null,null,null,'loop','unfolded','grouped','wire','wire'];
 const frameNames=['loop','unfolded','grouped','wire'];
 const svg=$('native-art'),ns='http://www.w3.org/2000/svg';
 const mix=(a,b,t)=>a+(b-a)*t,clamp=t=>Math.max(0,Math.min(1,t));
 let step=0,busy=false,generation=0,raf=0,resolveMotion=null;
 function show(id,on){const n=typeof id==='string'?$(id):id;n.style.opacity=on?'1':'0';n.style.visibility=on?'visible':'hidden';n.setAttribute('aria-hidden',String(!on))}
 function render(){
  show('row1',true);show('native-row1',true);
  for(const node of $('native-row1').querySelectorAll('[data-opening-reveal]'))show(node,step>=+node.dataset.openingReveal);
  for(const id of ['row2','native-reference'])show(id,step>=3);
  for(const name of frameNames)show('native-'+name,step>=3&&sceneNames[step]===name);
  for(const id of ['row3','native-law','contract'])show(id,step===7);
  show(overlay,false);root.dataset.state=String(step+1);delete root.dataset.morphProgress;
 }
 // Native primitives are read from complete untouched source groups. Their
 // transforms are flattened only in the temporary motion layer. Settled
 // endpoints always display the complete original groups and paint order.
 function point(matrix,x,y){const p=new DOMPoint(x,y).matrixTransform(matrix);return [p.x,p.y]}
 function flattenedPath(node,matrix){
  const tokens=node.getAttribute('d').match(/[a-zA-Z]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/g),arity={M:2,L:2,H:1,V:1,C:6,S:4,Q:4,T:2,A:7,Z:0};
  let i=0,cmd='',x=0,y=0,startX=0,startY=0,out=[];
  while(i<tokens.length){
   if(/^[a-zA-Z]$/.test(tokens[i]))cmd=tokens[i++];
   const upper=cmd.toUpperCase(),relative=cmd!==upper,n=arity[upper];
   if(n===undefined)throw new Error('Unsupported native SVG command '+cmd);
   if(upper==='Z'){out.push({cmd:'Z',v:[]});x=startX;y=startY;cmd='';continue}
   const a=tokens.slice(i,i+n).map(Number);i+=n;
   const xy=(u,v)=>[u+(relative?x:0),v+(relative?y:0)];let end,values=[];
   if(upper==='H'){end=[a[0]+(relative?x:0),y];values=point(matrix,...end);out.push({cmd:'L',v:values})}
   else if(upper==='V'){end=[x,a[0]+(relative?y:0)];values=point(matrix,...end);out.push({cmd:'L',v:values})}
   else if(upper==='A'){end=xy(a[5],a[6]);values=[a[0]*Math.hypot(matrix.a,matrix.b),a[1]*Math.hypot(matrix.c,matrix.d),a[2],a[3],a[4],...point(matrix,...end)];out.push({cmd:'A',v:values})}
   else{for(let k=0;k<a.length;k+=2)values.push(...point(matrix,...xy(a[k],a[k+1])));end=xy(a[a.length-2],a[a.length-1]);out.push({cmd:upper,v:values})}
   x=end[0];y=end[1];if(upper==='M'){startX=x;startY=y;cmd=relative?'l':'L'}
  }
  return out;
 }
 function pathString(parts){return parts.map(p=>p.cmd+p.v.map(v=>Number(v.toFixed(4))).join(' ')).join(' ')}
 function sampled(node,matrix){const length=node.getTotalLength();return Array.from({length:128},(_,i)=>{const p=node.getPointAtLength(length*i/127);return point(matrix,p.x,p.y)})}
 function snapshot(name){
  const frame=$('native-'+name),items=[];
  for(const node of frame.querySelectorAll('path,rect,circle,text')){
   const matrix=node.getCTM(),style=getComputedStyle(node),scale=Math.hypot(matrix.a,matrix.b),id=node.dataset.sourceId,kind=node.tagName;
   const b=node.getBBox(),xy=point(matrix,b.x,b.y),size={x:xy[0],y:xy[1],w:b.width*scale,h:b.height*scale};
   const p={source:id,node,kind,matrix,scale,size,role:null,paint:{fill:style.fill,stroke:style.stroke,fillOpacity:+style.fillOpacity,strokeOpacity:+style.strokeOpacity,strokeWidth:parseFloat(style.strokeWidth)*scale,dash:style.strokeDasharray,opacity:1,marker:style.markerEnd}};
   if(kind==='path'){p.parts=flattenedPath(node,matrix);p.points=sampled(node,matrix);p.closed=/[zZ]\s*$/.test(node.getAttribute('d'));}
   if(kind==='rect'){const a=point(matrix,+node.getAttribute('x'),+node.getAttribute('y'));p.geometry={x:a[0],y:a[1],width:+node.getAttribute('width')*scale,height:+node.getAttribute('height')*scale,rx:+node.getAttribute('rx')*scale,ry:+node.getAttribute('ry')*scale};}
   if(kind==='circle'){const a=point(matrix,+node.getAttribute('cx'),+node.getAttribute('cy'));p.geometry={cx:a[0],cy:a[1],r:+node.getAttribute('r')*scale};}
   if(kind==='text'){const line=node.querySelector('tspan')||node,a=point(matrix,+line.getAttribute('x')||+node.getAttribute('x'),+line.getAttribute('y')||+node.getAttribute('y'));p.geometry={x:a[0],y:a[1],fontSize:parseFloat(style.fontSize)*scale};p.content=node.textContent;p.anchor=style.textAnchor;p.font=style.fontFamily;p.weight=style.fontWeight;}
   items.push(p);
  }
  const bodies=items.filter(p=>p.kind==='rect'&&p.size.w>45&&p.size.h>30).sort((a,b)=>a.size.x-b.size.x);
  for(const body of bodies)body.role=body.size.w>150?'shell':name==='loop'?(body===bodies[0]?'get':'set'):(body===bodies.find(p=>p.size.w<150)?'set':'get');
  for(const p of items){
   if(p.role)continue;
   if(p.kind==='rect'){
    const cx=p.size.x+p.size.w/2,cy=p.size.y+p.size.h/2;
    const candidate=bodies.map(b=>({b,left:Math.abs(cx-b.size.x),right:Math.abs(cx-b.size.x-b.size.w)})).sort((a,b)=>Math.min(a.left,a.right)-Math.min(b.left,b.right))[0];
    const side=candidate.left<candidate.right?'L':'R',lane=cy<candidate.b.size.y+candidate.b.size.h/2?'D':'S';p.role=candidate.b.role+'-'+side+'-'+lane;
   }else if(p.kind==='text'){
    if(p.content.trim()==='get'||p.content.trim()==='set')p.role=p.content.trim()+'-label';
    else if(p.content.trim()==='?'){
     const body=bodies.filter(b=>b.size.w<150).sort((a,b)=>Math.abs(a.size.x+a.size.w/2-p.size.x)-Math.abs(b.size.x+b.size.w/2-p.size.x))[0];p.role=body?body.role+'-unknown':'state-unknown';
    }
   }else if(p.kind==='circle')p.role='delay-circle';
   else if(p.kind==='path'&&p.paint.fill==='rgb(222, 240, 255)')p.role='delay-triangle';
  }
  const clouds=items.filter(p=>p.kind==='path'&&p.closed&&p.paint.fill==='rgb(232, 106, 88)').sort((a,b)=>a.size.x-b.size.x);
  clouds.forEach((p,i)=>p.role=i?'cloud-next':'cloud-t');
  const maps={
   loop:{'path8-7-2-2-8-1-1-6-6-3':'data-get-cloud','path8-7-2-2-8-1-1-1-3-6-7':'data-cloud-set','path75-0-1':'state-after','path79-6-7':'feedback-return','path80-0-4':'state-middle'},
   unfolded:{'path8-7-2-2-8-1-1-6-6-3-1':'data-input','path8-7-2-2-8-1-1-1-3-6-7-2':'data-cloud-set','path8-7-2-2-8-1-1-6-6-3-1-0':'data-get-cloud','path8-7-2-2-8-1-1-1-3-6-7-2-4':'data-output','path75-0-1-9':'state-before','path75-0-1-9-3':'state-after','path75-0-1-9-8-9-8-25':'state-middle'},
   grouped:{'path8-7-2-2-8-1-1-6-6-3-1-03':'data-input','path8-7-2-2-8-1-1-1-3-6-7-2-5':'data-cloud-set','path8-7-2-2-8-1-1-6-6-3-1-0-2':'data-get-cloud','path8-7-2-2-8-1-1-1-3-6-7-2-4-0':'data-output','path75-0-1-9-36':'state-before','path75-0-1-9-3-8':'state-after','path75-0-1-9-8-9-8-25-8':'state-middle','path75-0-1-9-8-9-8-25-8-4':'through-data'},
   wire:{'path8-7-2-2-8-1-1-6-6-3-1-03-8':'data-input','path8-7-2-2-8-1-1-1-3-6-7-2-5-0':'data-cloud-set','path8-7-2-2-8-1-1-6-6-3-1-0-2-2':'data-get-cloud','path8-7-2-2-8-1-1-1-3-6-7-2-4-0-2':'data-output','path75-0-1-9-36-1':'state-before','path75-0-1-9-3-8-2':'state-after','path75-0-1-9-8-9-8-25-8-3-7':'state-middle','path75-0-1-9-8-9-8-25-8-77-5':'through-data'}
  };
  for(const p of items)p.role=maps[name][p.source]||p.role||'native-'+p.source;
  const duplicate=items.map(p=>p.role).filter((r,i,a)=>a.indexOf(r)!==i);if(duplicate.length)throw new Error('Duplicate native roles '+name+': '+duplicate.join(','));
  return items;
 }
 const snapshots=Object.fromEntries(frameNames.map(name=>[name,snapshot(name)]));
 const overlay=document.createElementNS(ns,'g');overlay.id='contracts-native-motion';svg.append(overlay);
 const motionDefs=document.createElementNS(ns,'defs');overlay.append(motionDefs);
 const diagnostics={nativeLeaves:Object.fromEntries(frameNames.map(n=>[n,snapshots[n].length])),exactPaths:0,sampledPaths:0};
 const records=new Map();
 for(const name of frameNames)for(const p of snapshots[name])if(!records.has(p.role)){
  const node=document.createElementNS(ns,p.kind);node.id='contracts-object-'+p.role;node.dataset.morphRole=p.role;overlay.append(node);records.set(p.role,{node,marker:null});
 }
 function markerFor(record,p,q,t){
  const parse=v=>v&&v!=='none'?v.match(/#([^)"]+)/)?.[1]:null,a=parse(p.paint.marker),b=parse(q.paint.marker),id=t<.5?a:b;if(!id){record.node.removeAttribute('marker-end');return}
  if(!record.marker||record.marker.dataset.source!==id){if(record.marker)record.marker.remove();const original=document.getElementById(id),marker=original.cloneNode(true);marker.id=record.node.id+'-arrow';marker.dataset.source=id;for(const child of marker.querySelectorAll('[id]'))child.removeAttribute('id');motionDefs.append(marker);record.marker=marker;}
  const original=document.getElementById(id),left=a?document.getElementById(a):original,right=b?document.getElementById(b):original;for(const attr of ['markerWidth','markerHeight'])record.marker.setAttribute(attr,mix(+left.getAttribute(attr)*p.scale,+right.getAttribute(attr)*q.scale,t));record.node.setAttribute('marker-end','url(#'+record.marker.id+')');
 }
 function paint(record,a,b,t,opacity){
  const n=record.node,x=a.paint,y=b.paint;
  n.setAttribute('fill',t<.5?x.fill:y.fill);n.setAttribute('stroke',t<.5?x.stroke:y.stroke);
  n.setAttribute('fill-opacity',mix(x.fillOpacity,y.fillOpacity,t));n.setAttribute('stroke-opacity',mix(x.strokeOpacity,y.strokeOpacity,t));n.setAttribute('stroke-width',mix(x.strokeWidth,y.strokeWidth,t));n.setAttribute('stroke-linejoin','round');n.style.opacity=opacity;
  const dash=t<.5?x.dash:y.dash,scale=t<.5?a.scale:b.scale;n.setAttribute('stroke-dasharray',dash==='none'?'none':dash.replace(/[\d.]+/g,v=>String(+v*scale)));
  markerFor(record,a,b,t);
 }
 function nativeMorph(from,to,t){
  for(const name of frameNames)show('native-'+name,false);show(overlay,true);
  const source=snapshots[from],dest=snapshots[to],aa=new Map(source.map(p=>[p.role,p])),bb=new Map(dest.map(p=>[p.role,p]));
  const unfolding=(from==='loop'&&to==='unfolded')||(from==='unfolded'&&to==='loop');
  const u=from==='loop'?t:1-t,arc=unfolding?82*Math.sin(Math.PI*u):0;
  // A small clearance trajectory is necessary because the original get
  // changes order with the original cloud/set. It changes no endpoint art.
  const order=[...source.filter(p=>!bb.has(p.role)),...dest];
  for(const p of order){
   const record=records.get(p.role),a=aa.get(p.role),b=bb.get(p.role),x=a||b,y=b||a,n=record.node;
   overlay.append(n);let opacity=a&&b?1:a?1-t:t;
   if(unfolding&&p.role.startsWith('delay-'))opacity=clamp(1-u*3);
   show(n,opacity>.0001);paint(record,x,y,t,opacity);
   if(p.kind==='text'){
    n.textContent=x.content;n.setAttribute('font-family',x.font);n.setAttribute('font-weight',x.weight);n.setAttribute('text-anchor',x.anchor);
    for(const key of ['x','y'])n.setAttribute(key,mix(x.geometry[key],y.geometry[key],t)+(key==='y'&&p.role.startsWith('get-')?arc:0)+(key==='x'&&unfolding&&p.role==='get-label'?20*Math.sin(Math.PI*u)-60*Math.sin(2*Math.PI*u):0));n.setAttribute('font-size',mix(x.geometry.fontSize,y.geometry.fontSize,t));
   }else if(p.kind==='rect'||p.kind==='circle'){
    for(const key of Object.keys(x.geometry)){let value=mix(x.geometry[key],y.geometry[key],t);if((key==='y'||key==='cy')&&p.role.startsWith('get'))value+=arc;
     if(!b&&to==='wire'&&['set','get'].includes(p.role)){if(key==='height')value*=1-t;if(key==='y')value+=x.geometry.height*t/2;}
     if(!a&&from==='wire'&&['set','get'].includes(p.role)){if(key==='height')value*=t;if(key==='y')value+=y.geometry.height*(1-t)/2;}
     n.setAttribute(key,value);
    }
   }else{
    const compatible=x.parts.length===y.parts.length&&x.parts.every((v,i)=>v.cmd===y.parts[i].cmd&&v.v.length===y.parts[i].v.length);
    if(compatible&&!arc){n.setAttribute('d',pathString(x.parts.map((v,i)=>({cmd:v.cmd,v:v.v.map((z,j)=>mix(z,y.parts[i].v[j],t))}))));}
    else{
     const points=x.points.map((v,i)=>[mix(v[0],y.points[i][0],t),mix(v[1],y.points[i][1],t)]);
     if(arc){const shift=p.role==='data-get-cloud'||p.role==='state-after'?'start':p.role==='state-middle'?'end':null;if(shift)points.forEach((v,i)=>v[1]+=arc*(shift==='start'?1-i/127:i/127));}
     n.setAttribute('d',points.map((v,i)=>(i?'L':'M')+v.map(z=>z.toFixed(4)).join(' ')).join(' ')+(x.closed||y.closed?' Z':''));
    }
   }
  }
  for(const [role,record] of records)if(!aa.has(role)&&!bb.has(role))show(record.node,false);
  for(const record of extras.values())show(record.node,false);
  if(unfolding){
   const loop=new Map(snapshots.loop.map(p=>[p.role,p])),unfold=new Map(snapshots.unfolded.map(p=>[p.role,p]));
   const port=role=>{const a=loop.get(role),b=unfold.get(role),p=a.geometry,q=b.geometry;return [mix(p.x+p.width/2,q.x+q.width/2,u),mix(p.y+p.height/2,q.y+q.height/2,u)+(role.startsWith('get-')?arc:0)]};
   const currentCloud=(()=>{const a=loop.get('cloud-t').size,b=unfold.get('cloud-t').size;return {x:mix(a.x,b.x,u),y:mix(a.y,b.y,u),w:mix(a.w,b.w,u),h:mix(a.h,b.h,u)}})();
   const cloudSource=loop.get('cloud-t').size;
   const nativePoints=(points,start,end)=>{const first=points[0],last=points[points.length-1];return points.map((p,i)=>{const v=i/(points.length-1);return [p[0]+(start[0]-first[0])*(1-v)+(end[0]-last[0])*v,p[1]+(start[1]-first[1])*(1-v)+(end[1]-last[1])*v]})};
   const draw=(record,points)=>record.node.setAttribute('d',points.map((p,i)=>(i?'L':'M')+p.map(v=>v.toFixed(4)).join(' ')).join(' '));
   const extra=(role,original)=>{if(!extras.has(role)){const node=document.createElementNS(ns,'path');node.id='contracts-object-'+role;overlay.insertBefore(node,records.get('cloud-t').node);extras.set(role,{node,marker:null})}const record=extras.get(role);show(record.node,true);return record};
   for(const [role,portRole] of [['data-get-cloud','get-R-D'],['state-after','get-R-S']]){
    const a=loop.get(role),b=unfold.get(role),start=port(portRole),end=a.points[a.points.length-1];
    const oldEnd=role==='data-get-cloud'?[currentCloud.x+(end[0]-cloudSource.x),currentCloud.y+(end[1]-cloudSource.y)]:port('set-L-S');
    const old=extra('unfold-old-'+role,a);paint(old,a,a,0,1-clamp(u*3));draw(old,nativePoints(a.points,start,oldEnd));
    const next=records.get(role);paint(next,b,b,1,clamp((u-.15)/.85));draw(next,nativePoints(b.points,start,b.points[b.points.length-1]));
   }
   // Unfold the two native feedback segments as one continuous state thread.
   // Its endpoints remain attached to the original moving state ports.
   const a=loop.get('state-middle'),tail=loop.get('feedback-return'),b=unfold.get('state-middle'),joined=[...a.points,...tail.points];
   const points=joined.map((p,i)=>{const v=i/(joined.length-1),j=v*127,k=Math.floor(j),z=j-k,q=b.points[Math.min(127,k+1)].map((w,c)=>mix(b.points[k][c],w,z));return p.map((w,c)=>mix(w,q[c],u))});
   const thread=extra('unfold-state-thread',a);paint(thread,a,b,u,1);draw(thread,nativePoints(points,port('set-R-S'),port('get-L-S')));show(records.get('state-middle').node,false);show(records.get('feedback-return').node,false);
   const input=records.get('data-input'),inputNative=unfold.get('data-input'),last=inputNative.points[inputNative.points.length-1],cloudDest=unfold.get('cloud-t').size;draw(input,nativePoints(inputNative.points,inputNative.points[0],[currentCloud.x+last[0]-cloudDest.x,currentCloud.y+last[1]-cloudDest.y]));
  }
  root.dataset.morphProgress=String(t);
 }
 const extras=new Map();
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done()}busy=false;render()}
 async function go(target=0,animate=true){
  target=Math.max(0,Math.min(7,Math.round(target)));if(busy&&animate)return;const previous=step;cancel();step=target;
  if(!animate||Math.abs(previous-target)!==1||Math.min(previous,target)<3||Math.max(previous,target)>6||matchMedia('(prefers-reduced-motion: reduce)').matches){render();return}
  busy=true;const token=++generation,from=sceneNames[previous],to=sceneNames[target];
  await new Promise(resolve=>{resolveMotion=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const raw=clamp((now-start)/600),q=raw*raw*(3-2*raw);nativeMorph(from,to,q);root.dataset.morphProgress=String(raw);if(raw<1)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve()}}raf=requestAnimationFrame(tick)});
  if(token===generation){busy=false;render()}
 }
 function previewMorph(from,to,t){cancel();step=from;render();step=to;nativeMorph(sceneNames[from],sceneNames[to],clamp(t));}
 document.addEventListener('keydown',event=>{if(!busy||!root.classList.contains('active')||event.key.toLowerCase()!=='r'||['INPUT','TEXTAREA'].includes(event.target.tagName)||event.target.isContentEditable)return;event.preventDefault();event.stopImmediatePropagation();const deck=window.defenseDeck;deck.go(deck.getState().slide,0,false)},true);
 render();const api={go,cancel,leave:cancel,restart:()=>go(0,false),states,previewMorph,getState:()=>({step,busy,count:8,duration:600,nativeObjects:true,diagnostics})};root.contractsController=api;return api;
};
