function updateCurrentSessions($app) {
    var appName = $($app[0]).data("app-name");

    jQuery.ajax({
        url: "https://demo.virtual.wf/" + appName + "/admin/instances",
        dataType: "jsonp",
        context: $app,
        success: function(data) {
		    var $demoBody = $(this).find(".demo-info");
		    if ($demoBody.find('.current-sessions').length == 0) {
			    $demoBody.append("<div class='current-sessions'>");
		    }
            
            var $currentSessions = $demoBody.find(".current-sessions");
            $currentSessions.empty();
            if ( Object.keys(data).length != 0 ) {
                $currentSessions.append("<h4 class='current-sessions-header'>Current Sessions</h4><ul class='list-unstyled instances'>");
            }
            var $instancesList = $currentSessions.children(".instances");
            var match;
            jQuery.each( 
                data, function( key, value ) {
                    if ( match = key.match( RegExp( "/([^/]*)$" ) ) ) { 
                        var instanceHTML = htmlEscape( match[1] );
                        var size = Object.size(value.clients);
                        $instancesList.append("<li class='instance'><span class='badge badge-success'>" + size + "</span><span class='instance-name'>Name: " + instanceHTML + "</span><a class='btn btn-success btn-small pull-right' target='_blank' href='https://demo.virtual.wf/" + appName + "/" + instanceHTML + "'>Join Session</a>" + "</li>" );
                    }
                } 
            );
            if ( Object.keys(data).length != 0 ) {
                $currentSessions.append("</ul>");
            }
        }
    });
    setTimeout(updateCurrentSessions, 10000, $app);
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

$( document ).ready( function() {
	$( ".panel-demo.core" ).each( function( index, element ) {
		updateCurrentSessions( $( element ) );
	});

    $('a').on('click', function() {
        // Look to see if they're downloading one of the files on the downloads page.
        if (this.href.match(/download\.virtualworldframework\.com/) && window.location.href.match(/releases\.html/)) {
            ga('send', 'event', 'downloads', 'click', this.text);
        }
    });

    $('.call-to-action.mac-install').on('click', function() {
        ga('send', 'event', 'install', 'click', 'Mac/Linux');
    });

    $('.call-to-action.windows-install').on('click', function() {
        ga('send', 'event', 'install', 'click', 'Windows');
    });
});
