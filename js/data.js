/* exported data */

var data = {
  view: 'games',
  entries: [],
  editing: null,
  nextEntryId: 1
};

var previousJSON = localStorage.getItem('javascript-local-storage');

if (previousJSON !== null) {
  data = JSON.parse(previousJSON);
}

window.addEventListener('beforeunload', handleBeforeUnload);

function handleBeforeUnload(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', dataJSON);
}
