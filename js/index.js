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

$(document).ready(function() {
    var id = makeid();
    var vwfServer = "http://localhost:3000"; // "http://apps.virtual.wf";
    var pongUrl = vwfServer + "/" + id;

    $('#vwfPongId').val(pongUrl);
    var iframe = $("#pongFrame")[0];
    iframe.src = pongUrl;

    setTimeout(setFocusPongFrame, 100);

    $("#pongFrame").on("click", setFocusPongFrame);

    $('.jumbotron').tooltip({
      selector: "[data-toggle=tooltip]",
      container: "body"
    });
});