/**
 * WJWindowModal
 *
 * The base class to decorate a window with modal properties
 *
 * @since Fri Jun 27 2008
 * @revision $Revision$
 * @author Giso Stallenberg
 * @package Windmill.Javascript.Aeroplane
 **/
var WJWindowModal = Class.create({
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
	initialize: function(toDecorate) {
		this._decorate(toDecorate);
		this._createModalLayer();
		this._maxblink = 6;
		this._addBlinkListener();
		this._rebindListeners();
		this.setZ(2147483647);
		this.show(); // Remove this
	},

	/**
	 * _decorate
	 *
	 * Decorates the given object
	 *
	 * @since Tue Jul 8 2008
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
	 * _rebindListeners
	 *
	 * Stops the listeners observing and rebinds 'this' to the listeners
	 *
	 * @since Mon Jul 7 2008
	 * @access protected
	 * @return void
	 **/
	_rebindListeners: function() {
		this.removeListeners();
		this._addDefaultListeners();
	},

	/**
	 * _createModalLayer
	 *
	 * Creates a layer to simulate modality
	 *
	 * @since Mon Jul 7 2008
	 * @access protected
	 * @return void
	 **/
	_createModalLayer: function() {
		var windowElement = this._decorated.getWindowElement();
		
		this._modalLayer = new WJModalLayer();
		this._modalLayer.getLayer().insert(windowElement);
		this._outerElement = this._modalLayer.getLayer();
	},

	/**
	 * show
	 *
	 * Shows the window
	 *
	 * @since Mon Jul 7 2008
	 * @access public
	 * @return void
	 **/
	show: function(element) {
		var element = element || this._outerElement || this._modalLayer.getLayer();
		element.style.display = "block";
		this._setBodyOverflow("hidden");
		this._decorated.show();
	},

	/**
	 * hide
	 *
	 * Hides the window
	 *
	 * @since Mon Jul 7 2008
	 * @access public
	 * @return void
	 **/
	hide: function(element) {
		var element = element || this._outerElement || this._modalLayer.getLayer();
		element.style.display = "none";
		this._setBodyOverflow();
		this._decorated.hide();
	},

	/**
	 * _setBodyOverflow
	 *
	 * Set's the overflow property of body (and html for IE7)
	 *
	 * @since Mon Jul 7 2008
	 * @access protected
	 * @param string value
	 * @return void
	 **/
	_setBodyOverflow: function(value) {
		var value = value || "";
		$(document.body).setStyle({overflow: value});
		$(document.getElementsByTagName("html")[0]).setStyle({overflow: value});
	},

	/**
	 *
	 *
	 *
	 *
	 * @since Thu Jul 10 2008
	 * @access
	 * @param
	 * @return
	 **/
	_addBlinkListener: function() {
		Event.observe(this._modalLayer.getLayer(), "click", this.blink.bindAsEventListener(this) );
	},

	/**
	 *
	 *
	 *
	 *
	 * @since Thu Jul 10 2008
	 * @access
	 * @param
	 * @return
	 **/
	blink: function(event, doBlink, count) {
		var count = count || 0;
		if (Event.element(event).className == this._getBaseClassname() + "_modality") {
			if (doBlink) {
				this.getWindowElement().addClassName(this._getBaseClassname() + "_blink");
				doBlink = false;
			}
			else {
				this.getWindowElement().removeClassName(this._getBaseClassname() + "_blink");
				doBlink = true;
			}
			if (count < this._maxblink) {
				count++
				this.blink.bind(this, event, doBlink, count).delay(0.05);
			}
		}
	}
});
