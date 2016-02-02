/**
 * WJWrappedPane
 *
 * A class used to create wrapped panes
 *
 * @since Mon Feb 9 2009
 * @revision $Revision$
 * @author Giso Stallenberg
 * @package Windmill.Javascript.Aeroplane
 **/
var WJWrappedPane = Class.create({
    /**
     * initialize
     *
     * Creates a new WJWrappedPane
     *
     * @since Mon Feb 9 2009
     * @access public
     * @param Element element
     * @return WJWrappedPane
     **/
    initialize: function(element) {
        this.element = $(element);
        WJDebugger.log(WJDebugger.INFO, "Create new wrapped pane", element);
        $(this.element.parentNode).insertBefore(this._createWrapper(), this.element).down(".wjgui_wrappedpane_main").down(".wjgui_wrappedpane_content").update("").appendChild(this.element);
    },

    /**
     * _createWrapper
     *
     * Returns a div that can be used as wrapper
     *
     * @since Mon Feb 9 2009
     * @access protected
     * @return Element
     **/
    _createWrapper: function() {
        var template = new Template("<div class='wjgui_wrappedpane_#{rowname}'><div class='wjgui_wrappedpane_left wjgui_wrappedpane_column'><div class='wjgui_wrappedpane_right wjgui_wrappedpane_column'><div class='wjgui_wrappedpane_center wjgui_wrappedpane_column'><div class='wjgui_wrappedpane_content'>&#160;</div></div></div></div></div>");
        var content = ["top", "main", "bottom"].inject("", function(content, rowname) {
            return content + template.evaluate({rowname: rowname});
        });
        
        var wrappedpane =  new Element("div").update(content);
        wrappedpane.addClassName("wjgui_wrappedpane");
        return wrappedpane;

    }
});
