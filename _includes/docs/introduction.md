# <a name="introduction">Introduction</a>

The Virtual World Framework (VWF) provides a synchronized collaborative 3D environment for the web browser. VWF allows for easy application creation, and provides a simple interface to allow multiple users to interact with the state of the application that is synchronized across clients. 

VWF leverages existing web-based standards, infrastructure, and emerging technologies with the intent of establishing a powerful yet simple-to-use platform that is built on top of the next generation of web browsers. VWF applications run directly in-browser with no additional plugins.

-------------------

Use the Virtual World Framework (VWF) to create apps that are:

- **3D**
- **Collaborative**
- **Web-based**

... and create them **fast**.

<script>
  this.createAppUrl = function() {
  var sessionId = "";
  var chars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ];
    for ( var i = 0; i < 16; i++ )
      sessionId += chars[ Math.floor( Math.random() * 16 ) ];
    return "https://virtual.wf/duck/" + sessionId;
  };

  this.Url = this.createAppUrl();

  this.createIframes = function() {
    document.write( "<p>Imagine that you are in New York...</p>" );
    document.write( "<iframe height='400' width='660' src='" + this.Url + "'></iframe>" );
    document.write( "<p>...and you're working with someone in San Francisco.</p>" );
    document.write( "<p>(Click the duck to see them spin in synchrony)</p>" );
    document.write( "<iframe height='400' width='660' src='" + this.Url + "'></iframe>" );
  }();
</script>

-------------------

### Technology

The underlying technology of VWF includes:

* WebGL, a high performance rendering engine for 3D on the web.

* Modern javascript and ECMAScript5, a more standardized programming environment.

* WebSockets, providing high performance communication. 

-------------------

### Audience

The developer's guide is designed for those with web development skills (HTML5, JavaScript, etc), and will serve as a guide to the user creating applications with the Virtual World Framework. 

-------------------

### Using VWF

VWF is a server package *and* a zero-install client. Demo applications can be directly run on the [VWF website](/demos.html). A server can be set up locally to build new applications. Please download the source packages from [github](https://github.com/virtual-world-framework/vwf) and follow the readme and [installation instructions](#install) to start your own server.

