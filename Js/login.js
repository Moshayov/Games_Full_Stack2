class User {
  constructor(username, password, Simon_Score = 0, Cup_Score = 0) {
    this.username = username;
    this.password = password;
    this.Simon_Score = Simon_Score;
    this.Cup_Score = Cup_Score;
  }
}
const USERS_KEY = "users";

function getUsersFromLocalStorage() {
  const usersJSON = localStorage.getItem(USERS_KEY);
  return usersJSON ? JSON.parse(usersJSON) : [];
}

function saveUsersToLocalStorage(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function addUserToLocalStorage(newUser) {
  const users = getUsersFromLocalStorage();
  users.push(newUser);
  saveUsersToLocalStorage(users);
}

function authenticateUser(username, password) {
  const users = getUsersFromLocalStorage();
  return users.some(user => user.username == username && user.password == password);
}

function getUserByUsername(username) {
  const users = getUsersFromLocalStorage();
  return users.find(user => user.username === username);
}

function showHome() {
  home.classList.add("show");
}
const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  signupBtn = document.querySelector("#signup"),
  loginBtn = document.querySelector("#login"),
  pwShowHide = document.querySelectorAll(".pw_hide"),
  loginButton = document.querySelector("#login_now"),
  signup_Button = document.querySelector("#signup_Now");
document.addEventListener("DOMContentLoaded", showHome);
formOpenBtn.addEventListener("click", () => home.classList.add("show"));

pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
});

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  let usernameValue =  document.querySelector("#username").value.trim();
  let passwordValue = document.querySelector("#password_login").value.trim();

  if (!usernameValue || !passwordValue) {
    alert("Please enter username and password.");
    return;
  }

  if (authenticateUser(usernameValue, passwordValue)) {
      localStorage.setItem('username', usernameValue);
       window.location.href = "Games_Home.html";
  } 
  else {
    alert("Invalid username or password. Please try again.");
  }

});

signup_Button.addEventListener("click", (e) => {
  e.preventDefault();
  let flage= false;
  let usernameValue =  document.querySelector("#username_sign_Up").value.trim();
  let passwordValue = document.querySelector("#password_signUp").value.trim();
  let passwordConfirmValue = document.querySelector("#Confirm_password").value.trim();
  while(!flage)
  {
      let usernameValue =  document.querySelector("#username_sign_Up").value.trim();
      let passwordValue = document.querySelector("#password_signUp").value.trim();
      let passwordConfirmValue = document.querySelector("#Confirm_password").value.trim();
      console.log(usernameValue);
      console.log(passwordConfirmValue);
      console.log(passwordValue);
      if (!usernameValue || !passwordValue|| !passwordConfirmValue) {
        alert("Please enter username  password and password Confirm.");
        flage=false;
        break;
      }

      if (passwordConfirmValue != passwordValue) {
        console.log(passwordConfirmValue);
        console.log(passwordValue);
        alert("The passwords you entered do not match, please re-enter");
        
        flage=false;
        return;
      }

      // בדיקה האם המשתמש כבר קיים במערכת
      if (getUserByUsername(usernameValue)) {
        console.log(usernameValue)
        alert("Username already exists. Please choose a different one.");
        flage=false;
        return;
        }
      flage = true;
  }
  console.log(usernameValue)
  // שמירת המשתמש החדש במערכת
  const newUser = new User(usernameValue, passwordValue);
  addUserToLocalStorage(newUser);
  alert("User registered successfully!");
});
