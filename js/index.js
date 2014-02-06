function setFocusPongFrame() {
    var iframe = $("#pongFrame")[0];
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
    var vwfServer = "http://development.virtual.wf"; // "http://apps.virtual.wf";
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
});