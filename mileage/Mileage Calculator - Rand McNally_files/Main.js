/**
 * @class Main.js
 * @fileoverview Main App entry point
 * @description start of the app
 */

/**
 * From prototype.js - allows closures to be bound to a specific scope.
 * (It's called bind in prototype).
 * For example :
 *
 * var Foo = function(){
 *
 *    $('#someButton').onclick = function(){
 *	  // this == Foo
 *	  }.scope(this);
 * }
 *
 */
Function.prototype.scope = function(context){

    var slice = Array.prototype.slice;

    function update(array, args) {
        var arrayLength = array.length, length = args.length;
        while (length--) array[arrayLength + length] = args[length];
        return array;
    }

    function merge(array, args) {
        array = slice.call(array, 0);
        return update(array, args);
    }

    if (arguments.length < 2 && (typeof arguments[0] === 'Undefined')) return this;
    var __method = this, args = slice.call(arguments, 1);
    return function() {
        var a = merge(args, arguments);
        return __method.apply(context, a);
    }
}


/* Define a window console object to deal with the lack of it in ie. */
if (!window.console){
    console = {};
    console.log = function(){}
}

/**
 * Initialization. 
 *
 */
deCarta.App = {
    version: '1.0e',
    loadComplete: false
}

deCarta.App.main = function(params){

    deCarta.App.params = params;
    // set up configuration
    deCarta.App.Configuration.configure();
    
    //Load user preferences.    
    deCarta.App.UserPreferences.load();
    //localize
    deCarta.App.Configuration.locale = new Locale(deCarta.App.UserPreferences.language, deCarta.App.UserPreferences.country);

    //Set the locale for localizing the UI
    deCarta.App.Localizer.setLocale(deCarta.App.Configuration.locale);

    //deCarta.App.UI.DirectionsPanel.init();

    JSRequest.setDynamicScriptTagMode();
    /* Init map and controls */
    return deCarta.App.UI.init();
}

deCarta.App.mainWrapper = function( leftPanelElemID, mapElemID, toolBarElemID, footerElemID )
{
	deCarta.App.leftPanelElemID = leftPanelElemID;
	deCarta.App.leftPanelJQElemID = "#" + leftPanelElemID;
	deCarta.App.leftPanelElem = document.getElementById( leftPanelElemID );

	deCarta.App.mapElemID = mapElemID;
	deCarta.App.mapJQElemID = "#" + mapElemID;
	deCarta.App.mapElem = document.getElementById( mapElemID );

	deCarta.App.toolBarElemID = toolBarElemID;
	deCarta.App.toolBarJQElemID = "#" + toolBarElemID;
	deCarta.App.toolBarElem = document.getElementById( toolBarElemID );

	deCarta.App.footerElemID = footerElemID;
	deCarta.App.footerJQElemID = "#" + footerElemID;
	deCarta.App.footerElem = document.getElementById( footerElemID );

	return deCarta.App.main();
}