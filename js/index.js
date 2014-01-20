function setFocusPongFrame() {
    var iframe = $("#pongFrame")[0];
    iframe.contentWindow.focus();
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
        } );
    } );
}

$(document).ready(function() {
    var id = makeid();
    var vwfServer = "http://development.virtualworldframework.com"; // "http://apps.virtual.wf";
    var pongUrl = vwfServer + "/vwf-pong/" + id;

    $('#vwfPongId').val(pongUrl);
    var iframe = $("#pongFrame")[0];
    iframe.src = pongUrl;

    setTimeout(setFocusPongFrame, 100);

    $('.jumbotron').tooltip({
        selector: "[data-toggle=tooltip]",
        container: "body"
    });

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