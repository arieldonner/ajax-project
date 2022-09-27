var gameList = [];

var descriptions = [];
var releases = [];
var genres = [];
var imgs = [];

function getFeatured() {
  var targetUrl3 = encodeURIComponent('https://store.steampowered.com/api/featured');
  var xhr3 = new XMLHttpRequest();
  xhr3.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl3);
  xhr3.setRequestHeader('token', 'abc123');
  xhr3.responseType = 'json';
  xhr3.addEventListener('load', function () {
    // console.log(xhr3.response.featured_win);
    gameList.push(xhr3.response.featured_win);
    // console.log(gameList);
  });
  xhr3.send();
  for (var i = 0; i < gameList.length; i++) {
    createEntrySmall(gameList[i]);
  }
}
getFeatured();

/* Search Bar */
var $search = document.querySelector('#search');

var $searchButton = document.querySelector('.button-search');
var gameCounter = 0;
var xhrResponses;

/* Search when clicking the button */
$searchButton.addEventListener('click', function (event) {

  var targetUrl = encodeURIComponent('https://steamcommunity.com/actions/SearchApps/' + $search.value);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    $ul.className = '';
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

    var $img = document.querySelectorAll('img');
    imgs.push(xhr2.response[appId].data.header_image);

    for (var i = 0; i < $description.length; i++) {
      $description[i].textContent = 'Description: ' + descriptions[i];
      $release[i].textContent = 'Release Date: ' + releases[i];
      $genre[i].textContent = 'Genre: ' + genres[i];
      $img[i].setAttribute('src', imgs[i]);
    }

    if (gameCounter < xhrResponses.length) {
      getGameData(xhrResponses[gameCounter].appid);
    }
  });

  xhr2.send();
}

var $ul = document.querySelector('ul');

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
  heart.className = 'fa-regular fa-heart';
  titleDivContainer.appendChild(heart);

  $ul.appendChild(list);
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
