/*User login to the system
If the user exists, he will have the option to log in by username and password, if he does not have the option to register in the system.
When registering for the system, we checked whether the user already exists, if so, a message was issued to the user. If you do not check whether the passwords match, since this is the registration, there is a check that the password and the verification of the password match.
When a user logs in there are some tests we did:
1. That the username exists in the system.
2. That the password and username match
3. Checking if this is not the first time he logged in, then we will print him the last time he logged in.
4. Testing whether trying to enter more information times then we will block.
5. Updating the last entered date and the amount of entries */
class User {
  constructor(username, password, Simon_Score = 0, Cup_Score = 0,count=1,currentDate=new Date() ) {
    let Date_ = currentDate.toUTCString();
    this.currentDate=Date_;
    this.username = username;
    this.password = password;
    this.Simon_Score = Simon_Score;
    this.Cup_Score = Cup_Score;
    this.count = count;
  }
}
const USERS_KEY = "users";

function displayDateMessage(date) {
  let message = "";
  message = `Last Login: ${date}`;
  // Create a new div element
  const modal = document.createElement("div");
  modal.classList.add("modal");

  // Create content inside the modal
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <p>${message}</p>
    </div>
  `;

  // Append the modal to the body
  document.body.appendChild(modal);
  // Close the modal when the close button is clicked
  const closeButton = modal.querySelector(".close");
   closeButton.addEventListener("click", () => {
    window.location.href = "Games_Home.html";
  });

}
function updateUser(username,Date) {
  const users = getUsersFromLocalStorage();
  const userIndex = users.findIndex(user => user.username === username);

  const currentUser = users[userIndex];
   currentUser.Date = Date;
   currentUser.count = currentUser.count++;
}

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
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  signupBtn = document.querySelector("#signup"),
  loginBtn = document.querySelector("#login"),
  pwShowHide = document.querySelectorAll(".pw_hide"),
  loginButton = document.querySelector("#login_now"),
  signup_Button = document.querySelector("#signup_Now");
  document.addEventListener("DOMContentLoaded", showHome);
const EXPMINUTES=2;
let numOfTry=0;

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
  let timeExp= isBlocked();
  if(timeExp!==-1){
    // Convert milliseconds to seconds
    var seconds = Math.floor((timeExp / 1000) % 60);
    // Convert milliseconds to minutes
    var minutes = Math.floor(timeExp / (1000 * 60));
    alert(`Too many attempts Try again in ${minutes} minutes and ${seconds} seconds`);
    return;
  }
  let usernameValue =  document.querySelector("#username").value.trim();
  let passwordValue = document.querySelector("#password_login").value.trim();

  if (!usernameValue || !passwordValue) {
    alert("Please enter username and password.");
    return;
  }

  if (authenticateUser(usernameValue, passwordValue)) {
      localStorage.setItem('username', usernameValue);
      const users = getUsersFromLocalStorage();
      const userIndex = users.findIndex(user => user.username === usernameValue);
      const currentUser = users[userIndex];
      // קבלת מידע על הזמן הנוכחי
      const currentDate = new Date();
      if(currentUser.count==0){
        updateUser(usernameValue,currentDate);
        window.location.href = "Games_Home.html";
      }
      updateUser(usernameValue,currentDate);
      displayDateMessage(currentUser.currentDate);

  } 
  else {
      numOfTry++;
      if(numOfTry>=3){
        setLocalStorageExpiration('blocked',EXPMINUTES);
        numOfTry=0;
        alert(`Too many attempts Try again in ${EXPMINUTES} minutes`);
      }
      else{
        alert("Invalid username or password. Please try again.");
      }
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


// Function to set a variable in local storage with expiration time
function setLocalStorageExpiration(key, expirationMinutes) {
  const now = new Date();
  const expiration = now.getTime() + (expirationMinutes * 60 * 1000); // Convert minutes to milliseconds
  localStorage.setItem(key, expiration);
}

// Function to check if the user is blocked (if not return -1 if blocked return the timne left)
function isBlocked() {
  const expiration = localStorage.getItem('blocked');
  if (!expiration) {
      return -1; // Return true if the key doesn't exist (expired)
  }
  const now = new Date();
  if(now.getTime() >= parseInt(expiration)){
    return -1;
  }
  return parseInt(expiration) - now.getTime();
}