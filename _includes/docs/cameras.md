<a name="cameras"></a>

# Cameras

The camera capability provides the users a viewpoint into the app. Every app automatically creates a camera as part of the scene. This camera can be accessed in javascript through the *camera* property of the scene node, or through the editor. 

-------------------

### Creating New Cameras

New cameras can be created by creating a node that extends *http://vwf.example.com/camera.vwf*. 

	var newCamera = {
	  extends: "http://vwf.example.com/camera.vwf"
	};
	this.children.create("newCamera", newCamera);

See [components](#components) for more information about creating new nodes.

-------------------

### Camera Type

The **cameraType** property controls whether the camera is a *persepective* or *orthographic* camera. With a perspective camera, the further away an object is, the smaller it will appear. Orthographic cameras always display objects as their actual size. **cameraType** defaults to *perspective* and can be set using the following syntax.

	this.children['newCamera'].cameraType = "orthographic";

-------------------

### Transform Properties

The camera component extends from node3, and inherits the transform properties, such as translation and rotation. 

The **translation** property controls the position of the camera. Changing this property will move the camera to the new coordinates, and the view will automatically update with it. **translation** defaults to \[ 0, 0, 0 \] and can be set using the following syntax. The coordinate system defaults to +x to the right, +y forward, and +z up, if no rotation has been applied.

	this.children['newCamera'].translation = [ 100, -20, 30 ]; 
	// Moves the camera to 100 on the x-axis, -20 on the y-axis, and 30 on the z-axis

The **rotation** property controls the direction the camera is pointing, as an offset from the default orientation. Changing this property will rotate the camera and automatically update the view. The value takes the from of \[ x, y, z, angle \] where the amount rotation around an axis is axis * angle. 

	this.children['newCamera].rotation = [ 1, 2, 0.5, 90 ]; // From looking down the positive y-axis, rotate 90 degrees around the x-axis, rotation 180 degrees around the y-axis and 45 degrees around the z-axis.

Note that the x, y and z values in the rotation array are automatically normalized to a unit vector. So after the above example, reading the value of **rotation** would return \[ 0.4364357888698578, 0.8728715777397156, 0.21821792423725128, 90 \].

-------------------

### Clipping Plane

The **near** and **far** properties are used to control the clipping plane. **far** controls how far away from the camera another node can get before it is no longer displayed and **near** property controls how close to the camera another node can get before it is no longer displayed. The values of **near** and **far** are restricted so that 0 < near < far. They can be set with the following syntax.

	this.children['newCamera'].far = 10000;
	this.children['newCamera'].near = 1.0;

**near** and **far** also control the view buffer. The ratio of **far / near** should roughly match the size of the world, in order to have accurate depth calculations and avoid overlapping models.

-------------------

### Lookat

The **lookAt** property affects how the camera moves. If it is set to the id of another node, that node will always be at the center of the cameras view. If the position of the camera changes, the camera will automatically stay pointed at the other node. **lookAt** can only be set to a valid id, and defaults to "". It can be set using the following syntax.

	this.children['newCamera'].lookAt = this.children['interestingNode'].id;

-------------------

### Using Multiple Cameras

The application uses the **activeCamera** property of the scene to determine which camera to use as the main viewpoint. Other cameras can be created, but they will not affect what is displayed in the browser unless they have been set as the active camera. Cameras in the model are shared by all clients, and **activeCamera** will be seen by all clients, unless they switch to a different one in their private view. Setting **activeCamera** to the id of a camera will automatically switch the view that is displayed in the browser to the view of that camera.

	// this is the scene
	this.activeCamera = this.children['newCamera'].id;

-------------------
