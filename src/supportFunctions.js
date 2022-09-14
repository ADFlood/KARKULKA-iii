
function checkTwoObjectsCollision(object1, object2)
{
  var hit = false;

  if (object2 !== null)
  {
  	var vy = object1.centerY() - object2.centerY();
		var totalHalfHeight = object1.halfHeight() + object2.halfHeight();
		
		if (Math.abs(vy) < totalHalfHeight)
		{
			var vx = object1.centerX() - object2.centerX();
			var totalHalfWidth = object1.halfWidth() + object2.halfWidth();
			
			if (Math.abs(vx) < totalHalfWidth)
			{
				// Collision occures
				hit = true;
			}
		}
	}
	
  return hit;
}

function getSubArray(object, name)
{
  return findSubArray(object.centerX(), name);
}

function findSubArray(pointX, name)
{
	var index = Math.floor(pointX / gameData.GRIDSIZE);
  return levelData.levelObjectsGroups[name][index];
}

function checkCollisionWithArray(object, array) // vrátí vše kolidující
{
  var collisionObjects = [];
  
  var length = array.length;
  if (length > 0)
  {
  	var i = 0;
  	for (i = 0; i < length; i++)
  	{
  		if (checkTwoObjectsCollision(object, array[i]))
  		{
  			collisionObjects.push(array[i]);
  		}
  	}
  }
  
  return collisionObjects;
}

function hitTestPointLayerArray(pointX, pointY, name, command)
{
	if (command !== "array")
	{
		command = "single";
	}
	
  var array = findSubArray(pointX, name);
  var value = hitTestPointArray(pointX, pointY, array, command);
  return value;
}

function hitTestPointArray(pointX, pointY, array, command)
{
  // Define function variables
  var object = null;
  var collisionObjects = [];

  // Find collision
  var length = array.length;
  if (length > 0)
  {
  	var i = 0;
  	for (i = 0; i < length; i++)
		{
			object = array[i];
			if (hitTestPointSingle(pointX, pointY, object))
			{
				collisionObjects.push(object);
				if (command === "single")
				{
					break;
				}
			}
		}
	}
  
  if (command === "single")
  {
  	var returnValue = null;
  	if (collisionObjects.length > 0)
  	{
  		returnValue = collisionObjects[0];
  	}
  }
  else
  {
  	var returnValue = collisionObjects;
  }

  return returnValue;
}

function hitTestPointSingle(pointX, pointY, object)
{
  var hit = false;
  if (object.collisionX() <= pointX
   && object.collisionX() + object.collisionWidth > pointX)
  {
    if (object.collisionY() <= pointY
     && object.collisionY() + object.collisionHeight > pointY)
    {
      hit = true;
    }
  }
  return hit;
}

function setDefaultCollision(object)
{
	object.collisionX = object.x;
	object.collisionY = object.x;
	object.collisionWidth = object.width;
	object.collisionHeight = object.height;
}

function pushIntoArrayAndSortById(array, sprite)	// MOŽNÁ BY ŠLE ELEGANTNÌJI
{
	array.push(sprite);
	var i = 0;
	var j = 0;
	for (i = array.length - 1; i > -1; i--)
	{
		if (array[i].id < sprite.id)
		{
			for (j = array.length - 1; j > i + 1; j--)
			{
				array[j] = array[j - 1];
			}
			array[i + 1] = sprite;
			break;
		}
		
		if (sprite.id < array[0].id)
		{
			for (j = array.length - 1; j > 0; j--)
			{
				array[j] = array[j - 1];
			}
			array[0] = sprite;
		}
	}
}

function addElementsIntoArray(array, elements)
{
	var length = elements.length;
	if (length > 0)
	{
		var i = 0;
		for (i = 0; i < length; i++)
		{
			array.push(elements[i]);
		}
	}
}

function removeElementsFromArray(array, elements)
{
	var length = elements.length;
	if (length > 0)
	{
		var i = 0;
		for (i = 0; i < length; i++)
		{
			removeFromArray(array, elements[i]);
		}
	}
}

function removeFromArray(array, element)
{
	var index = array.indexOf(element);
	if (index !== -1)
	{
		array.splice(index, 1);
	}
}

function blockBox(r1, array, check)
{
	var array = array || [];
	
  // Define function variables
  var r2 = null;
  var vx = 0;
  var vy = 0;
  var totalHalfWidth = 0;
  var totalHalfHeight = 0;
  var overlapX = 0;
  var overlapY = 0;
  var collision = false;
    
  // Find collision
  var length = array.length;
  if (length > 0)
  {
  	var i = 0;
  	for (i = 0; i < length; i++)
		{
			
			r2 = array[i];
			vy = r1.centerY() - r2.centerY();
			totalHalfHeight = r1.halfHeight() + r2.halfHeight();
		
			if (Math.abs(vy) < totalHalfHeight)
			{
				vx = r1.centerX() - r2.centerX();
				totalHalfWidth = r1.halfWidth() + r2.halfWidth();
				if (Math.abs(vx) < totalHalfWidth)
				{
					// ŠLO BY ASI LÉPE NAVÁZAT NA CHECKOBJECTSCOLLIISON
					if (r2.isColideAble)
					{
						// Collision occures
						collision = true;
						
						if (check !== "check")
						{
							overlapX = totalHalfWidth - Math.abs(vx);
							overlapY = totalHalfHeight - Math.abs(vy);
							
							if (overlapX >= overlapY)
							{
								if (vy > 0) // r1 je pod r2
								{
									r1.y += overlapY;
									r1.vy = r1.vy / 4; // zbrzdí výskok pøi nárazu do stropu 
								}
								else
								{
									r1.y -= overlapY;
								}
							}
							else
							{
								if (vx > 0) // r1 je vpravo
								{
									r1.x += overlapX;
									r1.vx = 0;
								}
								else
								{
									r1.x -= overlapX;
									r1.vx = 0;
								}
							}
						}
					}
				}
			}
		}
	}
  
  return collision;
}

function blockBoxObject(r1, r2)
{
	var side = "";
	
	var vx = r1.centerX() - r2.centerX();
	var totalHalfWidth = r1.halfWidth() + r2.halfWidth();
	if (Math.abs(vx) < totalHalfWidth)
	{
		var vy = r1.centerY() - r2.centerY();
		var totalHalfHeight = r1.halfHeight() + r2.halfHeight();
		if (Math.abs(vy) < totalHalfHeight)
		{
			if (r2.isColideAble)
			{
				// Collision occures
				overlapX = totalHalfWidth - Math.abs(vx);
				overlapY = totalHalfHeight - Math.abs(vy);
								 
				if (overlapX >= overlapY)
				{
					if (vy > 0) // r1 je pod r2
					{
						side = "top";
						r1.y += overlapY;
						r1.vy = r1.vy / 4; // zbrzdí výskok pøi nárazu do stropu 
					}
					else
					{
						side = "down";
						r1.y -= overlapY;
					}
				}
				else
				{
					if (vx > 0) // r1 je vpravo
					{
						side = "left";
						r1.x += overlapX;
					}
					else
					{
						side = "right";
						r1.x -= overlapX;
					}
				}
			}
		}
	}
	
	return side;
}

function facingDirection(object)
{
	var facing = 1;
	if (object.facing === 1)	// 0 = RIGHT, 1 = LEFT
	{
		facing = -1;
	}
	return facing;						// -1 = LEFT, +1 = RIGHT
}

function checkFacing(object)
{
	if (object.doX !== 0)
  {
  	object.previousFacing = object.facing;
  	object.facing = Math.abs(Math.ceil(object.doX / 2) - 1); // 0 = LEFT, 1 = RIGHT
  	if (object.facing !== object.previousFacing)
  	{
  		object.vx = 0;
  		object.x += object.offsetTurningX * facingDirection(object);
  	}
  }
}

function checkDistance(object, otherObject, distance, spread)
{
	var isInReach = false;
	var distanceX = otherObject.centerX() - object.centerX(); // - vlevo, + vpravo
	var distanceY = Math.abs(object.centerY() - otherObject.centerY());
		
	var facing = facingDirection(object);
	
	if (distanceX * facing > 0 // menší než nula znamená, že nemají stejná znaménka (a tedy smìr)
	 && distanceX <= distance
 	 && distanceY <= spread)
	{
		isInReach = true;
	}
	
	return isInReach;
}

function loadEffectProperties(object, sourceObject)
{
	// Load properties from effects database
	if (sourceObject.effectName in effectSettings)
	{
		copyProperties(effectSettings[sourceObject.effectName], object);
	}
}

function setObjectProperties(object, sourceObject)
{
	// Load properties from object database
	if (sourceObject.name in objectSettings)
	{
		copyProperties(objectSettings[sourceObject.name], object);
	}
	
	// Load user properties from Tiled
	if ("properties" in sourceObject)
	{
		copyProperties(sourceObject.properties, object);
	}
}

function copyProperties(object1, object2) // o1 -> o2
{
	for (var i in object1)
	{
		object2[i] = object1[i];
	}
}

function checkObjectsBeingClose(object, otherObject)
{
	var close = false;
	
	if (object !== null && otherObject !== null)
	{
		var distanceX = object.centerX() - otherObject.centerX();
		var distanceY = object.centerY() - otherObject.centerY();
	
		if (Math.abs(distanceX) < gameData.SIZE / 10
		 && Math.abs(distanceY) < gameData.SIZE / 10)
		{
			close = true;
		}
	}
	
	return close;
}

function adjustTempObject(tempObject)
{
	tempObject.x = adjustValue(tempObject.x);
	tempObject.y = adjustValue(tempObject.y);
	tempObject.width = adjustValue(tempObject.width);
	tempObject.height = adjustValue(tempObject.height);
}

function adjustValue(value) // spíš používat getResizeRatio?
{
	return value / MAPBASE * gameData.TILESIZE;
}


function findGIDinTilesets(tileGID)
{
	var tilesheetsGID = levelData.tilesets.tilesheetsGID;
	var tilesheetsTiles = levelData.tilesets.tilesheetsTiles;
	
	var length = tilesheetsGID.length;
	if (length > 0)
	{
		for (var i = 0; i < length; i++)
		{
			if (tileGID >= tilesheetsGID[i]
			 && tileGID < tilesheetsGID[i] + tilesheetsTiles[i])
			{
				break;
			}
		}
	}
	
	var index = levelData.tilesets.tileGIDs.indexOf(tileGID);
	if (index !== -1)
	{
		var tileType = levelData.tilesets.tileTypes[index];
	}
	else
	{
		var tileType = 0;
	}
	
	return {
		tilesheetImage: levelData.tilesets.tilesheetImages[i],
		sourceColumn: levelData.tilesets.tilesheetsCol[i],
		sourceWidth: levelData.tilesets.sourceWidths[i],
		sourceHeight: levelData.tilesets.sourceHeights[i],
		tileGID: tileGID - tilesheetsGID[i],
		tileType: tileType
		};
}

function setObjectTimer(object)
{
	object.timer = Math.floor((Math.random() * (object.timerMax - object.timerMin)) + object.timerMin);
}

function getObjectOut(object, clearMaster)
{
	removeFromArray(levelData.spritesToRender, object);
	removeFromArray(levelData.levelObjects, object);

	if (clearMaster !== false)
	{
		//var masterArray = levelData.levelObjectsGroups[object.subtype];
		var masterArray = getMasterArray(object);
		
		var length = object.gridOccupy.length;
		if (length > 0)
		{
			var i = 0;
			var index = 0;
			for (i = 0; i < length; i++)
			{
				index = object.gridOccupy[i];
				removeElementsFromArray(masterArray[index], object);
			}
		}
	}
}


function addScore(item)
{
	gameData.score += item.value;
}

function checkObjectsHit(object, objectsHit, weapon)
{
	var length = objectsHit.length;
	if (length > 0)
	{
		var i = 0;
		for (i = 0; i < length; i++)
		{
			switch(objectsHit[i].subtype)
			{
				case "characters":
					if (objectsHit[i].team !== object.team)
					{
						objectsHit[i].isHit();
						// a pak nìkam na generalní funkci kvùli bodùm??
					}
					break;
				case "objects":
					if (objectsHit[i].isShootAble)
					{
						objectsHit[i].onCollision(object, null, weapon);
						// a pak nìkam na generalní funkci kvùli bodùm??
					}
					break;
				default:
					console.log("nemelo by nastat");
					break;
			}
		}
	}
}

function getMasterArray(object){
	return levelData[object.type + "Groups"][object.subtype];
}

function arangeObjectWithinGridArrays(object)
{
	var grid = Math.floor(object.centerX() / gameData.GRIDSIZE);
	
	if (object.gridCurrent !== grid)
	{
		var array = getMasterArray(object);
		// master array je levelData[object.type + "Groups"][object.subtype], pod ním pak 0 - n
		var left = Math.floor(object.collisionX() / gameData.GRIDSIZE);
		var right = Math.floor((object.collisionX() + object.collisionWidth - 1) / gameData.GRIDSIZE);
	
		left = Math.max(left - 1, 0);
		right = Math.min(right + 1, array.length - 1);
		
		var validArrayRefs = [];
		var i = 0;
		for (i = left; i < right + 1; i++)
		{
			validArrayRefs.push(i);
		}
		
		// v arraysIn/Out jen reference na subarrays    masterArrays[subarray1, subarray2, ...]
		// teprve v subarray jsou uloženy objekty
		var arrayRefIn = compareArrays(validArrayRefs, object.gridOccupy);	// kde se má pøidat
		var arrayRefOut = compareArrays(object.gridOccupy, validArrayRefs);	// kde se má vyhodit
		
		// Odstraní/pøidá reference v occupy
		removeElementsFromArray(object.gridOccupy, arrayRefOut);
		addElementsIntoArray(object.gridOccupy, arrayRefIn);
		
		// Odstraní/pøidá objekty z pole, na které ukazuje reference v occupy
		var index = 0;
		var length = arrayRefOut.length;
		if (length > 0)
		{
			for (i = 0; i < length; i++)
			{
				index = arrayRefOut[i];
				removeFromArray(array[index], object);
			}
		}

		length = arrayRefIn.length;
		if (length > 0)
		{
			for (i = 0; i < length; i++)
			{
				index = arrayRefIn[i];
				array[index].push(object);
			}
		}
		
		object.gridCurrent = grid;
	}
}

function compareArrays(arrayA, arrayB)
{
	// zjišuje, co z pole A není v poli B
	var missingElements = [];
	var length = arrayA.length;
	if (length > 0)
	{
		var i = 0;
		for (i = 0; i < length; i++)
		{
			if (arrayB.indexOf(arrayA[i]) === -1) // element z A není v B
			{
				missingElements.push(arrayA[i]);
			}
		}
	}
	return missingElements;
}
                     
function setCollisions(object)
{
  object.collisionWidth = Math.ceil(object.width * (1 - object.colX - object.colXX));
  object.collisionOffsetX = Math.floor((object.width * object.colX));
  object.collisionHeight = Math.ceil(object.height * (1 - object.colY - object.colYY));
  object.collisionOffsetY = Math.floor((object.height * object.colY));
}

function makeBitValueNegative(value)
{
	var newValue = 1;
	if (value === 1)
	{
		newValue = 0;
	}
	return newValue;
}

function findTypeForObjectIfNecessary(object, layerName)
{
	if (object.type === "")
	{
		if (layerName !== "collisions")
		{
			object.type = "objectTile";
		}
	}
}                                                                   

function alignObjectsCentre(object1, object2) // 1 podle 2
{
	object1.x = object2.centerX() - object1.width / 2;
	object1.y = object2.centerY() - object1.height / 2;
}

function createEffect(sourceObject)
{
	var object = Object.create(effectObject);
	findSourceImage(object);
	object.setDefault(sourceObject);
	
	levelData.levelObjects.push(object);
	pushIntoArrayAndSortById(levelData.spritesToRender, object);
}

function findObjectsByName(name, array)
{
	var objects = [];
	var length = array.length;
	if (length > 0)
	{
		var i = 0;
		for (i = 0; i < length; i++)
		{
			if (array[i].name === name)
			{
				objects.push(array[i]);
			}
		}
	}
	return objects;
}

function findObjectByName(name, array)
{
	var object = null;
	var objectsFound = findObjectsByName(name, array);
	if (objectsFound.length > 0)
	{
		object = objectsFound[0];
	}
	return object;
}

function doAnimation(object)
{
	if (object.animated)
	{
		if (!object.newStateStarted)
		{
			object.frame += object.frameSpeed;
			
			if (object.frame >= object.frames)
			{
				object.frame = 0;
			}
		}
		else
		{
			object.newStateStarted = false;
		}
	}
}

function checkHardGroundAhead(object)
{
	var goAhead = true;
	
	if (!object.ableToFall && object.stateName !== "jump")
	{
		var pointY = object.bottom() + 1;
  	var pointX = object.collisionX() + Math.ceil(facingDirection(object) / 2) * object.collisionWidth
			+ facingDirection(object);
  	var objectDown = (hitTestPointLayerArray(pointX, pointY, "collisions"));
  	
  	if (objectDown === null)
  	{
  		goAhead = false;
  	}
  }

  return goAhead;
}

function checkFreeWayAhead(object)
{
	var goAhead = true;
	
	if (!object.freeMove)
	{
		if (object.x === object.lastX && Math.abs(object.accelerationX) > 0)//vx) > 0)// bylo >=
		{
			goAhead = false;
		}
	}
	
	return goAhead;
}

function loadScenario(scenario)
{
	var i = 0;
	var length = scenario.length;
	var task = "";
	if (length > 0)
	{
		for (i = 0; i < length; i++)
		{
			task = scenario[i];
			gameData.tasks.push(task);
		}
	}
}

function listAllStates(object)
{
	object.allStates = []; // Musí zde být, a se restartuje pro každý objekt znovu
	for (var i in object)
	{
		if (object[i] !== null)
		{
			if (object[i].hasOwnProperty("stateName"))
			{
				if (i !== "state")
				{
					object.allStates.push(object[i]);
				}
			}
		}
	}
}

function findStateByName(object, name)
{
	var newState = null;
	var length = object.allStates.length;
	if (length > 0)
	{
		var i = 0;
		for (i = 0; i < length; i++)
		{
			if (object.allStates[i].stateName === name)
			{
				newState = object.allStates[i];
				break;
			}
		}
	}
	if (newState === null)
	{
		console.log("chyba");
	}
	return newState;
}

//??
//function getResizeRatio()
//{
//	return gameData.TILESIZE / MAPBASE;
//}

function findDoorByPlace(door)
{
	var length = levelData.doors.length;
	if (length > 0)
	{
		for (var i = 0; i < length; i++)
		{
			if (levelData.doors[i].place === door.direction)
			{
				door = levelData.doors[i];
				break;
			}
		}
	}
	return door; // return former door if direction is not found
}

function loadPlayersValues()
{
	player.coins = gameData.coins;
	player.lives = gameData.lives;
}

function savePlayersValues()
{
	gameData.coins = player.coins;
	gameData.lives = player.lives;
}

function addGraphicsToShow(graphicSet, clearArray)
{
	if (clearArray)
	{
		gameData.graphicsToShow = [];
	}
	
	if (graphicSet in gameData.graphicSets)
	{
		var length = gameData.graphicSets[graphicSet].length;
		if (length > 0)
		{
			var i = 0;
			for (i = 0; i < length; i++)
			{
				gameData.graphicsToShow.push(gameData.graphicSets[graphicSet][i]);
			}
		}
	}
}