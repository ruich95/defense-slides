window.slideFactories.future_work = () => {
  const root = document.getElementById('future_work');
  const states = [{name: 'Four future-work directions'}];
  function go() {
    root.dataset.state = '1';
    return Promise.resolve();
  }
  go();
  return {go, states, getState: () => ({step: 0, busy: false, count: 1})};
};
