/**
 * @class UserPreferences
 * @description  Provides a mechanism for storing stateful pieces of info regarding
 * the user's preferences. The UserPreferences object is serialized as JSON and stored in a cookie.
 * On page load, the cookie is read and the user options are restored. 
 */
deCarta.App.UserPreferences = {

    /* Default Values */
    position: {
    	lat: "39.113399505615234",
    	lon: "-94.62660217285156"
    },
    zoomLevel: 17,
    fullScreenMap: false,
    mapType: "STREET",
    selectedSearchTab: 1,
    selectedAccordionPanel: 1,
    country: 'US',
    language: 'EN',
    numResults: 20,
    indexLevel: 2,
    mapDblClkZoom: true,
    mapEasing: true,
    mapDigitalZoom: true,
    mapDblClkCenter: true,
    mapRtClkBBZoom: true,
    mapTileFading: false,
    searchOnMove: true,
    showRoutingOptions: false,
    saveAppState: false,
    zoomWheelOn: true,
    searchSortCriteria: null,
    showOverviewMap: true,
    dbIndex: "search:decarta:poi",

    load: function(){
        try {
            var loadedOptions = JSON.parse( $.cookie("RM_MAndD_Prefs") );
            $.extend(this, loadedOptions);
            //the map config need to be initialized last. 
            if (!this.mapConfig) this.mapConfig = Credentials.configuration;
        } catch (e) {
        //options would not load. How to handle this?
        }
    },

    save: function(){
        var options = {};
        for (var option in this){
            if (this.hasOwnProperty(option)){
                if (typeof option !== 'function'){
                    options[option] = this[option];
                } 
            }
        }
        var json = JSON.stringify(options);
//		console.log( "--x UserPreferences.save: json" + json );
        $.cookie("RM_MAndD_Prefs", json);
    }

}

// Preferences are saved on unload. This does not work in Opera.
$(window).unload(function(){
    deCarta.App.UserPreferences.save();
});
