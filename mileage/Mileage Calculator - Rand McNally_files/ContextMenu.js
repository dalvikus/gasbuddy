/**
 * @class ContextMenu.js
 * @fileoverview  Implementation of right-click context menu on the map.
 * @description   Implementation of right-click context menu on the map.
 */
deCarta.App.UI.ContextMenu = {

    menu: null,

    /*
    * Renders the context menu.
    * @param p posAdding Items to the Context MEnuition
    */
    render: function (p) {

        /* Ensure we have an element to write to */
        if ($("#context_menu").size() == 0) {
            var frame = document.createElement("div");
            deCarta.App.map.getTileDiv().appendChild(frame);
            frame.id = "context_menu";
            deCarta.App.UI.ContextMenu.menu = frame;
        }

        /* Clear the menu and start over. */
        $("#context_menu").empty();

        /* Create the new elements and get handles to them */
        var fromHere = this.addElement(deCarta.App.Localizer.get("lbl_directions_from"));        
        var toHere = this.addElement(deCarta.App.Localizer.get("lbl_directions_to"));

        this.addSeparator();

        var centerMap = this.addElement(deCarta.App.Localizer.get("lbl_center_map"));


        this.addSeparator();

        var exit = this.addElement(deCarta.App.Localizer.get("lbl_close_menu"));


        /**
        This handles a click OUTSIDE the context menu.
        Binds itself to the document. When you click ANYWHERE it will be invoked.
        It will look through all the ancestors of the element you clicked
        and if the context menu is NOT one of them, it will close the menu.
        */
        var documentClick = function(ev){
            
			
            var parents = $(ev.originalTarget).parents();
            for (var i = 0; i < parents.length; i++){
                if (parents[i].id == 'context_menu'){
                    return;
                }
            }

            $(document).unbind('click', documentClick);
            deCarta.App.UI.ContextMenu.hide();
			
        }

        /* This is not premium.
           The problem is that when you bind the click event to the document,
           the first event you receive is the click that caused you to open the
           context menu in the first place. This obviosuly will NOT be on the
           context menu, so it will cause it to close. That is a very short lifespan.

           Since the event is triggered by the event registry, there really is no
           way to cancel the bubbling of it. The only solution is to have the browser
           wait a little before binding, so that the event does all its bubbling
           and gets out of the way.
        */
        setTimeout(function () {
            $(document).bind('click', documentClick)
        }, 150);


        /*
         * In the following section, actions are bound to the various elements
         * we created.
         */
        centerMap.onclick = function() {
            deCarta.App.map.panToPosition(p);
            deCarta.App.UI.ContextMenu.hide();
        }

        /* Set up directions */
        fromHere.onclick = function() {
            //deCarta.App.UI.DirectionsPanel.setStart(p, true);
            //deCarta.App.UI.DirectionsPanel.getDirections();
            deCarta.App.UI.ContextMenu.hide();
        }

        toHere.onclick = function() {
        	//deCarta.App.UI.DirectionsPanel.setEnd(p, true);
        	//deCarta.App.UI.DirectionsPanel.getDirections();
            deCarta.App.UI.ContextMenu.hide();
        }

        exit.onclick = function() {
            $(document).unbind('click', documentClick);
            deCarta.App.UI.ContextMenu.hide();
        }

        $("#context_menu").mouseover(function () {
            return false;
        });

        var pix = deCarta.App.map.positionToMapLayerPixel(p);
        $("#context_menu").css("top", pix.y - 5 + "px");
        $("#context_menu").css("left", pix.x - 5 + "px");
        $("#context_menu").css("display", "block");

    },

    /**
     * Hide the context menu.
     */
    hide: function () {

        $("#context_menu").css("display", "none");
        $("#context_menu").empty();
    },

    /*
     * Add a menu element
     * @param title the text of the lement
     * @return the created element.
     */
    addElement: function (title) {

        var el = document.createElement("div");
        el.innerHTML = title;
        $(el).addClass("menuItem");
        $(el).mouseover(function () {
            $(this).addClass("on");
            $(this).removeClass("off");
        });

        $(el).mouseout(function () {
            $(this).addClass("off");
            $(this).removeClass("on");
        });

        $("#context_menu").append(el);

        return el;
    },

    /**
     * Adds a separator.
     */
    addSeparator: function (){
        var el = document.createElement("div");
        $(el).addClass("separator");
        $("#context_menu").append(el);
        return el;
    }


}
