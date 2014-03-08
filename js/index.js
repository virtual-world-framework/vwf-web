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
                     "<p>... and it does not. For a list of compatible browsers, see <a href='/documentation.html#requirements'>Browser Requirements</a>. If your browser is listed, you may need to enable the necessary features. Google can help you find how to do that.</p>\n";
        compatibility.errorHtml = errorHtml;
    }

    return compatibility;
}

function setFocusPongFrame() {
    var iframe = $("#pongFrame")[0];

    // Focus is set after returning to the browser so it works in Firefox
    setTimeout( function() { 
        iframe.contentWindow.focus();
    }, 0);
}

function preparePongFrame() {
    var $iframe = $("#pongFrame");
    $iframe.removeClass( "hide" );

    var qs = (function(a) {
        if (a == "") {
            return {};
        }
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));

    var id = qs["id"];
    if (id == undefined) {
        id = makeid();
    }

    // Load the iframe with the correct URL
    var vwfServer = "https://demo.virtual.wf";
    var pongUrl = vwfServer + "/vwf-pong/" + id;
    var iframe = $iframe[0];
    iframe.src = pongUrl;

    // Fill the form to copy with the share URL
    var vwfWebServer = "https://virtual.wf";
    var pongShareUrl = vwfWebServer + "?id=" + id;
    $('#vwfPongId').val(pongShareUrl);

    setTimeout(setFocusPongFrame, 100);
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 16; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function setUpCopyButtons() {
    var client = new ZeroClipboard( $(".copy-button"), { 
        moviePath: "/swf/ZeroClipboard.swf" 
    } );
    client.on( "load", function(client) {
        client.on( "complete", function(client, args) {
            $(this).removeClass("btn-info");
            $(this).text("Copied!");
            $(this).addClass("btn-success");

            // Send a Google Analytics event 
            if ($(this).attr("id") == "copyButton") {
                ga('send', 'event', 'demo', 'copy-url', 'Pong');
            } else if ($(this).attr("id") == "copyInstallButton") {
                ga('send', 'event', 'install', 'copy', 'Mac/Linux');
            }
        });
    } );
}

function setUpInstallButton() {
    if (platform) {
        $(".mac-install").click(function () {
            $("#macInstall").removeClass("hide");
        });

        if (platform.os.family.indexOf("OS X") != -1) {
            $(".mac-install").removeClass("hide");
            $(".windows-install").addClass("hide");
        } else if (platform.os.family.indexOf("Win") != -1) {
            $(".mac-install").addClass("hide");
            // Disabling Windows installer until we can verify that it doesn't override person's PATH variable
            // $(".windows-install").removeClass("hide");
        } else if (platform.os.family.indexOf("iOS") != -1) {
            $(".mac-install").addClass("hide");
            $(".windows-install").addClass("hide");
        } else if (platform.os.family.indexOf("Linux") != -1) {
            $(".mac-install").removeClass("hide");
            $(".windows-install").addClass("hide");
        } else {
            // We don't know what platform it is, so it's probably a weird *nix.
            $(".mac-install").removeClass("hide");
            $(".windows-install").addClass("hide");
        }
    }
}

$(document).ready(function() {
    var compatibility = checkCompatibility();

    if ( compatibility.overall ) {
        ga('send', 'event', 'browser', 'compatibility', 'true');

        $( "#errorBox" ).addClass( "hide" );
        preparePongFrame();
        $( ".panel-footer" ).removeClass( "hide" );

        $( "body" ).keydown(function( event ) {
            switch( event.which ) {
                case 76:
                case 79:
                case 70:
                case 82:
                    ga('send', 'event', 'demo', 'move paddles');
                    setFocusPongFrame();
            }
        });

        setUpCopyButtons();
    } else {
        $( "#errorBox" )[ 0 ].innerHTML = compatibility.errorHtml;
        ga('send', 'event', 'browser', 'compatibility', 'false');
    }

    $('.call-to-action.mac-install').on('click', function() {
        ga('send', 'event', 'install', 'click', 'Mac/Linux');
    });

    $('.call-to-action.windows-install').on('click', function() {
        ga('send', 'event', 'install', 'click', 'Windows');
    });

    setUpInstallButton();
});