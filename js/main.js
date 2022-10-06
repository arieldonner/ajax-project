var gameList = [];

var descriptions = [];
var releases = [];
var genres = [];
var imgs = [];

var featured = [];
var searchedGames = [];

var $notesTitle = document.querySelector('.notes-title');
var $notesImg = document.querySelector('.notes-img');

var $deleteModal = document.querySelector('.delete-modal');
var $deleteCancel = document.querySelector('.delete-cancel');
var $deleteConfirm = document.querySelector('.delete-confirm');
var currentHeartId = 0;

var $emptyCodex = document.querySelector('.empty-codex');

/* Get geatured games */
function getFeatured() {
  var targetUrl3 = encodeURIComponent('https://store.steampowered.com/api/featured');
  var xhr3 = new XMLHttpRequest();
  xhr3.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl3);
  xhr3.setRequestHeader('token', 'abc123');
  xhr3.responseType = 'json';
  xhr3.addEventListener('load', function () {
    var xhr3Response = xhr3.response.featured_win;
    for (var i = 0; i < xhr3Response.length; i++) {
      createEntrySmall(xhr3Response[i]);
      var $sale = document.querySelectorAll('.button-sale');

      var values = {
        name: xhr3Response[i].name,
        img: xhr3Response[i].header_image,
        id: xhr3Response[i].id
      };
      featured.push(values);

      if (xhr3Response[i].discounted === false) {
        $sale[i].className = 'button-sale hidden';
      }
    }
  });
  xhr3.send();
}
getFeatured();

/* Games Link */
var $games = document.querySelector('.nav-games');
$games.addEventListener('click', function (event) {
  handleView('featured');
  $search.value = '';
});

/* MyCodex Link */
var $myCodex = document.querySelector('.nav-codex');
$myCodex.addEventListener('click', function (event) {
  handleView('codex');
  $search.value = '';
});

if (data.entries.length === 0) {
  $emptyCodex.className = 'empty-codex';
}

/* Question Mark Icon */
var $question = document.querySelector('.fa-circle-question');
var $modal = document.querySelector('.container-modal');
$question.addEventListener('click', function (event) {
  $modal.className = 'container-modal';
});
var $close = document.querySelector('.fa-xmark');
$close.addEventListener('click', function (event) {
  $modal.className = 'container-modal hidden';
});

/* Random Icon */
var $random = document.querySelector('.fa-shuffle');
$random.addEventListener('click', function (event) {
  var $randLi = document.querySelector('.rand-game');
  if ($randLi === null) {
    getRandGame();
  } else {
    $randLi.remove();
    getRandGame();
  }
  handleView('random');
});

/* Search Bar */
var $search = document.querySelector('#search');

var $searchButton = document.querySelector('.button-search');
var gameCounter = 0;
var xhrResponses;

/* Search when clicking the button */
$searchButton.addEventListener('click', function (event) {
  handleView('games');
  var targetUrl = encodeURIComponent('https://steamcommunity.com/actions/SearchApps/' + $search.value);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    /* Removes games when searching again */
    for (var j = 0; j < gameList.length; j++) {
      gameList[j].remove();
      descriptions = [];
      releases = [];
      genres = [];
      imgs = [];
      gameCounter = 0;
    }

    xhrResponses = xhr.response;
    var appId = xhr.response[0].appid;
    getGameData(appId);
  }
  );

  xhr.send();
});

function getGameData(appId) {
  if (gameCounter >= xhrResponses.length || appId === undefined) {
    gameCounter = 0;
    xhrResponses = [];
    return;
  }

  var targetUrl2 = encodeURIComponent('https://store.steampowered.com/api/appdetails?appids=' + appId);

  var xhr2 = new XMLHttpRequest();
  xhr2.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl2);
  xhr2.setRequestHeader('token', 'abc123');
  xhr2.responseType = 'json';
  createEntry(xhrResponses[gameCounter]);
  xhr2.addEventListener('load', function () {
    gameCounter++;

    var $description = document.querySelectorAll('.description');
    descriptions.push(xhr2.response[appId].data.short_description);

    var $release = document.querySelectorAll('.release');
    releases.push(xhr2.response[appId].data.release_date.date);

    var $genre = document.querySelectorAll('.genre');
    genres.push(xhr2.response[appId].data.genres[0].description);

    var $img = document.querySelectorAll('.search-img');
    imgs.push(xhr2.response[appId].data.header_image);

    for (var i = 0; i < $description.length; i++) {
      $description[i].textContent = 'Description: ' + descriptions[i];
      $release[i].textContent = 'Release Date: ' + releases[i];
      $genre[i].textContent = 'Genre: ' + genres[i];
      $img[i].setAttribute('src', imgs[i]);
    }

    var values = {
      name: xhr2.response[appId].data.name,
      img: xhr2.response[appId].data.header_image,
      id: xhr2.response[appId].data.steam_appid
    };
    searchedGames.push(values);

    if (gameCounter < xhrResponses.length) {
      getGameData(xhrResponses[gameCounter].appid);
    }
  });

  xhr2.send();
}

var $featuredContainer = document.querySelector('.featured-container');
var $gamesContainer = document.querySelector('.games-container');
var $codexContainer = document.querySelector('.codex-container');
var $notesContainer = document.querySelector('.notes-container');
var $editContainer = document.querySelector('.edit-container');
var $addGameContainer = document.querySelector('.addGame-container');
var $randomContainer = document.querySelector('.random-container');

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

var $ul = document.querySelector('.ul-games');

/* Create Game Entry with Dom */
function createEntry(entry) {

  var list = document.createElement('li');
  list.className = 'game';

  var card = document.createElement('div');
  card.className = 'card';
  var cardContainer = list.appendChild(card);

  var col2 = document.createElement('div');
  col2.className = 'column-two-fifths';
  var col2div = cardContainer.appendChild(col2);

  var img = document.createElement('img');
  img.className = 'search-img';
  img.setAttribute('alt', 'image for the game');
  col2div.appendChild(img);

  var col3 = document.createElement('div');
  col3.className = 'column-three-fifths card-text';
  var col3div = cardContainer.appendChild(col3);

  var titleDiv = document.createElement('div');
  titleDiv.className = 'card-title';
  var titleDivContainer = col3div.appendChild(titleDiv);

  var gameTitle = document.createElement('h2');
  gameTitle.className = 'game-title';
  gameTitle.textContent = entry.name;
  titleDivContainer.appendChild(gameTitle);

  var heart = document.createElement('i');
  heart.className = 'fa-regular fa-heart';
  heart.id = entry.appid;
  for (var i = 0; i < data.entries.length; i++) {
    if (parseInt(heart.id) === data.entries[i].id) {
      heart.className = 'fa-solid fa-heart';
    }
  }
  titleDivContainer.appendChild(heart);

  var description = document.createElement('p');
  description.className = 'description';
  description.textContent = '';
  col3.appendChild(description);

  var release = document.createElement('p');
  release.className = 'release';
  release.textContent = '';
  col3.appendChild(release);

  var genre = document.createElement('p');
  genre.className = 'genre';
  genre.textContent = '';
  col3.appendChild(genre);

  $ul.appendChild(list);

  gameList.push(list);
}

/* <li class="game">
  <div class="card">
    <div class="column-two-fifths">
      <img
        src="https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/games/switch/r/rune-factory-5-switch/hero"
        alt="game image">
    </div>
    <div class="column-three-fifths card-text">
      <div class="card-title">
        <h2 class="game-title">Rune Factory 5</h2>
        <i class="fa-regular fa-heart"></i>
      </div>
      <p>Description: As the newest ranger of a peacekeeping organization known as SEED, protect your community by rounding up rowdy monsters
        and going on special missions. Cultivate your farm and friendships alike while unravelling rune-related mysteries!</p>
      <p>Release Date: Jul 13, 2022</p>
      <p>Genre: Adventure, RPG, Simulation</p>
    </div>
  </div>
</li> */

/* Create game entry small version with Dom */
var $gallery = document.querySelector('.gallery');
function createEntrySmall(entry) {
  var list = document.createElement('li');

  var cardSmall = document.createElement('div');
  cardSmall.className = 'card-small';
  var cardContainer = list.appendChild(cardSmall);

  var container = document.createElement('div');
  container.className = 'entry-container';
  var entryContainer = cardContainer.appendChild(container);

  var img = document.createElement('img');
  img.setAttribute('alt', 'image for the game');
  img.setAttribute('src', entry.header_image);
  img.className = 'top-right-round';
  entryContainer.appendChild(img);

  var button = document.createElement('button');
  button.className = 'button-sale';
  button.textContent = 'Sale';
  entryContainer.appendChild(button);

  var titleDiv = document.createElement('div');
  titleDiv.className = 'card-title card-title-small';
  var titleDivContainer = entryContainer.appendChild(titleDiv);

  var gameTitle = document.createElement('h2');
  gameTitle.className = 'game-title';
  gameTitle.textContent = entry.name;
  titleDivContainer.appendChild(gameTitle);

  var heart = document.createElement('i');
  heart.id = entry.id;
  heart.className = 'fa-regular fa-heart';
  for (var i = 0; i < data.entries.length; i++) {
    if (parseInt(heart.id) === data.entries[i].id) {
      heart.className = 'fa-solid fa-heart';
    }
  }
  titleDivContainer.appendChild(heart);

  $gallery.appendChild(list);
}
/*
<li>
              <div class="card-small">
                <div class="entry-container">
                  <img
                    src="https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/games/switch/r/rune-factory-5-switch/hero"
                    alt="game image">
                  <button class="button-sale">Sale</button>
                  <div class="card-title card-title-small">
                    <h2 class="game-title">Rune Factory 5</h2>
                    <i class="fa-regular fa-heart"></i>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="card-small">
                <div class="entry-container">
                  <img
                    src="https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/games/switch/r/rune-factory-5-switch/hero"
                    alt="game image">
                  <button class="button-sale">Sale</button>
                  <div class="card-title card-title-small">
                    <h2 class="game-title">Rune Factory 5</h2>
                    <i class="fa-regular fa-heart"></i>
                  </div>
                </div>
              </div>
            </li>
*/

/* Heart icon */
$gallery.addEventListener('click', handleHearts);
$ul.addEventListener('click', handleHearts);

function handleHearts(event) {
  if (event.target && event.target.tagName === 'I' && event.target.className === 'fa-regular fa-heart') {
    event.target.className = 'fa-solid fa-heart';
    for (var i = 0; i < featured.length; i++) {
      if (parseInt(event.target.id) === featured[i].id) {
        data.entries.unshift(featured[i]);
        createSingleEntry(featured[i]);
        var $games = document.querySelectorAll('.user-games');
        $games[0].addEventListener('click', handleTiles);
        if ($emptyCodex.className === 'empty-codex') {
          $emptyCodex.className = 'empty-codex hidden';
        }
      }
    }
    for (var j = 0; j < searchedGames.length; j++) {
      if (parseInt(event.target.id) === searchedGames[j].id) {
        data.entries.unshift(searchedGames[j]);
        createSingleEntry(searchedGames[j]);
        var $games2 = document.querySelectorAll('.user-games');
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
  var list = document.createElement('li');
  list.className = 'user-games ';

  var cardSmall = document.createElement('div');
  cardSmall.className = 'card-small tile';
  var cardContainer = list.appendChild(cardSmall);

  var container = document.createElement('div');
  container.className = 'entry-container';
  var entryContainer = cardContainer.appendChild(container);

  var img = document.createElement('img');
  img.setAttribute('alt', 'image for the game');
  img.className = 'top-right-round ' + entry.id;
  img.setAttribute('src', entry.img);
  entryContainer.appendChild(img);

  var titleDiv = document.createElement('div');
  titleDiv.className = 'card-title card-title-small ' + entry.id;
  var titleDivContainer = entryContainer.appendChild(titleDiv);

  var gameTitle = document.createElement('h2');
  gameTitle.className = 'game-title ' + entry.id;
  gameTitle.textContent = entry.name;
  titleDivContainer.appendChild(gameTitle);

  var heart = document.createElement('i');
  heart.className = 'fa-solid fa-heart';
  heart.id = entry.id;
  titleDivContainer.appendChild(heart);

  $codexCards.prepend(list);
}

var $codexCards = document.querySelector('.my-codex');
function createCodex(entry) {
  var list = document.createElement('li');
  list.className = 'user-games ';

  var cardSmall = document.createElement('div');
  cardSmall.className = 'card-small tile';
  var cardContainer = list.appendChild(cardSmall);

  var container = document.createElement('div');
  container.className = 'entry-container';
  var entryContainer = cardContainer.appendChild(container);

  var img = document.createElement('img');
  img.setAttribute('alt', 'image for the game');
  img.className = 'top-right-round ' + entry.id;
  img.setAttribute('src', entry.img);
  entryContainer.appendChild(img);

  var titleDiv = document.createElement('div');
  titleDiv.className = 'card-title card-title-small ' + entry.id;
  var titleDivContainer = entryContainer.appendChild(titleDiv);

  var gameTitle = document.createElement('h2');
  gameTitle.className = 'game-title ' + entry.id;
  gameTitle.textContent = entry.name;
  titleDivContainer.appendChild(gameTitle);

  var heart = document.createElement('i');
  heart.className = 'fa-solid fa-heart';
  heart.id = entry.id;
  titleDivContainer.appendChild(heart);

  $codexCards.appendChild(list);
}

function createCodexPage() {
  for (var i = 0; i < data.entries.length; i++) {
    createCodex(data.entries[i]);
  }
}
createCodexPage();

var $gameList = document.querySelectorAll('.user-games');

var $editIcon = document.querySelector('.fa-pen-to-square');

var $rating = document.querySelectorAll('.fa-star');
var $status = document.querySelector('.button-status');
var $notes = document.querySelector('.p-notes');
var $links = document.querySelector('.links-list');

function addLiLink(event) {
  var li = document.createElement('li');
  li.className = 'liCont';
  var a = document.createElement('a');
  a.className = 'liLink';
  li.appendChild(a);
  $links.appendChild(li);
}

/* Clicking on a tile brings up notes page */
for (var n = 0; n < $gameList.length; n++) {
  $gameList[n].addEventListener('click', handleTiles);
}

function handleTiles(event) {
  if (event.target.tagName !== 'I') {
    handleView('notes');
    for (var j = 0; j < data.entries.length; j++) {
      if (event.target.classList.contains(data.entries[j].id)) {
        $notesTitle.textContent = data.entries[j].name;
        $notesImg.setAttribute('src', data.entries[j].img);

        for (var y = 0; y < $rating.length; y++) {
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

          var $li = document.querySelectorAll('.liCont');
          for (var z = 0; z < $li.length; z++) {
            $li[z].remove();
          }
          for (var x = 0; x < data.entries[j].enteredNote.linkDescriptions.length; x++) {
            addLiLink();
            var $a = document.querySelectorAll('.liLink');
            $a[x].textContent = data.entries[j].enteredNote.linkDescriptions[x];
            $a[x].setAttribute('href', data.entries[j].enteredNote.linkUrls[x]);
          }
        } else {
          $status.className = 'button-status playing';
          $status.textContent = 'Playing';
          $notes.textContent = '';
          var $li2 = document.querySelectorAll('.liCont');
          for (var a = 0; a < $li2.length; a++) {
            $li2[a].remove();
          }
        }

      }
    }
  }
}

var $editImg = document.querySelector('.edit-img');
var $editTitle = document.querySelector('.edit-title');

var $editStars = document.getElementsByName('star');
var $editStatus = document.querySelector('.status-dropdown');
var $editNotes = document.querySelector('#notes');

/* Edit notes */
$editIcon.addEventListener('click', function (event) {
  handleView('edit');
  $editTitle.textContent = $notesTitle.textContent;
  $editImg.setAttribute('src', $notesImg.src);

  for (var j = 0; j < data.entries.length; j++) {
    if ($editTitle.textContent === data.entries[j].name) {
      if (data.entries[j].enteredNote !== undefined) {
        /* Stars */
        for (var s = 0; s < $editStars.length; s++) {
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
        var $list = document.querySelectorAll('.links-line');
        for (var n = 0; n < $list.length; n++) {
          $list[n].remove();
        }
        for (var l = 0; l < data.entries[j].enteredNote.linkDescriptions.length; l++) {
          createEntireLink();
          var $editDescription = document.querySelectorAll('.link-description');
          var $editUrl = document.querySelectorAll('.link-url');
          $editDescription[l].value = data.entries[j].enteredNote.linkDescriptions[l];
          $editUrl[l].value = data.entries[j].enteredNote.linkUrls[l];
        }
      }
    }
  }
});

/* Adds more links */
var $addLink = document.querySelector('.button-add-links');
var linkNumber = 0;
$addLink.addEventListener('click', function (event) {
  createEntireLink();
});

function createEntireLink() {
  createNewLink(linkNumber);
  linkNumber++;
  var $trashCans = document.querySelectorAll('.fa-trash');
  var $linksLine = document.querySelectorAll('.links-line');
  for (var t = 0; t < $trashCans.length; t++) {
    $trashCans[t].addEventListener('click', function (event) {
      for (var l = 0; l < $linksLine.length; l++) {
        if (event.target.getAttribute('linknumber') === $linksLine[l].getAttribute('linknumber')) {
          $linksLine[l].remove();
        }
      }
    });
  }
}

/* Submit */
var $submitNotes = document.querySelector('.edit-form');
$submitNotes.addEventListener('submit', function (event) {
  event.preventDefault();

  var $radio = document.getElementsByName('star');
  var checked;
  for (var s = 0; s < $radio.length; s++) {
    if ($radio[s].checked === true) {
      checked = $radio[s].value;
    }
  }

  var values = {
    rating: checked,
    status: document.forms[0].elements.status.value,
    notes: document.forms[0].elements.notes.value,
    linkDescriptions: [],
    linkUrls: []
  };

  var $linkDescription = document.querySelectorAll('.link-description');
  var $linkUrl = document.querySelectorAll('.link-url');
  for (var k = 0; k < $linkDescription.length; k++) {
    values.linkDescriptions.push($linkDescription[k].value);
    values.linkUrls.push($linkUrl[k].value);
  }

  for (var g = 0; g < data.entries.length; g++) {
    if ($editTitle.textContent === data.entries[g].name) {
      data.entries[g].enteredNote = values;
    }
  }

  handleView('codex');
  $submitNotes.reset();
});

var $linksForm = document.querySelector('.links-form');
function createNewLink(number) {

  var bothLinks = document.createElement('div');
  bothLinks.className = 'links-line';
  bothLinks.setAttribute('linkNumber', number);

  var description = document.createElement('input');
  description.setAttribute('type', 'text');
  description.setAttribute('name', 'link-description');
  description.className = 'link-description';
  description.setAttribute('placeholder', 'Link Description');
  bothLinks.appendChild(description);

  var url = document.createElement('input');
  url.setAttribute('type', 'url');
  url.setAttribute('name', 'link-url');
  url.className = 'link-url';
  url.setAttribute('placeholder', 'Link URL');
  bothLinks.appendChild(url);

  var trashIcon = document.createElement('i');
  trashIcon.className = 'fa-solid fa-trash';
  trashIcon.setAttribute('linkNumber', number);
  bothLinks.appendChild(trashIcon);

  $linksForm.appendChild(bothLinks);
}

/*
<div class="links-line">
                            <input type="text" name="link-description" class="link-description" placeholder="Link Description">
                            <input type="text" name="link-url" class="link-url" placeholder="Link URL">
                            <i class="fa-solid fa-trash"></i>
                          </div>
*/

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
  var $filledHeart = document.querySelectorAll('.fa-solid.fa-heart');
  for (var h = 0; h < $filledHeart.length; h++) {
    if (parseInt(currentHeartId) === parseInt($filledHeart[h].id)) {
      $filledHeart[h].className = 'fa-regular fa-heart';
    }
  }
  for (var i = 0; i < data.entries.length; i++) {
    if (parseInt(currentHeartId) === data.entries[i].id) {
      data.entries.splice(i, 1);
      var $toDelete = document.querySelectorAll('.user-games ');
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
var $addButton = document.querySelector('.add-button');
$addButton.addEventListener('click', function (event) {
  handleView('addGame');
});

/* Replaces placeholder image with user entered URL */
var $newImg = document.querySelector('#new-img');
var $addedImg = document.querySelector('.placeholder');
$newImg.addEventListener('input', function (event) {
  $addedImg.setAttribute('src', event.target.value);
});

/* Adds new game to local data */

var $newGameForm = document.querySelector('.add-game-form');
$newGameForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var values = {
    name: document.forms[1].elements['new-name'].value,
    img: document.forms[1].elements['new-img'].value,
    id: data.nextEntryId
  };
  data.nextEntryId += 1;
  data.entries.unshift(values);

  $addedImg.setAttribute('src', '../images/Placeholder_view_vector.svg .png');

  $newGameForm.reset();

  createSingleEntry(data.entries[0]);
  var $games3 = document.querySelectorAll('.user-games');
  $games3[0].addEventListener('click', handleTiles);
  if ($emptyCodex.className === 'empty-codex') {
    $emptyCodex.className = 'empty-codex hidden';
  }

  handleView('codex');
});

var $ulRand = document.querySelector('.ul-games-random');
function createRandEntry(entry) {
  var list = document.createElement('li');
  list.className = 'rand-game';

  var card = document.createElement('div');
  card.className = 'card';
  var cardContainer = list.appendChild(card);

  var col2 = document.createElement('div');
  col2.className = 'column-two-fifths';
  var col2div = cardContainer.appendChild(col2);

  var img = document.createElement('img');
  img.className = 'search-img';
  img.setAttribute('alt', 'image for the game');
  img.setAttribute('src', entry.header_image);
  col2div.appendChild(img);

  var col3 = document.createElement('div');
  col3.className = 'column-three-fifths card-text';
  var col3div = cardContainer.appendChild(col3);

  var titleDiv = document.createElement('div');
  titleDiv.className = 'card-title';
  var titleDivContainer = col3div.appendChild(titleDiv);

  var gameTitle = document.createElement('h2');
  gameTitle.className = 'game-title';
  gameTitle.textContent = entry.name;
  titleDivContainer.appendChild(gameTitle);

  var heart = document.createElement('i');
  heart.className = 'fa-regular fa-heart';
  heart.id = entry.appid;
  for (var i = 0; i < data.entries.length; i++) {
    if (parseInt(heart.id) === data.entries[i].id) {
      heart.className = 'fa-solid fa-heart';
    }
  }
  titleDivContainer.appendChild(heart);

  var description = document.createElement('p');
  description.className = 'description';
  description.textContent = 'Description: ' + entry.short_description;
  col3.appendChild(description);

  var release = document.createElement('p');
  release.className = 'release';
  release.textContent = 'Release: ' + entry.release_date.date;
  col3.appendChild(release);

  var genre = document.createElement('p');
  genre.className = 'genre';
  genre.textContent = 'Genre: ' + entry.genres[0].description;
  col3.appendChild(genre);

  $ulRand.appendChild(list);
}

function getRandGame() {
  var possibleGenres = ['action', 'rpg', 'strategy', 'racing', 'casual', 'puzzle'];
  var randGenreNum = Math.floor(Math.random() * possibleGenres.length);
  var randGenre = possibleGenres[randGenreNum];
  var randArrNum = Math.floor(Math.random() * 10);
  var randId = 0;

  var targetUrlRand = encodeURIComponent('https://store.steampowered.com/api/getappsingenre/?genre=' + randGenre);
  var xhrRand = new XMLHttpRequest();
  xhrRand.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrlRand);
  xhrRand.setRequestHeader('token', 'abc123');
  xhrRand.responseType = 'json';
  xhrRand.addEventListener('load', function () {
    // console.log(xhrRand.response);
    // console.log(xhrRand.response.tabs.topsellers.items[randArrNum].id);
    randId = xhrRand.response.tabs.topsellers.items[randArrNum].id;
    getRandGameData(randId);
  });
  xhrRand.send();
}

function getRandGameData(randId) {
  var targetUrlRandData = encodeURIComponent('https://store.steampowered.com/api/appdetails?appids=' + randId);

  var xhrRandData = new XMLHttpRequest();
  xhrRandData.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrlRandData);
  xhrRandData.setRequestHeader('token', 'abc123');
  xhrRandData.responseType = 'json';
  xhrRandData.addEventListener('load', function () {
    if (xhrRandData.response[randId].success === false) {
      getRandGame();
    } else {
      createRandEntry(xhrRandData.response[randId].data);
    }
    // console.log(xhrRandData.response[randId]);
  });

  xhrRandData.send();
}

/*
Need to add play status to MyCodex
Add a cancel button when in codex
Heart and save games from Random Event section
*/
