/* Author-time native SVG sampler. Runtime decks use the checked-in packed results.
   Usage: node tools/precompute-morph-geometry.cjs [playwright-module] [browser-executable]
   Regenerate after editing an input animation. build.py checks its fingerprint. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require(process.argv[2]||'playwright');
const deck=path.resolve(__dirname,'..'),sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
// Equivalent Windows/Unix checkouts share one geometry fingerprint.
const sourceSha=bytes=>sha(Buffer.from(bytes.toString('utf8').replace(/\r\n?/g,'\n')));
async function prepare(data,scene){
 const ns='http://www.w3.org/2000/svg',root=document.createElement('div');root.id=scene;document.body.append(root);
 const box=s=>({x:s.left,y:s.top,width:s.width*s.scale,height:s.height*s.scale});
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

 function exactCompatible(aUri,bUri){
  const parse=uri=>new DOMParser().parseFromString(atob(uri.split(',')[1]),'image/svg+xml').documentElement;
  const a=parse(aUri),b=parse(bUri),aa=[a,...a.querySelectorAll('*')],bb=[b,...b.querySelectorAll('*')];
  if(aa.length!==bb.length||aa.some((n,i)=>n.tagName!==bb[i].tagName))return false;
  const pattern=/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi;
  for(let i=0;i<aa.length;i++)for(const name of new Set([...aa[i].attributes,...bb[i].attributes].map(n=>n.name))){
   if(['id','xmlns','xmlns:xlink','width','height'].includes(name)&&i===0||name==='id')continue;
   const x=aa[i].getAttribute(name),y=bb[i].getAttribute(name);if(x===y)continue;
   if(['fill','stroke','stroke-dasharray'].includes(name))continue;
   if(x!==null&&y!==null&&x.replace(pattern,'#').replace(/[\s,]/g,'')===y.replace(pattern,'#').replace(/[\s,]/g,'')){
    if((x.match(pattern)||[]).length!==(y.match(pattern)||[]).length)return false;
   }else if(name==='d'||name==='transform')return false;
  }
  return true;
 }
 const matches={},coordinates=[];let exact=0;
 const paint=v=>v?Object.fromEntries(['fill','stroke','fillOpacity','strokeOpacity','strokeWidth'].map(k=>[k,v[k]])):null;
 const packedPaths = new Map();
 const pack = points => {
  const deduplicate = scene === 'page17' || scene === 'page20';
  const key = deduplicate ? points.flat().join(',') : null;
  if (deduplicate && packedPaths.has(key)) return packedPaths.get(key);
  const offset = coordinates.length;
  for (const [x,y] of points) coordinates.push(x,y);
  if (deduplicate) packedPaths.set(key,offset);
  return offset;
 };
 // The detector's morph is between two internal scenes on the same page.
 const morph = scene === 'page20' ? data.internal : data.morph;
 const shapes = scene === 'page20' ? data.scenes.structure.shapes : data.shapes;
 for(const m of morph.matches){
  if(!m.vectorMorph)continue;const dest=shapes.find(s=>s.id===m.targetId);
  if(scene!=='page15'&&exactCompatible(m.source.uri,dest.uri)){exact++;continue}
  const from=sample(m.source.uri,m.box),to=sample(dest.uri,box(dest)),used=new Set(),pairs=[];
  for(const a of from){let index=-1,best=Infinity;for(let j=0;j<to.length;j++){if(used.has(j))continue;const b=to[j];const cost=(a.kind===b.kind?0:3)+(a.fill===b.fill?0:1)+Math.hypot(a.parts[0].points[0][0]-b.parts[0].points[0][0],a.parts[0].points[0][1]-b.parts[0].points[0][1]);if(cost<best){best=cost;index=j}}
   const b=index<0?null:to[index];if(b)used.add(index);pairs.push({a,b});
  }
  for(let j=0;j<to.length;j++)if(!used.has(j))pairs.push({a:null,b:to[j]});
  matches[m.sourceId]=pairs.map(v=>{
   const registerWire = scene !== 'page15' && /^!!(?:Get|Set)/.test(m.sourceName);
   const ribbon = registerWire && (scene === 'page20'
      ? Boolean(v.a && v.b) : v.a?.parts.length===2 && v.b?.parts.length===2);
   const a=v.a||v.b,b=v.b||v.a,parts=[];
   for(let i=0;i<Math.max(a.parts.length,b.parts.length);i++){
    const aa=a.parts[i],bb=b.parts[i],collapsed=p=>({points:Array.from({length:192},()=>p.points[0]),closed:p.closed});const x=aa||collapsed(bb),y=bb||collapsed(aa);
    if (ribbon && i === 0) {
     // Detector connectors may be stroked paths. Filled ribbons supply a centerline.
     const start = scene === 'page20' && a.stroke !== 'none' ? x.points : x.centerline;
     const end = scene === 'page20' && b.stroke !== 'none' ? y.points : y.centerline;
     parts.push({a:pack(start), b:pack(end), closed:false, ribbon:true});
    } else {
     parts.push({a:pack(x.points), b:pack(align(x.points,y.points,x.closed&&y.closed)), closed:x.closed||y.closed});
    }
   }
   return {a:paint(v.a),b:paint(v.b),parts,...(ribbon?{ribbon:true}:{})};
  });
 }
 root.remove();return {matches,coordinates,exact};
}
(async()=>{
 const options={headless:true};if(process.argv[3])options.executablePath=process.argv[3];else options.channel='msedge';
 const browser=await chromium.launch(options);
 try{
  const page=await browser.newPage({viewport:{width:1600,height:960},offline:true});
  await page.setContent('<!doctype html><html><body></body></html>');
  await page.addStyleTag({content:fs.readFileSync(path.join(deck,'shared/styles.css'),'utf8')});
  await page.addScriptTag({content:'window.prepare='+prepare.toString()});
  for(const scene of ['page15','page16','page17','page20']){
   const input=fs.readFileSync(path.join(deck,'assets',scene,'animation.json'));
   const result=await page.evaluate(({data,scene})=>window.prepare(data,scene),{data:JSON.parse(input),scene});
   const binary=Buffer.allocUnsafe(result.coordinates.length*8);result.coordinates.forEach((v,i)=>binary.writeDoubleLE(v,i*8));
   const cache={schema:1,inputSha256:sourceSha(input),compilerSha256:sourceSha(fs.readFileSync(__filename)),coordinateFormat:'little-endian float64 xy; 192 points per part',coordinates:binary.toString('base64'),matches:result.matches,exact:result.exact};
   const output=path.join(deck,'assets',scene,'morph-geometry.json');fs.writeFileSync(output,JSON.stringify(cache)+'\n');
   console.log(scene+': '+Object.keys(cache.matches).length+' sampled matches, '+cache.exact+' exact SVG matches; '+fs.statSync(output).size+' bytes');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
