// mainCode.js

(function(){

var interval = window.setInterval(letsStart, 100);

function letsStart()
{
  if (allAssetsLoaded)
  {
  	window.clearInterval(interval);
    createUIObjects();
    requestAnimationFrame(update);
  }
}

function createUIObjects()
{
	var object = {};
	for (var i in uiSettings)
	{
		object = Object.create(uiObject);
		object.name = i;
		copyProperties(uiSettings[i], object);
		object.setDefault(object);
	}
	gameData.arraysToRender.push(gameData.spritesToRender);
}

function update(timestamp)
{
	// Initial setting
	if (gameData.lastTimestamp === 0){
		gameData.lastTimestamp = timestamp;
	}
	
	// Game engine loop every 1/30 sec
	gameData.progress += timestamp - gameData.lastTimestamp;
	gameData.lastTimestamp = timestamp;
	while (gameData.progress >= gameData.timestep)
	{
		gameStateManager();
		gameData.progress -= gameData.timestep;
	}
	
	// Render 30 times per second
	if (gameData.renderFrame > 0)
	{
		render();
	}
	gameData.renderFrame *= -1;
	
	requestAnimationFrame(update);
}

function gameStateManager()
{
  switch(gameData.gameState)
  {
	  case "start from scratch":
	  	levelData.level = 0;
	  	gameData.gameState = "build level";
	  	break;
  	case "build level":
    	buildLevel();	// levelCreator
  	  break;
  	case "working...":
  		console.log("working");
  		break;
    case "playing":
      playGame();
      break;
    default:
    	// First run
    	addGraphicsToShow("buildingLevel", true);
    	gameData.gameState = "start from scratch";
      break;
  }
}

function playGame()
{
	manageCommands();
	levelStateCheck();
  updateLevelObjects();
  camera.scroll();
}

function levelStateCheck()
{
	switch(levelData.levelState)
	{
		case "restart":
			adjustLevel();
			break;
		case "playing":
			gameCheck();
			break;
		case "completed":
			levelCompleted();
			break;
		case "game over":
			gameOver()
			break;
		default:
			console.log("error - levelState not valid");
			break;
	}
}

function gameOver(forced)
{
	if (player.lives <= 0 || forced)
	{
		gameData.gameState = "start from scratch";
	}
	else
	{
		levelData.levelState = "restart";
	}
}

function levelCompleted()
{	
	if (gameData.tasks.length === 0)
	{	
		savePlayersValues();
				
		if (levelData.level === 0)
		{
			levelData.level = gameData.levelChosen;
		}
		else
		{
			levelData.level ++;
		}
		
		if (levelData.level > gameData.maxLevels)
		{
			// ve finále odkaz na game over (asi samostatný level, kde bude blahopøání)
			levelData.level = 0; // jen doèasnì
		}
		// nìjaká pauza?
		gameData.gameState = "build level";
	}
}

function gameCheck()
{
	// In water check
	if (player.bottom() >= levelData.worldHeight)
	{
		player.health = 0;
	}
	
	// Health check
	player.health = Math.max(player.health, 0);
	if (player.health === 0 && !player.dying)
	{
		lifeLost();
	}
}

function lifeLost()
{
	player.dying = true;
	if (player.lives > 0)
	{
		gameData.textObject.textStorage = "life lost, remains " + player.lives;
	}
	else
	{
		gameData.textObject.textStorage = "GAME OVER";
	}
	loadScenario(gameData.playerDead);
}

function manageCommands()
{
	readCursorForControllingPlayer();
	processTasks();
	manageCommandBuffer();
}

function loadPosition(attribute)
{
	// zatím jen pro "flag"
	if (gameData.position !== {})
	{
		
	}
}

function readCursorForControllingPlayer()
{
	if (!player.controlPlayer && cursor.click)
	{
		if (levelData.level === 0)
		{
			var length = levelData.levelObjects.length;
			if (length > 0)
			{
				var object = null;
				var x = 0;
				var y = 0;
				var i = 0;
				for (i = 0; i < length; i++)
				{
					x = cursor.clickedX + camera.x;
					y = cursor.clickedY + camera.y;		
					object = levelData.levelObjects[i];
					
					if (hitTestPointSingle(x, y, object))
					{
						if ("clickAble" in object)
						{
							if (object.clickAble)
							{
								switch(object.name)
								{
									case "door":
										if (levelData.levelState !== "completed")
										{
											// Level chosen
											object.doSomethingSpecial(object);	// opens the door
											object.enter(object);								// walks character into the door
										}
										break;
									default:
										// Other places where player can go without "completing" the level
										player.targetObject.x = object.centerX();
										player.targetObject.y = object.centerY();
										break;
								}
								break;
							}
						}
					}
				}
			}
		}
	}
}

function processTasks()
{
	if (gameData.tasks.length > 0)
	{
		var task = gameData.tasks[0];
		if (task in gameData)
		{
			gameData[task]();
		}
		else
		{
			console.log("error - scenario not valid: ", task);
		}
	}
}

function manageCommandBuffer()
{
	var length = gameData.commandBuffer.length;
	if (length > 0)
	{
		console.log("processing command buffer...");
		var i = 0;
		for (i = 0; i < length; i++)
		{
			switch(gameData.commandBuffer[i])
			{
				case "load position":
					loadPosition("flag");
					break;
				default:
					break;
			}
		}
	}
	gameData.commandBuffer = [];
}

function updateLevelObjects()
{
  var object = null;
  var i = 0;
	for (i = 0; i < levelData.levelObjects.length; i++)
	// musí být takto, jinak pøi zmìnì poètu v rámci jednoho cyklu dojde k chybì
	{
		object = levelData.levelObjects[i];
		
		//--- Make decision
		if (object.subtype === "characters")
		{
			if (object === player && object.controlPlayer) 
			{
				readPlayersDecision(object);
			}
			else
			{
				object.makeDecision();
			}
			object.perform();
		}
		
		//--- Move object
		if (object.isDynamic)
		{
			// Apply acceleration
			object.vx += object.accelerationX;
			object.vy += object.accelerationY;
		
			// Apply gravity
			object.vy += object.gravity;
			 
			// Limit speed
			object.vx = Math.min(object.vx, object.speed);
			object.vx = Math.max(object.vx, -object.speed);
			
			// Apply ground speed
			applyGroundSpeed(object);

			object.lastX = object.x;
			
			// Move object
			object.x += object.vx;
			object.y += object.vy;
			
			// Save position before any collision
			object.previousX = object.x;
			object.previousY = object.y;
			
			// Check for collision with landscape
			checkForCollisionWithLandscape(object);
			
			// Arrange object within grid subarrays
			arangeObjectWithinGridArrays(object);
			
			// Check for collision with characters
			checkForCollisionWithOther("characters", object);
							
			// Check for collision with other objects
			checkForCollisionWithOther("objects", object);

			// Reset vy if object is on hard surface
			checkBeingOnHardSurface(object);
		}
								
		//--- Make action
		object.action(object);
	}
}

function applyGroundSpeed(object)
{
	if (object.gravity > 0)
	{
		// Look bellow
		var pointX = object.centerX();
		var pointY = object.bottom() + 1;
		var objectsDown = (hitTestPointLayerArray(pointX, pointY, "objects", "array"));
		
		var length = objectsDown.length;
		if (length > 0)
		{
			var i = 0;
			for (i = 0; i < length; i++)
			{
				if (objectsDown[i].isCarryAble && "speedX" in objectsDown[i])
				{
					object.x += objectsDown[i].speedX * objectsDown[i].direction;
					break;
				}
			}
		}
	}
}

function checkForCollisionWithLandscape(object)
{
	if (!object.freeMove)
	{		
		blockBox(object, levelData.levelObjectsGroups.collisions[object.gridCurrent]);
	}
	
	// Limit position by world
	object.x = Math.max(object.x, 0 - object.collisionOffsetX);
	object.x = Math.min(object.x, levelData.worldWidth - object.collisionWidth);
	object.y = Math.min(object.y, levelData.worldHeight - object.collisionHeight);
}

function checkForCollisionWithOther(subtype, object)
{
	var array = getSubArray(object, subtype);
	var collidedObjects = checkCollisionWithArray(object, array);
	
	var length = collidedObjects.length;
	if (length > 0)
	{
		var i = 0;
		for (i = 0; i < length; i++)
		{
			collidedObjects[i].onCollision(object, collidedObjects[i]);
		}
	}
}

function checkBeingOnHardSurface(object)
{
	if (object.gravity > 0 && object.vy > 0)
	{
		if (object.y < object.previousY)
		// Object is standing
		{
			object.vy = 0;
			object.changeStateAfterHittingGround();
		}
		else
		// Object is falling
		{
			object.changeStateAfterMissingGround();
			object.accelerationX *= 0.5;
		}
	}
}

//--- Render
function render()
{
	if (!gameData.rendering)
	{
		gameData.rendering = true;
		
		prepareToRender();
		doRender();
		
		// Allow another render cycle
		gameData.rendering = false;
	}
	else
	{
		console.log("no render allowed");
	}
}

function prepareToRender()
{
	// Define function variables
	var lengthA = gameData.arraysToRender.length;
	var lengthB = 0;
	var sprite = null;
	var spriteToDraw = null;
	gameData.spritesToDraw = [];
	
	// Loop through sprites arrays
	var a = 0;
	var i = 0;
	for (a = 0; a < lengthA; a++)
	{
		lengthB = gameData.arraysToRender[a].length;
		for (i = 0; i < lengthB; i++)
		{
			sprite = gameData.arraysToRender[a][i];
			sprite.update(sprite); // pøedsunuto, aby se posunul frame každého sprite, i když se nebude vykreslovat
			
			if (camera.collisionTest(sprite))
			{				
				if (sprite.alpha > 0)
				{
					switch (sprite.subtype)
					{
						case "text":
							spriteToDraw = sprite;//createTextSprite(sprite);
							break;
						default:
							spriteToDraw = sprite;//createImageSprite(sprite);
							break;
					}
					
					gameData.spritesToDraw.push(spriteToDraw);
				}
			}
		}
	}
}

function doRender()
{
	// Clear the canvas
	drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
	
	var length = gameData.spritesToDraw.length;
	var sprite = null;
	var i = 0;
	for (i = 0; i < length; i++)
	{
		sprite = gameData.spritesToDraw[i];
		
		// Move the drawingSurface according to camera position if sprite is scrollable
		if (sprite.scrollable){
			drawingSurface.translate(-camera.x, -camera.y);
		}
					
		// Render
		drawingSurface.globalAlpha = sprite.alpha;
		switch(sprite.subtype)
		{
			case "text":
				renderText(sprite);
				break;
			default:
				renderImage(sprite);
				break;
		}
		
		// Move the drawingSurface according to camera position back
		if (sprite.scrollable){
			drawingSurface.translate(camera.x, camera.y);
		}
	}
}
	
function createTextSprite(sprite)
{
	return {
		scrollable: sprite.scrollable,
		alpha: sprite.alpha,
		subtype: sprite.subtype,
		font: sprite.font,
		fillStyle: sprite.fillStyle,
		textBaseline: sprite.textBaseline,
		textToRender: sprite.textToRender,
		textAlign: sprite.textAlign,
		x: sprite.x,
		y: sprite.y
	};
}

function createImageSprite(sprite)
{
	return {
		scrollable: sprite.scrollable,
		alpha: sprite.alpha,
		subtype: sprite.subtype,
		sourceImage: sprite.sourceImage,
		sourceX: sprite.sourceX,
		sourceY: sprite.sourceY,
		sourceWidth: sprite.sourceWidth,
		sourceHeight: sprite.sourceHeight,
		x: sprite.x,
		y: sprite.y,
		width: sprite.width,
		height: sprite.height
	};
}

function renderText(sprite)
{
	drawingSurface.font = sprite.font;
	drawingSurface.fillStyle = sprite.fillStyle;
	drawingSurface.textBaseline = sprite.textBaseline;

	var metrics = drawingSurface.measureText(sprite.textToRender);
	sprite.width = metrics.width;
	switch(sprite.textAlign)
	{
		case "middle":
			sprite.x -= sprite.width / 2;
			break;
		case "right":
			sprite.x -= sprite.width;
			break;
		default:
			// left
			break
	}
	
	drawingSurface.fillText(sprite.textToRender, sprite.x, sprite.y);
}

function renderImage(sprite)
{
	drawingSurface.drawImage(sprite.sourceImage,
		sprite.sourceX, sprite.sourceY,
		sprite.sourceWidth, sprite.sourceHeight,
		Math.round(sprite.x), Math.round(sprite.y),
		Math.round(sprite.width), Math.round(sprite.height));
}


} ()); // end of imidiate function