## <a name="drivers">Drivers</a>

We've discussed how to write an application using the framework. The next section describes how the system works, and how to reconfigure the system to accomplish more complex tasks. The drivers of the system are the things that connect components to the 3D visualization and the user interaction that you see. 

The drivers define the autonomic actions that happen within a system, dividing responsibility and delegating work for each action of the system. These actions include things such as creating or deleting a node, getting or setting a property, calling methods, and firing events. The drivers stand side by side without direct interaction between them. Rather, they interact by autonomic actions that the kernel manages. 

For example, the three.js driver is responsible for any manipulation on the node that's part of the scene, like setting the translation of a node. This information may be ignored by the rest of the drivers if it is not needed. 

Model and view drivers have the same structure; however, the model driver doesn't reach out, and a view driver does not have direct control. 

### Configuring Drivers for an Application

An application allows for both its model and view drivers to be selected and activated via a configuration file. This system will look for a config file with the same base name as the application being loaded. For instance, <code>application.vwf</code> will search for and attempt to load a config file entitled <code>application.vwf.config.yaml</code>.

Within the configuration, both model and view drivers may be defined within the <code>model:</code> or <code>view:</code> tag, using the path to the driver file, as shown below. 

```yaml
---
model:
  vwf/model/threejs:
view:
  vwf/view/threejs: "#vwf-root"
  vwf/view/lesson: 
```

For drivers that require parameters, such as the renderer view driver that requires the correct HTML element ID, these can be passed in one of two ways. If there is only one parameter, it can be passed in as shown above to the right of the colon: <code>"#vwf-root"</code>. Alternatively, the parameter name may also be explicitly listed as defined below.

```yaml
---
view:
  vwf/view/glge: 
    application-root: "#vwf-root"
```

-------------------

### Default Drivers

By default, the following drivers are active:

* Threejs (vwf/model/threejs, vwf/view/threejs)
* Javascript (vwf/model/javscript)
* Object (vwf/model/object)
* Document (vwf/view/document)

Alternative driver options also include:

* Editor (vwf/view/editor)
* GLGE (vwf/model/glge, vwf/view/glge)
* JigLib (vwf/model/jiblib)
* Cesium (vwf/model/cesium, vwf/view/cesium)
* Google Earth (vwf/view/google-earth)
* Lesson (vwf/view/lesson)
* WebRTC (vwf/view/webrtc)

For 2D applications, or any application where the default drivers are not necessary, the keyword <code>nodriver</code> may be used. For example, in *tile-puzzle-2D*, a WebGL renderer is not required, and thus uses the following configuration:

```yaml
---
model:
  nodriver: 
```

-------------------

### Additional Information

In addition to defining the driver configuration for your application, the <code>config.yaml</code> file also allows you to set some additional information: an HTML title for the page. The following example configuration will set the title to the specified value, rather than the default *Virtual World Framework.*

```yaml
---
info:
  title: "My New VWF Application"
```

-------------------

### Passing Configuration Parameters in URL

An alternative option to using the <code>config.yaml</code> file is to pass in driver parameters via the URL. 

For instance, the Google Earth view driver may be loaded in an application without a configuration file:

	https://demo.virtual.wf/earth/#!google-earth

Both a model and a view driver may be loaded in an application with the following URL:

	https://demo.virtual.wf/humvee/?threejs#!threejs

Parameters may also be passed in via the URL. The following example passes in parameters for the application root and setting the pick interval:

	https://demo.virtual.wf/sandtable/?threejs#!threejs={"application-root":"#vwf-root","experimental-pick-interval":50}

**Note**: The URL takes precedence and will override anything defined via the configuration file.


