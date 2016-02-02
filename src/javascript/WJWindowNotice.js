/**
 * WJWindowNotice
 *
 * A class handling modal notice (friendly alert) messages
 *
 * @since Mon Jul 07 2008
 * @revision $Revision$
 * @author Giso Stallenberg
 * @package Windmill.Javascript.Aeroplane
 **/
var WJWindowNotice = Class.create(WJWindowAlert, {
	/**
	 * initialize
	 *
	 * Creates a new WJWindowNotice
	 *
	 * @since Mon Jul 07 2008
	 * @access public
	 * @param Class $super
	 * @param Function callback
	 * @param string type
	 * @return WJWindowNotice
	 **/
	initialize: function($super, toDecorate) {
		this._type = "notice";
		$super(toDecorate);
	}
});
