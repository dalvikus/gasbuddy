/**
 * @class UI.js
 * @description  This class initializes the UI for the app.
 *  This is the entry point into the app...
 **/

deCarta.App.UI = {

	currentYear: (new Date()).getFullYear(),
    /**
     * sets up basic event handlers
     */
    init : function(){

        //First, let's make sure everything is configured'
        Credentials.configuration = deCarta.App.UserPreferences.mapConfig;

        //Fire off the requests for the dynamic content of the lists        
        deCarta.App.UI.getMapLocales();

        //Initialize map and controls
        this.map = this.initMap();
        this.initResizing(this.map);
        this.initControls();

        this.initKeyboard();

        if (deCarta.App.UserPreferences.fullScreenMap) this.expandMap(false);        

        // call to initialize dynamic sizing of the map and left control panel
        deCarta.App.UI.manageSidePanelHeight();
        
        //localize our UI
        this.localize();

        if (Utilities.ie6)
            this.ie6PngFix();

        //centering the map on the correct position is the last thing.
        //once this is complete, the UI is ready to be shown. 
        this.centerMap();

        return this.map;
    },

    /**
     *Fixes all transparent pngs so that they work in ie6
     */
    ie6PngFix: function(){
        var elements = [
//        'page_controller',
//        'dLogo',
//        'dir_end_img',
//        'dir_start_img'
        ]
        for (var i = 0; i < elements.length; i++){
            Utilities.fixPng(document.getElementById(elements[i]));
        }

        $('.decarta-panController img').each(function(i, e){
            Utilities.fixPng(e);
        })
    },

    /**
     *  Makes use of the deCarta.App.Localizer to change UI language on the fly.
     *	Every element with a "localizable" css class will be processed
     *	based on its id.
     */
    localize: function(){


        $(".localizable").each(function(){
            
            if ($(this).attr('role') == 'button'){
                //because of jquery UI buttons need a different treatment, as it
                //creates an inner span for the button label
                var text = deCarta.App.Localizer.get(this.id);
                $(this).button("option", 'label', text);
            } else {
                deCarta.App.Util.localizeElement(this.id);
            }
        });

        deCarta.App.UI.makePrettySelects();

        //deCarta.App.UI.DirectionsPanel.renderRouteSearchPanel();

    },

    makePrettySelects: function(){
//        //remove styled selects, if they exist
//        $('#categorySelect').selectmenu('destroy');
//        $("#sel_language").selectmenu('destroy');
//
//        //create styled selects
//        //category select
//        var icons = (Utilities.ie6) ? null : [
//        {
//            find: '.cat_atm',
//            icon: 'money_cat_icon'
//        },
//
//        {
//            find: '.cat_attraction',
//            icon: 'attraction_cat_icon'
//        },
//
//        {
//            find: '.cat_nightlife',
//            icon: 'bar_cat_icon'
//        },
//
//        {
//            find: '.cat_cinema',
//            icon: 'cinema_cat_icon'
//        },
//
//        {
//            find: '.cat_coffee',
//            icon: 'cafe_cat_icon'
//        },
//
//        {
//            find: '.cat_hotel',
//            icon: 'hotel_cat_icon'
//        },
//
//        {
//            find: '.cat_museum',
//            icon: 'museum_cat_icon'
//        },
//
//        {
//            find: '.cat_gas',
//            icon: 'petrol_cat_icon'
//        },
//
//        {
//            find: '.cat_restaurant',
//            icon: 'restaurant_cat_icon'
//        },
//
//        {
//            find: '.cat_shopping',
//            icon: 'shopping_cat_icon'
//        },
//
//        {
//            find: '.cat_theater',
//            icon: 'theatre_cat_icon'
//        },
//
//        {
//            find: '.cat_transport',
//            icon: 'transport_cat_icon'
//        }
//        ]
//
//        $('#categorySelect').selectmenu({
//            transferClasses: true,
//            width: 250,
//            style:'dropdown',
//            icons: icons
//        });
//
//        //language select
//     
//        $("#sel_language").css('display', 'block');
//
//
//        var icons = (Utilities.ie6) ? null : [
//        {
//            find: '.lang_us',
//            icon: 'flag_us'
//        },
//
//        {
//            find: '.lang_it',
//            icon: 'flag_it'
//        },
//
//        {
//            find: '.lang_ch',
//            icon: 'flag_ch'
//        }
//        ];
//
//        $("#sel_language").selectmenu({
//            transferClasses: false,
//            width: 80,
//            style:'dropdown',
//            icons: icons
//        });

    },

    /**
     * Clears the UI - used by Clear Map but also when switching search types
     */
    clear: function(){
        deCarta.App.UI.wipeMap();
        //deCarta.App.UI.SearchPanel.resetAddress();
        //deCarta.App.UI.SearchPanel.resetPoiSearch();
        //deCarta.App.UI.DirectionsPanel.reset();
    },

    /*
     * Wipes all overlays, pins and windows from the map.
     */
    wipeMap: function(){
        try {
            var infoWindow = deCarta.App.map.getInfoWindow()
            infoWindow.hide();
            infoWindow.associatedPin = null;
            deCarta.App.map.removeAllOverlays();
            deCarta.App.map.removeAllPins();
        } catch (e) {
            deCarta.App.Log('Error wiping Map: ' + escape(e.message));
        }
    },

    /*
     * Initialize the deCarta map
     */
    initMap: function(){

        var map = new Map(deCarta.App.mapElem);

        var z;
        if(deCarta.App.params){
            z=19-parseInt(deCarta.App.params.zoom);
       } else{
            z=deCarta.App.UserPreferences.zoomLevel;
        }
        var zoom = new ZoomController( z);
        zoom.zoomLevels = 17;
        zoom.upperBound = 17;
        map.addZoomController(zoom);
        map.setShapeRendering("client");
        //map.setShapeRendering("server");
//        map.addPanController(new PanController());
        RMMap_addPanControl2();
       
        map.addCustomInfoWindow(new DefaultInfoWindow({
            autoHeight: true,
            shouldAutoCenter: true,
            xOffset: -14
        }));

        var mapTypeController = new RMMapTypeController();
        mapTypeController.streetLabel = "Map"
        mapTypeController.hybridLabel = "Hybrid"
        mapTypeController.satelliteLabel = "Satellite"
        // Assuming our map object is named "map"
        map.addMapTypeController( mapTypeController );

        map.setRightClickBBoxZoomEnabled(true);

		if( !YAHOO.env.ua.ie )
		{
			var overView = new MapOverviewController();
			map.addMapOverviewController(overView);
			deCarta.App.overView = overView;
		}

        map.setMapType(deCarta.App.UserPreferences.mapType);
        deCarta.CopyrightMessage.prototype.cssClass = "rand-copyright";
       
//        map.addCopyrightMessage( "&copy; 2011 Rand McNally | Map and Imagery data &copy; 2012 HERE" );
//        deCarta.App.copyright = new RMCopyrightMessage( map );
        
        if(deCarta.App.UserPreferences.mapType == GLOBALS.STREET){
        	 map.addScaleBar(new ScaleBar({
                 screenPosition: 'bottomLeft',
                 yMargin: 22,
                 xMargin: 5
             }));
        	 map.addCopyrightMessage( "<div id='streetCR' style='padding-left: 2px; padding-right: 2px; text-align: left; /*border: 1px dashed red;*/'><div style='/*border: 1px dashed green;*/'>&copy; "+this.currentYear+" Rand McNally - &copy; "+this.currentYear+" HERE</div></div>" );
        	try{
        	 RMUtils.getEl("dgimage").style.display="none";
        	 RMUtils.getEl("navteqimage").style.display="inline";
        	}catch(ignored){}
        }else{
	  		 map.addScaleBar(new ScaleBar({
	             screenPosition: 'bottomLeft',
	             yMargin: 22,
	             xMargin: 5
	         }));
	  		try{
	        	 RMUtils.getEl("dgimage").style.display="inline";
	        	 RMUtils.getEl("navteqimage").style.display="inline";
	        	}catch(ignored){}
	  		 
	  		if(deCarta.App.UserPreferences.mapType == GLOBALS.SATELLITE){
	  			map.addCopyrightMessage( "<div id='nonStreetCR' style='padding-left: 2px; padding-right: 2px; text-align: left; /*border: 1px dashed red;*/'><div style='/*border: 1px dashed green;*/'>&copy; "+this.currentYear+" Rand McNally - &copy; "+this.currentYear+" HERE - Image &copy; 2012 DigitalGlobe</div></div>");
	  		}else{
	  			 map.addCopyrightMessage( "<div id='nonStreetCR' style='padding-left: 2px; padding-right: 2px; text-align: left; /*border: 1px dashed red;*/'><div style='/*border: 1px dashed green;*/'>&copy; "+this.currentYear+" Rand McNally - &copy; "+this.currentYear+" HERE - Image &copy; 2012 DigitalGlobe</div></div>");
	  		}
	  	}
        deCarta.App.map = map;
        deCarta.App.zoom = zoom;
        deCarta.App.typeController = mapTypeController;

        //searches are repeated (if preference is set) when tiles on the map rotate.
        //also when zoom level changes but that callback is below
        //map.onRotate(deCarta.App.search.repeatSearch);

        //Add these event listeners so we can save the values in the preferences when things happen.
//        EventRegistry.addListener(map, "moveend", function(){
//            deCarta.App.UserPreferences.position.lat = deCarta.App.map.getCenterPosition().lat;
//            deCarta.App.UserPreferences.position.lon = deCarta.App.map.getCenterPosition().lon;
//        }.scope(this));

     
        return map;
    },


    /**
     * Centers the map. Used on startup after reading the user preferences
     */
    centerMap: function(){
        try {
            var p;
            if(deCarta.App.params){
                p=new Position(deCarta.App.params.POI.Point.pos);
                //console.log(p)
            } else{
                p=new Position(deCarta.App.UserPreferences.position.lat, deCarta.App.UserPreferences.position.lon);
            }

            this.map.centerOnPosition(p, function(pos){
            
                // This callback happens once the map has centered on the specified
                // position. We take care of the last things, and remove the loading
                // overlay from the UI

				if ( !YAHOO.env.ua.ie )
					deCarta.App.overView.open();

                deCarta.App.map.getTilesContainer().onmouseover = function(){
                    this.style.cursor="default";
                }

                deCarta.App.map.positionMapControls();

                if(deCarta.App.params){

                    //it is the March Hackfest! And we are all drunk.
                    
                    deCarta.App.params.Distance = {value : 0, uom: 'M'};
                    var poi = deCarta.JSONParser.parsePOI(deCarta.App.params);
                    
                  //deCarta.App.UI.SearchPanel.renderResult([poi]);
                }

                //$(window).trigger( "hashchange" );

                //Ready to show the UI.
                deCarta.App.UI.reveal();

                getHist();

// RBH-20110913: Romain says this is no longer used
//                var llPoint = deCarta.App.map.getCenterPosition();
//                var zoomLevel = deCarta.App.map.getZoomController().getZoomLevel();
//
//            	//lat49 init
//            	//lat 49 publisher id
//            	var lat49id = 662;
//            	//the ads on this page
//            	var ads = {"adlat49": Lat49.Ads.HALF_BANNER};
//            	//update the ads on the page
//            	Lat49.updateMultiAdsByLatLon(ads, llPoint.lat, llPoint.lon, zoomLevel);
//            	//init our helper object
//            	AdPushpin.init(lat49id, myMap, ads);

            	VIDEO_PLUGIN.init();
            	CATEGORY_CONTAINER.init();
            	var videosCategory = CATEGORY_CONTAINER.get("videos");
            	var rvdaCategory = CATEGORY_CONTAINER.get('rvda');
            	rvdaCategory.getButton().parentElement.style.width = "180px";
            	VIDEO_PLUGIN.setLinkedCategory( videosCategory );
            	initDialog();
//            	initQuickSearchField();
            	createInfoBaloon();
//            	this.map.getInfoWindow()._container.style.zIndex = INFO_WINDOW_ZINDEX;
            	window.setInterval("refreshAds()",TANAD_REFRESH_INTERVAL_SECONDS * 1000);
            	if(SHOW_SPLASH)
            		showPromotionalWindowIfFirstVisit();

// disabled all map-click events (originally added to manually specify location or origin/destination locations
// by clicking on the map)
//				EventRegistry.addListener( deCarta.App.map, "click", this.mapClick );

            }.scope(this));
        } catch (e) {
            alert(e);
        }
    },

	mapClick: function( pos )
	{
		var activeTabValue = activetab();
//		console.log( "deCarta.App.UI.mapClick: activeTabvalue=" + activeTabValue );

		if ( activeTabValue == "0" )
		{
			for ( var i = 0 ; i < directionPanel.arrayOfWpDisplayOrder.length ; i++ )
			{
				var txtbox = directionPanel.arrayOfWayPointPanel[directionPanel.arrayOfWpDisplayOrder[i]]._inputbox;
//				console.log( "deCarta.App.UI.mapClick: ["+i+"] txtbox.value=" + txtbox.value );
//				console.log( "deCarta.App.UI.mapClick: ["+i+"] isTextBoxEmpty=" + isTextBoxEmpty( txtbox ) );

				if ( isTextBoxEmpty( txtbox ) )
				{
					txtbox.value = pos.toString();
					return;
				}
			}

			if ( directionPanel.arrayOfWpDisplayOrder.length < 10 )
			{
				// do something
			}

//	        if(!routeObj.origin){
//	            routeObj.origin=pos;
//	            greenPin = new Pin(pos,null,null,new Icon("img/green.png",10,30,20,34));
//	            map.addPin(greenPin);
//	        }else{
//	            routeObj.destination=pos;
//	            if(redPin)
//	                map.removePin(redPin);
//	            redPin = new Pin(pos,null,null,new Icon("img/red.png",10,30,20,34));
//	            map.addPin(redPin);
//	            execRoute();
//	        }
		}

//		if ( activeTabValue == "1" )
//		{
//			poiPanel._inputbox.value = pos.toString();
//			RMUtilss.getEl( "locateButton" ).click();
//		}
	},


    /**
     *	Manages the height of the side panel, adjusts when window is resized
     */
    manageSidePanelHeight: function(){

//        var winHeight = $(window).height();
//        var topBarHeight = 36;
//        var btmBarHeight = 20;
//
//        var headerPos = $('#tabs ul').offset();
//        var headerHeight = $('#tabs ul').height();
//
//        $('#tabs .tabContent').each(function(){
//            var height = $(this).height();
//            var pos = $(this).offset();
//
//            var betterHeight = winHeight - headerPos.top - headerHeight - btmBarHeight - topBarHeight - 6/* padding ..*/;
//
//            $(this).height(betterHeight);
//
//            $('#business_search_results').height(betterHeight - 60);
//            $('#address_search_results').height(betterHeight - 60);
//            $('#category_search_results').height(betterHeight - 60);
//
//        });
//
//        $('#directionTabs .routeTabContent').each(function() {
//            var betterHeight = winHeight - headerPos.top - headerHeight - btmBarHeight - topBarHeight - 6
//
//            $(this).height(betterHeight - $('#directionsPanel').height() - 90);
//        });
//
//        $('#left_panel').height(winHeight - headerHeight - btmBarHeight);

    },

    /**
     * Set up keyboard handlers
     * Keyboard navigation, hotkeys etc.
     **/
    initKeyboard: function(){
        $(document).keyup(function(ev){            
            if (ev.target.nodeName.toUpperCase() == 'HTML') deCarta.App.UI.handleKeyboard(ev);
        });        
    },

    /**
     * Actually handle key events
     */
    handleKeyboard: function(ev){

        var prevent = false;

        switch (ev.keyCode){
            //Pan
            case 38: //up
                prevent = true;
                deCarta.App.map.panNorth();
                break;
            case 40: //down
                prevent = true;
                deCarta.App.map.panSouth();
                break;
            case 37: //left
                prevent = true;
                deCarta.App.map.panWest();
                break;
            case 39: //right
                prevent = true;
                deCarta.App.map.panEast();
                break;

            //zoom
            case 33: //in
                prevent = true;
                deCarta.App.map.getZoomController().zoomInOneLevel();
                break;
            case 34: //out
                prevent = true;
                deCarta.App.map.getZoomController().zoomOutOneLevel();
                break;

            case 192:
                prevent = true;
              //deCarta.App.About.init();
                break;
        }

        if (prevent){
            
            ev.stopPropagation();
            ev.preventDefault();

        }

    },

    /**
     * disable keyboard navigation / hotkeys etc. 
     */
    releaseKeyboard: function(){        
        document.onkeyup = null;
    },

    /**
     *	Initializes most UI controls and event handlers
     *
     */
    initControls: function(){

    	deCarta.App.UI.SearchPanel.initialize();
        
        $('#txtPlaceAddress').val('');
//        $('#businessSearchText').val('');
//        $('#addr0').val('');
//        $('#addr1').val('');
//        $('#addr2').val('');
//
//
//        //set up the tab interface on the left panel
//        deCarta.App.UI.tabs = $('#tabs').tabs({
//            selected : deCarta.App.UserPreferences.selectedSearchTab
//        }).show();
//
//        //preselect the direction type with the stored user preference
//        $('#route_pref option').each(function(i){
//            if ($('#route_pref')[0].options[i].value == deCarta.App.UserPreferences.directionsType){
//                $('#route_pref')[0].selectedIndex = i;
//                return;
//            }
//        });
//
//        //register a change event for the route pref select that stores the pref.
//        $('#route_pref').change(function(){
//            deCarta.App.UserPreferences.directionsType = $("#route_pref").val();
//        });
//
//        //register event handlers to change css props on input elements when focused. 
//        $("input[type=text], select").focus(function(){
//            $(this).css("background-color","#FFFFCC")
//            $(this).css("border","1px solid #333");
//        }).blur(function(){
//            $(this).css("background-color","#FFF")
//            $(this).css("border","1px solid #aaa");
//        });
//
//        //Make text fields sensitive to the ENTER key
//        //And register click listeners for search buttons
//        $("#txtPlaceAddress").keypress(function(e){
//            if(e.which==13){
//                $("#locateButton").click();
//            }
//        });
//        $("#businessSearchText").keypress(function(e){
//            if(e.which==13){
//                $("#btn_search_business").click();
//            }
//        });
//
//        $("#btn_get_directions").click(deCarta.App.UI.DirectionsPanel.getDirections);
//
//        $("#btn_geolocate").click(function(){
//            Utilities.geolocate(function(pos){
//                var accuracy = (pos.coords.accuracy) ? (pos.coords.accuracy / 1000) : .5;                
//                if (!deCarta.App.gpsPin) {
//                    var p = Utilities.geolocateConvertPosition(pos);
//
//                    var msg = '<p><b>' + deCarta.App.Localizer.get('your_location') + '</b></p>' +
//                              '<p>'+(p.lat.toFixed(4) + ', ' + p.lon.toFixed(4))+'</p>'+
//                              '<p>' + deCarta.App.Localizer.get('location_accuracy', [(accuracy * 1000)]) + '</p>';
//                              //'<p>Accuracy : '+(accuracy * 1000)+' meters</p>';
//
//                    deCarta.App.gpsPin = new Pin(p,msg, 'click', new Icon("img/gps.png",7,7,15,15));
//                    deCarta.App.map.addPin(deCarta.App.gpsPin);
//                    if (accuracy < .5){
//                        deCarta.App.gpsCircle = new DDSCircle(p, new Radius(accuracy));
//                        deCarta.App.gpsCircle.setFillColor("(40.120.190)");
//                        deCarta.App.gpsCircle.setBorderColor('(50.50.130)');
//                        deCarta.App.gpsCircle.setOpacity("60");
//                        deCarta.App.gpsCircle.setBorderWidth("1");
//                        deCarta.App.map.addOverlay(deCarta.App.gpsCircle);
//                    } else {
//                        deCarta.App.gpsPin.showInfoWindow();
//                    }
//
//                } else {
//                    deCarta.App.gpsPin.setPosition(Utilities.geolocateConvertPosition(pos));
//                }
//                
//                deCarta.App.map.panToPosition(Utilities.geolocateConvertPosition(pos));
//            },function(){
//
//            });
//        });
//
//        if (!navigator.geolocation) $("#btn_geolocate").hide();
//
//        $(".addr_input").keypress(function(e){
//            if (e.which == 13) {                
//                $("#btn_get_directions").click();
//            } else {
//                
//                var id=$(this).attr("id");
//                var idSeq = parseInt(id.substring("addr".length));
//                if (idSeq == 0) deCarta.App.UI.DirectionsPanel.setStart(null);
//                if (idSeq == 1) deCarta.App.UI.DirectionsPanel.setStop( null, 0);
//                if (idSeq == 2) deCarta.App.UI.DirectionsPanel.setEnd(null);
//            }
//        });		
//
//        $(".addr_input").blur( function(){
//
//            var id = $(this).attr("id");
//            var idSeq = parseInt(id.substring("addr".length));
//            if (idSeq == 0) deCarta.App.UI.DirectionsPanel.setStart($(this).val());
//            if ( idSeq == 1 ) deCarta.App.UI.DirectionsPanel.setStop( $(this).val(), 0 )
//            if (idSeq == 2) deCarta.App.UI.DirectionsPanel.setEnd($(this).val());
//        });
//
//        $("#businessSearchText").focus();
//
//        $("#page_controller").css("background-image","url(img/double-left.png)")
//
//        /* Set up page controller to toggle side panel display*/
//        $("#page_controller").click(function(){
//            if(!deCarta.App.UserPreferences.fullScreenMap){
//                this.expandMap();
//            } else {
//                this.shrinkMap();
//            }
//        }.scope(this));

//        //Change map type buttons. They contain the map type as the value (see HTML)
//        $(".map_type_control_button").click(function(){
//            var value = (Utilities.ie6) ? this.attributes.getNamedItem("value").nodeValue : $(this).val();
//            deCarta.App.UserPreferences.mapType = value;
//            deCarta.App.map.setMapType(value);
//        })
//        
//        $(".map_clear_button").click(function(){
//            deCarta.App.UI.clear();
//        })
//
//        //preselect the language select
//        var selectedLang = deCarta.App.UserPreferences.language + "," + deCarta.App.UserPreferences.country;
//        
//        $("#sel_language").val(selectedLang);
//        $("#sel_language").change(function(){            
//            var info = $(this).val().split(',');
//
//            deCarta.App.UserPreferences.country = info[1];
//            deCarta.App.UserPreferences.language = info[0];
//            deCarta.App.Configuration.configure();
//            deCarta.App.Localizer.setLocale(deCarta.App.Configuration.locale)
//            deCarta.App.UI.localize();
//        });

        //Option checkboxes - set up listeners and link to prefenreces 
        this.linkPref('mapDblClkZoom', deCarta.App.map.setDoubleClickRecenterAndZoom);
        this.linkPref('mapEasing', deCarta.App.map.setDragEasingEnabled);
        this.linkPref('mapDigitalZoom', deCarta.App.map.setDigitalZoomEnabled);
        this.linkPref('mapDblClkCenter', deCarta.App.map.setDoubleClickRecenteringEnabled);
        this.linkPref('mapRtClkBBZoom', deCarta.App.map.setRightClickBBoxZoomEnabled);
        this.linkPref('mapTileFading', deCarta.App.map.setTileFadingEnabled);
        this.linkPref('zoomWheelOn', deCarta.App.map.setWheelZoomEnabled);


//        //preselect the locale select
//        $('#sel_map_locale').change(function(){
//            var localeArr = $('#sel_map_locale').val().split('-');
//            deCarta.App.UserPreferences.country = localeArr[0];
//            deCarta.App.UserPreferences.language = localeArr[1];
//            deCarta.App.Configuration.locale = new Locale(deCarta.App.UserPreferences.language, deCarta.App.UserPreferences.country);
//        });
//
//        //theme the buttons
//        $("button, input[type=button], input[type=reset]").button();
//
//
//        this.initReadme();
//        $('#btn_readme').click(
//            function (){
//                //console.log('mooo');
//                $("#readme_dialog").dialog("open");
//                return false;
//            }
//            );        

        //enables the serach buttons.
        deCarta.App.UI.enableSearches();

//        //set up routing search panel
//        deCarta.App.UI.DirectionsPanel.setupTabs();
    },

    /*
         * Links a checkbox to a user preference.
         */
    linkPref: function(pref, applyTo){      
        applyTo(deCarta.App.UserPreferences[pref]);
    },

    /* Disable search buttons / searches while one is running */
    disableSearches: function() {

//        $("#locateButton").attr("disabled", true);
//        $("#btn_search_business").attr("disabled", true);

//        $("#locateButton").button("disable");
//        $("#btn_search_business").button("disable");
    },

    /* Enable all search buttons*/
    enableSearches: function (){

//        $("#locateButton").attr("disabled", false);
//        $("#btn_search_business").attr("disabled", false);

//        $("#locateButton").button("enable");
//        $("#btn_search_business").button("enable");

    },

    //makes map fullscreen
    expandMap: function(animate){
        if (typeof animate === 'undefined') animate = true;
//        $("#page_controller").css("background-image","url(img/double-right.png)");
//        if (Utilities.ie6) Utilities.fixPng(document.getElementById('page_controller'));
        deCarta.App.UserPreferences.fullScreenMap = true;
//        $("#accordion").hide();

//        if (animate){
////            $("#page_controller").animate({
////                left: 200
////            }, 500);
////            $(deCarta.App.mapJQElemID).animate({
////                left : 0
////            }, 500, function(){
////                deCarta.App.UI.fireResize();
////                setNavColumn(false);
////            });
//            $(deCarta.App.leftPanelJQElemID).animate({
//                left : -400
//            }, 500, function(){
//                deCarta.App.UI.fireResize();
//                setNavColumn(false);
//            });
//        } else {
//            $("#page_controller").css("left","150px");
//            $(deCarta.App.mapJQElemID).css("left","0px");
//            $(deCarta.App.leftPanelJQElemID).css("left", "-400px");
            setNavColumn(false);
            deCarta.App.UI.fireResize();
//        }
    },

    //make map NOT fullscreen
    shrinkMap: function(animate){
        if (typeof animate === 'undefined') animate = true;
//        $("#page_controller").css("background-image","url(img/double-left.png)");
//        if (Utilities.ie6) Utilities.fixPng(document.getElementById('page_controller'));
        deCarta.App.UserPreferences.fullScreenMap = false;

//        $("#accordion").show();
        animate = false;
        if (animate) {
//            $("#page_controller").animate({
//                left: 400
//            }, 500);
//            $(deCarta.App.mapJQElemID).animate({
//                left : 400
//            }, 500, function(){
//                deCarta.App.UI.fireResize();
//                setNavColumn(true);
//            });
            $(deCarta.App.leftPanelJQElemID).animate({
                left : 0
            }, 500, function(){
                deCarta.App.UI.fireResize();
                setNavColumn(true);
            });
        } else {
            $("#page_controller").css("left","400px");
//            $(deCarta.App.mapJQElemID).css("left","400px");
            $(deCarta.App.leftPanelJQElemID).css("left", "0px");
            setNavColumn(true);
            deCarta.App.UI.fireResize();
        }
    },

    /**
             * basic page and map resizing logic
             */
    fireResize : null,  // public funct for full screening

    initResizing : function(map){

        deCarta.App.UI.fireResize = resizeMap;
        var lock=false;
//        var initialSize = calculate();
        // TODO make jquery calls
        deCarta.App.mapElem.style.height=deCarta.App.mapElem.clientHeight+"px";
        deCarta.App.mapElem.style.width=deCarta.App.mapElem.clientWidth+"px";
        deCarta.App.leftPanelElem.style.height=deCarta.App.leftPanelElem .clientHeight+"px";

        // inner
        function resizeMap(){
            // IE and mozilla resize differently, to avoid too much recursion I block the resize function
            if(Utilities.ie){
                if(!lock)
                    setTimeout(resizeMapWithPause,1000);
                lock=true;
            } else {
                resizeMapWithPause();
            }
        }

        function resizeMapWithPause(){
            var size = calculate();
            map.resize(size.x,size.y);

            deCarta.App.UI.manageSidePanelHeight();
            lock=false;
        }

        function calculate(){

//              var mapContainer = document.getElementById( "map_container" );

//              return {
//                  x: mapContainer.clientWidth,
//                  y: mapContainer.clientHeight - deCarta.App.toolBarElem.clientHeight - deCarta.App.footerElem.clientHeight
//              }
            var frameWidth,frameHeight;
            if (self.innerWidth){
                frameWidth = self.innerWidth;
                frameHeight = self.innerHeight;
            }else if (document.documentElement && document.documentElement.clientWidth){
                frameWidth = document.documentElement.clientWidth;
                frameHeight = document.documentElement.clientHeight;
            }else if (document.body){
                frameWidth = document.body.clientWidth;
                frameHeight = document.body.clientHeight;
            }
            // pad the border TODO test and fit to each browser
            var padding = 20;
            // get the map div offsets from the top left corner
            var top = Utilities.getAbsoluteTop( deCarta.App.mapElem );
            var left = Utilities.getAbsoluteLeft( deCarta.App.mapElem );
//            var totTop = frameHeight-top-deCarta.App.footerElem.clientHeight;
            var totTop = frameHeight - top - 0;
            var totLeft = frameWidth-left;
            // make sure x and y are even numbers
            if(totTop%2!=0)totTop--;
            if(totLeft%2!=0)totLeft--;
            return {
                x:totTop,
                y:totLeft
            }; // obj x y
        }
        window.onresize=resizeMap;
				resizeMap();
				

    },

    /*
         * Get the list of supported locales on this server
         */
    getMapLocales: function(l){

        var url = Credentials.url.replace('JSON','library') + "?clientName="+escape(Credentials.clientName)+"&clientPassword="+escape(Credentials.clientPassword)+"&listLocales=yes&callback=deCarta.App.UI.localeSettingsCallback";

        var scriptObj = document.createElement("script");
        scriptObj.setAttribute("type", "text/javascript");
        scriptObj.setAttribute("src", url);
        // append to head
        document.getElementsByTagName("head").item(0).appendChild(scriptObj);


        deCarta.App.UI.localeSettingsCallback = function(x){
            var results = x.split(':');
            deCarta.App.UI.populateLocales(results);
        }

    },

    /* Populated the dropdown list for locale selection with the available ones*/
    populateLocales: function(locales){

//        var html = '';
//        var currentLocale = deCarta.App.UserPreferences.country + '-' + deCarta.App.UserPreferences.language;
//
//        locales.sort();
//
//        for (var i = 0; i < locales.length; i ++){
//            if (locales[i].length > 0){
//                var selected = '';
//                var locale = locales[i];
//                if (locale == currentLocale) selected = ' selected ';
//                html += '<option' + selected + '>'+locale+'</option>';
//            }
//        }
//
//        $('#sel_map_locale').html(html);
//
//        $('#sel_map_locale').selectmenu({
//            transferClasses: false,
//            width: 80,
//            maxHeight: 250,
//            style:'dropdown'
//        });
    },

    initReadme: function(){


        //define config object
        var dialogOpts = {
            title: "Viewing README.html",
            modal: true,
            autoOpen: false,
            height: 500,
            width: 500,
            open: function() {
                //display correct dialog content
                //$("#readme_dialog").load("README.html");
            }
        };

        //$("#readme_dialog").dialog(dialogOpts);    //end dialog

    },

    /* Removes the loading layer from the ui */
    reveal: function(){
        deCarta.App.loadComplete = true;
        //$('#loading').fadeOut('slow');
    },

    /* Hide the ui while loading things. */
    hide: function(){
        //$('#loading').fadeIn('slow');
    }

}

var MAP_CONTROLLER_X_OFFSET = -195;

function RMMapTypeController() {
	this.init()
}

RMMapTypeController.prototype.map = null;
RMMapTypeController.prototype.type = "MapTypeController";
RMMapTypeController.prototype.frame = null;
RMMapTypeController.prototype.cssClass = "decarta-mapTypeController";
RMMapTypeController.prototype.linkCssClass = "decarta-mapTypeControllerLink";
RMMapTypeController.prototype.streetLabel = GLOBALS.STREET;
RMMapTypeController.prototype.hybridLabel = GLOBALS.HYBRID;
RMMapTypeController.prototype.satelliteLabel = GLOBALS.SATELLITE;
RMMapTypeController.prototype.init = function () {};

RMMapTypeController.prototype.build = function () {
	this.frame = document.createElement("DIV");
	this.frame.id = this.cssClass;
	this.frame.className = this.cssClass;
	deCarta.IdManager.setTag(this.frame, "ignoreForMapEvents");
	var linkBGImageClassName = this.linkCssClass + ( isIE ? "IE" : "NonIE" );
	var f = document.createElement("a");
	f.className = this.linkCssClass + " " + GLOBALS.STREET + " " + linkBGImageClassName;
	if ( deCarta.App.UserPreferences.mapType == GLOBALS.STREET )
		f.className += " decarta-mapTypeControllerLink-selected";
	f.innerHTML = this.streetLabel;
	f.href = "#";
	f.mapType = GLOBALS.STREET;
	f.owner = this;
	f.onclick = this.handleClick;
	deCarta.IdManager.setTag(f, "ignoreForMapEvents");
	var b = document.createElement("a");
	b.className = this.linkCssClass + " " + GLOBALS.HYBRID + " " + linkBGImageClassName;
	if ( deCarta.App.UserPreferences.mapType == GLOBALS.HYBRID )
		b.className += " decarta-mapTypeControllerLink-selected";
	b.innerHTML = this.hybridLabel;
	b.href = "#";
	b.mapType = GLOBALS.HYBRID;
	b.owner = this;
	b.onclick = this.handleClick;
	deCarta.IdManager.setTag(b, "ignoreForMapEvents");
	var d = document.createElement("a");
	d.className = this.linkCssClass + " " + GLOBALS.SATELLITE + " " + linkBGImageClassName;
	if ( deCarta.App.UserPreferences.mapType == GLOBALS.SATELLITE )
		d.className += " decarta-mapTypeControllerLink-selected";
	d.innerHTML = this.satelliteLabel;
	d.href = "#";
	d.owner = this;
	d.mapType = GLOBALS.SATELLITE;
	d.onclick = this.handleClick;
	deCarta.IdManager.setTag(d, "ignoreForMapEvents");
	this.frame.appendChild(f);
	this.frame.appendChild(d)
	this.frame.appendChild(b);
};

RMMapTypeController.prototype.appendThis = function () {
	if (!this.frame) {
		this.build()
	}
	return this.frame
};

RMMapTypeController.prototype.removeThis = function () {
	this.map = null;
	return this.frame
};

RMMapTypeController.prototype.position = function (a) {
	this.frame.style.top = "5px";
	this.frame.style.left = a.width + MAP_CONTROLLER_X_OFFSET + "px";
};

// NOTE: this function requires JQuery
RMMapTypeController.prototype.handleClick = function (e) {
	if (!GLOBALS.ALLOWDOMEVENTS) {
		return true
	}
	this.owner.map.setMapType(this.mapType);
	var jqA = $( this );
	jqA.addClass( "decarta-mapTypeControllerLink-selected" );
	jqA.siblings( "a" ).each( function( i, eA ) {
		$( eA ).removeClass( "decarta-mapTypeControllerLink-selected" );
	} );
	deCarta.App.UserPreferences.mapType = this.mapType;
	deCarta.App.UserPreferences.save();
	
	if(deCarta.App.UserPreferences.mapType == GLOBALS.STREET){
		
		this.owner.map.addCopyrightMessage( "<div id='streetCR' style='padding-left: 2px; padding-right: 2px; text-align: left; /*border: 1px dashed red;*/'><div style='/*border: 1px dashed green;*/'>&copy; "+deCarta.App.UI.currentYear+" Rand McNally - &copy; "+this.currentYear+" HERE</div></div>" );
		this.owner.map.getScaleBar().setOpts({
            screenPosition: 'bottomLeft',
            yMargin: 22,
            xMargin: 5
        });
		try{
       	 RMUtils.getEl("dgimage").style.display="none";
       	 RMUtils.getEl("navteqimage").style.display="inline";
       	}catch(ignored){}
	}else{
		try{
       	 RMUtils.getEl("dgimage").style.display="inline";
       	 RMUtils.getEl("navteqimage").style.display="inline";
       	}catch(ignored){}
       	
		if(deCarta.App.UserPreferences.mapType == GLOBALS.SATELLITE){
			this.owner.map.addCopyrightMessage( "<div id='nonStreetCR' style='padding-left: 2px; padding-right: 2px; text-align: left; /*border: 1px dashed red;*/'><div style='/*border: 1px dashed green;*/'>&copy; "+deCarta.App.UI.currentYear+" Rand McNally - &copy; "+this.currentYear+" HERE - Image &copy; 2012 DigitalGlobe</div></div>");
  		}else{
  			this.owner.map.addCopyrightMessage( "<div id='nonStreetCR' style='padding-left: 2px; padding-right: 2px; text-align: left; /*border: 1px dashed red;*/'><div style='/*border: 1px dashed green;*/'>&copy; "+deCarta.App.UI.currentYear+" Rand McNally - &copy; "+this.currentYear+" HERE - Image &copy; 2012 DigitalGlobe</div></div>");
  		}
		 this.owner.map.getScaleBar().setOpts({
	            screenPosition: 'bottomLeft',
	            yMargin: 22,
	            xMargin: 5
	        });
	}
	
	deCarta.App.UI.fireResize();
	if(mapLoggerUp == true){
		if(!onHomePage){
		prepareMapJson("MAP",decartaUserName,decartaConfiguration,deCarta.App.map.getZoomController().getZoomLevel(),deCarta.App.UserPreferences.mapType,deCarta.App.map.getCenterPosition().getLat()+","+deCarta.App.map.getCenterPosition().getLon(),serviceProvHDecarta);
		logMapRequest(loggerURL);
		}else{
			prepareMapJson("HOME",decartaUserName,decartaConfiguration,deCarta.App.map.getZoomController().getZoomLevel(),deCarta.App.UserPreferences.mapType,deCarta.App.map.getCenterPosition().getLat()+","+deCarta.App.map.getCenterPosition().getLon(),serviceProvHDecarta);
			logMapRequest(loggerURL);
		}
	}
	return false
};

function RMMap_addZoomBar2()
{
	var oMapControl = document.getElementById("mapControl");
	
	var zoomBar = new RMZoomBar2( "RMZoomBar" );

	oMapControl.appendChild( zoomBar._divContainer );

	return zoomBar;
}
/**
*Function to add pan controls
*@type		void
*@return	void

*/
function RMMap_addPanControl2(){

	var oUl = document.createElement("UL");
	var oDirections = ["North","West","East","South"];
	var oMapControl = document.getElementById("mapControl");
	
	oUl.className = "map-compass";
	
	for(i in oDirections){
		var oDirection = oDirections[i];
		var oLi = document.createElement("LI");
		var oLink = document.createElement("A");
		
		oLink.id = "pan"+oDirection;
		oLink.innerHTML = "Pan "+oDirection;
		
		oLi.className = "compass-"+oDirection.toLowerCase();
		oLi.appendChild(oLink);
		
		YAHOO.util.Event.addListener(oLink.id,"mousedown",function(pMap,pDirection){
			return function(){
				RMMap_panMap2(pDirection);
			}
		}(this,oDirection.toLowerCase()));	
	
		oUl.appendChild(oLi);
	}

	var oDirection = "CurrentLocation";
	var oLi = document.createElement("LI");
	var oLink = document.createElement("A");
	oLink.id = "pan"+oDirection;
	oLink.innerHTML = "Pan "+oDirection;
	oLink.title = "Click to jump to your current location";
	oLi.className = "compass-center";
	oLi.appendChild(oLink);
	YAHOO.util.Event.addListener(oLink.id,"mousedown",function(pMap,pDirection){
		return function(){
			RMMap_panMap2(pDirection);
		}
	}(this,oDirection.toLowerCase()));
	oUl.appendChild(oLi);

	oMapControl.appendChild(oUl);	
}

function RMMap_panMap2( pOrientation )
{
	switch( pOrientation )
	{
		case "northwest":deCarta.App.map.panNorthWest();break;
		case "north":deCarta.App.map.panNorth();break;
		case "northeast":deCarta.App.map.panNorthEast();break;
		case "west":deCarta.App.map.panWest();break;
		case "east":deCarta.App.map.panEast();break;
		case "southwest":deCarta.App.map.panSouthWest();break;
		case "southeast":deCarta.App.map.panSouthEast();break;
		case "south":deCarta.App.map.panSouth();break;
		case "currentlocation": RMMap_panToCurrentLocation(); break;
	}
	
	
}

function RMMap_panToCurrentLocation()
{
	var j = function (m) {
		m = m.coords || m;
		var n = new Position(m.latitude + " " + m.longitude);
		return n
	};
	var c = function (m) {
//		g.src = Credentials.imgPath + "z2t_pan_center_gray.png";
		deCarta.App.map.panToPosition(j(m))
	};
	var k = function () {
//		g.src = Credentials.imgPath + "z2t_pan_center_gray.png";
		alert("unable to position")
	};
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(c, k)
	} else {
		if (window.google && google.gears) {
			var l = google.gears.factory.create("beta.geolocation");
			if ((l) && (l.getPermission())) {
				l.getCurrentPosition(c, k)
			}
		}
//		else {
//			g.src = Credentials.imgPath + "z2t_pan_center_gray.png"
//		}
	}
}

//function RMCopyrightMessage( deCartaMap ) {
////	this.init();
//	setMap( deCartaMap );
//}
//
//RMCopyrightMessage.prototype = deCarta.CopyrightMessage;
//
//RMCopyrightMessage.prototype.setMap = function( deCartaMap )
//{
//	this.map = deCartaMap;
//	this.updateMessage();
//}
//
//RMCopyrightMessage.prorotype.updateMessage()
//{
//	if ( this.map )
//		this.map.addCopyrightMessage( "© 2011 Rand McNally | Map and Imagery data © 2012 HERE" );
//}