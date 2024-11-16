# Tracking satellites and visualizing them

## Contents
- [Tracking satellites and visualizing them](#tracking-satellites-and-visualizing-them)
  - [Contents](#contents)
  - [Step by step breakdown of the task](#step-by-step-breakdown-of-the-task)
  - [Notes as I proceed](#notes-as-i-proceed)
  - [Some useful resources](#some-useful-resources)
  - [Notes and summary of each resource](#notes-and-summary-of-each-resource)
    - [What is TLE data for satellites and how can it be used to calculate trajectory of the object ?](#what-is-tle-data-for-satellites-and-how-can-it-be-used-to-calculate-trajectory-of-the-object-)
    - [Where and how can it be obtained](#where-and-how-can-it-be-obtained)
    - [Sidequest-1 : Satellite Times - by T. S. Kelso](#sidequest-1--satellite-times---by-t-s-kelso)
    - [Using this data to see what input and output look like](#using-this-data-to-see-what-input-and-output-look-like)
    - [How to process this data ( stitch it together)](#how-to-process-this-data--stitch-it-together)
    - [Theory for calculating orbital state vectors at given time using TLE and SGP4/SDP4](#theory-for-calculating-orbital-state-vectors-at-given-time-using-tle-and-sgp4sdp4)


## Step by step breakdown of the task

- [x] Look into data sources
  - [x] Understand NORAD data [documentation](https://celestrak.org/NORAD/documentation/)
  - [x] Understand spacetrack [data](https://www.space-track.org/#recent)
- [ ] Use data for predictions using varoius SGP models
  - [ ] understand calculation for predicting visiblity of satellite
    - [x] Understand Classical orbital elements
    - [x] Understand TLE
    - [ ] Understand SGP4
  - [ ] verify the predictions
- [ ] Process data
  - [ ] figure out a way to obtain this data in bulk abd convert it into JSON
  - [ ] classify data into useful categories
- [ ] make list of functionalities that can be derived using this data
- [ ] finalize required functionalities
- [ ] Build the page
  - [ ] make a barebones page with options to enter/select input and get predictioins as output
  - [ ] make 3js/webGL earth with proper mapping of coordinates
  - [ ] make satellites orbit visualization (moving satellite)
  - [ ] make plane tangent to the input coordinate and possibly draw azimuthal lines to satellite
  - [ ] live sky prediction with position of planets sun and satellites

## Notes as I proceed

Why this project?
- Many trackers exist but i dont fully understand how they work under the hood.
- I wish to make an educational interactive where people can get sense of this data/process, rather than just pretty visualization.
- Write explanation for each calculation and make it available publically.

## Some useful resources

- [**Celestrack**](https://celestrak.org/) - goldmine of data resources and what not. Mainly provides Two Line Element (TLE) data 3 time a day. which can be used for calculation of current orbital data using [Simplified perturbations models (SGP4)](https://en.wikipedia.org/wiki/Simplified_perturbations_models) [[see orekit](https://gitlab.orekit.org/orekit/orekit)] [[see shashwataks version for JS](https://github.com/shashwatak/satellite-js?tab=readme-ov-file)]
- [Space-track.org](https://www.space-track.org/) Has nearly all the Historical data one can ask for but it requires deep dive to understand some concepts and process the data.
- [N2YO](https://www.n2yo.com/api/) Website that churns data for you and provide API which can Get TLE,Get satellite positions,Get visual passes,Get radio passes,What's up? - functionalities
- [Ivan stanejovic](https://tle.ivanstanojevic.me/#/) --> API provides up to date NORAD two line element sets for number of Earth orbiting satellites. Data is provided by CelesTrak and served in web application friendly JSON format. A two-line element set (TLE) is a data format encoding of orbital elements of an Earth-orbiting object for a given point in time.
- [satellite js](https://github.com/shashwatak/satellite-js) --> A library to make satellite propagation via TLEs possible in the web. Provides the functions necessary for SGP4/SDP4 calculations, as callable javascript. Also provides functions for coordinate transforms.
- [rougue.space sattelite orbit visualizer](https://sky.rogue.space/) --> 3D visualization of over 25000 satellites currently in space. look at the source code and especially service workers.
- [Orekit ](https://www.orekit.org/) --> Orekit aims at providing accurate and efficient low level components for the development of flight dynamics applications. It is designed to be easily used in very different contexts, from quick studies up to critical operations. As a library, Orekit provides basic elements (orbits, dates, attitude, frames…) and various algorithms to handle them (conversions, propagations, pointing…).
- [glmatrix](https://glmatrix.net/) --> Hig performance matrix processing library for 3D webgl appplications.
- [Jonathan's space report](https://planet4589.org/space/gcat/) --> jonathan mcdowell is director of chandra space telescope. Releases [catalogue of all the satellites/objects in space till date](https://planet4589.org/space/gcat/data/derived/currentcat.html)
- **Some resources for calculations** : 
  - [TLE (Two-line element set) wiki](https://en.wikipedia.org/wiki/Two-line_element_set), [TLE celestrackm explaination](https://celestrak.org/NORAD/documentation/tle-fmt.php)
  - Calculating brightness of satellite pass [[Stack exchange ans1](https://stackoverflow.com/questions/19739831/is-there-any-way-to-calculate-the-visual-magnitude-of-a-satellite-iss), [Stack exchange ans2](https://space.stackexchange.com/questions/5142/how-to-calculate-the-brightness-of-a-passing-satellite), [arXiv paper](https://arxiv.org/abs/2305.11123) ]
- **Some resources for general space dynamics :**
  - [Astrodunamics](https://www.youtube.com/@alfonsogonzalez-astrodynam2207/) youtube channel
  - SPecially his [Play all
Orbital Mechanics with Python](https://www.youtube.com/playlist?list=PLOIRBaljOV8gn074rWFWYP1dCr2dJqWab) playlist
  - Visualizing satellite orbits : [webpage](https://alfonsogonzalez.github.io/AWP/)


## Notes and summary of each resource

### What is TLE data for satellites and how can it be used to calculate trajectory of the object ?
- TLE stands for two/three line elements set - used by NORAD and NASA
- It is a data format encoding a list of orbital elements of an Earth-orbiting object for a given point in time
- The TLE data representation is specific to the simplified perturbations models (SGP, SGP4, SDP4, SGP8 and SDP8), so any algorithm using a TLE as a data source must implement one of the SGP models to correctly compute the state at a time of interest.
- The breakdown of the same [can be found here](./notes/TLE.md)

### Where and how can it be obtained
Mainly available on two websites - celestrack and space-track

- **Celestrack** - provides daily updates of the TLE data for over 25K space objects
  - [GP data](https://celestrak.org/NORAD/elements/) - all GP data provided to the public have been derived from radar and optical observations of the US Space Surveillance Network (SSN). 
  - [SupGP](https://celestrak.org/NORAD/elements/supplemental/) - Higher precision tracking data made publicly available by the operators and converted to TLE by celestrack.
- **Space-track** - provides current and historical orbital data in TLE and OMM fomats for space objects (debris, payloads, etc.)
  - [Current data](https://www.space-track.org/#/recent) - Most recent Element set (ELSET) for all the tracked space obj are available here
  - [Historical ELSET](https://www.space-track.org/#/gp) - can be used to retrive historical data associated with given SATCAT id
  - [Origin of TLE data format](https://www.space-track.org/documentation#/tle) - Same old explanation + Alpha 5 format for TLE

### Sidequest-1 : [Satellite Times - by T. S. Kelso](https://celestrak.org/columns/)
Summary of all the edition of all the articles by T S Kelso (celsestrack), related to this satellite tracking buisness.

- 

### Using this data to see what input and output look like

### How to process this data ( stitch it together)

### Theory for calculating orbital state vectors at given time using TLE and SGP4/SDP4 
**Keplers orbital elements :** 