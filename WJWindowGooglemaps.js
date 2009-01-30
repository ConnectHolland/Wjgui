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
var WJWindowGooglemaps = Class.create(WJWindow, {
	/**
	 * initialize
	 *
	 * Creates a new WJWindowGooglemaps
	 *
	 * @since Fri Jan 30 2009
	 * @access public
	 * @param WJWindow toDecorate
	 * @return WJWindowAlert
	 **/
	initialize: function($super, toDecorate) {
		this._theme = "googlemaps";
		$super(toDecorate);
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
		return this.getHeight();
	}
});
