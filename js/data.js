/* exported data */

let data = {
  view: 'games',
  entries: [],
  nextEntryId: 1
};

const previousJSON = localStorage.getItem('javascript-local-storage');

if (previousJSON !== null) {
  data = JSON.parse(previousJSON);
}

window.addEventListener('beforeunload', handleBeforeUnload);

function handleBeforeUnload(event) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', dataJSON);
}
