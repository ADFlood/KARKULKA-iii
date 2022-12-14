// objects.js


//--- Camera
var camera = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
  centerX: function(){return this.x + this.width / 2;},
  centerY: function(){return this.y + this.height / 2;},
  halfWidth: function(){return this.width / 2;},
  halfHeight: function(){return this.height / 2;},
  collisionX: function(){return this.x;},
  collisionY: function(){return this.y;},
  collisionWidth: canvas.width,
  collisionHeight: canvas.height,
	reset: function(){
		this.x = 0;
		this.y = 0;
	},
	scroll: function(){
		if (gameData.scrolling)
		{	
			this.x = player.centerX() - this.halfWidth();
		}
	},
	collisionTest: function(object){
		var toBeRendered = false;
	
		if (object.mandatoryRender)
		{
			toBeRendered = true;
		}
		else if (object.visible && object.alpha > 0)
		{
			if (Math.abs(object.centerX() - this.centerX())
					< object.halfWidth() + this.halfWidth())
			{
				toBeRendered = true;
			}
		}
		
		return toBeRendered;
	}
};

//--- levelData
var levelData = {
	//test: "",
	levelState: "",
	level: 0,
	rows: 0,
	columns: 0,
	worldWidth: 0,
	worldHeight: 0,
	centerX: 0, //?
	centerY: 0, //?
	parallaxObjectsCounter: 0,
	levelObjects: [],
	levelObjectsGroups:	{	// musej? zde b?t???
		collisions: [],
		characters: [],
		objects: []
	},
	levelSubArraysNames: ["collisions", "characters", "objects"],
	//effects: [], //???
	spritesToRender: [],
	//gameElements: [], //?
	tilesets: {},
	
	flag: 0,
	keysCollected: 0,
	levelCompleted: false, //?
	exitObject: null, //?
	exitObjects: [],
	doors: [],
	
	//subCanvasCounter: 0,
	subCanvases: [],
	//landscapeCanvases: [],
	//foregroundCanvases: [],
	//canvasNr: function(){return	Math.floor(camera.x / canvas.width);},
	//canvasSplit: function(){return camera.x % canvas.width;},
	idCounter: 0, //?
	
	tempCollisionArray: [],
	initiate: function(){
		this.clearData();
		this.rows = mapData[this.level].height;
		this.columns = mapData[this.level].width;
		this.worldWidth = this.columns * gameData.TILESIZE;
		this.worldHeight = this.rows * gameData.TILESIZE;
		this.centerX = this.worldWidth / 2;
		this.centerY = this.worldHeight / 2;
		this.subCanvases = [];
		//this.subCanvasCounter = Math.ceil(this.worldWidth / canvas.width);
		
	},
	clearData: function(){
		// ud?lat jinak, tohle je hr?za
		this.levelObjects = [];
		//this.levelObjectsGroups.collisions = []; // vy?ist? se p?i nov? definici
		//this.levelObjectsGroups.characters = [];
		//this.levelObjectsGroups.objects = [];
		
		this.spritesToRender = [];
		//gameData.arraysToRender = [];
		//gameData.arraysToRender.push(this.spritesToRender);
		//gameData.arraysToRender.push(gameData.spritesToRender);
		
		//this.tempCollisionArray = [];
		
		this.parallaxObjectsCounter = 0;
		this.tilesets = {};
		
		this.flag = 0;
		this.keysCollected = 0;
		this.levelCompleted = false;
		this.doors = [];
		
		this.idCounter = 0;
		
		//this.landscapeCanvases = [];
		//this.foregroundCanvases = [];
	}
};

//--- General sprite template
var generalSpriteObject = {
  // General
  id: null,
  name: null,
  isActionAble: false,
  isColideAble: false,	// zda to toho p?edm?ty mohou narazit
  isShootAble: false,		// zda se o to kulka zaraz?
  freeMove: false, 			// true = na ?eb??ku, proch?zet landscape
  isCarryAble: false,		// true = m??e ovlivnit pohyb jin?ch objekt?
  state: null,
  stateName: null,
  isDynamic: false,			// m??e se h?bat
  permissionToMove: false,
  active: true,
  type: "levelObjects",
  subtype: null, 				// collisions, buttons, characters, objects, others...
  clickAble: false,			//??
  
  // Image
  imageName: "",
  sourceImage: null,
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 0,
  sourceHeight: 0,
  frame: 0,
  frameSpeed: 1,

  // Position
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  gridOccupy: [],
  gridCurrent: -1,
  
  // Collision
  collisionOffsetX: 0,
  collisionOffsetY: 0,
  collisionX: function(){return this.x + this.collisionOffsetX;},
  collisionY: function(){return this.y + this.collisionOffsetY;},
  collisionWidth: 0,
  collisionHeight: 0,
  centerX: function(){return this.collisionX() + this.halfWidth();},
  centerY: function(){return this.collisionY() + this.halfHeight();},
  halfWidth: function(){return this.collisionWidth / 2;},
  halfHeight: function(){return this.collisionHeight / 2;},
  bottom: function(){return this.collisionY() + this.collisionHeight - 1;},
  colX: 0,
  colXX: 0,
  colY: 0,
  colYY: 0,
  
  // Visibility
  mandatoryRender: false,
  visible: true,
  scrollable: true,					// Zda scrolluje s landscape nebo je pevn? v??i obrazovce
  alpha: 1,
  effectName: "",
  
  // Functions
  update: function(){},
  reset: function(){},
  setDefault: function(object)
  {
  	setObjectProperties(this, object);
  	this.setDefaultCollisions();
  	this.adjustProperties(object);
  },
  adjustProperties: function(){},
  setDefaultCollisions: function(){},
  onCollision: function(){},
  action: function(){},
  checkStatus: function(){}
};
 
//--- canvasSprite object (landscape / foreground)
var canvasSpriteObject = Object.create(generalSpriteObject);
	gameData.objectTemplates.push(canvasSpriteObject);
	canvasSpriteObject.mandatoryRender = true;
	canvasSpriteObject.scrollable = false;
	canvasSpriteObject.sourceArrayIndex = 0;
	canvasSpriteObject.sourceArrayLength = 0;
	canvasSpriteObject.subCanvasLength = 0;
	canvasSpriteObject.side = "";
	canvasSpriteObject.defaultWidth = 0;
	canvasSpriteObject.setDefault = function(){}; //must be here to clear original default
	canvasSpriteObject.update = function(){
		switch(this.side)
		{
			// must be at least 1 width otherwise error occures while rendering
			case "left":
				this.sourceImage = levelData.subCanvases[this.sourceArrayIndex][this.canvasNr()];
				this.sourceWidth = this.defaultWidth - this.canvasSplit() + 1;
				this.sourceX = this.defaultWidth - this.sourceWidth - 1;
				this.x = -1;
				this.width = this.sourceWidth;
				
				break;
			default:
				// right
				this.sourceImage = levelData.subCanvases[this.sourceArrayIndex][this.canvasNr() + 1];
				this.sourceWidth = Math.max(this.canvasSplit(), 1);
				this.width = this.sourceWidth;
				this.x = this.defaultWidth - this.width;
				break;
		}
	};
	canvasSpriteObject.canvasNr = function(){
		return Math.floor(camera.x / canvas.width);
	};
	canvasSpriteObject.canvasSplit = function(){
		return Math.ceil(camera.x % canvas.width);
	};
	
//--- Parallax object
var parallaxObject = Object.create(generalSpriteObject);
	gameData.objectTemplates.push(parallaxObject);
	parallaxObject.id = gameData.ids.BACKGROUND;
	parallaxObject.name = "background"; //?
	parallaxObject.mandatoryRender = true;
	parallaxObject.scrollable = false;
	parallaxObject.speed = 0;
	parallaxObject.cameraTranslate = 0;
	parallaxObject.innerX = 0;
	parallaxObject.scrollStepX = 0;
	parallaxObject.sourceImageWidth = 0;
	parallaxObject.ratio = 0;
	parallaxObject.setDefault = function(layerName){ 
		this.width = canvas.width;
		this.height = canvas.height;
		this.sourceHeight = this.sourceImage.height;
		this.ratio = canvas.width / canvas.height;
		this.sourceWidth = this.sourceHeight * this.ratio;
		
		// Set scroll speed and other properties
		switch(this.id)
		{
			case 1:
				this.name = "background 1";
				this.scrollStepX = 0.1;
				break;
			case 2:
				this.name = "background 2";
				this.id = 3;
				this.scrollStepX = 0.3;
				break;
			case 3:
				this.name = "foreground 1";
				this.id = 100;
				this.speed = 10;
				this.scrollStepX = 1;
				this.cameraTranslate = 1;
				break;
			case 4:
				this.name = "clouds";
				this.id = 2;
				this.speed = 0.3;//1;
				this.scrollStepX = 0.1;
				this.cameraTranslate = 0;
				break;
			default:
				console.log("too many backgrounds...");
				break
		}
		
		this.sourceImageWidth = this.sourceImage.width / gameData.parallaxMultiplier;
	};
	parallaxObject.update = function(){
	  this.innerX = this.capValue(this.innerX + this.speed, this.sourceImageWidth);
	  this.sourceX = this.capValue(camera.x * this.scrollStepX
	  	+ this.innerX
	  	+ camera.x * this.cameraTranslate,
	  	this.sourceImageWidth);
	};
	parallaxObject.capValue = function(value, width){
		if (value >= width){value = value % width;}
		if (value < 0){value += width;}
		return value;
	};

//--- Collision object
var collisionObject = Object.create(generalSpriteObject);
	gameData.objectTemplates.push(collisionObject);
	collisionObject.name = "collision";
	collisionObject.isColideAble = true;
	collisionObject.subtype = "collisions";
	collisionObject.visible = false;
	collisionObject.setDefault = function(object){
		this.width = object.width;
		this.height = object.height;
		this.collisionWidth = this.width;
		this.collisionHeight = this.height;
	};

//--- Game object
var gameObject = Object.create(generalSpriteObject);
	gameData.objectTemplates.push(gameObject);
	gameObject.name = "gameObject";
	gameObject.subtype = "objects";
	gameObject.alignStyle = "down";
	gameObject.colWidth = 0;
	gameObject.colHeight = 0;
	gameObject.defaultSourceX = 0;
	
	gameObject.pickable = false;		// jde sebrat, p?edm?t zmiz?
	gameObject.collectable = false;	// jde sebrat a n?st, n?sledn? pou??t
	gameObject.throwable = false;
	gameObject.valuegiving = false;	// p?id? pen?ze
	gameObject.lifegiving = false;	// p?id? ?ivot
	gameObject.healthgiving = false;// p?id? zdrav?
	gameObject.hurting = false;			// zra?uje
	gameObject.permittedObjects = ["Karkulka"];	// kdyby mohl i n?kdo jin?, tak to upravit v objectSettings
	
	gameObject.collisionActiveSide = ""; // resp. kde mus? b?t this v??i object
	
	gameObject.value = 0;
	gameObject.valueTotal = 0;
	gameObject.lives = 0;
	gameObject.livesTotal = 0;
	gameObject.hurt = 0;
	gameObject.generalValue1 = 0;
	gameObject.generalValue2 = 0;
	
	gameObject.animated = false;
	gameObject.frames = 0;
	gameObject.randomStartFrame = false;
	gameObject.newStateStarted = true;
	
	//gameObject.timer = 0; // mus? to tu b?t?
	//gameObject.counter = 0; // dtto
	
	gameObject.doSomethingSpecial = function(){};
	gameObject.setDefaultCollisions = function(){
		this.collisionWidth = this.width * this.colWidth;
		this.collisionHeight = this.height * this.colHeight;
		this.collisionOffsetX = (this.width - this.collisionWidth) / 2; // v?dy center
		switch(this.alignStyle)
		{
			case "down":
				this.collisionOffsetY = this.height - this.collisionHeight;
				break;
			case "down left":
				this.collisionOffsetY = this.height - this.collisionHeight;
				this.collisionOffsetX = 0;
				break;
			default:	// "center" a ostatn?
				this.collisionOffsetY = (this.height - this.collisionHeight) / 2;
				break;
		}
	};
	gameObject.adjustProperties = function(sourceObject){
		if ("gid" in sourceObject)
		{
			var tile = findGIDinTilesets(sourceObject.gid);
			this.sourceImage = tile.tilesheetImage;
			this.defaultSourceX = tile.tileGID % tile.sourceColumn * tile.sourceWidth;
			this.sourceY = Math.floor(tile.tileGID / tile.sourceColumn) * tile.sourceHeight;
			this.sourceWidth = tile.sourceWidth;
			this.sourceHeight = tile.sourceHeight;
		}
		else
		{
			console.log("error");
		}
		
		if (this.randomStartFrame)
		{
			this.frame = Math.floor(Math.random() * this.frames);
		}
		
		this.adjustProperties2(this);
	};
	gameObject.adjustProperties2 = function(){};
	gameObject.update = function(){
		this.sourceX = this.defaultSourceX + Math.floor(this.frame) * this.sourceWidth;
	};
	gameObject.action = function(){
		doAnimation(this);
	};
	gameObject.onCollision = function(object, empty, weapon){
		// Check blocking object
		var collisionSide = "";
		if (this.isColideAble)
		{
			collisionSide = blockBoxObject(object, this);
		}
		
		// Check activation side if necessery
		var activation = true
		if (this.collisionActiveSide !== "")
		{
			if (collisionSide !== this.collisionActiveSide)
			{
				activation = false;
			}
		}
		
		// Define who made the collision (weapon > object/character)
		var permittedObject = object.name;
		weapon = weapon || null;
		if (weapon !== null)
		{
			permittedObject = weapon.name;
		}
		
		// Check permission and reaction
		if (this.active && activation)
		{
			if (this.permittedObjects.indexOf(permittedObject) > -1)
			{
				if (this.valuegiving && this.valueTotal > 0)
				{
					object.coins += this.value;
					this.valueTotal -= this.value;
					if (this.valueTotal <= 0){this.active = false;}
				}
				
				if (this.lifegiving && this.livesTotal > 0)
				{
					object.lives += this.lives;
					this.livesTotal -= this.lives;
					if (this.livesTotal <= 0){this.active = false;}
				}
				
				if (this.healthgiving)
				{
					object.health = object.maxHealth;
				}
				
				if (this.hurting)
				{
					object.health -= this.hurt;
				}
				
				this.doSomethingSpecial(this, object);
				
				if (this.effectName !== "")
				{
					createEffect(this);
				}
				
				if (this.collectable)
				{
					if (object.pickedItems.length <= object.maxPickedItems)
						// TOHLE JE NA ZV??EN?
					{
						object.pickedItems.push(this);
						object.pickedItemsCounter ++;
					}
				}
				
				if (this.pickable)
				{
					this.active = false; // tohle moc nech?pu
					getObjectOut(this);
				}
			}
		}
	};

//--- effectObject
var effectObject = Object.create(generalSpriteObject);
	gameData.objectTemplates.push(effectObject);
	effectObject.id = gameData.ids.EFFECT;
	effectObject.name = "effect";
	effectObject.subtype = "effects";
	
	effectObject.imageName = "effectsImage";
	effectObject.row = 0;
	effectObject.column = 0;
	effectObject.sourceWidth = 180;
	effectObject.sourceHeight = 180;
	effectObject.width = gameData.SIZE;
	effectObject.height = gameData.SIZE;
	effectObject.ratio = gameData.sizeRatio;	// kdyby bylo pot?eba upravit velikost efektu
	
	effectObject.item = "";
  effectObject.sourceObject = null;
  effectObject.started = true;
  effectObject.isOver = false;
  effectObject.endWithLastFrame = false;
  effectObject.elevate = false;
  effectObject.elevateStep = gameData.SIZE / 20;
  effectObject.pulse = false;
  effectObject.defaultWidth = 0;
  effectObject.defaultHeight = 0;
  effectObject.frames = 0;
  effectObject.frameSpeed = 0.5;
  effectObject.counter = 0;
  effectObject.pulseArray = [1, 1.05, 1.15, 1.3, 1.15, 1.05];
  effectObject.keyFrame = -1;
  effectObject.endWithDissapear = false;
  effectObject.fadeStep = 0.05;
	
	effectObject.setDefault = function(object)
  {
  	loadEffectProperties(this, object);
  	this.adjustProperties(object);
  	alignObjectsCentre(this, object);
  },
	effectObject.adjustProperties = function(sourceObject){
		if (this.item !== "")
		{
			if (this.item in itemsData) // je to tak ko?er?
			{
				this.row = itemsData[this.item][0];
				this.column = itemsData[this.item][1];
			}
		}
		
		this.sourceX = this.column * this.sourceWidth;
		this.sourceY = this.row * this.sourceHeight;
		this.width = this.width * this.ratio;
		this.height = this.height * this.ratio;
		this.sourceObject = sourceObject;
		this.id = sourceObject.id + 1;
		
		if (this.pulse)
		{
			this.defaultWidth = this.width;
			this.defaultHeight = this.height;
		}
	};
	effectObject.update = function(){
		this.sourceX += Math.floor(this.frame) * this.sourceWidth;
	};
	effectObject.doSomethingSpecial = function(){};
	effectObject.action = function(){
		this.doSomethingSpecial(this);
		//if (this.active)
		//{
			if (this.started)
			{
				this.started = false;
			}
			else
			{
				if (this.endWithLastFrame)
				{
					this.frame += this.frameSpeed;
					if (this.frame === this.frames)
					{
						this.isOver = true;
					}
				}
				
				if (this.endWithDissapear)
				{
					this.alpha = this.alpha - this.fadeStep;
					if (this.alpha <= 0)
					{
						this.isOver = true;
					}
				}

				if (this.elevate)
				{
					this.y -= this.elevateStep;
				}
				
				if (this.pulse)
				{
					this.width = this.defaultWidth * this.pulseArray[this.counter];
					this.height = this.defaultHeight * this.pulseArray[this.counter];
					this.x = this.sourceObject.centerX() - this.width / 2;
					this.y = this.sourceObject.centerY() - this.height / 2;
					
					this.counter ++;
					if (this.counter + 1 > this.pulseArray.length)
					{
						this.counter = 0;
					}
				}
				
				
			}
			
			if (this.isOver)
			{
				this.deactivate();
			}
		//}
	};
	effectObject.deactivate = function(){
		getObjectOut(this, false);
	};

//--- UI Object
var uiObject = {
	id: 0,
	name: "",
	subtype: "image",
	imageName: "uiImage",
	sourceImage: null,
	align: "top left",
	positionOffsetX: 0,
	positionOffsetY: 0,
	
	x: 0,
	y: 0,
	defaultX: 0,
	defaultY: 0,
	width: gameData.SIZE * 1.66,
	height: gameData.SIZE * 1.66,
	
	sourceColumn: 0,
	sourceRow: 0,
	sourceX: 0,
	sourceY: 0,
	sourceWidth: 300,
	sourceHeight: 300,
	defaultSourceSize: 300,
	
	alpha: 0,
	fadeStep: 0.05,
	
	textToRender: "",
	textBefore: "",
	text: "", // middle
	textAfter: "",
	font: "",
	fontSize: 24,
	fontStyle: "normal",
	fontType: "Helvetica",
	fillStyle: "black",
	textAlign: "",
	textBaseline: "middle",
	offsetY: 0,
	
	sourceValue: function(){return this.text;},
	
	value: 0,
	
	scrollable: false,
	mandatoryRender: true,
	checkVisibility: function(){
		var presence = false;
		if (gameData.graphicsToShow.indexOf(this.name) !== -1)
		{
			presence = true;
		}
		return presence;
	},
	update: function(){
		// Show object condition
		if (this.checkVisibility() && this.alpha < 1)
		{
			this.alpha = Math.min(this.alpha + this.fadeStep, 1);
		}
		
		// Hide object condition		
		if (!this.checkVisibility() && this.alpha > 0)
		{
			this.alpha = Math.max(this.alpha - this.fadeStep, 0);
		}
		
		// Update text render parametters
		if (this.subtype === "text")
		{
			this.textToRender = this.textBefore + this.sourceValue() + this.textAfter;
			this.x = this.defaultX;
			this.y = this.defaultY + this.offsetY;
		}
		
		// Adjust if necessary
		this.updateII(this);
	},
	updateII: function(){},
	setDefault: function(){
		// Find source image, set width and height
		if (this.subtype !== "text")
		{
			findSourceImage(this);
			this.sourceX = this.sourceColumn * this.defaultSourceSize;
			this.sourceY = this.sourceRow * this.defaultSourceSize;
		}
		else
		{
			this.width = 0;
			this.height = 0;
			this.font = this.fontStyle + " " + this.fontSize + "px " + this.fontType;
			// "normal 26px Helvetica"
		}
		
		// Align and adjust offset
		switch(this.align)
		{
			case "center":
				this.x = canvas.width / 2 - this.width / 2;
				this.y = canvas.height / 2 - this.height / 2;
				this.textAlign = "middle";
				break;
			case "top right":
				this.x = canvas.width - this.width;
				this.textAlign = "right";
				break;
			case "top":
				this.x = canvas.width / 2 - this.width / 2;
				this.textAlign = "middle";
				break;
			case "down":
				this.x = canvas.width / 2 - this.width / 2;
				this.y = canvas.height - this.height;
				this.textAlign = "middle";
				break;
			default:
				// top left
				this.textAlign = "left";
				break;
		}
		this.x += this.positionOffsetX;
		this.y += this.positionOffsetY;
		
		// Set default position
		this.defaultX = this.x;
		this.defaultY = this.y;
		
		// Adjust if necessary
		this.adjustProperties(this);
		
		// Push into render array
		pushIntoArrayAndSortById(gameData.spritesToRender, this);
	},
	adjustProperties: function(){},
};
