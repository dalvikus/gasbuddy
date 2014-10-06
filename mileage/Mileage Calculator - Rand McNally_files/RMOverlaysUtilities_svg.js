

function _RMMapOverlay_addEventListener(eventName, fnCallBack, _this){         

	var mySVGShapeElement = YAHOO.util.Dom.getFirstChild( _this._container );
	if (mySVGShapeElement != null) {
		YAHOO.util.Event.addListener(mySVGShapeElement.id, eventName, fnCallBack, _this, true);
	}
	else {
		YAHOO.util.Event.addListener(_this.id, eventName, fnCallBack, _this, true);
	}
}

function _RMMapOverlay_removeEventListener(eventName, fnCallBack, _this){	
	var mySVGShapeElement = YAHOO.util.Dom.getFirstChild(_this._container);	
	if (mySVGShapeElement != null) {
		YAHOO.util.Event.removeListener(mySVGShapeElement.id, eventName, fnCallBack);
	}
	else {
		YAHOO.util.Event.removeListener(_this.id, eventName, fnCallBack);
	}
}


function _RMPolyline_init(ID,listOfPoints,worldCoordSystem,topLeftCornerPixel,polyWidth,polyHeight,polyAttributes, _this){
		_this._type = "RMPolyline";
		
		//Get ribbon style
		var strokeWidth = 23;
		var color = "red";
		var opacity = 0.2;	
		//iterates polyAttributes object
		if(polyAttributes != null){
			if (polyAttributes.width != null)
				strokeWidth = polyAttributes.width + 3;  //Add 3 to it for FireFox wierdness
			if (polyAttributes.color != null)
				color = polyAttributes.color;
			if (polyAttributes.opacity != null)
				opacity = polyAttributes.opacity;
		}
		
				
		/////////// Fix a FireFox bug ///////////
		//shift listOfPoints to the bottom and right by the stroke width, so that the stroke thickness won't be cut off
		//resulting in ribons having variable thickness
		//Could have fixed this by setting the SVG element style to "overflow:visible;", but that didn't work on FFox
		var margin = strokeWidth; //in pixels.  Add 3 to it for FireFox wierdness
		var arrPoints = listOfPoints[0].split(" ");
		var adjustedPointsString = "";
		for (var p in arrPoints) {
			var point = arrPoints[p];
			var arrPair = point.split(",");
			arrPair[0] = parseInt(arrPair[0]) + margin; 
			arrPair[1] = parseInt(arrPair[1]) + margin;
			adjustedPointsString += arrPair[0] + "," + arrPair[1] + " ";
		}
		topLeftCornerPixel.x -= margin; //and move the entire drawing canvas top left, so that the ribbon still lines up with the roads
		topLeftCornerPixel.y -= margin;
		polyWidth += margin*2;
		polyHeight+= margin*2;
		/////////// End Fix a FireFox bug ///////////
		
		//SVG canvas
		var parentSVGLayer = RMUtils.createDOMElement("svg:svg", "svg");
	 	parentSVGLayer.setAttribute("width" , polyWidth + "px");
	    parentSVGLayer.setAttribute("height" , polyHeight + "px");
		parentSVGLayer.setAttribute("class","RMOverlays RMPolylines");
        parentSVGLayer.style.top = topLeftCornerPixel.y + "px";
		parentSVGLayer.style.left = topLeftCornerPixel.x + "px";
					
		//Route ribbon	
		var polyline = RMUtils.createDOMElement("svg:polyline","svg");		
		var pointsString = listOfPoints[0];			
		polyline.setAttribute("points",adjustedPointsString);	
		//AD:can't reset these attributes if I move it to the external css file		
		polyline.setAttribute("stroke",color);
		polyline.setAttribute("stroke-width",strokeWidth);
		polyline.setAttribute("opacity",opacity);
		
		_this.opacityLevel = opacity;
		_this.points = polyline.getAttribute("points");
		_this.color = color;
		_this.routeRibbonOverlayWidth = strokeWidth;
		parentSVGLayer.appendChild(polyline);
        parentSVGLayer.id = ID;
        
        return parentSVGLayer;
		
	
}			

function _RMMapOverlay_RMPolyline_setColor(colorAttribute, _this){
	var mySVGShapeElement = YAHOO.util.Dom.getFirstChild(_this._container);
	mySVGShapeElement.setAttribute("stroke", colorAttribute);
	_this.color = mySVGShapeElement.getAttribute("stroke");
}

function _RMMapOverlay_RMPolyline_setPoints(points, _this){
	var mySVGShapeElement = YAHOO.util.Dom.getFirstChild(_this._container);
	mySVGShapeElement.setAttribute("points",points);	
	_this.points = mySVGShapeElement.getAttribute("points");						
}

function _RMMapOverlay_RMPolyline_setOpacityLevel(opacityLevel, _this){
	var mySVGShapeElement = YAHOO.util.Dom.getFirstChild(_this._container);
	mySVGShapeElement.setAttribute("opacity",opacityLevel);			
	_this.opacityLevel = mySVGShapeElement.getAttribute("opacity");			
}		

function _RMMapOverlay_RMPolyline_setStrokeWidth(strokeWidth, _this){
	var mySVGShapeElement = YAHOO.util.Dom.getFirstChild(_this._container);
	mySVGShapeElement.setAttribute("stroke-width",strokeWidth);		
	_this.routeRibbonOverlayWidth = mySVGShapeElement.getAttribute("stroke-width");					
}	