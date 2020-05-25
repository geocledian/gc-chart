# gc-chart widget v2
## Description
gc-chart is an embeddable JavaScript/HTML widget for visualizing the outputs of the ag|knowledge REST API from [geocledian](https://www.geocledian.com).
It is built as a reusable [Vue.js](https://www.vuejs.org) component which allows the integration in [Vue.js](https://www.vuejs.org) applications smoothly. 
You may but you don't have to build the rest of the container application with [Vue.js](https://www.vuejs.org).

## Purpose
With this widget you are able to visualize the statistics of one or more parcels and products (NDVI, NDWI, etc.) from the REST API of ag|knowledge from geocledian.com.
> **Please note** that the widget contains a DEMO API Key and a DEMO parcel. If you want to visualize your data it has to be registered first in the REST API of ag|knowledge from geocledian.com. <br> Contact us for getting an API Key and registering your data.

It is customizeable via HTML attributes and supports the following modes:
- visualizing all statistics graphs (min, max, mean, standard deviation) of one selectable remote sensing index of one parcel: "one-index"
![one_index](doc/img/one_index.png)
- visualizing all mean graphs from all remote sensing indices of one parcel: "many-indices"
![all_indices](doc/img/all_indices.png)
- visualizing mean graphs for a defined remote sensing index and a list of parcels: "many-parcels"
![many_parcels](doc/img/many_parcels.png)

The following attributes of the widget are configurable on declaration or may be changed by code:
- gc-apikey: API Key from geocledian, e.g. "39553fb7-7f6f-4945-9b84-a4c8745bdbec"; default: '39553fb7-7f6f-4945-9b84-a4c8745bdbec'
- gc-host: base host, e.g. "geocledian.com"; default: 'geocledian.com'
- gc-filter-string: filter string which may be defined externally; e.g. "&crop=bla"; default: ""
- gc-offset: offset in request which may be defined externally; e.g. 1000; default: 0
- gc-limit: limit of total parcels per request which may be defined externally; e.g. 100; default: 250
- gc-parcels: array of parcel objects to be displayed in the map; may be passed externally or loaded by the widget itself; default: []
- gc-parcel-id: default: "" 
- gc-selected-parcel-id: used to highlight a parcel in the map; may be set externally; default: -1
- gc-parcel-ids: default: "" 
- gc-available-products: limit the available products, e.g. "ndvi,ndwi"; default: "vitality,ndvi,ndwi,ndre1,ndre2,savi,evi2,cire,npcri,sos,pos,eos"
- gc-available-options: limit the available options, e.g. "" for not title at all; default: "optionsTitle,graphType,hideGraphs,dateZoom,markers,legend"
- gc-available-stats: limit the available statistics for one-index mode, e.g. "min,max"; default: "min,max,mean,stddev"
- gc-mode: choose from "one-index", "many-indices" or "many-parcel"; see above for details; default: "one-index"
- gc-selected-product: selected product for the comparison of the parcels in the map; may be set externally or by the product selector; default: ""
- gc-zoom-startdate: startdate as simple ISO date string for zooming into the chart, e.g. '2020-04-01'; default: ""
- gc-zoom-enddate: enddate as simple ISO date string for zooming into the chart, e.g. '2020-11-01'; default: ""
- gc-datezoom-layout
- gc-options-collapsed: start the widget with options collapsed; default: "true"
- gc-initial-loading: loads the parcels within this map component itself; if set to false the widget waits for gc-parcels to be set; default: "true"
- gc-selected-source: choose from the satellite sources: 'landsat8', 'sentinel2' or '' (all); default: ""
- gc-language: initial locale language for translation, e.g. "en" for english; default: "en"

## Integration
For the integration of the widget you'll have to follow three steps.

You have to add some dependencies in the head tag of the container website.

```html
<html>
  <head>

    <!--GC chart component begin -->

    <!-- loads also dependent css files via @import -->
    <link href="css/gc-chart.css" rel="stylesheet">
    <!-- init script for components -->
    <script src="js/gc-chart-init.js"></script> 

    <!--GC chart component end -->
  </head>

```

Then you may create the widget(s) with custom HTML tags anywhere in the body section of the website. Make sure to use an unique identifier for each chart component (chartid).

>If you want to change the id of the parent div ("gc-app") you'll have to change this divs' id also in the init script `gc-chart-init.js`, method `initComponent()`.


```html
<div id="gc-app">
  <gc-chart chartid="chart1" 
            gc-apikey="39553fb7-7f6f-4945-9b84-a4c8745bdbec" 
            gc-host="geocledian.com" 
            gc-parcel-id="4483"
            mode="one-index">
  </gc-chart>
  <gc-chart chartid="chart2" 
            gc-apikey="39553fb7-7f6f-4945-9b84-a4c8745bdbec" 
            gc-host="geocledian.com" 
            gc-parcel-id="4483"
            mode="many-indices">
  </gc-chart>
  <gc-chart chartid="chart3" 
            gc-apikey="39553fb7-7f6f-4945-9b84-a4c8745bdbec" 
            gc-host="geocledian.com" 
            gc-parcel-ids="4483,4486"
            mode="many-parcels">
  </gc-chart>
</div>
```


## Support
Please contact [us](mailto:info@geocledian.com) from geocledian.com if you have troubles using the widget!

## Used Libraries
- [Vue.js](https://www.vuejs.org)
- [c3.js](https://c3js.org/)

## Legal: Terms of use from third party data providers
- You have to add the copyright information of the used data. At the time of writing the following text has to be visible for [Landsat](https://www.usgs.gov/information-policies-and-instructions/crediting-usgs) and [Sentinel](https://scihub.copernicus.eu/twiki/pub/SciHubWebPortal/TermsConditions/TC_Sentinel_Data_31072014.pdf) data:

```html
 contains Copernicus data 2020.
 U.S. Geological Service Landsat 8 used in compiling this information.
```

**geocledian is not responsible for illegal use of third party services.**