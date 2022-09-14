// levelCreator

/*
level má zaèátek (flag 0) a konec (door s pøíznakem "place" = "exit")
každé dveøe jde otevøít klíèem podle pøíznaku "keysNeeded"
po projití kolem vlajky se uloží pozice, resp. pøi ztrátì života se zaènì od poslední
	vlajky (vždy se uloží vyšší vlajka, nikoli zpìtnì)


*/

function buildLevel()
{
	// Start building
	gameData.gameState = "working...";
	//levelData.level = 1; // POUZE DOÈASNÉ!!!
	
	// Build
	createLevel();
	createExit();
	if (levelData.level !== 0) // bylo zde === 1, DOÈASNÉ
	{
		resetGameVariables();
	}
	adjustLevel();
}

function createLevel()
{
	// Clear objects' arrays and initiate level variables
	levelData.initiate();
	gameData.restoreRenderingArray();
		
	// Create sourceCanvases for landscape and foreground
	var landscapeCanvas = createEmptyCanvas(levelData.worldWidth, levelData.worldHeight);
	var foregroundCanvas = createEmptyCanvas(levelData.worldWidth, levelData.worldHeight);
	
	// Create static layers' arrays
	defineGridArrays(levelData.levelObjectsGroups, levelData.levelSubArraysNames);
	
	// Create temporary collision array
	createTempCollisionArray();
	
	// Load all tilesets information into arrays
	putLayerTilesetsIntoArray();
	
	// Transform Tiled data into objects and source canvases
	var layerType = "";
	var layerName = "";
	var layerTiledType = "";
	var length = mapData[levelData.level].layers.length;
	var i = 0;
	if (length > 0)
	{
		for (i = 0; i < length; i++)
		{
			if ("properties" in mapData[levelData.level].layers[i])
			{
				layerType = mapData[levelData.level].layers[i].properties.type;
				layerName = mapData[levelData.level].layers[i].name;
				layerTiledType = mapData[levelData.level].layers[i].type;
				
				switch(layerType)
				{
					case "background":
						createParallaxObject(layerName);
						break;
					case "levelObjects":
						createObjects(layerName);
						break;
					case "landscapeAdditional":
						drawObjectsOnSourceCanvas(layerName, landscapeCanvas, layerTiledType, layerType);
						break;
					case "landscapeObjects":
						drawObjectsOnSourceCanvas(layerName, landscapeCanvas, layerTiledType, layerType);
						break;
					case "landscape":
						drawOnSourceCanvas(layerName, landscapeCanvas, layerTiledType);
						break;
					case "foreground":
						drawOnSourceCanvas(layerName, foregroundCanvas, layerTiledType);
						break;
					case "foregroundAdditional":
						drawObjectsOnSourceCanvas(layerName, foregroundCanvas, layerTiledType, layerType, landscapeCanvas);
						break;
					default:
						console.log("error - layer type not valid");
						break;
				}
			}
			else
			{
				console.log("error - no layer type");
			}
		}
	}
	
	createCanvasSubSprites(landscapeCanvas, gameData.ids.LANDSCAPE, "landscape");
	createCanvasSubSprites(foregroundCanvas, gameData.ids.FOREGROUND, "foreground");
	
	createCollisionAreas();
	
	// Clear temporary variables
	landscapeCanvas = null;
	foregroundCanvas = null;
}

function createExit()
{
	var flags = findObjectsByName("flag", levelData.levelObjects);
	var value = -1;
	var flag = null;
	var length = flags.length;
	if (length > 0)
	{
		for (var i = 0; i < length; i++)
		{
			if (flags[i].value > value)
			{
				flag = flags[i];
				value = flags[i].value;
			}
		}
	}
	if (flag !== null)
	{
		flag.finalFlag = true;
	}
	else
	{
		console.log("final flag not found");
	}
	
	var doors = findObjectsByName("door", levelData.levelObjects);
	if (doors.length > 0)
	{
		levelData.exitObject = doors[0];
	}
	else
	{
		console.log("exit door not found");
	}
}

function adjustLevel()
{
	createPlayer();
	levelAdjusting(); // incl. loading graphic set
	loadPlayersValues();
	camera.scroll(); // musí to tu být?
	loadScenario(gameData.levelStartScenario);
	
	levelData.levelState = "playing";
	gameData.gameState = "playing";
}

function levelAdjusting()
{
	camera.reset();
	switch(levelData.level)
	{
		case 0:
			player.controlPlayer = false;
			gameData.scrolling = false;
			gameData.graphicsToShow = [];
			break;
		default:
			player.controlPlayer = true;
			gameData.scrolling = true;
			addGraphicsToShow("level", true);
			gameData.textObject.textStorage = "LEVEL " + levelData.level;
			break;	
	}
}

function resetGameVariables()
{
	gameData.lives = gameData.maxLives;
	gameData.score = 0;
}

function createParallaxObject(layerName)
{
	levelData.parallaxObjectsCounter ++;
	
	// Create parallax sprite
	var object = Object.create(parallaxObject);
		object.id += levelData.parallaxObjectsCounter;
		object.imageName = layerName;
		
	findSourceImage(object);
	
	// Create canvas
	var objectCanvas = createEmptyCanvas(object.sourceImage.width * gameData.parallaxMultiplier,
		object.sourceImage.height);
	
	// Draw image multiple times, next each other
	var drawingSurface = objectCanvas.getContext("2d");
	var width = object.sourceImage.width;
	var height = object.sourceImage.height;
	var i = 0;
	for (i = 0; i < Math.ceil(gameData.parallaxMultiplier); i++)
	{
		drawingSurface.drawImage(object.sourceImage,
			0, 0, width, height,
			width * i - i * 1, 0, width, height);	// - 1 nutné k navazování obrázkù na sebe
	}

	object.sourceImage = objectCanvas;
	object.setDefault(layerName);
	
	pushIntoArrayAndSortById(levelData.spritesToRender, object);
}


function createCanvasSubSprites(sourceCanvas, id, name)
{
	// Create source subCanvases and store them in array
	levelData.subCanvases.push([]);
	var index = levelData.subCanvases.length - 1;

	var subCanvas = null;
	var context = null;
	var i = 0;
	var length = Math.ceil(sourceCanvas.width / canvas.width);
	for (i = 0; i < length; i++)
	{
		subCanvas = createEmptyCanvas(canvas.width, canvas.height);
		context = subCanvas.getContext("2d");
		context.drawImage(sourceCanvas,
			canvas.width * i, 0, canvas.width, canvas.height,
			0, 0, canvas.width, canvas.height);
		levelData.subCanvases[index].push(subCanvas);
	}
	
	// Create left and right canvas sprite
	createCanvasSprite("left", id, index, name);
	if (sourceCanvas.width > canvas.width)
	{
		createCanvasSprite("right", id + 1, index, name);
	}
}

function createCanvasSprite(side, id, index, name)
{
	var canvasSprite = Object.create(canvasSpriteObject);
		canvasSprite.sourceArrayIndex = index;
		canvasSprite.id = id;
		canvasSprite.name = name + " " + side;
		canvasSprite.side = side;
		canvasSprite.subCanvasLength = levelData.subCanvases[index].length;
		
		canvasSprite.sourceHeight = canvas.height;
		canvasSprite.height = canvas.height;
		canvasSprite.defaultWidth = canvas.width;
		
		canvasSprite.setDefault();
		levelData.levelObjects.push(canvasSprite);
		pushIntoArrayAndSortById(levelData.spritesToRender, canvasSprite);
}

function drawObjectsOnSourceCanvas(layerName, sourceCanvas, layerTiledType, layerType, otherCanvas)
{
	// Find correct source layer
	var layer = mapData[levelData.level].layers[findDataLayer(layerName)];

	var objectsToDraw = layer.objects;
	var object = null;
	var tileInfo = null;
	
	var length = objectsToDraw.length;
	if (length > 0)
	{
		for (var i = 0; i < length; i++)
		{
			object = objectsToDraw[i];
			if (object.gid > 0)
			{
				tileInfo = findGIDinTilesets(object.gid);
				if (tileInfo.tileGID >= 0)
				{
					drawTileOnCanvas(tileInfo, sourceCanvas, layerTiledType, object);
					if (layerType === "landscapeObjects")
					{
						createCollisionBox(object);
					}
				}
			}
			if (object.name === "copy")
			{
				copyPartOfCanvas(sourceCanvas, otherCanvas, object);
			}
		}
	}
}

function createTempCollisionArray()
{
	// Clear first
	levelData.tempCollisionArray = [];
	
	var grid = gameData.COLLISIONGRID;
	var row = 0;
	var i = 0;
	var rowsGrid = levelData.rows * grid;
	var columnsGrid = levelData.columns * grid;
	for (row = 0; row < rowsGrid; row++)
	{
		levelData.tempCollisionArray.push([]);
		for (i = 0; i < columnsGrid; i++)
		{
			levelData.tempCollisionArray[row].push(0);
		}
	}
}

function leaveNoteAboutTileCollision(tileInfo)
{
	// Find collision array position
	var grid = gameData.COLLISIONGRID;
	var row = tileInfo.row * grid;
	var col = tileInfo.col * grid;
	
	// Find tileType's template
	var tileType = tileInfo.tileType;
	if (tileType in gameData.tileTypes)
	{
		var array = gameData.tileTypes[tileType]
		for (var i = 0; i < grid; i++)
		{
			for (var j = 0; j < grid; j++)
			{
				levelData.tempCollisionArray[row + i][col + j] = array[i][j];
			}
		}
	}
	else
	{
		if (tileType !== 0)
		{
			console.log("tileType not found");
		}
	}
}

function createCollisionAreas()
{
	// Define function variables
	var array = levelData.tempCollisionArray;
	var rows = levelData.tempCollisionArray.length;
	var cols = levelData.tempCollisionArray[0].length;
	var item = 0;
	var rectWidth = 0;
	var rectHeight = 0;
	var sourceObject = {};
	var ratio = gameData.TILESIZE / gameData.COLLISIONGRID;
		
	// Search for collision mark (top left corner of collision rectangle)
	var row = 0;
	var col = 0;
	var width = 0;
	var height = 0;
	var i = 0;
	var j = 0;
	for (row = 0; row < rows; row++)
	{
		for (col = 0; col < cols; col++)
		{
			item = array[row][col];
			if (item === 1)
			{
				// Start looking for collision rectangle
				// First measure the width
				for (width = 1; width < cols - col; width++)
				{
					rectWidth = width + 1;
					if (array[row][col + width] === 0)
					{
						rectWidth --;
						break;
					}
				}
				
				// Then look how many rows bellow of the same width are full of "1"s
				for (height = 1; height < rows - row; height++)
				{
					rectHeight = height + 1;
					if (!checkRowBellow(array, row + height, col, rectWidth))
					{
						rectHeight --;
						break;
					}
				}
				
				// Create collision rectangle
				sourceObject = {
					x: col * ratio,
					y: row * ratio,
					width: rectWidth * ratio,
					height: rectHeight * ratio
				}
				createSingleObject(collisionObject, sourceObject, true);
				
				// Clear collision marks in array
				for (i = 0; i < rectHeight; i++)
				{
					for (j = 0; j < rectWidth; j++)
					{
						array[row + i][col + j] = 0;
					}
				}
			}
		}
	}
	
	// Clear temp array
	levelData.tempCollisionArray = [];
}

function checkRowBellow(array, row, col, width)
{
	var value = true;
	for (var i = 0; i < width; i++)
	{
		if (array[row][col + i] === 0)
		{
			value = false;
			break;
		}
	}
	return value;
}

function putLayerTilesetsIntoArray()
{
	var tilesets = {
		tilesheets: [],
		tilesheetsGID: [],
		tilesheetsTiles: [],
		tilesheetsCol: [],
		sourceWidths: [],
		sourceHeights: [],
		tilesheetImages: [],
		tileGIDs: [],
		tileTypes: []
	};
	
	for (var i in mapData[levelData.level].tilesets)
	{
		tilesets.tilesheets.push(mapData[levelData.level].tilesets[i].name); // musí se shodovat s jménem v Image
		tilesets.tilesheetsGID.push(mapData[levelData.level].tilesets[i].firstgid);
		tilesets.tilesheetsTiles.push(mapData[levelData.level].tilesets[i].tilecount);
		tilesets.tilesheetsCol.push(mapData[levelData.level].tilesets[i].columns);
		tilesets.sourceWidths.push(mapData[levelData.level].tilesets[i].tilewidth);
		tilesets.sourceHeights.push(mapData[levelData.level].tilesets[i].tileheight);
		
		// Look for GIDs´ type if available and store them in arrays		
		if ("tiles" in mapData[levelData.level].tilesets[i])
		{
			for (var j in mapData[levelData.level].tilesets[i].tiles)
			{
				if ("type" in mapData[levelData.level].tilesets[i].tiles[j])
				{
					tilesets.tileGIDs.push(parseInt(j) + mapData[levelData.level].tilesets[i].firstgid);//1); // Must be +1!!!
					tilesets.tileTypes.push(mapData[levelData.level].tilesets[i].tiles[j].type);
					checkCollisionTypeString(mapData[levelData.level].tilesets[i].tiles[j].type);
				}
			}
		}
		
		// Find source image
		var imageName = mapData[levelData.level].tilesets[i].name;
		var index = imagesData.name.indexOf(imageName);
		tilesets.tilesheetImages.push(imagesData.image[index]);
	}
	
	levelData.tilesets = tilesets;
}

function checkCollisionTypeString(type)
{
	if (!type in gameData.tileTypes)
	{
		console.log("tile collision type", type, "not found");
	}
}

function drawTileOnCanvas(tile, sourceCanvas, layerTiledType, object)
{
	var sourceX = tile.tileGID % tile.sourceColumn * tile.sourceWidth;
	var sourceY = Math.floor(tile.tileGID / tile.sourceColumn) * tile.sourceHeight;
	var context = sourceCanvas.getContext("2d");
	
	switch(layerTiledType) // tohle by asi šlo také pøedìlat na "gid" in object
	{
		case "tilelayer":
			var x = tile.col * gameData.TILESIZE;
			var y = tile.row * gameData.TILESIZE;
			var width = gameData.TILESIZE;
			var height = gameData.TILESIZE;
			break;
		case "objectgroup":
			var x = adjustValue(object.x);
			var y = adjustValue(object.y - object.height); // objekty mají souøadnice vlevo dole
			var width = adjustValue(object.width);
			var height = adjustValue(object.height);
			break;
		default:
			console.log("nekde je chyba");
			break;
	}
	
	context.drawImage(tile.tilesheetImage,
		sourceX, sourceY, tile.sourceWidth, tile.sourceHeight,
		x, y, width, height);
}

function drawOnSourceCanvas(layerName, sourceCanvas, layerTiledType)
{
	// Find correct source landscape / foreground layer
	var layer = mapData[levelData.level].layers[findDataLayer(layerName)];
  
	// Define function variables
	var tileGID = 0;
	var row = 0;
	var col = 0;
	var tileInfo = null;

	// Paint canvas with tiles
	for (row = 0; row < levelData.rows; row++)
	{
		for (col = 0; col < levelData.columns; col++)
		{
			tileGID = layer.data[row * levelData.columns + col];						
			if (tileGID > 0)
			{
				tileInfo = findGIDinTilesets(tileGID);		
				if (tileInfo.tileGID >= 0)
				{
					tileInfo.row = row;
					tileInfo.col = col;
					drawTileOnCanvas(tileInfo, sourceCanvas, layerTiledType);
					leaveNoteAboutTileCollision(tileInfo);
				}
			}
		}
	}
}

function copyPartOfCanvas(targetCanvas, sourceCanvas, object)
{
	var tempObject = Object.create(object);
	adjustTempObject(tempObject);
	targetCanvas.getContext("2d").drawImage(sourceCanvas,
		tempObject.x, tempObject.y, tempObject.width, tempObject.height,
		tempObject.x, tempObject.y, tempObject.width, tempObject.height);
}

function createObjects(layerName)
{
	// Find source object layer
	var layer = mapData[levelData.level].layers[findDataLayer(layerName)];
	var objects = layer.objects;
	
	// Create all objects
	var object = null;
	var template = null;
	var name = "";
	
	var length = objects.length;
	if (length > 0)
	{
		for (var i = 0; i < length; i++)
		{
			// Find name if empty
			findNameForObjectIfAvailable(objects[i], layerName);
			
			findTypeForObjectIfNecessary(objects[i], layerName); //?
			
			// Look for general template (when object name !== template.name)
			name = findTemplateName(objects[i]);
			template = findObjectTemplate(name);
			createSingleObject(template, objects[i]);
		}
	}
}

function findNameForObjectIfAvailable(object, layerName)
{
	if (object.name === "" && layerName in objectNames)
	{
		object.name = objectNames[layerName];
	}
}

function findTemplateName(object)
{
	var name = object.name;
	if (name in objectSettings)
	{
		if ("template" in objectSettings[name])
		{
			name = objectSettings[name].template;
		}
	}
	return name;
}

function createCollisionBox(object)
{
	var name = findTemplateName(object);
	var	template = findObjectTemplate(name);
	createSingleObject(template, object);
}

function createSingleObject(template, sourceObject, directObject)
{
	var object = Object.create(template); // Direct objects are already in the SIZE
	
	var tempObject = Object.create(sourceObject);
	if (!directObject) // Indirect (Tiled) objects need to be adjusted
	{
		adjustTempObject(tempObject);
	}
	else
	{
	//	tempObject.height = object.height;
	}

	if (object.width === 0 || object.height === 0)
	{
		object.width = tempObject.width;
		object.height = tempObject.height;
	}

	if("gid" in sourceObject)	// 0:0 is left-down (tile objects)
	{
		object.x = tempObject.x + tempObject.width / 2 - object.width / 2;
		object.y = tempObject.y - tempObject.height / 2 - object.height / 2;
	}
	else											// 0:0 is left-top (rectangles)
	{
		object.x = tempObject.x;
		object.y = tempObject.y;
	}
	
	findSourceImage(object); // u gameObject to projde beze zmìny, sourceImage se najde až v setDefault
	
	object.setDefault(tempObject);
		
	// Push into correct array
	switch(object.type)
	{
		case "levelObjects":
			object.gridOccupy = [];
			arangeObjectWithinGridArrays(object);
			break;
		case "gameElements":
			console.log("nastava to?");
			array.push(object);
			break;
		default:
			console.log("asi chyba: ", object.name);
			break;
	}
	levelData[object.type].push(object);
	
	if (object.id !== null)
	{
		pushIntoArrayAndSortById(levelData.spritesToRender, object);
	}
	
	return object; // just in case
}

function findObjectTemplate(name)
{
	var template = null;
	var length = gameData.objectTemplates.length;
	if (length > 0)
	{
		var i = 0;
		for (i = 0; i < length; i++)
		{
			if (gameData.objectTemplates[i].name === name)
			{
				template = gameData.objectTemplates[i];
				break;
			}
		}
	}
	
	if (template === null){console.log(name, "chyba, nenasla se sablona pro objekt");}
	
	return template;
}

function findDataLayer(name)
{
	var array = mapData[levelData.level].layers;
	var i = findObjectInLayer(array, name);
	return i;
}

function findObjectInLayer(array, name)
{
	var index = -1;
	var length = array.length;
	if (length > 0)
	{
		for (var i = 0; i < length; i++)
		{
			if (array[i].name === name)
			{
				index = i;
				break;
			}
		}
	}
	return index;
}

function defineGridArrays(masterArray, nameArray)
{
	var array = [];
	var arrayWidth = Math.ceil(levelData.worldWidth / gameData.GRIDSIZE);
	var name = "";
	
	var length = nameArray.length;
	if (length > 0)
	{
		var i = 0;
		for (i = 0; i < length; i++)
		{ 
			name = nameArray[i];
			array = [];
			
			var j = 0;
			for (j = 0; j < arrayWidth; j++)
			{
				array.push([]);
			}
			// This will clear array from previous data
			masterArray[name] = array;
		}
	}
}

function createPlayer()
{
	// Find starting position
	var flags = findObjectsByName("flag", levelData.levelObjects);
	var length = flags.length;
	if (length > 0)
	{
		var i = 0;
		for (i = 0; i < length; i++)
		{
			if (flags[i].value === levelData.flag)
			{
				var flag = flags[i]; 
			}
		}
	}

	var sourceObject = {
		name: "Karkulka",
		x: flag.centerX(),
		y: flag.bottom(),
	};
	
	// Delete previous player if necessary
	if (levelData.levelObjects.indexOf(player) !== -1)
	{
		savePlayersValues();
		getObjectOut(player);
	}
	
	// Create player
	player = createSingleObject(karkulkaObject, sourceObject, true);
}

function createEmptyCanvas(width, height)
{
	var emptyCanvas = document.createElement("canvas");
		//emptyCanvas.style.display = "none"; // bez rámeèku
	  emptyCanvas.width = width;
	  emptyCanvas.height = height;
	return emptyCanvas;
}
