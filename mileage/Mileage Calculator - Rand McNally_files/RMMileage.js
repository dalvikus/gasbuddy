/**
 * @author mamta
 * Sept, 13 2010
 * This JS has functions that will call the rmmap_min.js functions
 * to calculate mileage and display the result.
 * Prerequisite: include rmmap_min.js in the calling HTMl/JSP page.
 * 
 */

/* Fix for RMResources not getting included in out.js */
var RMMilResources = [];

//var rmcLoggerParams = "";
//var locationsStr = "";
RMMilResources.DIR_UNABLE_TO_CALCULATE_ROUTE = "We are unable to produce these driving directions.<br/> Please try a different origin and/or destination.";
RMMilResources.GEOCODE_MISSING_INPUT_ADDRESS = "Please enter a street, city, state, or postal code.";
RMMilResources.GEOCODE_ADDRESS_NOT_FOUND = "We could not find the location you entered. Please,<br/><br/><ul class='errorBullets'><li>Check your spelling</li><br/><li>Enter a street, city, state, or postal code</li></ul>";
RMMilResources.ADDRESS_CANNOT_SAVE_EMPTY = "Please specify an address before saving."
RMMilResources.ADDRESS_CANNOT_SAVE_AIRPORT = "Sorry, you cannot add an airport code in the address book.";
RMMilResources.GEOCODE_MULTIPLE_RESULTS = "Please select one of the following locations:";
//RMResources.GEOCODE_MULTIPLE_POI_RESULTS = "Did you mean to search for a business or place?";
//RMResources.GEOCODE_MULTIPLE_ONLY_POI_RESULTS = "We could not find the location you entered. Did you mean to locate for one of the following businesses or places?";
RMMilResources.GEOCODE_MULTIPLE_POI_RESULTS = "Did you mean to locate one of the following locations?";
RMMilResources.GEOCODE_MULTIPLE_ONLY_POI_RESULTS = "We could not find the location you entered. Did you mean to locate one of the following locations?";


/* business logic for mileage */
var locAId = 'loc1'; // hard code id of input box A
var locBId = 'loc2'; // hard code id of input box B
var locCId = 'loc3'; // hard code id of input box A
var locDId = 'loc4'; // hard code id of input box B

var locA;  //will hold input box A object
var locB; //will hold input box B object
var milDistance; // will hold resultant mileage distance
var milUnit; //will hold resultant mileage distance unit returned from service ( miles/km)
var milTime; // will hold mileage time ( formatted in hrs, min)
var milMobileTime; //will hold time for mobile display

var datasource= "/HintList/ItemLookup?";
var authToken = true;

var start = "";
var end = "";
var no_geocoded_addr = 0;
var routePoints = [];
var locationList = [];
var index = 0;



Credentials.url = decartaUrl;
Credentials.clientName  = decartaUserName;
Credentials.clientPassword = decartaPassword;
/* Autocomplete event subscription ends */
// hide error balloon
function hidePanel(){
	document.getElementById('error').style.display='none';
}

/*function to display result. please modify as per page requirement*/

function displayResult(){
	milDistance = (Math.round(milDistance * 10)) / 10;
	if (MOBILELAYOUT) {
	    $('.errorMileage').html('');
	    $('.errorMileage').hide();
		document.getElementById('mileageValue').innerHTML =  milDistance;	
		formatTimeMobile(milMobileTime);
		$('#loading').hide();
		$('#resultMileage').show();
		  window.location.hash="resultMileage";

	} else {
		document.getElementById('mileageTime').innerHTML =  milTime;
		document.getElementById('mileageValue').innerHTML =  milDistance + " " + milUnit;
		document.getElementById('rmOthers').style.display='none';
		$('#loading').hide();
		$('#resultMileage').show();
		
	}
}


/* Function called on click of get mileage button or on select of an address in case of 
 * multiple address error balloon shown.
 * 
 * parameters: 
 * multiple : denotes whether called from multiple address error balloon or not
 * text: text to be filled in input box when called from multiple address error balloon
 * index: index position of text box where multiple address error balloon is shown
 * 
 * if multiple is true then the function first replaces the textbox text with the supplied text.
 * It checks if any text box is empty. If yes then displays appropriate error message else
 * creates RMAddress objects of both location and call getMileage function.
 * 
 * 
 */
function calcMileage(multiple, text, geoAddr,indx){

	 if(undefined == indx || null == indx){
		index = 0;
	 }else{
		index = indx;
	 }
	  var geocodedEnd = false;
	  var geocodedFirst = false;
	  if(MOBILELAYOUT) {
		 $('#intro').hide();
		 $('#calcButton').text('RECALCULATE');
	  }
	
		locA = document.getElementById(locAId);
		locAtext = document.getElementById(locAId+"text");
		locAlatlon = document.getElementById(locAId+"latlon");	
		locB= document.getElementById(locBId);
		locBtext = document.getElementById(locBId+"text");
		locBlatlon = document.getElementById(locBId+"latlon");			

	if (multiple) {
	    text = text.replace("&ap#","'");
		var region;
		if (index === 1){ 
			locB.value = text;
			locBtext.value = text;
			locBlatlon.value = geoAddr.position.lat+" "+geoAddr.position.lon;
			locationList[1] = geoAddr.structuredAddress instanceof Array? geoAddr.structuredAddress[0]:geoAddr.structuredAddress;
			routePoints[1] = new Position(locBlatlon.value);
			geocodedEnd = true;
		}
		else{ 
			locA.value = text;
			locAtext.value = text;
			locAlatlon.value = geoAddr.position.lat+" "+geoAddr.position.lon;
			locationList[0] = geoAddr.structuredAddress instanceof Array? geoAddr.structuredAddress[0]:geoAddr.structuredAddress;
			routePoints[0] = new Position(locAlatlon.value);
			no_geocoded_addr = 1;
			geocodedFirst = true;
		}
		if(!MOBILELAYOUT) {
			hidePanel();
		} 
		if(mapLoggerUp == true){
			prepareLocateJson(geoAddr,index);
			 var center = "";
			  try{
				  center = geoAddr.position.lat+","+geoAddr.position.lon;
			  }catch(ignored){center="";}
			  prepareMapJson("GEOCODE",decartaUserName,decartaConfiguration,"","",center,"");
			  logLocRequest(loggerURL);
		}
		
	}else{
		routePoints = [];
	}

	if (((locA.value.trim().length == 0) || (locB.value.trim().length == 0)) && MOBILELAYOUT) {
		$('.errorMileage').html("Please enter a start and ending address.");
		  window.location.hash="errorMileage";
		$('.errorMileage').show();
		$('#loading').hide();
	}		
	else if (!MOBILELAYOUT && (((locA.value.trim().length == 0) && (locB.value.trim().length == 0)))) {
		region = YAHOO.util.Dom.getRegion(locA.id);
		var errorTip = new RMMilErrorWindow("error", region.left + 250, region.top, "Enter the starting and destination address, city, and state here for your driving directions.");
	}
	else if (!MOBILELAYOUT && (((locA.value.trim().length == 0)))) {
		region = YAHOO.util.Dom.getRegion(locA.id);
		var errorTip = new RMMilErrorWindow("error", region.left + 250, region.top, "Enter the starting address, city, and state here for your driving directions.");
	}else if (!MOBILELAYOUT && (((locB.value.trim().length == 0)))) {
		region = YAHOO.util.Dom.getRegion(locB.id);
		var errorTip = new RMMilErrorWindow("error", region.left + 250, region.top, "Enter the destination address, city, and state here for your driving directions.");
	}else {
		
		var startAddr = locA.value;
		var destAddr = locB.value;
		if((locA.value === locAtext.value) && (locAlatlon.value != null && locAlatlon.value.trim().length >0)){
			routePoints[0] = new Position(locAlatlon.value);
			if(mapLoggerUp == true){
				var results  = {structuredAddress:{},
							position:{
										lat:routePoints[0].lat,
										lon:routePoints[0].lon
										},
							matchType:"CACHE/RM_HINTLIST"
						};
				if(mapLoggerUp == true){
					prepareLocateJson(results,1);
					 var center = "";
					  try{
						  center = geoAddr[0].position.lat+","+geoAddr[0].position.lon;
					  }catch(ignored){center="";}
					  prepareMapJson("GEOCODE",decartaUserName,decartaConfiguration,"","",center,"");
					  logLocRequest(loggerURL);
				}
			}
			
			//rmcLoggerParams = "Already Geocoded "+document.getElementById(locAId).value+" "+locAlatlon.value;
			//rmcLogger(rmcLoggerParams);
			//index = 1;
			geocodedFirst = true;
		}
			//startAddr = "{id:'"+locA.id+"',ll:'"+locAlatlon.value.trim()+"',nm:"+locA.value+"'}";
		if((locB.value === locBtext.value) && (locBlatlon.value != null && locBlatlon.value.trim().length >0)){
			routePoints[1] = new Position(locBlatlon.value);
			if(mapLoggerUp == true){
			var results  = {structuredAddress:{},
							position:{
										lat:routePoints[1].lat,
										lon:routePoints[1].lon
									},
							 matchType:"CACHE"
							};
			if(mapLoggerUp == true){
				prepareLocateJson(results,0);
				 var center = "";
				  try{
					  center = geoAddr[0].position.lat+","+geoAddr[0].position.lon;
				  }catch(ignored){center="";}
				  prepareMapJson("GEOCODE",decartaUserName,decartaConfiguration,"","",center,"");
				  logLocRequest(loggerURL);
			}
			
			}
			//rmcLoggerParams = "Already Geocoded "+document.getElementById(locBId).value+ " "+locBlatlon.value;
			//rmcLogger(rmcLoggerParams);
			//index = 0;
			geocodedEnd = true;
		}
			//destAddr = "{id:'"+locB.id+"',ll:'"+locBlatlon.value.trim()+"',nm:"+locB.value+"'}";
	//	var start = new RMAddress("", "", "", "", "", "", "", startAddr);
	//	var end = new RMAddress("", "", "", "", "", "", "", destAddr);
	    if(geocodedFirst && geocodedEnd){
	    	index = 0;
			no_geocoded_addr = 2;
			performRoute();
		}else if(geocodedFirst && !geocodedEnd){
			index = 1;
		    no_geocoded_addr = 1;
			end = destAddr;
			performGeocoding(end);
		}else if(geocodedEnd && !geocodedFirst){
			index = 0;
		    no_geocoded_addr = 1;
			start = startAddr;
			performGeocoding(start);
		}else{
			index = 0;
		    no_geocoded_addr = 0;
			start = startAddr;
			end = destAddr;
			getMileage(start, end);
		}
	}
	
	
}



/*
 * This function actually calls service method to getmileage data and displays error message in case of any error.
 * 
 * Parameters:
 * start: RMAddress object of starting address
 * end: RMAddress object of destination object
 */
function getMileage(start,end){

	if (!MOBILELAYOUT) {
	    document.getElementById('rmOthers').style.display='none';
	} else {
		$('.errorMileage').hide();
	}
	$('#resultMileage').hide();
	$('#loading').show();
   
	no_geocoded_addr = 0;
	routePoints = [];
	//locationList = [];
	//MAP_ENGINE.calcRoute(start,end,null , 100, 100, callback, this,1, 1);
	performGeocoding(start);
}



function airportHintListSearch(params) {
	var DEV_URL = MAPSDOMAIN+"/HintList/ItemLookup";
	postCallback = {success:function (o) {
				//hintListSearchHandler(o);
	}, failure:function (o) {
				//hintListSearchHandler(o);
	}};
	//var serviceReqToken = _prepareRequest("hintListSearchHandler", this);
	var url = DEV_URL + "?callback=hintListSearchHandler&" + params;
	var objTransaction = YAHOO.util.Get.script(url, {onSuccess:postCallback.success, onFailure:postCallback.failure});
}

function hintListSearchHandler(sResults){
	if((sResults.results).length> 1){
		var tempResults = sResults.results[0];
		sResults.results = [];
		(sResults.results).push(tempResults);
	}
	var results = convertHintToDecartaGeoAddrFormat(sResults.results);
	handleCallBackGeocode(results.position,results.address,results);
}


/**
 * @author msingh 2 Jan, 2009 
 * This function performs call to addressBook.jsp.
 * This jsp checks user's sign in status and perform functions
 * (add,delete,display) according to the request. The page sends 
 * result in jSON format
 * @param  callback  callback method/name
 * @param context 
 * @param params  any parameters to be appended to URL
 */
function performGeocoding(sAddressLine) {
	var mapLocale = "US-EN";
	if(sAddressLine == null || sAddressLine == "" || sAddressLine.length == 1){
		var pos = [];
		var addr = [];
		handleCallBackGeocode(pos,addr);
    }
	var canadianZipcodeMatch = sAddressLine.match( /^\s*([A-Za-z]\d[A-Za-z])\s*(\d[A-Za-z]\d){0,1}\s*$/ );
	if ( canadianZipcodeMatch )
	{
		if ( canadianZipcodeMatch[1] && canadianZipcodeMatch[2] )
			sAddressLine = canadianZipcodeMatch[1] + " " + canadianZipcodeMatch[2];

		mapLocale = "CA-EN";
	}
	
	if(sAddressLine.length == 3){
		 JSRequest.setDynamicScriptTagMode();
    	var params = "cat=city&val="+sAddressLine;
    	airportHintListSearch(params);
    }else{
    	var geo = new Geocoder();
  	   JSRequest.setDynamicScriptTagMode();

//		// deCarta STAGE
//		geo.authenticate( "randmcnally:rmc.com", "ckop3918ty" );

		// deCarta PROD
		geo.authenticate( decartaUserName, decartaPassword );
		geo.returnFreeForm = false;
  	   var ffa = new FreeFormAddress(sAddressLine.toLowerCase());
  	   geo.geocode(ffa,handleCallBackGeocode,mapLocale);
    }
	 
	
}

function handleCallBackGeocode(pos,addr,geoAddr){
	if(pos.length >1){
		var sAddressLine = "";
		if (index == '1') 
			sAddressLine = document.getElementById(locBId).value;
		else 
			sAddressLine = document.getElementById(locAId).value;
		var usOrMexZipcodeMatch = sAddressLine.match( /^\s*([0-9]{5})(-[0-9]{4}){0,1}\s*$/ );
		var canadianZipcodeMatch = sAddressLine.match( /^\s*([A-Za-z]\d[A-Za-z])\s*(\d[A-Za-z]\d){0,1}\s*$/ );
	
		if (usOrMexZipcodeMatch || canadianZipcodeMatch )
		{
			var tempPos = pos[0];
			pos = [];
			pos[0] = tempPos;
			
			var tempAddr = addr[0];
			addr = [];
			addr[0] = tempAddr;
		}
		
	}
	if (pos.length == 0 || pos.length >1)
	{
		var region;
		var errMsg;
	
		if (index == '1') 
			region = YAHOO.util.Dom.getRegion(locBId);
		else 
			region = YAHOO.util.Dom.getRegion(locAId);
			
		if(pos.length == 0 || addr.toString() == ""){
			errMsg = RMMilResources.GEOCODE_ADDRESS_NOT_FOUND;
		}else if( pos.length >1){
			var convertedAddrList = [];
			for(var i=0;i<pos.length;i++)
				convertedAddrList.push(addressForPositionAndAddress(pos[i],addr[i]));
			var addresses = RMUtils.formatAddresses(convertedAddrList);
			var multipleDiv = "<div id='address_list' style='overflow:hidden;max-height:144px;font-size:9px;font-family:Arial,Helvetica,sans-serif'><table>";				
			var multipleAddresses = "";
			var multiplePOIs = "";					
			var foundAddresses = false;
			var foundPOIs = false;
			var totalCount = 0;
			var arrDispText = [];
			var dummyAddrList = [];
			for (var i = 0; i < addresses.length; i++) {
				if (typeof addresses[i].poitext != "undefined" && addresses[i].poitext != null) {
					foundPOIs = true;
				}
				else {
					foundAddresses = true;
					totalCount++;
					var displayText = "";
					
					if(addresses[i].isAirport == true){
						displayText = (addresses[i].addressName).substring(0,3);
					}else{
						displayText = RMUtils.prepareName(addresses[i], false);
					}
					
					arrDispText.push(displayText);					
					multipleAddresses += "<tr><td><a style='text-decoration:none' id=\"list_" + i + "\" href=\"javascript:noop();\"><img src=\"" + BASE_PATH_IMG + "/location_marker_sm.gif\"/>&nbsp;" + displayText + "</a><br/>";
					dummyAddrList.push(addresses[i]);
				}
			}
			
			if (foundAddresses) {
				if (foundPOIs) {
					multipleDiv += "<tr><td>" + RMMilResources.GEOCODE_MULTIPLE_ONLY_POI_RESULTS + "</td></tr>" + multipleAddresses;
				}
				else {
					multipleDiv += "<tr><td>" + RMMilResources.GEOCODE_MULTIPLE_RESULTS + "</td></tr>" + multipleAddresses;
				}
				
				multipleDiv += "</table>";
				multipleDiv += "</div>";
				if(totalCount > 8)
				{
					multipleDiv += "<div id='more' align='left'>";
					multipleDiv +="<a href=\"javascript:noop()\" onclick=\"seeMore(event)\">More ...</a>";
					multipleDiv += "</div>";
				}
									
			}	
			errMsg = multipleDiv;
		}
		
		var setEvent = function (dispText,geoAddress,ind,j){							 
				YAHOO.util.Event.addListener("list_"+j, 'click', function(e) {
					YAHOO.util.Event.stopEvent(e);
					calcMileage(true,dispText,geoAddress,ind);
					hidePanel();
				});
		};
		
		
		var delay = 250;
		if(MOBILELAYOUT) {	
			delay = 550;
		}
		
		$('#loading').hide();
		$('#resultMileage').hide();
		if(!MOBILELAYOUT) {			
			document.getElementById('rmOthers').style.display='block';
			document.getElementById('resultMileage').style.display='none';
			var errWin = new RMMilErrorWindow("error", region.right + delay, region.top, errMsg);
			
			
		} else {
			$('.errorMileage').html(errMsg);
			$('.errorMileage').show();
			
			window.location.hash="errorMileage";
		}
		
		if (foundAddresses) {
			for(i=0; i<dummyAddrList.length; i++)
			{
				setEvent(arrDispText[i].replace("'","&ap#"),geoAddr[i],index,i);
			}
		}
		
		//rmcLoggerParams = "Geocoded Multiple "+(index == '1'?document.getElementById(locBId).value:document.getElementById(locAId).value);
		//rmcLogger(rmcLoggerParams);
		
	}
	else
	{
		var pos = pos[0];

		  var origin = new Position(pos.lat,pos.lon);
		  if(routePoints.length>1 && routePoints[0] == undefined){
				routePoints[0]  = origin;
				locationList[0] = addr[0];
			  }else{
				  if(routePoints.length ==0)
						locationList[0] = addr[0];
					else
						locationList[1] = addr[0];
				routePoints.push(origin);
				
			}
		  if(mapLoggerUp == true){
			  
			  prepareLocateJson(geoAddr instanceof Array? geoAddr[0]:geoAddr,no_geocoded_addr);
			  var center = "";
			  try{
				  center = (geoAddr instanceof Array? geoAddr[0]:geoAddr).position.lat+","+(geoAddr instanceof Array? geoAddr[0]:geoAddr).position.lon;
			  }catch(ignored){center="";}
			  prepareMapJson("GEOCODE",decartaUserName,decartaConfiguration,"","",center,"");
			  logLocRequest(loggerURL);
		  }
		 
		 // rmcLoggerParams = "Geocoded "+(index == '1'?document.getElementById(locBId).value:document.getElementById(locAId).value)+"  LAT:"+pos.lat+" LON:"+pos.lon;
		 // rmcLogger(rmcLoggerParams);
		  no_geocoded_addr += 1;
		 
		  if(no_geocoded_addr >= 2){
			
			  performRoute();
			 
		  }else{	
			  index = 1;
			  performGeocoding(end);
		  }
		
	  }
}
function performRoute(){
	if (!MOBILELAYOUT) {
	    document.getElementById('rmOthers').style.display='none';
	} else {
		$('.errorMileage').hide();
	}
	$('#resultMileage').hide();
	$('#loading').show();
	var uom = new UOM("MI");	
	var routePreference = new RoutePreference("Fastest",uom);
	

     // enable maneuver maps
     routePreference.maneuverMaps=false;
     JSRequest.setDynamicScriptTagMode();
     // Create our route query
     var routeQuery = new RouteQuery();
   
	 var routePointSubList = [];
     if(routePoints.length >= 2){
    	// locationsStr = routePoints;
		 // Generate our route
    	 routePointSubList.push(routePoints[0]);
    	 routePointSubList.push(routePoints[1]);
    	 
		 routeQuery.query( routePointSubList, routePreference, function( routeResponse ) {
			 
			 handleMilRoute( routeResponse );
		 });
		 
		// refreshAd("ad1Iframe");
     }
}


function handleMilRoute( routeResponse )
{
    // Simple Error checking
    if( !routeResponse ) {
		var region = YAHOO.util.Dom.getRegion(locAId);
		var delay = 250;
		if(MOBILELAYOUT) {	
			delay = 550;
		}
    	errMsg = RMMilResources.DIR_UNABLE_TO_CALCULATE_ROUTE;
    	$('#loading').hide();
		$('#resultMileage').hide();
		if(!MOBILELAYOUT) {			
			document.getElementById('rmOthers').style.display='block';
			document.getElementById('resultMileage').style.display='none';
			RMMilErrorWindow("error", region.left + delay, region.top, errMsg);
		} else {
			$('.errorMileage').html(errMsg);
			$('.errorMileage').show();
			window.location.hash="errorMileage";
		}
       
    }else{
    	milDistance = routeResponse.TotalDistance ;   
		milTime = RMUtils.formatTimeObject(routeResponse.TotalTimeObject) ;
		milMobileTime  = routeResponse.TotalTimeObject;
		milUnit = routeResponse.uom.value === 'MI'?"miles":"km";
		//displayResult();
		 refreshAd("ad1Iframe","true");
		if(mapLoggerUp == true){
			prepareRouteJson(routeResponse);
			prepareMapJson("ROUTEMILEAGE",Credentials.clientName,Credentials.configuration,"","","",serviceProvHDecarta);
			logRouteRequest(loggerURL);
		}
	
		
	//	rmcLoggerParams = "Mileage locations: "+locationsStr+"  | distance: "+milDistance +" |time: "+ milTime;
	//	rmcLogger(rmcLoggerParams);
    }
}

function formatTimeMobile(timeObject) {
	var oHour = timeObject.hours;
	if(!isNaN(timeObject.days))
		oHour += (timeObject.days * 24);
	
	var oMinutes = timeObject.minutes;
	//if(!isNaN(timeObject.seconds))
		//oMinutes += (timeObject.seconds);
		$('#timeHours').html(oHour);
		$('#timeMinuts').html(oMinutes);	
}

/*Autocomplete event subscription. */
YAHOO.util.Event.onContentReady(locAId, function(){
	var oAC = new RMScriptAutoComplete(locAId, datasource, null, 37, 16, function(wordLimit) { 
				var panel = YAHOO.util.Dom.getXY(this._elContainer.parentNode);
 				new RMMilErrorWindow("error",
									250,
									panel[1] - 8, 
									" "
								); 
				});
});

YAHOO.util.Event.onContentReady(locBId, function(){
	var oAC = new RMScriptAutoComplete(locBId, datasource, null, 37, 16, function(wordLimit) { 
				var panel = YAHOO.util.Dom.getXY(this._elContainer.parentNode);
 				new RMMilErrorWindow("error",
									250,
									panel[1] - 8, 
									" "
								); 
				});
});

YAHOO.util.Event.onContentReady('loc3', function(){
	var oAC = new RMScriptAutoComplete('loc3', datasource, null, 37, 16, function(wordLimit) { 
				var panel = YAHOO.util.Dom.getXY(this._elContainer.parentNode);
 				new RMMilErrorWindow("error",
									250,
									panel[1] - 8, 
									" "
								); 
				});
});

YAHOO.util.Event.onContentReady('loc4', function(){
	var oAC = new RMScriptAutoComplete('loc4', datasource, null, 37, 16, function(wordLimit) { 
				var panel = YAHOO.util.Dom.getXY(this._elContainer.parentNode);
 				new RMMilErrorWindow("error",
									250,
									panel[1] - 8, 
									" "
								); 
				});
});

YAHOO.util.Event.onContentReady('from', function(){
	var oAC = new RMScriptAutoComplete('from', datasource, null, 37, 16, function(wordLimit) { 
				var panel = YAHOO.util.Dom.getXY(this._elContainer.parentNode);
 				new RMMilErrorWindow("error",
									250,
									panel[1] - 8, 
									" "
								); 
				});
});

YAHOO.util.Event.onContentReady('to', function(){
	var oAC = new RMScriptAutoComplete('to', datasource, null, 37, 16, function(wordLimit) { 
				var panel = YAHOO.util.Dom.getXY(this._elContainer.parentNode);
 				new RMMilErrorWindow("error",
									250,
									panel[1] - 8, 
									" "
								); 
				});
});

/*function rmcLogger(params) {
	var DEV_URL = "rmclogger.do";
	postCallback = {success:function (o) {
				//hintListSearchHandler(o);
	}, failure:function (o) {
				//hintListSearchHandler(o);
	}};
	//var serviceReqToken = _prepareRequest("hintListSearchHandler", this);
 
    params = "RMC Mileage Calc| IP: "+ipaddress+" | "+decartaUserName+" |DATA: "+params;
	var url = DEV_URL + "?params=" + params;
	var objTransaction = YAHOO.util.Get.script(url, {onSuccess:postCallback.success, onFailure:postCallback.failure});
}*/
function hideAd(pId){
	var theIframe = document.getElementById(pId);
	
	if(theIframe == null)
		return;
	
	theIframe.style.display = "none";
}
function showAd(pId){
	var theIframe = document.getElementById(pId);
	
	if(theIframe == null)
		return;
	theIframe.style.display = "block";
}
function refreshAd(pId,showResults){
	var theIframe = document.getElementById(pId);
	
	if(theIframe == null)
		return;
	
	var oUrl = theIframe.src.split("?")[0];
	var oUrlParams=new Array();
	var oDestination,oOrigin;
	
	var oDesCountryName, oDesStateName, oDesCityName,oCountryName, oStateName, oCityName;

	if(locationList.length == 2){
		oDestination = locationList[1];
		oOrigin = locationList[0];
		
	} 
	
	
	if( undefined != oOrigin && null != oOrigin){
		//oOrigin = locationList[0].structuredAddress;
		oCountryName = (oOrigin.countryCode!=null&&oOrigin.countryCode!="")?oOrigin.countryCode:"USA";
		oStateName = (oOrigin.countrySubdivision!=null&&oOrigin.countrySubdivision!="")?oOrigin.countrySubdivision.replace(" ","+"):null;
		oCityName = (oOrigin.municipalitySubdivision!=null&&oOrigin.municipalitySubdivision!="")?oOrigin.municipalitySubdivision.replace(" ","+"):((oOrigin.municipality!=null&&oOrigin.municipality!="")?oOrigin.municipality.replace(" ","+"):null);
		
		oUrlParams.push("Ocountry="+oCountryName)
		if(oStateName!=null){
			oUrlParams.push("Ostate="+oStateName)
			if(oCityName!=null)
				oUrlParams.push("Ocity="+oCityName)
		}
	}

	if(undefined != oDestination && null != oDestination){
		//oDestination = locationList[1].structuredAddress;
		oDesCountryName = (oDestination.countryCode!=null&&oDestination.countryCode!="")?oDestination.countryCode:"USA";
		oDesStateName = (oDestination.countrySubdivision!=null&&oDestination.countrySubdivision!="")?oDestination.countrySubdivision.replace(" ","+"):null;
		oDesCityName = (oDestination.municipalitySubdivision!=null&&oDestination.municipalitySubdivision!="")?oDestination.municipalitySubdivision.replace(" ","+"):((oDestination.municipality!=null&&oDestination.municipality!="")?oDestination.municipality.replace(" ","+"):null);
		
		oUrlParams.push("Dcountry="+oDesCountryName)
		if(oDesStateName!=null){
			oUrlParams.push("Dstate="+oDesStateName)
			if(oDesCityName!=null)
				oUrlParams.push("Dcity="+oDesCityName)
		}
	}
	
	theIframe.src=null;
	if(oUrlParams.length>0){
			oUrl += "?"+oUrlParams.join("&");
			theIframe.src = oUrl;
		}
	if(showResults == "true"){
		//setTimeout("displayResult()",5000);
		//$(theIframe).ready(function () {
			displayResult();
		//});
	}
	}
