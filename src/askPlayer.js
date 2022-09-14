// askPlayer.js

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