/**
 * WJWindowGooglemaps
 *
 * A class handling google maps info windows
 *
 * @since Fri Jan 30 2009
 * @revision $Revision$
 * @author Reyo Stallenberg
 * @package Windmill.Javascript.WJGui
 **/
var WJWindowGooglemaps = Class.create({
	/**
	 * initialize
	 *
	 * Creates a new instanceof WJWindowModal
	 *
	 * @since Fri Jul 4 2008
	 * @access public
	 * @param WJWindow wjwindow
	 * @return WJWindowModal
	 **/
	initialize: function(toDecorate, kmlname, sitename) {
		this._decorate(toDecorate);
		this._addClassNames(kmlname, sitename);
		if (typeof(kmlname) != "undefined") {
			this.setTheme(kmlname);
		}
		this._addPushpinWindowConnector();
		this._saveStyleSettings();
		this.removeListener("true");
	},

	/**
	 * addPushpinWindowConnector
	 *
	 * Adds a wrapper for the connector between the pushpin and the infowindow
	 *
	 * @since Mon Feb 2 2009
	 * @access protected
	 * @return void
	 **/
	_addPushpinWindowConnector: function() {
		this._pushpinwindowconnector = new Element("div", {"style": "position: absolute;"});
		this._pushpinwindowconnector.addClassName("pushpinwindowconnector");
		this.getWindowElement().insert(new Element("div", {"style": "position: relative; overflow: visible; height: 0px; width: 0px;"} ).insert(this._pushpinwindowconnector ) );
	},

	/**
	 * getPushpinWindowConnectorElement
	 *
	 * Gets the pushpinwindowconnector element
	 *
	 * @since Wed Feb 18 2009
	 * @access public
	 * @return DomNode
	 **/
	getPushpinWindowConnectorElement: function() {
		return this._pushpinwindowconnector;
	},

	/**
	 * _saveStyleSettings
	 *
	 * Saves some settings from the style
	 *
	 * @since Wed Feb 18 2009
	 * @access protected
	 * @return void
	 **/
	_saveStyleSettings: function() {
		var wasVisible = this.isVisible();
		var origX = this.getX();
		var origY = this.getY();
		if (!wasVisible) {
			this.setX(-10000);
			this.setY(-10000);
			this.show();
		}
		
		this._stylesettings = new Hash();
		var top = (this._pushpinwindowconnector.getStyle("top") != null) ? parseInt(this._pushpinwindowconnector.getStyle("top") ) : 0;
		this._stylesettings.set("pushpinwindowconnector-top", top);
		
		var left = (this._pushpinwindowconnector.getStyle("left") != null) ? parseInt(this._pushpinwindowconnector.getStyle("left") ) : 0;
		this._stylesettings.set("pushpinwindowconnector-left", left);
		
		this._stylesettings.set("pushpinwindowconnector-height", this._pushpinwindowconnector.getHeight() );
		
		if (!wasVisible) {
			this.hide();
			this.setX(origX);
			this.setY(origY);
		}
	},

	/**
	 * getStyleSetting
	 *
	 * Returns a saved style setting
	 *
	 * @since Wed Feb 18 2009
	 * @access
	 * @param
	 * @return mixed
	 **/
	getStyleSetting: function(setting) {
		return this._stylesettings.get(setting);
	},

	/**
	 * _addClassNames
	 *
	 * Adds classnames to the window element
	 *
	 * @since Mon Feb 02 2009
	 * @access protected
	 * @param string kmlname
	 * @param string sitename
	 * @return void
	 **/
	_addClassNames: function(kmlname, sitename) {
		var classname = this._getBaseClassname() + "_googlemaps";
		var element = this.getWindowElement()
		element.addClassName(classname);
		if (typeof(sitename) != "undefined") {
			element.addClassName(classname + "_" + sitename);
		}
	},

	/**
	 * _decorate
	 *
	 * Decorates the given object
	 *
	 * @since Fri Jan 30 2009
	 * @access protected
	 * @param WJWindow toDecorate
	 * @return void
	 **/
	_decorate: function(toDecorate) {
		this._decorated = toDecorate;

		for (property in this._decorated) {
			// Add all methods not defined in this
			if (!Object.isFunction(this[property]) ) {
				this[property] = this._decorated[property];
			}
		}
	},

	/**
	 * fireClose
	 *
	 * Fires the close event from the given element
	 *
	 * @since Fri Jan 30 2009
	 * @access public
	 * @param Element element
	 * @return void
	 **/
	fireClose: function(element) {
		this.hide();
	},

	/**
	 * getHeight
	 *
	 * Tells the height of this window, including the pushpinwindowconnector
	 *
	 * @since Fri Jan 30 2009
	 * @access public
	 * @return integer
	 **/
	getFullHeight: function() {
		return this.getHeight() + (this._stylesettings.get("pushpinwindowconnector-height") + this._stylesettings.get("pushpinwindowconnector-top"));
	}
});
