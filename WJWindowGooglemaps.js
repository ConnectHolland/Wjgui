
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
		this._addPushpinWindowConnector();
		this._addClassNames(kmlname, sitename);
		if (typeof(kmlname) != "undefined") {
			this.setTheme(kmlname);
		}
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
		this._pushpinwindowconnector = new Element("div", {"class": "pushpinwindowconnector", "style": "position: absolute;"});
		this.getWindowElement().insert(new Element("div", {"style": "position: relative; overflow: visible; height: 0px; width: 0px;"} ).insert(this._pushpinwindowconnector ) );

		var wasVisible = this.isVisible();
		var origX = this.getX();
		var origY = this.getY();
		if (!wasVisible) {
			this.setX(-10000);
			this.setY(-10000);
			this.show();
		}

		this._pushpinwindowconnectortop = parseInt(this._pushpinwindowconnector.getStyle("top") );
		this._pushpinwindowconnectorleft = parseInt(this._pushpinwindowconnector.getStyle("left") );

		if (!wasVisible) {
			this.hide();
			this.setX(origX);
			this.setY(origY);
		}
	},

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
	 * Tells the height of this window, including de hook
	 *
	 * @since Fri Jan 30 2009
	 * @access public
	 * @return integer
	 **/
	getFullHeight: function() {
		return this.getHeight() + (this._pushpinwindowconnector.getHeight() - this._pushpinwindowconnectortop);
	},

	/**
	 * positionRelativeToMarker
	 *
	 * Positions the window relative to the given marker
	 *
	 * @since Mon Feb 2 2009
	 * @access public
	 * @param GMarker marker
	 * @param GMap2 map
	 * @return GPoint
	 **/
	positionRelativeToMarker: function(marker, map) {
		this.marker = marker;
		var p = map.fromLatLngToDivPixel(this.marker.getLatLng() );
		var icon = this.marker.getIcon();
		var halfwidth = (this.getWidth() / 2);
		var offsety = (icon.iconAnchor.y - icon.infoWindowAnchor.y);

		p.y -= offsety;
		p.x -= (icon.iconAnchor.x - icon.infoWindowAnchor.x);
		p.y -= this.getFullHeight();
		p.x -= halfwidth;
		this.setX(p.x);
		this.setY(p.y);

		this._pushpinwindowconnector.setStyle( {"left": ( (halfwidth + this._pushpinwindowconnectorleft) - offsety) + "px" } );

		var newy = p.y + (this.getFullHeight() / 2);
		var newx = p.x + halfwidth;
		return new GPoint(newx, newy);
	}
});
