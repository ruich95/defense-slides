window.slideFactories.aeic25 = () => {
 const root = document.getElementById('aeic25');
 const items = [...root.querySelectorAll('[data-aeic25-reveal]')];
 const first = root.querySelector('#aeic25-first-approach');
 const source = '\n\nSource: final/AEiC-26.pptx, slide 25. Thesis Chapter 5 introduction, §5.1 and §5.2.1–2, printed pp. 140–144. The seven source paragraph clicks are retained. Here abstract interpretation means the thesis’s tagless-final mechanism for interpreting a model into another model; do not assume a lattice-based static analysis. Well-typedness alone does not establish behavioural equivalence.';
 const states = [
  {name:'Changing the model', note:'So far, we have kept the model fixed and changed its interpretation. Design also involves changing the model itself.'},
  {name:'Abstract interpretations', note:'One route uses an interpretation that produces another model.'},
  {name:'Idris2 functions', note:'Another uses the host language to compute the types and terms from which a model is built.'},
  {name:'Focus on Idris2 functions', note:'For the next example, I will focus on the second route. The first route remains available; dimming it selects the present focus.'},
  {name:'Balance-tree transformation', note:'The balance-tree transformation uses these capabilities to change the structure of a reducer.'},
  {name:'Well-formed models', note:'Typing keeps the constructed model within the permitted component discipline. This alone does not establish behavioural equivalence.'},
  {name:'Type-aware construction', note:'A reducer can be generated from the shape of its input type.'},
  {name:'Functions that compute types', note:'Because types can themselves be computed, we can change that shape and reconstruct the reducer.\n\nTransition: Let us first see how the input type controls a reducer.'}
 ].map(state => ({...state, note:state.note + source}));
 let step = 0;
 function render() {
  for (const item of items) {
   const visible = step >= Number(item.dataset.aeic25Reveal);
   item.style.opacity = visible ? '1' : '0';
   item.style.visibility = visible ? 'visible' : 'hidden';
   item.setAttribute('aria-hidden', String(!visible));
  }
  // Native held emphasis reports Infinity: store its endpoint, with no running timer.
  if (step >= 3) first.style.opacity = '0.25';
  root.dataset.state = String(step + 1);
 }
 function go(target) {
  step = Math.max(0, Math.min(states.length - 1, Math.round(target)));
  render();
  // Source entrances are 1 ms appearances, so settle immediately in either motion mode.
  return Promise.resolve();
 }
 function cancel() {} // No pending animation frames or timers to cancel.
 render();
 const api = {go, cancel, leave:cancel, states, getState:() => ({step, busy:false, count:states.length})};
 root.aeic25Controller = api;
 return api;
};
