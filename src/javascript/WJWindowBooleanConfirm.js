/**
 * WJWindowBooleanConfirm
 *
 * A class handling modal confirm messages with Yes/No buttons
 *
 * @since Thu Jul 10 2008
 * @revision $Revision$
 * @author Giso Stallenberg
 * @package Windmill.Javascript.Aeroplane
 **/
var WJWindowBooleanConfirm = Class.create(WJWindowConfirm, {
    /**
     * initialize
     *
     * Creates a new WJWindowBooleanConfirm
     *
     * @since Thu Jul 10 2008
     * @access public
     * @param WJWindow toDecorate
     * @return WJWindowAlert
     **/
    initialize: function($super, toDecorate) {
        this._type = "booleanconfirm";
        $super(toDecorate);
    },

    /**
     * _addButtons
     *
     * Adds the right buttons
     *
     * @since Thu Jul 10 2008
     * @access protected
     * @return void
     **/
    _addButtons: function($super) {
        this._buttons = $super();
        this._buttons.get("ok").updateCaption(this._decorated.translate("YES") );
        this._buttons.get("cancel").updateCaption(this._decorated.translate("NO") );
        return this._buttons;
    }
});
