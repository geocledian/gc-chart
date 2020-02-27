/*
 Vue.js Geocledian chart component
 created: 2019-11-04, jsommer
 last update: 2020-02-25, jsommer
 version: 0.9
*/
"use strict";

Date.prototype.simpleDate = function () { 
  var a = this.getFullYear(),
    b = this.getMonth() + 1,
    c = this.getDate();
  return a + "-" + (1 === b.toString().length ? "0" + b : b) + "-" + (1 === c.toString().length ? "0" + c : c)
}

Vue.component('gc-chart', {
  props: {
    chartid: {
      type: String,
      default: 'chart1',
      required: true
    },
    gcApikey: {
      type: String,
      default: '39553fb7-7f6f-4945-9b84-a4c8745bdbec'
    },
    gcHost: {
      type: String,
      default: 'geocledian.com'
    },
    gcParcelId: {
      default: -1
    },
    gcParcelIds: {
      type: String,
      default: ""
    },
    products: {
      type: String,
      default: "vitality,ndvi,ndwi,ndre1,ndre2,savi,evi2,cire,npcri"
    },
    mode: {
      type: String,
      default: "one-index" // "one-index" || "many-indices" || "many-parcels"
    },
    gcZoomStartdate:  {
      type: String,
      default: "" // ISO date string, e.g. '2018-03-01'
    },
    gcZoomEnddate:  {
      type: String,
      default: "" // ISO date string, e.g. '2018-10-01'
    },
    entity: {
      type: String,
      default: "" // entity filter
    },
    crop: {
      type: String,
      default: "" // crop filter
    },
    name: {
      type: String,
      default: "" // name filter
    },
    initialLoading: {
      type: String,
      default: "true" // "true": load first parcels by filter or "false": wait for parcelIds to be set later (e.g. from Portfolio)
    },
    gcSelectedParcelId: {
      type: Number,
      default: -1
    },
    gcParcels: { 
      type: Array, 
      default: function () { return [] }
    },
    gcSelectedProduct: {
      type: String,
      default: ""
    }
  },
  template: `<div :id="chartid" class="gc-chart">          
            <div>
            <p class="chartOptionsTitle is-size-6 is-orange is-inline-block" style="margin-bottom: 1.0rem; cursor: pointer;" 
                v-on:click="toggleChartOptions">
               Chart options 
              <i class="fas fa-angle-down fa-sm"></i>
            </p>

            <div :id="'chartOptions_'+chartid" class="chartOptions is-horizontal is-flex is-hidden"
                  style="max-height: 6.6rem !important;">

            <div class="field">
              <div class="field-label"><label class="label has-text-left is-grey">Graph type</label></div>
              <div class="field-body">
                <div class="select is-small">
                <select v-model="selectedGraphType">
                  <option value="line">Lines</option>
                  <option value="spline">Splines</option>
                  <option value="area-spline">Area Splines</option>
                </select>
                </div>
              </div>
            </div>

            <div class="field is-vertical" v-if="mode=='one-index'">
              <div class="field-label"><label class="label has-text-left is-grey">Hide graphs</label></div>
              <div class="field-body" style="overflow-y: auto; height: 6.4rem;">
                <div class="control">
                  <div class="field is-horizontal">
                    <div class="field-body">
                      <div class="control">
                        <label class="label is-grey is-small">
                          <input class="is-small" :id="'chkChartHideMean_'+chartid" type="checkbox" value="mean" v-model="hidden_graphs"> Mean </label>
                      </div>
                    </div>
                  </div>         
                  <div class="field is-horizontal">
                    <div class="field-body">
                      <div class="control">
                        <label class="label is-small is-grey">
                          <input class="is-small" :id="'chkChartHideMin_'+chartid" type="checkbox" value="min" v-model="hidden_graphs"> Minimum </label>
                      </div>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <div class="field-body">
                      <div class="control">
                        <label class="label is-small is-grey">
                          <input class="is-small" :id="'chkChartHideMax_'+chartid" type="checkbox" value="max" v-model="hidden_graphs"> Maximum </label>
                      </div>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                      <div class="field-body">
                        <div class="control">
                          <label class="label is-small is-grey">
                            <input class="is-small" :id="'chkChartHideStdDev_'+chartid" type="checkbox" value="std.dev." v-model="hidden_graphs"> Standard deviation</label>
                        </div>
                      </div>
                  </div>
                  <div class="field is-horizontal">
                    <div class="field-body">
                      <div class="control">
                        <label class="label is-small is-grey">
                          <input class="is-small" :id="'chkChartHideMarker_'+chartid" type="checkbox" value="marker" v-model="hidden_graphs"> Marker</label>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
            </div>
            <div class="field" v-if="mode=='one-index'">
              <div class="field-label"><label class="label has-text-left is-grey">Marker</label></div>
              <div class="field-body">
                <div class="select is-small">
                  <select v-model="selectedMarkerType">
                    <option value="phenology">Phenology</option>
                    <option value="sn_marker">SN Marker</option>
                  </select>
              </div>
            </div>  
            </div>

            <!-- date filter -->
            <div class="field is-vertical">
              <div class="field-label">
                <label class="label is-grey is-small has-text-left"> Date Zoom</label>
              </div>
              <div class="field-body is-horizontal">
                <div class="control has-icons-left" style="padding-bottom: 10px; max-width: 7.4rem;">
                  <input :id="'inpFilterDateFrom_'+this.chartid" type="text" class="input is-small"
                    placeholder="[YYYY-MM-DD]" v-model="chartFromDate">
                  <span class="icon is-small is-left">
                      <i class="fas fa-clock fa-lg"></i>
                  </span>
                </div>
              </div>
              <div class="field-body is-horizontal">
                <div class="control has-icons-left" style="padding-bottom: 10px; max-width: 7.4rem;">
                  <input :id="'inpFilterDateTo_'+this.chartid" type="text" class="input is-small"
                        placeholder="[YYYY-MM-DD]"  v-model="chartToDate">
                  <span class="icon is-small is-left">
                      <i class="fas fa-clock fa-lg"></i>
                  </span>
                </div>
              </div>  
            </div>
          </div>
          </div><!-- chart settings -->

          <div :id="'chartNotice_'+chartid" class="content is-hidden"></div>

          <div :id="'chartSpinner_'+chartid" class="chartSpinner spinner is-hidden">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>

          <div style="position: relative;">
          <div :id="'chart_'+chartid" class="gc-chart"></div>

          <!-- product selector -->
          <div class="field product-selector is-hidden" style="position: absolute; right: 0rem; top: -1.4rem;">
          <!--div class="field-label"><label class="label has-text-left is-grey" style="margin-bottom: 4px;">Product</label></div-->
            <div class="field-body has-text-bold">
              <div class="select is-normal" v-if="mode!='many-indices'">
              <select v-model="selectedProduct" title="Choose a product!">
                <option v-for="p in availableProducts" v-bind:value="p">
                  <span v-if="p == 'vitality'">{{capitalize(p)}}</span>
                  <span v-else>{{p.toUpperCase()}}</span>
                </option>
                </select>
              </div>
              <!-- div class="select is-normal is-multiple" v-else>
                <select multiple size="2" v-model="availableProducts" title="Choose products!">
                <option v-for="p in availableProducts" v-bind:value="p">
                  <span v-if="p == 'vitality'">{{capitalize(p)}}</span>
                  <span v-else>{{p.toUpperCase()}}</span>
                </option>
                </select>
              </div-->
            </div>
          </div> <!-- product selector -->

          </div>
          <!-- watermark -->
          <div class="is-inline-block is-pulled-right" style="opacity: 0.65; position: relative; bottom: 2.1rem; margin-right: 0.1rem;">
            <span style="verticalalign: top; font-size: 0.7rem;">powered by</span><br>
            <img src="img/logo.png" alt="geo|cledian" style="width: 100px; margin: -10px 0;">
          </div>

          </div>
          <!-- chart -->`,
  data: function () {
    return {
      chart: undefined,
      statistics : [],
      statisticsMany : [],
      selectedSource: "",
      internalSelectedProduct: "",
      parcels: [],
      //selectedProducts: ["vitality", "ndvi", "ndre1", "ndre2", "ndwi", "savi", "evi2", "cire", "npcri"],
      currentRasterIndex: 0,
      apiKey: this.gcApikey,
      apiHost: this.gcHost,
      apiUrl: "https://" + this.gcHost +"/agknow/api/v3",
      offset: 0,
      pagingStep: 1000,
      total_parcel_count: 250,
      chartLegendVisible: true,
      similarity : { content_parcel : [], content_reference: [], similarity: {}, summary: {}, classification: {} },
      phenology : { phenology : { statistics: {}, growth: {}, markers: [] }, summary: {} },
      currentGraphContent : "statistics", // statistics || similarity || phenology
      selectedGraphType: "line",
      selectedMarkerType: "phenology",
      sn_markers: {},
      selectedDate: "",
      hidden_graphs: [],  //"vitality","ndre2","savi", "evi2", "cire", "npcri"],
      internalZoomStartdate: new Date(new Date().getUTCFullYear()-1, 2, 1), // last YEAR-03-01
      internalZoomEnddate: new Date(new Date().getUTCFullYear()-1, 10, 1), // last YEAR-11-01
      inpFilterDateFromPicker: undefined,
      inpFilterDateToPicker: undefined
    }
  },
  computed: {
    currentParcelID:  {
      get: function() {
          return this.gcParcelId;
      },
      set: function(newValue) {
        this.$root.$emit('selectedParcelIdChange', newValue);
      }
    },
    availableProducts: {
      get: function() {
        return (this.products.split(","));
      },
      set: function(newValue) {
        this.products = newValue;
      }
    },
    selectedParcelIds: {
      get: function () {
        if (this.mode == "many-parcels") {
          
          // case if parcel ids are not defined - take the first 10 parcels 
          // from the result of the filterString against the API
          if (this.parcelIds.length == 0) {
            if (this.initialLoading == "true") {
              /* limited to maximum of 10 parcels if parcelIds are not set ! */
              return this.parcels.map(p => parseInt(p.parcel_id)).slice(0,10);
            } else { 
                return []; //return empty for waiting on changing parcelids from external setting (e.g. Portfolio)
            }
          }
          else {
            // case for defined parcel ids
            if (this.parcelIds.split(",").length <= 10)
              return this.parcelIds.split(",").map(p=>parseInt(p));
            else
              return []; //empty
          }
        }
        else  { // other graph modes
          if (this.parcelIds.length == 0) {
            /* limited to maximum of 10 parcels if parcelIds are not set ! */
              return this.parcels.map(p => parseInt(p.parcel_id)).slice(0,10);
            //return this.parcels.map(p => p.parcel_id);
          }
          else {
            return this.parcelIds.split(",").map(p=>parseInt(p)).slice(0,10);
          }
        }
      },
      set: function (newValue) {
        this.parcelIds = newValue;
      }
    },
    chartWidth: function() {
        console.debug("clientwidth "+document.getElementById(this.chartid).clientWidth);
        console.debug("offsetwidth "+document.getElementById(this.chartid).offsetWidth);
        return parseInt(document.getElementById(this.chartid).offsetWidth);
    },
    chartHeight: function() {
        console.debug("clientheight "+document.getElementById(this.chartid).clientHeight);
        console.debug("offsetheight "+document.getElementById(this.chartid).offsetHeight);
        //return parseInt(document.getElementById(this.chartid).offsetHeight);
        return parseInt(document.getElementById(this.chartid).style.height);
    },
    filterString: {
      get: function() {
        //return "&crop="+this.crop+"&entity="+this.entity+"&name="+this.name;
        return this.gcFilterString;
      },
      set: function(newValue) {
        /*
        this.crop = this.getQueryVariable(newValue, "crop") ? this.getQueryVariable(newValue, "crop") : "";
        this.entity = this.getQueryVariable(newValue, "entity") ? this.getQueryVariable(newValue, "entity") : "";
        this.name = this.getQueryVariable(newValue, "name") ? this.getQueryVariable(newValue, "name") : "";*/

        //notify root - through props it will change this.gcFilterString
        this.$root.$emit('filterChange', newValue);
      }
    },
    chartFromDate: {
      get: function() {
        if (this.isDateValid(this.gcZoomStartdate))
          return this.gcZoomStartdate;
        else {
          if (this.isDateValid(this.internalZoomStartdate))
            return this.internalZoomStartdate;
        }
      },
      set: function (newValue) {
        if (this.isDateValid(newValue)) {
          this.internalZoomStartdate = newValue;

          if (this.isDateValid(this.chartFromDate) && this.isDateValid(this.chartToDate))
            this.chart.zoom([this.chartFromDate, this.chartToDate]);
        }
      }
    },
    chartToDate: {
      get: function() {
        if (this.isDateValid(this.gcZoomEnddate))
          return this.gcZoomEnddate;
        else {
          if (this.isDateValid(this.internalZoomEnddate))
            return this.internalZoomEnddate;
        }
      },
      set: function (newValue) {
        if (this.isDateValid(newValue)) {
          this.internalZoomEnddate = newValue;
          if (this.isDateValid(this.chartFromDate) && this.isDateValid(this.chartToDate))
            this.chart.zoom([this.chartFromDate, this.chartToDate]);
        }
      }
    },
    selectedProduct: {
      get: function() {
        // workaround for external setting of not existent product (sos,eos,pos) 
        // fallback to vitality if present
        if (["sos","eos","pos"].includes(this.gcSelectedProduct) && this.availableProducts.includes("vitality")){
          return "vitality";
        }
        else {
          if (this.gcSelectedProduct.length>0)
            return this.gcSelectedProduct;
          else
            return this.internalSelectedProduct;
        }
      },
      set: function (newValue) {
        this.internalSelectedProduct = newValue;
        //notify root - through props it will change this.gcSelectedProduct
        this.$root.$emit('selectedProductChange', newValue);
      }
    },
    parcelIds: {
      get: function() {
        return this.gcParcelIds;
      },
      set: function (newValue) {
        //notify root - through props it will cha nge this.gcSelectedProduct
        this.$root.$emit('parcelIdsChange', newValue);
      }
    },
  },
  created: function () {},
  /* when vue component is mounted (ready) on DOM node */
  mounted: function () {

    //console.log(this);
    document.getElementById("chart_" + this.chartid).classList.add("is-hidden");
    document.getElementById("chartSpinner_" + this.chartid).classList.remove("is-hidden");

    //overwrite statisticsMany
    if (this.mode == "many-indices") {
      this.statisticsMany = {vitality: [], ndvi: [], ndre1: [], ndre2: [], ndwi: [], savi: [], evi2: [], cire: [], npcri: [] };
    }
    if (this.mode == "many-parcels") {
      this.statisticsMany = [];
    }
    //set first of available products to the selected one
    if (this.mode == "one-index" || this.mode == "many-parcels") {
      this.selectedProduct = this.availableProducts[0];
    }

    /* init chart */
    this.chart = c3.generate({
      bindto: '#chart_'+this.chartid,
      data: {
        x: 'x',
        columns: []
      },
      grid: {
        x: {
            show: true
        },
        y: {
            show: true
        }
      },
      axis: {
        x: {
            type: 'timeseries',
            tick: {
                fit: false,
                format: "%e %b %y"
            }
        },
        y: {
            label: { text: '',
                    position: 'outer-top'}
        }
      }
    });

    /* watermark */
    /*d3.select(this.chart.internal.config.bindto)
      .style ("background-image", "url('img/logo_opaque_50.png')")
      .style ("background-size", "220px")
      .style("background-repeat", "no-repeat")
      .style("background-position-x", "100%")
      .style("background-position-y", "85%")
    ;*/
    
    //initial loading data
    if (this.currentParcelID > 0) {
      this.getAllParcels(this.currentParcelID, this.offset, this.filterString);
    }
    else {
      this.getAllParcels(undefined, this.offset, this.filterString);
    }

    //init datepickers - load external Javascript file in this component
    this.loadJSscript("css/bulma-ext/bulma-calendar.min.js", function() {

      this.inpFilterDateFromPicker = new bulmaCalendar( document.getElementById( 'inpFilterDateFrom_'+this.chartid ), {
        startDate: new Date(this.internalZoomStartdate), // Date selected by default
        dateFormat: 'yyyy-mm-dd', // the date format `field` value
        lang: 'en', // internationalization
        overlay: false,
        closeOnOverlayClick: true,
        closeOnSelect: true,
        // callback functions
        onSelect: function (e) { 
                    // hack +1 day
                    var a = new Date(e.valueOf() + 1000*3600*24);
                    this.internalZoomStartdate = a.toISOString().split("T")[0]; //ISO String splits at T between date and time
                    }.bind(this),
      });

      this.inpFilterDateToPicker = new bulmaCalendar( document.getElementById( 'inpFilterDateTo_'+this.chartid ), {
        startDate: new Date(this.internalZoomEnddate), // Date selected by default
        dateFormat: 'yyyy-mm-dd', // the date format `field` value
        lang: 'en', // internationalization
        overlay: false,
        closeOnOverlayClick: true,
        closeOnSelect: true,
        // callback functions
        onSelect: function (e) { 
                    // hack +1 day
                    var a = new Date(e.valueOf() + 1000*3600*24);
                    this.internalZoomEnddate = a.toISOString().split("T")[0]; //ISO String splits at T between date and time
                    }.bind(this),
      });
      }.bind(this)
    );
  },
  watch: {
    chartFromDate: function (newValue, oldValue) {
            
      console.debug("event - chartFromDateChange");
      if (this.isDateValid(newValue)) {
        if (new Date(newValue).getTime() < new Date(this.chartToDate).getTime()) {
            if (this.isDateValid(this.chartFromDate) && this.isDateValid(this.chartToDate))
              this.chart.zoom([this.chartFromDate, this.chartToDate]);
        }
      }
    },
    chartToDate: function (newValue, oldValue) {

        console.debug("event - chartToDateChange");
        if (this.isDateValid(newValue)) {
          if (new Date(newValue).getTime() > new Date(this.chartFromDate).getTime()) {
              if (this.isDateValid(this.chartFromDate) && this.isDateValid(this.chartToDate))
                this.chart.zoom([this.chartFromDate, this.chartToDate]);
          }
        }
    },
    selectedProduct: function (newValue, oldValue) {

      if (newValue != oldValue) {
        console.debug("event - selectedProductChange");

        if (this.parcels.length > 0) {

          if (this.mode == "one-index") {
            this.getParcelsProductData(this.getCurrentParcel().parcel_id, this.selectedProduct, this.selectedSource);
            // only load stats if product is not visible
            if (newValue != 'visible') {
              if (document.getElementById("chkChartHideMarker_"+this.chartid).checked) {
                getMarkers(this.getCurrentParcel().parcel_id);
              }
              else {
                this.sn_markers = {};
              }
              this.getIndexStats(this.getCurrentParcel().parcel_id, this.selectedSource, this.selectedProduct);
            }
          }
          if (this.mode == "many-parcels") {
            console.debug(this.selectedParcelIds);
            for (var i = 0; i < this.selectedParcelIds.length; i++) {
              let parcel_id = this.selectedParcelIds[i];
              //this.getParcelsProductData(parcel_id, this.selectedProduct, this.selectedSource);
              // only load stats if product is not visible
              if (newValue != 'visible') {
                this.getIndexStats(parcel_id, this.selectedSource, this.selectedProduct);
              }
            }
          }
          //should never reach here because selectedProduct should not be set in this mode!

          /*if (this.mode == "many-indices") {
            for (var i = 0; i < this.availableProducts.length; i++) {
              //this.getParcelsProductData(this.getCurrentParcel().parcel_id, this.availableProducts[i], this.selectedSource);
              // only load stats if product is not visible
              if (newValue != 'visible') {
                this.getIndexStats(this.getCurrentParcel().parcel_id, this.selectedSource, this.availableProducts[i]);
              }
            }
          }*/
        }
      }
    },
    availableProducts: function (newValue, oldValue) {

      console.debug("event - availableProductsChange");

      if (this.parcels.length > 0) {

        if (this.mode == "one-index") {
          this.getIndexStats(this.getCurrentParcel().parcel_id, this.selectedSource, this.selectedProduct);
        }
        if (this.mode == "many-parcels") {
          for (var i = 0; i < this.selectedParcelIds.length; i++) {
            let parcel_id = this.selectedParcelIds[i];
            this.getParcelsProductData(parcel_id, this.selectedProduct, this.selectedSource);
            // only load stats if product is not visible
            if (newValue != 'visible') {
              this.getIndexStats(this.selectedParcelIds[i], this.selectedSource, this.selectedProduct);
            }
          }
        }
        if (this.mode == "many-indices") {
          for (var i = 0; i < this.availableProducts.length; i++) {
            this.getParcelsProductData(this.getCurrentParcel().parcel_id, this.availableProducts[i], this.selectedSource);
            // only load stats if product is not visible
            if (newValue != 'visible') {
              this.getIndexStats(this.getCurrentParcel().parcel_id, this.selectedSource, this.availableProducts[i]);
            }
          }
        }
      }
    },
    selectedSource: function (newValue, oldValue) {
            
      console.debug("event - selectedSourceChange");
      
      let p = this.getCurrentParcel();
      p.timeSeries = [];

      //TODO activate / deactivate dynamic S2 indices dependent on data source
      // toggle_products_data_source_compatibility(newValue);

      //only if valid parcel id
      if (this.currentParcelID > 0) {
        this.getParcelsProductData(this.getCurrentParcel().parcel_id, this.selectedProduct, this.selectedSource);
          
        //select first element
        this.currentRasterIndex = 0;
      }
    },
    currentParcelID: function (newValue, oldValue) {

      console.debug("event - currentParcelIDChange");
      //only for certain modes refresh
      if (this.mode == "one-index" || this.mode == "many-indices") {
        this.handleCurrentParcelIDchange(newValue, oldValue);
      }
    },
    parcelIds: function (newValue, oldValue) {
      //may double loading on start and parcelIdsChange through external component
      // this.initialLoading is set to "true"

      console.debug("event - parcelIdsChange");

      if (this.parcelIds.length > 0) {

        if (this.mode == "many-parcels") {
          for (var i = 0; i < this.selectedParcelIds.length; i++) {
            let parcel_id = this.selectedParcelIds[i];
            if (parcel_id)
              this.getIndexStats(parcel_id, this.selectedSource, this.selectedProduct);
          }
        }
      }
      else
        this.chart.unload();

    },
    currentRasterIndex: function (newValue, oldValue) {
            
      if (newValue != oldValue) {
          console.debug("event - currentRasterIndexChange");

          //if (this.getCurrentRaster() && chart) {
          //    chartUpdateCurrentMarker();
          //}
      }
    },
    statistics: function (newValue, oldValue) {

      console.debug("event - statisticsChange");

      // create chart from values, if they change
      this.createChartData();

      if (!this.isDateValid(this.gcZoomStartdate))
        this.chartFromDate = newValue[0].date;
      if (!this.isDateValid(this.gcZoomEnddate))
        this.chartToDate = newValue[newValue.length-1].date;
      
      // zoom in any case 
      //TODO will also be triggered in chartFromDate / chartToDate setter
      if (this.isDateValid(this.chartFromDate) && this.isDateValid(this.chartToDate))
        this.chart.zoom([this.chartFromDate, this.chartToDate]);
    },  
    statisticsMany: {
      handler: function (newValue, oldValue) {

          console.debug("event - statisticsManyChange");

          // create chart from values, if they change
          this.createChartData();

          if (this.mode == "many-indices") {
            // only if there are values
            if (newValue[this.availableProducts[0]][0]) {
              if (!this.isDateValid(this.gcZoomStartdate)) // first date of first product
                this.chartFromDate = newValue[this.availableProducts[0]][0].date;
              if (!this.isDateValid(this.gcZoomEnddate)) // last date of first product
                this.chartToDate = newValue[this.availableProducts[0]][newValue[this.availableProducts[0]].length-1].date;
            }
          }

          // zoom in any case on valid date
          if (this.isDateValid(this.chartFromDate) && this.isDateValid(this.chartToDate)) {
            this.chart.zoom([this.chartFromDate, this.chartToDate]);
          }
      },
      deep: true //important for watching theses changes!
    },
    hidden_graphs: function (newValue, oldValue) {
      if (newValue != oldValue) {
        this.chart.show(); // reset first
        if (this.hidden_graphs.includes("mean")) {
            this.hidden_graphs.push("means2");
            this.hidden_graphs.push("meanl8");
        }
        else {
            this.hidden_graphs = this.removeFromArray(this.hidden_graphs, "means2");
            this.hidden_graphs = this.removeFromArray(this.hidden_graphs, "meanl8");
        }
        this.chart.hide(this.hidden_graphs);
      }
    },
    selectedGraphType: function (newValue, oldValue) {
      if (newValue != oldValue) {
          console.debug("event - selectedGraphTypeChange");

          console.debug("graph type changed!")
          console.debug(newValue);
          
          if (this.mode == "one-index") {  
            // change for all data except std.dev.
            this.chart.transform(newValue, "mean");
            this.chart.transform(newValue, "min");
            this.chart.transform(newValue, "max");
            this.chart.transform(newValue, "parcel (mean)");
            this.chart.transform(newValue, "reference (mean)");
          }
          if (this.mode == "many-indices") {
            this.chart.transform(newValue, "ndvi");
            this.chart.transform(newValue, "ndwi");
            this.chart.transform(newValue, "ndre1");
            this.chart.transform(newValue, "ndre2");
            this.chart.transform(newValue, "savi");
            this.chart.transform(newValue, "evi");
            this.chart.transform(newValue, "cire");
            this.chart.transform(newValue, "npcri");
            this.chart.transform(newValue, "vitality");
          }
          if (this.mode == "many-parcels") {
            for (var i = 0; i < this.selectedParcelIds.length; i++) {
              this.chart.transform(newValue, this.selectedParcelIds[i]);
            }
          }
      }
    },
    selectedMarkerType: function (newValue, oldValue) {
      if (newValue != oldValue) {
          console.debug("event - selectedMarkerTypeChange");

          if (this.selectedMarkerType == "sn_marker") {
              //this.getMarkers(this.getCurrentParcel().parcel_id);
          }
          //switch between phenology and SN marker
          // create chart from values, if they change
          this.createChartData();
      }
    },
    gcSelectedParcelId: function (newValue, oldValue) {
      // highlight graph in chart
      this.chart.focus(parseInt(newValue));
    }
  },
  methods: {
    getAllParcels: function(parcel_id, offset, filterString) {

      //download in chunks of n parcels
      let limit = this.pagingStep;
  
      let params = "/parcels?key=" + this.apiKey + "&limit="+limit; //set limit to maximum (default 1000)
  
      if (offset) {
          params = params + "&offset=" +offset;
      }
      if (filterString) {
          params = params + filterString;
      }
  
      let xmlHttp = new XMLHttpRequest();
      let async = true;
      
      //Show requests on the DEBUG console for developers
      console.debug("getAllParcels()");
      console.debug("GET " + this.apiUrl + params);
  
      xmlHttp.onreadystatechange=function()
      {
          if (xmlHttp.readyState==4)
          {
              var tmp  = JSON.parse(xmlHttp.responseText);
  
              if (tmp.content == "key is not authorized") {
                  // show message, hide spinner
                  document.getElementById("chartNotice_" + this.chartid).innerHTML = "Sorry, the given API key is not authorized!<br> Please contact <a href='https://www.geocledian.com'>geo|cledian</a> for a valid API key.";
                  document.getElementById("chartNotice_" + this.chartid).classList.remove("is-hidden");
                  document.getElementById("chartSpinner_" + this.chartid).classList.add("is-hidden");
                  return;
              }
              if (tmp.content == 	"api key validity expired") {
                  // show message, hide spinner
                  document.getElementById("chartNotice_" + this.chartid).innerHTML = "Sorry, the given API key's validity expired!<br> Please contact <a href='https://www.geocledian.com'>geo|cledian</a>for a valid API key.";
                  document.getElementById("chartNotice_" + this.chartid).classList.remove("is-hidden");
                  document.getElementById("chartSpinner_" + this.chartid).classList.add("is-hidden");
                  return;
              }
  
              this.parcels = [];
  
              if (tmp.content.length == 0) {
                  //clear details and map
                  //clearGUI();
                  return;
              }
  
              for (var i = 0; i < tmp.content.length; i++) {
                  var item = tmp.content[i];
                  this.parcels.push( item );
              }

              try {
                if (this.mode == "one-index" || this.mode == "many-indices") {
                  // if parcel_id was given as an argument to the function
                  // set this value as currentParcelID
                  if (parcel_id)  {
                      this.currentParcelID = parcel_id;
                      console.debug("setting "+ parcel_id +" parcel id as current!");
                      // hack needed to call the change explicitely if the filter includes the first element
                      // of previously unfiltered parcels!
                      // 1=1 -> no change in watch of vuejs
                      this.handleCurrentParcelIDchange(-1, this.currentParcelID);
                  }
                  else {
  
                      console.debug("setting first parcel as current!");
  
                      this.currentParcelID = this.parcels[0].parcel_id;
                      // hack needed to call the change explicitely if the filter includes the first element
                      // of previously unfiltered parcels!
                      // 1=1 -> no change in watch of vuejs
                      if (this.currentParcelID == this.parcels[0].parcel_id) {
                          this.handleCurrentParcelIDchange(-1, this.parcels[0].parcel_id);
                      }
  
                      console.debug("currentParcelID: "+ this.currentParcelID);
                  }
                }
                else { 
                  this.handleCurrentParcelIDchange();
                }
              }
              catch (err) {
                  console.debug("error selecting parcel_id");
                  console.debug(err);
              }
              
          }
      }.bind(this);
      xmlHttp.open("GET", this.apiUrl + params, async);
      xmlHttp.send();
    },
    // hack; see getAllParcels() for explanation
    handleCurrentParcelIDchange: function () {

      console.debug("methods - handleCurrentParcelIDchange");

      //refresh messages
      //clear first!
      //this.messages = [];

      //only if valid parcel id
      if (this.currentParcelID > 0) {
        if (this.selectedMarkerType == "sn_marker") {
          this.getMarkers(this.getCurrentParcel().parcel_id);
        }
        else {
          this.sn_markers = {};
        }
      
        //reset phenology because it depends on date entries of parcels
        // thus phenology must be called by user
        //this.phenology = { phenology : { statistics: {}, growth: {}, markers: [] }, summary: {} };

        if (this.mode == "one-index") {
          this.getIndexStats(this.getCurrentParcel().parcel_id, this.selectedSource, this.selectedProduct);
        }
        if (this.mode == "many-indices") {
          for (var i = 0; i < this.availableProducts.length; i++) {
            this.getIndexStats(this.getCurrentParcel().parcel_id, this.selectedSource, this.availableProducts[i]);
          }
        } 
      }
      if (this.mode == "many-parcels") {
        for (var i = 0; i < this.selectedParcelIds.length; i++) {
          let parcel_id = this.selectedParcelIds[i];
          if (parcel_id)
            this.getIndexStats(parcel_id, this.selectedSource, this.selectedProduct);
        }
      }

    },
    getParcelsProductData: function (parcel_id, productName, source) {

      //show spinner
      document.getElementById("chartSpinner_" + this.chartid).classList.remove("is-hidden");

      let params = "/parcels/" + parcel_id + "/" + productName + "?key=" +
        this.apiKey + "&source=" + source +
        "&order=date";

      let xmlHttp = new XMLHttpRequest();
      let async = true;

      //Show requests on the DEBUG console for developers
      console.debug("getParcelsProductData()");
      console.debug("GET " + this.apiUrl + params);

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          //console.log(xmlHttp.responseText);
          let tmp = JSON.parse(xmlHttp.responseText);
          let row = this.getCurrentParcel();

          if (tmp.content.length > 0) {
            // add new attributes via Vue.set

            // one parcel can have 1-n rasters of the same product (time series!)
            // add all rasters (=time series)
            Vue.set(row, "timeSeries", tmp.content); //url + tmp.content[0].png + "?key=" + key);

            //set max value of timeslider
            //document.getElementById("inpTimeSlider").max = tmp.content.length -1;

            //show raster in map
            //this.showCurrentRaster();

            //enable time slider buttons
            //disableTimeSlider(false);

            //hide spinner
            document.getElementById("chartSpinner_" + this.chartid).classList.add("is-hidden");
          }

        }
      }.bind(this);
      xmlHttp.open("GET", this.apiUrl + params, async);
      xmlHttp.send();
    },
    getCurrentParcel: function () {

      if (this.currentParcelID > 0) {
        // parcel_id assumed unique, so return only the first
        // compare strings
        return this.parcels.filter(p => p.parcel_id + "" == this.currentParcelID + "")[0];
      }
    },
    getParcel: function (parcel_id) {

      if (parcel_id > 0) {
        // parcel_id assumed unique, so return only the first
        // compare strings
        return this.parcels.filter(p => p.parcel_id + "" == parcel_id + "")[0];
      }
    },
    getIndexStats: function(parcel_id, source, product) {

      document.getElementById("chartNotice_"+this.chartid).classList.add("is-hidden");
      document.getElementById(this.chartid).getElementsByClassName('product-selector')[0].classList.add('is-hidden');
      document.getElementById("chart_" + this.chartid).classList.add("is-hidden");
      document.getElementById("chartSpinner_" + this.chartid).classList.remove("is-hidden");
  
      let productName = product;
  
      // may happen on selected product visible and change to another parcel
      if (productName == "visible") {
          // so local product name to vitality so it fetches NDVI stats
          productName = "vitality";
      }
      
      var params = "/parcels/"+parcel_id+"/"+ productName +"?key="+
                      this.apiKey +"&source="+ source + //landsat8 | sentinel2 | <empty string>
                      "&order=date&statistics=true"; //statistics are only applicable to vitality product!
  
      var xmlHttp = new XMLHttpRequest();
      var async = true;
  
      //Show requests on the DEBUG console for developers
      console.debug("getIndexStats()");
      console.debug("GET " + this.apiUrl + params);
  
      //clear chart
      this.chart.unload();
  
      xmlHttp.onreadystatechange=function()
      {
          if (xmlHttp.readyState==4)
          {
            //console.log(xmlHttp.responseText);
            var tmp  = JSON.parse(xmlHttp.responseText);
            var row = this.getParcel(parcel_id);
            
            if (tmp.content.length > 0) {
              
                // which one is active
                this.currentGraphContent = "statistics";

                // only chart data is necessary here
                if (this.mode == "one-index") {
                  this.statistics = tmp.content;
                }
                if (this.mode == "many-parcels") {
                  //Vue.set(row, "timeSeries", []);
                  //row.timeSeries.push({"statistics": tmp.content, "product": product});
                  
                  let parcel = this.statisticsMany.find(p=>parseInt(p.parcel_id) == parseInt(parcel_id));

                  if (parcel) {
                    //console.debug("before update - this.statisticsMany.length: " +this.statisticsMany.length);
                    //console.debug("parcel_id: " +parcel_id);
                    let idx = this.statisticsMany.indexOf(parcel);
                    parcel[productName] = tmp.content;
                    //existent -> update with new product
                    //console.debug("idx: " + idx);
                    this.statisticsMany.splice(idx, 1, parcel);
                    //console.debug("after update - this.statisticsMany.length: " +this.statisticsMany.length);
                  }
                  else {
                    //console.debug("before insert - this.statisticsMany.length: " +this.statisticsMany.length);
                    //console.debug("parcel_id: " +parcel_id);
                    parcel =  {"parcel_id": parseInt(parcel_id)};
                    parcel[productName] = tmp.content;
                    //new -> insert
                    this.statisticsMany.push(parcel);
                    //console.debug("after insert - this.statisticsMany.length: " +this.statisticsMany.length);
                  }
                  
                  console.debug(this.statisticsMany);
                }
                if (this.mode == "many-indices") {
                  this.statisticsMany[productName] = tmp.content;
                }

            }
        }
      }.bind(this);

      xmlHttp.open("GET", this.apiUrl + params, async);
      xmlHttp.send();
    },
    createChartData: function() {

      console.debug("createChartData()");
      console.debug(this.currentGraphContent);
      console.debug(this.mode);

      let chartType = this.currentGraphContent;
      let columns = [];

      if (chartType == "statistics") {
        if (this.mode == "one-index") {
          if (this.statistics.length > 0) {

            let filteredStats = this.statistics.filter(s=>s.statistics != null);

            // map axis to values
            columns[0] = ["x"].concat( filteredStats.map( r => r.date) );
            // format values to 2 decimals
            columns[1] = ["mean"].concat( filteredStats.map( r => this.formatDecimal(r.statistics.mean, 3)));
            columns[2] = ["std.dev."].concat( filteredStats.map( r => this.formatDecimal(r.statistics.stddev, 3)));
            columns[3] = ["min"].concat( filteredStats.map( r => this.formatDecimal(r.statistics.min, 3)));
            columns[4] = ["max"].concat( filteredStats.map( r => this.formatDecimal(r.statistics.max, 3)));            
            columns[5] = ["meanl8"].concat( filteredStats.map(function(r) { if (r.source === "landsat8") { 
                                                                                    return this.formatDecimal(r.statistics.mean, 3); }
                                                                                else { return null;} 
                                                                    }.bind(this)));
            columns[6] = ["means2"].concat( filteredStats.map(function(r) { if (r.source === "sentinel2") { 
                                                                                    return this.formatDecimal(r.statistics.mean, 3); } 
                                                                                else { return null;} 
                                                                    }.bind(this)));
          }
        }
        if (this.mode == "many-indices") {
          // map x axis to values of first available product
          columns[0] = ["x"].concat( this.statisticsMany[this.availableProducts[0]].map( r => r.date) );
          console.debug("first x axis is "+this.availableProducts[0]);
          //vitality may have other dates than the dynamic indices -> another x axis necessary
          if (this.availableProducts.includes("vitality")){
            columns[1] = ["x3"].concat( this.statisticsMany["vitality"].filter(s=>s.statistics != null).map( r => r.date) );
          }
          // map y axis
          for (var i=0; i < this.availableProducts.length; i++) {
            let product = this.availableProducts[i];
            let filteredStats = this.statisticsMany[product].filter(s=>s.statistics != null);
            //place the new column after the existing one(s)
            columns[columns.length] = [product].concat( filteredStats.map( r => this.formatDecimal(r.statistics.mean, 3)));
          }
          /*columns[2] = ["ndvi"].concat( this.statisticsMany["ndvi"].map( r => this.formatDecimal(r.statistics.mean, 3)));
          columns[3] = ["ndre1"].concat( this.statisticsMany["ndre1"].map( r => this.formatDecimal(r.statistics.mean, 3)));
          columns[4] = ["ndre2"].concat( this.statisticsMany["ndre2"].map( r => this.formatDecimal(r.statistics.mean, 3)));
          columns[5] = ["ndwi"].concat( this.statisticsMany["ndwi"].map( r => this.formatDecimal(r.statistics.mean, 3)));
          columns[6] = ["cire"].concat( this.statisticsMany["cire"].map( r => this.formatDecimal(r.statistics.mean, 3)));
          columns[7] = ["savi"].concat( this.statisticsMany["savi"].map( r => this.formatDecimal(r.statistics.mean, 3)));
          columns[8] = ["evi2"].concat( this.statisticsMany["evi2"].map( r => this.formatDecimal(r.statistics.mean, 3)));
          columns[9] = ["npcri"].concat( this.statisticsMany["npcri"].map( r => this.formatDecimal(r.statistics.mean, 3)));
          columns[10] = ["vitality"].concat( this.statisticsMany["vitality"].map( r => this.formatDecimal(r.statistics.mean, 3)));*/

        }
        if (this.mode == "many-parcels") {

          // map x axis to values of first available parcel
          /*let parcel_id = this.selectedParcelIds[0];
          let firstParcel = this.getParcel(parcel_id);
          
          columns[0] = ["x"].concat( firstParcel.timeSeries.statistics[this.selectedProduct].map( r => r.date) );
          
          //vitality may have other dates than the dynamic indices -> another x axis necessary
          if (this.availableProducts.includes("vitality")){
            // take the first parcel's stats for vitality
            columns[1] = ["x3"].concat( firstParcel.timeSeries.statistics["vitality"].map( r => r.date) );
          }
          // map y axis
          for (var i=0; i < this.selectedParcelIds.length; i++) {
            let parcel_id = this.selectedParcelIds[i];
            let parcel = this.getParcel(parcel_id);
            //place the new column after the existing one(s)
            columns[columns.length] = [parcel_id].concat( parcel.timeSeries.statistics[this.selectedProduct].map( r => this.formatDecimal(r.statistics.mean, 3)));
          }*/

          //console.debug(this.statisticsMany);

          if (this.statisticsMany.length > 0) {

            // create x axis for each parcel to map values index based y values to it
            for (var i=0; i < this.selectedParcelIds.length; i++) {
              let parcel_id = this.selectedParcelIds[i];
              let idx = this.selectedParcelIds.indexOf(parcel_id);
              let parcel = this.statisticsMany.find(p => p.parcel_id == parcel_id);

              if (parcel) {
                let parcelStats = parcel[this.selectedProduct];
                if (parcelStats) {
                  //important! map parcel to the index position in selectedParcelIds 
                  //then the correct x axis may be mapped later in createChart()
                  //exclude null statistics
                  let filteredStats = parcelStats.filter(s=>s.statistics != null);
                  columns[idx] = ["x"+idx].concat( filteredStats.map( r => r.date) );
                }
              }
            }
            
            // fill columns with data (i.e. map y axis)
            for (var i=0; i < this.selectedParcelIds.length; i++) {
              let parcel_id = this.selectedParcelIds[i];
              let parcel = this.statisticsMany.find(p => p.parcel_id == parcel_id);

              if (parcel) {
                let parcelStats = parcel[this.selectedProduct];
                if (parcelStats) {
                  //place the new column after the existing one(s)
                  //exclude null statistics
                  let filteredStats = parcelStats.filter(s=>s.statistics != null);
                  columns[columns.length] = [parcel_id].concat( filteredStats.map( r => this.formatDecimal(r.statistics.mean, 3)));
                }
              }
            }
          }
        }
            
        // markers
        try {
            let markers;
            if (this.selectedMarkerType == "sn_marker") {
                if (this.sn_markers) {
                    markers = this.sn_markers.markers;
                }
            }
            if (this.selectedMarkerType == "phenology") {
                if (this.phenology.phenology) {
                    markers = this.phenology.phenology.markers;
                }
            }

            if (markers) {
                // sort object by date in place
                markers.sort((a, b) => (a.date > b.date) ? 1 : -1);
            
                if (markers.length > 0) {
                    //workaround for unfinished API: filter out date: "None"
                    let dates_markers = markers.map( r => r.date != "None" ? r.date : NaN );

                    // map date values to the second x axis
                    columns[7] = ["x2"].concat(dates_markers);
                    // format values to 2 decimals
                    columns[8] = ["marker"].concat( markers.map(r => this.formatDecimal(r.mean, 3)));                                                                    
                }
            }
        }
        catch (err) {
            console.log("error getting markers!");
            console.error(err);
        }

        document.getElementById("chartNotice_"+this.chartid).classList.add("is-hidden");
        /*
        document.getElementById("similaritySummaryDiv").classList.add("is-hidden");
        document.getElementById("phenologyResultsDiv").classList.add("is-hidden");*/

        if (this.mode == "many-parcels") {
          //create chart when all data is ready - not earlier as this leads to undefined entries in data array
          // error: t[i] is undefined in c3.js
          // columns.length is double the size of the selectedParcelIds (x array + y array)
          if ( columns.length == this.selectedParcelIds.length*2) {
            
            this.createChart(columns);
            document.getElementById("chartSpinner_" + this.chartid).classList.add("is-hidden");
            document.getElementById("chart_" + this.chartid).classList.remove("is-hidden");

          }
          else 
            console.debug("createChartData() - not ready yet: not all statistics processed!")
        }
        else {
          this.createChart(columns);
          document.getElementById("chartSpinner_" + this.chartid).classList.add("is-hidden");
          document.getElementById("chart_" + this.chartid).classList.remove("is-hidden");
        }

        // if not changed, the values default to seeding/harvest date of parcel
        // so it does not harm if phenology is not clicked
        /*if ( isDateValid(document.getElementById("inpPhenologyStartDate").value) &&
              isDateValid(document.getElementById("inpPhenologyEndDate").value) ) {
                this.chartFromDate = document.getElementById("inpPhenologyStartDate").value;
                this.chartToDate = document.getElementById("inpPhenologyEndDate").value;
        }*/
        
        //chartUpdateCurrentMarker();
      }
      if (chartType == "similarity") {
          
          if (this.similarity.content_parcel.length > 0) {
  
              let columns = [];
  
              this.createChart(columns);
              document.getElementById("chartSpinner_" + this.chartid).classList.add("is-hidden");
              document.getElementById("chart_" + this.chartid).classList.remove("is-hidden");
              //prepareSimilarityData();
              
          }
      }
    },
    createChart: function(data) {

      console.debug("createChart()");

      let xs_options = {};
      // will be changed for many-parcels mode
      let types_options = { "mean": this.selectedGraphType, 'std.dev.' : 'bar', 'min': this.selectedGraphType,
                            'max':this.selectedGraphType, 'meanl8' : 'scatter', 'means2' : 'scatter', //special types
                            'parcel (mean)': this.selectedGraphType , 'reference (mean)' : this.selectedGraphType,
                            'marker': 'scatter'
                        };
      if (this.mode == "one-index") {
        xs_options = {
          "mean": "x",
          "means2": "x",
          "meanl8": "x",
          "min" : "x",
          "max" : "x",
          "std.dev." : "x",
          "parcel (mean)" : "x2",
          "reference (mean)" : "x2",
          "marker" : "x2",
        }
      }
      if (this.mode == "many-indices") {

        for (var i=0; i < this.availableProducts.length; i++) {
          const product = this.availableProducts[i];
          if (product != "vitality")
            xs_options[product] = "x";
          else
            xs_options[product] = "x3";
        }
        xs_options["parcel (mean)"] = "x";
        xs_options["reference (mean)"] = "x2";
      }

      if (this.mode == "many-parcels") {

        for (var i=0; i < this.selectedParcelIds.length; i++) {
          const parcel_id = this.selectedParcelIds[i];
          const idx = this.selectedParcelIds.indexOf(parcel_id);
          xs_options[parcel_id] = "x"+idx;
          types_options[parcel_id] = this.selectedGraphType;
        }
      }

      var axis_label;
      if (this.mode == "one-index") {
        if (this.selectedProduct == "vitality" || this.selectedProduct == "variations" ||  this.selectedProduct == "visible") {
            axis_label = "NDVI";
        }
        else {
            axis_label = this.selectedProduct.toUpperCase();
        }
      }
      else {
        axis_label = "Index [mean]";
      }

      console.debug("data: ");
      console.debug(data);
      console.debug("xs: ");
      console.debug(xs_options);
  
      this.chart = c3.generate({
        bindto: '#chart_'+this.chartid,
        //fixHeightResizing: true,
        data: {
            selection: {
                enabled: true,
                isselectable: function (d) { 
                    // disable selection for marker, similarity
                    if (d.id == "marker" || d.id == "reference (mean)" || d.id == "parcel (mean)")
                    {
                        return false;
                    }
                    else {
                        return true;
                    }
                },
                multiple: false,
                grouped: false
              },
            // single x axis
            //x: 'x',
            // multiple x axis mapping
            xs: xs_options,
            //xFormat: '%Y-%m-%d', // how the date is parsed
            columns: data,
            names: {
                meanl8: 'landsat8',
                means2: 'sentinel2'
            },
            //hide: [ data[3], data[4] ], //hide min and max
            hide: this.hidden_graphs,
            type: 'line', //default,
            types: types_options,
            /*labels: {
                    format: function (value, id, index, subindex) { 
                            //only Label marker
                            if (id == "marker") {
                                return this.sn_markers.markers[index].name;
                            }
                        }
            },*/
            colors: {
                "mean": '#EF7D00', //orange
                "std.dev.": ' #d6d6d6', //'#7d00ef', //light purple
                "min": '#EF7D00', 
                "max": '#EF7D00',
                "meanl8" : '#0500ef', //light blue
                "means2" : '#00eaef', //turquoise
                "parcel (mean)" : '#EF7D00', //orange
                "reference (mean)" : '#1f77b4', //blue
                "marker" : 'grey' //{fill: 'darkgrey', stroke: 'black'}
            },
            color: function (color, d) {
                // d will be 'id' when called for legends
                // otherwise: {id, value, index}
                // console.log(d);

                //must return a color string (e.g. #0000ff)
                // if (d.id == "min" || d == "min") {
                // if (d.index) {
                //     if (this.statistics[d.index].source == "landsat8") {
                //         return "#000000";
                //     }
                //     //else return previously defined color
                //     else { return color; }
                // }

                //return color by marker status
                if (d.id == "marker") {
                    //return color by marker status of json (green, yellow, red)
                    let c;
                    if (this.selectedMarkerType == "sn_marker") {
                        c = this.sn_markers.markers[d.index].status;
                    }
                    if (this.selectedMarkerType == "phenology") {
                        c = this.phenology.phenology.markers[d.index].status;
                    }

                    return c;
                }
                else {
                    return color; //default
                }
            },
            onselected: function (e, svgElement) {
                
                console.debug("onselectedChange()");
                // only enabled if current graph content is statistics
                if (this.currentGraphContent == "statistics") {
                    // update timeslider also
                    //this.currentRasterIndex = e.index;
                    
                    // for queryDate of portfolio map
                    this.selectedDate = e.x.simpleDate();
                    
                    // emitting to root instance
                    this.$root.$emit('queryDateChange',this.selectedDate);
                }
            }.bind(this)
        },
        //nicer splines, default is "cardinal"
        spline: {
            interpolation: {
              type: 'monotone'
            }
        },
        legend: {
            item: {
              onclick: function (id) {
                  //special case for mean, toggle also sentinel2 and landsat8 scatter points
                  if (id == "mean") {
                      this.chart.toggle("mean");
                      this.chart.toggle("meanl8");
                      this.chart.toggle("means2");
                  }
                  else { this.chart.toggle(id); }
                }.bind(this)
            }
        },
        line: {
            connectNull: true
        },
        point: { //'mean': 
                // type:'rectangle',
                // l:6,
                // b:6
                show: true,  //show data points in line chart
                //r: 3, //radius of points in line chart
                focus: {
                    expand: {
                      r: 6
                    }
                },
                // size dependent of source
                // r: function (d) {

                //     if (this.statistics[d.index].source == "landsat8") {
                //         return 4;
                //     }
                //     else {
                //         return 8;
                //     }
                // }
                
                //stroke: c3-shapes-sn-marker--mean-
                
                // size dependent of source
                r: function (d) {
                    if (d.id == "marker") {
                        return 6;
                    }
                    else {
                        return 3; //default
                    }
                }
                // }
        },
        transition: {
            duration: 300
        },
        grid: {
            x: {
                show: true
            },
            y: {
                show: true
            }
        },
        // regions: [
        //     {axis: 'x', start: regionL8.start, end: regionL8.end, class: 'region-landsat'},
        //     {axis: 'x', start: regionS2.start, end: regionS2.end, class: 'region-sentinel'},
        //   ],
        axis: {
          x: {
              type: 'timeseries',
              tick: {
                  //format: '%d.%m.%Y',
                  fit: false, //false means evenly spaced- ticks - otherwise the time spans will be honored between dates 
                  format: "%e %b %y"
                  //format: function (x) { return x.getFullYear(); }
              }
          },
          y: {
              label: {text: axis_label,
                      position: 'outer-top'},
              //max: 1.5,
              // min: 0,
              padding: {top:10, bottom:0}
          },
          // y2: { show: true}
        },
        zoom: {
            enabled: true
        },
        tooltip: {
          grouped: true,
          format: {
              /*title: function(x) {
                  return x.toISOString().split("T")[0];
              },*/
              value: function (value, ratio, id, index) {

                  // hide meanl8 and means2 in tooltip
                  if (id == "meanl8" || id == "means2") {
                      return;
                  }

                  // shows also source in tooltip (e.g. landsat8 or sentinel2)
                  // only on charttype statistics - not for similarity
                  if (this.currentGraphContent == "statistics") {
                      if (this.selectedSource == "") {
                          if (id != "marker") { //exlude for markers
                            if (this.mode == "one-index") {
                              return value + " ("+this.statistics[index].source + ")";
                            } 
                            if (this.mode == "many-indices") {
                              return value + " ("+this.statisticsMany[id][index].source + ")";
                            }
                            if (this.mode == "many-parcels") {
                              return value + " ("+this.statisticsMany.find(p => p.parcel_id == id)[this.selectedProduct][index].source + ")";
                            }
                          }
                          else {
                              return value;
                          }
                      }
                      else { return value; }
                  }
                  else { return value; }
              }.bind(this)
          },

          // overriding the contents of the tooltip for more customization
          contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
              // d is an array here!

              // https://stackoverflow.com/questions/24754239/how-to-change-tooltip-content-in-c3js/25750639#25750639
              var $$ = this, config = $$.config,
              titleFormat = config.tooltip_format_title || defaultTitleFormat,
              nameFormat = config.tooltip_format_name || function (name) { return name; },
              valueFormat = config.tooltip_format_value || defaultValueFormat, text, i, title, value, name, bgcolor;

              for (i = 0; i < d.length; i++) {
                  
                  if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

                  if (! text) {
                      title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                      text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
                  }
                  // hide meanl8, means2 entries in tooltip
                  if (d[i].id == "meanl8" || d[i].id == "means2") {
                      continue;
                  }
                  // special marker formats
                  if (d[i].id == "marker") {
                      let index = d[i].index;
                      let markers;
                      if (this.selectedMarkerType == "sn_marker") {
                          markers = this.sn_markers.markers;
                      }
                      if (this.selectedMarkerType == "phenology") {
                          markers = this.phenology.phenology.markers;
                      }
                      name = nameFormat(markers[index].name);
                      value = valueFormat(this.formatDecimal(d[i].value,3), d[i].ratio, d[i].id, d[i].index);
                      bgcolor = markers[index].status;
                  }
                  else {
                      name = nameFormat(d[i].name);
                      value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                      bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
                  }

                  text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                  text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
                  text += "<td class='value'>" + value + "</td>";
                  text += "</tr>";
                  
              }

              return text + "</table>";
          }
        }
      });

      // show product selector
      document.getElementById(this.chartid).getElementsByClassName('product-selector')[0].classList.remove('is-hidden');
    },
    /* GUI helper */
    toggleChartOptions: function() {
      let isGraphOptionsActive = false;
      isGraphOptionsActive = !(document.getElementById("chartOptions_"+this.chartid).classList.contains("is-hidden"));
  
      if (isGraphOptionsActive) {
          document.getElementById("chartOptions_"+this.chartid).classList.add("is-hidden");
          document.getElementById(this.chartid).getElementsByClassName("chartOptionsTitle")[0].children[0].classList.remove("is-active");
      }
      else {
          document.getElementById("chartOptions_"+this.chartid).classList.remove("is-hidden");
          document.getElementById(this.chartid).getElementsByClassName("chartOptionsTitle")[0].children[0].classList.add("is-active");
      }
    },  
    /* helper functions */
    removeFromArray: function(arry, value) {
      let index = arry.indexOf(value);
      if (index > -1) {
          arry.splice(index, 1);
      }
      return arry;
    },
    formatDecimal: function(decimal, numberOfDecimals) {
      /* Helper function for formatting numbers to given number of decimals */
  
      var factor = 100;
  
      if ( isNaN(parseFloat(decimal)) ) {
          return NaN;
      }
      if (numberOfDecimals == 1) {
          factor = 10;
      }
      if (numberOfDecimals == 2) {
          factor = 100;
      }
      if (numberOfDecimals == 3) {
          factor = 1000;
      }
      if (numberOfDecimals == 4) {
          factor = 10000;
      }
      if (numberOfDecimals == 5) {
          factor = 100000;
      }
      return Math.ceil(decimal * factor)/factor;
    },
    capitalize: function (s) {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    },
    isDateValid: function (date_str) {
      /* Validates a given date string */
      if (!isNaN(new Date(date_str))) {
          return true;
      }
      else {
          return false;
      }
    },
    loadJSscript: function (url, callback) {
      let script = document.createElement("script");  // create a script DOM node
      script.src = url;  // set its src to the provided URL
      script.async = true;
      document.body.appendChild(script);  // add it to the end of the body section of the page 
      script.onload = function () {
        callback();
      };
    }
  },
});