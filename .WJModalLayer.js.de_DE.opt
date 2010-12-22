/**
 * WJModalLayer is a class to create a modal layer on the page to disallow any user interaction other that on things on top op the layer
 **/
var WJModalLayer = Class.create({
	/**
	 * initialize
	 *
	 * Creates and applies a WJModalLayer
	 *
	 * @since Tue Jan 06 2009
	 * @access public
	 * @param Element parent
	 * @param Element modalLayer
	 * @return void
	 **/
	initialize: function(parent, modalLayer, fillviewport, hidescroll) {
		var parent = parent || document.body;
		this.fillviewport = fillviewport || false;
		this.hidescroll = hidescroll || false;
		this._modalLayer = (modalLayer || new Element("div") );
		Element.extend(this._modalLayer).addClassName("wjgui_window_modality");
		$(parent).appendChild(this._modalLayer);
		this._removed = false;
		this._absolutizeTopLeft();
		this._fillViewport();

		Event.observe(window, "resize", this._fillViewport.bind(this, this._modalLayer) ); // on purpose, no need to bind as event listener
	},

	/**
	 * _absolutizeTopLeft
	 *
	 * Puts the window in the top left corner of the viewport
	 *
	 * @since Fri Jun 27 2008
	 * @access protected
	 * @param Element element
	 * @return void
	 **/
	_absolutizeTopLeft: function(element) {
		var element = this._modalLayer;
		element.absolutize();
		element.setStyle({left: 0, top: 0, zIndex: 2147483647});
	},

	/**
	 * _fillViewport
	 *
	 * Stretches the given element to fill the viewport
	 *
	 * @since Mon Jul 7 2008
	 * @access protected
	 * @param DOMElement element
	 * @return void
	 **/
	_fillViewport: function() {
		if (this.hidescroll) {
			this.inlineStyling = document.body.readAttribute("style");
			$(document.body).setStyle( {overflow: "hidden"} );
		}

		var element = $(this._modalLayer);
		if (!this.fillviewport && $(element.parentNode) && $(element.parentNode).getHeight) {
			element.setStyle( {width: $(element.parentNode).getWidth() + "px", height: $(element.parentNode).getHeight() + "px"} );
		}
		else {
			element.setStyle( {width: document.viewport.getWidth() + "px", height: document.viewport.getHeight() + "px", top: $(document.body).cumulativeScrollOffset().top + "px"} );
		}
	},

	/**
	 * getLayer
	 *
	 * Gets the layer element
	 *
	 * @since Tue Jan 06 2009
	 * @access public
	 * @return htmlelement
	 **/
	getLayer: function() {
		return this._modalLayer;
	},

	/**
	 * destroy
	 *
	 * Destroys this modal layer
	 *
	 * @since Tue Jan 06 2009
	 * @access public
	 * @return void
	 **/
	destroy: function() {
		if (!this._removed) {
			this._modalLayer.remove();
			this._removed = true;
			if (this.hidescroll) {
				document.body.setAttribute("style", this.inlineStyling);
			}
		}
	}
});
