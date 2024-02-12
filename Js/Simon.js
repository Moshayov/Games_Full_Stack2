let order = [];
let playerOrder = [];
let flash;
let turn;
let good;
let compTurn;
let intervalId;
let strict = false;
let noise = true;
let on = false;
let win;
let fail;
const turnCounter = document.querySelector("#turn");
const topLeft = document.querySelector("#topleft");
const topRight = document.querySelector("#topright");
const bottomLeft = document.querySelector("#bottomleft");
const bottomRight = document.querySelector("#bottomright");
const strictButton = document.querySelector("#strict");
const onButton = document.querySelector("#on");
const startButton = document.querySelector("#start");

strictButton.addEventListener('click', (event) => {
  if (strictButton.checked == true) {
    strict = true;
  } else {
    strict = false;
  }
});

onButton.addEventListener('click', (event) => {
  if (onButton.checked == true) {
    on = true;
    turnCounter.innerHTML = "-";
  } else {
    on = false;
    turnCounter.innerHTML = "";
    clearColor();
    clearInterval(intervalId);
  }
});

startButton.addEventListener('click', (event) => {
  if (on || win) {
    play();
  }
});

function play() {
  win = false;
  fail = false;
  order = [];
  playerOrder = [];
  flash = 0;
  intervalId = 0;
  turn = 1;
  turnCounter.innerHTML = 1;
  good = true;
  for (var i = 0; i < 20; i++) {
    order.push(Math.floor(Math.random() * 4) + 1);
  }
  compTurn = true;

  intervalId = setInterval(gameTurn, 800);
}

function gameTurn() {
  on = false;

  if (flash == turn) {
    clearInterval(intervalId);
    compTurn = false;
    clearColor();
    on = true;
  }

  if (compTurn) {
    clearColor();
    setTimeout(() => {
      if (order[flash] == 1) one();
      if (order[flash] == 2) two();
      if (order[flash] == 3) three();
      if (order[flash] == 4) four();
      flash++;
    }, 200);
  }
}

function one() {
  if (noise) {
    let audio = document.getElementById("clip1");
    audio.play();
  }
  noise = true;
  topLeft.style.backgroundColor = "lightgreen";
}

function two() {
  if (noise) {
    let audio = document.getElementById("clip2");
    audio.play();
  }
  noise = true;
  topRight.style.backgroundColor = "tomato";
}

function three() {
  if (noise) {
    let audio = document.getElementById("clip3");
    audio.play();
  }
  noise = true;
  bottomLeft.style.backgroundColor = "yellow";
}

function four() {
  if (noise) {
    let audio = document.getElementById("clip4");
    audio.play();
  }
  noise = true;
  bottomRight.style.backgroundColor = "lightskyblue";
}

function clearColor() {
  topLeft.style.backgroundColor = "darkgreen";
  topRight.style.backgroundColor = "darkred";
  bottomLeft.style.backgroundColor = "goldenrod";
  bottomRight.style.backgroundColor = "darkblue";
}

function flashColor() {
  topLeft.style.backgroundColor = "lightgreen";
  topRight.style.backgroundColor = "tomato";
  bottomLeft.style.backgroundColor = "yellow";
  bottomRight.style.backgroundColor = "lightskyblue";
}

topLeft.addEventListener('click', (event) => {
  if (on) {
    playerOrder.push(1);
    check();
    one();
    if(!win || !fail) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
})

topRight.addEventListener('click', (event) => {
  if (on) {
    playerOrder.push(2);
    check();
    two();
    if(!win || !fail) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
})

bottomLeft.addEventListener('click', (event) => {
  if (on) {
    playerOrder.push(3);
    check();
    three();
    if(!win || !fail) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
})

bottomRight.addEventListener('click', (event) => {
  if (on) {
    playerOrder.push(4);
    check();
    four();
    if(!win || !fail) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
})

function check() {
  if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1])
  {
    good = false;//הוא נפסל
   
  }

  if (playerOrder.length == 5 && good) {
    winGame();
  }
//if he fail then i need to check if strict mode is on
  if (!good &&!strict) {
    flashColor();
    updateUserScore(usernameElement,turnCounter);
    console.log(turnCounter);
    turnCounter.innerHTML = "Fail!";
    on = false;//end game
    fail = true;
    setTimeout(() => {
      turnCounter.innerHTML = turn;
      clearColor();
      if (strict) {
        play();
      }/* else {
        compTurn = true;
        flash = 0;
        playerOrder = [];
        good = true;
        intervalId = setInterval(gameTurn, 800);
      }*/
    }, 800);

    noise = false;
  }

  if (turn == playerOrder.length && good && !win) {
    turn++;
    playerOrder = [];
    compTurn = true;
    flash = 0;
    turnCounter.innerHTML = turn;
    intervalId = setInterval(gameTurn, 800);
  }

}

/*adding score of the highest score player*/ 
var usernameElement = document.getElementById("username-text");
usernameElement.textContent = username;

high_score_user = user.Cup_Score + user.Simon_Score;
var userScore = document.getElementById("High_Score");
userScore.textContent = high_score_user;

//high score among all the player
const USERS_KEY = "users";

function getUsersFromLocalStorage() {
  const usersJSON = localStorage.getItem(USERS_KEY);
  return usersJSON ? JSON.parse(usersJSON) : [];
}

function getHighestScoringUser() {
  const users = getUsersFromLocalStorage();
  let highestScoringUser = null;
  let highestScore = 0;

  users.forEach(user => {
    if (user.Simon_Score > highestScore) {
      highestScore = user.Simon_Score;
      highestScoringUser = user;
    }
  });

  return highestScoringUser;
}
const highestScoringUser = getHighestScoringUser();

function updateUserScore(username, newScore) {
  const users = getUsersFromLocalStorage();
  const userIndex = users.findIndex(user => user.username === username);
  if (userIndex !== -1) {
    users[userIndex].Simon_Score = newScore;
    saveUsersToLocalStorage(users);
  }
}
/*Win*/
function winGame() {
  flashColor();
  updateUserScore(usernameElement,turnCounter);
  console.log(turnCounter);
  turnCounter.innerHTML = "WIN!";
  on = false;
  win = true;

}