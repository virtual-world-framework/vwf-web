$( document ).ready( function() {
    var compatibility = checkCompatibility();
    var compatibilityBox = $( "#compatibilityBox" )[ 0 ];
    if ( compatibility.overall ) {
        compatibilityBox.innerHTML =
            "<div class='row'>\n" +
            "  <div class='col-xs-12'>\n" +
            "    <div class='alert alert-success'>\n" +
            "      <p class='small'>\n" +
            "        <span class='glyphicon glyphicon-ok'></span>\n" +
            "        Your browser can run VWF apps!  But feel free to peruse VWF's\n" +
            "        <a href='requirements.html'>browser requirements</a>.\n" +
            "      </p>\n" +
            "    </div>\n" +
            "  </div>\n" +
            "</div>\n";
    } else {
        compatibilityBox.innerHTML = compatibility.errorHtml;
    }
} );