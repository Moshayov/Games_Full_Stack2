
function getUsersFromLocalStorage() {
    const usersJSON = localStorage.getItem(USERS_KEY);
    return usersJSON ? JSON.parse(usersJSON) : [];
  }
  
function getUserByUsername(username) {
    const users = getUsersFromLocalStorage();
    return users.find(user => user.username === username);
  }
const USERS_KEY = "users";
const username = localStorage.getItem('username');
const user = getUserByUsername(username);
var usernameElement = document.getElementById("username-text");
usernameElement.textContent = username;
high_score = user.Cup_Score + user.Simon_Score;
var userScore = document.getElementById("High_Score");
userScore.textContent = high_score;


var data = getUsersFromLocalStorage()
var maxScore = 0;
data.forEach(function(item) {
    var totalScore = item.Simon_Score + item.Cup_Score;
    if (totalScore > maxScore) {
        maxScore = totalScore;
    }
});

var generalScore = document.getElementById("General_High_Score");
generalScore.textContent = maxScore;