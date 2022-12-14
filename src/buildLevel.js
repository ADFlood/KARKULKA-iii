// createLevel.js


/*
slo?en? sprites to render
	1 background 1
	2 background 2
	3 landscape (max 3 vrstvy v Tiles: landspace 1 a? 3)
	4 layerObject
	5 foreground 1
	6 foreground 2 (pokud, tak sp?? jen jednotliv? objekty)
	7 gameElements
	8 window (nesm? p?ekr?vat buttons) // nebo by se muselo v?dy zm?nit id t?ch pod
	9 buttons
*/

// ok
function createLevel()
{
	// Define world's width and height
	levelData.rows = mapData[levelData.level].width;
	levelData.columns = mapData[levelData.level].height;
	levelData.worldWidth = levelData.rows * TILESIZE;
	levelData.worldHeight = levelData.columns * TILESIZE;
	levelData.centerX = levelData.worldWidth / 2;
	levelData.centerY = levelData.worldHeight / 2;
	
	// Create landscape sprite
	var landscape = createCanvasSprite(landscapeCanvas, LANDSCAPE, "landscape");
	
	// Create foreground sprite
	var foreground = createCanvasSprite(foregroundCanvas, FOREGROUND, "foreground");
	
	// Create objects upon Tiles' layers
	for (var i = 0; i < mapData[levelData.level].layers.length; i++)
	{
		var layerName = mapData[levelData.level].layers.name;
		switch(layerName)
		{
			case "background 1":
				createBackground(layerName, 1);
				break;
			case "background 2":
				createBackground(layerName, 2);
				break;
			case "landscape 1":
				drawOnSpriteCanvas(layerName, landscape);
				break;
			case "landscape 2":
				drawOnSpriteCanvas(layerName, landscape);
				break;
			case "landscape 3":
				drawOnSpriteCanvas(layerName, landscape);
				break;
			case "landscape 4":
				drawOnSpriteCanvas(layerName, landscape);
				break;
			case "foreground 1":
				drawOnSpriteCanvas(layerName, foreground);
				break;
			case "collision layer":
				createCollisionMap(layerName);
				break;
			case "level objects":
				levelObjects = [];
				createObjects(layerName);
			case "game elements":
				gameElements = [];
				buttons = [];
				createObjects(layerName);
				setButtons(); // p?i?ad? jim v?znam
				break;
			default:
				break;
		}
	}
	
	// Set level variables
	// player = frank
}


// ok
function createCanvasSprite(spriteCanvas, id, name)
{
	// Adjust landscape canvas
  spriteCanvas.width = levelData.worldWidth;;
  spriteCanvas.height = levelData.worldHeight
  
  // Create sprite from landscape canvas
  var object = Object.create(canvasSpriteObject);
    object.sourceImage = spriteCanvas;
    object.sourceWidth = spriteCanvas.width;
    object.sourceHeight = spriteCanvas.height;
    object.width = spriteCanvas.width;
    object.height = spriteCanvas.height;
    object.drawingSurface = spriteCanvas.getContext("2d");
    object.id = id;
    object.name = name;
      
  pushIntoArrayAndSortById(spritesToRender, object);
  
  return object;
}

// ok
function drawOnSpriteCanvas(layerName, canvasSprite)
{
	// Find correct source landscape / foreground layer
	var layer = mapData[levelData.level].layers[findDataLayer(layerName)];
  
	// Define function variables
	var sourceX = 0;
	var sourceY = 0;
	var x = 0;
	var y = 0;
	var sourceColumns = 0;
	var tileGID = 0;
	var sourceWidth = mapData[levelData.level].tilewidth; // snad ok, snad stejn? pro v?echny tilesety
	var sourceHeight = mapData[levelData.level].tileheight; // dtto
	var tilesLength = layer.data.length;
		
	// Put all tilesets into array
	var tilesheets = [];
	var tilesheetsGID = [];
	var tilesheetsCol = [];
	var tilesheetImages = [];
	var imageName = null;
	var j = 0;
	for (var i = 0; i < mapData[levelData.level].tilesets.length; i++)
	{
		tilesheets.push(mapData[levelData.level].tilesets[i].name); //? mus? se shodovat s jm?nem v Image
		tilesheetsGID.push(mapData[levelData.level].tilesets[i].firstgid);
		tilesheetsCol.push(mapData[levelData.level].tilesets[i].columns);
			
		// Find source image
		imageName = mapData[levelData.level].tilesets[i].name;
		j = imagesData.name.indexOf(imageName);
		tilesheetImages.push(imagesData.image[j]);
	}
	
	// Paint canvas with tiles
	for (var row = 0; row < levelData.rows; row++)
	{
		for (var col = 0; col < levelData.columns; col++)
		{
			tileGID = layer.data[row * levelData.columns + col];			
			
			if (tileGID > 0)
			{
				// Select tilesheet
				var lastGID = 0;
				for (var i = 0; i < tilesheetsGID.length; i++){
					if (tileGID < tilesheetsGID[i])
						{i--;	break;}
						else 
						{lastGID = tileGID;}}
				tilesheetImage = tilesheetImages[i];
				sourceColumns = tilesheetColumns[i];
			
				tileGID--; // proto?e v tilesheet za??naj? na pozici 0, ne od jedni?ky
				if (tileGID >= 0)
				{
					sourceX = tileGID % sourceColumns * sourceWidth;
					sourceY = Math.floor(tileGID / sourceColumns) * sourceHeight;
					x = col * TILESIZE;
					y = row * TILESIZE;
			
					canvasSprite.drawingSurface.drawImage(tilesheetImage,
						sourceX, sourceY, sourceWidth, sourceHeight,
						x, y, TILESIZE, TILESIZE);
				}
			}
		}
	}
}

// ok
function createBackground(layerName, Nr)
{
	var background = Object.create(backgroundObject);
	
	background.height = camera.height * BACKGROUNDRATIO * Nr; // je to Nr ok?
  var ratio = background.sourceHeight / background.height;
  background.width = Math.floor(background.sourceWidth / ratio);
  background.scrollStepX = (levelData.worldWidth - background.width) / (levelData.worldWidth - camera.width);
  background.scrollStepY = (levelData.worldHeight - background.height) / (levelData.worldHeight - camera.height);
	
  background.id = BACKGROUND + Nr - 1;
  
  var imageName = levelData.level + " " + layerName;
  var i = imagesData.name.indexOf(imageName);
  background.sourceImage = imagesData.image[i];
  
	pushIntoArrayAndSortById(spritesToRender, background);
}

// ok
function createObjects(layerName)
{
	// Find source object layer
	var layer = mapData[levelData.level].layers[findDataLayer(layerName)];
	var objects = layer.objects;
	
	// Create all objects
	var object = null;
	var template = null;
	var properties = null;
	
	for (var i = 0; i < objects.length; i++)
	{
		template = findObjectTemplate(objects[i].name);
		//properties = findObjectTemplate(objects[i]).properties;
		properties = objects[i].properties;
		createSingleObject(template, objects[i].x, objects[i].y, properties);
	}
}

// ok
function createSingleObject(template, x, y, properties)
{
	var object = Object.create(template);
	object.x = x;
	object.y = y;
	
	// Find sourceImage
	for (var i = 0; i < imagesData.name.length; i++)
	{
		if (imagesData.name[i] === object.imageName)
		{
			object.sourceImage = imagesData.image[i];
			break;
		}
	}
	
	object.setDefault(properties);
	
	// Push into correct array
	switch(object.type)
	{
		case "levelObject":
			levelObjects.push(object);
			break;
		case "button":
			buttons.push(object);
			break;
		case "gameElement":
			gameElements.push(object);
			break;
		default:
			break;
	}
	return object;
}

// ok
function findObjectTemplate(name)
{
	var arrayLength = objectTemplates.length;
	var template = null;
	for (var i = 0; i < arrayLength; i++)
	{
		if (objectTemplates[i].name === name)
		{
			template = objectTemplates[i];
			break;
		}
	}
	
	if (template === null){console.log("chyba, nena?la se ?ablona pro objekt");}
	
	return template[i];
}

// ok
function findDataLayer(name)
{
	var layersLength = mapData[levelData.level].layers.length;
  for (var i = 0; i < layersLength; i++)
  {
  	if (mapData[levelData.level].layers[i].name === name)
  	{
  		var layerNr = i;
  		break;
  	}
  }
  return layerNr;
}

// ok
function createCollisionMap(layerName)
{
	// Find source object layer
	var layer = mapData[levelData.level].layers[findDataLayer(layerName)];
	var objects = layer.objects;
	
	// Define function variables
	var sourceWidth = mapData[levelData.level].tilewidth;
	var sourceHeight = mapData[levelData.level].tileheight;
	var row = 0;
	var col = 0;
	var width = 0;
	var height = 0;
	
	// Defina collision map and clear it
	levelData.map = [];	
	for (var rr = 0; rr < mapData[levelData.level].height; rr++)
	{
		levelData.map.push([]);
		for (var cc = 0; cc < mapData[levelData.level].width; cc++)
		{
			levelData.map[rr].push(0);
		}
	}

	// Build collision fields
	for (var i = 0; i < objects.length; i++)
	{
		row = objects[i].y / sourceHeight;
		col = objects[i].x / sourceWidth;
		height = objects[i].height / sourceHeight;
		width = objects[i].width / sourceWidth;
		
		for (var rr = 0; rr < height; rr++)
		{
			for (var cc = 0; cc < width; cc++)
			{
				levelData.map[row + rr][col + cc] = 1;
			}
		}
	}
}
