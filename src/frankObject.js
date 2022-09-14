// frankObject.js

//--- Karkulka object
var karkulkaObject = Object.create(characterObject);
	gameData.objectTemplates.push(karkulkaObject);
	var player = Object.create(karkulkaObject); //???
  karkulkaObject.id = gameData.ids.KARKULKA;
  karkulkaObject.name = "Karkulka";
  karkulkaObject.imageName = "karkulkaImage";

  karkulkaObject.team = "ally";
  
  karkulkaObject.mallet = Object.create(generalSpriteObject);
  karkulkaObject.mallet.name = "mallet";
  karkulkaObject.mallet.visible = false;
  
  karkulkaObject.defaultProperties = {
  	//frameSpeed: 0.5,
  	sourceWidth: 410,
  	sourceHeight: 410,
  	width: gameData.SIZE,
  	height: gameData.SIZE,
  	ableToClimb: true,
  	ableToFall: true,
  	ableToJump: true,
  	dying: false,
  	isDead: false,
  	maxJump: gameData.SIZE,
  	climbSpeed: gameData.SIZE / 32,
  	speed: gameData.SIZE / 16,
  	jumpForce: (gameData.SIZE / 10 * 1.05) * -1,
  	colX: 0.375,
  	colXX: 0.375,
  	colY: 0.25,
  	colYY: 0.11,
  	vulnerable: true,
  	vulnerableTimer: 0,
  	updateFrame: function(object){
  		if (object.newStateStarted)
  		{
  			switch(object.stateName)
  			{
					case "throw":
						object.attack();
						break;
					case "hit":
						object.attack();
						break;
					default:
						break;
				}
				object.newStateStarted = false;
			}
			else
			{
				object.frame += object.frameSpeed;
			}
		},
		doOnLastFrame: function(object){
			if (object.frame >= object.frames)
			{
				switch(object.stateName)
				{
					case "throw":
						object.forceChangeState("idle");
						break;
					case "hit":
						object.forceChangeState("idle");
						break;
					case "hurt":
						object.forceChangeState("dead");
						break;
					case "dead":
						object.timerDead --;
						object.frame --;
						if (object.timerDead === 0)
						{
							object.isDead = true;
							object.lives --;
						}
						break;
					default:
						object.frame = 0;
						object.newStateStarted = false;
						break;
				}
			}
		},
		onCollision: function(){}	// vyresetovat, obecné platí jen pro enemy
  };
  karkulkaObject.IDLE = {
		stateName: "idle",
		row: 0,
		frames: 8,
		permissionToMove: true,
		allowedToChangeState: true,
		vx: 0,
		onGroundStatic: "",
		onGroundDynamic: "",
		outGround: "fall"
	};
	karkulkaObject.WALK = {
		stateName: "walk",
		row: 2,
		frames: 6,
		permissionToMove: true,
		allowedToChangeState: true,
		onGroundStatic: "",
		onGroundDynamic: "",
		outGround: "fall"
	};
	karkulkaObject.JUMP = {
		stateName: "jump",
		row: 4,
		frames: 4,
		permissionToMove: true,
		allowedToChangeState: false,
		vy: karkulkaObject.defaultProperties.jumpForce,
		onGroundStatic: "idle",
		onGroundDynamic: "walk",
		outGround: ""
	};
	karkulkaObject.FALL = {
		stateName: "fall",
		row: 0,
		frames: 8,
		permissionToMove: true,
		allowedToChangeState: false,
		vx: 0,
		//accelerationX: 0,
		onGroundStatic: "idle",
		onGroundDynamic: "idle",
		outGround: ""
	};
	karkulkaObject.THROW = {
		stateName: "throw",
		row: 6,
		frames: 4,
		permissionToMove: false,
		allowedToChangeState: false,
		vx: 0,
		accelerationX: 0,
		onGroundStatic: "",
		onGroundDynamic: "",
		outGround: "",
		condition: function(object){
			return (object.ableToAttack);
		}
	};
	karkulkaObject.HIT = {
		stateName: "hit",
		row: 8,
		frames: 4,
		permissionToMove: false,
		allowedToChangeState: false,
		vx: 0,
		accelerationX: 0,
		onGroundStatic: "",
		onGroundDynamic: "",
		outGround: ""
	};
	karkulkaObject.HURT = {
		stateName: "hurt",
		row: 10,
		frames: 4,
		permissionToMove: false,
		allowedToChangeState: false,
		vx: 0,
		accelerationX: 0,
		onGroundStatic: "",
		onGroundDynamic: "",
		outGround: "",
		gravity: 0 // trochu nouzovka
	};
	karkulkaObject.DEAD = {
		stateName: "dead",
		row: 12,
		frames: 8,
		permissionToMove: false,
		allowedToChangeState: false,
		vx: 0,
		accelerationX: 0,
		timerDead: 10,
		onGroundStatic: "",
		onGroundDynamic: "",
		outGround: "",
		gravity: 0 // trochu nouzovka
	};
	
	karkulkaObject.defaultState = "idle";
  
  karkulkaObject.adjustProperties = function()
  {
  	this.mallet.collisionWidth = this.collisionWidth / 2;
  	this.mallet.collisionHeight = this.collisionHeight;
  };
  karkulkaObject.ableToAttack = function()
  {
  	var ableToAttack = true;
  	
  	switch(this.doAttack)
		{
			case 1:
				// podmínka na mít co hodit
				//this.changeState("throw");
				break;
			case 2:
				//this.changeState("hit");
				break;
			default:
				break;
		}
		
  	return ableToAttack;
  };
  karkulkaObject.setAttack = function()
  {
  	switch(this.doAttack)
		{
			case 1:
				this.changeState("throw");
				break;
			case 2:
				this.changeState("hit");
				break;
			default:
				console.log("chyba");
				break;
		}
  };
  karkulkaObject.attack = function()
  {
  	switch(this.stateName)
  	{
	  	case "throw":
	  		break;
	  	case "hit":
	  		this.attackHit();
	  		break;
	  	default:
	  		console.log("nemelo by nastat");
	  		break;
  	}
  };
  karkulkaObject.attackHit = function()
  {
  	this.mallet.x = this.centerX()
  		+ facingDirection(this) * (this.halfWidth() * 2)
  		+ Math.min(facingDirection(this), 0) * this.mallet.collisionWidth;
  	this.mallet.y = this.collisionY();
  	
  	var array = getSubArray(this.mallet, "characters");
  	var charactersHit = checkCollisionWithArray(this.mallet, array);
  	checkObjectsHit(this, charactersHit, this.mallet);
  	
  	var array = getSubArray(this.mallet, "objects");
  	var itemsHit = checkCollisionWithArray(this.mallet, array);
  	checkObjectsHit(this, itemsHit, this.mallet);
  };
  
  // In case object is not controlled by player
  karkulkaObject.controlPlayer = false;
  karkulkaObject.targetObject = {
  	x: 0,
  	y: 0,
  	centerX: function(){return this.x;},
  	centerY: function(){return this.y;}
  };
  karkulkaObject.targetMet = false;
  karkulkaObject.nonplayerDecision = "";
  karkulkaObject.tasks = [];
  karkulkaObject.considerSpecialCondition = function(){
  	this.directToTargetObject();
  	if (this.health <= 0){this.nonplayerDecision = "stop";}
   	return this.nonplayerDecision;
  };
  karkulkaObject.checkDistance = function(){
  	var goAhead = true;
  	
  	var distanceX = this.targetObject.centerX() - this.x;
		if (Math.abs(distanceX) > this.distance * gameData.SIZE)
		{
			if (distanceX * facingDirection(this) < 0) // není tím smìrem
			{
				goAhead = false;
			}
		}
		
		return goAhead;
  };
  karkulkaObject.directToTargetObject = function()
	{
		var distanceX = this.targetObject.centerX() - this.centerX();
		var distanceY = this.targetObject.centerY() - this.centerY();
		
		if (Math.abs(distanceX) < gameData.TILESIZE / 5
		 && Math.abs(distanceY) < gameData.TILESIZE / 2)
		{
			//alignObjectsCentre(this, this.targetObject);
			this.targetMet = true;
			this.nonplayerDecision = "stop";
		}
		else
		{
			this.targetMet = false;
			
			if (Math.abs(distanceX) > Math.abs(distanceY))
			{
				if (distanceX > 0)
				{
					this.nonplayerDecision = "right";
				}
				else
				{
					this.nonplayerDecision = "left";
				}
			}
			else
			{
				if (distanceY > 0)
				{
					this.nonplayerDecision = "continue";
				}
				else
				{
					this.nonplayerDecision = "jump";
				}
			}
		}
	};
  
//--- Turtle object
var turtleObject = Object.create(characterObject);
	gameData.objectTemplates.push(turtleObject);
  turtleObject.id = gameData.ids.TURTLE;
  turtleObject.name = "turtle";
  turtleObject.imageName = "turtleImage";
   
  turtleObject.defaultProperties = {
  	sourceWidth: 256,
  	sourceHeight: 256,
  	width: gameData.SIZE * 0.75,
  	height: gameData.SIZE * 0.75,
  	colX: 0.1,
  	colXX: 0.1,
  	colY: 0.33,
  	colYY: 0.24,
  	distance: 5,
  	speed: gameData.SIZE / 128,
  	maxJump: gameData.SIZE,
  	doOnLastFrame: function(object){
			if (object.frame >= object.frames)
			{
				switch(object.stateName)
				{
					case "dead":
						object.timerDead --;
						object.frame --;
						if (object.timerDead === 0)
						{
							object.forceChangeState("jump");
						}
						break;
					default:
						object.frame = 0;
						object.newStateStarted = false;
						break;
				}
			}
		}
  };
  turtleObject.IDLE = {
		stateName: "idle",
		row: 0,
		frames: 5,
		permissionToMove: true,
		allowedToChangeState: true,
		vx: 0,
		onGroundStatic: "",
		onGroundDynamic: "",
		outGround: "idle"
	};
	turtleObject.WALK = {
		stateName: "walk",
		row: 2,
		frames: 5,
		permissionToMove: true,
		allowedToChangeState: true,
		onGroundStatic: "",
		onGroundDynamic: "",
		outGround: "idle"
	};
	turtleObject.JUMP = {
		stateName: "jump",
		row: 2,
		frames: 5,
		permissionToMove: true,
		allowedToChangeState: false,
		ableToJump: true,
		vy: gameData.SIZE / -32,
		onGroundStatic: "idle",
		onGroundDynamic: "walk",
		outGround: "",
		unchangeState: function(object){
			object.ableToJump = false;
			object.unchangeState = function(){};
		}
	};
	turtleObject.DEAD = {
		stateName: "dead",
		row: 4,
		frames: 5,
		permissionToMove: false,
		//allowedToChangeState: false,
		vx: 0,
		accelerationX: 0,
		timerDead: 60,
		colXX: 0.33,
		onGroundStatic: "",
		onGroundDynamic: "",
		outGround: "",
		adjustState: function(object){
			setCollisions(object);
		},
		unchangeState: function(object){
			object.colXX = object.defaultProperties.colXX;
			setCollisions(object);
			object.adjustState = function(){};
			object.unchangeState = function(){};
		}
	};
  turtleObject.isHit = function(){
  	this.changeState("dead");
  	console.log("turtle should be dead", this.stateName);
  };

  
//--- Bee object
var beeObject = Object.create(characterObject);
	gameData.objectTemplates.push(beeObject);
  beeObject.id = gameData.ids.BEE;
  beeObject.name = "bee";
  beeObject.imageName = "beeImage";
    
  beeObject.defaultProperties = {
  	sourceWidth: 256,
  	sourceHeight: 256,
  	width: gameData.SIZE * 0.55,
  	height: gameData.SIZE * 0.55,
  	colX: 0.25,
  	colXX: 0.25,
  	colY: 0.25,
  	colYY: 0.25,
  	speed: gameData.SIZE / 32,
  	gravity: 0
  };
  beeObject.FLY = {
		stateName: "fly",
		row: 0,
		frames: 5,
		permissionToMove: true,
		allowedToChangeState: true
	};
	beeObject.defaultState = "fly";//beeObject.FLY;
	beeObject.decideDirection = function(object){
		var decision = "continue";
		
		var conB = checkFreeWayAhead(object);
  	var conC = object.checkDistance(object);
  	
  	if(object.vx === 0)
  	{
  		decision = "go";
  	}
  	
  	if(!conB || !conC)
  	{
  		decision = "back";
  	}
  	
  	object.transformIntoVector(object, decision);
	};
  
  
//--- Ghost object
var ghostObject = Object.create(characterObject);
	gameData.objectTemplates.push(ghostObject);
  ghostObject.id = gameData.ids.GHOST;
  ghostObject.name = "ghost";
  ghostObject.imageName = "ghostImage";
  
  ghostObject.defaultProperties = {
  	frameSpeed: 0.5,
  	sourceWidth: 256,
  	sourceHeight: 256,
  	width: gameData.SIZE / 2,
  	height: gameData.SIZE / 2,
  	colX: 0.25,
  	colXX: 0.25,
  	colY: 0.125,
  	colYY: 0.125,
  	speed: gameData.SIZE / 64,
  	gravity: 0,
  	freeMove: true,
  	distance: 5
  };
  ghostObject.FLY = {
		stateName: "fly",
		row: 0,
		frames: 3,
		permissionToMove: true,
		allowedToChangeState: true
	};
	ghostObject.defaultState = "fly";
	ghostObject.decideDirection = function(object){
		var decision = "continue";
		
  	var conC = object.checkDistance(object);
  	
  	if(object.vx === 0)
  	{
  		decision = "go";
  	}
  	
  	if(!conC)
  	{
  		decision = "back";
  	}
  	
  	if (object.x < gameData.TILESIZE || object.x > levelData.worldWidth - gameData.SIZE)
  	{
  		decision = "back";
  	}
  	
  	object.transformIntoVector(object, decision);
	};
  
	
//--- Spider object
var spiderObject = Object.create(characterObject);
	gameData.objectTemplates.push(spiderObject);
  spiderObject.id = gameData.ids.SPIDER;
  spiderObject.name = "spider";
  spiderObject.imageName = "spiderImage";
  
  spiderObject.defaultProperties = {
  	sourceWidth: 256,
  	sourceHeight: 256,
  	width: gameData.SIZE / 2,
  	height: gameData.SIZE / 2,
  	colX: 0.25,
  	colXX: 0.25,
  	colY: 0.125,
  	colYY: 0.125,
  	speed: 2,
  	gravity: 0,
  	timer: 0,
	  timerMin: 50,
	  timerMax: 150,
	  readyToChangeState: false,
	  doOnLastFrame: function(object){
			if (object.frame === object.frames)
			{
				object.frame = 0;
				if(object.readyToChangeState)
				{
					switch(object.stateName)
					{
						case "wait":
							object.changeState("climb down");
							break;
						case "climb up":
							object.changeState("wait");
							break;
						case "climb down":
							object.changeState("climb up");
							break;
						default:
							break;
					}
				}
			}
		}
  };
  spiderObject.CLIMBUP = {
		stateName: "climb up",
		row: 0,
		frames: 5,
		speed: 0.5,
		permissionToMove: true,
		allowedToChangeState: true,
		readyToChangeState: false
	};
	spiderObject.CLIMBDOWN = {
		stateName: "climb down",
		row: 0,
		frames: 5,
		speed: 2,
		permissionToMove: true,
		allowedToChangeState: true,
		readyToChangeState: false
	};
	spiderObject.WAIT = {
		stateName: "wait",
		row: 0,
		frames: 5,
		speed: 0,
		timer: 0,
		permissionToMove: false,
		allowedToChangeState: true,
		readyToChangeState: false
	};
	spiderObject.defaultState = "wait";
	spiderObject.adjustProperties = function(){
		// Move spider down and adjust default position
		this.y += this.collisionHeight;
		this.defaultY = this.y;
		
		// Attach a rope to the spider
		var rope = Object.create(gameObject);	// NEŠLO BY NÌJAK UNIVERZÁLNÌJI?
			rope.id = this.id - 1;
			rope.name = "rope";
			rope.sourceWidth = 256;
			rope.sourceHeight = 1;
			rope.width = this.width;
			rope.imageName = "ropeImage";
			findSourceImage(rope);
			rope.spiderObject = this;
			rope.x = this.centerX() - rope.width / 2;
			rope.y = this.y;
			rope.action = function(){
				this.x = this.spiderObject.x;
				this.height = Math.max(1, this.spiderObject.y + this.spiderObject.height * 0.75 - this.y);
				this.sourceHeight = Math.max(1, this.height * (this.sourceWidth / this.width));
			};
		levelData.levelObjects.push(rope);
		pushIntoArrayAndSortById(levelData.spritesToRender, rope);
	};
	spiderObject.makeDecision = function(){
		var decision = "continue";
		switch(this.stateName)
		{
			case "wait":
				if (this.timer === 0 && !this.readyToChangeState)
				{
					setObjectTimer(this);
				}
				this.timer --;
				if (this.timer <= 0)
				{
					this.readyToChangeState = true;
				}
				break;
			case "climb down":
				decision = "down";
				if (this.vy > 0 && this.y < this.previousY)
				{
					this.readyToChangeState = true;
				}
				break;
			case "climb up":
				decision = "up";
				if (this.y <= this.defaultY)
				{
					this.readyToChangeState = true;
				}
				break;
			default:
				break;
		}
		this.transformIntoVector(this, decision);
	};


//--- Slime object
var slimeObject = Object.create(characterObject);
	gameData.objectTemplates.push(slimeObject);
  slimeObject.id = gameData.ids.SLIME;
  slimeObject.name = "slime";
  slimeObject.imageName = "slimeImage";
  
  slimeObject.defaultProperties = {
  	sourceWidth: 256,
  	sourceHeight: 512,
  	width: gameData.SIZE / 2,
  	height: gameData.SIZE,
  	colX: 0.2,
  	colXX: 0.2,
  	frameSpeed: 0.5,
  	timer: 0,
  	timerMin: 50,
  	timerMax: 150,
  	readyToChangeState: false,
  	moveDirection: 1,
  	speed: 1,
  	doOnLastFrame: function(object){
			if (object.frame >= object.frames)
			{
				object.frame = 0;
				if (object.readyToChangeState)
				{
					switch(object.stateName)
					{
						case "idle":
							object.moveDirection *= -1;
							object.changeState("hop");
							break;
						case "hop":
							object.changeState("idle");
							break;
						default:
							break;
					}
				}
			}
		}
  };
  slimeObject.IDLE = {
		stateName: "idle",
		row: 0,
		frames: 5,
		permissionToMove: false,
		allowedToChangeState: true,
		readyToChangeState: false,
		timer: 0
	};
	slimeObject.HOP = {
		stateName: "hop",
		row: 0,
		frames: 10,
		permissionToMove: true, // zvážít, kdyby se mìl hýbat do stran
		allowedToChangeState: true,
		readyToChangeState: false
	};
	//slimeObject.defaultState = "idle";//?? slimeObject.IDLE;
	slimeObject.makeDecision = function(){
		switch(this.stateName)
		{
			case "idle":
				if(this.timer === 0 && !this.readyToChangeState)
				{
					setObjectTimer(this);
				}
				this.timer --;
				if (this.timer <= 0)
				{
					this.readyToChangeState = true;
				}
				break;
			case "hop":
				{
					this.readyToChangeState = true;
				}
				break;
			default:
				break;
		}
		
		var index = Math.min(Math.floor(this.frame), this.collisionTab.length);
		this.vx += this.collisionTab[index][3] * this.moveDirection * this.speed;
	};
	slimeObject.action = function(object){
		object.updateFrame(object);
		object.doOnLastFrame(object);
		object.changeCollisionArea();
	};
	slimeObject.collisionTab = [
		// colY, colYY, gravity Y/N, move Y/N
		[0.75, 0.03, 1, 0],
		[0.75, 0.03, 1, 0],
		[0.75, 0.03, 1, 0],
		[0.75, 0.03, 1, 0],
		[0.75, 0.03, 1, 0],
		[0.55, 0.25, 0, 1],
		[0.30, 0.47, 0, 1],
		[0.30, 0.44, 0, 1],
		[0.60, 0.03, 1, 0],
		[0.75, 0.03, 1, 0]
	];
	slimeObject.changeCollisionArea = function(){
		var index = Math.min(Math.floor(this.frame), this.collisionTab.length);

		this.colY = this.collisionTab[index][0];
		this.colYY = this.collisionTab[index][1];
		this.gravity = gameData.GRAVITY * this.collisionTab[index][2]; 
		setCollisions(this);
	};