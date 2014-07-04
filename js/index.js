function prepareAppFrames() {
    var $iframeApp1 = $( "#app1" );
    $iframeApp1.removeClass( "hide" );
    var $iframeApp2 = $( "#app2" );
    $iframeApp2.removeClass( "hide" );

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
    var appUrl = vwfServer + "/duck/" + id;
    var iframeApp1 = $iframeApp1[0];
    iframeApp1.src = appUrl;
    var iframeApp2 = $iframeApp2[0];
    iframeApp2.src = appUrl;
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

        $( "#errorBox1" ).addClass( "hide" );
        $( "#errorBox2" ).addClass( "hide" );
        prepareAppFrames();
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
        $( "#errorBox1" )[ 0 ].innerHTML = compatibility.errorHtml;
        $( "#errorBox2" )[ 0 ].innerHTML = compatibility.errorHtml;
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