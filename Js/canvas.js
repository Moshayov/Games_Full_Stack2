////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);	
}

var canvasContainer, cupContainer, shadowContainer, mainContainer, gameContainer, resultContainer;
var background, logo, buttonStart, ball, stageTxt, instructionTxt, buttonFacebook, buttonTwitter, buttonWhatsapp, stageResultTxt, shareResultTxt;

$.cups={};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	cupContainer = new createjs.Container();
	shadowContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	
	background = new createjs.Bitmap(loader.getResult('background'));
	logo = new createjs.Bitmap(loader.getResult('logo'));
	
	buttonStart = new createjs.Text();
	buttonStart.font = "50px geosanslightregular";
	buttonStart.color = "#ffffff";
	buttonStart.text = startButtonText;
	buttonStart.textAlign = "center";
	buttonStart.textBaseline='alphabetic';
	buttonStart.x = canvasW/2;
	buttonStart.y = canvasH/100*92;
	buttonStart.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(-200, -30, 400, 40));
	
	for(n=0;n<cup_arr.length;n++){
		$.cups[n] = new createjs.Bitmap(loader.getResult('cup'));
		centerReg($.cups[n]);
		$.cups[n].regY = 295;
		$.cups[n].x = cup_arr[n].x;
		$.cups[n].y = cup_arr[n].y;
		cupContainer.addChild($.cups[n]);
		
		$.cups['s'+n] = new createjs.Bitmap(loader.getResult('shadow'));
		centerReg($.cups['s'+n]);
		$.cups['s'+n].x = cup_arr[n].x;
		$.cups['s'+n].y = cup_arr[n].y;
		shadowContainer.addChild($.cups['s'+n]);
		
		gameData.array.push(n);
	}
	updateCups();
	
	ball = new createjs.Bitmap(loader.getResult('ball'));
	centerReg(ball);
	ball.regY = 96;
	
	buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
	centerReg(buttonFacebook);
	buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
	centerReg(buttonTwitter);
	buttonWhatsapp = new createjs.Bitmap(loader.getResult('buttonWhatsapp'));
	centerReg(buttonWhatsapp);
	
	stageTxt = new createjs.Text();
	stageTxt.font = "80px geosanslightregular";
	stageTxt.color = "#ffffff";
	stageTxt.text = stageText;
	stageTxt.textAlign = "center";
	stageTxt.textBaseline='alphabetic';
	stageTxt.x = canvasW/2;
	stageTxt.y = canvasH/100*15;
	
	instructionTxt = new createjs.Text();
	instructionTxt.font = "50px geosanslightregular";
	instructionTxt.color = "#ffffff";
	instructionTxt.text = instructionText;
	instructionTxt.textAlign = "center";
	instructionTxt.textBaseline='alphabetic';
	instructionTxt.x = canvasW/2;
	instructionTxt.y = canvasH/100*23;
	instructionTxt.alpha = 0;
	
	buttonFacebook.x = canvasW/100 * 40;
	buttonTwitter.x = canvasW/2;
	buttonWhatsapp.x = canvasW/100 * 60;
	
	buttonFacebook.y = buttonTwitter.y = buttonWhatsapp.y = canvasH/100 * 27;
	
	stageResultTxt = new createjs.Text();
	stageResultTxt.font = "80px geosanslightregular";
	stageResultTxt.color = "#ffffff";
	stageResultTxt.text = stageText;
	stageResultTxt.textAlign = "center";
	stageResultTxt.textBaseline='alphabetic';
	stageResultTxt.x = canvasW/2;
	stageResultTxt.y = canvasH/100*15;
	
	shareResultTxt = new createjs.Text();
	shareResultTxt.font = "40px geosanslightregular";
	shareResultTxt.color = "#ffffff";
	shareResultTxt.text = shareText;
	shareResultTxt.textAlign = "center";
	shareResultTxt.textBaseline='alphabetic';
	shareResultTxt.x = canvasW/2;
	shareResultTxt.y = canvasH/100*21;
	
	buttonReplay = new createjs.Text();
	buttonReplay.font = "50px geosanslightregular";
	buttonReplay.color = "#ffffff";
	buttonReplay.text = replayButtonText;
	buttonReplay.textAlign = "center";
	buttonReplay.textBaseline='alphabetic';
	buttonReplay.x = canvasW/2;
	buttonReplay.y = canvasH/100*92;
	buttonReplay.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(-200, -30, 400, 40));
	
	confirmContainer = new createjs.Container();
	optionsContainer = new createjs.Container();
	
	//option
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
	centerReg(buttonExit);
	buttonSettings = new createjs.Bitmap(loader.getResult('buttonSettings'));
	centerReg(buttonSettings);
	
	createHitarea(buttonExit);
	optionsContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonExit);
	optionsContainer.visible = false;
	
	//exit
	itemExit = new createjs.Bitmap(loader.getResult('itemExit'));
	centerReg(itemExit);
	itemExit.x = canvasW/2;
	itemExit.y = canvasH/2;
	
	buttonConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonConfirm);
	createHitarea(buttonConfirm)
	buttonConfirm.x = canvasW/100* 35;
	buttonConfirm.y = canvasH/100 * 63;
	
	buttonCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonCancel);
	createHitarea(buttonCancel)
	buttonCancel.x = canvasW/100 * 65;
	buttonCancel.y = canvasH/100 * 63;
	
	confirmMessageTxt = new createjs.Text();
	confirmMessageTxt.font = "50px geosanslightregular";
	confirmMessageTxt.lineHeight = 65;
	confirmMessageTxt.color = "#fff";
	confirmMessageTxt.textAlign = "center";
	confirmMessageTxt.textBaseline='alphabetic';
	confirmMessageTxt.text = exitMessage;
	confirmMessageTxt.x = canvasW/2;
	confirmMessageTxt.y = canvasH/100 *44;
	
	confirmContainer.addChild(itemExit, buttonConfirm, buttonCancel, confirmMessageTxt);
	confirmContainer.visible = false;
	
	mainContainer.addChild(logo, buttonStart);
	gameContainer.addChild(stageTxt, instructionTxt);
	resultContainer.addChild(stageResultTxt, buttonReplay);
	if(shareEnable){
		resultContainer.addChild(buttonFacebook, buttonTwitter, buttonWhatsapp, shareResultTxt);	
	}
	canvasContainer.addChild(background, shadowContainer, ball, cupContainer, mainContainer, gameContainer, resultContainer, confirmContainer, optionsContainer, buttonSettings);
	stage.addChild(canvasContainer);
	
	resizeCanvas();
}


/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		buttonSettings.x = (canvasW - offset.x) - 60;
		buttonSettings.y = offset.y + 45;
		
		var distanceNum = 75;
		if(curPage != 'game'){
			buttonExit.visible = false;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+(distanceNum);
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*2);
		}else{
			buttonExit.visible = true;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+(distanceNum);
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*2);
			
			buttonExit.x = buttonSettings.x;
			buttonExit.y = buttonSettings.y+(distanceNum*3);
		}
	}
}

function centerContainer(obj){
	obj.x = (windowW/2) - ((canvasW * scalePercent)/2);
	obj.y = (windowH/2) - ((canvasH * scalePercent)/2);
}

function resizeCanvasItem(){
	centerContainer(canvasContainer);
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame(event);
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
}