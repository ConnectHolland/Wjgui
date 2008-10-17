/**
 * class WJWindow
 *
 * The base window class
 *
 * @since Fri Jun 27 2008
 * @revision $Revision$
 * @author Giso Stallenberg
 * @package Windmill.Javascript.Aeroplane
 **/
var WJWindow = Class.create({
	/**
	 * Properties of Window
	 *
	 * string _title
	 * string _type
	 * DOMElement _content
	 * mixed _contenttype
	 * Function _callbackFunction
	 * boolean _visible
	 * integer _x
	 * integer _y
	 * integer _z
	 * integer _w
	 * integer _h
	 **/

	/**
	 * initialize
	 *
	 * Creates a new WJWindow
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param Function callback
	 * @param string type (default: window)
	 * @return WJWindow
	 **/
	initialize: function(callback, type) {
		this._loading = false;
		this._basetitle = this._title = "";
		this._createWindow();
		this._listeners = new Hash();
		this._addDefaultListeners();

		this._addCloseButton();

		this.setCallback(callback);
		this.setBaseTitle(WJGuiSettings.windowBaseTitle);
	},

	/**
	 * _createWindow
	 *
	 * Creates a new window DOMElement
	 *
	 * @since Fri Jun 27 2008
	 * @access protected
	 * @return void
	 **/
	_createWindow: function() {
		var classname = this._getBaseClassname();
		this._windowElement = new Element("div", {"class": classname});
		this._createWindowRows(["title", "main", "buttons", "bottom"], classname);
		this._windowElementId = this._windowElement.identify();
		document.body.appendChild(this._windowElement);
		this._absolutizeTopLeft();
		this.hide();
		this._outerElement = this._windowElement;
	},

	/**
	 * insertWindowRowBefore
	 *
	 * Inserts a new row before given rowname with name newrowname
	 *
	 * @since Tue Sep 23 2008
	 * @access public
	 * @param string rowname
	 * @param string newrowname
	 * @return DOMElement
	 **/
	insertWindowRowBefore: function(rowname, newrowname) {
		if (rowname === "title") {
			return;
		}
		var classname = this._getBaseClassname();
		var row = this._windowElement.select("." + classname + "_" + rowname)
		row = row.first();
		var newrowhtml = this._createRow(newrowname, classname, " " + classname + "_body");
		var div = new Element("div");
		div.update(newrowhtml);
		var toprow = row.parentNode;
		var newrow = toprow.insertBefore(div.firstChild, row );
		newrow = Element.extend(newrow);
		newrow = newrow.select("." + classname + "_content");
		this._contentElements[newrowname] = newrow.first();
		return newrow;
	},

	/**
	 * _addCloseButton
	 *
	 * Adds a button to close the window
	 *
	 * @since Mon Jul 7 2008
	 * @access protected
	 * @return void
	 **/
	_addCloseButton: function() {
		var title = this.getContentElement("title");
		title.appendChild(new Element("div", {"class": this._getBaseClassname() + "_closebutton", "onclick": "Element.fire(this, \"aeroplane:close\")", "title": dgettext("wjgui", "Close window") } ) );
	},

	/**
	 * _addDefaultListeners
	 *
	 * Adds custom event listeners to the window
	 *
	 * @since Mon Jul 7 2008
	 * @access protected
	 * @return void
	 **/
	_addDefaultListeners: function(element) {
		this.addListener("true", this.windowResult.bindAsEventListener(this, true) );
		this.addListener("false", this.windowResult.bindAsEventListener(this, false) );
		this.addListener("close", this.windowResult.bindAsEventListener(this, false) );
		this.addListener("save", this.windowResult.bindAsEventListener(this) );
		this.addListener("delete", this.windowResult.bindAsEventListener(this) );
		this.addListener("cancel", this.windowResult.bindAsEventListener(this) );
		this._addDefaultKeyListener();
	},

	/**
	 * _addDefaultKeyListener
	 *
	 * Adds a listener for key's like return and esc
	 *
	 * @since Fri Sep 5 2008
	 * @access protected
	 * @return void
	 **/
	_addDefaultKeyListener: function() {
		// here for extending purposes only
		var element = element || this._windowElement;
		Event.observe(element, "keydown", this.keyHandle.bindAsEventListener(this) );
	},

	/**
	 * keyHandle
	 *
	 * Handles pressing enter or esc
	 *
	 * @since Fri Sep 5 2008
	 * @access public
	 * @param Event event
	 * @return void
	 **/
	keyHandle: function(event) {
		var element = event.element();
		if (Object.isElement(element.up(".aeroplane_window") ) ) {
			switch (event.keyCode) {
				case Event.KEY_RETURN:
					if (this.isVisible() ) {
						element.fire("aeroplane:true");
					}
					break;
				case Event.KEY_ESC:
					if (this.isVisible() ) {
						element.fire("aeroplane:close");
					}
					break;
				default:
					return;
			}
		}
	},

	/**
	 * addListener
	 *
	 * Adds a listener for a custom event that calls the given callback or the default callback of this window
	 *
	 * @since Tue Aug 12 2008
	 * @access
	 * @param
	 * @return WJWindow
	 **/
	addListener: function(eventName, callback, element) {
		WJDebugger.log(WJDebugger.INFO, "Adding listener in WJWindow", eventName, callback);
		var callback = callback || this.windowResult.bindAsEventListener(this);
		var element = element || this._windowElement;

		Event.observe(element, "aeroplane:" + eventName, callback);
		this._setListener(eventName, {"element": element, "callback": callback} );
		return this;
	},

	/**
	 * _setListener
	 *
	 * Registers a listener function
	 *
	 * @since Wed Jul 9 2008
	 * @access public
	 * @param string key
	 * @param Object elementAndCallback
	 * @return void
	 **/
	_setListener: function(key, elementAndCallback) {
		this._listeners.set(key, elementAndCallback);
	},

	/**
	 * removeListener
	 *
	 * Removes the listener set for key
	 *
	 * @since Tue Aug 12 2008
	 * @access
	 * @param
	 * @return WJWindow
	 **/
	removeListener: function(key) {
		var listener = this.getListener(key);
		Event.stopObserving(listener.element, "aeroplane:" + key, listener.callback);
		this._listeners.unset(key);
		return this;
	},

	/**
	 * removeListeners
	 *
	 * Removes all listeners
	 *
	 * @since Tue Aug 12 2008
	 * @access public
	 * @return WJWindow
	 **/
	removeListeners: function() {
		this._listeners.each(function(info) {
			this.removeListener(info.key);
		}.bind(this) );
		return this;
	},

	/**
	 * windowResult
	 *
	 * Handles the window result event
	 *
	 * @since Wed Jul 9 2008
	 * @access protected
	 * @param Event event
	 * @return void
	 **/
	windowResult: function() {
		this._callback.apply(this, arguments);
	},

	/**
	 * getListeners
	 *
	 * Returns the listeners hash
	 *
	 * @since Mon Jul 7 2008
	 * @access public
	 * @return Hash
	 **/
	getListeners: function() {
		return this._listeners;
	},

	/**
	 * getListener
	 *
	 * Returns the listener info set for key
	 *
	 * @since Tue Aug 12 2008
	 * @access
	 * @param
	 * @return
	 **/
	getListener: function(key) {
		return this._listeners.get(key);
	},

	/**
	 * _getBaseClassname
	 *
	 * Returns the base classname used for windows
	 *
	 * @since Fri Jun 27 2008
	 * @access protected
	 * @return string
	 **/
	_getBaseClassname: function() {
		return "aeroplane_window";
	},

	/**
	 * _getWindowRowTemplate
	 *
	 * Returns a template that can be used to create rows in windows
	 *
	 * @since Fri Jun 27 2008
	 * @access protected
	 * @return Template
	 **/
	_getWindowRowTemplate: function() {
		return new Template("<div class='#{classprefix}_#{rowname} #{classprefix}_row#{body}'><div class='#{classprefix}_left #{classprefix}_column'><div class='#{classprefix}_right #{classprefix}_column'><div class='#{classprefix}_center #{classprefix}_column'><div class='#{classprefix}_content'>&#160;</div></div></div></div></div>");
	},

	/**
	 * _createWindowRows
	 *
	 * Creates rows with names in the rows argument, appends them to windowElement and prefixes all classes with classprefix
	 *
	 * @since Fri Jun 27 2008
	 * @access protected
	 * @param Array rows
	 * @param string classprefix
	 * @param Element windowElement
	 * @return array
	 **/
	_createWindowRows: function(rows, classprefix, windowElement) {
		var windowElement = windowElement || this._windowElement;
		rows.each(function(windowElement, classprefix, rowname, index) {
			var body = " " + classprefix + "_body";
			if (index == 0 || index == (rows.length - 1) ) {
				body = "";
			}
			windowElement.innerHTML += this._createRow(rowname, classprefix, body);
		}.bind(this, windowElement, classprefix));
		this._saveRows(rows, classprefix, windowElement);
	},

	/**
	 * _saveRows
	 *
	 * Saves all rows in this._contentElements
	 *
	 * @since Tue Sep 23 2008
	 * @access protected
	 * @param Array rows
	 * @param string classprefix
	 * @param Element windowElement
	 * @return WJWindow
	 **/
	_saveRows: function(rows, classprefix, windowElement) {
		var windowElement = windowElement || this._windowElement;
		this._contentElements = {};
		rows.each(function(windowElements, rowname, index) {
			this._contentElements[rowname] = windowElements[index];
		}.bind(this, windowElement.select("." + classprefix + "_content") ) );
		return this;
	},

	/**
	 * _createRow
	 *
	 * Creates the HTML of a row
	 *
	 * @since Tue Sep 23 2008
	 * @access protected
	 * @param string rowname
	 * @param string classprefix
	 * @param string body
	 * @return string
	 **/
	_createRow: function(rowname, classprefix, body) {
		var row = this._getWindowRowTemplate();
		return row.evaluate({"rowname": rowname, "classprefix": classprefix, "body": body});
	},

	/**
	 * getContentElement
	 *
	 * Returns the content element identified by rowname
	 *
	 * @since Mon Jul 7 2008
	 * @access public
	 * @param string rowname
	 * @return DOMElement
	 **/
	getContentElement: function(rowname) {
		return this._contentElements[rowname];
	},

	/**
	 * evalContentElement
	 *
	 * Evaluates the script parts in the content element identified by rowname
	 *
	 * @since Wed Jul 30 2008
	 * @access public
	 * @param string rowname
	 * @return WJWindow
	 **/
	evalContentElement: function(rowname) {
		var element = this.getContentElement(rowname);
		element.innerHTML.evalScripts();
		return this;
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
		var element = element || this._windowElement;
		this.show(element);
		element.absolutize();
		element.setStyle({height: ""});
		this.hide(element);
		this.setX(0, element);
		this.setY(0, element);
	},

	/**
	 * _checkMaxHeight
	 *
	 * Checks the window wo be inside the viewport
	 *
	 * @since Mon Jul 7 2008
	 * @access protected
	 * @param DOMElement element
	 * @return void
	 **/
	_checkMaxHeight: function(element) {
		var element = element || this.getContentElement("main");
		if (this.getY() + this.getHeight() > document.viewport.getHeight() ) {
			this.setHeight(document.viewport.getHeight() - this.getY(), element, false);
		}
		else {
			element.setStyle({"maxHeight": ""});
		}
	},

	/**
	 * show
	 *
	 * Shows the window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return WJWindow
	 **/
	show: function(element) {
		var element = element || this._outerElement || this._windowElement;
		element.style.display = "block";
		try { element.focus() } catch(e) {} // TODO think of something better to get focus in browsers and a window in IE6
		return this;
	},

	/**
	 * hide
	 *
	 * Hides the window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return WJWindow
	 **/
	hide: function(element) {
		var element = element || this._outerElement || this._windowElement;
		element.style.display = "none";
		return this;
	},

	/**
	 * destroy
	 *
	 * Destroys the window
	 *
	 * @since Mon Jul 28 2008
	 * @access public
	 * @return WJWindow
	 **/
	destroy: function(element) {
		var element = element || this._outerElement || this._windowElement;
		WJDebugger.log(WJDebugger.INFO, "Destroy main window", this, element);
		if (element.parentNode) {
			element.remove();
		}
		return this;
	},

	/**
	 * _callback
	 *
	 * Does the callback that this window should do
	 *
	 * @since Fri Jun 27 2008
	 * @access protected
	 * @return mixed
	 **/
	_callback: function() {
		if (Object.isFunction(this._callbackFunction) ) {
			var args = $A(arguments);
			args.unshift(this);
			return this._callbackFunction.apply(this._callbackFunction,  args);
		}
	},

	/**
	 * _close
	 *
	 * Closes the window
	 *
	 * @since Fri Jun 27 2008
	 * @access protected
	 * @return mixed
	 **/
	_close: function(event) {
		this.hide();
	},

	/**
	 * setBaseTitle
	 *
	 * Changes the base title
	 *
	 * @since Wed Sep 10 2008
	 * @access public
	 * @param string title
	 * @return WJWindow
	 **/
	setBaseTitle: function(title) {
		this._basetitle = title;
		this.setTitle(this.getTitle() );
		return this;
	},

	/**
	 * setTitle
	 *
	 * Changes the title
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return WJWindow
	 **/
	setTitle: function(title) {
		this._title = title;
		var headers = this.getContentElement("title").getElementsByTagName("h1");
		if (headers.length < 1) {
			this.getContentElement("title").innerHTML = "<h1>&#160;</h1>" + this.getContentElement("title").innerHTML;
			return this.setTitle(this._title);
		}
		headers[0].innerHTML = this._getComposedTitle();
		return this;
	},

	/**
	 * _getComposedTitle
	 *
	 * Creates a nice looking title
	 *
	 * @since Wed Sep 10 2008
	 * @access protected
	 * @return string
	 **/
	_getComposedTitle: function() {
		return this._title + ( (this._basetitle != "" &&  this._basetitle != this._title) ? ( (this._title != "") ? " - " : "") + this._basetitle : "");
	},

	/**
	 * setContent
	 *
	 * Changes the content
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param mixed content
	 * @return WJWindow
	 **/
	setContent: function(content) {
		if (Object.isString(content) ) {
			this.getContentElement("main").innerHTML = content;
		}
		if (Object.isElement(content) ) {
			this.getContentElement("main").appendChild(content);
		}
		this._content = content;
		return this;
	},

	/**
	 * addButton
	 *
	 * Adds a button to the window
	 *
	 * @since Tue Aug 12 2008
	 * @access public
	 * @param string caption
	 * @param mixed callback
	 * @param boolean defaultButton
	 * @return DOMElement
	 **/
	addButton: function(caption, eventHandler, defaultButton) {
		WJDebugger.log(WJDebugger.INFO, "Adding button to window", caption, eventHandler, this);
		var button = WJButton.create(caption, eventHandler, defaultButton, this.getContentElement("buttons") );
		if (defaultButton) {
			button.focus();
		}
		return button;
	},

	/**
	 * setCallback
	 *
	 * Changes the callback function
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param Function callback
	 * @return WJWindow
	 **/
	setCallback: function(callback) {
		if (Object.isFunction(callback) ) {
			this._callbackFunction = callback;
		}
		return this;
	},

	/**
	 * setX
	 *
	 * Changes the x position of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param integer x
	 * @return WJWindow
	 **/
	setX: function(x, element) {
		this._x = x || 0;
		var element = element || this._windowElement;
		element.style.left = x + "px";
		return this;
	},

	/**
	 * setY
	 *
	 * Changes the y position of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param integer y
	 * @return WJWindow
	 **/
	setY: function(y, element) {
		this._y = y || 0;
		var element = element || this._windowElement;
		element.style.top = y + "px";
		this._checkMaxHeight(element);
		return this;
	},

	/**
	 * setZ
	 *
	 * Changes the z-index of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param integer z
	 * @return WJWindow
	 **/
	setZ: function(z, element) {
		this._z = z || 10000;
		var element = element || this._windowElement;
		element.style.zIndex = z;
		return this;
	},

	/**
	 * setWidth
	 *
	 * Changes the width of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param integer width
	 * @return WJWindow
	 **/
	setWidth: function(width, element) {
		this._width = width;
		var element = element || this._windowElement;
		element.setStyle({"width": width + "px"});
		element.fire("aeroplane:resize");
		return this;
	},

	/**
	 * setHeight
	 *
	 * Changes the height of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param integer height
	 * @return WJWindow
	 **/
	setHeight: function(height, element, checkHeight) {
		this._height = height;
		var element = element || this.getContentElement("main");
		var windowHeight = this._windowElement.getHeight();
		var otherRowsHeight = windowHeight - element.getHeight();

		if ( (height - otherRowsHeight) < 0) {
			if (element.getHeight() == 0) {
				var wasVisible = this.isVisible();
				this._windowElement.setStyle({"visibility": "hidden"});
				this.show();
				this.setHeight(height, element);
				this._windowElement.setStyle({"visibility": "visible"});
				this[((wasVisible)?"show":"hide")]();
			}
			else {
				this.setHeight(otherRowsHeight, element);
			}
			return;
		}
		element.style.height = (height - otherRowsHeight) + "px";

		// avoid infinitive loops
		if (checkHeight != false) {
			this._checkMaxHeight(element);
		}
		if (!checkHeight) {
			element.fire("aeroplane:resize");
		}
		return this;
	},

	/**
	 * getBaseTitle
	 *
	 * Returns the title of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return string
	 **/
	getBaseTitle: function() {
		return this._basetitle;
	},

	/**
	 * getTitle
	 *
	 * Returns the title of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return string
	 **/
	getTitle: function() {
		return this._title;
	},

	/**
	 * getType
	 *
	 * Tells what window type this window is
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return string
	 **/
	getType: function() {
		return this._type;
	},

	/**
	 * getContent
	 *
	 * Returns the content of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return mixed
	 **/
	getContent: function() {
		return this._content;
	},

	/**
	 * getContenttype
	 *
	 * Returns the type of the content
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return mixed
	 **/
	getContenttype: function() {

	},

	/**
	 * getCallback
	 *
	 * Returns the callback function
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return Function
	 **/
	getCallback: function() {
		return this._callbackFunction;
	},

	/**
	 * isVisible
	 *
	 * Tells if this window can be seen
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return boolean
	 **/
	isVisible: function() {
		var xInLow = (this.getX() < 0 && (this.getX() + this.getWidth() ) > 0);
		var xInHigh = (this.getX() >= 0 && this.getX() < document.viewport.getWidth() );
		var yInLow = (this.getY() < 0 && (this.getY() + this.getHeight() ) > 0);
		var yInHigh = (this.getY() >= 0 && this.getY() < document.viewport.getHeight() );
		if ( (xInLow || xInHigh) && (yInLow || yInHigh) && this._windowElement.visible() ) {
			return true;
		}
		return false;
	},

	/**
	 * getX
	 *
	 * Tells the x position of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return integer
	 **/
	getX: function(element) {
		var element = element || this._windowElement;
		return parseInt(element.style.left);
	},

	/**
	 * getY
	 *
	 * Tells the y position of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return integer
	 **/
	getY: function(element) {
		var element = element || this._windowElement;
		return parseInt(element.style.top);
	},

	/**
	 * getZ
	 *
	 * Tells the zIndex of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return integer
	 **/
	getZ: function() {
		var element = element || this._windowElement;
		return element.style.zIndex;
	},

	/**
	 * getWidth
	 *
	 * Tells the width of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return integer
	 **/
	getWidth: function(element) {
		var element = element || this._windowElement;
		return element.getWidth();
	},

	/**
	 * getHeight
	 *
	 * Tells the height of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return integer
	 **/
	getHeight: function(element) {
		var element = element || this._windowElement;
		return element.getHeight();
	},

	/**
	 * getContentHeight
	 *
	 * Tells what's the height of the content element
	 *
	 * @since Tue Sep 16 2008
	 * @access public
	 * @return integer
	 **/
	getContentHeight: function() {
		return this.getContentElement("main").getHeight();
	},

	/**
	 * getContentWidth
	 *
	 * Tells what's the width of the content element
	 *
	 * @since Tue Sep 16 2008
	 * @access public
	 * @return integer
	 **/
	getContentWidth: function() {
		return this.getContentElement("main").getWidth();
	},

	/**
	 * getWindowElement
	 *
	 * Returns the windowElement
	 *
	 * @since Mon Jul 7 2008
	 * @access public
	 * @return DOMElement
	 **/
	getWindowElement: function() {
		return this._windowElement;
	},

	/**
	 * center
	 *
	 * centers the given element
	 *
	 * @since Mon Jul 7 2008
	 * @access public
	 * @param DOMElement element
	 * @return WJWindow
	 **/
	center: function(element) {
		var element = element || this._windowElement;
		var remainsX = document.viewport.getWidth() - this.getWidth(element);
		var remainsY = document.viewport.getHeight() - this.getHeight(element);

		this.setX(remainsX / 2, element).setY(remainsY / 2, element);
		return this;
	},

	/**
	 * keepCentered
	 *
	 * Makes sure the window stays centered
	 *
	 * @since Mon Jul 7 2008
	 * @access public
	 * @param DOMElement element
	 * @return void
	 **/
	keepCentered: function(element) {
		if (!this._centerObserver) {
			var element = element || this._windowElement;
			this._centerObserver = this.center.bind(this, element);
			Event.observe(window, "resize", this._centerObserver);
		}
	},

	/**
	 * stopCentered
	 *
	 * Stops centering the window
	 *
	 * @since Mon Jul 7 2008
	 * @access public
	 * @return void
	 **/
	stopCentered: function() {
		Event.stopObserving(window, "resize", this._centerObserver);
		this._centerObserver = null;
	},

	/**
	 * maximize
	 *
	 * Maximizes the window
	 *
	 * @since Fri Aug 8 2008
	 * @access public
	 * @return WJWindow
	 **/
	maximize: function(paddingTop, paddingRight, paddingBottom, paddingLeft, noScroll) {
		var paddingTop = paddingTop || 0;
		var paddingRight = paddingRight || paddingTop;
		var paddingBottom = paddingBottom || paddingTop;
		var paddingLeft = paddingLeft || paddingTop;
		var noScroll = noScroll || false;

		this.setX(paddingLeft).setY(paddingTop);

		if (noScroll) {
			this.setWidth(0).setHeight(0);
		}

		this.setWidth(document.viewport.getWidth() - (paddingLeft + paddingRight) ).setHeight(document.viewport.getHeight() - (paddingTop + paddingBottom) );
		return this;
	},

	/**
	 * keepMaximized
	 *
	 * Makes sure the window stays maximized
	 *
	 * @since Tue Sep 9 2008
	 * @access public
	 * @return void
	 **/
	keepMaximized: function() {
		if (!this._maximizedObserver) {
			var paddingTop = this.getY();
			var paddingLeft = this.getX();
			var paddingRight = document.viewport.getWidth() - this.getWidth() - paddingLeft;
			var paddingBottom = document.viewport.getHeight() - this.getHeight() - paddingTop;

			this._maximizedObserver = this.maximize.bind(this, paddingTop, paddingRight, paddingBottom, paddingLeft, true);
			Event.observe(window, "resize", this._maximizedObserver);
		}
	},

	/**
	 * stopMaximized
	 *
	 * Stops maximizing the window
	 *
	 * @since Tue Sep 9 2008
	 * @access public
	 * @return void
	 **/
	stopMaximized: function() {
		Event.stopObserving(window, "resize", this._maximizedObserver);
		this._maximizedObserver = null;
	},

	/**
	 * setLoading
	 *
	 * Mark this window as loading (or not)
	 *
	 * @since Wed Sep 3 2008
	 * @access public
	 * @param boolean loading
	 * @return WJWindow
	 **/
	setLoading: function(loading) {
		if (loading && !this.getLoading() ) {
			this.getWindowElement().addClassName("aeroplane_window_loading");
			this.getContentElement("main").setStyle({"visibility": "hidden"});
		}
		else if (!loading && this.getLoading() ) {
			this.getWindowElement().removeClassName("aeroplane_window_loading");
			this.getContentElement("main").setStyle({"visibility": "visible"});
		}
		this._loading = loading;
		return this;
	},

	/**
	 * getLoading
	 *
	 * Tells if this window is marked as loading
	 *
	 * @since Wed Sep 3 2008
	 * @access public
	 * @return boolean
	 **/
	getLoading: function() {
		return this._loading;
	}
});


WJWindow._messagedialog = function(type, message, callback, show) {
	var win = new WJWindow(callback);
	var mwin = new window[type](win);
	mwin.setMessage(message);
	if (show) {
		mwin.show();
	}
	return mwin;
}
WJWindow.alert = function(message, callback) {
	return WJWindow._messagedialog("WJWindowAlert", message, callback, true);
}
WJWindow.notice = function(message, callback) {
	return WJWindow._messagedialog("WJWindowNotice", message, callback, true);
}
WJWindow.confirm = function(message, callback) {
	return WJWindow._messagedialog("WJWindowConfirm", message, callback, true);
}
WJWindow.booleanConfirm = function(message, callback) {
	return WJWindow._messagedialog("WJWindowBooleanConfirm", message, callback, true);
}
WJWindow.prompt = function(message, callback) {
	return WJWindow._messagedialog("WJWindowPrompt", message, callback, true);
}
