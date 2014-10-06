/*Constants*/
var iamfromlogger = true;
var randomNo = Math.floor((Math.random()*100));
/*if(randomNo >10)
      iamfromlogger = null;*/

var serviceProvHDecarta = "HOSTED DECARTA";
var REQTYPE="\"reqtype\"";
var MAPREQUEST = "\"maprequest\"";
var CLID = "\"CLID\"";
var DATASET="\"DATASET\"";
var MAPREQTIME = "\"REQTIME\"";
var MAPSUCCESS = "\"SUCCESS\"";
var ZOOM_LEVEL = "\"ZOOM_LEVEL\"";
var MAP_TYPE = "\"MAP_TYPE\"";
var MAPCENTER = "\"MAPCENTER\"";
var MAP_REQ_TYPE = "\"MAP_REQ_TYPE\"";
var SERVICEPROV = "\"serviceProvider\"";
var HOST = "\"host\"";
var MAPENGINE = "\"mapEngine\"";
var REFERRER = "\"referrer\"";
var REF_IP = "\"referrer_ip\"";

var LOCATIONS = "\"locations\"";
var MATCHTYPE = "\"matchType\"";
var STREET = "\"street\"";
var CITY = "\"city\"";
var COUNTY = "\"county\"";
var STATE = "\"state\"";
var POSTALCODE = "\"postalCode\"";
var COUNTRY = "\"country\"";
var LOCREQTIME="\"reqTime\"";
var LOCSUCCESS="\"success\"";
var LATITUDE = "\"latitude\"";
var LONGITUDE = "\"longitude\"";
var AIRPORTCODE = "\"airportCode\"";

var ROUTES = "\"routes\"";
var RE_ROUTES = "\"re_routes\"";
var DISTANCE = "\"distance\"";
var TIME = "\"time\"";
var MANEUVCOUNT = "\"maneuverCount\"";
var ROUTEHANDLEID = "\"routeHandleId\"";
var SEGMENTINDEX = "\"segmentIndex\"";
var GUID = "\"routeGUID\"";
	
		

var routejsonStr = "";
var re_routejsonStr = "";
var locjsonStr = "";
var locjsonArr = [];
var mapjsonStr="";
var mapjsonStr2="";
var params = "";

function prepareRouteJson(response,guid){
	if(null == response)
		return;
	try{
		if(undefined != response.length)
			response = response[0];
		if(undefined == guid || null == guid)
			guid = "";
	}catch(ignored){
		response = response;
	}
	var maneuvers = response.RouteInstructions;
	var routeHandleId = response.id;
	var uom = (response.uom == "MI"? "miles":"km");
	
	var firstStepOfTour = false;
	var lastStepOfTour = false;
	
	
	var distance = 0;
	var time = 0;
	var maneuverCount = 0;
	var segmentIndex = 0;	
	routejsonStr = ROUTES+":[";
	for(var i=0; i < maneuvers.length;i++) //for each route
	{
		if(i==0){ 
			firstStepOfTour = true;
			lastStepOfTour = false;
		}else if(lastStepOfTour){
			lastStepOfTour = false;
			firstStepOfTour = true;
			segmentIndex = segmentIndex+1;
			maneuverCount = 0;
			distance = 0;
			time = 0;
		}else if((i< maneuvers.length -1 )&& (maneuvers[i].tour != maneuvers[i+1].tour) || i == maneuvers.length -1){
			firstStepOfTour = false;
			lastStepOfTour = true;
			
		}else{
			firstStepOfTour = false;
			lastStepOfTour = false;
			
		}
		
		maneuverCount = maneuverCount +1;
		time += convertTimeObjectToSec(maneuvers[i].duration);
		distance += maneuvers[i].distance;
		
		if(lastStepOfTour){
			if(segmentIndex>0){
				routejsonStr +=",";
			}
			
			routejsonStr += "{"+DISTANCE+":\""+distance+"\"," +
			TIME+":\""+time +"\"," +
			MANEUVCOUNT+":\""+maneuverCount +"\"," +
			ROUTEHANDLEID+":\""+routeHandleId +"\"," +
			SEGMENTINDEX+":\""+segmentIndex +"\","+GUID+":\""+guid+"\""+
			"}";
			
		}
	}
	
	routejsonStr += "]"; 
}

function prepareReRouteJson(response,guid){
	if(null == response)
		return;
	try{
		if(undefined != response.length)
			response = response[0];
		if(undefined == guid || null == guid)
			guid = "";
	}catch(ignored){
		response = response;
	}
	var maneuvers = response.RouteInstructions;
	var routeHandleId = response.id;
	var uom = (response.uom == "MI"? "miles":"km");
	
	var firstStepOfTour = false;
	var lastStepOfTour = false;
	
	
	var distance = 0;
	var time = 0;
	var maneuverCount = 0;
	var segmentIndex = 0;	
	re_routejsonStr = ROUTES+":[";
	for(var i=0; i < maneuvers.length;i++) //for each route
	{
		if(i==0){ 
			firstStepOfTour = true;
			lastStepOfTour = false;
		}else if(lastStepOfTour){
			lastStepOfTour = false;
			firstStepOfTour = true;
			segmentIndex = segmentIndex+1;
			maneuverCount = 0;
			distance = 0;
			time = 0;
		}else if((i< maneuvers.length -1 )&& (maneuvers[i].tour != maneuvers[i+1].tour) || i == maneuvers.length -1){
			firstStepOfTour = false;
			lastStepOfTour = true;
			
		}else{
			firstStepOfTour = false;
			lastStepOfTour = false;
			
		}
		
		maneuverCount = maneuverCount +1;
		time += convertTimeObjectToSec(maneuvers[i].duration);
		distance += maneuvers[i].distance;
		
		if(lastStepOfTour){
			if(segmentIndex>0){
				re_routejsonStr +=",";
			}
			
			re_routejsonStr += "{"+DISTANCE+":\""+distance+"\"," +
			TIME+":\""+time +"\"," +
			MANEUVCOUNT+":\""+maneuverCount +"\"," +
			ROUTEHANDLEID+":\""+routeHandleId +"\"," +
			SEGMENTINDEX+":\""+segmentIndex +"\","+GUID+":\""+guid+"\""+
			"}";
			
		}
	}
	
	re_routejsonStr += "]"; 
}



function prepareLocateJson(geoAddr,index){	
	   index = 0;
	    if(locjsonArr.length>index){
	    	return;
	    }
	   
		var address = geoAddr.structuredAddress instanceof Array? geoAddr.structuredAddress[0]:geoAddr.structuredAddress;
		var position = geoAddr.position instanceof Array? geoAddr.position[0]:geoAddr.position;
		
		if(address == undefined || null == address){
			address = geoAddr.address instanceof Array? geoAddr.address[0]:geoAddr.address;
		}
		var matchType = geoAddr.matchType;
		var street = "" ;
		var city = "";
		var county = "";
		var state = "";
		var postalCode = "";
		var country = "";
		var airportCode = "";
		
		var success = "Y";
		var latitude = position.lat;
		var longitude = position.lon;
		
		var locStr ="{"+MATCHTYPE+":\""+matchType+"\","+
					LOCSUCCESS+":\""+success+"\","+LATITUDE+":\""+latitude+"\","+
					LONGITUDE+":\""+longitude+"\",";
		
		 	if (address.street != "" && address.street != undefined) {
		    	street = STREET+":\"";
		    	if (address.buildingNumber != "" && address.buildingNumber != undefined) {
			    	street += address.buildingNumber+" " ;
			    }
		    	
		    	street += address.street+"\",";
		    } 	
		
		    
		    if (address.municipalitySubdivision != "" && address.municipalitySubdivision != undefined) {
		    	city = CITY+":\"";
		    	city += address.municipalitySubdivision+"\",";
		    }
		    else if (address.municipality != "" && address.municipality != undefined) {
		    	city = CITY+":\"";
		    	city += address.municipality+"\"," ;
		    }
		    if (address.countrySubdivision != "" && address.countrySubdivision != undefined) {
		    	state = STATE+":\"";
		    	state += address.countrySubdivision +"\",";
		    }
		    if (address.postalCode != "" && address.postalCode != undefined) {
		    	
		    	postalCode = POSTALCODE+":";
		    	postalCode += address.postalCode+",";
		    }
		    
		    if(address.countrySecondarySubdivision != "" && address.countrySecondarySubdivision != undefined){
		    	county = COUNTY+":\"";
		    	county += address.countrySecondarySubdivision+"\",";
		    }
		    if (address.countryCode != "" && address.countryCode != undefined) {
		    	country = COUNTRY+":\"";
		    	country += address.countryCode+"\"";
		    }else{
		    	country = COUNTRY+":\"USA\"";
		    	
		    }
		    
		   if(address.isAirport != undefined && null != address.isAirport ){
			   airportCode = ","+AIRPORTCODE+":\""+address.airportCode+"\"";
		   }
		    
		
		    locStr += street+city+state+postalCode+county+country+airportCode+"}";
	
	
    locjsonArr[index]=locStr;
	
}

function prepareMapJson(mapReqType,clientID,DataSet,Zoom,MapType,MapCenter,serviceProv){

	var mapengine = "HOSTED";
	var host = decartaUrl;
	if(undefined == host || null == host)
		host = "HOSTED";
	else{
		host = host.substring(7);
	}
	
	var referrer = document.location.href;
	if(undefined == referrer || null == referrer)
		referrer = "";
	else{
		  referrer = referrer.substring(7);
          var ind = referrer.indexOf("/");
          if(ind >0)
                  referrer = referrer.substring(0,ind);

		
	}
	
	var ip = "";
	var zoomLevel = (null != Zoom && "" != Zoom && undefined != Zoom)?"\","+ZOOM_LEVEL+":\""+Zoom:"";
	var mapTypeText = (null != MapType && "" != MapType && undefined != MapType)?"\","+MAP_TYPE+":\""+MapType:"\","+MAP_TYPE+":\"MAP";
	var center = (null != MapCenter && "" != MapCenter && undefined != MapCenter)?"\","+MAPCENTER+":\""+MapCenter:"";
	var text = MAPREQUEST+":{"+MAP_REQ_TYPE+":\""+mapReqType+"\","+CLID+":\""+clientID+"\","+DATASET+":\""+DataSet+
				 zoomLevel+mapTypeText+center+"\","+SERVICEPROV+":\""+serviceProv+"\","+
				 HOST+":\""+host+"\","+MAPENGINE+":\""+mapengine+
				 "\","+REFERRER+":\""+referrer+"\","+REF_IP+":\""+ip+"\"}";		
	
	if(mapReqType == "RE_ROUTE"){
		mapjsonStr2 = text;
	}else{
		mapjsonStr = text;
	}
}


function prepareLocJsonFromArr(){
	locjsonStr = LOCATIONS+":[";
	for(var i=0;i<locjsonArr.length;i++){
		if(i>0){
			locjsonStr+=",";
		}
		locjsonStr+=locjsonArr[i];
	}
	locjsonStr +="]";
}

function logLocRequest(url){
	prepareLocJsonFromArr();
	params = "{"+REQTYPE+":\"GEOCODE\","+mapjsonStr+","+locjsonStr+"}";
	sendToLogger(url);
}

function logRouteRequest(url){
	params = "{"+REQTYPE+":\"ROUTE\",";
	params += mapjsonStr+","+routejsonStr+"}";
	sendToLogger(url);
}

function logReRouteRequest(url){
	params = "{"+REQTYPE+":\"RE_ROUTE\",";
	params += mapjsonStr2+","+re_routejsonStr+"}";
	sendToLogger(url);
}

function logMapRequest(url){
	params = "{"+REQTYPE+":\"MAP\","+mapjsonStr+"}";
	sendToLogger(url);
}

function convertTimeObjectToSec(TimeObject){	
	 var seconds = 0;
	 if(TimeObject.days > 0){
		 seconds += TimeObject.days*24*60*60;
	 }
	 
	 if(TimeObject.hours > 0){
		 seconds += TimeObject.hours*60*60;
	 }
	 
	 if(TimeObject.minutes > 0){
		 seconds += TimeObject.minutes*60;
	 }
	 
	 if(TimeObject.seconds > 0){
		 seconds += TimeObject.seconds;
	 }
	
	  return seconds;

}

function sendToLogger(urlstr){
    urlstr+= "/logger.do?input="+params;
     routejsonStr = "";
     locjsonStr = "";
     locjsonArr = [];
     mapjsonStr="";
     mapjsonStr2="";
     $.ajax({
       type: 'GET',
       url: urlstr,
       dataType: "jsonp",
       success: function (data) {
    	 console.log("posting done");
       }
     });
}

