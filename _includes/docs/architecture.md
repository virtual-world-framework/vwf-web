## <a name="partsofvwf">Parts of VWF</a>

<div style='width:100%;text-align:center'><img src='images/vwf-onion.png' alt='arch' width='512' /></div>

VWF consists of two pieces:

1. Core: Consists of the server and part of the client and ensures synchronization between the model state on every client.
2. Drivers: Add functionality to VWF by providing access to 3rd party libraries (like three.js for graphics)

VWF enables one to create:

1. Components: A meaningful unit of functionality. Components are the building blocks of VWF applications.  A component might contain a 3D model and/or it might contain some functionality.
2. Applications: This is a full VWF ... well ... application.  It's something that a user can sit down and use.

The VWF ecosystem is everything that exists to help developers create components and applications.  Many of the items listed in the *Ecosystem* circle are works in progress.

-------------------

## <a name="architecture">Anatomy of a VWF App</a>

VWF allows you to ignore the complexity of sharing state between multiple users. You focus on the logic of your app, and as long as you follow VWF conventions, nothing else must be done to achieve a synchronized state across multiple users. 

Let's look at the anatomy of a VWF app to understand a little of how it works under the hood.

### Model-view architecture

VWF has a model-view based architecture. Views exist for each client joined in the app. Each view provides input into a model that keeps track of the state of the simulation. 

<div style='width:100%;text-align:center'><img src='images/arch1.png' alt='arch' width='512' /></div>

The single model, or shared state, of the application has multiple copies that represent the shared simulation. 

<div style='width:100%;text-align:center'><img src='images/arch2.png' alt='arch' width='512' /></div>

Each client then has their own replicated model that they take with them. The model, however, remains the same as the one that every other user is viewing. All clients show the same state with each having an identical copy of the app. The app are separately but simultaneously updated to retain identical states. 

The app then is a state machine. The same state machine is in different locations (different clients). If the state machines all have the same properties and children, they will all move to the same successive state.

A client's browser may have multiple views. For example, a user may see a renderer view and an editor view in their browser window. The renderer view shows a 3D visualization of the model state, and the editor view shows the hierachy of the scene and the pieces that make it up such as it's properties and children.

<div style='width:100%;text-align:center'><img src='images/arch3.png' alt='arch' width='512' /></div>

External inputs from one user get thrown "across the moat" into the shared simulation (model) \[1\]. The model deflects incoming input from a view, and sends it directly to the reflector \[2\]. The reflector can then send out the information to all of the replicated models \[3\]. Thus all inputs to a model happen identically on the timeline to all clients within the application. 

<div style='width:100%;text-align:center'><img src='images/arch4.png' alt='arch' width='512' /></div>

The architecture separates external input from internal input. All external input (ie. user input from a view), once received by the model is deferred to the reflector, which then sends it out to everyone. However, the model is free to make any additional state changes (ie. internal input) provided that it was caused by something internal to the model. This would include things such as setter methods that can manipulate other internal properties. 

### The Model side

The application's main model file is usually named `index.vwf.yaml`.  The `index` part can actually be replaced with any name, but if it is named `index.vwf.yaml`, the filename is not necessary in the browser url (only the path leading to it).  It can actually also be a .json file instead (`index.vwf.json`).  We use .yaml because of its human-readableness.

Everything in the *model* is automatically syncrhonized across all users.  Let's take a look at how the model is composed.

#### Nodes

A *node* is the atomic unit of state in the VWF model.  The application's entire model state is comprised of a tree of nodes.

#### Components

A tree of nodes that forms a functional unit (for example, a tree composed of a car node that has four children tire nodes) is called a *component*.

Since a component can actually be made from a single node (since that is technically a tree ... just a very simple one), you will sometimes catch us calling individual nodes components.

To summarize: the model side of a VWF application is made up of one or more components, which are in-turn made up of one or more components.  Like this:

<div style='width:100%;text-align:center'><img src='images/arch5.png' alt='arch' width='600' /></div>

Additionally, components may extend prototype components, and will inherit their properties, methods, and events. A prototype may have multiple components that extend it in an application.  Like this:

<div style='width:100%;text-align:center'><img src='images/arch6.png' alt='arch' width='600' /></div>

Since components are such a big deal in VWF, we'll come back to them in more detail in the [components](#components) section where we show you the structure of a component definition.  And if you want to see what components already exist inside VWF that you can use as prototypes in your applications, check out the [prototypes](#prototypes) section. 

But for now, let's move onto talking about the other half of a VWF application ... the *view*.

### The View side

The application's main model file is usually named `index.vwf.html`.  Again, just like the model file, it can actually be named anything, but the part before the `vwf.html` needs to match that part of the model files name.

The view side is what the user interacts with.  It contains the logic for anything that is user-specific (like the logic for a user controlling their personal avatar, etc).  Therefore, the view is not synchronized across every user.

The main file is an html file, and it is the primary means for creating 2D elements in your application (3D elements are handled by the three.js driver, but that is a topic for later).  From this file you may also include untold numbers of `.js` files to implement view-side logic (like the aformentioned user controlling their avatar).

In a VWF application, the model does not know that the view exists.  The view knows that the model exists and can listen for changes to it (and perform some view-side logic as a result).  It can also take user input and create its own changes to the model by setting properties and calling methods (etc) on those components we mentioned in the last section.

-------------------
