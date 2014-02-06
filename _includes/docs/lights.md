<a name="lights"></a>

# Lights
 
VWF provides control of lighting within an app. VWF provides default lighting if none is specified. In addition, there are three basic light types that can be created within the framework. Each light has properties associated with it that can be manipulated, including attenuation, effects, and shadows. A complete list of light properties can be found under [light](http://demo.virtual.wf/web/docs/jsdoc_cmp/symbols/light.vwf.html) in the [Application API](#application-api).

-------------------

### Light Types

#### Point

A point light is represented by a point source in 3D space, and emits light in all directions. The closer an object is to the light source, the more illuminated it becomes.

~~~
 Omni01:
    extends: http://vwf.example.com/light.vwf
    properties:
      lightType: "point"
      translation: [ -150, 150, 150 ]
~~~~

#### Directional

Directional lights equally illuminate all objects from a given direction. An application should only have a small number of directional lights if needed, as computations for directional lights need to be done on all pixels on the screen. 

~~~
  dir1:
    extends: http://vwf.example.com/light.vwf
    properties:
      lightType: "directional"
      rotation: [ 1, 0, 0, -10 ]
~~~~

#### Spot

Spot lights emit light in a cone shape instead of a sphere. Other than that, spot lights and point lights share the similar properties. Spot lights also have the additional properties of **spotCosCutOff** and **spotExponent**, as described in the light API.

~~~
 Spot01:
    extends: http://vwf.example.com/light.vwf
    properties:
      lightType: "spot"
      spotCosCutOff: 0.95
      spotExponent: 10
      translation: [ -150, 150, 150 ]
~~~~

-------------------

### Lighting Effects

#### Specular Reflection

Specular reflection is the reflection of light from a surface where the ray is reflected in a single direction. 

#### Diffuse Reflection
   
Diffuse reflection is the reflection of light from a surface where the ray is reflected at many angles.

-------------------

