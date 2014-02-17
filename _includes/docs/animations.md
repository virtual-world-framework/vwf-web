## <a name="animations">Animations</a>

### Animation Behavior

The primary way to accomplish animations in VWF is the animation behavior. All components that extend node3 automatically implement the animation behavior, which provides standardized methods and properties for creating and executing an animation. 

In order to create an animation on a node, the <code>animationUpdate</code> method needs to be implemented. This method is called each time the animation time changes, and is used to update the node to the correct state for that time.

	scripts:
	- |
	  this.animationUpdate = function(time, duration) {
	    // Animate the node. For example, update the translation based on the time
	    this.translateBy([0, 0, 1 * time], 0);
	  }

The animation can then be started by calling the <code>animationPlay</code> method and stopped by calling <code>animationStop</code>.

Common properties used to customize the animation include:

* <code>animationDuration</code> - The length of the animation
* <code>animationRate</code> - The animation playback rate
* <code>animationLoop</code> - Whether or not the animation should replay after reaching the end

A full list of methods and properties can be found under [animation](http://demo.virtual.wf/web/docs/jsdoc_cmp/symbols/animation.vwf.html) in the [Application API](#application-api).

-------------------

### Collada Animations

Animations defined in the collada document will also be loaded and available to the framework. They are controlled the same way as animations created in a component, except there is no need to implement an <code>animationUpdate</code> method, since the animation information is pulled from the collada file.

Common properties used to customize collada animations include:

* <code>animationStartTime</code> - The time the animation should start at. Used to play a subsection of the animation.
* <code>animationStopTime</code> - The time the animation should stop at. Used to play a subsection of the animation.
* <code>animationStartFrame</code> - Equivalent to animationStartTime, but in frames, instead of seconds.
* <code>animationStopFrame</code> - Equivalent to animationStopTime, but in frames, instead of seconds.
* <code>fps</code> - The frames per second the animation should play at.

-------------------

### Future Call

Animations can also be created using the future call. The VWF future call can be used to run a method at a specified time in the future. This call can be inserted into the method call chain, and a parameter passed with an amount of time from the current point for when the method should be called. An example of the future call is shown below. 

	methods:
	  methodName: |
	    if( criteriaMet )
	    {
	      doSomething();
	      this.future( 0.05 ).methodName();
	    }

The future call schedules the next step. The parameter passed to the function call can be raised or lowered to smooth or optimize the animation, respectively.

Future calls may also be used for property assignment or to fire an event at a given time in the future. 

	this.future.eventName();
	this.future.propertyName = value;

