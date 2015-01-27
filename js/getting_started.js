$( document ).ready( function() {
    var compatibility = checkCompatibility();

    if ( compatibility.overall ) {
        ga( 'send', 'event', 'browser', 'compatibility', 'true' );

        $( "#errorBox" ).addClass( "hide" );
        preparePongFrame();
        $( ".panel-footer" ).removeClass( "hide" );

        $( "body" ).keydown( function( event ) {
            switch( event.which ) {
                case 76:
                case 79:
                case 70:
                case 82:
                    ga( 'send', 'event', 'demo', 'move paddles' );
                    setFocusPongFrame();
            }
        } );

        setUpCopyButtons();
    } else {
        $( "#errorBox" )[ 0 ].innerHTML = compatibility.errorHtml;
        ga( 'send', 'event', 'browser', 'compatibility', 'false' );
    }
} );

function preparePongFrame() {
    var $iframe = $( "#pongFrame" );
    $iframe.removeClass( "hide" );

    var qs = ( function( a ) {
        if ( a == "" ) {
            return {};
        }
        var b = {};
        for ( var i = 0; i < a.length; ++i )
        {
            var p = a[ i ].split( '=' );
            if ( p.length != 2 ) continue;
            b[ p[ 0 ]] = decodeURIComponent( p[ 1 ].replace( /\+/g, " " ) );
        }
        return b;
    } )( window.location.search.substr( 1 ).split( '&' ) );

    var id = qs[ "id" ];
    if ( id == undefined ) {
        id = makeid();
    }

    // Load the iframe with the correct URL
    var vwfServer = "https://demo.virtual.wf";
    var pongUrl = vwfServer + "/demos/pong/" + id;
    var iframe = $iframe[ 0 ];
    iframe.src = pongUrl;

    // Fill the form to copy with the share URL
    $( '#vwfPongId' ).val( pongUrl );

    setTimeout( setFocusPongFrame, 100 ); 
}

function setFocusPongFrame() {
    var iframe = $("#pongFrame")[0];

    // Focus is set after returning to the browser so it works in Firefox
    setTimeout( function() { 
        iframe.contentWindow.focus();
    }, 0);
}

function setUpCopyButtons() {
    var client = new ZeroClipboard( $( ".copy-button" ), { 
        moviePath: "/swf/ZeroClipboard.swf" 
    } );
    client.on( "load", function( client ) {
        client.on( "complete", function( client, args ) {
            $( this ).removeClass( "btn-info" );
            $( this ).text( "Copied!" );
            $( this ).addClass( "btn-success" );

            // Send a Google Analytics event 
            if ( $( this ).attr( "id" ) == "copyButton" ) {
                ga( 'send', 'event', 'demo', 'copy-url', 'Pong' );
            } else if ( $( this ).attr( "id" ) == "copyInstallButton" ) {
                ga( 'send', 'event', 'install', 'copy', 'Mac/Linux' );
            }
        } );
    } );
}