/*
//--- Character object
var characterObject = Object.create(dynamicObject);

  // General
  characterObject.isCharacter = true;
  characterObject.isActionAble = true;
  characterObject.isColideAble = true;
  characterObject.isShootAble = true;
  characterObject.allowedToChangeState = true;
  characterObject.type = "levelObject";
  
  // Position
  characterObject.offsetY = 4;
  
  // Physics+
  characterObject.ableToClimb = false;
  characterObject.climbSpeed = 0; // u Franka 4
  characterObject.ableToFall = false; // = ableToJump
  characterObject.gravity = GRAVITY;
  
  // Direction
  characterObject.RIGHT = 1;
  characterObject.LEFT = -1;
  characterObject.DOWN = 1;
  characterObject.UP = -1;
  characterObject.facing = characterObject.RIGHT;
  characterObject.direction = {
  	horizontal: 0,
  	vertical: 0,
  	attack: 0 // 0 nic, 1 shoot, další tøeby kdyby byly další typy útoku
  	};
  
  // Specific
  characterObject.timerDead = 0;
  characterObject.ladder = null;
  //characterObject.attachedObjects = [];
  
  // Functions
  characterObject.makeDecision = function(){};
  characterObject.changeState = function(STATE)
  {
  	if (this.allowedToChangeState)
  	{
  		this.state = STATE;
  		this.stateName = this.state[0];
  		this.row = this.state[1];
  		this.frames = this.state[2];
  		this.speed = this.state[3];
  		this.collisionOffsetX = this.state[4] * PX;
  		this.collisionOffsetY = this.state[5] * PX;
  		this.collisionWidth = this.state[6] * PX;
  		this.collisionHeight = this.state[7] * PX;
	  
  		this.frame = 0;
  		this.adjustState();
	  }
	};
  characterObject.adjustState = function(){};
  characterObject.update = function()
  {
  	// Tohle si musí každá postava naprogramovat sama
    this.updateImage();
  };
  characterObject.updateImage = function()
  {
  	// Change facing
  	if (this.direction["horizontal"] != 0)
  	{
  		this.facing = Math.abs(Math.ceil(this.direction["horizontal"] / 2) - 1); // 0 = LEFT, 1 = RIGHT
  		// ještì upravit x, pokud není postava vycentrovaná
  	}
  	// je to správnì, ale spriteSheet musí být nejdøív doleva a pak doprava
  	
  	// Update image
  	this.sourceY = (this.row + this.facing) * this.sourceHeight;
    this.sourceX = this.frame * this.sourceWidth;
  }
  characterObject.setDefault = function(){
  	// tady jsem nìco chtìl a už nevím co :(
  	// setDefaultCollision(this); // to asi každá postava sama
  };
*/

/*
//--- Frank object
var frankObject = Object.create(characterObject);
	objectTemplates.push(frankObject);

  // General
  frankObject.id = FRANK;
  frankObject.name = "Frank";

  // Image
  frankObject.imageName = "Frank";
  frankObject.sourceWidth = SIZE;		//? PRYÈ
  frankObject.sourceHeight = SIZE;	// ? PRYÈ
  
  // Position
  frankObject.width = SIZE;		//?	PRYÈ
  frankObject.height = SIZE;	//?	PRYÈ
  
  frankObject.climbSpeed = SIZE / 32; // PRYÈ
  frankObject.jumpForce = -SIZE / 8; // PRYÈ
  frankObject.ableToClimb = true;
  frankObject.ableToFall = true;
  
  // Physics
  frankObject.accelerationX = 0; // je hodnota ok? (bylo 8) PRYÈ
    
  // Game variables
  frankObject.ammo = 0;
  frankObject.maxAmmo = 5;
  
  // States
  // stateName, row, frames, speed, collisionX, collisionY, collisionWidth, collisionHeight
  frankObject.IDLE = ["idle", 0, 6, 0, SIZE / 4, SIZE / 8, SIZE / 2, SIZE / 8 * 7];
  frankObject.WALK = ["walk", 2, 14, SIZE / 32, SIZE / 4 , SIZE / 8, SIZE / 2, SIZE / 8 * 7];
  frankObject.DUCK = ["duck", 4, 6, 0, SIZE / 4, SIZE / 2, SIZE / 2, SIZE / 2];
  frankObject.JUMP = ["jump", 6, 6, SIZE / 32, SIZE / 4, SIZE / 8, SIZE / 2, SIZE / 8 * 7];
  frankObject.FALL = ["fall", 0, 0, 0, 0, 0, 0, 0];
  frankObject.CLIMB = ["climb", 8, 6, 0, SIZE / 4, SIZE / 8, SIZE / 2, SIZE / 8 * 7];
  frankObject.HURT = ["hurt", 0, 0, 0, 0, 0, 0, 0];
  frankObject.DEAD = ["dead", 0, 0, 0, 0, 0, 0, 0];
  frankObject.SHOOT = ["shoot", 0, 0, 0, 0, 0, 0, 0];
  frankObject.DUCKSHOOT = ["duckshoot", 0, 0, 0, 0, 0, 0, 0];
  
  frankObject.update = function() // PRYÈ
  {
  	
  	this.frame ++;
  	switch(this.stateName)
  	{
    	case "climb":
    		if (this.vy === 0)
    		{
    			this.frame --;
    		}
    		break;
    	default:
    		break;
    }
    
    if (this.frame === this.frames)
    {
    	switch(this.stateName)
    	{
       	case "shoot":
       		this.changeState(this.IDLE);
       		break;
       	case "duckshoot":
       		this.changeState(this.DUCK);
       		break;
       	case "hurt":
       		this.changeState(this.DEAD);
       		break;
       	case "dead":
       		this.timerDead --;
       		if (this.timerDead === 0)
       		{
       			lives --;
       		}
       		break;
       	default:  // "jump", "climb"
       		this.frame = 0;
       		break;
      }
    }
    
    this.updateImage();
  }
  
  frankObject.adjustState = function() // PRYÈ
  {
  	switch(this.stateName)
  	{
    	case "walk":
    		this.permissionToMove = true;
    		this.allowedToChangeState = true;
    		//this.isOnGround = true;
    		this.vx = 0;
    		break;
    	case "jump":
    		this.permissionToMove = true;
    		this.allowedToChangeState = false;
    		//this.isOnGround = false;
    		this.vy = this.jumpForce;
    		break;
    	case "climb":
    		this.permissionToMove = true;
    		this.allowedToChangeState = false;
    		//this.isOnGround = false;
    		this.gravity = 0;
    		this.freeMove = true;
    		//this.vy = 0;
    		//this.x = this.ladder.centerX() - this.halfWidth() - this.offLeft();
    		break;
    	case "fall":
    		this.permissionToMove = true;
    		this.allowedToChangeState = false;
    		//this.isOnGround = false;
    		//this.fallingCounter = 0;
    		break;
    	case "duck":
    		this.permissionToMove = true; //bylo false; ale snad je ok speed = 0
    		this.allowedToChangeState = true;
    		//this.isOnGround = true;
    		this.vx = 0;
    		break;
    	case "shoot":
    		if (this.ammo > 0)
    		{
    			this.permissionToMove = false;
    			this.allowedToChangeState = false;
    			//this.isOnGround = true;
    			this.attack();
    		}
    		else
    		{
    			this.changeState(this.IDLE);
    		}
    		break;
    	case "duckshoot":
    		if (this.ammo > 0)
    		{
    			this.permissionToMove = false;
    			this.allowedToChangeState = false;
    			//this.isOnGround = true;
    			this.attack();
    		}
    		else
    		{
    			this.changeState(this.DUCK);
    		}
    		break;
    	case "hurt":
    		this.allowedToChangeState = false;
    		this.permissionToMove = false; //?
    		//this.isOnGround = false; //?
    		break;
    	case "dead":
    		this.allowedToChangeState = false;
    		this.permissionToMove = false;
    		//this.isOnGround = true;
    		this.timerDead = 60;
    		break;
    	case "attack":
    		this.changeState(this.SHOOT);
    		break;
    	default:	// "idle"
    		this.permissionToMove = true;
    		this.allowedToChangeState = true;
    		this.vx = 0;
    		//this.freeMove = false;
    		this.gravity = GRAVITY;
    		//this.isOnGround = true;
    		break;
    }
  };
  frankObject.attack = function(){};
  frankObject.resetObject = function() // ? // PRYÈ
  {
  	this.changeState(this.IDLE);
  	this.facing = this.RIGHT;
  	//this.gravity = GRAVITY; //?
  	this.ammo = this.maxAmmo;
  };
  frankObject.setDefault = function(){ // PRYÈ
  	this.changeState(this.IDLE);
  	this.facing = this.RIGHT;
  	this.ammo = this.maxAmmo;
  	//this.resetObject();
  };
  
*/
