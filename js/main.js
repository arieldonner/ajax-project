const gameList = [];

let descriptions = [];
let releases = [];
let genres = [];
let imgs = [];

const featured = [];
const searchedGames = [];

const $notesTitle = document.querySelector('.notes-title');
const $notesImg = document.querySelector('.notes-img');

const $deleteModal = document.querySelector('.delete-modal');
const $deleteCancel = document.querySelector('.delete-cancel');
const $deleteConfirm = document.querySelector('.delete-confirm');
let currentHeartId = 0;

const $emptyCodex = document.querySelector('.empty-codex');
const $noResults = document.querySelector('.no-results-div');

const $networkError = document.querySelectorAll('.error-div');

const $spinner = document.querySelectorAll('.spinner');

const randData = [];

/* Get featured games */
function getFeatured() {
  const targetUrl3 = encodeURIComponent('https://store.steampowered.com/api/featuredcategories');
  const proxyUrl = 'https://api.allorigins.win/get?url=' + targetUrl3;
  
  const xhr3 = new XMLHttpRequest();
  xhr3.open('GET', proxyUrl);
  xhr3.responseType = 'json';
  
  xhr3.addEventListener('load', function () {
    // AllOrigins returns a JSON object with a "contents" property that is a string.
    let apiResponse;
    try {
      apiResponse = JSON.parse(xhr3.response.contents);
    } catch (e) {
      console.error('Error parsing API response', e);
      $networkError[0].className = 'row error-div';
      return;
    }
    
    // Extract the featured games items from the API response
    const xhr3Response = apiResponse.specials.items;
    
    if (xhr3Response.length === 0) {
      $spinner[0].className = 'spinner hidden';
      $networkError[0].className = 'row error-div';
      return;
    }
    
    for (let i = 0; i < xhr3Response.length; i++) {
      createEntrySmall(xhr3Response[i]);
      const $sale = document.querySelectorAll('.button-sale');
      
      const values = {
        name: xhr3Response[i].name,
        img: xhr3Response[i].header_image,
        id: xhr3Response[i].id
      };
      featured.push(values);
      
      if (xhr3Response[i].discounted === false && $sale[i]) {
        $sale[i].className = 'button-sale hidden';
      }
      
      // Hide the spinner and any network error message
      $spinner[0].className = 'spinner hidden';
      $networkError[0].className = 'row error-div hidden';
    }
    
    const $featured = document.querySelectorAll('.featured-games');
    for (let f = 0; f < $featured.length; f++) {
      $featured[f].addEventListener('click', handleFeaturedTiles);
    }
  });
  
  xhr3.addEventListener('error', function () {
    $networkError[0].className = 'row error-div';
  });
  
  xhr3.send();
}
getFeatured();



/* Games Link */
const $games = document.querySelector('.nav-games');
$games.addEventListener('click', function (event) {
  handleView('featured');
  $search.value = '';
});

/* MyCodex Link */
const $myCodex = document.querySelector('.nav-codex');
$myCodex.addEventListener('click', function (event) {
  handleView('codex');
  $search.value = '';
});

if (data.entries.length === 0) {
  $emptyCodex.className = 'empty-codex';
}

/* Question Mark Icon */
const $question = document.querySelector('.fa-circle-question');
const $modal = document.querySelector('.container-modal');
$question.addEventListener('click', function (event) {
  $modal.className = 'container-modal';
});
const $close = document.querySelector('.fa-xmark');
$close.addEventListener('click', function (event) {
  $modal.className = 'container-modal hidden';
});

/* Random Icon */
const $random = document.querySelector('.fa-shuffle');
$random.addEventListener('click', function (event) {
  const $randLi = document.querySelector('.rand-game');
  if ($randLi === null) {
    getRandGame();
    $ulRand.addEventListener('click', handleHeartRand);
  } else {
    $randLi.remove();
    getRandGame();
    $ulRand.addEventListener('click', handleHeartRand);
  }
  handleView('random');
});

/* Search Bar */
const $search = document.querySelector('#search');

const $searchButton = document.querySelector('.button-search');
let gameCounter = 0;
let xhrResponses;

$search.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    handleSearch(event);
  }
});

/* Search when clicking the button */
$searchButton.addEventListener('click', handleSearch);

function handleSearch(event) {
  handleView('games');
  const targetUrl = encodeURIComponent('https://steamcommunity.com/actions/SearchApps/' + $search.value);
  const proxyUrl = 'https://api.allorigins.win/get?url=' + targetUrl;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', proxyUrl);
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    /* Removes games when searching again */
    for (let j = 0; j < gameList.length; j++) {
      gameList[j].remove();
      descriptions = [];
      releases = [];
      genres = [];
      imgs = [];
      gameCounter = 0;
    }

    let apiResponse;
    try {
      apiResponse = JSON.parse(xhr.response.contents);
    } catch (e) {
      console.error('Error parsing API response', e);
      $networkError[1].className = 'row error-div';
      return;
    }

    if (apiResponse.length === 0) {
      $spinner[1].className = 'spinner s-g hidden';
      $networkError[1].className = 'row error-div hidden';
      $noResults.className = 'row no-results-div';
    } else {
      $noResults.className = 'row no-results-div hidden';
      $networkError[1].className = 'row error-div hidden';
      xhrResponses = apiResponse;
      const appId = apiResponse[0].appid;
      getGameData(appId);
    }
  });

  xhr.addEventListener('error', function () {
    $networkError[1].className = 'row error-div';
  });

  xhr.send();
}

function getGameData(appId) {
  if (gameCounter >= xhrResponses.length || appId === undefined) {
    gameCounter = 0;
    xhrResponses = [];
    return;
  }

  const targetUrl2 = encodeURIComponent('https://store.steampowered.com/api/appdetails?appids=' + appId);
  const proxyUrl2 = 'https://api.allorigins.win/get?url=' + targetUrl2;

  const xhr2 = new XMLHttpRequest();
  xhr2.open('GET', proxyUrl2);
  xhr2.responseType = 'json';

  createEntry(xhrResponses[gameCounter]);

  xhr2.addEventListener('load', function () {
    let apiResponse;
    try {
      apiResponse = JSON.parse(xhr2.response.contents);
    } catch (e) {
      console.error('Error parsing API response', e);
      $networkError[1].className = 'row error-div';
      return;
    }

    gameCounter++;

    const $description = document.querySelectorAll('.description');
    descriptions.push(apiResponse[appId].data.short_description);

    const $release = document.querySelectorAll('.release');
    releases.push(apiResponse[appId].data.release_date.date);

    const $genre = document.querySelectorAll('.genre');
    genres.push(apiResponse[appId].data.genres[0].description);

    const $img = document.querySelectorAll('.search-img');
    imgs.push(apiResponse[appId].data.header_image);

    for (let i = 0; i < $description.length; i++) {
      $description[i].textContent = 'Description: ' + descriptions[i];
      $release[i].textContent = 'Release Date: ' + releases[i];
      $genre[i].textContent = 'Genre: ' + genres[i];
      $img[i].setAttribute('src', imgs[i]);
    }

    const values = {
      name: apiResponse[appId].data.name,
      img: apiResponse[appId].data.header_image,
      id: apiResponse[appId].data.steam_appid
    };
    searchedGames.push(values);

    if (gameCounter < xhrResponses.length) {
      getGameData(xhrResponses[gameCounter].appid);
    }
    $spinner[1].className = 'spinner s-g hidden';
    $networkError[1].className = 'row error-div hidden';
  });

  xhr2.addEventListener('error', function () {
    $networkError[1].className = 'row error-div';
  });

  xhr2.send();
}


/* Changes page view */
const $featuredContainer = document.querySelector('.featured-container');
const $gamesContainer = document.querySelector('.games-container');
const $codexContainer = document.querySelector('.codex-container');
const $notesContainer = document.querySelector('.notes-container');
const $editContainer = document.querySelector('.edit-container');
const $addGameContainer = document.querySelector('.addGame-container');
const $randomContainer = document.querySelector('.random-container');

function handleView(view) {
  data.view = view;
  if (view === 'games') {
    $featuredContainer.className = 'container featured-container hidden';
    $gamesContainer.className = 'container games-container';
    $codexContainer.className = 'container codex-container hidden';
    $notesContainer.className = 'container notes-container hidden';
    $editContainer.className = 'container edit-container hidden';
    $addGameContainer.className = 'container addGame-container hidden';
    $randomContainer.className = 'container random-container hidden';
  } else if (view === 'featured') {
    $featuredContainer.className = 'container featured-container';
    $gamesContainer.className = 'container games-container hidden';
    $codexContainer.className = 'container codex-container hidden';
    $notesContainer.className = 'container notes-container hidden';
    $editContainer.className = 'container edit-container hidden';
    $addGameContainer.className = 'container addGame-container hidden';
    $randomContainer.className = 'container random-container hidden';
  } else if (view === 'codex') {
    $featuredContainer.className = 'container featured-container hidden';
    $gamesContainer.className = 'container games-container hidden';
    $codexContainer.className = 'container codex-container';
    $notesContainer.className = 'container notes-container hidden';
    $editContainer.className = 'container edit-container hidden';
    $addGameContainer.className = 'container addGame-container hidden';
    $randomContainer.className = 'container random-container hidden';
  } else if (view === 'notes') {
    $featuredContainer.className = 'container featured-container hidden';
    $gamesContainer.className = 'container games-container hidden';
    $codexContainer.className = 'container codex-container hidden';
    $notesContainer.className = 'container notes-container';
    $editContainer.className = 'container edit-container hidden';
    $addGameContainer.className = 'container addGame-container hidden';
    $randomContainer.className = 'container random-container hidden';
  } else if (view === 'edit') {
    $featuredContainer.className = 'container featured-container hidden';
    $gamesContainer.className = 'container games-container hidden';
    $codexContainer.className = 'container codex-container hidden';
    $notesContainer.className = 'container notes-container hidden';
    $editContainer.className = 'container edit-container';
    $addGameContainer.className = 'container addGame-container hidden';
    $randomContainer.className = 'container random-container hidden';
  } else if (view === 'addGame') {
    $featuredContainer.className = 'container featured-container hidden';
    $gamesContainer.className = 'container games-container hidden';
    $codexContainer.className = 'container codex-container hidden';
    $notesContainer.className = 'container notes-container hidden';
    $editContainer.className = 'container edit-container hidden';
    $addGameContainer.className = 'container addGame-container';
    $randomContainer.className = 'container random-container hidden';
  } else if (view === 'random') {
    $featuredContainer.className = 'container featured-container hidden';
    $gamesContainer.className = 'container games-container hidden';
    $codexContainer.className = 'container codex-container hidden';
    $notesContainer.className = 'container notes-container hidden';
    $editContainer.className = 'container edit-container hidden';
    $addGameContainer.className = 'container addGame-container hidden';
    $randomContainer.className = 'container random-container';
  }
}

const $ul = document.querySelector('.ul-games');

/* Create Game Entry with Dom */
function createEntry(entry) {

  const list = document.createElement('li');
  list.className = 'game';

  const card = document.createElement('div');
  card.className = 'card';
  const cardContainer = list.appendChild(card);

  const col2 = document.createElement('div');
  col2.className = 'column-two-fifths';
  const col2div = cardContainer.appendChild(col2);

  const img = document.createElement('img');
  img.className = 'search-img';
  img.setAttribute('alt', 'image for the game');
  col2div.appendChild(img);

  const col3 = document.createElement('div');
  col3.className = 'column-three-fifths card-text';
  const col3div = cardContainer.appendChild(col3);

  const titleDiv = document.createElement('div');
  titleDiv.className = 'card-title';
  const titleDivContainer = col3div.appendChild(titleDiv);

  const gameTitle = document.createElement('h2');
  gameTitle.className = 'game-title';
  gameTitle.textContent = entry.name;
  titleDivContainer.appendChild(gameTitle);

  const heart = document.createElement('i');
  heart.className = 'fa-regular fa-heart';
  heart.id = entry.appid;
  for (let i = 0; i < data.entries.length; i++) {
    if (parseInt(heart.id) === data.entries[i].id) {
      heart.className = 'fa-solid fa-heart';
    }
  }
  titleDivContainer.appendChild(heart);

  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = '';
  col3.appendChild(description);

  const release = document.createElement('p');
  release.className = 'release';
  release.textContent = '';
  col3.appendChild(release);

  const genre = document.createElement('p');
  genre.className = 'genre';
  genre.textContent = '';
  col3.appendChild(genre);

  $ul.appendChild(list);

  gameList.push(list);
}

/* Create game entry small version with Dom */
const $gallery = document.querySelector('.gallery');
function createEntrySmall(entry) {
  const list = document.createElement('li');
  list.className = 'featured-games';

  const cardSmall = document.createElement('div');
  cardSmall.className = 'card-small';
  const cardContainer = list.appendChild(cardSmall);

  const container = document.createElement('div');
  container.className = 'entry-container';
  const entryContainer = cardContainer.appendChild(container);

  const img = document.createElement('img');
  img.setAttribute('alt', 'image for the game');
  img.setAttribute('src', entry.header_image);
  img.className = 'top-right-round ' + entry.id;
  entryContainer.appendChild(img);

  const button = document.createElement('button');
  button.className = 'button-sale';
  button.textContent = 'Sale';
  entryContainer.appendChild(button);

  const titleDiv = document.createElement('div');
  titleDiv.className = 'card-title card-title-small ' + entry.id;
  const titleDivContainer = entryContainer.appendChild(titleDiv);

  const gameTitle = document.createElement('h2');
  gameTitle.className = 'game-title ' + entry.id;
  gameTitle.textContent = entry.name;
  titleDivContainer.appendChild(gameTitle);

  const heart = document.createElement('i');
  heart.id = entry.id;
  heart.className = 'fa-regular fa-heart';
  for (let i = 0; i < data.entries.length; i++) {
    if (parseInt(heart.id) === data.entries[i].id) {
      heart.className = 'fa-solid fa-heart';
    }
  }
  titleDivContainer.appendChild(heart);

  $gallery.appendChild(list);
}

/* Heart icon */
$gallery.addEventListener('click', handleHearts);
$ul.addEventListener('click', handleHearts);

function handleHearts(event) {
  if (event.target && event.target.tagName === 'I' && event.target.className === 'fa-regular fa-heart') {
    event.target.className = 'fa-solid fa-heart';
    for (let i = 0; i < featured.length; i++) {
      if (parseInt(event.target.id) === featured[i].id) {
        data.entries.unshift(featured[i]);
        createSingleEntry(featured[i]);
        const $games = document.querySelectorAll('.user-games');
        $games[0].addEventListener('click', handleTiles);
        if ($emptyCodex.className === 'empty-codex') {
          $emptyCodex.className = 'empty-codex hidden';
        }
      }
    }
    for (let j = 0; j < searchedGames.length; j++) {
      if (parseInt(event.target.id) === searchedGames[j].id) {
        data.entries.unshift(searchedGames[j]);
        createSingleEntry(searchedGames[j]);
        const $games2 = document.querySelectorAll('.user-games');
        $games2[0].addEventListener('click', handleTiles);
        if ($emptyCodex.className === 'empty-codex') {
          $emptyCodex.className = 'empty-codex hidden';
        }
      }
    }
  } else if (event.target && event.target.tagName === 'I' && event.target.className === 'fa-solid fa-heart') {
    currentHeartId = event.target.id;
    $deleteModal.className = 'delete-modal';
  }
}

/* For prepending a new game tile when hearting without refreshing page */
function createSingleEntry(entry) {
  const list = document.createElement('li');
  list.className = 'user-games ';

  const cardSmall = document.createElement('div');
  cardSmall.className = 'card-small tile';
  const cardContainer = list.appendChild(cardSmall);

  const container = document.createElement('div');
  container.className = 'entry-container';
  const entryContainer = cardContainer.appendChild(container);

  const img = document.createElement('img');
  img.setAttribute('alt', 'image for the game');
  img.className = 'top-right-round ' + entry.id;
  img.setAttribute('src', entry.img);
  entryContainer.appendChild(img);

  const button = document.createElement('button');
  button.className = 'button-position hidden';
  button.textContent = 'Playing';
  entryContainer.appendChild(button);

  const titleDiv = document.createElement('div');
  titleDiv.className = 'card-title card-title-small ' + entry.id;
  const titleDivContainer = entryContainer.appendChild(titleDiv);

  const gameTitle = document.createElement('h2');
  gameTitle.className = 'game-title ' + entry.id;
  gameTitle.textContent = entry.name;
  titleDivContainer.appendChild(gameTitle);

  const heart = document.createElement('i');
  heart.className = 'fa-solid fa-heart';
  heart.id = entry.id;
  titleDivContainer.appendChild(heart);

  $codexCards.prepend(list);
}

const $codexCards = document.querySelector('.my-codex');
function createCodex(entry) {
  const list = document.createElement('li');
  list.className = 'user-games ';

  const cardSmall = document.createElement('div');
  cardSmall.className = 'card-small tile';
  const cardContainer = list.appendChild(cardSmall);

  const container = document.createElement('div');
  container.className = 'entry-container';
  const entryContainer = cardContainer.appendChild(container);

  const img = document.createElement('img');
  img.setAttribute('alt', 'image for the game');
  img.className = 'top-right-round ' + entry.id;
  img.setAttribute('src', entry.img);
  entryContainer.appendChild(img);

  const button = document.createElement('button');
  button.className = 'button-position hidden';
  button.textContent = 'Playing';
  entryContainer.appendChild(button);

  const titleDiv = document.createElement('div');
  titleDiv.className = 'card-title card-title-small ' + entry.id;
  const titleDivContainer = entryContainer.appendChild(titleDiv);

  const gameTitle = document.createElement('h2');
  gameTitle.className = 'game-title ' + entry.id;
  gameTitle.textContent = entry.name;
  titleDivContainer.appendChild(gameTitle);

  const heart = document.createElement('i');
  heart.className = 'fa-solid fa-heart';
  heart.id = entry.id;
  titleDivContainer.appendChild(heart);

  $codexCards.appendChild(list);
}

function createCodexPage() {
  for (let i = 0; i < data.entries.length; i++) {
    createCodex(data.entries[i]);
    const $statusButton = document.querySelectorAll('.button-position');
    if (data.entries[i].enteredNote !== undefined && data.entries[i].enteredNote.status === 'playing') {
      $statusButton[i].textContent = 'Playing';
      $statusButton[i].className = 'button-position playing';
    } else if (data.entries[i].enteredNote !== undefined && data.entries[i].enteredNote.status === 'eventually') {
      $statusButton[i].textContent = 'Eventually';
      $statusButton[i].className = 'button-position eventually';
    } else if (data.entries[i].enteredNote !== undefined && data.entries[i].enteredNote.status === 'finished') {
      $statusButton[i].textContent = 'Finished';
      $statusButton[i].className = 'button-position finished';
    }
  }
}
createCodexPage();

const $gameList = document.querySelectorAll('.user-games');

const $editIcon = document.querySelector('.fa-pen-to-square');

const $rating = document.querySelectorAll('.fa-star');
const $status = document.querySelector('.button-status');
const $notes = document.querySelector('.p-notes');
const $links = document.querySelector('.links-list');

function addLiLink(event) {
  const li = document.createElement('li');
  li.className = 'liCont';
  const a = document.createElement('a');
  a.className = 'liLink';
  a.setAttribute('target', '_blank');
  li.appendChild(a);
  $links.appendChild(li);
}

/* Clicking on a tile brings up notes page */
for (let n = 0; n < $gameList.length; n++) {
  $gameList[n].addEventListener('click', handleTiles);
}

function handleTiles(event) {
  if (event.target.tagName !== 'I') {
    handleView('notes');
    for (let j = 0; j < data.entries.length; j++) {
      if (event.target.classList.contains(data.entries[j].id)) {
        $notesTitle.textContent = data.entries[j].name;
        $notesImg.setAttribute('src', data.entries[j].img);

        for (let y = 0; y < $rating.length; y++) {
          if (data.entries[j].enteredNote !== undefined && data.entries[j].enteredNote.rating > y) {
            $rating[y].className = 'fa-solid fa-star';
          } else {
            $rating[y].className = 'fa-regular fa-star';
          }
        }

        if (data.entries[j].enteredNote !== undefined) {
          $status.className = 'button-status ' + data.entries[j].enteredNote.status;
          $status.textContent = data.entries[j].enteredNote.status[0].toUpperCase() + data.entries[j].enteredNote.status.slice(1);
          $notes.textContent = data.entries[j].enteredNote.notes;

          const $li = document.querySelectorAll('.liCont');
          for (let z = 0; z < $li.length; z++) {
            $li[z].remove();
          }
          for (let x = 0; x < data.entries[j].enteredNote.linkDescriptions.length; x++) {
            addLiLink();
            const $a = document.querySelectorAll('.liLink');
            $a[x].textContent = data.entries[j].enteredNote.linkDescriptions[x];
            $a[x].setAttribute('href', data.entries[j].enteredNote.linkUrls[x]);
          }
        } else {
          $status.className = 'button-status playing';
          $status.textContent = 'Playing';
          $notes.textContent = '';
          const $li2 = document.querySelectorAll('.liCont');
          for (let a = 0; a < $li2.length; a++) {
            $li2[a].remove();
          }
        }

      }
    }
  }
}

const $back = document.querySelector('.back');
$back.addEventListener('click', function (event) {
  handleView('codex');
});

const $editImg = document.querySelector('.edit-img');
const $editTitle = document.querySelector('.edit-title');

const $editStars = document.getElementsByName('star');
const $editStatus = document.querySelector('.status-dropdown');
const $editNotes = document.querySelector('#notes');

/* Edit notes */
$editIcon.addEventListener('click', function (event) {
  handleView('edit');
  $editTitle.textContent = $notesTitle.textContent;
  $editImg.setAttribute('src', $notesImg.src);

  for (let j = 0; j < data.entries.length; j++) {
    if ($editTitle.textContent === data.entries[j].name) {
      if (data.entries[j].enteredNote !== undefined) {
        /* Stars */
        for (let s = 0; s < $editStars.length; s++) {
          if (parseInt(data.entries[j].enteredNote.rating) === 1) {
            $editStars[4].checked = true;
          } else if (parseInt(data.entries[j].enteredNote.rating) === 2) {
            $editStars[3].checked = true;
          } else if (parseInt(data.entries[j].enteredNote.rating) === 3) {
            $editStars[2].checked = true;
          } else if (parseInt(data.entries[j].enteredNote.rating) === 4) {
            $editStars[1].checked = true;
          } else if (parseInt(data.entries[j].enteredNote.rating) === 5) {
            $editStars[0].checked = true;
          }
        }
        /* Status */
        $editStatus.value = data.entries[j].enteredNote.status;
        /* Notes */
        $editNotes.value = data.entries[j].enteredNote.notes;
        /* Description and URL */
        const $list = document.querySelectorAll('.links-line');
        for (let n = 0; n < $list.length; n++) {
          $list[n].remove();
        }
        for (let l = 0; l < data.entries[j].enteredNote.linkDescriptions.length; l++) {
          createEntireLink();
          const $editDescription = document.querySelectorAll('.link-description');
          const $editUrl = document.querySelectorAll('.link-url');
          $editDescription[l].value = data.entries[j].enteredNote.linkDescriptions[l];
          $editUrl[l].value = data.entries[j].enteredNote.linkUrls[l];
        }
      }
    }
  }
});

/* Adds more links */
const $addLink = document.querySelector('.button-add-links');
let linkNumber = 0;
$addLink.addEventListener('click', function (event) {
  createEntireLink();
});

function createEntireLink() {
  createNewLink(linkNumber);
  linkNumber++;
  const $trashCans = document.querySelectorAll('.fa-trash');
  const $linksLine = document.querySelectorAll('.links-line');
  for (let t = 0; t < $trashCans.length; t++) {
    $trashCans[t].addEventListener('click', function (event) {
      for (let l = 0; l < $linksLine.length; l++) {
        if (event.target.getAttribute('linknumber') === $linksLine[l].getAttribute('linknumber')) {
          $linksLine[l].remove();
        }
      }
    });
  }
}

/* Cancel */
const $cancel = document.querySelector('.cancel');
$cancel.addEventListener('click', function (event) {
  handleView('codex');
});

/* Submit */
const $submitNotes = document.querySelector('.edit-form');
$submitNotes.addEventListener('submit', function (event) {
  event.preventDefault();

  const $radio = document.getElementsByName('star');
  let checked;
  for (let s = 0; s < $radio.length; s++) {
    if ($radio[s].checked === true) {
      checked = $radio[s].value;
    }
  }

  const values = {
    rating: checked,
    status: document.forms[0].elements.status.value,
    notes: document.forms[0].elements.notes.value,
    linkDescriptions: [],
    linkUrls: []
  };

  const $linkDescription = document.querySelectorAll('.link-description');
  const $linkUrl = document.querySelectorAll('.link-url');
  for (let k = 0; k < $linkDescription.length; k++) {
    values.linkDescriptions.push($linkDescription[k].value);
    values.linkUrls.push($linkUrl[k].value);
  }

  for (let g = 0; g < data.entries.length; g++) {
    if ($editTitle.textContent === data.entries[g].name) {
      data.entries[g].enteredNote = values;
    }
  }

  for (let i = 0; i < data.entries.length; i++) {
    const $statusButton = document.querySelectorAll('.button-position');
    if (data.entries[i].enteredNote !== undefined && data.entries[i].enteredNote.status === 'playing') {
      $statusButton[i].textContent = 'Playing';
      $statusButton[i].className = 'button-position playing';
    } else if (data.entries[i].enteredNote !== undefined && data.entries[i].enteredNote.status === 'eventually') {
      $statusButton[i].textContent = 'Eventually';
      $statusButton[i].className = 'button-position eventually';
    } else if (data.entries[i].enteredNote !== undefined && data.entries[i].enteredNote.status === 'finished') {
      $statusButton[i].textContent = 'Finished';
      $statusButton[i].className = 'button-position finished';
    }
  }

  handleView('codex');
  $submitNotes.reset();
});

const $linksForm = document.querySelector('.links-form');
function createNewLink(number) {

  const bothLinks = document.createElement('div');
  bothLinks.className = 'links-line';
  bothLinks.setAttribute('linkNumber', number);

  const description = document.createElement('input');
  description.setAttribute('type', 'text');
  description.setAttribute('name', 'link-description');
  description.className = 'link-description';
  description.setAttribute('placeholder', 'Link Description');
  bothLinks.appendChild(description);

  const url = document.createElement('input');
  url.setAttribute('type', 'url');
  url.setAttribute('name', 'link-url');
  url.className = 'link-url';
  url.setAttribute('placeholder', 'Link URL');
  bothLinks.appendChild(url);

  const trashIcon = document.createElement('i');
  trashIcon.className = 'fa-solid fa-trash';
  trashIcon.setAttribute('linkNumber', number);
  bothLinks.appendChild(trashIcon);

  $linksForm.appendChild(bothLinks);
}

$codexCards.addEventListener('click', handleDelete);

function handleDelete(event) {
  if (event.target.tagName === 'I' && event.target.className === 'fa-solid fa-heart') {
    $deleteModal.className = 'delete-modal';
    currentHeartId = event.target.id;
  }
}

$deleteCancel.addEventListener('click', function (event) {
  $deleteModal.className = 'delete-modal hidden';
});
$deleteConfirm.addEventListener('click', function (event) {
  const $filledHeart = document.querySelectorAll('.fa-solid.fa-heart');
  for (let h = 0; h < $filledHeart.length; h++) {
    if (parseInt(currentHeartId) === parseInt($filledHeart[h].id)) {
      $filledHeart[h].className = 'fa-regular fa-heart';
    }
  }
  for (let i = 0; i < data.entries.length; i++) {
    if (parseInt(currentHeartId) === data.entries[i].id) {
      data.entries.splice(i, 1);
      const $toDelete = document.querySelectorAll('.user-games ');
      $toDelete[i].remove();
      currentHeartId = 0;
      $deleteModal.className = 'delete-modal hidden';
      if (data.entries.length === 0) {
        $emptyCodex.className = 'empty-codex';
      }
    }
  }
});

/* Takes user to add a new game with manual inputs */
const $addButton = document.querySelector('.add-button');
$addButton.addEventListener('click', function (event) {
  handleView('addGame');
});

/* Replaces placeholder image with user entered URL */
const $newImg = document.querySelector('#new-img');
const $addedImg = document.querySelector('.placeholder');
$newImg.addEventListener('input', function (event) {
  $addedImg.setAttribute('src', event.target.value);
});

/* Adds new game to local data */

const $newGameForm = document.querySelector('.add-game-form');
$newGameForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const values = {
    name: document.forms[1].elements['new-name'].value,
    img: document.forms[1].elements['new-img'].value,
    id: data.nextEntryId
  };
  data.nextEntryId += 1;
  data.entries.unshift(values);

  $addedImg.setAttribute('src', '../images/placeholder-view-vector.svg .png');

  $newGameForm.reset();

  createSingleEntry(data.entries[0]);
  const $games3 = document.querySelectorAll('.user-games');
  $games3[0].addEventListener('click', handleTiles);
  if ($emptyCodex.className === 'empty-codex') {
    $emptyCodex.className = 'empty-codex hidden';
  }

  handleView('codex');
});

/* Creates a new game tile for Random */

const $ulRand = document.querySelector('.ul-games-random');
function createRandEntry(entry) {
  const list = document.createElement('li');
  list.className = 'rand-game';

  const card = document.createElement('div');
  card.className = 'card';
  const cardContainer = list.appendChild(card);

  const col2 = document.createElement('div');
  col2.className = 'column-two-fifths';
  const col2div = cardContainer.appendChild(col2);

  const img = document.createElement('img');
  img.className = 'search-img';
  img.setAttribute('alt', 'image for the game');
  img.setAttribute('src', entry.header_image);
  col2div.appendChild(img);

  const col3 = document.createElement('div');
  col3.className = 'column-three-fifths card-text';
  const col3div = cardContainer.appendChild(col3);

  const titleDiv = document.createElement('div');
  titleDiv.className = 'card-title';
  const titleDivContainer = col3div.appendChild(titleDiv);

  const gameTitle = document.createElement('h2');
  gameTitle.className = 'game-title';
  gameTitle.textContent = entry.name;
  titleDivContainer.appendChild(gameTitle);

  const heart = document.createElement('i');
  heart.className = 'fa-regular fa-heart';
  heart.id = entry.steam_appid;
  for (let i = 0; i < data.entries.length; i++) {
    if (parseInt(heart.id) === data.entries[i].id) {
      heart.className = 'fa-solid fa-heart';
    }
  }
  titleDivContainer.appendChild(heart);

  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = 'Description: ' + entry.short_description;
  col3.appendChild(description);

  const release = document.createElement('p');
  release.className = 'release';
  release.textContent = 'Release: ' + entry.release_date.date;
  col3.appendChild(release);

  const genre = document.createElement('p');
  genre.className = 'genre';
  genre.textContent = 'Genre: ' + entry.genres[0].description;
  col3.appendChild(genre);

  $ulRand.appendChild(list);
}

function getRandGame() {
  const possibleGenres = ['action', 'rpg', 'strategy', 'racing', 'casual', 'puzzle', 'metroidvania'];
  const randGenreNum = Math.floor(Math.random() * possibleGenres.length);
  const randGenre = possibleGenres[randGenreNum];
  const randArrNum = Math.floor(Math.random() * 10);
  let randId = 0;

  const targetUrlRand = encodeURIComponent('https://store.steampowered.com/api/getappsingenre/?genre=' + randGenre);
  const proxyUrl = 'https://api.allorigins.win/get?url=' + targetUrlRand;

  const xhrRand = new XMLHttpRequest();
  xhrRand.open('GET', proxyUrl);
  xhrRand.responseType = 'json';
  
  xhrRand.addEventListener('load', function () {
    let apiResponse;
    try {
      apiResponse = JSON.parse(xhrRand.response.contents);
    } catch (e) {
      console.error('Error parsing API response for getRandGame', e);
      return;
    }
    
    // Retrieve the random game ID from the parsed API response.
    randId = apiResponse.tabs.topsellers.items[randArrNum].id;
    // Call getRandGameData with the random ID.
    getRandGameData(randId);
  });

  xhrRand.send();
}

function getRandGameData(randId) {
  const targetUrlRandData = encodeURIComponent('https://store.steampowered.com/api/appdetails?appids=' + randId);
  const proxyUrl = 'https://api.allorigins.win/get?url=' + targetUrlRandData;

  const xhrRandData = new XMLHttpRequest();
  xhrRandData.open('GET', proxyUrl);
  xhrRandData.responseType = 'json';

  xhrRandData.addEventListener('load', function () {
    let apiResponse;
    try {
      apiResponse = JSON.parse(xhrRandData.response.contents);
    } catch (e) {
      console.error('Error parsing API response for random game data', e);
      // If parsing fails, call getRandGame() (or handle the error as needed) and hide the spinner.
      getRandGame();
      $spinner[2].className = 'spinner hidden';
      return;
    }

    // Check if the API response failed.
    if (apiResponse[randId].success === false) {
      getRandGame();
    } else {
      // Create a random game entry using the fetched data.
      createRandEntry(apiResponse[randId].data);

      const randValue = {
        id: apiResponse[randId].data.steam_appid,
        img: apiResponse[randId].data.header_image,
        name: apiResponse[randId].data.name
      };

      randData.unshift(randValue);
    }
    $spinner[2].className = 'spinner hidden';
  });

  xhrRandData.send();
}


function handleHeartRand(event) {
  if (event.target && event.target.tagName === 'I' && event.target.className === 'fa-regular fa-heart') {
    event.target.className = 'fa-solid fa-heart';
    for (let i = 0; i < randData.length; i++) {
      if (parseInt(event.target.id) === randData[i].id) {
        data.entries.unshift(randData[i]);
        createSingleEntry(randData[i]);
        const $games = document.querySelectorAll('.user-games');
        $games[0].addEventListener('click', handleTiles);
        if ($emptyCodex.className === 'empty-codex') {
          $emptyCodex.className = 'empty-codex hidden';
        }
      }
    }
  }
}

/* Filter game by play status */
const $filter = document.querySelector('.order-button');

$filter.addEventListener('change', handleSelection);

function handleSelection() {
  const $currentCodex = document.querySelectorAll('.user-games');
  if ($filter.value === 'order-playing') {
    for (let p = 0; p < data.entries.length; p++) {
      $currentCodex[p].className = 'user-games';
      if (data.entries[p].enteredNote === undefined || data.entries[p].enteredNote.status !== 'playing') {
        $currentCodex[p].className = 'user-games hidden';
      }
    }
  } else if ($filter.value === 'order-eventually') {
    for (let e = 0; e < data.entries.length; e++) {
      $currentCodex[e].className = 'user-games';
      if (data.entries[e].enteredNote === undefined || data.entries[e].enteredNote.status !== 'eventually') {
        $currentCodex[e].className = 'user-games hidden';
      }
    }
  } else if ($filter.value === 'order-finished') {
    for (let f = 0; f < data.entries.length; f++) {
      $currentCodex[f].className = 'user-games';
      if (data.entries[f].enteredNote === undefined || data.entries[f].enteredNote.status !== 'finished') {
        $currentCodex[f].className = 'user-games hidden';
      }
    }
  } else if ($filter.value === 'order-filter') {
    for (let a = 0; a < data.entries.length; a++) {
      $currentCodex[a].className = 'user-games';
    }
  }
}

/* Feature Games Search When Clicked */
function handleFeaturedTiles(event) {
  if (event.target.tagName !== 'I') {
    for (let i = 0; i < featured.length; i++) {
      if (event.target.classList.contains(featured[i].id)) {
        $search.value = featured[i].name;
        handleSearch(event);
      }
    }
  }
}
