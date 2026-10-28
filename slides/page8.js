window.slideFactories.page8=()=>{
 const root=document.getElementById('page8'),moving=root.querySelector('.page8-start-pyramid'),source=moving.querySelector('svg'),layer=source.querySelector('[id$="pyramid-layer1"]'),figure=root.querySelector('.page8-framework'),opening=root.querySelector('.page8-opening'),items=[...root.querySelectorAll('[data-page8-reveal]')];
 const states=[
  {name:'Locate the framework in the design process',note:'To address the research question and objectives, we propose the framework SynQ for synchronous system design, grounded in Quantitative Type Theory (QTT) and embedded in Idris2.\n\nSynQ — Synchronous System Design with Quantitative Types. Idris2 provides the programming language through which we use Quantitative Type Theory. Let us locate the part of the design process that the framework addresses.\n\nPresenter guidance: Entry waits for input. The opening statement, expanded-name footnote, and full unlabelled pyramid remain visible until the first click. Distinguish the application domain, theoretical foundation, and host language.'},
  {name:'Hold the section within modelling',note:'We select a cross-section inside the modelling region. Everything above this section, including the upper slice of modelling, fades away. The retained region stays at its original size.\n\nPresenter guidance: The first click takes 700 ms: the contained elliptical section fades in over 0–150 ms, gives one gentle emphasis over 150–450 ms, then the upper portion fades over 450–700 ms. No movement, lift or deformation occurs. Hold the green top face indefinitely until the next click.'},
  {name:'Focus within the modelling region',note:'We now focus on modelling, interpretations, and design operations within this retained part of the process. Within it, SynQ occupies a more specific modelling region inside Idris2.\n\nPresenter guidance: The second click moves and scales the retained portion into the exact empty Figure 1.5 shell over 500 ms. The intermediate Other DSLs/IRs surface remains present. No capability appears automatically. Both opening text elements stay fixed; type-encoded properties appear in the final capability reveal.'},
  {name:'Modelling · O1 and O3',note:'We construct SynQ models using Idris2 terms and functions. The black arrows are Idris2 functions whose results lie in SynQ, although their inputs and intermediate terms may lie outside SynQ. This uses Idris2’s expressiveness for accessible modelling (O3), while SynQ supports synchronous systems with stateful, black-box components (O1).'},
  {name:'Design steps: transformations · O2',note:'Recall page 3: within an abstraction level, design steps transform models. The red dashed arrow shows transformations within SynQ, expressed as Idris2 functions, either directly or through other Idris2 terms as intermediate results. Their execution and formal treatment address O2.\n\nPresenter guidance: Reveal the whole Design steps sentence together with the red arrow. Emphasize transformations; interpretations is already visible in the same sentence.'},
  {name:'Design steps: interpretations · O2',note:'Recall page 3: across abstraction levels, interpretations provide refinement or implementation. The blue dashed connections interpret SynQ models into other DSLs and intermediate representations or into implementations. These interpretations are also Idris2 functions, so transformations and interpretations share the same host language and address O2. The projection is schematic.\n\nPresenter guidance: Shift emphasis to interpretations in the existing Design steps sentence while revealing the blue connections and their target representations. Keep every word and its position unchanged.'},
  {name:'Properties · O2',note:'Types express properties of models and design operations, supporting specification and verification alongside executable operations (O2). This overview does not imply that every property or design step has already been verified.'}
 ].map(s=>({...s,note:s.note+'\n\nScope: “Partial” qualifies the framework’s scope and completeness; this is not a claim of universal automation or end-to-end verification.\n\nArtwork: thesis Figure 1.5, figures/svg/SynQ-abstraction-level-overview.svg. Its modelling, Other DSLs/IRs, and implementation surfaces retain their source geometry and paint order in a namespaced copy. The initial full pyramid uses the exact empty source and stage geometry from pages 3–4, with all initial pyramid text removed only in this page’s imported copy.'}));
 const clamp=x=>Math.max(0,Math.min(1,x)),mix=(a,b,t)=>a+(b-a)*t,ease=x=>x*x*(3-2*x),reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const ns='http://www.w3.org/2000/svg',cutDuration=700,focusDuration=500,cutFraction=.35;
 let step=0,busy=false,generation=0,raf=0,resolveMotion=null,geometry=null,transition=null,transitionElapsed=0;
 const find=id=>source.querySelector('[id="p8-start-pyramid-'+id+'"]');
 function alpha(node,value){node.style.opacity=value;node.style.visibility=value>0?'visible':'hidden';node.setAttribute('aria-hidden',String(value===0))}
 function reveals(from,to,t){root.dataset.page8Emphasis=to===4?'transformations':to===5?'interpretations':'';for(const node of items){const at=+node.dataset.page8Reveal;alpha(node,mix(from>=at?1:0,to>=at?1:0,t))}}
 function element(tag,attrs={},parent=source){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);parent.append(n);return n}
 // Duplicate only the imported source layer. Every copied ID/reference is
 // renamed; clips partition the actual artwork, including the upper modelling
 // slice, rather than treating the specification boundary as the cut.
 function copyLayer(prefix,parent){const copy=layer.cloneNode(true),nodes=[copy,...copy.querySelectorAll('*')],ids=new Map(nodes.filter(n=>n.id).map(n=>[n.id,prefix+n.id]));
  for(const n of nodes)for(const a of [...n.attributes]){let v=a.value;if(a.name==='id')v=ids.get(v);else for(const [old,id] of ids){v=v.replaceAll('url(#'+old+')','url(#'+id+')');if(v==='#'+old)v='#'+id}a.namespaceURI?n.setAttributeNS(a.namespaceURI,a.name,v):n.setAttribute(a.name,v)}parent.append(copy);return copy;
 }
 const defs=element('defs'),upperClip=element('clipPath',{id:'p8-upper-cut-clip',clipPathUnits:'userSpaceOnUse'},defs),lowerClip=element('clipPath',{id:'p8-lower-cut-clip',clipPathUnits:'userSpaceOnUse'},defs);
 const upperClipPath=element('path',{},upperClip),lowerClipPath=element('path',{},lowerClip);
 const upperMotion=element('g',{id:'p8-upper-cut-motion'}),lowerMotion=element('g',{id:'p8-lower-cut-motion'});
 const upperCopy=copyLayer('p8-upper-',upperMotion),lowerCopy=copyLayer('p8-lower-',lowerMotion);
 upperCopy.setAttribute('clip-path','url(#p8-upper-cut-clip)');lowerCopy.setAttribute('clip-path','url(#p8-lower-cut-clip)');
 const capFaceGroup=element('g',{id:'p8-cross-section'},lowerMotion),capFace=element('ellipse',{id:'p8-retained-modelling-surface',stroke:'none','fill-opacity':'.5'},capFaceGroup);
 const rearRim=element('path',{id:'p8-section-rear-rim',fill:'none',stroke:'#000','stroke-width':'.9','stroke-dasharray':'2,2'},capFaceGroup);
 const rearSolid=element('path',{id:'p8-section-rear-solid',fill:'none',stroke:'#000','stroke-width':'.9'},capFaceGroup);
 const frontRim=element('path',{id:'p8-section-front-rim',fill:'none',stroke:'#000','stroke-width':'.9'},capFaceGroup);
 function setSection(row){const {cx,cy,rx,ry}=row;for(const k of ['cx','cy','rx','ry'])capFace.setAttribute(k,row[k]);const start=`M${cx-rx} ${cy} A${rx} ${ry} 0 0 `;frontRim.setAttribute('d',start+`0 ${cx+rx} ${cy}`);for(const rim of [rearRim,rearSolid])rim.setAttribute('d',start+`1 ${cx+rx} ${cy}`)}
 function rearExposure(amount){alpha(rearRim,1-amount);alpha(rearSolid,amount)}
 // Preserve command topology. Map source control points using the cut, middle,
 // and base ellipses; never interpolate unrelated SVG path strings. The upper
 // copy is excluded from these controls and remains completely undeformed.
 function commands(d){const tokens=d.match(/[a-z]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi)||[],out=[];let i=0,command='',x=0,y=0,sx=0,sy=0;
  while(i<tokens.length){if(/^[a-z]$/i.test(tokens[i]))command=tokens[i++];const relative=command===command.toLowerCase(),kind=command.toUpperCase();if(kind==='Z'){out.push(['Z']);x=sx;y=sy;continue}
   const count={M:2,L:2,H:1,V:1,C:6}[kind];if(!count)throw Error('Unsupported pyramid command: '+command);let values=tokens.slice(i,i+count).map(Number);i+=count;
   if(kind==='H')values=[values[0]+(relative?x:0),y];else if(kind==='V')values=[x,values[0]+(relative?y:0)];else for(let j=0;j<values.length;j+=2){values[j]+=relative?x:0;values[j+1]+=relative?y:0}
   out.push([['H','V'].includes(kind)?'L':kind,...values]);x=values.at(-2);y=values.at(-1);if(kind==='M'){sx=x;sy=y;command=relative?'l':'L'}
  }return out;
 }
 const originalPaths=[...lowerCopy.querySelectorAll('path')].filter(n=>getComputedStyle(n).display!=='none').map(node=>({node,d:node.getAttribute('d')}));
 const originalDisks=[...lowerCopy.querySelectorAll('ellipse')].filter(n=>getComputedStyle(n).display!=='none').map(node=>({node,...Object.fromEntries(['cx','cy','rx','ry'].map(k=>[k,+node.getAttribute(k)]))}));
 function prepareGeometry(){
  const reference=document.querySelector('#page4 .requirements-pyramid-region')||document.querySelector('#pyramid-region');if(reference){const css=getComputedStyle(reference);for(const k of ['left','top','width','height'])moving.style[k]=css[k]}
  const screen=layer.getScreenCTM(),inverse=screen.inverse(),point=(m,x,y)=>new DOMPoint(x,y).matrixTransform(m);
  function ellipseRow(node){const m=inverse.multiply(node.getScreenCTM()),cx=+node.getAttribute('cx'),cy=+node.getAttribute('cy'),c=point(m,cx,cy),r=point(m,cx+ +node.getAttribute('rx'),cy),b=point(m,cx,cy+ +node.getAttribute('ry'));return {cx:c.x,cy:c.y,rx:Math.abs(r.x-c.x),ry:Math.abs(b.y-c.y)}}
  function rimRow(node){const m=inverse.multiply(node.getScreenCTM()),a=node.getPointAtLength(0),b=node.getPointAtLength(node.getTotalLength()),p=point(m,a.x,a.y),q=point(m,b.x,b.y),box=node.getBBox(),top=point(m,box.x,box.y);return {cx:(p.x+q.x)/2,cy:(p.y+q.y)/2,rx:Math.abs(q.x-p.x)/2,ry:Math.abs(top.y-p.y)}}
  const top=ellipseRow(find('path1-1-0')),middle=ellipseRow(find('path1-1')),bottom=rimRow(find('path1-7-6'));
  const outline=find('path4').getAttribute('d').match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi).map(Number),[lx,ly,ax,ay,rx0,ry0]=outline;
  const cutY=mix(top.cy,middle.cy,cutFraction),cutLeft=mix(ax,lx,(cutY-ay)/(ly-ay)),cutRight=mix(ax,rx0,(cutY-ay)/(ry0-ay));
  // Use the actual side intersections for the horizontal radius, and the
  // source boundary ellipses for depth. The section's endpoints meet both sides.
  const cut={cx:(cutLeft+cutRight)/2,cy:cutY,rx:(cutRight-cutLeft)/2,ry:mix(top.ry,middle.ry,cutFraction)};
  const {cx,cy,rx,ry}=cut,L=cx-rx,R=cx+rx,margin=10000;
  // The front half of the new elliptical rim partitions the side surface.
  // A green top face is added to the retained lower section after separation.
  const front=`M${L} ${cy} A${rx} ${ry} 0 0 0 ${R} ${cy}`;
  upperClipPath.setAttribute('d',front+` L${margin} ${cy} L${margin} ${-margin} L${-margin} ${-margin} L${-margin} ${cy} Z`);
  lowerClipPath.setAttribute('d',front+` L${margin} ${cy} L${margin} ${margin} L${-margin} ${margin} L${-margin} ${cy} Z`);
  capFaceGroup.setAttribute('transform',layer.getAttribute('transform')||'');setSection(cut);
  capFace.setAttribute('fill',getComputedStyle(find('path2318')).fill);
  const target=id=>root.querySelector('#p8-figure-'+id),dst=[ellipseRow(target('path2549')),rimRow(target('path2549-2-2')),rimRow(target('path2549-2'))];
  const records=originalPaths.map(record=>{
   const {node}=record,matrix=inverse.multiply(node.getScreenCTM()),id=node.id;
   const d=id.endsWith('-path4')?`M${lx} ${ly} L${cutLeft} ${cut.cy} M${cutRight} ${cut.cy} L${rx0} ${ry0}`:record.d;
   const row=node.closest('[id$="-pyramid-g4"]')?2:node.closest('[id$="-pyramid-g4-1"]')?1:null;
   const band=id.endsWith('-path2318')?0:id.endsWith('-path2319')?1:null;
   // Source band fills contain tiny cut-outs for old dashed rims. Keep them
   // in the static source, but do not stretch those holes during focusing.
   const fittingD=band!==null?(d.match(/^[\s\S]*?[zZ]/)?.[0]||d):d;
   return {...record,d,commands:commands(fittingD),matrix,inverse:matrix.inverse(),row,band};
  });
  const disks=originalDisks.map(disk=>({...disk,matrix:inverse.multiply(disk.node.getScreenCTM()),row:disk.node.id.endsWith('-path1-1')?1:null}));
  geometry={cut,top,middle,src:[cut,middle,bottom],dst,records,disks,point,margin};
 }
 function fitPoint(p,amount,row=null,band=null){
  const {src,dst}=geometry;let x,y;
  if(row!==null){const a=src[row],b=dst[row];x=b.cx+(p.x-a.cx)*b.rx/a.rx;y=b.cy+(p.y-a.cy)*b.ry/a.ry}
  else if(band!==null){
   // Side fills meet the front rims rather than the ellipse centre lines.
   const a=src[band],b=src[band+1],c=dst[band],d=dst[band+1];let t=(p.y-a.cy)/(b.cy-a.cy),u=0,front=0;
   for(let i=0;i<5;i++){u=(p.x-mix(a.cx,b.cx,t))/mix(a.rx,b.rx,t);front=Math.sqrt(Math.max(0,1-u*u));t=(p.y-a.cy-a.ry*front)/(b.cy-a.cy+(b.ry-a.ry)*front)}
   x=mix(c.cx,d.cx,t)+u*mix(c.rx,d.rx,t);y=mix(c.cy,d.cy,t)+mix(c.ry,d.ry,t)*front;
  }
  else{const i=p.y<src[1].cy?0:1,a=src[i],b=src[i+1],c=dst[i],d=dst[i+1],t=(p.y-a.cy)/(b.cy-a.cy);x=mix(c.cx,d.cx,t)+(p.x-mix(a.cx,b.cx,t))*mix(c.rx,d.rx,t)/mix(a.rx,b.rx,t);y=mix(c.cy,d.cy,t)}
  return new DOMPoint(mix(p.x,x,amount),mix(p.y,y,amount));
 }
 function fitRetained(amount){
  const {records,disks,point,src,dst,margin}=geometry;
  for(const record of records){if(amount===0){record.node.setAttribute('d',record.d);continue}
   record.node.setAttribute('d',record.commands.map(([kind,...v])=>{const mapped=[];for(let i=0;i<v.length;i+=2){const p=fitPoint(point(record.matrix,v[i],v[i+1]),amount,record.row,record.band).matrixTransform(record.inverse);mapped.push(p.x,p.y)}return kind+mapped.join(' ')}).join(' '));
  }
  for(const disk of disks){const inverse=disk.matrix.inverse(),map=(x,y)=>fitPoint(point(disk.matrix,x,y),amount,disk.row).matrixTransform(inverse),c=map(disk.cx,disk.cy),r=map(disk.cx+disk.rx,disk.cy),b=map(disk.cx,disk.cy+disk.ry);for(const [k,v] of Object.entries({cx:c.x,cy:c.y,rx:Math.abs(r.x-c.x),ry:Math.abs(b.y-c.y)}))disk.node.setAttribute(k,v)}
  const cut=Object.fromEntries(['cx','cy','rx','ry'].map(k=>[k,mix(src[0][k],dst[0][k],amount)])),{cx,cy,rx,ry}=cut;
  setSection(cut);
  lowerClipPath.setAttribute('d',`M${cx-rx} ${cy} A${rx} ${ry} 0 0 0 ${cx+rx} ${cy} L${margin} ${cy} L${margin} ${margin} L${-margin} ${margin} L${-margin} ${cy} Z`);
 }
 function resetArtwork(){
  for(const {node,d} of originalPaths)node.setAttribute('d',d);
  for(const disk of originalDisks)for(const k of ['cx','cy','rx','ry'])disk.node.setAttribute(k,disk[k]);
  upperMotion.removeAttribute('transform');lowerMotion.removeAttribute('transform');capFaceGroup.style.filter='none';capFace.setAttribute('fill-opacity','.5');rearExposure(0);alpha(upperMotion,0);alpha(lowerMotion,0);alpha(capFaceGroup,0);alpha(layer,1);
 }
 function showRetained(){alpha(layer,0);alpha(upperMotion,0);alpha(lowerMotion,1);alpha(capFaceGroup,1);rearExposure(1);alpha(moving,1);alpha(figure,0);alpha(opening,1)}
 function settled(target){
  resetArtwork();transition=null;transitionElapsed=0;root.dataset.transitionElapsed='0';alpha(opening,1);
  if(target===0){root.dataset.page8Mode='full';alpha(moving,1);alpha(figure,0)}
  else if(target===1){prepareGeometry();fitRetained(0);showRetained();root.dataset.page8Mode='held-cut'}
  else{root.dataset.page8Mode='focused';alpha(moving,0);alpha(figure,1)}
  reveals(target,target,1);
 }
 function renderCut(ms){
  transition='cut';transitionElapsed=ms;root.dataset.page8Mode='cut-transition';root.dataset.transitionElapsed=String(ms);
  const appear=ease(clamp(ms/150)),pulse=ms>=150&&ms<=450?Math.sin(Math.PI*(ms-150)/300):0,remove=ease(clamp((ms-450)/250));
  alpha(layer,0);alpha(upperMotion,1-remove);alpha(lowerMotion,1);alpha(moving,1);alpha(figure,0);alpha(opening,1);
  fitRetained(0);alpha(capFaceGroup,appear);rearExposure(remove);capFace.setAttribute('fill-opacity',String(.2+.06*pulse+.3*remove));capFaceGroup.style.filter=`brightness(${1+.12*pulse})`;reveals(-1,-1,1);
 }
 function renderFocus(ms){
  transition='focus';transitionElapsed=ms;root.dataset.page8Mode='focus-transition';root.dataset.transitionElapsed=String(ms);
  const fit=ease(clamp(ms/450)),cross=ease(clamp((ms-450)/50));
  showRetained();capFaceGroup.style.filter='none';capFace.setAttribute('fill-opacity','.5');fitRetained(fit);alpha(moving,1-cross);alpha(figure,cross);reveals(-1,-1,1);
 }
 function renderRestore(ms){
  const t=ease(clamp(ms/250));transition='restore';transitionElapsed=ms;root.dataset.page8Mode='restore-transition';root.dataset.transitionElapsed=String(ms);
  showRetained();fitRetained(0);alpha(upperMotion,t);rearExposure(1-t);alpha(capFaceGroup,1-t);reveals(-1,-1,1);
 }
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done(false)}busy=false;transition=null}
 function motion(milliseconds,draw,token){return new Promise(resolve=>{resolveMotion=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const elapsed=Math.min(milliseconds,now-start);draw(elapsed);if(elapsed<milliseconds)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve(true)}}raf=requestAnimationFrame(tick)})}
 async function go(target,animate=true){cancel();const token=++generation,from=step;step=Math.max(0,Math.min(states.length-1,Math.round(target)));busy=true;
  if(animate&&from!==step&&!reduced()){
   if(from===0&&step===1){resetArtwork();prepareGeometry();renderCut(0);await motion(cutDuration,renderCut,token)}
   else if(from===1&&step===2){resetArtwork();prepareGeometry();renderFocus(0);await motion(focusDuration,renderFocus,token)}
   else if(from===2&&step===1){resetArtwork();prepareGeometry();renderFocus(focusDuration);await motion(focusDuration,t=>renderFocus(focusDuration-t),token)}
   else if(from===1&&step===0){resetArtwork();prepareGeometry();renderRestore(0);await motion(250,renderRestore,token)}
   else if(from>=2&&step>=2){alpha(moving,0);alpha(figure,1);alpha(opening,1);reveals(from,step,0);await motion(225,t=>reveals(from,step,ease(t/225)),token)}
  }
  if(token===generation){settled(step);busy=false}
 }
 function previewTransition(kind,ms){cancel();resetArtwork();prepareGeometry();if(kind==='cut'){step=1;renderCut(Math.max(0,Math.min(cutDuration,ms)))}else if(kind==='focus'){step=2;renderFocus(Math.max(0,Math.min(focusDuration,ms)))}else throw Error('Unknown opening transition: '+kind)}
 // Entry waits. The first click sections/removes; the second focuses. No
 // capability appears until a later, independent click.
 settled(0);
 const api={go,cancel,leave:cancel,states,previewTransition,resize:()=>{},getState:()=>({step,busy,count:states.length,transition,transitionElapsed,cutFraction})};root.page8Controller=api;return api;
};
