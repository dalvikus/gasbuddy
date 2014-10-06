/**
 * @class Util.js
 * @fileoverview Static reusable helper functions
 * @description Static reusable helper functions, also be sure to see the
 * Utilities documentation in the core API that contains many useful
 * and general purpuse geo spatial functions.
 */
deCarta.App.Util = {

    formatPOIName : function (name){
        return "<span class='search_result_name'>"+name+"</span>";
    },

    formatPOIReviews : function (num, id){
        if(num){
            return "<a href='#' class='review_link' review_id='"+id+"' target='whole'>"+num+" Reviews</a>";
        } else {
            return "";
        }
    },

    formatPhone : function (num){
        if(num){
            return "<br />" + deCarta.App.Localizer.get('txt_poi_phone', [num]);
        } else {
            return "";
        }
    },

    formatPOIRatings : function (averageRating){
        var avgRatingHTML="";
        if(averageRating){
            for(var j=1;j<6;j++){
                if(j<=parseInt(averageRating)){
                    avgRatingHTML+="<img  src='img/star_small_full.png'>";
                } else{
                    avgRatingHTML+="<img  src='img/star_small_empty.png'>";
                }
            }
            avgRatingHTML="<br/>"+avgRatingHTML;
        }
        return avgRatingHTML;
    },

    // connects the pin on the list to the pin on the map...

    lastOpenPinId:null,

    selectPin:function(id, resultDiv){
        
        var curSrc = $("#"+id+"_img")[0].src;        
        var newSrc = curSrc.substr(0, curSrc.lastIndexOf('.png')) + "_glow.png";        
        $("#"+id+"_img")[0].src = newSrc;
        try {           
            if (Utilities.ie6) Utilities.fixPng( $("#"+id+"_img")[0]);
        } catch (e){
           
        }
        $("#"+id).css("background-color","#eee");

        $(resultDiv).scrollTo( $("#"+id), 400 );

        //   var pins = deCarta.App.map.getPins();
        var selectedPin=null;
        var pin = deCarta.App.map.getPinById(deCarta.App.Util.lastOpenPinId);

        if (pin) {
            pin.setIcon(deCarta.App.Util.lastOpenPinIcon);

            $("#"+deCarta.App.Util.lastOpenPinId+" :first-child").attr("src",deCarta.App.Util.lastOpenPinIcon.src);
            $("#"+deCarta.App.Util.lastOpenPinId).css("background-color","#fff");
            deCarta.App.Util.lastOpenPinId=null;
        }
        pin = deCarta.App.map.getPinById(id);

        deCarta.App.Util.lastOpenPinIcon = pin.getIcon();

        pin.setIcon(new Icon(newSrc,14,38,28,38));
        pin.showInfoWindow();
        selectedPin=pin;
        deCarta.App.search.searchesLocked = true;

// RBH: commenting this out because pin.showInfoWindow() will pan map to make info window in the center
//        deCarta.App.map.panToPosition(pin.position, function () {
//            deCarta.App.search.searchesLocked = false;
//        });

        deCarta.App.Util.lastOpenPinId = id;

        $("#pin_from_here").click(function(){
            //deCarta.App.directions.reset();

            $('#tabs').tabs('select', 2);

            var freeformAddr=deCarta.App.Util.formatFreeformAddress(selectedPin.poi.address,", ");
            $("#addr0").val(freeformAddr);
            
            deCarta.App.map.getInfoWindow().hide();
            deCarta.App.UI.DirectionsPanel.setStart(selectedPin);
            deCarta.App.UI.DirectionsPanel.getDirections();
 
        });

        $("#pin_to_here").click(function(){
            //deCarta.App.directions.reset();

            $('#tabs').tabs('select', 2);

            var freeformAddr=deCarta.App.Util.formatFreeformAddress(selectedPin.poi.address,", ");
            $("#addr1").val(freeformAddr);
            
            deCarta.App.map.getInfoWindow().hide();
            deCarta.App.UI.DirectionsPanel.setEnd(selectedPin);
            deCarta.App.UI.DirectionsPanel.getDirections();

        });

        //if Click to Share is available, show the link.
        if (deCarta.App.Sharing.available){
            $("#pin_share").click(function(){

                var poiInfo = selectedPin.poi.toWSFormat();

                var storage = {
                    center: deCarta.App.map.getCenterPosition().lat + ' ' + deCarta.App.map.getCenterPosition().lon,
                    zoom: 21 - deCarta.App.map.getZoomController().getZoomLevel(),
                    POI: poiInfo,
                    message: poiInfo.POIName
                };

                deCarta.App.Sharing.store(storage, function(response){
                    deCarta.App.ShareWindow.show(response.code, poiInfo);
                }, function(){
                    alert('Apologies, but the sharing service failed us');
                });
            });
        } else {
            $("#pin_share").hide();
        }

        deCarta.App.Util.lastOpenPinId = id;    

    },

    formatFreeformAddress : function(poiAddress, delim, lineDelim){

        if(!(poiAddress instanceof Object)) return poiAddress.toString();
        if(!delim) delim=" ";
        if (!lineDelim) lineDelim = delim;
        var addressStr="";
        //to prevent two delim together
        if(poiAddress.landmark) addressStr+=poiAddress.landmark;
        if(poiAddress.buildingNumber) addressStr+=poiAddress.buildingNumber+" ";
        if(poiAddress.street) {
            addressStr+=poiAddress.street;
        }else{
        //addressStr+=delim;
        }

        if (addressStr.length > 0) addressStr += lineDelim;

        var arr = ['']; //apparently sometimes we get empty strings, so i added
        //an empty string to the array, this way "containedInArray" takes care of that too
        if(poiAddress.municipalitySubdivision && typeof poiAddress.municipalitySubdivision=='string'){
            arr.push(poiAddress.municipalitySubdivision);
            addressStr+=poiAddress.municipalitySubdivision+delim;
        }
        if(poiAddress.municipality && typeof poiAddress.municipality=='string' && !containedInArray(poiAddress.municipality,arr)){
            addressStr+=poiAddress.municipality+delim;
            arr.push(poiAddress.municipality);
        }
        if(poiAddress.countryTertiarySubdivision && typeof poiAddress.countryTertiarySubdivision=='string' && !containedInArray(poiAddress.countryTertiarySubdivision,arr)){
            addressStr+=poiAddress.countryTertiarySubdivision+delim;
            arr.push(poiAddress.countryTertiarySubdivision);
        }
        if(poiAddress.countrySecondarySubdivision && typeof poiAddress.countrySecondarySubdivision=='string' && !containedInArray(poiAddress.countrySecondarySubdivision,arr) ){
            addressStr+=poiAddress.countrySecondarySubdivision+delim;
            arr.push(poiAddress.countrySecondarySubdivision);
        }
        if(poiAddress.countrySubdivision && typeof poiAddress.countrySubdivision=='string' && !containedInArray(poiAddress.countrySubdivision,arr) ){
            addressStr+=poiAddress.countrySubdivision;
            arr.push(poiAddress.countrySubdivision);
        }
        if((poiAddress.postalCode && !(poiAddress.postalCode instanceof Object)) || ((poiAddress.postalCode instanceof Object) && !(Utilities.isObjectEmpty(poiAddress.postalCode)))){
            addressStr += " " + poiAddress.postalCode;
        }else{
        //addressStr+=delim;
        }
        addressStr += lineDelim;

        if(poiAddress.countryCode) addressStr+=poiAddress.countryCode;
        else if((addressStr.lastIndexOf(delim)+delim.length)==addressStr.length){
            addressStr=addressStr.substring(0,addressStr.lastIndexOf(delim));
        }
        return addressStr;

        function containedInArray(obj,targetArr){
            for(var i=0;i<targetArr.length;i++){
                if(targetArr[i]==obj){
                    return true;
                    break;
                }
            }
            return false;
        }
    },

    formatShortFreeformAddress : function(addr,delim){
        delim=delim || " ";
        var msg="";
        if (addr.buildingNumber != "") {
            msg += addr.buildingNumber+delim;
        }
        if (addr.street != "") {
            msg += addr.street+delim;
        }
        if (addr.municipality != "") {
            msg += addr.municipality+delim;
        }

        var idx=msg.lastIndexOf(delim);
        if(msg.length==(idx+delim.length))
            msg=msg.substring(0,idx);
        return msg;
    },

    getCharFromNumber : function(num){
        num=num+65;
        return String.fromCharCode(num);


    },

    getNumberFromChar : function(c){
        var num=c;
        if(num>=65 && num<=90) {
            return num-65
        }else if(num>=97 && num<=122){
            return num-97
        }else{
            return num;
        }
    },

    formatTravelDistance : function(distance){
        var point;
        if(distance<1000){
            distance=Math.round(distance)+"m"
        }else{
            distance=(distance/1000)
            point = (distance.toString().indexOf("."));
            if(point>-1){
                distance = distance.toString().substring(0,point+3);
            }
            distance=distance+"km";
        }


        return distance;
    },

    formatDistanceTravelTime : function(distance, timeObj){
        var time;

        distance = deCarta.App.Util.formatTravelDistance(distance);
        
        if (timeObj.days){
            time = deCarta.App.Localizer.get('distance_time_very_long', [distance, timeObj.days, timeObj.hours, timeObj.minutes]);
        }
        else if(timeObj.hours){
            time = deCarta.App.Localizer.get('distance_time_long', [distance, timeObj.hours, timeObj.minutes]);
        }else{
            time = deCarta.App.Localizer.get('distance_time', [distance, timeObj.minutes]);
        }

        return time;
    },

    /*
     * Returns the type of the object
     * needed since typeof will always return "object"
     * but we want to be able to tell what class it is we are talking about. 
     */
    getClassName: function(obj){
        // get classname abstracted from
        // constructor property
        var c = obj.constructor.toString();
        var start = c.indexOf('function ') + 9;
        var stop = c.indexOf('(');
        c = c.substring(start, stop);
        // if ( c == "String" ) ... check if string is airport code or lat/long
        // return "airport-string";
        // return "lat/long";
        return c;
    },

    localizeElement: function(elementId, stringKey, bindVariables){
        if (!elementId || elementId == '') return;
        if (!stringKey) stringKey = elementId;
        try {
            var el = $('#' + elementId);
            el.html(deCarta.App.Localizer.get(stringKey, bindVariables));
        } catch (e) {
            alert('Ah: ' + stringKey);
        }
    },

    renderDeCartaPin: function(pos,src){
        var fc={
            size:{
                x:28,
                y:37
            },
            offSets:{
                x:14,
                y:30
            }
        };

        src = src || "img/red_pin.png";

        var icon = new Icon(src, fc.offSets.x, fc.offSets.y, fc.size.x, fc.size.y);

        icon.src = src;
        var pin = new Pin(pos, null, null, icon );
        deCarta.App.map.addPin(pin);
        return pin;
    },

    renderPin: function(pos,src,overlayText,message,event){
        var fc={
            size:{
                x:59,
                y:38
            },
            offSets:{
                x:15,
                y:31
            }
        };

//        src = src || "img/red_pin.png";
        src = src || "images/pin-destination.png";

		var textOverlay =
			( overlayText
			  ? new TextOverlay( overlayText,
			                     0, 0,
			                     "white", "18px", "Arial,Helvetica,Tahoma,Verdana,sans-serif",
			                     "iconLabel" )
			  : null );

        var icon = new Icon(src, fc.offSets.x, fc.offSets.y, fc.size.x, fc.size.y, textOverlay);

        icon.src = src;
        var pin = new Pin(pos, message, event, icon );
//      pin.animateDrop = true;
//        pin.animate( "DROP", "FAST", true );
        deCarta.App.map.addPin(pin);
        return pin;
    },

    renderDotPin: function( pos, message, event, textOverlayClass )
    {
        var fc={
            size:{
                x:13,
                y:13
            },
            offSets:{
                x:0,
                y:0
            }
        };

        var src = "img/x.gif";

		var textOverlay = new TextOverlay( "&nbsp;",
		                                   0, 0,
		                                   null, "2px", null,
		                                   textOverlayClass );

        var icon = new Icon(src, fc.offSets.x, fc.offSets.y, fc.size.x, fc.size.y, textOverlay);

        icon.src = src;
        var pin = new Pin(pos, message, event, icon );
//      pin.animateDrop = true;
//        pin.animate( "DROP", "FAST", true );
        deCarta.App.map.addPin(pin);
        return pin;
    },

    renderSpritePin: function( pos, overlayText, message, event, textOverlayClass )
    {
        var fc={
                size:{
                    x:1,
                    y:1
                },
                offSets:{
                    x:0,
                    y:0
                }
            };

//        var src = "img/greenDot.png";
        var src = "img/x.gif";

		var textOverlay = new TextOverlay( ( overlayText ? overlayText : "" ),
		                                   -15, -30,
		                                   null, "18px", "Arial,Helvetica,Tahoma,Verdana,sans-serif",
		                                   textOverlayClass );

        var icon = new Icon(src, fc.offSets.x, fc.offSets.y, fc.size.x, fc.size.y, textOverlay);
        
        var pin = new Pin(pos, message, event, icon );
//      pin.animateDrop = true;
//        pin.animate( "DROP", "FAST", true );
        deCarta.App.map.addPin(pin);
        return pin;
    },

    /*
     * Given a config name, it tries to return a set of url params
     * that *should* render a nice looking tile.
     * This is so we can have a preview for configs that only render
     * in certain places, such as australia or europe.
     */
    getConfigSamplePosition: function(config){

        var result = {
            LLMIN: '0.0,0.0',
            LLMAX: '0.176965641673330230,0.175781250000000000',
            N: 232,
            E: -695
        }

        if ((config.indexOf('-eu') != -1) ||
            (config.indexOf('uk-') != -1) ||
            (config.indexOf('fr-') != -1)){
            result.LLMAX = '0.088482927761462040,0.087890625000000000';
            result.N = 633;
            result.E = 28;
        } else if ((config.indexOf('aus-') != -1) ||
            (config.indexOf('Australia') != -1) ||
            (config.indexOf('za-') != -1)){
            result.LLMAX = '1.415581451872543800,1.406250000000000000';
            result.N = -26;
            result.E = 107;
        } else if ((config.indexOf('lam-') != -1)) {
            result.N = -134;
            result.E = -246;
        } else if ((config.indexOf('ind-') != -1)) {
            result.N = 74;
            result.E = 456;
        } else if ((config.indexOf('asa-') != -1) ||
            (config.indexOf('hongkong') != -1)) {
            result.N = 17;
            result.E = 578;
        } else if ((config.indexOf('mea-') != -1)) {
            result.N = 147;
            result.E = 315;
        }

        return result;
    },

    /**
	 * Sorts a list of pois by popularity, name or distance
	 *
	 */
    sortPois: function(pois, sortMethod){

        pois.sort(function(a, b) {
            // Grab what we need

            switch (sortMethod.toLowerCase()){
                case 'score':
                    var aVal = a.properties['relevance-score'];
                    var bVal = b.properties['relevance-score'];
                    if(!aVal) aVal = 0;
                    if(!bVal) bVal = 0;

                    if (bVal != aVal) return (bVal - aVal);
                case 'distance':

                    a = a.distance.value;
                    b = b.distance.value;

                    return a - b;
                    break;

                case 'name':
                    a = a.name;
                    b = b.name;

                    if(!a) a = 0;
                    if(!b) b = 0;

                    if (a < b) {
                        return -1;
                    }
                    if (a > b) {
                        return 1;
                    }
                    break;
            }

        /*
            if(sortMethod.toLowerCase() == "score") {



            } else if(sortMethod.toLowerCase() == "name") {
                
            } else {
               
            }
            // else... a must be equal to b
            return 0;*/
        });
    },

    escapeXML: function(string){        

        string = string.replace('&', '&amp;');
        string = string.replace('"', '&quot;');
        string = string.replace("'", '&apos;');
        string = string.replace('<', '&lt;');
        string = string.replace('>', '&gt;');                

        return string;
    },

    /**
     * Fracking IE6
     */
    dumpVar: function(obj, indent, nl){
        
        if (!indent) indent = 0;
        if (!nl) nl = "\n";

        var str = '<pre>';
        var indentStr = '';
        for (var i = 0; i < indent; i++) indentStr += ' ';

        for (var p in obj){
            if (typeof obj[p] === 'object'){
                str += indentStr + p + ' : ' + deCarta.App.Util.dumpVar(obj[p], indent + 4) + nl;
            } else if (typeof obj[p] === 'function'){
                str += indentStr + p + ' : function ' + nl;
            } else {
                str += indentStr + p + ' : ' + obj[p] + nl;
            }
        }
        str += '</pre>';

        return str;
    }
}
