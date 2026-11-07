window.slideFactories.publications = () => {
  const root = document.getElementById('publications');
  const states = [{name: 'Publications and research support'}];
  function go() {
    root.dataset.state = '1';
    return Promise.resolve();
  }
  go();
  return {go, states, getState: () => ({step: 0, busy: false, count: 1})};
};
