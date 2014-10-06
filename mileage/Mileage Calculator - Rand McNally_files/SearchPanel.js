/**
 * @class SearchPanel.js
 * @description
 * Provides an iterface to perform searches, and to view results
 */

deCarta.App.UI.SearchPanel = {

    pins: [],	
    resultPins: [],

    /**
     * Attaches event handlers, initializes result panels etc
     */
    initialize: function(){
        //Event handlers
//        $('#locateButton').click(this.addressSearch.scope(this));
//        $('#btn_search_address').click(this.addressSearch.scope(this));
//        $('#btn_search_business').click(this.freeSearch.scope(this));
//        $('#categorySelect').change(this.categorySearch.scope(this));

    },

    /**
     * Renders the results of a search
     */
    renderResult: function(pois, sortMethod){
        
        var where = '#business_search_results';
        deCarta.App.UI.tabs.tabs('select', 1);
        deCarta.App.UI.enableSearches();
        for (var i = 0; i < this.resultPins.length; i++){
            var pin = this.resultPins[i];
            try {
                deCarta.App.map.removePin(pin);
            } catch (e) {
            //deCarta.App.Log('Error removing pin ' + e.message);
            }
        }

        if (!pois){
            $(where).html(deCarta.App.Localizer.get('txt_no_results'));
            deCarta.App.UI.enableSearches();
            return;
        }

        if (!sortMethod) {
            sortMethod = 'distance';
            if (!deCarta.App.UserPreferences.searchSortCriteria) sortMethod = 'score';
        }
        deCarta.App.Util.sortPois(pois, sortMethod);

        this.pois = pois;
        
        $(where).html(deCarta.App.Localizer.get('txt_items_found',[pois.length]));
        $(where).append("<p>" + deCarta.App.Localizer.get('txt_sort_by') +
            ": <a class='sort_link' method='name' href='javascript:void(0)'>" +deCarta.App.Localizer.get('lbl_sort_name') +
            "</a> <a class='sort_link' method='distance' href='javascript:void(0)'>" + deCarta.App.Localizer.get('lbl_sort_distance') +
            "</a> <a class='sort_link' method='score' href='javascript:void(0)'>" + deCarta.App.Localizer.get('lbl_sort_score') +
            "</a> <p>");

        $(".sort_link").click(function(){           
            deCarta.App.UI.SearchPanel.renderResult(pois, $(this).attr('method'));
        });

        $(".sort_link").each(function(){
            if($(this).attr("method") == sortMethod){
                $(this).css("border","2px solid #eee");
            }
        });

        var panelMessage = "";
        for (i=0; i < pois.length; i++){

            if(typeof pois[i].properties.ID == "number"){
                pois[i].properties.ID=""+pois[i].properties.ID;
            }
            if(!pois[i].properties.ID){
                pois[i].properties.ID=""+(parseInt(Math.random()*100000));
            }

            var id = pois[i].properties.ID.replace(/:/g,"-")
            // panel message

            var adr = deCarta.App.Util.formatFreeformAddress(pois[i].address,"");

            //find the categories
            var cats = [];
            for (var n = 0; n < 10; n ++){
                if (pois[i].properties['category-'+n]){
                    cats.push(pois[i].properties['category-'+n]);
                }
            }

            var pinIcon = deCarta.App.IconFinder.findIcon(cats);

            panelMessage += "<div class='search_result_box clickable' id='"+id+"'>"+
            "<img id='"+id+"_img' src='"+pinIcon.src+"'/><span class='search_result_name'>"+pois[i].name+"</span>"+
            "<br />"+adr+""+
            "<br />" + deCarta.App.Localizer.get('txt_poi_distance', [(pois[i].distance.value / 1000).toFixed(3)]) +
            + " " + pois[i].distance.uom.value +
            deCarta.App.Util.formatPhone(pois[i].properties.phone_num) +
            "</div>";

            // bubble message

            var bubbleMessage = "<div>" +
            "<span class='search_result_name'>" + pois[i].name + "</span>" +
            "<br/>" + adr + "" +
            deCarta.App.Util.formatPhone(pois[i].properties.phone_num) +
            "<br /><br /><div style=\"float: left\">" + deCarta.App.Localizer.get('iw_get_directions') + "</div><div style=\'float:right\'><a class=\"bubble_directions_link\" id='pin_share' href='javascript:void(0)'>" + deCarta.App.Localizer.get('iw_share') + "</a></div>" +
            "<br /><a class=\"bubble_directions_link\" id='pin_to_here' href='javascript:void(0)'>" + deCarta.App.Localizer.get('iw_directions_to') + "</a>"+
            "<br /><a class=\"bubble_directions_link\" id='pin_from_here' href='javascript:void(0)'>" + deCarta.App.Localizer.get('iw_directions_from') + "</a>" +
            "</div>";
            
            var pin = new Pin(pois[i].position,bubbleMessage,"click",pinIcon);
//            pin.animateDrop = true;
            pin.animate( "DROP", "FAST", true );
            pin.poi = pois[i];
            
            this.resultPins.push(pin);

            EventRegistry.addListener(pin, "click", function(p){
                deCarta.App.UI.tabs.tabs("select", 1);
                deCarta.App.Util.selectPin(p.getId(), where);
            }.scope(this));
            pin.setId(id);
            deCarta.App.map.addPin(pin);
            
        }
        
        $(where).append(panelMessage);
        $(where).show();

        $(".search_result_box").click(function(){
            deCarta.App.Util.selectPin($(this).attr("id"))
            return false;
        });
        $(".review_link").click(function(){
            ReviewsPanel.render($(this).parent().html(), $(this).attr("poi_id").replace(/-/g,":"))
            return true;
        });
    },

    renderAddressResult: function(results){

        this.clearResults();

//        deCarta.App.UI.tabs.tabs('select', 0);

        if (results.length == 0){
			if (!waypointPanel)
				this._messageBox(RMResources.GEOCODE_ADDRESS_NOT_FOUND);
            deCarta.App.UI.enableSearches();
            return;
        }

        $('#address_search_results').progressOn();

        var pos = results.position;

        var addr = results.address;

        var msg = "";
        var msgShort = "";

        var src = "img/red_circle.png";

        var container = $(document.createElement('div'));
        container.addClass('')

        for (var i = 0; i < pos.length; i++){

            var addressContainer = $(document.createElement('div'));
            addressContainer.addClass('addressResult clickable');

            msg = deCarta.App.Util.formatFreeformAddress(addr[i],", ", "<br />");
            msgShort = deCarta.App.Util.formatShortFreeformAddress(addr[i]);
            var elem = $(document.createElement('div'));

            elem.addClass('geocode_takemeto_item_long');
            elem.attr('id', 'geocode_takemeto_item_' + i );
            elem.html(msg);
            addressContainer.append('<img src="img/red_pin.png" alt="pin" align="left"/>');
            addressContainer.append(elem);

            container.append(addressContainer);
        }

        $('#address_search_results').html(container);

        $(".geocode_takemeto_item_long").click(function(){

            var itemId = $(this).attr("id");
            var itemSeq = parseInt(itemId.substring("geocode_takemeto_item_".length));
            var position = pos[itemSeq];
            deCarta.App.map.panToPosition(position, function(p){
                for(var x in this.pins){
                    if(this.pins.hasOwnProperty(x))
                        deCarta.App.map.removePin(this.pins[x]);
                }
                this.pins = [];
                var pin = deCarta.App.Util.renderPin(p);
                this.pins.push(pin);
            }.scope(this));
        })


        deCarta.App.map.panToPosition(pos[0], function(p){

            for(var x in this.pins){
                if(this.pins.hasOwnProperty(x))
                    deCarta.App.map.removePin(this.pins[x]);
                deCarta.App.map.getInfoWindow().hide();
            }
            this.pins = [];
            var pin = deCarta.App.Util.renderPin(p);
            this.pins.push(pin);
        }.scope(this));


        deCarta.App.UI.enableSearches();
    },

    clearResults: function(){
        $('#address_search_results').html("\
				<p style='font-size:17px;font-weight:bold;font-family:arial;' class='localizable' id='txt_welcome_title'>" +
            deCarta.App.Localizer.get('txt_welcome_title') + "</p>\
				<p class='localizable' id='txt_welcome_text_business'>" + deCarta.App.Localizer.get('txt_welcome_text_address') + "</p>"
            );
    },

    /**
     * Event handler for the address search form
     */
    addressSearch: function(){

        deCarta.App.UI.disableSearches();
        /*deCarta.App.UI.wipeMap();
        deCarta.App.UI.SearchPanel.resetPoiSearch();
        deCarta.App.UI.DirectionsPanel.reset();*/

        var term = $('#txtPlaceAddress').val();
//        var mapLocale = $('#mapLocale').val();

        if (!term || term == ''){
            deCarta.App.UI.MessageBox.show('Please enter an address to search for.', 'Whoops :');
            deCarta.App.UI.enableSearches();
        } else {
            $('#address_search_results').progressOn();
//            deCarta.App.search.Address( term, this.renderAddressResult.scope(this), mapLocale );
            deCarta.App.search.Address( term, this.renderAddressResult.scope(this), null );
        }
    },

    /**
     * Event handler for the freeform search
     */
    freeSearch: function(){        
        deCarta.App.UI.disableSearches();
        deCarta.App.UI.DirectionsPanel.clearPoiList();
        /* deCarta.App.UI.wipeMap();
        deCarta.App.UI.SearchPanel.resetAddress();
        deCarta.App.UI.DirectionsPanel.reset();*/

        var term = $('#businessSearchText').val();

        if (!term || term == ''){
            deCarta.App.UI.MessageBox.show('Please enter a search term.', 'Whoops :');
            deCarta.App.UI.enableSearches();
        } else {
            $('#business_search_results').progressOn();
            deCarta.App.search.Business(term, this.renderResult.scope(this));
        }
    },

    /**
     * Event handler for the category search
     */
    categorySearch: function(){
        
        deCarta.App.UI.disableSearches();
        deCarta.App.UI.DirectionsPanel.clearPoiList();
        /* deCarta.App.UI.wipeMap();
        deCarta.App.UI.SearchPanel.resetAddress();
        deCarta.App.UI.DirectionsPanel.reset();*/

        var term = $('#categorySelect').val();

        if (!term || term == '' || term == 'none'){
            deCarta.App.UI.MessageBox.show('Please select a category to search for POIs.', 'Whoops :');
            deCarta.App.UI.enableSearches();
        } else {
            $('#business_search_results').progressOn();
            deCarta.App.search.Category(term, this.renderResult.scope(this));
        }
    },

    reset: function(){        
        try {
            this.resetAddress();
            this.resetPoiSearch();
        } catch (e) {
            console.log('oops', e);
        }
    },

    resetAddress: function(){
        try {
            $("#txtPlaceAddress").val("");
            $("#address_search_results").empty();
            deCarta.App.UI.SearchPanel.clearPins();
        } catch (e) {
            deCarta.App.Log('Error in SearchPanel.resetAddress : ' + escape(e));
        }
    },

    resetPoiSearch: function(){
        $("#businessSearchText").val("");
        $("#business_search_results").empty();
        //console.log('Reset the value');
        /*$("#categorySelect").val('none');
        $("#categorySelect").val(0);*/
        deCarta.App.UI.SearchPanel.clearPins();
        deCarta.App.search.lastSearch = null;
    },

    clearPins: function(){

        for(var x in this.resultPins){
            if(this.resultPins.hasOwnProperty(x))
                deCarta.App.map.removePin(this.resultPins[x]);
        }
    }

}
