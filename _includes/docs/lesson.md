<a name="lesson"></a>

# Add Training Instruction

One purpose of using VWF is to create a lesson app, with the intent of teaching a user how to accomplish a series of tasks, or steps in a process. 

We'll start with the simplest form of a lesson - one with a single correct path. This means there is only one sequence of steps in the lesson, and no choice of which step to take next.

-------------------

### The Task Component

At every step, the lesson will issue a task to the student. The sequence of tasks will form the building blocks of the lesson. The [task component](http://virtual.wf/web/docs/jsdoc_cmp/symbols/lesson.task.vwf.html) serves as the prototype for lesson tasks, and may be used for each required lesson step. 

The task component contains the following properties that can be set in the lesson model file:

* <code>text</code>: Text to display to the user to explain the task
* <code>cameraPoseRef</code>: Search string used to find a node3 that represents the transform to which the camera will move at the beginning of this task
* <code>scenePath</code>: xpath reference to the top node of the scene to which the lesson listens for task completion events
* <code>taskIndex</code>: Index of the currently active subtask; used internally and does not need to be explicitly set in the application

In the following example, we'll focus on the <code>text</code> and <code>cameraPoseRef</code> properties. 

The task component also consists of the following methods and events:

Methods:

* <code>enter</code>
* <code>next</code>
* <code>exit</code>

Events:

* <code>entering</code>
* <code>completed</code>
* <code>exiting</code>

We can use the events defined above to add steps to the event handlers for each task. For instance, the <code>entering</code> event is in most cases the best place to define the success event, or the step required to complete the task (i.e. fire the <code>completed</code> event), as stated in the text property.

	this.entering = function() {
	  var self = this;
	  appObject.pointerClick = appObject.events.add( function() {
	    appObject.pointerClick = appObject.events.flush( this );
	    this.completed();
	  }, this );
	}

-------------------

### Setting Up Lesson Structure in the Model

One can turn a VWF application into an instructional lesson by adding a task hierarchy to the model, using the <code>task</code> component type, described above.

First we'll need to add an overall lesson task as a child of the application. 

	--- 
	extends: http://vwf.example.com/scene.vwf
	children:
	  lesson:
	    extends: http://vwf.example.com/lesson/task.vwf
	    properties:
	      scenePath: /

Subtasks of the lesson can then be defined as children of the lesson component. Here the <code>text</code> and <code>cameraPosRef</code> are set, and the <code>entering</code> event is used to define the success event - where clicking on the app object flushes the click event and calls the completed event for the step. 

        children:
          step1:
            extends: http://vwf.example.com/lesson/task.vwf
            properties:
              text: First, do the first task.
              cameraPoseRef: /cameraPose1
            scripts:
            - |
              this.entering = function() {
                this.logger.info( "Step 1 entering" );
                var self = this;
                var appObject = this.find( "/applicationObject" )[ 0 ];
                appObject.pointerClick = appObject.events.add( function() {
                  appObject.pointerClick = appObject.events.flush( this );
                  this.logger.info( "Step 1 completed" );
                  self.completed();
                }, this );
              } //@ sourceURL=step1.entering
              this.exiting = function() {
                this.logger.info( "Step 1 exiting" );
              } //@ sourceURL=step1.exiting

The overall lesson entering script can also be defined, as needed.

        scripts:
        - |
          this.entering = function() {
            this.logger.info( "Lesson entering" );
          } //@ sourceURL=lesson.entering
          this.exiting = function() {
            this.logger.info( "Lesson exiting" );
          } //@ sourceURL=lesson.exiting

Additionally, the cameraPoses referenced in the task properties each need to be defined. These represent the transform to which the camera will move at the beginning of the task. 

      cameraPose1:
        extends: http://vwf.example.com/node3.vwf
        properties:
          translation: [ 0, 0, 0 ]
          rotation: [ 1, 0, 0, 0 ]

Thus the complete lesson hierarchy is defined in the VWF model, including all lesson tasks, their cameraPoses, and their entering and exit methods. 

#### Multiple Levels

For more complex lessons, define tasks with a structure that is more than one level deep. These levels of tasking can be used for tasks that consist of multiple actions, or for those requiring additional instructions in order to complete. 

	lesson:
	  extends: http://vwf.example.com/lesson/task.vwf
	  properties:
	  scenePath: /
	  children:
	    step_1:
	      extends: http://vwf.example.com/lesson/task.vwf
	      properties:
	        text: "1.0"
	        cameraPoseRef: /lesson/cameraPose1
	      children:
	        step_1_1:
	          extends: http://vwf.example.com/lesson/task.vwf
	          properties:
	            text: "1.1"
	          children:
	            step_1_1_1:
	              extends: http://vwf.example.com/lesson/task.vwf
	              properties:
	                text: "1.1.1"
	              scripts:
	              - |
	                this.entering = function() {
	                  this.logger.info( "Step: 1.1.1" );
	                }
	        step_1_2:
	          extends: http://vwf.example.com/lesson/task.vwf
	          properties:
	            text: "1.2"
	          children:
	            step_1_2_1:
	              extends: http://vwf.example.com/lesson/task.vwf
	              properties:
	                text: "1.2.1"
	              scripts:
	              - |
	                this.entering = function() {
	                  this.logger.info( "Step: 1.2.1" );
	                }

The standard lesson interface view driver, described below, supports multiple levels automatically. The figure below shows an example lesson with three levels of tasks in the hierarchy below the overall lesson task. Any additional levels will be appended to the innermost content section. 

<div style='width:100%;text-align:center'><img src='images/lesson.png' alt='hierarchy' /></div>

-------------------

### Add Lesson Interface to the View

The user interface for the lesson will mainly be defined in the app using the lesson view driver. The primary interface for a lesson will consist of the instructional text for each lesson step, a bar to show overall lesson progress, and navigation buttons to start, complete, and skip over lesson tasks.

In order to pull in the lesson view driver (defined in *support/client/lib/vwf/view/lesson.js*), we simply need to create a configuration file for the application and activate the lesson view.

The configuration file will have the same name as the model file, with the addition of a *.config*. For instance, if your model file is entited *index.vwf.yaml*, the configuration file will be titled *index.vwf.config.yaml*. 

The contents of the file will look as follows:

	---
	model:
	  vwf/model/threejs:
	view:
	  vwf/view/threejs: "#vwf-root"
	  vwf/view/lesson: 

This configuration sets the renderer to use the threejs model and view driver in addition to the lesson view driver. 

By activating the lesson driver, the app's user interface will automatically be updated to autogenerate an instruction panel upon lesson start. This instruction panel will pull in the <code>text</code> properties defined in the task components in the model. Additionally, the instruction panel will update based on <code>entering</code> and <code>completed</code> events fired in order to show the current step and progress of the overall lesson. 

Visit the [humvee lesson](https://demo.virtualworldframework.com/humvee-lesson) to view the final result.

--------------

