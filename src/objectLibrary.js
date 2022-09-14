// object library

var uiSettings = {
	coinImg: {
		id: 8000,
		fadeStep: 1,
		positionOffsetX: 0, // kdyby bylo potøeba upravit
		positionOffsetY: 0,
		width: gameData.SIZE,		//??
		height: gameData.SIZE, //??
		sourceRow: 1,
		sourceColumn: 0
	},
	coins: {
		id: 8000,
		fadeStep: 1,
		subtype: "text",
		fontSize: Math.floor(gameData.SIZE * 0.133),//266),
		positionOffsetX: gameData.SIZE * 0.45,
		positionOffsetY: gameData.TILESIZE * 0.6,
		sourceValue: function(){return player.coins;},
		textBefore: "x "
	},
	healthEmptyImg: {
		id: 8000,
		fadeStep: 1,
		align: "top right",
		positionOffsetX: -gameData.SIZE / 10,
		positionOffsetY: -gameData.SIZE / 2.45,
		width: gameData.SIZE * 1.3,
		height: gameData.SIZE * 1.3,
		sourceRow: 1,
		sourceColumn: 4
	},
	healthImg: {
		id: 8001,
		fadeStep: 1,
		align: "top right",
		positionOffsetX: -gameData.SIZE / 10,
		positionOffsetY: -gameData.SIZE / 2.45,
		width: gameData.SIZE * 1.3,
		height: gameData.SIZE * 1.3,
		sourceRow: 1,
		sourceColumn: 5,
		defaultSourceWidth: 0,
		defaultWidth: 0,
		sourceValue: function(){return player.health;},
		adjustProperties: function(object){
			object.defaultSourceWidth = object.sourceWidth;
			object.defaultWidth = gameData.SIZE * 1.3;//object.width;
		},
		updateII: function(object){
			var index = Math.max(player.health / player.maxHealth, 0.01);
			object.sourceWidth = object.defaultSourceWidth * index;
			object.width = object.defaultWidth * index;
		}
	},
	key1: {
		id: 8000,
		value: 1,
		fadeStep: 1,
		align: "top",
		positionOffsetX: gameData.SIZE / -2,
		sourceRow: 1,
		sourceColumn: 1,
		sourceWidth: 180,
		sourceHeight: 180,
		width: gameData.SIZE / 2,
		height: gameData.SIZE / 2,
		sourceValue: function(object){
			var bool = false;
			if (levelData.keysCollected >= object.value){
				bool = true;
			}
			return bool;
		},
		updateII: function(object){
			if (object.sourceValue(object))
			{
				object.alpha = 1;
			}
			else
			{
				object.alpha = 0;
			}
		}
	},
	key2: {
		id: 8000,
		value: 2,
		fadeStep: 1,
		align: "top",
		sourceRow: 1,
		sourceColumn: 1,
		sourceWidth: 180,
		sourceHeight: 180,
		width: gameData.SIZE / 2, //??
		height: gameData.SIZE / 2, // ??
		sourceValue: function(object){
			var bool = false;
			if (levelData.keysCollected >= object.value){
				bool = true;
			}
			return bool;
		},
		updateII: function(object){
			if (object.sourceValue(object))
			{
				object.alpha = 1;
			}
			else
			{
				object.alpha = 0;
			}
		}
	},
	key3: {
		id: 8000,
		value: 3,
		fadeStep: 1,
		align: "top",
		positionOffsetX: gameData.SIZE / 2,
		sourceRow: 1,
		sourceColumn: 1,
		sourceWidth: 180,
		sourceHeight: 180,
		width: gameData.SIZE / 2, //??
		height: gameData.SIZE / 2, // ??
		sourceValue: function(object){
			var bool = false;
			if (levelData.keysCollected >= object.value){
				bool = true;
			}
			return bool;
		},
		updateII: function(object){
			if (object.sourceValue(object))
			{
				object.alpha = 1;
			}
			else
			{
				object.alpha = 0;
			}
		}
	},
	life1: {
		id: 8000,
		value: 1,
		fadeStep: 1,
		align: "top",
		positionOffsetX: gameData.SIZE,
		sourceRow: 1,
		sourceColumn: 2,
		sourceWidth: 180,
		sourceHeight: 180,
		width: gameData.SIZE / 2, //??
		height: gameData.SIZE / 2, // ??
		sourceValue: function(object){
			var bool = false;
			if (player.lives >= object.value){
				bool = true;
			}
			return bool;
		},
		updateII: function(object){
			if (object.sourceValue(object))
			{
				object.sourceX = object.defaultSourceSize * 3;
			}
			else
			{
				object.sourceX = object.defaultSourceSize * 2;
			}
		}
	},
	life2: {
		id: 8000,
		value: 2,
		fadeStep: 1,
		align: "top",
		positionOffsetX: gameData.SIZE * 1.4,
		sourceRow: 1,
		sourceColumn: 2,
		sourceWidth: 180,
		sourceHeight: 180,
		width: gameData.SIZE / 2, //??
		height: gameData.SIZE / 2, // ??
		sourceValue: function(object){
			var bool = false;
			if (player.lives >= object.value){
				bool = true;
			}
			return bool;
		},
		updateII: function(object){
			if (object.sourceValue(object))
			{
				object.sourceX = object.defaultSourceSize * 3;
			}
			else
			{
				object.sourceX = object.defaultSourceSize * 2;
			}
		}
	},
	life3: {
		id: 8000,
		value: 3,
		fadeStep: 1,
		align: "top",
		positionOffsetX: gameData.SIZE * 1.8,
		sourceRow: 1,
		sourceColumn: 2,
		sourceWidth: 180,
		sourceHeight: 180,
		width: gameData.SIZE / 2, //??
		height: gameData.SIZE / 2, // ??
		sourceValue: function(object){
			var bool = false;
			if (player.lives >= object.value){
				bool = true;
			}
			return bool;
		},
		updateII: function(object){
			if (object.sourceValue(object))
			{
				object.sourceX = object.defaultSourceSize * 3;
			}
			else
			{
				object.sourceX = object.defaultSourceSize * 2;
			}
		}
	},
	textObject: {
		id: 8999,
		fadeStep: 1,
		subtype: "text",
		align: "center",
		fontSize: Math.floor(gameData.SIZE * 0.3),
		fillStyle: "white",
		textStorage: "",
		adjustProperties: function(object){
			gameData.textObject = object;
		}
	},
	solidBackground: {
		id: 9000,
		width: canvas.width,
		height: canvas.height,
		fadeStep: 1,
		sourceColumn: 4
	},
	background: {
		id: 9000,
		width: canvas.width,
		height: canvas.height,
		sourceColumn: 4
	},
	circleIn: {
		id: 9001,
		width: gameData.SIZE * 1.5,
		height: gameData.SIZE * 1.5,
		align: "center",
		sourceColumn: 1,
		fadeStep: 1,
		updateII: function(object){
			this.height = Math.max(1, Math.floor(this.defaultSourceSize * gameData.percentage / 100));
			this.sourceHeight = this.height;
			this.y = this.defaultY + (this.defaultSourceSize - this.height);
			this.sourceY = this.defaultSourceSize - this.height;
		}
	},
	circleOut: {
		id: 9002,
		fadeStep: 1,
		width: gameData.SIZE * 1.5,
		height: gameData.SIZE * 1.5,
		align: "center",
		sourceColumn: 0
	},
	textPercentage: {
		id: 9003,
		fadeStep: 1,
		subtype: "text",
		align: "center",
		fontSize: Math.floor(gameData.SIZE * 0.077),
		sourceValue: function(){return gameData.percentage;},
		textAfter: "%"
	},
	textLoadingInfo: {
		id: 9004,
		fadeStep: 1,
		subtype: "text",
		align: "center",
		fontSize: Math.floor(gameData.SIZE * 0.055),
		offsetY: 100,
		textBefore: "",//loading data... ",
		sourceValue: function(){return gameData.consoleText;}
	}
};

var objectNames = { //???
	coins: "coin",
	collisions: "collision"
};

// U FUNKCÍ POZOR NA RELATIVNÍ ODKAZY NA PÙVODNÍ OBJEKT !!!
var objectSettings = {
	coin: {
		template: "gameObject",
		name: "coin",
		id: gameData.ids.GENERALOBJECT,
		alignStyle: "center",
		colWidth: 0.5,
		colHeight: 0.4,
		pickable: true,
		valuegiving: true,
		value: 1,
		valueTotal: 1,
		animated: true,
		frames: 4,
		frameSpeed: 1/3,
		randomStartFrame: true
		},
	health: {
		template: "gameObject",
		name: "health",
		id: gameData.ids.GENERALOBJECT,
		colWidth: 0.4,
		colHeight: 0.4,
		pickable: true,
		healthgiving: true
		},
	box: {
		template: "gameObject",
		name: "box",
		colWidth: 0.7,
		colHeight: 0.7,
		subtype: "collisions",
		isColideAble: true
	},
	boxItem: {
		template: "gameObject",
		name: "boxItem",
		id: gameData.ids.GENERALOBJECT,
		colWidth: 0.7,
		colHeight: 0.7,
		isColideAble: true,
		isShootAble: true,
		pickable: true, // aby zmizela po rozbití
		permittedObjects: ["mallet"],
		effectName: "explosion"
	},
	treasure: {
		template: "gameObject",
		id: gameData.ids.GENERALOBJECT,
		name: "treasure",
		effectName: "moneyBagFound",
		colWidth: 0.8,
		colHeight: 0.6,
		valuegiving: true,
		value: 1,
		valueTotal: 1,
		isShootAble: true,
		permittedObjects: ["mallet"],
		doSomethingSpecial: function(object){
			object.frame ++;
			object.frame = Math.min(object.frame, 1);
		}
	},
	key: {
		template: "gameObject",
		id: gameData.ids.GENERALOBJECT,
		name: "key",
		colWidth: 0.5,
		colHeight: 0.25,
		pickable: true,
		collectable: true,
		doSomethingSpecial: function(object){
			levelData.keysCollected ++;
		}
	},
	shield: {
		template: "gameObject",
		id: gameData.ids.GENERALOBJECT,
		name: "shield",
		colWidth: 0.5,
		colHeight: 0.25,
		pickable: true,
		collectable: true,
		timer: 120,
		counter: 0,
		doSomethingSpecial: function(object){
			player.vulnerableTimer = object.timer;
			player.effectName = "shield";
			createEffect(player); // trochu nesystémové, že sem jde na tvrdo player a ne character
		},
		action: function(object){
		}
	},
	present: {
		template: "gameObject",
		id: gameData.ids.GENERALOBJECT,
		name: "present",
		colWidth: 0.5,
		colHeight: 0.25,
		pickable: true,
		collectable: true
	},
	flag: {
		template: "gameObject",
		id: gameData.ids.FLAG,
		name: "flag",
		finalFlag: false,
		colWidth: 0.5,
		colHeight: 0.75,
		animated: true,
		frames: 3,
		frameSpeed: 0.25,
		randomStartFrame: true,
		doSomethingSpecial: function(object){
			if (object.value > levelData.flag)
			{
				console.log("flag " + object.value + ", position saved");
				levelData.flag = object.value;
				//localStorage.setItem("position", levelData);
			}
		}
	},
	door: {
		template: "gameObject",
		id: gameData.ids.DOOR,
		name: "door",
		colWidth: 1, //0.5,
		colHeight: 0.75,
		frames: 9,
		frameSpeed: 0.5,
		state: false, // false = closed/open, true = opening
		stateName: "closed", // "opening", "open"
		place: "",
		direction: "",
		keysNeeded: 1,
		playerFacing: 0, // to store player´s facing
		adjustProperties2: function(object){
			levelData.doors.push(object);
		},
		onCollision: function(empty, object){
			if (control.down)
			{
				if (object.active)
				{
					object.doSomethingSpecial(object);
				}
			}
		},
		doSomethingSpecial: function(object){
			if (object.stateName === "closed"
			 && levelData.keysCollected >= object.keysNeeded)
			{
				object.state = true;
			}
			
			if (object.stateName === "open")
			{
				object.enter(object);
			}
		},
		enter: function(object){
			// Go to door
			object.playerFacing = player.facing;
			object.active = false;
			player.targetObject = object;
			
			// Load scenario
			loadScenario(gameData.enterDoorScenario);
			switch(object.place)
			{
				case "exit":
					gameData.textObject.textStorage = "LEVEL " + levelData.level + " COMPLETED!";
					levelData.levelState = "completed";
					break;
				case "level":
					gameData.textObject.textStorage = "LEVEL " + object.direction;
					gameData.levelChosen = parseInt(object.direction);
					levelData.levelState = "completed";
					break;
				default:
					loadScenario(gameData.moveToAnotherLocation);
					break;
			}
		},
		action: function(object){
			if (object.state)
			{
				if (object.newStateStarted)
				{
					object.newStateStarted = false;
					object.stateName = "opening";
				}
				else
				{
					object.frame += object.frameSpeed;
					if (object.frame === object.frames)
					{
						object.frame --;
						object.state = false;
						object.stateName = "open";
					}
				}
			}
		}
	},
	platform: {
		template: "gameObject",
		id: gameData.ids.PLATFORM,
		name: "platform",
		colWidth: 0.75,
		colHeight: 0.13,
		isColideAble: true
	},
	platformDynamic: {
		template: "gameObject",
		id: gameData.ids.PLATFORM,
		name: "platform",
		colWidth: 0.75,
		colHeight: 0.13,
		isColideAble: true,
		isCarryAble: true,
		speedX: 2,
		speedY: 0,
		direction: 1, // 1 RIGHT, -1 LEFT
		distance: 4,
		defaultX: 0,
		defaultY: 0,
		adjustProperties2: function(object){
			object.defaultX = object.centerX();
			object.defaultY = object.centerY();
			
			// Random start place
			object.x += Math.floor(Math.random() * object.distance * gameData.TILESIZE)
			 * (Math.floor(Math.random() * 3) - 1);
		},
		action: function(object){
			object.x += object.speedX * object.direction;
			object.y += object.speedY * object.direction;
			
			var distanceX = object.centerX() - object.defaultX;
			var distanceY = object.centerY() - object.defaultY;
			
			var array = getSubArray(object, "collisions");
			var collisions = checkCollisionWithArray(object, array);
				
			if (Math.abs(distanceX) > object.distance * gameData.TILESIZE
			 || Math.abs(distanceY) > object.distance * gameData.TILESIZE)
			{
				object.direction *= -1;
			}
			else if (collisions.length > 0
						&& distanceX * object.direction === 1)
			{
				object.direction *= -1;
			}
		},
		onCollision: function(otherObject, object){
			var collisionSide = blockBoxObject(otherObject, object);
			if (otherObject.isColideAble)
			{
				if (collisionSide !== "down")
				{
					object.direction *= -1;
				}
			}
		}
	},
	spike: {
		template: "gameObject",
		id: gameData.ids.GENERALOBJECT,
		name: "spike",
		colWidth: 0.8,
		colHeight: 0.4,
		hurting: true,
		hurt: 1
	},
	fallingStone: {
		template: "gameObject",
		id: gameData.ids.GENERALOBJECT,
		name: "falling stone",
		colWidth: 0.5,
		colHeight: 0.5,
		alignStyle: "down left",
		isColideAble: true,
		collisionActiveSide: "down",
		timer: 20,
		counter: 0,
		state: 0, // 0 -> 1 -> 2 -> 3
		distance: 1,
		vy: 0,
		adjustProperties2: function(object){
			object.defaultY = object.y;
		},
		doSomethingSpecial: function(object){
			if (object.state === 0)
			{
				object.state ++;
				object.counter = object.timer;
			}
		},
		action: function(object){
			switch(object.state)
			{
				case 1:
					object.timer --;
					if (object.timer <= 0)
					{
						object.state ++;
						break;
					}
					break;
				case 2:
					object.vy += gameData.GRAVITY / 2;
					object.y += object.vy;
					if (object.y >= object.defaultY + object.distance * gameData.TILESIZE)
					{
						object.state ++;
					}
				default:
					break;
			}
		}
	},
	spring: {
		template: "gameObject",
		id: gameData.ids.GENERALOBJECT,
		name: "spring",
		colWidth: 0.5,
		colHeight: 0.32,
		isColideAble: true,
		//collisionActiveSide: "down",
		frames: 3,
		counter: 0,
		timer: 3,
		jumpForce: 2,
		doSomethingSpecial: function(object, characterObject){
			// Start animation
			object.state = true;
			object.newStateStarted = true;
			object.frame = 0;
			object.counter = object.timer;
			
			// Make character object jump really high
			characterObject.forceChangeState("jump");
			characterObject.vy = gameData.jumpTab[object.jumpForce] * gameData.SIZE;
		},
		action: function(object){
			if (object.state)
			{
				if (object.newStateStarted)
				{
					object.newStateStarted = false;
				}
				else
				{
					object.frame ++;
					if (object.frame === object.frames)
					{
						object.counter --;
						object.frame --;
						if (object.counter <= 0)
						{
							object.state = false;
							object.frame = 0
						}
					}
				}
			}
		}
	},
	somethingElse: {}
};

var effectSettings = {
	explosion: {
		row: 0,
		column: 0,
		endWithLastFrame: true,
		frames: 8
	},
	moneyBagFound: {
		row: 1,
		column: 7,
		ratio: 0.5,
		elevate: true,
		endWithDissapear: true
	},
	shield: {
		row: 1,
		column: 6,
		pulse: true,
		ratio: gameData.sizeRatio * 1.3,
		doSomethingSpecial: function(object){
			// Watch vulnerable timer
			player.vulnerableTimer = Math.max(player.vulnerableTimer - 1, 0);
			if (player.vulnerableTimer > 0)
			{
				player.vulnerable = false;
			}
			else
			{
				player.vulnerable = true;
			}
			
			// Disappear the shield
			if (player.vulnerable)
			{
				object.endWithDissapear = true;
				object.fadeStep = 0.1;
			}
		}
	}
};