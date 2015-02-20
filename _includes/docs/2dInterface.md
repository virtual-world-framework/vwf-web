## <a name="2d-interface">Create a 2D Interface</a>

You can add two dimensional components to a user's *view* via HTML. These components can interact with the *model* state (update it and be updated from it).

The first step is to create an HTML file that matches the name of your app's *vwf.yaml* file.  For example, if your application is titled *application.vwf.yaml*, create a file in the same directory named *application.vwf.html*. When your application loads, the framework automatically looks for an HTML file by this name.

Inside that file, you can place any valid HTML, but you must obey two rules:

- Your HTML must have the style attribute <code>position:absolute</code> to show up in front of the 3D scene. You can achieve this by wrapping everything in a div with that attribute.
- Name any css files something **other** than *index.css*.  VWF uses an *index.css* file already, and it will ignore yours by that same name.

**Note**: The loader strips out header and body tags and inserts your content directly into a nameless, classless div in the VWF *index.html* page (view your app's page source to see what we mean). Including header and body tags is helpful for testing as a standalone webpage, but not required for VWF. 

**Note**: The example application [transforms](https://demo.virtual.wf/demos/transforms) provides a basic demonstration of the principles described in this recipe. It provides a series of 2D HTML form panels which can be used to set properties, call methods, and receive data from the VWF model. The source for this app can be found in the [github repository](https://github.com/virtual-world-framework/vwf) in public/web/example/transforms.)

-------------------

### Monitor and Change the Simulation State

The view (html) can access the model (yaml) through the <code>vwf_view.kernel</code> object. Thus, the HTML can watch what happens within the simulation and make changes to it such as setting properties, calling methods, and firing events. 

The [vwf/api/kernel](https://demo.virtual.wf/web/docs/jsdoc/2c8753578a.html) in the [system API](#system-api) contains the list of kernel calls that can be made from HTML.

-------------------

### Set Properties

To set a property on an object, we first find a reference to that object and then set the property.  Like so:

```javascript
var nodeId = vwf_view.find( ... );
vwf_view.kernel.setProperty( nodeId, "property1", value );
```

Explanations of the parameters can be found in the [query](#querying) and [setProperty](https://demo.virtual.wf/web/docs/jsdoc/2c8753578a.html#setProperty) documentation. Note that the call to <code>find</code> returns immediately, but <code>setProperty</code> and the other kernel calls in this recipe are asynchronous. You can find out when the property has been set by creating an event handler for the [satProperty](https://demo.virtual.wf/web/docs/jsdoc/a2d7e1ef81.html#satProperty) event - and yes... we know that *sat* is not really the past tense of *set*.

-------------------

### Call Methods

To call a model method from the view, we first find a reference to the object (in the same manner as above) and then call the method like so:

```javascript
vwf_view.kernel.callMethod( nodeId, "method1" );
```

Pass parameters to the method by passing an array of values as a third parameter: 

```javascript
vwf_view.kernel.callMethod( nodeId, "method1", [ parameter1, parameter2, etc ] );
```

Explanations of the parameters can be found in the [callMethod](https://demo.virtual.wf/web/docs/jsdoc/2c8753578a.html#callMethod)  API description.

-------------------

### Create Components

Create a model component from the view like so:

```javascript
vwf_view.kernel.createChild( nodeId, "componentName", component, undefined, callback );
```

Explanations of the parameters can be found in the [createChild](https://demo.virtual.wf/web/docs/jsdoc/2c8753578a.html#createChild) API description.

-------------------

### Monitor the Model from HTML

The HTML can reflect changes to the simulation such as property updates, method calls, or events. The following example enables the HTML to catch property changes in the application. 

```javascript
vwf_view.satProperty = function (nodeId, propertyName, propertyValue) {
  if ( nodeId == someSpecificNodeId ) {
    switch ( propertyName ) {
      case "mouseMode":
        doSomething( propertyValue );
        break;
    }
  }
}
```

In this case, any time a property has been set, this function will check to see if the property was changed on a specific node, and if so, will check the name of the property. If it is the property we are looking for, we can write javascript to update the HTML state.

Similarly, the view (.html) can monitor other application updates, such as those listed below:

* Method called - <code>vwf_view.calledMethod = function ...</code>
* Event fired - <code>vwf_view.firedEvent = function ...</code>
* Node created - <code>vwf_view.createdNode = function ...</code>
* Node deleted - <code>vwf_view.deletedNode = function ...</code>

To learn more about these events, you can look at the System API for the [view](https://demo.virtual.wf/web/docs/jsdoc/a2d7e1ef81.html). Earlier we mentioned that calls to set a property and call a method are asynchronous. If you would like to know when the action has completed, you may do so in [satProperty](https://demo.virtual.wf/web/docs/jsdoc/a2d7e1ef81.html#satProperty)/[calledMethod](https://demo.virtual.wf/web/docs/jsdoc/a2d7e1ef81.html#calledMethod)/etc.  However, remember that you will get calls into those event handlers for every property/method/etc that is set/called/etc.

**Note**: If a property setter alters the incoming value before storing it, [satProperty](https://demo.virtual.wf/web/docs/jsdoc/a2d7e1ef81.html#satProperty) will notify the app of the transformed value that is stored, not the original value. See the API description of [node](https://demo.virtual.wf/web/docs/jsdoc_cmp/symbols/node.vwf.html) for more details.

-------------------

### Change the Application Title and Favicon

The default browser title for a VWF application is *Virtual World Framework*. The title may be specified in an app's configuration file as shown below. 

```yaml
---
info:
  title: "Name of Application"
```

Additionally, the favicon of an application may be set simply by dropping a *favicon.ico* file into the application folder. 

For an example of setting these items, visit the [duck application](https://demo.virtual.wf/demos/duck).
