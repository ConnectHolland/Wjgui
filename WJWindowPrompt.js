/**
 * WJWindowPrompt
 *
 * A class handling modal prompt messages
 *
 * @since Fri Jun 27 2008
 * @revision $Revision$
 * @author Giso Stallenberg
 * @package Windmill.Javascript.Aeroplane
 **/
var WJWindowPrompt = Class.create(WJWindowMessageDialog, {
	/**
	 * initialize
	 *
	 * Creates a new WJWindowPrompt
	 *
	 * @since Wed Jul 9 2008
	 * @access public
	 * @param WJWindow toDecorate
	 * @return WJWindowAlert
	 **/
	initialize: function($super, toDecorate) {
		this._type = "prompt";
		$super(toDecorate);
	},
	
	/**
	 * _getMainTemplate
	 *
	 * Adds the input element to the template
	 *
	 * @since Tue Jul 8 2008
	 * @access protected
	 * @return Template
	 **/
	_getTemplate: function($super) {
		var template = $super();
		template.template += "<input/>";
		return template;
	},
	
	/**
	 * _addButtons
	 *
	 * Adds the right buttons
	 *
	 * @since Wed Jul 9 2008
	 * @access protected
	 * @return void
	 **/
	_addButtons: function($super) {
		$super();
		WJButton.create(dgettext("wjgui", "Cancel"), "false", false, this.getContentElement("buttons") );
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
	windowResult: function(event, result) {
		if (result) {
			this._callback(event, this.getInput().value );
		}
		else {
			this._callback(event, "");
		}
	},

	/**
	 * getInput
	 *
	 * Returns the prompt input element
	 *
	 * @since Thu Jul 10 2008
	 * @access public
	 * @return DOMElement
	 **/
	getInput: function() {
		if (!this._input) {
			this._input = this.getWindowElement().getElementsByTagName("input")[0];
		}
		return this._input;
	}
});
