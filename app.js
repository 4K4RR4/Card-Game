/*
 * App's JavaScript code
 */

const cardList = [
  "fa-diamond",
  "fa-paper-plane-o",
  "fa-anchor",
  "fa-bolt",
  "fa-cube",
  "fa-leaf",
  "fa-bicycle",
  "fa-bomb",
];
let started = false;
let openCards = [];
let moves = 0;
let timeCount = 0;
let solvedCount = 0;
let timerPtr;
let lives = 3; // Inisialisasi jumlah nyawa
let mistakes = 0; // Inisialisasi jumlah kesalahan

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// get class value from card DOM
function getClassFromCard(card) {
  return card[0].firstChild.className;
}

// check open cards when count = 2
function checkOpenCards() {
  if (getClassFromCard(openCards[0]) === getClassFromCard(openCards[1])) {
    solvedCount++;
    openCards.forEach(function (card) {
      card.animateCss("tada", function () {
        card.toggleClass("open show match");
      });
    });
  } else {
    openCards.forEach(function (card) {
      card.animateCss("shake", function () {
        card.toggleClass("open show");
      });
    });
    mistakes++; // Menambah kesalahan
    if (mistakes === 3) {
      // Jika kesalahan mencapai 3
      lives--; // Kurangi nyawa
      updateLives(); // Update tampilan nyawa
      mistakes = 0; // Reset kesalahan
    }
    if (lives === 0) {
      // Cek jika nyawa habis
      gameOver(); // Panggil gameOver jika nyawa habis
    }
  }

  openCards = [];
  incrementMove();
  if (solvedCount === 8) {
    endGame();
  }
}

// starts the timer
function startTimer() {
  timeCount += 1;
  $("#timer").html(timeCount);
  timerPtr = setTimeout(startTimer, 1000);
}

// increment move count
function incrementMove() {
  moves += 1;
  $("#moves").html(moves);
  if (moves === 14 || moves === 20) {
    reduceStar();
  }
}

// Fungsi untuk mengupdate tampilan nyawa
function updateLives() {
  const livesDisplay = document.getElementById("livesDisplay");
  livesDisplay.innerHTML = "❤️".repeat(lives); // Update jumlah hati sesuai nyawa
}

// Fungsi untuk mengakhiri permainan saat nyawa habis
function gameOver() {
  clearTimeout(timerPtr);
  vex.dialog.confirm({
    message: `Game over! You have run out of lives. Do you want to try again?`,
    callback: function (value) {
      if (value) {
        resetGame();
      }
    },
  });
}

// event handler for when the card is clicked
function cardClick(event) {
  // check opened or matched card
  let classes = $(this).attr("class");
  if (classes.search("open") * classes.search("match") !== 1) {
    // both should be -1
    return;
  }
  // start game if needed
  if (!started) {
    started = true;
    timeCount = 0;
    timerPtr = setTimeout(startTimer, 1000);
  }
  // cards can be flipped
  if (openCards.length < 2) {
    $(this).toggleClass("open show");
    openCards.push($(this));
  }
  // check if cards match
  if (openCards.length === 2) {
    checkOpenCards();
  }
}

// create individual card element
function createCard(cardClass) {
  $("ul.deck").append(`<li class="card"><i class="fa ${cardClass}"></i></li>`);
}

// populate cards in DOM
function populateCards() {
  shuffle(cardList.concat(cardList)).forEach(createCard);
}

// reset game
function resetGame() {
  $("ul.deck").html("");
  $(".stars").html("");
  moves = -1;
  incrementMove();
  started = false;
  openCards = [];
  timeCount = 0;
  solvedCount = 0;
  lives = 3; // Reset nyawa menjadi 3
  mistakes = 0; // Reset kesalahan
  clearTimeout(timerPtr);
  $("#timer").html(0);
  updateLives(); // Tampilkan nyawa yang di-reset
  // re-setup game
  initGame();
}

// runs when game has been won
function endGame() {
  // stop timer
  clearTimeout(timerPtr);
  // show prompt
  let stars = $(".fa-star").length;
  vex.dialog.confirm({
    message: `Congrats! You just won the game in ${timeCount} seconds with ${stars}/3 star rating. Do you want to play again?`,
    callback: function (value) {
      if (value) {
        resetGame();
      }
    },
  });
}

// initialize stars display
function initStars() {
  for (let i = 0; i < 3; i++) {
    $(".stars").append(`<li><i class="fa fa-star"></i></li>`);
  }
}

// reduce star rating
function reduceStar() {
  let stars = $(".fa-star");
  $(stars[stars.length - 1]).toggleClass("fa-star fa-star-o");
}

// init game
function initGame() {
  populateCards();
  initStars();
  updateLives(); // New Code Added - Tampilkan nyawa di awal permainan
  $(".card").click(cardClick);
}

// things done after DOM is loaded for the first time
$(document).ready(function () {
  initGame();
  $("#restart").click(resetGame);
  vex.defaultOptions.className = "vex-theme-os";
  vex.dialog.buttons.YES.text = "Yes!";
  vex.dialog.buttons.NO.text = "No";
});

// load animateCss
// taken from https://github.com/daneden/animate.css/#usage
$.fn.extend({
  animateCss: function (animationName, callback) {
    var animationEnd =
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
    this.addClass("animated " + animationName).one(animationEnd, function () {
      $(this).removeClass("animated " + animationName);
      if (callback) {
        callback();
      }
    });
    return this;
  },
});

setTimeout(() => {
  document.getElementById("main-box").classList.add("hidden");
}, 3000);

document.addEventListener("DOMContentLoaded", function () {
  const playernameInput = document.getElementById("playername");
  const startgameButton = document.getElementById("startgame");
  const displayname = document.getElementById("displayname");
  const bgchangesSelect = document.getElementById("bgchanges");
  const gamearea = document.getElementById("gamearea");

  const saveName = localStorage.getItem("playername");
  if (saveName) {
    playernameInput.value = saveName;
    displayname.textContent = saveName;
  }

  const savedbackground = localStorage.getItem("background");
  if (savedbackground) {
    gamearea.style.backgroundImage = `url(${savedbackground})`;
    bgchangesSelect.value = savedbackground;
  }

  startgameButton.addEventListener("click", function () {
    const playername = playernameInput.value;

    if (playername) {
      localStorage.setItem("playername", playername);
      displayname.textContent = playername;
      alert(`Name Player ${playername} Saved!`);
    } else {
      alert("Please enter the player's name first!");
    }
  });

  const backgroundselect = document.getElementById("bgchanges");
  backgroundselect.addEventListener("change", function () {
    const selectedBackground = bgchangesSelect.value;
    gamearea.style.backgroundImage = `url(${selectedBackground})`;
    localStorage.setItem("background", selectedBackground);
  });
});
