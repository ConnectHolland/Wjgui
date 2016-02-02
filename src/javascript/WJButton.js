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
		this._log('INFO', "Create new button", caption, eventHandler, defaultButton, parentElement);
		this._caption = caption;
		this._eventHandler = eventHandler;
		this._defaultButton = (defaultButton === true) ? true : false;
		this._parentElement = $(parentElement);

		this._buildEventHandler();
		this._createButton();
		this._addButtonMethods();
		this._addObserver();

		if (Object.isElement(this._parentElement) ) {
			this._parentElement.appendChild(this.getButton() );
		}
		this.updateCaption(this._caption);
	},

	/**
	 * _addButtonMethods
	 *
	 * Adds methods to the element to easy update the caption and enable or disable the button
	 *
	 * @since Thu Jul 10 2008
	 * @access protected
	 * @return void
	 **/
	_addButtonMethods: function() {
		this.getButton().updateCaption = this.updateCaption.bind(this);
		this.getButton().setCaption = this.getButton().updateCaption;
		this.getButton().getCaption = this.getCaption.bind(this);
		this.getButton().enable = this.enable.bind(this);
		this.getButton().disable = this.disable.bind(this);
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
		return this._setCaption.bind(this).defer();
	},

	/**
	 * setCaption
	 *
	 * Changes the caption of this button
	 *
	 * @since Mon Feb 16 2009
	 * @access public
	 * @param string caption
	 * @return Element
	 **/
	setCaption: function(caption) {
		this.updateCaption(caption);
	},

	/**
	 * _setCaption
	 *
	 * Performs the real setting of the caption (it used to be called with a defer from initialize, now it's deferred always (@see updateCaption), to avoid it being updated later by old calls)
	 *
	 * @since Fri Feb 13 2009
	 * @access protected
	 * @return void
	 **/
	_setCaption: function() {
		var contentElement = this.getContentElement();
		contentElement.update(this._caption);
		this.setWidth(this._getNewButtonWidth(this._caption, contentElement) );
		return this.getButton();
	},

	/**
	 * enable
	 *
	 * Enables the button
	 *
	 * @since Mon Nov 10 2008
	 * @access public
	 * @return this
	 **/
	enable: function() {
		this.getButton().removeAttribute("disabled");
		this.getButton().removeClassName("wjgui_button_disabled");
		return this;
	},

	/**
	 * disable
	 *
	 * Disables the button
	 *
	 * @since Mon Nov 10 2008
	 * @access public
	 * @return this
	 **/
	disable: function() {
		this.getButton().disabled = "disabled";
		this.getButton().addClassName("wjgui_button_disabled");
		return this;
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
		return this.getButton().down("." + this._getBaseClassName() + "_content");
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
		var fontfamily = element.getStyle("fontFamily");
		var fontsize = element.getStyle("fontSize");
		var fontweight = element.getStyle("fontWeight");
		WJButton.measureElement.setStyle({"fontFamily": fontfamily, "fontSize": "1em", "fontWeight": fontweight, "whiteSpace": "nowrap" } ).update(text);
		element.appendChild(WJButton.measureElement);
		var width = WJButton.measureElement.getWidth();
		WJButton.measureElement.remove();
		width += this.getWidth() - element.getWidth();
		return (width > 100 || this.getButton().up("div.autowidth", 0) ) ? width : 100;
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
				this._log('INFO', "Build event handler for this, create event " + this._eventHandler);
				var func = function(event, eventHandler, wjbutton) {
					wjbutton._log('INFO', "Fire event in WJButton", event, eventHandler);
					Event.element(event).fire(eventHandler);
				}.bindAsEventListener(this.getButton(), this._eventHandler, this);
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
		return "wjgui";
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

		this._buttonElement.addClassName(replaces.classprefix + " " + replaces.classprefix + "_" + ((this._defaultButton) ? "" : "no") + "default");

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
		return "wjgui_button";
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
		this._log('INFO', "_addObserver in WJButton", this._eventHandler);
		this._log('DEBUG', "WJButton observer code", this._eventHandler.toString() );
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
	},

	/**
	 * getCaption
	 *
	 * Returns the value of teh caption
	 *
	 * @since Tue Feb 10 2009
	 * @access public
	 * @return string
	 **/
	getCaption: function() {
		return this._caption;
	},

	/**
	 * recalculateWidth
	 *
	 * Recalculates the width by updating the caption with the current caption
	 *
	 * @since Tue Feb 10 2009
	 * @access public
	 * @return void
	 **/
	recalculateWidth: function() {
		this.updateCaption(this.getCaption() );
	},


	/**
	 * Log to WJDebugger when available
	 */
	_log: function(level) {
		if (typeof WJDebugger == "undefined") {
			return;
		}

		arguments[0] = WJDebugger[level];
		return WJDebugger.log.apply(this, arguments);
	}
});

/**
 * an element to measure string length in context
 *
 * @since Tue Aug 19 2008
 * @access public
 **/
WJButton.measureElement = new Element("div", {"style": "position: absolute; left: -5000px;"});

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

/**
 * toWJButtonStyle
 *
 * Styles a given button as a WJButton (NOTE: does not create a WJButton instance and does not attach methods and so on)
 *
 * @since Fri Mar 20 2009
 * @access public
 * @param Element element
 * @param boolean defaultButton
 * @return Element
 **/
WJButton.toWJButtonStyle = function(element, defaultButton) {
	if (element.tagName.toLowerCase() == "button") {
		var element = $(element);
		var caption = element.getTextContent();
		var template = WJButton.prototype._getTemplate();
		var replaces = {classprefix: WJButton.prototype._getBaseClassName()};

		element.className = replaces.classprefix + " " + replaces.classprefix + "_" + ((defaultButton) ? "" : "no") + "default";
		element.update(template.evaluate(replaces) );
		element.down("." + replaces.classprefix + "_content").update(caption);
	}
	return element;
}


