// initialization.js

// mapa
/*

hlavní rovina na dlaždici 11
vlevo od zaèátku musí bý min. 11 volných dlažic, kam se nesmí
vpravo to samé
úplné dno min. 6 dlaždic pod základní úrovní
pod posledním dnem musí být min. 3 volné dlaždice, kam se nesmí
nejvyšší platforma mùže být na dlaždici 5

karkulka standardnì vyskoèí o 2 dlaždice a pøeskoèí do strany 3 dlaždice

délka by mohla být øeknìme 5 obrazovek

takže pracovnì
- výška 10 + 1 + 5 + 1 + 3 = 20 dlaždic
- šíøka 11 + 11 + 5 x 20 = 122 dlaždic

types:
LANDSCAPE ADDITIONAL = na tvrdo se nakreslí na canvas a zapomene se
LANDSCAPE OBJECTS = na tvrdo se nakreslí na canvas, ale vytvoøí se okolo collision box a reagují
LEVEL OBJECTS = samostatný objekt i sprite
*/



//--- Define variables

var BASE = 180;//180;
var MAPBASE = 180;

//--- Get / create canvas and drawingSurface reference
var canvas = document.getElementById("canvas");
  canvas.width = 14 * BASE / 2;//15 * 64; 20
  canvas.height = 8 * BASE / 2;//6 * 64; 10
  canvas.style = "border: 1px dashed black";
var drawingSurface = canvas.getContext("2d");
// 1.366 x 768 (ale 768 je moc...)
// TILESIZE = 90
// pak 15,3 x 8,7 (radìji 15 x 8)

var gameData = {
	// ENGINE
	renderFrame: -1,
	timestep: 1000 / 30,
	progress: 0,
	lastTimestamp: 0,
	gameState: "none",
	timer: 0,
	scrolling: true,
	consoleText: "loading data...", //??
	commandBuffer: [],
	graphicsToShow: [],
	buttons: [],
	arraysToRender: [],
	spritesToRender: [],
	spritesToDraw: [],
	objectTemplates: [],
	rendering: false,
	parallaxMultiplier: 3,
	textStack: [],
	sizeRatio: 1,
	levelChosen: 0,
	
	restoreRenderingArray: function(){
		this.arraysToRender = [];
		this.arraysToRender.push(levelData.spritesToRender);
		this.arraysToRender.push(this.spritesToRender);
	},
	
	// GAME INFO
	maxLevels: 2,
	maxLives: 3,
	
	// PLAYER
	lives: 0,
	coins: 0,
	score: 0,

	// CONSTANTS
	SOURCESIZE: 128,
	SIZE: BASE,
	TILESIZE: BASE / 2,
	GRIDSIZE: BASE * 5,//10,//4,
	BACKGROUNDRATIO: 1.25,
	BUTTONSIZE: BASE / 2,
	GRAVITY: BASE / 8 / 16,
	PX: BASE / BASE,
	LIFESIZE: 16,
	COLLISIONGRID: 8, // jak moc je collision v rámci jedné tile podrobné
	
	// TASKS LIBRARY
	showMessage: function(){
		gameData.textObject.text = gameData.textObject.textStorage;
		gameData.textObject.textStorage = "";
		gameData.tasks.splice(0, 1);
	},
	hideMessage: function(){
		gameData.textObject.text = "";
		gameData.tasks.splice(0, 1);
	},
	directPlayerToTarget: function(){
		if (player.targetMet)
		{
			gameData.tasks.splice(0, 1);
		}
	},
	disappearPlayer: function(){
		player.alpha = Math.max(0, player.alpha - 0.05);
		if (player.alpha === 0)
		{
			gameData.tasks.splice(0, 1);
		}
	},
	fadeOut: function(){
		if (gameData.graphicsToShow.indexOf("background") === -1)
		{
			gameData.graphicsToShow.push("background");
		}
		var object = findObjectByName("background", gameData.spritesToRender);
		if (object.alpha === 1)
		{
			gameData.tasks.splice(0, 1);
		}
	},
	setTimer: function(){
		gameData.timer += 10;
		gameData.tasks.splice(0, 1);
	},
	watchTimer: function(){
		gameData.timer --;
		if (gameData.timer <= 0)
		{
			gameData.tasks.splice(0, 1);
		}
	},
	removeCoverBackground: function(){
		removeFromArray(gameData.graphicsToShow, "background");
		gameData.tasks.splice(0, 1);
	},
	makePlayerHurt: function(){
		player.controlPlayer = false;
		if (player.allowedToChangeState)
		{
			player.isDead = false;
			player.changeState("hurt");
		}
		
		if (player.isDead)
		{
			gameData.tasks.splice(0, 1);
		}
	},
	setLevelToRestart: function(){
		levelData.levelState = "game over";
		gameData.tasks.splice(0, 1);
	},
	movePlayerToNewLocation: function(){
		var newPlace = findDoorByPlace(player.targetObject);
		player.x = newPlace.centerX() - player.width / 2;
		player.y = newPlace.bottom() - player.collisionHeight - player.collisionOffsetY;
		player.facing = player.targetObject.playerFacing;
		player.alpha = 1;
		player.targetObject.active = true;
		gameData.tasks.splice(0, 1);
	},
	controlPlayerFALSE: function(){
		player.controlPlayer = false;
		player.vulnerable = false;
		gameData.tasks.splice(0, 1);
	},
	controlPlayerTRUE: function(){
		player.controlPlayer = true;
		player.vulnerable = true;
		gameData.tasks.splice(0, 1);
	},

	graphicSets: {
		buildingLevel: [
			"solidBackground",
			//"circleIn",
			//"circleOut",
			//"textLoadingInfo",
			//"textPercentage"
		],
		level: [
			"coinImg",
			"coins",
			"key1",
			"key2",
			"key3",
			"textObject",
			"background",
			"healthEmptyImg",
			"healthImg",
			"life1",
			"life2",
			"life3"
		]
	},
	tasks: [],
	
	// SCENARIOS
	levelStartScenario: [
		"showMessage",
		"setTimer",
		"watchTimer",
		"removeCoverBackground",
		"setTimer",
		"setTimer",
		"setTimer",
		"setTimer",
		"setTimer",
		"setTimer",
		"watchTimer",
		"hideMessage"
	],
	playerDead: [
		"makePlayerHurt",
		"showMessage",
		"setTimer",
		"setTimer",
		"watchTimer",
		"fadeOut",
		"setLevelToRestart"
	],
	enterDoorScenario: [
		"controlPlayerFALSE",
		"directPlayerToTarget",
		"showMessage",
		"disappearPlayer",
		"hideMessage",
		"fadeOut"
	],
	moveToAnotherLocation: [
		"movePlayerToNewLocation",
		"removeCoverBackground",
		"controlPlayerTRUE"
	],


	
	textObject: {},
	tileTypes: {
		full: [
			[1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1]
		],
		upperHalf: [
			[1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		],
		upperRight: [
			[0, 0, 0, 0, 1, 1, 1, 1],
			[0, 0, 0, 0, 1, 1, 1, 1],
			[0, 0, 0, 0, 1, 1, 1, 1],
			[0, 0, 0, 0, 1, 1, 1, 1],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		],
		upperRightSmall: [
			[0, 0, 0, 0, 0, 0, 1, 1],
			[0, 0, 0, 0, 0, 0, 1, 1],
			[0, 0, 0, 0, 0, 0, 1, 1],
			[0, 0, 0, 0, 0, 0, 1, 1],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		],
		upperRightMini: [
			[0, 0, 0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		],
		upperLeft: [
			[1, 1, 1, 1, 0, 0, 0, 0],
			[1, 1, 1, 1, 0, 0, 0, 0],
			[1, 1, 1, 1, 0, 0, 0, 0],
			[1, 1, 1, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		],
		upperLeftSmall: [
			[1, 1, 0, 0, 0, 0, 0, 0],
			[1, 1, 0, 0, 0, 0, 0, 0],
			[1, 1, 0, 0, 0, 0, 0, 0],
			[1, 1, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		],
		upperLeftMini: [
			[1, 0, 0, 0, 0, 0, 0, 0],
			[1, 0, 0, 0, 0, 0, 0, 0],
			[1, 0, 0, 0, 0, 0, 0, 0],
			[1, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		]
	},
	ids: {
		BACKGROUND: 0,
		LANDSCAPE: 10,
// levelObjects 11-999
		BOX: 19,	//?
		PLATFORM: 20,
		FLAG: 50,
		DOOR: 51,
		COIN: 100,
		TREASURE: 101,
		KEY: 102,
		GENERALOBJECT: 150,
		KARKULKA: 900,
		SLIME: 901,
		SPIDER: 902,
		TURTLE: 905,
		GHOST: 906,
		BEE: 907,
		EFFECT: 950,
		COLLISIONCHECK: 999,
		FOREGROUND: 1000,
		INFOGRAPHIC: 2000,

		BUTTON: 3000
	},
	jumpTab: [
		// index = tiles, value = jumpForce
		//0, -15, -27, -32, -35, -38, -40, -42
		0.00,
		-0.08,
		-0.15,
		-0.18,
		-0.20,
		-0.21,
		-0.22,
		-0.24
	]
	// 2 = -25 ok
	// 3 = -32 ok
	// 6 = -40 ok nebo 42?
};

gameData.sizeRatio = gameData.TILESIZE / MAPBASE;




// Game variables
var player = null; // nesystémové øešení





