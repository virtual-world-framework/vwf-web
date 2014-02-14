<a name="html"></a>

# HTML Overlays

Two dimensional components may be added to any application via HTML. When an application loads, the framework automatically looks for an HTML file of the same name. For instance, if your application is entitled <code><i>application</i>.vwf.yaml</code>, VWF will look for a file in the same directory called <code><i>application</i>.vwf.html</code>. This HTML is of a standard format, and can, in fact, be loaded standalone in a browser. 

A few additions to the file can attach the 2D content as an overlay directly over the VWF view, and scripts can be added to attach the HTML content to the application pieces itself. 

-------------------

### Overlay HTML Content

The first step is to create the HTML content as you'd like it to appear on the screen. In the example below, everything contained within the first div can stand alone as it's own HTML file, with standard css rules applied.

	<body>
	  <div id="wrapper" class="wrapper">
	    <div class="toolstyle" id="toolbar">
	      <img id="icon1" src="images/icon1.png" style="border:3px solid red" alt="icon1" 
	        onclick="setMode('mode1')"/>
	      <img id="icon2" src="images/icon2.png" style="border:2px solid black" alt="icon2" 
	        onclick="setMode('mode2')"/>
	    </div>
	  </div>
	  <script type="text/javascript">
	    $('#wrapper').appendTo('#vwf-root');
	  </script>
	</body>

In order to attach the content as an overlay to the application, we've added an additonal script tag, that appends the <code>wrapper</code> div to <code>vwf-root</code>, or the main application view. 

**Note**: The loader strips out header and body tags and inserts content directly into index.html. HTML5 formatting is helpful for testing as a standalone webpage, but not required for VWF. 

-------------------

### Allow HTML to Monitor and Change the Simulation State

The HTML has access to the VWF application models through <code>vwf_view</code>. Thus, the HTML can watch what happens within the simulation and make changes to it such as setting properties, calling methods, and firing events. 

The <code>vwf.api.kernel</code> in the [system API](#system-api) contains a full list of possible kernel calls that can be made from the view (.html).

The following sections show examples of how to do just that. Refer to [querying](#querying) for more information about obtaining node IDs to pass to the following functions.

-------------------

### Allow HTML to Set Application Properties

Properties of the application or of specific nodes may be set directly in the javascript of an HTML file. In order to set a property, the following syntax should be used. 

	vwf_view.kernel.setProperty(vwf_view.kernel.application(), "property1", value);

The first argument is the ID of the node containing the given property. In this case, the property is on the application itself, and uses the function call for the root node of the application. The second parameter is the name of the property to set, and the third argument is the value to be passed to the specified property. 

-------------------

### Allow HTML to Call Application Methods

Application methods can be called directly from the HTML, with or without parameters. In order to call a method, the following syntax should be used.

	vwf_view.kernel.callMethod(vwf_view.kernel.find(undefined, "/nodeName")[0], "method1");

The first argument is the ID of the node where the method resides. In this case, the ID is found using the [find](#querying) function call passing in the name of the node. The second parameter is the name of the method as defined in the main application file. In order to pass parameters directly to the method call, a third parameter may be passed as an array of values. 

	vwf_view.kernel.callMethod(vwf_view.kernel.find(undefined, "/nodeName")[0], "method1", [ parameter1, parameter2, etc ]);

-------------------

### Allow HTML to Create Components

New components can also be created from the HTML. In order to create a node, the following syntax should be used.

	vwf_view.kernel.createChild(vwf_view.kernel.application(), "componentName", component, undefined, callback);

The first argument is the ID of the node that will be the parent of the new component. The second argument is the name of the new component, and the third is the JavaScript object defining the new component. The final argument is optional, and is a function that will be called after the new component has been created.  Note the callback is not
currently functional.

-------------------

### Monitor the Simulation to Manipulate HTML

HTML can reflect changes to the simulation as they occur. These changes can include property updates, method calls, or event fires. The following example allows the HTML to be notified of property changes in the simulation. 

	vwf_view.satProperty = function (nodeId, propertyName, propertyValue) {
	  if (nodeId == vwf_view.kernel.application() ) {
	    switch (propertyName) {
	      case "mouseMode":
	        doSomething( propertyValue );
	        break;
        }
      }
	}

In this case, any time a property has been set, this function will check to see if the property was changed on a specific node, and if so, will check the name of the property. If found, javascript can then be performed to update the HTML state.

Similarly, the HTML can monitor other types of application updates as well. A few common ones are listed below.

* Node created - <code>vwf_view.createdNode = function ...</code>
* Node deleted - <code>vwf_view.deletedNode = function ...</code>
* Method called - <code>vwf_view.calledMethod = function ...</code>
* Event fired - <code>vwf_view.firedEvent = function ...</code>

The <code>vwf.api.view</code> in the [system API](#system-api) contains a full list of view driver calls.

-------------------

