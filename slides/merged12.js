window.slideFactories.merged12=()=>{
 const root=document.getElementById('merged12'),sceneIds=["page12", "page13"],roots=sceneIds.map(id=>document.getElementById(id));
 // Sampling SVG correspondence requires a live, laid-out scene at construction time.
 roots.forEach(n=>n.classList.add('active'));
 const apis=sceneIds.map(id=>window.slideFactories[id]()),offsets=[0, 8];
 const states=apis.flatMap(api=>api.states),count=states.length;
 let step=0,busy=false,generation=0,raf=0,resolveMotion=null;
 const locate=s=>{let scene=0;while(scene+1<offsets.length&&s>=offsets[scene+1])scene++;return {scene,local:s-offsets[scene]}};
 function show(scene){roots.forEach((n,i)=>{n.classList.toggle('active',i===scene);n.setAttribute('aria-hidden',String(i!==scene))})}
 function cancel(){generation++;if(raf)cancelAnimationFrame(raf);raf=0;if(resolveMotion){const done=resolveMotion;resolveMotion=null;done()}apis.forEach(api=>api.cancel?.());busy=false}
 async function go(target,animate=true){
  const from=step;cancel();const token=++generation;step=Math.max(0,Math.min(count-1,Math.round(target)));const a=locate(from),b=locate(step);busy=true;
  const internalBoundary=Math.abs(step-from)===1&&a.scene!==b.scene;
  if(internalBoundary&&animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   const scene=Math.max(a.scene,b.scene),api=apis[scene],reverse=step<from,duration=750;
   show(scene);api.previewEntrance(reverse?duration:0);
   await new Promise(resolve=>{resolveMotion=resolve;const start=performance.now();function tick(now){if(token!==generation)return;const ms=Math.min(duration,now-start);api.previewEntrance(reverse?duration-ms:ms);if(ms<duration)raf=requestAnimationFrame(tick);else{raf=0;resolveMotion=null;resolve()}}raf=requestAnimationFrame(tick)});
  }else if(a.scene===b.scene){show(b.scene);await apis[b.scene].go(b.local,animate)}
  if(token!==generation)return;
  show(b.scene);await apis[b.scene].go(b.local,false);busy=false;
 }
 function previewBoundary(boundary,ms){cancel();const scene=boundary;show(scene);apis[scene].previewEntrance(ms)}
 show(0);const api={go,cancel,leave:cancel,states,previewBoundary,resize:()=>apis.forEach(a=>a.resize?.()),getState:()=>({step,busy,count,scene:locate(step).scene})};root.merged12Controller=api;return api;
};
