/* Bake the receiver's invariant native geometry and constructed overlay nodes.
   node tools/precompute-receiver-morph.cjs [playwright-module] [browser-executable]
   This preserves the source SVG; the build rejects stale caches. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{pathToFileURL}=require('node:url');
const {chromium}=require(process.argv[2]||'playwright'),deck=path.resolve(__dirname,'..'),source=path.resolve(deck,'../figures/radio-to-fm/radio-to-fm.svg');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),sourceSha=b=>sha(Buffer.from(b.toString('utf8').replace(/\r\n?/g,'\n')));
function capture(){
 setup();const numbers=[];let next=0;
 function encode(value){
  if(value instanceof Element){if(!value.id)value.id='receiver-baked-'+(++next);return {$node:value.id}}
  if(value instanceof Map)return {$map:[...value].map(([k,v])=>[k,encode(v)])};
  if(Array.isArray(value)){
   if(value.length&&value.every(p=>Array.isArray(p)&&p.length===2&&p.every(x=>typeof x==='number'))){const offset=numbers.length;for(const p of value)numbers.push(...p);return {$points:[offset,value.length]}}
   return value.map(encode);
  }
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,encode(v)]));
  return value;
 }
 const graph=encode({records,expansion,sourceBox,finalBox,expandingFrame,sourceRadius,finalRadius,refinement,sequential});
 const overlays=Object.fromEntries(['morph','expand','refine','fir-sequentialisation'].map(id=>[id,$(id).innerHTML]));
 return {graph,overlays,numbers};
}
(async()=>{
 const options={headless:true};if(process.argv[3])options.executablePath=process.argv[3];else options.channel='msedge';const browser=await chromium.launch(options);
 try{
  const page=await browser.newPage({viewport:{width:1600,height:960},offline:true});
  // Reconstruct the original slide sizing context from editable sources only.
  await page.goto(pathToFileURL(path.join(deck,'slides/page2.html')).href);
  const slide=fs.readFileSync(path.join(deck,'slides/page2.html'),'utf8').replace(/@@[A-Z_]+@@/g,'');
  await page.setContent('<!doctype html><html><body><div id="viewport"><main id="stage">'+slide+'</main></div></body></html>');
  const assetBase=pathToFileURL(path.join(deck,'assets')).href+'/';
  await page.addStyleTag({content:fs.readFileSync(path.join(deck,'shared/styles.css'),'utf8').replaceAll('../assets/',assetBase)});
  await page.evaluate(()=>{document.getElementById('page2').classList.add('active');document.getElementById('stage').style.transform='translate(-50%,-50%) scale(1)'});
  await page.evaluate(()=>document.fonts.ready);
  const js=await page.evaluate(svgText=>{
   const svg=new DOMParser().parseFromString(svgText,'image/svg+xml').documentElement,script=svg.querySelector('script'),js=script.textContent;script.remove();
   svg.id='receiver-animation';for(const name of ['width','height','tabindex'])svg.removeAttribute(name);document.getElementById('receiver-region').append(svg);
   document.querySelectorAll('.slide').forEach(n=>n.classList.remove('active'));document.getElementById('page2').classList.add('active');
   return js;
  },fs.readFileSync(source,'utf8'));
  const start=js.indexOf("root.addEventListener('click',next);"),end=js.indexOf('notify();',start);
  const adapted=(js.slice(0,start)+js.slice(end)).replace('const root=document.currentScript.ownerSVGElement','const root=document.getElementById(\'receiver-animation\')').replace('root.radioMorph={go,','root.radioMorph={bake:'+capture.toString()+',go,');
  await page.addScriptTag({content:adapted});const result=await page.evaluate(()=>document.getElementById('receiver-animation').radioMorph.bake());
  const binary=Buffer.allocUnsafe(result.numbers.length*8);result.numbers.forEach((v,i)=>binary.writeDoubleLE(v,i*8));delete result.numbers;
  const cache={schema:1,sourceSha256:sourceSha(fs.readFileSync(source)),compilerSha256:sourceSha(fs.readFileSync(__filename)),fontSha256:sha(fs.readFileSync(path.join(deck,'assets/Figtree.ttf'))),coordinateFormat:'little-endian float64 xy',coordinates:binary.toString('base64'),...result};
  const output=path.join(deck,'assets/receiver/morph-geometry.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(cache)+'\n');console.log('Receiver geometry: '+fs.statSync(output).size+' bytes; '+binary.length+' packed coordinate bytes.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
