/**
 * @author mamta
 */


function RMScriptAutoComplete(input, datasource, scriptQueryParam, charWidth, wordLimit, wordErrorCallback) {
	// set up all public methods
	this.getAutoCompleteObject = RMScriptAutoComplete_getAutoCompleteObject;
	this.getDataSource = RMScriptAutoComplete_getDataSource;
	this.getContainer = RMScriptAutoComplete_getContainer;
	this.getInput = RMScriptAutoComplete_getInput;

	// call init
	RMScriptAutoComplete.prototype._init.call(this, input, datasource, scriptQueryParam, charWidth, wordLimit, wordErrorCallback);
}

/**
 * Where the initialization occurs
 * 
 * @type void
 * @return void
 * @param {String}datasource
 *            url of the datasource
 * @param {HTMLElement|String}input
 *            html element of the input box
 * @private
 */
RMScriptAutoComplete.prototype._init = function(input, datasource, scriptQueryParam, charWidth, wordLimit, wordErrorCallback){
	
	this.input = input;
	// Create The container that will show the list of items
	this.container = document.createElement("div");
	YAHOO.util.Dom.generateId(this.container, "container");
	YAHOO.util.Dom.insertAfter(this.container, this.input);
	

    // Instantiate DataSource
    var oDS = new YAHOO.util.ScriptNodeDataSource(datasource);
    oDS.responseSchema = {
        resultsList: "results",
        fields: ["results", "name", "cat", "lat", "lng" ,"city","state","country","airportFullName"]
    };

    // Setting to default value for demonstration purposes.
    // The webservice needs to support execution of a callback function.
    oDS.scriptCallbackParam = "callback";

    // Instantiate AutoComplete
    var oAC = new YAHOO.widget.AutoComplete(this.input,this.container, oDS);

    // Bump up the query delay to reduce server load
    oAC.queryDelay = 0.5;

    // The webservice needs custom parameters
    oAC.generateRequest = function(sQuery) {
        return "cat=city&val="+
            sQuery+"&format=json" ;
    };

    // Result data passed as object for easy access from custom formatter.
    oAC.resultTypeList = false;
    // Customize formatter to show thumbnail images
    oAC.formatResult = formatResult;
    oAC.animVert = false;
  
    oAC.charWidth = charWidth;
    oAC.minQueryLength = 3;
	
	oAC.wordLimit = wordLimit;
	oAC.wordErrorCallback = wordErrorCallback;
	oAC.getWords = RMScriptAutoComplete_getWords;
	oAC.doBeforeSendQuery = doBeforeSendQuery;

	//match the width of the container to the width of the input box
	oAC.doBeforeExpandContainer = function(oTextbox, oContainer, sQuery, aResults) {
		// set offset
		var pos = YAHOO.util.Dom.getXY(oTextbox);
		pos[1] += YAHOO.util.Dom.get(oTextbox).offsetHeight;
		YAHOO.util.Dom.setXY(oContainer, pos);
		// set width
		var w = YAHOO.util.Dom.getStyle(oTextbox, "width");
		YAHOO.util.Dom.setStyle(oContainer, "width", w);
		return true;
	};
	
		var myHandler = function(sType, aArgs) {
	    var myAC = aArgs[0]; // reference back to the AC instance
	    var elLI = aArgs[1]; // reference to the selected LI element
	    var oData = aArgs[2]; // object literal of selected item's result data
		var id = myAC._elTextbox.id;
	    id = id.substring(id.length -1);
	    var actName = oData.name;
	    if(null != oData.airportFullName && oData.airportFullName != ""){
	    	actName = (oData.name).substring(0,3);
	    }
	   
	    try{
	    	var addr = {countryCode:oData.country,
	    				municipality:oData.city,
	    				countrySubdivision:oData.state};
			if(id == "1"){
				document.getElementById("loc1text").value = actName;
				document.getElementById("loc1latlon").value= oData.lat+" "+oData.lng;	
				locationList[0] = addr;
			}else if(id == "2"){
				document.getElementById("loc2text").value = actName;
				document.getElementById("loc2latlon").value= oData.lat+" "+oData.lng;	
				locationList[1] = addr;
			}
	    }catch(ignored){}
	    myAC._elTextbox.value =actName ;
	};
	oAC.itemSelectEvent.subscribe(myHandler);
    // Stub for form validation
    var validateForm = function() {
        // Validation code goes here
        return true;
    };

    return {
        oDS: oDS,
        oAC: oAC,
        validateForm: validateForm
    }
	

};



function formatResult(oResultItem, sQuery) {
	var i = sQuery.indexOf("&");
	//alert(this.oDS.scriptQueryParam);
	
	var category="city";
	if(i > 0)
		sQuery = sQuery.substring(0, i);
	var sKey = oResultItem.name;
	//var start = sKey.toLowerCase().indexOf(trim(sQuery).toLowerCase());

	var words = [];
	
	//[]^*+()|\{}?.$
	var delimited = sQuery.replace(/(\[|\]|\^|\*|\+|\(|\)|\||\\|\{|\}|\?|\.|\$)/g, "\\$1");
	words = delimited.split(/(\s|,)+/);
	words.push(delimited.replace(/\t/, "\\t").replace(/\s/, "\\s"));

	sKeyOriginal = sKey;

	// trim result	
	var tolerance = 4;
	var maxWidth =this.charWidth - tolerance; 
	if (sKey.length > maxWidth) {	
		sKey = sKey.substring(0, maxWidth - 1) + '...';
	}
	
	var re = new RegExp("((" + words.join("|") + ")+)", "gi");
	var s = sKey.replace(re, "<span class='hinthighlight'>$1</span>");
	var icon = "<span class='hintpoi'>";
	
	if(oResultItem[1]){
		icon = "<span class='hintpoicategory'>";
	}
	if(category == "city"){
		icon = "<span class='hintlocation'>";
	}
	var dynamicID = Math.floor(Math.random() * 1000);
	var aMarkup = [
	    icon,
		"<span id='link_" + dynamicID + "' class='hintcat'>",
		s
		,"</span></span>"];
	
	// if text was truncated add tooltip
	if (sKey != sKeyOriginal) {
		var tt = new YAHOO.widget.Tooltip("tt_" + dynamicID, {
			context: "link_" + dynamicID,
			text: "<span class='hintexpand'>" + sKeyOriginal + "</span>",
			showdelay: 0,
			hidedelay: 0
		});
	}
	
	return (aMarkup.join(""));
}

function doBeforeSendQuery(sQuery) {
	if (!this.wordLimit) {
		return sQuery;
	}
	
	// Otherwise search string is limited -- respect the limit
	words = this.getWords( unescape(sQuery) );
	if (words.length > this.wordLimit) {
		this.wordErrorCallback(this.wordLimit);
		return escape(words.slice(0, this.wordLimit - 1).join(" "));
	}					
	return sQuery;
}

/**
 * Adds functionality to have leading and trailing whitespace removed
 */
function trim( value ) {
	var re = /\s*((\S.*\S)|(\S)|(\S\S))\s*/;
	return value.replace(re, "$1");
}

/**
 * The html element of the continer that holds the list of options
 */
RMScriptAutoComplete.prototype.container = null;

/**
 * the datasource url of the datasource
 */
RMScriptAutoComplete.prototype.datasource = null;

/**
 * The html element of the input box
 */
RMScriptAutoComplete.prototype.input = null;

/**
 * The data source object
 */
RMScriptAutoComplete.prototype.oDS = null;

/**
 * The AutoComplete Object
 */
RMScriptAutoComplete.prototype.oAC = null;

/**
 * gets the AutoComplete object
 * 
 * @return {YAHOO.widget.AutoComplete}
 */
function RMScriptAutoComplete_getAutoCompleteObject() {
	return this.oAC;
}

/**
 * gets the DataSource object
 * 
 * @return {YAHOO.widget.DS_XHR}
 */
function RMScriptAutoComplete_getDataSource() {
	return this.oDS;
}

/**
 * gets the container div
 * 
 * @return {HTMLElement}
 */
function RMScriptAutoComplete_getContainer() {
	return this.container;
}

/**
 * gets the input div
 * 
 * @return {HTMLElement}
 */
function RMScriptAutoComplete_getInput() {
	return this.input;
}


/**
 * Counts the words in string parameter input string where "word" is 
 * defined as group of characters containing neither whitespace nor comma
 *
 * @return {[Strings]}
 */
function RMScriptAutoComplete_getWords( wordString ) {
	// convert commas to spaces
	var cleanedString = wordString.replace(/\,/g, " ");

	// strip leading/trailing
	cleanedString = cleanedString.replace(/^\s+|\s+$/g, "");
	// remove duplicates		
	cleanedString = cleanedString.replace(/\s{2,}/g, " ");

	return cleanedString.split(" ");
}


