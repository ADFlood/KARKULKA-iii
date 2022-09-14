// handlers.js

//--- Add listener for keys
window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);

//--- Add listener for mouse
window.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("mousedown", mouseDownHandler, false);
canvas.addEventListener("mouseup", mouseUpHandler, false);

//--- Add listeners for touch

// Define keyboard variables
var keyPressed = null;
var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;
var SPACE = 32;
var ESC = 27;

//--- Create control object
var control = {
	up: false,
	down: false,
	left: false,
	right: false,
	attack: false,
	attackType: 0,
	direction: {
		vertical: 0,
		horizonatal: 0,
		attack: 0
	}
};

var cursor = {
	x: 0,
	y: 0,
	clickedX: 0,
	clickedY: 0,
	click: false,
	time: 0,
	timeToClear: 50,
	makeClick: function(){
		var buttonClicked = false;
		for (var i in gameData.buttons)
		{
			if (gameData.buttons[i].cursorOver)
			{
				gameData.buttons[i].state = gameData.buttons[i].PRESSED;
				buttonClicked = true;
				break;
			}
		}
		
		if (!buttonClicked)
		{
			this.clickedX = this.x;
			this.clickedY = this.y;
		}
	}
}

function mouseMoveHandler(event)
{
  cursor.x = event.pageX - canvas.offsetLeft;
  cursor.y = event.pageY - canvas.offsetTop;
}

function mouseDownHandler(event)
{
  cursor.click = true;
  cursor.makeClick();
}

function mouseUpHandler(event)
{
  cursor.click = false;
}

function keyDownHandler(event)
{
  // click = true; // ???
  pressButton(event.keyCode);

  keyBeingPressed(event.keyCode); //???
  
  event.preventDefault();
}

function keyUpHandler(event)
{
  // click = false;
  releaseButton(event.keyCode);
  
  event.preventDefault();
}

function keyBeingPressed(keyCode)
{
	keyPressed = keyCode;
	setTimeout(function(){keyPressedInvalid();}, 60);
}

function keyPressedInvalid()
{
  keyPressed = null;
}

function pressButton(key)
{
  switch(gameData.gameState)
  {
    case "playing":
  		switch(key)
  		{	case UP: moveUpTrue(); break;
    		case DOWN: moveDownTrue(); break;
    		case LEFT: moveLeftTrue(); break;
    		case RIGHT: moveRightTrue(); break;
    		case SPACE: attackTrue(1); break;
    		case "X".charCodeAt(0): attackTrue(2); break;
        case "P".charCodeAt(0): // Pause
        case "W".charCodeAt(0): gameData.commandBuffer.push("load position"); 
        	console.log("W");
        	break;// Load saved position
          break;
    		default: break;
  		} break;
  	
  	case "pause":
  	  break;
  	
  	default:
  	  break;
  }
}

function releaseButton(key)
{
  switch(gameData.gameState)
  {
    case "playing":
  		switch(key)
  		{	case UP: moveUpFalse(); break;
    		case DOWN: moveDownFalse(); break;
    		case LEFT: moveLeftFalse(); break;
    		case RIGHT: moveRightFalse(); break;
    		case SPACE: attackFalse(); break;
    		case "X".charCodeAt(0): attackFalse(); break;
    		default: break;
  		}
  		break;	
  	default:
    	break;
  }
}

function readPlayersDecision(object)
{	
	// Up
	if (control.up && !control.down){
   	object.doY = object.UP;
  }
	// Down
	if (!control.up && control.down){
   	object.doY = object.DOWN;
  }
	// Left
	if (control.left && !control.right){
  	object.doX = object.LEFT;
  }
	// Right
	if (!control.left && control.right){
   	object.doX = object.RIGHT;
  }
    
  // Reset direction if some keys haven't been pressed
  if (!control.up && !control.down){
   	object.doY = 0;
  }
  if (!control.left && !control.right){
   	object.doX = 0;
  }
    
  // Attack
  if (control.attack){
  	object.doAttack = control.attackType;
  }
  else {
   	object.doAttack = 0;
  }
}

function moveUpTrue (){control.up = true;}
function moveDownTrue (){control.down = true;}
function moveLeftTrue (){control.left = true;}
function moveRightTrue (){control.right = true;}
function attackTrue (type){control.attack = true; control.attackType = type}

function moveUpFalse (){control.up = false;}
function moveDownFalse (){control.down = false;}
function moveLeftFalse (){control.left = false;}
function moveRightFalse (){control.right = false;}
function attackFalse (){control.attack = false;}
