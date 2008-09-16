/**
 * WJButton
 *
 * A class handling the creation of buttons
 *
 * @since Wed Jul 09 2008
 * @revision $Revision$
 * @author Giso Stallenberg
 * @package Windmill.Javascript.Aeroplane
 **/
var WJButton = Class.create({
	/**
	 * initialize
	 *
	 * Creates a new WJButton
	 *
	 * @since Wed Jul 9 2008
	 * @access public
	 * @param string caption
	 * @param Function|string event
	 * @param string type
	 * @return WJButton
	 **/
	initialize: function(caption, eventHandler, defaultButton, parentElement) {
		WJDebugger.log(WJDebugger.INFO, "Create new button", caption, eventHandler, defaultButton, parentElement);
		this._caption = caption;
		this._eventHandler = eventHandler;
		this._defaultButton = (defaultButton === true) ? true : false;
		this._parentElement = $(parentElement);
		
		this._buildEventHandler();
		this._createButton();
		this._addCaptionMethod();
		this._addObserver();
		
		if (Object.isElement(this._parentElement) ) {
			this._parentElement.appendChild(this.getButton() );
		}
		this.updateCaption.bind(this).defer(this._caption);
	},

	/**
	 * _addCaptionMethod
	 *
	 * Adds a method to the element to easy update the caption
	 *
	 * @since Thu Jul 10 2008
	 * @access protected
	 * @return void
	 **/
	_addCaptionMethod: function() {
		this.getButton().updateCaption = this.updateCaption.bind(this);
	},

	/**
	 * updateCaption
	 *
	 * A method that updates the caption content of the button (and resizes the button if needed)
	 *
	 * @since Thu Jul 10 2008
	 * @access public
	 * @param string caption
	 * @return Element
	 **/
	updateCaption: function(caption) {
		this._caption = caption.stripTags().stripScripts();
		var contentElement = this.getContentElement();
		contentElement.update(this._caption);
		this.setWidth(this._getNewButtonWidth(this._caption, contentElement) );
		return this.getButton();
	},

	/**
	 * getContentElement
	 *
	 * Returns the container of the content
	 *
	 * @since Tue Aug 19 2008
	 * @access public
	 * @return Element
	 **/
	getContentElement: function() {
		return this.getButton().getElementsByClassName(this._getBaseClassName() + "_content")[0];
	},

	/**
	 * getNewButtonWidth
	 *
	 * Returns the width needed to fit the content on the button
	 *
	 * @since Tue Aug 19 2008
	 * @access protected
	 * @param string text
	 * @param Element element
	 * @return integer
	 **/
	_getNewButtonWidth: function(text, element) {
		var fontfamily = element.getStyle("font-family");
		var fontsize = element.getStyle("font-size");
		WJButton.measureElement.setStyle({"font-family": fontfamily, "font-size": fontsize}).update(text);
		var width = document.body.appendChild(WJButton.measureElement).getWidth();
		WJButton.measureElement.remove();
		width += this.getWidth() - element.getWidth();
		return (width > 100) ? width : 100;
	},

	/**
	 * getWidth
	 *
	 * Tells the width of the button
	 *
	 * @since Mon Aug 18 2008
	 * @access public
	 * @return integer
	 **/
	getWidth: function() {
		return this.getButton().getWidth();
	},

	/**
	 * setWidth
	 *
	 * Sets the width of the button
	 *
	 * @since Mon Aug 18 2008
	 * @access public
	 * @param integer width
	 * @return void
	 **/
	setWidth: function(width) {
		this.getButton().setStyle({"width": width + "px"});
	},
	
	/**
	 * _buildEventHandler
	 *
	 * Creates a function to use as click event handler
	 *
	 * @since Wed Jul 9 2008
	 * @access protected
	 * @return void
	 **/
	_buildEventHandler: function() {
		if (!Object.isFunction(this._eventHandler) ) {
			if (this._eventHandler.indexOf(":") == -1) {
				this._eventHandler = this._getEventPrefix() + ":" + this._eventHandler;
				WJDebugger.log(WJDebugger.INFO, "Build event handler for this, create event " + this._eventHandler);
				var func = function(event, eventHandler) {
					WJDebugger.log(WJDebugger.INFO, "Fire event in WJButton", event, eventHandler);
					Event.element(event).fire(eventHandler);
				}.bindAsEventListener(this.getButton(), this._eventHandler);
				this._eventHandler = func;
			}
		}
	},
	
	/**
	 * _getEventPrefix
	 *
	 * Returns the namespacing prefix for the event to fire
	 *
	 * @since Wed Jul 9 2008
	 * @access protected
	 * @return string
	 **/
	_getEventPrefix: function() {
		return "aeroplane";
	},
	
	/**
	 * _createButton
	 *
	 * Creates the button element
	 *
	 * @since Wed Jul 9 2008
	 * @access protected
	 * @return void
	 **/
	_createButton: function() {
		this._buttonElement = new Element("button");
		var template = this._getTemplate();
		var replaces = {};
		replaces.classprefix = this._getBaseClassName();
		
		this._buttonElement.className = replaces.classprefix + " " + replaces.classprefix + "_" + ((this._defaultButton) ? "" : "no") + "default";
		
		this._buttonElement.innerHTML = template.evaluate(replaces);
	},

	/**
	 * _getBaseClassName
	 *
	 * Returns the base className for buttons
	 *
	 * @since Wed Jul 9 2008
	 * @access protected
	 * @return string
	 **/
	_getBaseClassName: function() {
		return "aeroplane_button";
	},

	/**
	 * _getTemplate
	 *
	 * Returns a template element on which the button innerHTML is based
	 *
	 * @since Wed Jul 9 2008
	 * @access protected
	 * @return Template
	 **/
	_getTemplate: function() {
		return new Template("<div class='#{classprefix}_left #{classprefix}_column'><div class='#{classprefix}_right #{classprefix}_column'><div class='#{classprefix}_center #{classprefix}_column'><div class='#{classprefix}_content'>&#160;</div></div></div></div>");
	},

	/**
	 * getButton
	 *
	 * Returns the created button
	 *
	 * @since Wed Jul 9 2008
	 * @access public
	 * @return DOMElement
	 **/
	getButton: function() {
		return this._buttonElement;
	},
	
	/**
	 * _addObserver
	 *
	 * Adds an observer function to the button's click event
	 *
	 * @since Wed Jul 9 2008
	 * @access protected
	 * @return void
	 **/
	_addObserver: function() {
		WJDebugger.log(WJDebugger.INFO, "_addObserver in WJButton", this._eventHandler);
		WJDebugger.log(WJDebugger.DEBUG, "WJButton observer code", this._eventHandler.toString() );
		Event.observe(this.getButton(), "click", this._eventHandler);
	},

	/**
	 * setObserver
	 *
	 * Sets the current click observer for this button to eventHandler
	 *
	 * @since Tue Sep 16 2008
	 * @access public
	 * @param function eventHandler
	 * @return void
	 **/
	setObserver: function(eventHandler) {
		Event.stopObserving(this.getButton(), "click", this._eventHandler);
		this._eventHandler = eventHandler;
		this._addObserver();
	}
});

/**
 * an element to measure string length in context
 *
 * @since Tue Aug 19 2008
 * @access public
 **/
WJButton.measureElement = new Element("div", {"style": "position: absolute; float: left; visibility: hidden;"});

/**
 * create
 *
 * Static method to create a single button
 *
 * @since Wed Jul 9 2008
 * @access public
 * @param string caption
 * @param Function|string eventHandler
 * @param boolean defaultButton
 * @param DOMElement element
 * @return DOMElement
 **/
WJButton.create = function(caption, eventHandler, defaultButton, parentElement) {
	var button = new WJButton(caption, eventHandler, defaultButton, parentElement);
	return button.getButton();
}
