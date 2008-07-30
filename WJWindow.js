/**
 * WJWindow
 *
 * The base window class
 *
 * @since Fri Jun 27 2008
 * @revision $Revision$
 * @author Giso Stallenberg
 * @package Windmill.Javascript.Aeroplane
 **/
var WJWindow = Class.create();
WJWindow.prototype = {
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
		this._createWindow();
		this._addListeners();
		
		this._addCloseButton();

		this.setCallback(callback);
		this.setTitle("Windmill CMS");
		
		this.setX(600); // Remove this
		this.setY(270); // Remove this
		this.show(); // Remove this
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
		this._windowElement = document.createElement("div");
		this._windowElement.className = classname;
		this._createWindowRows(["title", "main", "buttons", "bottom"], classname);
		this._windowElementId = this._windowElement.identify();
		document.body.appendChild(this._windowElement);
		this._absolutizeTopLeft();
		this.hide();
		this._outerElement = this._windowElement;
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
		var closeButton = document.createElement("div");
		closeButton.setAttribute("class", this._getBaseClassname() + "_closebutton");
		closeButton.setAttribute("onclick", "this.fire(\"aeroplane:close\")");
		title.appendChild(closeButton);
	},

	/**
	 * _addListeners
	 *
	 * Adds custom event listeners to the window
	 *
	 * @since Mon Jul 7 2008
	 * @access protected
	 * @return void
	 **/
	_addListeners: function(element) {
		var element = element || this._windowElement;
		
		this._createListeners().each(function(windowElement, nameFunc, index) {
			Event.observe(windowElement, "aeroplane:" + nameFunc.key, nameFunc.value);
		}.bind(this, element) );
	},

	/**
	 * _createListeners
	 *
	 * Creates a hash with event listeners
	 *
	 * @since Mon Jul 7 2008
	 * @access protected
	 * @return void
	 **/
	_createListeners: function() {
		this._listeners = new Hash();
		
		this.setListener("close", this.windowResult.bind(this, false) );
		this.setListener("true", this.windowResult.bind(this, true) );
		this.setListener("false", this.windowResult.bind(this, false) );

		return this._listeners;
	},
	
	/**
	 * setListener
	 *
	 * 
	 *
	 * @since Wed Jul 9 2008
	 * @access 
	 * @param 
	 * @return 
	 **/
	setListener: function(key, func) {
		this._listeners.set(key, func);
	},
	
	/**
	 * windowResult
	 *
	 * Handles the window result event (in other words calls the callback with the result)
	 *
	 * @since Wed Jul 9 2008
	 * @access protected
	 * @param Event event
	 * @param mixed result
	 * @return void
	 **/
	windowResult: function(result) {
		this._callback(result);
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
		var row = this._getWindowRowTemplate();
		var windowElement = windowElement || this._windowElement;
		Element.extend(windowElement);
		rows.each(function(windowElement, row, classprefix, rowname, index) {
			var body = " " + classprefix + "_body";
			if (index == 0 || index == (rows.length - 1) ) {
				body = "";
			}
			windowElement.innerHTML += row.evaluate({"rowname": rowname, "classprefix": classprefix, "body": body});
		}.bind(this, windowElement, row, classprefix));
		
		this._contentElements = {};
		rows.each(function(windowElements, rowname, index) {
			this._contentElements[rowname] = windowElements[index];
		}.bind(this, windowElement.getElementsByClassName(classprefix + "_content") ) );
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
			this.setHeight(document.viewport.getHeight() - this.getY(), null, false);
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
	 * @return void
	 **/
	show: function(element) {
		var element = element || this._outerElement || this._windowElement;
		element.style.display = "block";
	},

	/**
	 * hide
	 *
	 * Hides the window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return void
	 **/
	hide: function(element) {
		var element = element || this._outerElement || this._windowElement;
		element.style.display = "none";
	},
	
	/**
	 * destroy
	 *
	 * Destroys the window
	 *
	 * @since Mon Jul 28 2008
	 * @access public
	 * @return void
	 **/
	destroy: function(element) {
		var element = element || this._outerElement || this._windowElement;
		if (element.parentNode) {
			element.parentNode.removeChild(element);
		}

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
			return this._callbackFunction.apply(this._callbackFunction, args);
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
	 * setTitle
	 *
	 * Changes the title
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @return void
	 **/
	setTitle: function(title) {
		this._title = title;
		var headers = this.getContentElement("title").getElementsByTagName("h1");
		if (headers.length < 1) {
			this.getContentElement("title").innerHTML = "<h1>&#160;</h1>" + this.getContentElement("title").innerHTML;
			return this.setTitle(this._title);
		}
		headers[0].innerHTML = this._title;
	},

	/**
	 * setContent
	 *
	 * Changes the content
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param mixed content
	 * @return void
	 **/
	setContent: function(content) {
		this._content = content;
	},

	/**
	 * setCallback
	 *
	 * Changes the callback function
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param Function callback
	 * @return void
	 **/
	setCallback: function(callback) {
		if (Object.isFunction(callback) ) {
			this._callbackFunction = callback;
		}
	},

	/**
	 * setX
	 *
	 * Changes the x position of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param integer x
	 * @return void
	 **/
	setX: function(x, element) {
		this._x = x || 0;
		var element = element || this._windowElement;
		element.style.left = x + "px";
	},

	/**
	 * setY
	 *
	 * Changes the y position of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param integer y
	 * @return void
	 **/
	setY: function(y, element) {
		this._y = y || 0;
		var element = element || this._windowElement;
		element.style.top = y + "px";
		this._checkMaxHeight(element);
	},

	/**
	 * setZ
	 *
	 * Changes the z-index of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param integer z
	 * @return void
	 **/
	setZ: function(z, element) {
		this._z = z || 10000;
		var element = element || this._windowElement;
		element.style.zIndex = z;
	},

	/**
	 * setWidth
	 *
	 * Changes the width of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param integer width
	 * @return void
	 **/
	setWidth: function(width, element) {
		this._width = width;
		var element = element || this._windowElement;
		element.style.width = width + "px";
	},

	/**
	 * setHeight
	 *
	 * Changes the height of this window
	 *
	 * @since Fri Jun 27 2008
	 * @access public
	 * @param integer height
	 * @return void
	 **/
	setHeight: function(height, element, checkHeight) {
		this._height = height;
		var element = element || this.getContentElement("main");
		var windowHeight = this._windowElement.getHeight();
		var otherRowsHeight = windowHeight - element.getHeight();
		element.style.height = (height - otherRowsHeight) + "px";
		
		// avoid infinitive loops
		if (checkHeight != false) {
			this._checkMaxHeight(element);
		}
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
	 * @return void
	 **/
	center: function(element) {
		var element = element || this._windowElement;
		var remainsX = document.viewport.getWidth() - this.getWidth(element);
		var remainsY = document.viewport.getHeight() - this.getHeight(element);
		
		this.setX(remainsX / 2, element);
		this.setY(remainsY / 2, element);
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
	}
};


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
	WJWindow._messagedialog("WJWindowAlert", message, callback, true);
}
WJWindow.notice = function(message, callback) {
	WJWindow._messagedialog("WJWindowNotice", message, callback, true);
}
WJWindow.confirm = function(message, callback) {
	WJWindow._messagedialog("WJWindowConfirm", message, callback, true);
}
WJWindow.booleanConfirm = function(message, callback) {
	WJWindow._messagedialog("WJWindowBooleanConfirm", message, callback, true);
}
WJWindow.prompt = function(message, callback) {
	WJWindow._messagedialog("WJWindowPrompt", message, callback, true);
}
