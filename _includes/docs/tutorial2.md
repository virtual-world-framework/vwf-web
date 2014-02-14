<a name="tutorial2"></a>

# Sandtable Tutorial

<iframe width="560" height="315" src="http://www.youtube.com/embed/mMhgA9fwdWs" frameborder="0" allowfullscreen></iframe>
 
The goal of the following tutorial is to allow a developer to build an application from a simple primitive to small sandtable application. The tutorial is broken up into four stages, each building upon itself to create a more complex application.

*   Stage 1 - Primitive Scene
*   Stage 2 - Terrain Model and Orbit Navigation
*   Stage 3 - Multiple Models and Behaviors
*   Stage 4 - HTML Overlays and Interaction

-------------------

## Stage 1 - Primitive Scene

In the first stage, we'll add in a basic primitive collada file, and set up the initial camera position. The application will contain the default navigation of a fly mode.

The following code creates a child node of the application named blueCube, of type node3, and defines the source file. In the scripts section, the camera transform is initialized, and will be set during the application load. 

	---
	extends: http://vwf.example.com/scene.vwf
	children:
	  blueCube:
	    extends: http://vwf.example.com/node3.vwf
	    source: models/BlueCube.dae
	    type: model/vnd.collada+xml
	methods:
	  initializeCamera:
	scripts:
	- |
	  this.initialize = function() {
	    this.future( 0 ).initializeCamera();
	  }

	  this.initializeCamera = function() {
	    this.camera.translation = [ 0, -100, 0 ];
	  }

The above is all that is needed to create an application. The default fly mode allows the user to navigate with the standard WASD keys, as well as Q and E to rotate. 

Example: [Primitive Scene](https://demo.virtualworldframework.com/tutorial/00)

-------------------

## Stage 2 - Terrain Model and Orbit Navigation

In the second stage, we will:

*   Set the background color scene property to an RGB value to give the appearance of sky
*   Use the navscene component and navmode scene property to change the navigation mode to orbit around a single point
*   Replace the blue cube with a terrain model
*   Set the terrain's position, rotation, and scale
*   Add a "sceneCenter" child to the application (setting its translation property)
*   Tell the camera to always look at sceneCenter by setting the camera's "lookat" property to the id of sceneCenter
*   Set other camera properties in the initializeCamera function, including "far" and "near", setting up clipping planes for this much larger terrain model. 

The code to do so is as follows:

	---
	extends: http://vwf.example.com/navscene.vwf
	properties:
	  backgroundColor: [ 83, 157, 194 ]
	  navmode: "orbit"
	methods:
	  initializeCamera:
	children:
	  flat_terrain:
	    extends: http://vwf.example.com/node3.vwf
	    source: models/vwf_terrain.dae
	    type: model/vnd.collada+xml
	    properties:
	      translation: [ 0, 0, -1000 ]
	      scale: [ 0.008, 0.008, 0.020 ]
	  sceneCenter:
	    extends: http://vwf.example.com/node3.vwf
	    properties:
	      translation: [ 0, 0, 0 ]
	scripts:
	- |
	  this.initialize = function() {
	    this.future( 0 ).initializeCamera();
	  }

	  this.initializeCamera = function() {
	    this.camera.translation = [ 0, 20000, 10000 ];
	    this.camera.far = 500000;
	    this.camera.near = 2;
	    this.camera.lookAt = this.sceneCenter.id;
	  }

In this application, the WASD controls can be used for navigation; however, the camera will continue to focus on the sceneCenter point.

Example: [Terrain Model and Orbit Navigation](https://demo.virtualworldframework.com/tutorial/01)

-------------------

## Stage 3 - Multiple Models and Behaviors

In the third stage, we'll add an additional child node for a predator vehicle called 'predator' with similar property definitions. We'll then apply a behavior to the 'predator' node, which is defined in a separate yaml file. Setting the property 'fly-flying' to true will enable the flying behavior immediately upon application load. 

	---
	extends: http://vwf.example.com/navscene.vwf
	properties:
	  backgroundColor: [ 83, 157, 194 ]
	  navmode: "orbit"
	children:
	  flat_terrain:
	    extends: http://vwf.example.com/node3.vwf
	    source: models/vwf_terrain.dae
	    type: model/vnd.collada+xml
	    properties:
	      translation: [ 0, 0, -1000 ]
	      scale: [ 0.008, 0.008, 0.020 ]
	  sceneCenter:
	    extends: http://vwf.example.com/node3.vwf
	    properties:
	      translation: [ 0, 0, 0 ]
	  predator:
		extends: http://vwf.example.com/node3.vwf
		implements:
		- http://vwf.example.com/fly.vwf
		source: models/Predator.dae
		type: model/vnd.collada+xml
		properties:
		  translation: [ 0, 500, 1800 ]
		  rotation: [ 0, 0, 1, 180 ]
		  scale: 50
		  fly-flying: true
	scripts:
	- |
	  this.initialize = function() {
	    this.future( 0 ).initializeCamera();
	  }
	  
	  this.initializeCamera = function() {
	    this.camera.translation = [ 0, 20000, 10000 ];
	    this.camera.far = 500000;
	    this.camera.near = 2;
	    this.camera.lookAt = this.sceneCenter.id;
	  }

Example: [Multiple Models and Behaviors](https://demo.virtualworldframework.com/tutorial/02)

-------------------

## Stage 4 - HTML Overlays and Interaction

In the fourth stage, we'll add an HTML overlay to the application, and setup the javascript to allow the 2D HTML components to interact with the 3D nodes. For this application, we'll create a toolbar of two images, one to select navigation mode, and one to select pindrop mode, where navigation will be disabled, and a click of the mouse will mark the location selected. 

First, we'll create a file called *index.vwf.html* that will load separately or on top of the application. The name must match that of the *index.vwf.yaml* file, and the framework will automatically look for that file. We'll define the body with a simple HTML toolbar div containing the two button images. This will allow us to select either navigation mode, or pindrop mode. 

In the yaml file, we'll add a mouseMode property with a setter. This property will determine whether the navmode is set to 'orbit' or turned off. We'll then add javascript variables and additional functions to drop the pins. The pushpin variable describes the child node that will be added, and will look similar to a child definition. The pointerUp function checks the navigation mode and will call the pindrop function if necessary to create the new node. 

	---
	extends: http://vwf.example.com/navscene.vwf
	properties:
	  backgroundColor: [ 83, 157, 194 ]
	  navmode: "orbit"
	  mouseMode:
	    set: |
	      if( value == "orbit" ) {
	        this.navmode = "orbit";
	      } else {
	        this.navmode = "none";
	      }
	    value: "orbit"
	children:
	  flat_terrain:
	    extends: http://vwf.example.com/node3.vwf
	    source: models/vwf_terrain.dae
	    type: model/vnd.collada+xml
	    properties:
	      translation: [ 0, 0, -1000 ]
	      scale: [ 0.008, 0.008, 0.020 ]
	  sceneCenter:
	    extends: http://vwf.example.com/node3.vwf
	    properties:
	      translation: [ 0, 0, 0 ]
	  predator:
		extends: http://vwf.example.com/node3.vwf
		implements:
		- http://vwf.example.com/fly.vwf
		source: models/Predator.dae
		type: model/vnd.collada+xml
		properties:
		  translation: [ 0, 500, 1800 ]
		  rotation: [ 0, 0, 1, 180 ]
		  scale: 50
		  fly-flying: true
	scripts:
	- |
	  this.initialize = function() {
	    this.future( 0 ).initializeCamera();
	  }
	  
	  this.initializeCamera = function() {
	    this.camera.translation = [ 0, 20000, 10000 ];
	    this.camera.far = 500000;
	    this.camera.near = 2;
	    this.camera.lookAt = this.sceneCenter.id;
	  }

	  var pushpinIndex = 1;
	  var pushpin = {
	    extends: "http://vwf.example.com/node3.vwf",
	    source: "models/pushpinblack.dae",
	    type: "model/vnd.collada+xml",
	    properties: {
	      scale: 6
	    },
	  };

	  this.pointerUp = function( parms, pickInfo ){
	    if( this.mouseMode == "pindrop") {
	        this.pindrop( pickInfo );
	    }
	  }
	  
	  this.pindrop = function( pickInfo ) {
	    if ( pickInfo && pickInfo.globalPosition ) {
	      pushpin.properties.translation = pickInfo.globalPosition;

	      var name = "pushpin"+pushpinIndex;
	      this.children.create( name, pushpin );
	      pushpinIndex++;
	    }
	  }

Finally, back in the HTML file, we'll need to add a few javascript functions to highlight the appropriate button selected, as well as to set the global application property, mouseMode. The final thing to add is a listener for the mouseMode property. This will come into play if the mode is changed on another client, so the highlighted button is appropriately changed. 

	function setMode(mode) {
    	highlightMode(mode);
        vwf_view.kernel.setProperty(vwf.find("", "/")[0], "mouseMode", mode);
  	}

    function highlightMode(mode) {
       	document.getElementById('orbit').style.border = "2px solid black";
       	document.getElementById('pindrop').style.border = "2px solid black";

       	document.getElementById(mode).style.border = "3px solid red";
    }

    vwf_view.satProperty = function (nodeId, propertyName, propertyValue) {
      	if (nodeId == vwf.find("", "/")[0] ) {
      		switch (propertyName) {
      		  case "mouseMode":
      		    highlightMode( propertyValue );
      		    break;
            }
        }
    }

Example: [HTML Overlays and Interaction](https://demo.virtualworldframework.com/tutorial/03)

-------------------
