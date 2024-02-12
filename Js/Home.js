
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
document.addEventListener("DOMContentLoaded", function() {
  const headerContainer = document.getElementById("header-container");
  const headerPath = "header.html"; 

  fetch(headerPath)
    .then(response => response.text())
    .then(headerHtml => {
      headerContainer.innerHTML = headerHtml;
    });
});