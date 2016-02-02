/**
 * WJWindowAlert
 *
 * A class handling modal alert messages
 *
 * @since Fri Jun 27 2008
 * @revision $Revision$
 * @author Giso Stallenberg
 * @package Windmill.Javascript.Aeroplane
 **/
var WJWindowAlert = Class.create(WJWindowMessageDialog, {
    /**
     * initialize
     *
     * Creates a new WJWindowAlert
     *
     * @since Wed Jul 9 2008
     * @access public
     * @param WJWindow toDecorate
     * @return WJWindowAlert
     **/
    initialize: function($super, toDecorate) {
        if (!this._type) {
            this._type = "alert";
        }
        $super(toDecorate);
        this.getListener("close").callback.setArgument(0, true); // closing an alert means ok
        this.removeListener("false");// an alert can only be true
        this.removeListener("save");
        this.removeListener("cancel");
    }
});
