/*A simon game is a game that works on the user's memory every time he receives a sequence of clicks that he is supposed to perform and at each stage it costs him more.
We created variables to execute the game:
1. An array of the order of play of the player and the system to check later that they are compatible with each other.
2. variable disqualified, won, good, STRICT -> to notice whether the user won, that is to say, he reached the maximum level that I currently set, it is set to 5 so that we can see the result, but it can be any number.
If the user is disqualified, it means that the sequence he made is not good, we will check the check box if the STRICT mode is on, then we will allow him to continue playing, but we will not increase his score for this round.
If this mode is not active then we will send him a message according to the achievement he made.
3. We added additional variables to perform tests which queue we are now and more.
We have created different functions to execute the game like:
Game mode creates a random order that consists of the 4 colors (buttons that we have).
On the buttons we created clicking events and according to what was clicked we pushed into the sequence array what was clicked and called its corresponding function that would play the music according to what was clicked.
During the game we changed his high score in the game and also changed the color of the buttons like in a real marking game */
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
//to find the high score among all the player
const USERS_KEY = "users";
function getUserByUsername(username) {
  const users = getUsersFromLocalStorage();
  return users.find(user => user.username === username);
}
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
const username = localStorage.getItem('username');

/*adding score of the highest score player*/ 
var usernameElement = document.getElementById("username-text");
const user = getUserByUsername(username);

usernameElement.textContent = username;

let high_score_user = user.Cup_Score + user.Simon_Score;
var userScore = document.getElementById("High_Score");
userScore.textContent = high_score_user;

const highestScoringUser = getHighestScoringUser();
function displayResultMessage(result, newScore, currentScore, highestScoringUser) {
  let message = "";
  m="";
  let previousScoreMessage="";
  // Checking the result and setting the message accordingly
  if (result === "win") {
    message = `Congratulations!  `;
    m= `You have broken the Simon Game high score! 🏆`;
    previousScoreMessage =  `\n Previous High Score: ${highestScoringUser} \n Your Scoring User: ${newScore}`;

  } else if (result === "breakPersonalBest") {
    message = `Congratulations!  `;
    m="\n You've broken your personal best high score! 🎉";
    previousScoreMessage= `  Previous High Score: ${currentScore} \n Your Scoring : ${newScore}`;
  } else {
    message = `Game Over!`;
    previousScoreMessage=` <br> Your score: ${turn - 1}`;
  }
  // Create a new div element
  const modal = document.createElement("div");
  modal.classList.add("modal");

  // Create content inside the modal
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <p>${message}</p>
      <p>${m}</p>
      <p>${previousScoreMessage}</p>
    </div>
  `;

  // Append the modal to the body
  document.body.appendChild(modal);

  // Close the modal when the close button is clicked
  const closeButton = modal.querySelector(".close");
  closeButton.addEventListener("click", () => {
    modal.remove();
  });
}

function updateUserScore(username, newScore) {
  const users = getUsersFromLocalStorage();
  const userIndex = users.findIndex(user => user.username === username);

  if (userIndex === -1) {
    console.error("User not found in local storage!");
    return;
  }

  const currentUser = users[userIndex];
  const currentScore = currentUser.Simon_Score;

  if (newScore > currentScore) {
    currentUser.Simon_Score = newScore;
    saveUsersToLocalStorage(users);
    high_score_user = newScore;
    userScore.innerHTML = newScore;
    if (newScore > highestScoringUser.Simon_Score) {
      displayResultMessage("win",newScore,currentScore,highestScoringUser.Simon_Score);
    } else {
      displayResultMessage("breakPersonalBest",newScore,currentScore,highestScoringUser.Simon_Score);
    }
  } else {
    displayResultMessage("gameOver",newScore,currentScore,highestScoringUser.Simon_Score);
  }
}

/*Win*/
function winGame() {
  flashColor();
  console.log(turn);
  updateUserScore(username,turn);
  
  turnCounter.innerHTML = "WIN!";
  on = false;
  win = true;

}
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
function saveUsersToLocalStorage(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
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
    console.log(turnCounter);
    updateUserScore(username,turn);
    turnCounter.innerHTML = "Fail!";
    on = false;//end game
    fail = true;
    
    noise = false;
  }
  else if(!good&&strict){
      playerOrder = [];
      compTurn = true;
      flash = 0;
      turnCounter.innerHTML = turn;
  }
     if (turn == playerOrder.length && good && !win) {
      const users = getUsersFromLocalStorage();
      const userIndex = users.findIndex(user => user.username === username);
      const currentUser = users[userIndex];
      const currentScore = currentUser.Simon_Score;
    if (turn > currentScore) {
      userScore.innerHTML = turn;
    }
    turn++;
    playerOrder = [];
    compTurn = true;
    flash = 0;
    turnCounter.innerHTML = turn;
    intervalId = setInterval(gameTurn, 800);
  }

}

