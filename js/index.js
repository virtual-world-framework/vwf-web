function setFocusPongFrame() {
    var iframe = $("#pongFrame")[0];

    // Focus is set after returning to the browser so it works in Firefox
    setTimeout( function() { 
        iframe.contentWindow.focus();
    }, 0);
}

function preparePongFrame() {
    var qs = (function(a) {
    if (a == "") return {};
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
    var vwfServer = "http://demo.virtual.wf";
    var pongUrl = vwfServer + "/vwf-pong/" + id;
    var iframe = $("#pongFrame")[0];
    iframe.src = pongUrl;

    // Fill the form to copy with the share URL
    var vwfWebServer = "http://virtual.wf";
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
        });
    } );
}

function setUpInstallButton() {
    if (platform) {
        $(".mac-install").click(function () {
            $("#macInstall").removeClass("hide");
        });

        if (platform.os.family.indexOf("OS X") != -1) {
            $("button.mac-install").removeClass("hide");
            $("button.windows-install").addClass("hide");
        } else if (platform.os.family.indexOf("Win") != -1) {
            $("button.mac-install").addClass("hide");
            $("button.windows-install").removeClass("hide");
        } else if (platform.os.family.indexOf("iOS") != -1) {
            $("button.mac-install").addClass("hide");
            $("button.windows-install").addClass("hide");
        } else if (platform.os.family.indexOf("Linux") != -1) {
            $("button.mac-install").removeClass("hide");
            $("button.windows-install").addClass("hide");
        } else {
            // We don't know what platform it is, so it's probably a weird *nix.
            $("button.mac-install").removeClass("hide");
            $("button.windows-install").addClass("hide");
        }
    }
}

function updateCurrentSessions($app) {
    var appName = $app[0].id;
    var $demoBody = $app.children(".demo-info");
    jQuery.ajax({
        url: "http://development.virtual.wf/" + appName + "/admin/instances",
        dataType: "jsonp",
        success: function(data) {
            $demoBody.empty();
            if ( Object.keys(data).length != 0 ) {
                $demoBody.append("<h4 class='current-sessions'>Current Sessions</h4><ul class='list-unstyled instances'>");
            }
            var match;
            jQuery.each( 
                data, function( key, value ) {
                    if ( match = key.match( RegExp( "/([^/]*)$" ) ) ) { 
                        var instanceHTML = htmlEscape( match[1] );
                        var size = Object.size(value.clients);
                        $demoBody.append("<li class='instance'><span class='badge badge-success'>" + size + "</span><span class='instance-name'>Name: " + instanceHTML + "</span><a class='btn btn-success btn-small pull-right' target='_blank' href='http://demo.virtual.wf/" + appName + "/" + instanceHTML + "'>Join Session</a>" + "</li>" );
                    }
                } 
            );
            if ( Object.keys(data).length != 0 ) {
                    $demoBody.append("</ul>");
            }
        }
    });
    setTimeout(updateCurrentSessions, 60000, $app);
}

// From http://stackoverflow.com/a/7124052
function htmlEscape( string ) {
  return String( string ).
    replace( /&/g, "&amp;" ).
    replace( /"/g, "&quot;" ).
    replace( /'/g, "&#39;" ).
    replace( /</g, "&lt;" ).
    replace( />/g, "&gt;" );
}

Object.size = function(obj) { 
  var size = 0, key; 
  for (key in obj) { 
    if (obj.hasOwnProperty(key)) size++; 
  } 
  return size; 
}; 

$(document).ready(function() {
    preparePongFrame();

    $( "body" ).keydown(function( event ) {
        switch( event.which ) {
            case 76:
            case 79:
            case 70:
            case 82:
                setFocusPongFrame();
        }
        event.preventDefault();
    });

    setUpCopyButtons();

    setUpInstallButton();

    updateCurrentSessions($(".panel-demo.core"));
});