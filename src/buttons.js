// buttons.js

//--- Button object
var buttonObject = Object.create(generalSpriteObject);
	gameData.objectTemplates.push(buttonObject);

	// General
	buttonObject.id = gameData.ids.BUTTON;
	buttonObject.name = "buton";
	buttonObject.type = "buttons";
	
	// Image
	buttonObject.imageName = "buttons";
	buttonObject.sourceWidth = gameData.TILESIZE;	// spr?vn?? a je to zde v?bec t?eba?
	buttonObject.sourceHeight = gameData.TILESIZE;	// dtto?
	
	// Position
	buttonObject.width = gameData.BUTTONSIZE;
	buttonObject.height = gameData.BUTTONSIZE;
	
	// Visibility
	buttonObject.mandatoryRender = true;
	buttonObject.scrollable = false;
	buttonObject.invisible = false;
	
	// Specific
	buttonObject.belongsTo = "main menu";
	buttonObject.logic = 0;  // v?znam, p?ijde z Tiles
	buttonObject.isActive = true;
	buttonObject.cursorOver = false;
	buttonObject.NORMAL = 0;
	buttonObject.HOOVER = 1;
	buttonObject.PRESSED = 2;
	buttonObject.NONACTIVE = 3;
	buttonObject.update = function(){
		if (this.belongsTo === gameState)
		{
			if (this.isActive)
			{
				// Check cursor over
				if (hitTestPointSingle(cursor.x, cursor.y, this))
					{this.cursorOver = true;}
				else
					{this.cursorOver = false;}
				
				switch(this.state)
				{
					case this.NONACTIVE:
						this.state = this.NORMAL;
						break;
					case this.NORMAL:
						if (this.cursorOver)
							{this.state = this.HOOVER;}
						break;
					case this.HOOVER:
						if (this.cursorOver	&& cursor.click)
							{this.state = this.PRESSED;}
						else if (!this.cursorOver)
							{this.state = this.NORMAL;}
						break;
					case this.PRESSED:
						this.buttonOn();
						if (!this.cursorOver || !cursor.click)
						{
							this.buttonOff();
							if (this.cursorOver)
								{this.state = this.HOOVER;}
							else
								{this.state = this.NORMAL;}
						}
						break;
					default: break;	
				}
			}
			else
			{
				this.state = this.NONACTIVE;
			}
		}
		else
		{
			//this.isActive = false; // podle m? nen? pot?eba, automaticky je neaktivn?, kdy? nepat?? do gameState
			this.state = this.NONACTIVE;
		}
		
		this.updateImage();
	};
	
	buttonObject.updateImage = function(){
		if (!this.invisible)
		{
			this.sourceY = this.logic * this.sourceHeight;
			this.sourceX = this.state * this.sourceWidth;
		}
	};
	buttonObject.logicList = [
		"left",
		"right",
		"up",
		"down",
		"attack",
		"pause",
		"back to menu",
		"save",
		"load",
		"getPosition"
		];
	buttonObject.setDefault = function(object){
		this.logic = this.logicList.indexOf(object.properties["logic"]);
		this.name = object.properties["logic"];
		setDefaultCollision(this);
		};
	buttonObject.buttonOn = function(){};
	buttonObject.buttonOff = function(){};


function setButtons()
{
	if (buttons.length > 0)
	{
		for (var i = 0; i < buttons.length; i++)
		{
			setButton(buttons[i]);
		}
	}
}

function setButton(button)
{
	switch(button.name)
	{
		case "left":
			var buttonOn = function(){moveLeftTrue()};
			var buttonOff = function(){moveLeftFalse()}; 
			break;
		case "right":
			var buttonOn = function(){moveRightTrue()};
			var buttonOff = function(){moveRightFalse()}; 
			break;
		case "up":
			var buttonOn = function(){moveUpTrue()};
			var buttonOff = function(){moveUpFalse()}; 
			break;
		case "down":
			var buttonOn = function(){moveDownTrue()};
			var buttonOff = function(){moveDownFalse()}; 
			break;
		case "attack":
			var buttonOn = function(){attackTrue()};
			var buttonOff = function(){attackFalse()}; 
			break;
		case "getPosition":
			gameData.
			break;
		default:
			break;
	}
	button.buttonOn = buttonOn;
	button.buttonOff = buttonOff;
}