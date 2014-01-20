function setFocusPongFrame() {
    var iframe = $("#pongFrame")[0];
    iframe.contentWindow.focus();
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

function setUpCopy() {
    var clip = new ZeroClipboard( document.getElementById("copy-button"), {
      moviePath: "/swf/ZeroClipboard.swf"
    } );

    clip.on( "load", function(client) {
        var copyButton = $("#copy-button");
        copyButton.removeAttr("disabled");

        client.on( "complete", function(client, args) {
            copyButton = $("#copy-button");
            copyButton.removeClass("btn-info");
            copyButton.text("Copied!");
            copyButton.addClass("btn-success");
        });
    } );
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

    setUpCopy();
});