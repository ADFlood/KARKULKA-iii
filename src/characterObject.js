// characterObject.js

//--- Character object
var characterObject = Object.create(generalSpriteObject);

  // General
  characterObject.isActionAble = true;
  characterObject.isColideAble = true;
  characterObject.isShootAble = true;
  characterObject.isDynamic = true;
  characterObject.allowedToChangeState = true;
  characterObject.type = "levelObjects";
  characterObject.subtype = "characters";
  characterObject.team = "enemy";
  
  characterObject.collisionX = function(){
  	// this.facing	// 0 = right, 1 = left
  	return this.x + Math.floor(this.width * 
  		(this.facing * this.colXX + makeBitValueNegative(this.facing) * this.colX));
  };                                                                            
  
  // Position
  characterObject.previousX = 0;
  characterObject.previousY = 0;
  characterObject.lastX = 0;
  characterObject.lastY = 0;
  characterObject.offsetTurningX = 0;
  characterObject.defaultX = 0;
  characterObject.defaultY = 0;
  
  // Physics+
  characterObject.vx = 0;
  characterObject.vy = 0;
  characterObject.gravity = gameData.GRAVITY;
  characterObject.speed = 0;
  characterObject.accelerationSpeed = 1;
  characterObject.accelerationX = 0;
  characterObject.accelerationY = 0;
  characterObject.climbSpeed = 0;
  characterObject.jumpForce = 0;
  characterObject.onGroundStatic = ""; 
  characterObject.onGroundDynamic = "";
  characterObject.outGround = "";
  
  characterObject.RIGHT = 1;
  characterObject.LEFT = -1;
  characterObject.DOWN = 1;
  characterObject.UP = -1;
  characterObject.facing = 0;
  // 0 = RIGHT, 1 = LEFT, -1 not set
  characterObject.doX = 0;
  characterObject.doY = 0;
  characterObject.doAttack = 0;
  
  characterObject.distance = 100;
  	
  // Other
  characterObject.timerDead = 0;
  characterObject.row = 0;
  
  characterObject.lives = 0;
  characterObject.maxHealth = 100;
  characterObject.health = 0;
  characterObject.coins = 0;
  characterObject.pickedItems = []; // mus? se restartovat pro ka?d? objekt!!!
  characterObject.pickedItemsCounter = 0;
  characterObject.maxPickedItems = 5;
  
  // Parametric adjusment
  characterObject.ableToFall = false;
  characterObject.ableToJump = false;
  characterObject.maxJump = 0;
               
  characterObject.defaultFacing = 0; // LEFT 1, RIGHT, 0
  characterObject.previousFacing = null;
  
  characterObject.ableToAttack = function(){return false;};
  characterObject.setAttack = function(){};
  characterObject.attackValue = 1;
  characterObject.effectName = "";
  
  // States
	characterObject.allStates = [];	// mus? se restartovat pro ka?d? objekt!!!
  characterObject.defaultState = "idle";
  characterObject.newStateStarted = false;
    
  // Functions
  characterObject.forceChangeState = function(stateName)
  {
  	this.allowedToChangeState = true;
  	this.changeState(stateName);
  }
  characterObject.changeState = function(stateName)
  {
  	var newState = findStateByName(this, stateName);
  	if (this.allStates.indexOf(newState) !== -1)
  	{
  		if (this.checkChangeValidity(newState) && this.allowedToChangeState)
  		{
  			this.unchangeState(this);
  			this.loadState(newState);
  			this.adjustState(this);
  			this.newStateStarted = true;
  			this.state = newState;
  			this.frame = 0;
  		}
  	}
  	else
  	{
  		console.log("chyba, state nenalezen");
  	}
	};
	characterObject.checkChangeValidity = function(STATE){
		var changeValid = true;
 		//if ("condition" in STATE)
 		//{
 		//	if (!STATE.condition)
 		//	{
 		//		changeValid = false;
 		//	}
 		//}
 		return changeValid;
	};
	characterObject.unchangeState = function(){}; // tohle d?t jako funkci pro ka?d? state
	characterObject.loadState = function(STATE){
		for (var i in STATE)
		{
			this[i] = STATE[i];
		}
	};
	characterObject.adjustState = function(){};
	characterObject.changeStateAfterHittingGround = function(){
		if (this.onGroundStatic !== "" && this.doX === 0)
		{
			this.allowedToChangeState = true;
			this.changeState(this.onGroundStatic);
		}
		if (this.onGroundDynamic !== "" && this.doX !== 0)
		{
			this.allowedToChangeState = true;
			this.changeState(this.onGroundDynamic);
		}
	};
	characterObject.changeStateAfterMissingGround = function(){
		if (this.outGround !== "")
		{
			this.allowedToChangeState = true;
			this.changeState(this.outGround);
		}
	};
  characterObject.attack = function(){};
  characterObject.isHit = function(object){};
  characterObject.onCollision = function(object){
  	if (object.team !== this.team)
  	{
  		if (this.stateName !== "dead" && object.vulnerable)
  		{
  			object.health -= this.attackValue;
  		}
  	}
  };
  characterObject.makeDecision = function(){
  	/*
  	obecn? pravidla postav
  	
  	stoj? nebo se h?bou
  	
  	pokud se h?bou
  		1 obr?ti se, nebo pokra?ovat?
	  		- ableToFall na hran? pokra?uj?, !ableToFall se obr?t?
	  		- !freeMove se p?i n?razu obr?t?, freeMove pokra?uj? 
	  		- jsou-li daleko od domova, tak se obr?t?
	  	2 pokud maj? SPECIAL CONDITION, tak j? provedou
	  		(bee zm?n? hladinu, zastaven?/?ek?n????)
	  		ty SC by ?lo na??st z katalogu??? teoreticky...
	  	3 ?pravy accX a vy/gravity? dle 1 a 2, zm?na state dle 2
	  	
  	od ?eho se odv?j? pohyb
  		- prim?rn? horizont?ln? nebo vertik?ln? (atributy doX a doY - 0 ne, 1/-1 ano)	
  	*/

  	var decision = this.decideDirection(this);
  	decision = this.considerSpecialCondition(this, decision);
  	this.transformIntoVector(this, decision);
  };
  characterObject.decideDirection = function(){
  	var decision = "continue";
  	
  	var conA = checkHardGroundAhead(this);
  	var conB = checkFreeWayAhead(this);
  	var conC = this.checkDistance(this);
  	
  	if (this.stateName === "idle")
  	{
  		decision = "go";
  	}
  	
  	if (!conA || !conB || !conC)
  	{
  		decision = "back";
  	}
  	
  	return decision;
  };
  characterObject.considerSpecialCondition = function(object, decision){return decision;};
  characterObject.transformIntoVector = function(object, decision){
  	switch(decision)
  	{
 	 		case "continue":
 	 			break;
 	 		case "back":
 	 			object.doX *= -1;
 	 			object.doY *= -1;
 	 			break;
 	 		case "go":
 	 			object.doX = facingDirection(object);
 	 			break;
 	 		case "left":
 	 			object.doX = -1;
 	 			object.doY = 0;
 	 			break;
 	 		case "right":
 	 			object.doX = 1;
 	 			object.doY = 0;
 	 			break;
 	 		case "up":
 	 			object.doX = 0;
 	 			object.doY = -1;
 	 			break;
 	 		case "down":
 	 			object.doX = 0;
 	 			object.doY = 1;
 	 			break;
 	 		case "stop":
 	 			object.doX = 0;
 	 			object.doY = 0;
 	 			break;
 	 		default:
 	 			break;
  	}
  };
  characterObject.checkDistance = function(){ // proto?e si ka?d? postava m??e po??tat distance jinak
  	var goAhead = true;
  	
  	var distanceX = this.defaultX - this.x;
		if (Math.abs(distanceX) > this.distance * gameData.SIZE)
		{
			if (distanceX * facingDirection(this) < 0) // nen? t?m sm?rem
			{
				goAhead = false;
			}
		}
		
		return goAhead;
  };
  characterObject.action = function(){
  	this.updateFrame(this);
  	this.doOnLastFrame(this);
  };
	characterObject.updateFrame = function(object){
		if (object.newStateStarted)
		{
			object.newStateStarted = false;
		}
		else
		{
			object.frame += object.frameSpeed;
		}
	};
  characterObject.doOnLastFrame = function(object){
  	if (object.frame >= object.frames)
    {
    	object.frame = 0;
      object.newStateStarted = false;
    }
  };
  characterObject.update = function(){
  	this.sourceY = (this.row + this.facing) * this.sourceHeight;
    this.sourceX = Math.floor(this.frame) * this.sourceWidth;
  }; 
  characterObject.setDefault = function(object){
  	// Load default properties
  	copyProperties(this.defaultProperties, this);
  	listAllStates(this);
  	setCollisions(this);
  	this.setDefaultPosition(object);
  	this.changeState(this.defaultState);
  	this.setFacing(object);
  	setObjectProperties(this, object);	
  	this.adjustProperties();
  	this.health = this.maxHealth;
  };
  characterObject.setDefaultPosition = function(object){
  	this.x = object.x - this.halfWidth();
  	this.y = object.y - this.collisionHeight - this.collisionOffsetY;
  	this.defaultX = this.x;
  	this.defaultY = this.y;
  };
	characterObject.setFacing = function(object)
	{
		// 0 = LEFT, 1 = RIGHT
		if (this.defaultFacing !== -1)
			{this.facing = this.defaultFacing;}
		else
			{this.facing = Math.round(Math.random());}
		
		// pokub bych cht?l zad?vat z Tiled, tak zapracovat sem
	};
	characterObject.adjustProperties = function(){};
	characterObject.perform = function(){
		// Move according to current state
		if (this.permissionToMove)
		{
			this.checkHorizontalMovement();
			this.checkVerticalMovement();
		}
		else // Clear in case this is not allowed to move
		{
			this.vy = 0;
			this.vx = 0;
			this.accelerationX = 0;
		}
		
		checkFacing(this);
		
		// React upon other decisions
		this.checkAttack();
	};
	characterObject.checkHorizontalMovement = function(){
		if (this.doX !== 0)
		{
			switch(this.stateName)
			{
				case "idle":
					this.changeState("walk");
					break;
				case "walk":
					this.accelerationX = this.doX * this.accelerationSpeed;
					break;
				case "fly":
					this.accelerationX = this.doX * this.accelerationSpeed;
					break;
				case "jump":
					this.accelerationX = this.doX * this.accelerationSpeed;
					break;
				default:
					break;
			}
		}
		else // LEFT or RIGHT haven?t been pressed
		{
			this.accelerationX = 0;
			switch(this.stateName)
			{
				case "walk":
					this.changeState("idle");
					break;
				default:
					break;
			}
		}
	};
	characterObject.checkVerticalMovement = function(){
		if (this.doY !== 0)
		{				
			switch(this.stateName)
			{
				case "idle":
					if (this.doY === -1)
						{this.changeState("jump");}
					break;
				case "walk":
					if (this.doY === -1)
						{this.changeState("jump");}
					break;
				case "climb up":
					this.accelerationY = this.doY * this.accelerationSpeed;
					break;
				case "climb down":
					this.accelerationY = this.doY * this.accelerationSpeed;
					break;
				default:
					break;
			}
		}
	};
	characterObject.checkAttack = function(){
		if (this.doAttack > 0)
		{
			this.setAttack();
			control.attack = false;
		}
	};