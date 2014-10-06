/**
 * @class Search.js
 * @description
 * This object provides methods to perform different types of searches
 * How does search history work?
 * Search history works by representing each search request as an object
 * containing all the properties required to perform the search.
 *  var obj = {
            center: deCarta.App.map.getCenterPosition(),
            zoom: deCarta.App.zoom.getZoomLevel(),
            type: type,
            searchTerm: searchTerm,
            properties: properties,
            priorityLevel: deCarta.App.idxToZoom.mapping[deCarta.App.zoom.getZoomLevel()],
            callback: 'deCarta.App.search.restore'
        };
 *
 * The object is serialized and stored by the AppState object. The only required
 * property is 'callback'. This allows AppState to store any kind of state object
 * since all it has to do is deserialize it and pass it back to the callback
 * function for handling.
 * Currently only searches are stored in AppState. However, implementing
 * state for Directions, for instance, would only be a matter of encoding a
 * direction request in a specialized object type and providing a function
 * capable of reproducing a search given any one such object.
 * 
 */

deCarta.App.search = {

    //Information regarding the last search,
    //necessary to decide if the search can be repeated
    lastSearch: null,
    lastSearchPosition: null,
    lastSearchTime: 0,

    // this is used to prevent searches from refiring
    // currently used when clicking on a poi makes the map scroll
    searchesLocked: false,

    // min time between searches. This is mainly used to avoid repeating too
    // many searches if "continuous search" is enabled and the map is scrolled
    // really fast
    minRepeatInterval: 2000,

    /**
	 * Adds an entry to the search history
	 */
    addHistory: function(type, searchTerm, properties){

        var obj = {
            center: deCarta.App.map.getCenterPosition(),
            zoom: deCarta.App.zoom.getZoomLevel(),
            type: type,
            searchTerm: searchTerm,
            properties: properties,            
            callback: 'deCarta.App.search.restore'
        };
        deCarta.App.search.lastSearch = obj;
        deCarta.App.search.lastSearchTime = new Date().getTime();        
        return obj;
    },

    /**
     * Restore a search from a history object
     * This is the callback for AppState 
     */
    restore: function(obj){
        deCarta.App.map.panToPosition(new Position(obj.center.lat, obj.center.lon), function () {
            deCarta.App.map.zoomMap(obj.zoom, function() {
                deCarta.App.search.searchFromObj(obj, false);
            });
        });
    },

    /**
     * Repeat the last search, used if the user pans the map
     */
    repeatSearch: function(){

        if (!deCarta.App.UserPreferences.searchOnMove) return;
        if (deCarta.App.search.searchesLocked) return;
        if (deCarta.App.search.lastSearch) if (deCarta.App.search.lastSearch.type == 'address') return;

        var time = new Date().getTime();
        if ((time - deCarta.App.search.lastSearchTime) < deCarta.App.search.minRepeatInterval) {
            return;
        }
        deCarta.App.search.lastSearchTime = time;

        if (deCarta.App.search.lastSearch){

            var obj = $.extend({}, deCarta.App.search.lastSearch);

            obj.center = deCarta.App.map.getCenterPosition();
            obj.zoom = deCarta.App.zoom.getZoomLevel();            

            if (obj == deCarta.App.search.lastSearch) {
                return;
            }

            deCarta.App.search.searchFromObj(obj, true);
        }
    },

    /**
     * Takes a generic search property object and performs the search
     */
    searchFromObj: function(obj, saveState){

        deCarta.App.search.lastSearch = obj;
        deCarta.App.search.lastSearchTime = new Date().getTime();


        switch (obj.type){
            case 'business':
                $('#businessSearchText').val(obj.searchTerm);
                deCarta.App.search.exec(obj.properties, obj, null, deCarta.App.UI.SearchPanel.renderResult.scope(deCarta.App.UI.SearchPanel));
                break;
            case 'category':
                $('#categorySearchText').val(obj.searchTerm);
                deCarta.App.search.exec(obj.properties, obj, null, deCarta.App.UI.SearchPanel.renderResult.scope(deCarta.App.UI.SearchPanel));
                break;
            case 'address':
                $('#addressSearchText').val(obj.searchTerm);
                deCarta.App.search.Address(obj.searchTerm, deCarta.App.UI.SearchPanel.renderAddressResult.scope(deCarta.App.UI.SearchPanel));
                break;
        }
    },

    /* free form poi search */
    Business: function(searchTerm, callback){

        deCarta.App.search.lastSearchTime=new Date().getTime();

        if(!searchTerm || searchTerm==""){
            callback();
            return;
        }

        var properties = {
            POIName: deCarta.App.Util.escapeXML(searchTerm)
        };

        var searchKey = deCarta.App.search.addHistory('business', searchTerm, properties);

        deCarta.App.search.exec(properties, searchKey, null, callback);
    },

    /* Category search */
    Category: function(searchTerm, callback){

        if (searchTerm == 'none' || !searchTerm || searchTerm==""){
            callback();
            return;
        }
        var properties = {
            CATEGORY: searchTerm
        };

        var searchKey = deCarta.App.search.addHistory('category', searchTerm, properties);
        deCarta.App.search.exec(properties, searchKey, null, callback);
    },

    /* Address Search */
    Address: function(term, callback, mapLocaleString){

//        var searchTerm = $("#addressSearchText").val();//.trim();
        var searchTerm = term;
        searchTerm = searchTerm.replace(/^\s+|\s+$/g,"");
        if(!searchTerm || searchTerm == "" ){
            callback();
            return;
        }

        
        var locale = ( mapLocaleString && mapLocaleString != null
                ? localeForMapLocaleString( mapLocaleString )
                : deCarta.App.Configuration.locale );
        var searchTermKey = searchTerm + locale;
        var searchKey = deCarta.App.search.addHistory('address', searchTermKey);

        var results = deCarta.App.SearchCache.get(searchKey);
        if (results){
            callback(results);
            return;
        }

       

        var geo = new Geocoder();

        var position = parseLatLong( searchTerm );

        if ( position != null )
        {
        	geo.reverseGeocode( position,
                    //callback for successful geocode
                    function success(address) {
                        //console.log('Revgeo : ', address);
                        // if unable to rev geo, you will get an empty string
//                        if (address.toString() == ''){
//                            this.address = this.position.toString();
//                        } else {
//                            this.address = address;
//                        }
//                        this.ready = true;
//                        if (typeof(this.options.onReady === 'function')) this.options.onReady();
                        var geoAddr = new GeocodedAddress();
                        geoAddr.position = position;
                        geoAddr.structuredAddress = address;

                        var result = {
                            position: [ position ],
                            address: [ address ],
                            geoAddr: [ geoAddr ]
                        };

                        if (typeof callback === 'function'){
                            callback.scope(this, result)();
                        }
                    }.scope(this),
                    //geocoding timed out-we can still proceed, since we have a position
                    function timeout(){
//                        this.address = this.position.toString();
//                        this.ready = true;
//                        if (typeof(this.options.onReady === 'function')) this.options.onReady();
                    }.scope(this) );
        }

        else
        {
	        var address = new FreeFormAddress(searchTerm, locale);
	        geo.returnFreeForm = false;
	        geo.geocode(address, function(pos, addr, geoAddr) {
	
	            if(!pos || pos.length==0 || !addr || addr.length==0 || !(pos[0].lat || pos[0].lon)) {
	                //this.error("Can't find the address: "+searchTerm);
	                if (typeof callback === 'function'){
	                    callback.scope(this, [])();
	                }
	                return;
	            }
	
	            var result = {
	                position: pos,
	                address: addr,
	                geoAddr: geoAddr
	            };
	
	            deCarta.App.SearchCache.set(searchKey, result);
	            if (typeof callback === 'function'){
	                callback.scope(this, result)();
	            }
	        }.scope(this),
	
	            function(id){
	                this.error("Timeout on request ID: "+id);
	            }
	        );
        }
    },

    /* Corridor search */
    OnRoute: function(searchTerm, searchType, searchDistance, routeId, callback){       

        if (searchTerm == 'none' || !searchTerm || searchTerm==""){
            callback();
            return;
        }
        var properties = {
            CATEGORY: searchTerm,
            searchType: searchType,
            searchDistance: searchDistance
        };

        // var searchKey = deCarta.App.search.addHistory('category', searchTerm, properties);
        try {
            deCarta.App.search.exec(properties, null, routeId, callback);
        } catch (e) {
            console.log(e);
        }
    },

    /* Actually performs the search */
    exec: function(properties, searchKey, routeId, callback){

        if (deCarta.App.search.searchesLocked) return;

        //check cache first
        if (searchKey) {
            var results = deCarta.App.SearchCache.get(searchKey);
            if (results){
                callback(results);
                return;
            }
        }

        var querier = new POIQuery();


        var maxResponses = $('#max_responses').val() || 100;

        //TODO make the use of routeID's into something cool looking
        var search;
        if(routeId){
            //console.log('Route Search');
            search = new CorridorSearchCriteria("", routeId, {
                type: properties.searchType,
                duration: properties.searchDistance,
                distance: properties.searchDistance
            });
            search.maximumResponses = maxResponses;

            delete properties.searchType;
            delete properties.searchDistance;
        } else {
            var scaledRadius = deCarta.App.zoom.getMaxViewableRadius();
            var radius = new Radius(scaledRadius, new UOM("KM"));
            var center = deCarta.App.map.getCenterPosition();
            search = new SearchCriteria("", center, radius, maxResponses, null, new UOM("M"));
            search.sortCriteria = deCarta.App.UserPreferences.searchSortCriteria;

            /*
             * Depending on the search type, select the appropriate server
             * side sorting mechanism
             **/
            if (properties.POIName) {
                search.rankCriteria = 'Score';
            } else {
                search.rankCriteria = 'Distance';
            }
        }

        search.database = deCarta.App.UserPreferences.dbIndex;
        search.properties = properties;

        querier.query(search, function(results){
            if (searchKey) deCarta.App.SearchCache.set(searchKey, results);
            callback(results);
        });
    }



}
