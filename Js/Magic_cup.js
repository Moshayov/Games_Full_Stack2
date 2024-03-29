const ball = document.querySelector('.ball');
const p = document.querySelector('p');
const cups = document.querySelectorAll('.cup');
const playButton = document.querySelector('.play-button');
const score= document.querySelector('.info h2');
const slider=  document.querySelector('.slider');
const speed_header=document.querySelector("#speed");
let mode= 'ready'
let level;
let speed;
$(document).ready(function(){

    level= 0;
    speed=1000
    score.innerHTML= `score: ${level}`;

    speed_header.innerHTML= "normal"; // Initial speed

    //Changes the speed from fast to normal and vice versa
    $("#checkbox").change(function() {
        if(this.checked) {
            speed_header.innerHTML='fast';
            speed=500;
        } else {
            speed_header.innerHTML='normal';
            speed=1000;
        }
    });

    //Set a function when the player click play
    playButton.addEventListener('click', function () {
      if(mode==='ready'){
        mode= 'play';
        playButton.style.display= 'none';
        p.innerHTML="";
        // Raise the middle cup and show the ball
        $('.cup').eq(1).animate({bottom: '20%'});
        ball.style.display = 'block';

        // After 1 second, lower the cup and hide the ball
        setTimeout(function () {
            $('.cup').eq(1).animate({bottom: 0});
            ball.style.display = 'none';
        }, 1000);

        //set interval that shuffle the cups level+8 times 
        //every so often according to the set speed
        var numberOfIterations = level+8;
        var currentIteration = 0;
        let si=null;
        clearInterval(si);
        si = setInterval(shufflesCups, speed+500);

            function shufflesCups() {
            if (currentIteration===numberOfIterations) {
                clearInterval(si);
                finishShuffle();
            } else {
                currentIteration++;
                let index=  Math.floor(Math.random() * 3);
                shuffleCups(index);
            }
            } 
        } 
        });

    //shuffle cup i and cup i+1
    function shuffleCups(i) {
        let i1= i+1;
        let i2= i1%3+1;
        // Get initial positions
        var cup1InitialLeft = $(`#cup${i1}`).position().left;
        var cup2InitialLeft = $(`#cup${i2}`).position().left;

        // Animate cup2 to cup1's position
        $(`#cup${i2}`).animate({
            left: cup1InitialLeft
        }, speed);

        // Animate cup1 to rise a little above and alternate with cup2's position
        $(`#cup${i1}`).animate({ 
            left: cup2InitialLeft
        }, speed);
    }

    //tell the user it's time to pick a cup
    function finishShuffle() {
      ball.style.left=  cups[1].style.left;
      p.innerHTML = "Tap which cup has the ball";
      mode= 'pickCup';
      
    }
  });

  //if it's time for reavel cup it checks if he picked the right cup
  //reveal the cup he pick and show message properly
  function revealCup(n){
    if(mode==='pickCup'){
        mode= 'ready';
        let ballUnderCup = n===2;

        if (ballUnderCup) {
            level++;
            score.innerHTML= `score: ${level}`;
            updateUserScore(username,level);
            $('#cup2').animate({bottom: '20%'});
            ball.style.display = 'block';
    
            // After 1.5 seconds, lower the cup and hide the ball
            setTimeout(function () {
            $('#cup2').animate({bottom: 0});
            ball.style.display = 'none';
            }, 1500);
            p.innerHTML = "Congratulations! You found the ball!";
        } else {
            $(`#cup${n}`).animate({bottom: '20%'});
    
            setTimeout(function () {
            $(`#cup${n}`).animate({bottom: 0});
            }, 1500);
            p.innerHTML = "Sorry, you didn't find the ball. Try again!";
        }
        setTimeout(function () { 
            playButton.style.display= 'block';
            p.innerHTML ='';
            }, 2500);
       
        
    }

    
}

//get the user that plays right now
const USERS_KEY = "users";
const username = localStorage.getItem('username');

function getUsersFromLocalStorage() {
    const usersJSON = localStorage.getItem(USERS_KEY);
    return usersJSON ? JSON.parse(usersJSON) : [];
  }
  
// if the user beat his own score update the local storage
function updateUserScore(username, newScore) {
    const users = getUsersFromLocalStorage();
    const userIndex = users.findIndex(user => user.username === username);
  
    if (userIndex === -1) {
      console.error("User not found in local storage!");
      return;
    }
  
    const currentUser = users[userIndex];
    const currentScore = currentUser.Cup_Score;
  
    if (newScore > currentScore) {
      currentUser.Cup_Score = newScore;
      saveUsersToLocalStorage(users);
    } 
}

function saveUsersToLocalStorage(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}