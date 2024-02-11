var startButtonText = 'TAP TO BEGIN'; //text for start button
var stageText = 'STAGE [LEVEL]'; //stage text, [LEVEL] will replace with level number
var instructionText = 'POINT OUT WHERE THE BALL IS'; //instruction text

var cupMoveDistance = 130; //cup move distance
var openCupDistance = 150; //cup open distance

//total cup and position
var cup_arr = [{x:212,y:580},{x:512,y:600},{x:812,y:580}];

//level increase
var level_arr = {cupSpeed:.8, //starting cup move speed
				cupShuffleCount:10, //starting cup shuffle time
				level:2, //level target to increase game speed, it will multiplied for next speed eg.(4, 6, 8, 10...)
				cupSpeedDecrease:.05, //cup move speed decrease when level target reach (lower the faster)
				cupShuffleCountIncrease:2}; //cup shuffle time increase when level target reach

var replayButtonText = 'TAP TO REPLAY'; //text for replay button

var exitMessage = 'Are you sure you want\nto quit the game?'; //quit game message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
 
var playerData = {level:0};
var gameData = {cup:0, speed:1, array:[], arrayNum:0, position:[], shuffleCount:0, shuffleCountMax:0, win:false, level:0};

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		goPage('game');
	});
	
	buttonReplay.cursor = "pointer";
	buttonReplay.addEventListener("click", function(evt) {
		goPage('game');
	});
	
	//confirm
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		toggleConfirm(false);
		stopGame(true);
		goPage('main');
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		toggleConfirm(false);
	});
	
	itemExit.addEventListener("click", function(evt) {
	});
	
	//options
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		toggleConfirm(true);
		toggleOption();
	});
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainContainer.visible=false;
	gameContainer.visible=false;
	resultContainer.visible=false;
	
	stopAnimateButton(buttonStart);
	stopAnimateButton(buttonReplay);
	
	var targetContainer = ''
	switch(page){
		case 'main':
	if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
         gdsdk.showAd();
    }
			targetContainer = mainContainer;
			startAnimateButton(buttonStart);
			startShuffle();
		break;
		
		case 'game':
			targetContainer = gameContainer;
			startGame();
		break;
		
		case 'result':
			if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
         gdsdk.showAd();
    }
			targetContainer = resultContainer;
			startAnimateButton(buttonReplay);
			
			stopGame();
			saveGame(playerData.level);
		break;
	}
	
	targetContainer.visible=true;
	resizeCanvas();
}

/*!
 * 
 * START ANIMATE BUTTON - This is the function that runs to play blinking animation
 * 
 */
function startAnimateButton(obj){
	obj.alpha=0;
	$(obj)
	.animate({ alpha:1}, 500)
	.animate({ alpha:0}, 500, function(){
		startAnimateButton(obj);	
	});
}

/*!
 * 
 * STOP ANIMATE BUTTON - This is the function that runs to stop blinking animation
 * 
 */
function stopAnimateButton(obj){
	obj.alpha=0;
	$(obj)
	.clearQueue()
	.stop(true,true);
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */
function startGame(){
	gameData.shuffleCountMax = level_arr.cupShuffleCount;
	gameData.speed = level_arr.cupSpeed;
	gameData.level = level_arr.level;
	
	playerData.level = 1;
	updateStage();
	
	if(!shuffleAnimationCon){
		showHiddenBall(true);
	}else{
		shuffleCallback = true;
	}
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
         gdsdk.showAd();
    }
	TweenMax.killAll();
	for(n=0;n<cup_arr.length;n++){
		$.cups[n].x = cup_arr[n].x;
		$.cups[n].y = cup_arr[n].y;
		$.cups['s'+n].x = cup_arr[n].x;
		$.cups['s'+n].y = cup_arr[n].y;
	}
}

 /*!
 * 
 * SAVE GAME - This is the function that runs to save game
 * 
 */
function saveGame(score){
	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * SHOW HIDDEN BALL - This is the function that runs to show hidden ball animation
 * 
 */
function showHiddenBall(con){
	gameData.win = false;
	
	if(con){
		gameData.cup = Math.floor(Math.random()*cup_arr.length);
		ball.x = $.cups[gameData.cup].x;
		ball.y = $.cups[gameData.cup].y;
		ball.visible = true;	
		animateOpenCup(gameData.cup, showHiddenBallComplete);
		
	}else{
		showHiddenBallComplete();	
	}
}

/*!
 * 
 * SHOW HIDDEN BALL COMPLETE - This is the function that runs when show hidden ball animation complete
 * 
 */
function showHiddenBallComplete(){
	ball.visible = false;
	startShuffle();
}

/*!
 * 
 * START SHUFFLE - This is the function that runs to start shuffle
 * 
 */
function startShuffle(){
	gameData.shuffleCount = 0;
	shuffleArray();
	shuffleCups();
}

/*!
 * 
 * SHUFFLE CUPS - This is the function that runs to shuffle cups
 * 
 */
function shuffleCups(){
	shuffleAnimationCon = false;
	if(shuffleCallback){
		shuffleCallback = false;
		showHiddenBall(true);
		return;	
	}
	
	gameData.shuffleCount++;
	if(gameData.shuffleCount >= gameData.shuffleCountMax && curPage == 'game'){
		startAnimateButton(instructionTxt);
		toggleCupButtons(true);
		return;
	}
	animateCup($.cups[gameData.array[gameData.arrayNum]], $.cups[gameData.array[gameData.arrayNum+1]]);
	gameData.arrayNum+=2;
	
	if(gameData.arrayNum == gameData.array.length){
		shuffleArray();
	}
}

/*!
 * 
 * SHUFFLE ARRAY - This is the function that runs to shuffle array
 * 
 */
function shuffleArray(){
	gameData.arrayNum = 0;
	gameData.array = [];
	for(n=0;n<cup_arr.length;n++){
		gameData.array.push(n);
	}
	shuffle(gameData.array);
	
	if(!isEven(gameData.array.length)){
		gameData.array.push(gameData.array[0]);
	}
}

/*!
 * 
 * ANIMATE CUP - This is the function that runs to animate cups
 * 
 */
var shuffleAnimationCon = false;
var shuffleCallback = false;

function animateCup(cup1, cup2){
	shuffleAnimationCon = true;
	
	var randomSoundNum = Math.floor(Math.random()*4)+1;
	
	var centerX1 = 0;
	var centerX2 = 0;
	
	if(cup1.x > cup2.x){
		centerX1 = cup1.x+((cup2.x - cup1.x)/2);
		centerX2 = cup2.x+((cup1.x - cup2.x)/2);
	}else{
		centerX1 = cup2.x+((cup1.x - cup2.x)/2);
		centerX2 = cup1.x+((cup2.x - cup1.x)/2);
	}
	
	var moveBehindPath_arr = [{x:cup1.x, y:cup1.y}, {x:centerX1, y:cup2.y-cupMoveDistance}, {x:cup2.x, y:cup2.y}];
	TweenMax.to(cup1, gameData.speed, {bezier:{type:"quadratic", values:moveBehindPath_arr}, overwrite:true});
	
	var moveFrontPath_arr = [{x:cup2.x, y:cup2.y}, {x:centerX2, y:cup1.y+cupMoveDistance}, {x:cup1.x, y:cup1.y}];
	TweenMax.to(cup2, gameData.speed, {bezier:{type:"quadratic", values:moveFrontPath_arr}, overwrite:true, onUpdate:updateCups, onComplete:shuffleCups});
}

/*!
 * 
 * UPDATE CUPS - This is the function that runs to update cups shadow and scale
 * 
 */
function updateCups(){
	for(n=0;n<cup_arr.length;n++){
		$.cups['s'+n].x = $.cups[n].x;
		$.cups['s'+n].y = $.cups[n].y;
	}
	
	gameData.position = [];
	for(n=0;n<cup_arr.length;n++){
		gameData.position.push({id:n, position:$.cups[n].y});
	}
	
	sortOnObject(gameData.position, 'position');
	
	var scalePercent = 0;
	for(n=0;n<cup_arr.length;n++){
		cupContainer.setChildIndex($.cups[gameData.position[n].id], n);
		scalePercent = (canvasW/100 * $.cups[n].y) * .00019;
		$.cups[n].scaleX = $.cups[n].scaleY = scalePercent;
		$.cups['s'+n].scaleX = $.cups['s'+n].scaleY = scalePercent;
	}
}

/*!
 * 
 * TOGGLE CUP BUTTONS - This is the function that runs to toggle cup buttons
 * 
 */
function toggleCupButtons(con){
	if(con){
		for(n=0;n<cup_arr.length;n++){
			$.cups[n].id = n;
			$.cups[n].cursor = "pointer";
			$.cups[n].addEventListener("click", openCupEvent);
		}
	}else{
		for(n=0;n<cup_arr.length;n++){
			$.cups[n].cursor = "default";
			$.cups[n].removeEventListener("click", openCupEvent);
		}	
	}
}

/*!
 * 
 * CUP CLICK EVENT - This is the function that runs when cup is click
 * 
 */
function openCupEvent(evt){
	toggleCupButtons(false);
	stopAnimateButton(instructionTxt);
	instructionTxt.alpha = 0;
	
	ball.x = $.cups[gameData.cup].x;
	ball.y = $.cups[gameData.cup].y;	
	ball.visible = true;
	
	if(evt.target.id == gameData.cup){
		gameData.win = true;	
	}
	animateOpenCup(evt.target.id, checkResult);
}

/*!
 * 
 * OPEN CUP ANIMATION - This is the function that runs to open cup aniamtion
 * 
 */
function animateOpenCup(id, func){
	var oriY = $.cups[id].y;
	TweenMax.to($.cups[id], .5, {y:oriY - openCupDistance, overwrite:true, onUpdate:updateCupShadow, onComplete:function(){
		TweenMax.to($.cups[id], .5, {y:oriY, delay:1, overwrite:true, onUpdate:updateCupShadow, onComplete:func});	
	}});	
}

function updateCupShadow(){
	var scalePercent = 0;
	for(n=0;n<cup_arr.length;n++){
		scalePercent = (canvasW/100 * $.cups[n].y) * .00019;
		$.cups['s'+n].scaleX = $.cups['s'+n].scaleY = scalePercent;
	}	
}

/*!
 * 
 * CHECK RESULT - This is the function that runs to check result
 * 
 */
function checkResult(){
	if(gameData.win){
		playerData.level++;
		updateStage();
		
		showHiddenBall(false);	
	}else{
		animateOpenCup(gameData.cup, showResult);	
	}
}

/*!
 * 
 * SHOW FAIL RESULT - This is the function that runs to show fail result
 * 
 */
function showResult(){
		if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
         gdsdk.showAd();
    }
	goPage('result');	
}

/*!
 * 
 * UPDATE STAGE - This is the function that runs to update stage
 * 
 */
function updateStage(){

	if(playerData.level >= gameData.level){
		gameData.level += level_arr.level;
		
		gameData.shuffleCountMax += level_arr.cupShuffleCountIncrease;
		gameData.speed -= level_arr.cupSpeedDecrease;
	}
	stageTxt.text = stageResultTxt.text = stageText.replace('[LEVEL]',playerData.level);	
}

/*!
 * 
 * CONFIRM - This is the function that runs to toggle confirm
 * 
 */
function toggleConfirm(con){
	confirmContainer.visible = con;
	
	if(con){
		TweenMax.pauseAll(true, true);
		//gameData.paused = true;
	}else{
		TweenMax.resumeAll(true, true)
		//gameData.paused = false;
	}
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}
