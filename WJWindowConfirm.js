/**
 * WJWindowConfirm
 *
 * A class handling modal confirm messages
 *
 * @since Fri Jun 27 2008
 * @revision $Revision$
 * @author Giso Stallenberg
 * @package Windmill.Javascript.Aeroplane
 **/
var WJWindowConfirm = Class.create(WJWindowMessageDialog, {
	/**
	 * initialize
	 *
	 * Creates a new WJWindowConfirm
	 *
	 * @since Wed Jul 9 2008
	 * @access public
	 * @param WJWindow toDecorate
	 * @return WJWindowAlert
	 **/
	initialize: function($super, toDecorate) {
		this._type = "confirm";
		$super(toDecorate);
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
		this._buttons = $super();
		this._buttons.set("cancel", WJButton.create(gettext("Cancel"), "false", false, this.getContentElement("buttons") ) );
		return this._buttons;
	}
});
