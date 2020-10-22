# What is mapzarf?

Mapzarf is a framework for creating data-driven tile-based map applications.  
It has the Javascript (and a tiny bit of HTML) to create all the controls
for a tile-based map.  Using the data file, you can specify 
* what layers you want to show (and in which order),
* what geographical area to show (center lat, center lng, and zoom), 
* whether you want a marker,
* the title of the page and some explanatory text
* (optionally) the URL of the content you want in the marker's popup (possibly
  varying based on the lat/lng)
* (optionally) the URL of a legend for each layer
* (optionally) the URL of name/lat/lngs of cities to show on the map (based
  on the bounds of the map)
Once you specify that, mapzarf will
* create the map,
* create controls for selecting specific layers, turning layers on or off,
  showing cities or not, 
* keep a "sharing URL" updated, allowing your users to show others 
  exactly what they were seeing, with the same map layers, centerpoint,
  zoom, etc.

You can see examples of mapzarf in action at:

* http://maps.webfoot.com/demos/gunDeaths/mapzarf.html
* http://maps.webfoot.com/demos/taxRoi/mapzarf.html
* http://maps.webfoot.com/demos/congress2012/mapzarf.html

Each of those has an associated file in the same directory called
  _mapApplicationInfo.json_
which drives the layout of the page and which layers are shown.

# Terminology

*MAI*: Short for MapApplicationInfo, the JSON file which describes how the
page will be laid out, which layers will be used, etc.

*Layer*: Each thing that might be shown or plotted -- like the 
median income, the location of schools, or the state borders -- is a layer.

[*Choropleth*](http://en.wikipedia.org/wiki/Choropleth_map): Map where areas are coloured (i.e. showing polygons and not 
points).  These are a type of thematic map.

*Layerset*: Layers can be combined into _layersets_.  Only one layer per
layerset can be visible at a time, but one from each can be visible (if
the layerset visibility checkbox is checked).  This means that if you have
a layer that is partially clear, you can stack them together.  For example,
I commonly make maps which have a choropleth (e.g. median income by county),
a dots layer (e.g. locations of gun homicides), and a border layer (e.g.
state borders).

*LayerSpec*: The second of the MAI file which describes a specific layer.
           NOTE: the "S" is capitalized.

*Slippy map framework*: A framework/API for making an draggable/zoomable
map with map tiles, e.g. Google Maps, Bing Maps, Leaflet, etc.

[*Cartogram*](http://en.wikipedia.org/wiki/Cartogram): A cartogram is a 
map which has been distorted so that the area of a jurisdiction is 
proportional to some attribute of that jurisdiction (frequently the population).
I like to make choropleth cartograms.  :-)

# What is NOT covered by the JSON file?

Five things:

1. Mapzarf doesn't make the tiles.  You need to find tiles yourself.  As is, you can specify three different layer types, two of which are my own custom types and one of which is very simple (low-featured) but which can do basically any tile type.
1. Mapzarf doesn't control layout and presentation of the page; that's covered by the HTML and CSS.  You can put the various pieces of the page anywhere you want by changing the HTML and CSS.
1. Mapzarf does't fill in the marker's popups.  You need to specify a URL which will get give that text (but that URL will get lat/lng appended to it, so you can vary what text is in the popup based on the lat/lng).  (Set mapApplicationInfo.pointInfo).
1. Mapzarf doesn't make the city icons or generate the list of cities.  (Set citiesUrl and cityIconUrl.)
1. Mapzarf doesn't make the legends.  You need to give it the URL of an image for the layer.  (Set legendUrl.)



# Can I put two maps on one page?
Not yet, but the way the code is structured, it shouldn't be too hard
to add that someday.  (I haven't figured out how to specify which 
controls should be shared between the two and which should be separate,
for one.)


# Why "mapzarf"?

I decided that if I was going to put this on github, I would need to 
call it something different than "my generalized map framework".  
I know that it is easier to find something on the Web if it has a unique
name, so I started thinking about obscure words which I liked.  I like 
"zarf", and not just because it is worth hella points in Scrabble.

A zarf is "a cup which holds a glass", and I realized that it was a good
word for this project: it is the HTML/javascript which holds a map.  
And combining map+zarf made it unique.

# Who wrote this?
Originally by Kaitlin Duck Sherwood, ducky@webfoot.com, for use at
[http://maps.webfoot.com](http://maps.webfoot.com).
