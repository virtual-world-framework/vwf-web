// Use strict mode to test for ECMAScript5 in browser (in checkCompatibility)
"use strict";

function checkCompatibility() {

    var compatibility = {
        overall: false,
        ecmascript5: false,
        websocket: false,
        webgl: false,
        errorHtml: ""
    };

    // Test for ECMAScript5
    // In ECMAScript5 strict mode (specified above), the global "this" object is null.
    // That is not the case in previous versions of ECMAScript (and in non-strict mode).
    compatibility.ecmascript5 = ( function() { return !this; } )();

    // Test for WebSockets
    compatibility.websocket = !!( window.WebSocket || window.MozWebSocket );

    // Test for WebGL
    if ( window.WebGLRenderingContext ) {
        var canvas = document.createElement('canvas');
        compatibility.webgl = !!( canvas.getContext( "webgl" ) || 
                                  canvas.getContext( "experimental-webgl" ) || 
                                  canvas.getContext( "webkit-3d" ) || 
                                  canvas.getContext( "moz-webgl" ) );
    }

    compatibility.overall = compatibility.ecmascript5 && compatibility.websocket && 
                            compatibility.webgl;

    if ( !compatibility.overall ) {
        var errorHtml = "<h3>Let's beef up your browser.</h3>\n" + 
                        "<p>To see our awesome demo, your browser needs to support:</p>\n" +
                        "<ul>\n";
        if ( !compatibility.ecmascript5 ) {
            errorHtml += "  <li>ECMAScript5</li>\n";
        }
        if ( !compatibility.websocket ) {
            errorHtml += "  <li>WebSockets</li>\n";
        }
        if ( !compatibility.webgl ) {
            errorHtml += "  <li>WebGL</li>\n";
        }
        errorHtml += "</ul>\n" +
            "<p>\n" +
            "  ... and it does not. For a list of compatible browsers, see\n" +
            "  <a href='/requirements.html'>Browser Requirements</a>. If your browser is\n" +
            "  listed, you may need to enable the necessary features. Google can help you find\n" +
            "  how to do that.\n" +
            "</p>\n";
        compatibility.errorHtml = errorHtml;
    }

    return compatibility;
}