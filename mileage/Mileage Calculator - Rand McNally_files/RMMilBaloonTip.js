/*global RMMilBaloonTip_addDivContainer RMMilBaloonTip_setSize RMMilBaloonTip_show RMMilBaloonTip_hide */

/**
*@fileoverview	This file contains RMMilBaloonTip class and its derivation
*/

/**
 * RMMilBaloonTip is a flexible floating div element. This class is an abstract class
 * @class						
 *			
 * @return 	RMMilBaloonTip
 * @type		RMMilBaloonTip
 * @constructor
 */	

function RMMilBaloonTip(sPanel, left, top, sText){  

	this.addDivContainer = RMMilBaloonTip_addDivContainer;
	this.setSize = RMMilBaloonTip_setSize;
	this.show = RMMilBaloonTip_show;
	this.hide = RMMilBaloonTip_hide;

	var objPanel = RMUtils.getEl(sPanel);
	
	if (objPanel == null) {
		objPanel = RMUtils.createDOMElement("div", "html");
		objPanel.id = sPanel;
	}
	
	if(left)
	{
		YAHOO.util.Dom.setStyle(objPanel, 'left', parseInt(left, 10)+'px'); 
	}
	if(top)
	{
		YAHOO.util.Dom.setStyle(objPanel, 'top', parseInt(top, 10)+'px'); 
	}
//	if (width) {
//		YAHOO.util.Dom.setStyle(objPanel, 'width', parseInt(top)+'px'); 
//	}
//	if (height) {
//		YAHOO.util.Dom.setStyle(objPanel, 'height', parseInt(top)+'px'); 
//	}
	
	if (sText != null)
	{
		var sTextArea = sPanel+"_text";
		
		var objText = RMUtils.getEl(sTextArea);
		if(objText)
		{
			objText.innerHTML = sText; 
		}
	}

	this.container = objPanel;
	
	this.show();
	

}
	/**
	*Where the initialization occurs
	*@type		void
	*@return	void
	*@param	
	*@private
	*/	
	RMMilBaloonTip.prototype._init = function() {
	};	
	
	/**
	*Function to add a div container to the object
	*@type		void
	*@return	void
	*@param	{DOMElement}divElement	an HTML div container
	*/		
	function RMMilBaloonTip_addDivContainer(divElement){
	}
	
	/**
	*Function to set the size of the object
	*@type		void
	*@return	void
	*@param	{double}width	the width of the object
	*@param	{double}height	the height of the object
	*/	
	function RMMilBaloonTip_setSize(width, height){
	
	
	}

	/**
	*the left position of the element. 
	*@type	RMPosition
	*/	
	RMMilBaloonTip.prototype.horizontalPosition = null;
	/**
	*the top position of the element. 
	*@type	RMPosition
	*/		
	RMMilBaloonTip.prototype.verticalPosition = null;
	/**
	*the width of the element
	*@type	double
	*/		
	RMMilBaloonTip.prototype.width = null;
	/**
	*the height of the element
	*@type	RMPosition
	*/		
	RMMilBaloonTip.prototype.height = null;
	
	/**
	*the div element which contains the information to be displayed upon invokation of this object
	*@type	DOMElement
	*/		
	RMMilBaloonTip.prototype._divContainer = null;
	

    function RMMilBaloonTip_show()
    {
	    this.container.style.display = 'block';
    }
    
    function RMMilBaloonTip_hide()
    {    	
		this.container.style.display = 'none';
    }
    
	
/**
 * RMMilErrorWindow is a floating panel to display error message.
 * @class	
 *								
 * @return 	RMMilErrorWindow
 * @type		RMMilErrorWindow
 * @constructor
 * @extends RMMilBaloonTip
 */	

function RMMilErrorWindow(sPanel, left, top, sText){
    // msingh 21 Oct, 2008: top and left position og error wimdow is adjusted because of
    // the new error bubble graphics.
	top= top -10; 
	left = left - 10;
	RMMilErrorWindow.superclass.constructor.call(this, sPanel, left, top, sText);
	
}



	RMMilErrorWindow.prototype = new RMMilBaloonTip();
	RMMilErrorWindow.prototype.constructor = RMMilErrorWindow;
	/**
	*@private
	*/	
	RMMilErrorWindow.superclass = RMMilBaloonTip.prototype;	
	
	/**
	*Where the initialization occurs
	*@type		void
	*@return	void
	*@param	
	*@private
	*/		
	RMMilErrorWindow.prototype._init = function(){

	};



/**
 * Used in the balloon tip
 * @private
 */
function seeMore(mouseEvent)
{
	RMUtils.getEl('more').style.display = 'none';
	RMUtils.getEl('address_list').style.overflow = 'auto';
	
	//have to cancel the event otherwise the div will close.
	if (mouseEvent) {
		mouseEvent.cancelBubble = true;
	}
}