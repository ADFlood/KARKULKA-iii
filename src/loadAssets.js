// loadAssets.js

// Define variables
var assetsToLoad = 0;     
var assetsLoaded = 0;
var assets = [];  // sem dubluju všechny soubory, aby pak nad nimi hromadnì smazal evenlistener
var allAssetsLoaded = false;

// Names of source images
var imagesData = {
	name: [
		"world1Image",
		"world2Image",
		"world5Image",
		"background1-1Image",
		"background1-2Image",
		"foreground1-1Image",
		"background2-1Image",
		"background2-2Image",
		"foreground2-1Image",
		"background5-1Image",
		"background5-2Image",
		"foreground5-1Image",
		"cloudsImage",
		"karkulkaImage",
		"turtleImage",
		"beeImage",
		"ghostImage",
		"spiderImage",
		"ropeImage",
		"treesImage",
		"slimeImage",
		"itemsImage",
		"itemsBigImage",
		"effectsImage",
		"infoImage",
		"uiImage"
	],
	image: []
};

//--- Load images
var imagesLoaded = 0;
var imagesToLoad = imagesData.name.length;
assetsToLoad += imagesToLoad;

for (var i = 0; i < imagesToLoad; i++)
{
  var image = new Image();
  image.addEventListener("load", loadHandler, false);
  image.src = "img/" + imagesData["name"][i] + ".png"
	imagesData["image"].push(image);
	assets.push(image);
}

//--- Load handler
function loadHandler(event)
{
  assetsLoaded++;
  if (assetsLoaded === assetsToLoad)
  {
    for (var i = 0; i < assetsToLoad; i++)
    {
      assets[i].removeEventListener("load", loadHandler, false);
    }
    
    // All assets loaded, letsStart
    allAssetsLoaded = true;
  } 
}

function findSourceImage(object)
{
	var length = imagesData.name.length;
	if (length > 0)
	{
		var i = 0;
		for (i = 0; i < length; i++)
		{
			if (imagesData.name[i] === object.imageName)
			{
				object.sourceImage = imagesData.image[i];
				break;
			}
		}
	}
}
