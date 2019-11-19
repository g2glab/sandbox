/**
 * This file defines views for displaying the results from the server.
 * Each view is a simple, pure function that takes a JSON object as input 
 * and returns a dom node
 * 
 * Created by Anton on the 11.11.2019
 */

// wrap contents in function so we don't pollute the global namespace
(function (global) {

    /**
     * Escape bad characters in unknown strings
     * @param {String} dirty the string we want to escape, possibly containing characters like < " & '
     * @returns {String} a cleaned version of the dirty input string where all bad characters are replaced with their respective html escape codes
     **/
    function escapeHtml(dirty) {
        if (!dirty) return '';
        if (typeof dirty != 'string') return "" + dirty;
        return dirty.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Converts an html string to a DOM node
     * @param {String} html the html that needs to be converted to a dom node
     */
    function create_node(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div;
    }

    // expose our views to the global namespace
    global.output_view = {
        pg: function (info) {
            return create_node('<h2>PG</h2> \
            <div class="form-group">\
                <textarea class="form-control text-monospace" id="pg-output" rows="10">'+ escapeHtml(info.content) + '</textarea>\
            </div>');
        },
        dot: function (info) {
            return create_node('<h2>Graphviz</h2> \
            <div class="form-group"> \
                <textarea class="form-control text-monospace" id="pgx-output" rows="10">'+ escapeHtml(info.content) + '</textarea> \
            </div>\
            <img src="'+ escapeHtml(info.image) + '"/>');
        },
        neo: function (info) {
            return create_node('<h2>Neo4j</h2>\
            <div class="form-group">\
                <label for="neo-output-nodes">Nodes</label>\
                <textarea class="form-control text-monospace" id="neo-output-nodes" rows="10">'+ escapeHtml(info.nodes) + '</textarea>\
            </div>\
            <div class="form-group">\
                <label for="neo-output-edges">Edges</label>\
                <textarea class="form-control text-monospace" id="neo-output-edges" rows="10">'+ escapeHtml(info.edges) + '</textarea>\
            </div>');
        },
        pgx: function (info) {
            return create_node('<h2>Oracle PGX</h2>\
            <div class="form-group">\
                <label for="aws-output-nodes">Nodes</label>\
                <textarea class="form-control text-monospace" id="aws-output-nodes" rows="10">'+ escapeHtml(info.nodes) + '</textarea>\
            </div>\
            <div class="form-group">\
                <label for="aws-output-edges">Edges</label>\
                <textarea class="form-control text-monospace" id="aws-output-edges" rows="10">'+ escapeHtml(info.edges) + '</textarea>\
            </div>');
        },
        aws: function (info) {
            return create_node('<h2>Amazon Neptune</h2>\
            <div class="form-group">\
                <label for="aws-output-nodes">Nodes</label>\
                <textarea class="form-control text-monospace" id="aws-output-nodes" rows="10">'+ escapeHtml(info.nodes) + '</textarea>\
            </div>\
            <div class="form-group">\
                <label for="aws-output-edges">Edges</label>\
                <textarea class="form-control text-monospace" id="aws-output-edges" rows="10">'+ escapeHtml(info.edges) + '</textarea>\
            </div>');
        }
    }

})(window); // pass window as the global object as we are in a web context
