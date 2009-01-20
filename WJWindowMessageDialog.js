/**
 * WJWindowMessageDialog
 *
 * A class handling modal alert messages
 *
 * @since Fri Jun 27 2008
 * @revision $Revision$
 * @author Giso Stallenberg
 * @package Windmill.Javascript.Aeroplane
 **/
var WJWindowMessageDialog = Class.create(WJWindowModal, {
	/**
	 * initialize
	 *
	 * Creates a new WJWindowMessageDialog
	 *
	 * @since Mon Jul 7 2008
	 * @access public
	 * @param Class $super
	 * @param Function callback
	 * @param string type
	 * @return WJWindowMessageDialog
	 **/
	initialize: function($super, toDecorate) {
		$super(toDecorate);
		this.center();
		this.keepCentered();
		this._drawDefaultContent();
		this._addButtons();
	},

	/**
	 * _drawDefaultContent
	 *
	 * Draws the default alert content
	 *
	 * @since Tue Jul 8 2008
	 * @access protected
	 * @return void
	 **/
	_drawDefaultContent: function() {
		var content = this.getContentElement("main");
		var replaces = this._getTemplateValues();
		var template = this._getTemplate();
		content.innerHTML = template.evaluate(replaces);
		this._contentElements["message"] = content.getElementsByClassName(replaces.classprefix+"_message")[0];
	},

	/**
	 *
	 *
	 *
	 *
	 * @since Wed Jul 9 2008
	 * @access
	 * @param
	 * @return
	 **/
	_getTemplateValues: function() {
		return {"classprefix": this._getBaseClassname(), "windowtype": this._type};
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
	_addButtons: function() {
		this._buttons = new Hash();
		this._buttons.set("ok", WJButton.create(dgettext("wjgui", "OK"), "true", true, this.getContentElement("buttons") ) ).focus();
		return this._buttons;
	},

	/**
	 * _getMainTemplate
	 *
	 *
	 *
	 * @since Tue Jul 8 2008
	 * @access protected
	 * @return Template
	 **/
	_getTemplate: function() {
		return new Template("<div class='#{classprefix}_messageicon #{classprefix}_messageicon_#{windowtype}'>&#160;</div><div class='#{classprefix}_message'>&#160;</div>");
	},

	/**
	 * setMessage
	 *
	 * Sets the message for this window
	 *
	 * @since Tue Jul 8 2008
	 * @access public
	 * @param string message
	 * @return void
	 **/
	setMessage: function(message) {
		this.message = message.stripTags().stripScripts().split("\n").join("<br/>");
		this.getContentElement("message").innerHTML = this.message;
	},

	/**
	 * _callback
	 *
	 * Does the callback that this window should do (and hides the message)
	 *
	 * @since Fri Jun 27 2008
	 * @access protected
	 * @return mixed
	 **/
	_callback: function() {
		this.hide();
		return this._decorated._callback.apply(this._decorated, $A(arguments) );
	}
});
