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
	 * A method that updates the caption content of 
	 *
	 * @since Thu Jul 10 2008
	 * @access 
	 * @param 
	 * @return 
	 **/
	updateCaption: function(caption) {
		this._caption = caption.stripTags().stripScripts().split("\n").join("<br/>");
		this.getButton().getElementsByClassName(this._getBaseClassName() + "_content")[0].innerHTML = this._caption;
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
				var func = function(event, eventHandler) {
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
		this._buttonElement = document.createElement("button");
		var template = this._getTemplate();
		var replaces = {};
		replaces.classprefix = this._getBaseClassName();
		replaces.caption = this._caption;
		
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
		return new Template("<div class='#{classprefix}_left #{classprefix}_column'><div class='#{classprefix}_right #{classprefix}_column'><div class='#{classprefix}_center #{classprefix}_column'><div class='#{classprefix}_content'>#{caption}</div></div></div></div>");
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
		Event.observe(this.getButton(), "click", this._eventHandler);
	}
});

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