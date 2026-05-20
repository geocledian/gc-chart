/*
 Vue.js Geocledian chart component
 created: 2019-11-04, jsommer
 updated: 2022-10-10, jsommer
 version: 0.9.5
*/
"use strict";

Date.prototype.simpleDate = function () {
  var a = this.getFullYear(),
    b = this.getMonth() + 1,
    c = this.getDate();
  return a + "-" + (1 === b.toString().length ? "0" + b : b) + "-" + (1 === c.toString().length ? "0" + c : c)
}

//lanugage strings
const gcChartLocales = {
  "en": {
    "options": {
      "title": "Chart options",
      "graph_type": {
        "label": "Graph type",
        "line": "Line",
        "spline": "Spline",
        "area": "Area"
      },
      "hide_graphs": {
        "label": "Hide",
        "marker": "Marker"
      },
      "marker": {
        "label": "Marker",
        "phenology": "Phenology",
        "sn_marker": "SN Marker"
      },
      "date_zoom": {
        "from": "From",
        "to": "To",
        "date_format_hint": "YYYY-MM-DD",
        "invalid_date_range": "Invalid date range!"
      },
      "mode": {
        "label": "Mode",
        "one_index": "one product, all statistics",
        "many_indices": "many products, means"
      },
      "cloudFilter": {
        "label": "Cloud filter"
      },
      "date_reset": "Reset"
    },
    "statistics": {
      "min": "Minimum",
      "max": "Maximum",
      "mean": "Mean",
      "stddev": "Standard Deviation",
      "errorBand": "Error Band"
    },
    "products": {
      "sos": "Start of season",
      "pos": "Peak of season",
      "eos": "End of season",
      "vitality": "Vitality",
      "ndvi": "NDVI",
      "ndre1": "NDRE1",
      "ndre2": "NDRE2",
      "ndwi": "NDWI",
      "savi": "SAVI",
      "evi2": "EVI2",
      "cire": "CIRE",
      "npcri": "NPCRI",
      "backscatter_vv": "Backscatter VV",
      "backscatter_vh": "Backscatter VH",
      "sbmi": "SBMI",
      "bsi": "BSI"
    },
    "status_msg": {
      "unauthorized_key": "Sorry, the API key is not authorized.",
      "invalid_key": "Sorry, the API key's validity expired.",
      "missing_permissions": "Sorry, the API key doesn't have the given permissions to access this product or resource.",
      "support": "Please contact <a href='https://www.geocledian.com'>geo|cledian</a> for support.",
      "parcel_id_not_found": "Parcel ID not found!"
    },
    "productSelector": {
      "tooltip": "Choose a product!"
    },
    "chart": {
      "no_data_msg": "No data available"
    },
    "similarity": {
      "title": "Similarity",
      "euclidean_distance": "Euclidean distance",
      "references_found": "References found",
      "references_used": "References used",
      "covariance": "Covariance",
      "cosine": "Cosine",
      "correlation": "Correlation",
      "parcel_mean": "Current Parcel (mean)",
      "reference_mean": "Reference parcels (mean)",
    }
  },
  "de": {
    "options": {
      "title": "Graphoptionen",
      "graph_type": {
        "label": "Graph Typ",
        "line": "Gerade",
        "spline": "Kurven",
        "area": "Flächig"
      },
      "hide_graphs": {
        "label": "Ausblenden",
        "marker": "Marker"
      },
      "marker": {
        "label": "Marker",
        "phenology": "Phänologie",
        "sn_marker": "SN Marker"
      },
      "date_zoom": {
        "from": "Von",
        "to": "Bis",
        "date_format_hint": "JJJJ-MM-TT",
        "invalid_date_range": "Datumsbereich ungültig!"
      },
      "mode": {
        "label": "Modus",
        "one_index": "ein Produkt, alle Statistikwerte",
        "many_indices": "mehrere Produkte, Mittelwerte"
      },
      "cloudFilter": {
        "label": "Wolkenfilter"
      },
      "date_reset": "Zurücksetzen"
    },
    "statistics": {
      "min": "Minimum",
      "max": "Maximum",
      "mean": "Mittelwert",
      "stddev": "Standardabweichung",
      "errorBand": "Fehlerband"
    },
    "products": {
      "sos": "Saisonbeginn",
      "pos": "Saisonales Maximum",
      "eos": "Saisonende",
      "vitality": "Vitalität",
      "ndvi": "NDVI",
      "ndre1": "NDRE1",
      "ndre2": "NDRE2",
      "ndwi": "NDWI",
      "savi": "SAVI",
      "evi2": "EVI2",
      "cire": "CIRE",
      "npcri": "NPCRI",
      "backscatter_vv": "Backscatter VV",
      "backscatter_vh": "Backscatter VH",
      "sbmi": "SBMI",
      "bsi": "BSI"
    },
    "status_msg": {
      "unauthorized_key": "Tut uns leid, der angegebene API Schlüssel existiert nicht!",
      "invalid_key": "Tut uns leid, die Gültigkeit des angegebenen API Schlüssels ist abgelaufen.",
      "missing_permissions": "Tut uns leid, der angegebene API Schlüssel hat nicht die erforderlichen Berechtigungen für dieses Produkt bzw. diese Ressource!",
      "support": "Bitte kontaktieren Sie <a href='https://www.geocledian.com'>geo|cledian</a> für weitere Unterstützung.",
      "parcel_id_not_found": "Parcel ID nicht gefunden!"
    },
    "productSelector": {
      "tooltip": "Bitte Produkt wählen!"
    },
    "chart": {
      "no_data_msg": "Keine Daten verfügbar",
    },
    "similarity": {
      "title": "Ähnlichkeitsanalyse",
      "euclidean_distance": "Euklidische Distanz ",
      "references_found": "Gefundene Referenzen",
      "references_used": "Verwendete Referenzen",
      "covariance": "Covarianz",
      "cosine": "Cosinus",
      "correlation": "Korrelation",
      "parcel_mean": "Aktuelles Feld (Mittelwert)",
      "reference_mean": "Umgebende Felder (Mittelwert)",
    }
  },
}

Vue.component('gc-chart', {
  props: {
    gcWidgetId: {
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
    gcProxy: {
      type: String,
      default: undefined
    },
    gcApiBaseUrl: {
      type: String,
      default: "/agknow/api/v3"
    },
    gcApiSecure: {
      type: Boolean,
      default: true
    },
    gcLimit: {
      type: Number,
      default: 250
    },
    gcOffset: {
      type: Number,
      default: 0
    },
    gcCurrentParcelId: {
      type: Number,
      default: -1
    },
    gcVisibleParcelIds: {
      type: String,
      default: ""
    },
    gcAvailableProducts: {
      type: String,
      default: "vitality,ndvi,ndwi,ndre1,ndre2,savi,evi2,cire,npcri,backscatter_vv,backscatter_vh,sbmi,bsi"
    },
    gcMode: {
      type: String,
      default: "" // "one-index" || "many-indices" || "many-parcels"
    },
    gcZoomStartdate: {
      type: String,
      default: "" // ISO date string, e.g. '2018-03-01'
    },
    gcZoomEnddate: {
      type: String,
      default: "" // ISO date string, e.g. '2018-10-01'
    },
    gcFilterString: {
      type: String,
      default: ''
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
    gcInitialLoading: {
      type: Boolean,
      default: true // true: load first parcels by filter or false: wait for visibleParcelIds to be set later (e.g. from Portfolio)
    },
    gcParcels: {
      type: Array,
      default: function () {
        return []
      }
    },
    gcSelectedProduct: {
      type: String,
      default: ""
    },
    gcDatezoomLayout: {
      type: String,
      default: 'vertical' // or horizontal
    },
    gcAvailableStats: { //only valid for gcMode 'one-index'!
      type: String,
      default: 'mean,min,max,std.dev.,marker,errorBand,means2,meanl8'
    },
    gcAvailableOptions: {
      type: String,
      default: 'optionsTitle,graphType,hideGraphs,dateZoom,markers,legend,productSelector,cloudFilter'
    },
    gcOptionsCollapsed: {
      type: Boolean,
      default: true // or false
    },
    gcDataSource: {
      type: String,
      default: '' //'landsat8', 'sentinel2' or '' (all)
    },
    gcLanguage: {
      type: String,
      default: 'en' // 'en' | 'de' | 'lt'
    },
    gcSelectedDate: {
      type: String,
      default: ''
    },
    gcYScale: {
      type: String,
      default: 'dynamic' // 'fixed' //dynamic or fixed y scale
    },
    gcPhStartdate: {
      type: String,
      default: undefined
    },
    gcPhEnddate: {
      type: String,
      default: undefined
    },
    gcSimStartdate: {
      type: String,
      default: undefined
    },
    gcSimEnddate: {
      type: String,
      default: undefined
    },
    gcWhiteLabel: {
      type: Boolean,
      default: false // true or false
    },
    gcSimRadius: {
      type: Number,
      default: 100000
    },
    gcSimInterval: {
      type: Number,
      default: 7
    },
    gcSimReferences: {
      type: Number,
      default: 20
    },
    gcSimCrop: {
      type: String,
      default: ""
    },
    gcSimEntity: {
      type: String,
      default: ""
    },
    gcSimVerification: {
      type: Boolean,
      default: false
    }
  },
  template: `<div :id="gcWidgetId" class="gc-chart">    

              <p :class="['gc-options-title', 'is-size-6', gcOptionsCollapsed ? 'gc-is-tertiary' : 'gc-is-primary']" 
                  style="cursor: pointer; margin-bottom: 1em;"
                  v-on:click="toggleChartOptions" 
                  v-show="availableOptions.includes('optionsTitle')">
                  {{ $t('options.title') }} 
                <i :class="[!gcOptionsCollapsed ? '': 'is-active', 'fas', 'fa-angle-down', 'fa-sm']"></i>
              </p>

              <!-- chart settings -->
              <div :class="[!gcOptionsCollapsed ? '': 'is-hidden', 'chartOptions', 'is-horizontal', 'is-flex']" >

              <div class="field" v-show="availableOptions.includes('graphType')">
                <div class="field-label is-small"><label class="label has-text-left gc-is-tertiary">{{ $t('options.graph_type.label')}} </label></div>
                <div class="field-body">
                  <div class="select is-small">
                  <select v-model="selectedGraphType">
                    <option value="line">{{ $t('options.graph_type.line')}}</option>
                    <option value="spline">{{ $t('options.graph_type.spline')}}</option>
                    <!-- option value="area-spline">{{ $t('options.graph_type.area')}}</option -->
                  </select>
                  </div>
                </div>
              </div>

              <div class="field is-vertical" v-show="availableOptions.includes('hideGraphs') && mode == 'one-index'">
                <div class="field-label is-small">
                  <label class="label has-text-left gc-is-tertiary" style="white-space: nowrap;">{{ $t('options.hide_graphs.label')}}</label>
                </div>
                <div class="field-body" style="overflow-y: auto; height: 6.4rem;">
                  <div class="control">
                    <div class="field is-horizontal" v-if="this.mode=='one-index'">
                      <div class="field-body">
                        <div class="control">
                          <label class="label gc-is-tertiary is-small" style="white-space: nowrap;">
                            <input class="is-small" type="checkbox" value="mean" v-model="hiddenStats"> {{ $t('statistics.mean')}} </label>
                        </div>
                      </div>
                    </div>         
                    <div class="field is-horizontal" v-if="this.mode=='one-index'">
                      <div class="field-body">
                        <div class="control">
                          <label class="label is-small gc-is-tertiary" style="white-space: nowrap;">
                            <input class="is-small" type="checkbox" value="min" v-model="hiddenStats"> {{ $t('statistics.min')}} </label>
                        </div>
                      </div>
                    </div>
                    <div class="field is-horizontal" v-if="this.mode=='one-index'">
                      <div class="field-body">
                        <div class="control">
                          <label class="label is-small gc-is-tertiary" style="white-space: nowrap;">
                            <input class="is-small" type="checkbox" value="max" v-model="hiddenStats"> {{ $t('statistics.max')}} </label>
                        </div>
                      </div>
                    </div>
                    <div class="field is-horizontal" v-if="this.mode=='one-index'">
                        <div class="field-body">
                          <div class="control">
                            <label class="label is-small gc-is-tertiary" style="white-space: nowrap;">
                              <input class="is-small" type="checkbox" value="std.dev." v-model="hiddenStats"> {{ $t('statistics.stddev')}}</label>
                          </div>
                        </div>
                    </div>
                    <!-- div class="field is-horizontal" v-if="this.mode=='one-index' || this.mode=='many-indices'">
                      <div class="field-body">
                        <div class="control">
                          <label class="label is-small gc-is-tertiary" style="white-space: nowrap;">
                            <input class="is-small" type="checkbox" value="errorBand" v-model="hiddenStats"> {{ $t('statistics.errorBand')}}</label>
                        </div>
                      </div>
                    </div -->
                    <div class="field is-horizontal" v-if="this.mode=='one-index'" v-show="availableOptions.includes('markers')">
                      <div class="field-body">
                        <div class="control">
                          <label class="label is-small gc-is-tertiary" style="white-space: nowrap;">
                            <input class="is-small" type="checkbox" value="marker" v-model="hiddenStats"> {{ $t('options.hide_graphs.marker')}}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
              </div>
              <div class="field" v-if="this.mode=='one-index'" v-show="availableOptions.includes('markers')">
                <div class="field-label is-small">
                  <label class="label has-text-left gc-is-tertiary" style="white-space: nowrap;">{{ $t('options.marker.label')}}</label>
                  </div>
                <div class="field-body">
                  <div class="select is-small">
                    <select v-model="selectedMarkerType">
                      <option value="phenology">{{ $t('options.marker.phenology')}}</option>
                      <option value="sn_marker">{{ $t('options.marker.sn_marker')}}</option>
                    </select>
                </div>
              </div>  
              </div>

            <!-- date filter -->
            <div class="is-vertical">
            <div :class="dateZoomLayout[gcDatezoomLayout]"
                  v-show="availableOptions.includes('dateZoom')" style="margin-bottom: 0.2rem;">
              <div class="field">
                <div class="field field-label is-small">
                  <label class="label gc-is-tertiary has-text-left" style="white-space: nowrap;">{{ $t('options.date_zoom.from')}}</label>
                </div>
                <div class="control" style="max-width: 5rem;">
                <input :id="'inpFilterDateFrom_'+this.gcWidgetId" type="text" :class="[chartFromDate >= chartToDate ? 'is-danger has-text-weight-bold has-text-danger' : '', 'input','is-small']"
                      :placeholder="$t('options.date_zoom.date_format_hint')" v-model="chartFromDate">
                <span style="margin-block-start: 0.25em;" class="tag is-light is-danger" v-show="chartFromDate >= chartToDate">
                  {{ $t("options.date_zoom.invalid_date_range") }}
                </span>
                </div>
              </div>
              <div class="field">
                <div class="field field-label is-small">
                  <label class="label gc-is-tertiary has-text-left" style="white-space: nowrap;">{{ $t('options.date_zoom.to')}}</label>
                </div>
                <div class="control" style="max-width: 5rem;">
                  <input :id="'inpFilterDateTo_'+this.gcWidgetId" type="text" :class="[chartFromDate >= chartToDate ? 'is-danger has-text-weight-bold has-text-danger' : '', 'input','is-small']"
                      :placeholder="$t('options.date_zoom.date_format_hint')"  v-model="chartToDate">
                </div>
              </div>  
            </div>
            <div class="field" style="padding-right: 1em !important;">
              <button class="button is-small is-light" style="margin-left: 7px!important; margin-right: 7px!important; width: 100%;" v-bind:title="$t('options.date_reset')" v-on:click="resetDateZoom()">
                <i class="fas fa-undo fa-sm is-orange"></i><span class="content is-orange">{{$t('options.date_reset')}}</span>
              </button>
            </div>
            </div>
            
            <!-- mode selector -->
            <div class="field" v-show="this.availableOptions.includes('modeSelector') && this.mode != 'many-parcels'">
              <div class="field-label is-small"><label class="label has-text-left gc-is-tertiary">{{ $t('options.mode.label')}}</label></div>
              <div class="select is-small">
                <select v-model="mode">
                  <option value="one-index">{{ $t('options.mode.one_index')}}</option>
                  <option value="many-indices">{{ $t('options.mode.many_indices')}}</option>
                </select>
              </div>
            </div><!-- mode selector -->
            <!-- cloud filter -->
            <div class="field" v-show="this.availableOptions.includes('cloudFilter')">
              <div class="field-label is-small"><label class="label has-text-left gc-is-tertiary">{{ $t('options.cloudFilter.label')}}</label></div>
              <div class="field-body">
                <div class="control">
                    <input class="is-small" type="checkbox" value="true" v-model="cloudFilter">
                </div>
              </div>
            </div> 
          </div><!-- chart settings -->

          <!-- watermark message -->
          <div class="notification gc-api-message" style="position: relative; opacity: 1.0; margin-bottom: 0.5rem; z-index: 1001; font-size: 0.9rem;"
            v-show="watermark_msg.length>0" v-html="$t(watermark_msg)  +  '<br>' + $t('status_msg.support')">
          </div>

          <!-- other api messages -->
          <div class="notification gc-api-message" v-show="api_err_msg.length > 0" v-html="$t(api_err_msg) +  '<br>' + $t('status_msg.support')"></div>

          <div class="chartSpinner spinner" v-show="isloading">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>

          <!-- v-show directive does not play nice with billboard.js so put it one layer above! -->
          <div style="position: relative;" v-show="api_err_msg.length==0">
            
            <div v-show="isloading == false">
              <div :id="'chart_'+ this.gcWidgetId" class="gc-chart"></div>
            </div>

            <!-- product selector -->
            <div class="field product-selector" style="position: absolute; right: 0rem; top: -1.2rem;" v-show="this.availableOptions.includes('productSelector') && !this.isloading">
            <!--div class="field-label"><label class="label has-text-left gc-is-tertiary" style="margin-bottom: 4px;">Product</label></div-->
              <div class="field-body has-text-bold">
                <div class="select is-small" v-if="this.mode!='many-indices'">
                  <select v-model="selectedProduct" :title="this.$t('productSelector.tooltip')">
                    <option v-for="p in availableProducts" v-bind:value="p">
                      <span>{{ $t('products.'+p)}}</span>
                    </option>
                  </select>
                </div>
              </div>
            </div> <!-- product selector -->
          </div> <!-- chart & product selector -->
          <!-- watermark -->
          <div :class="[this.gcWhiteLabel ? 'is-hidden': 'is-inline-block', 'is-pulled-right']" style="opacity: 0.65; position: relative; bottom: 2.6rem; margin-right: -0.6rem;">
            <span style="vertical-align: top; font-size: 0.7rem;">powered by</span><br>
            <img src="img/logo.png" alt="geo|cledian" style="width: 100px; margin: -10px 0;">
          </div>


          <!-- similarity results -->
          <div style="margin-bottom: 0 !important;" v-show="similarity.similarity.hasOwnProperty('correlation')"> 
              <p class="menu-label" style="margin-bottom: 0.25em;">
                {{ $t('similarity.title') }}
              </p>
            <div class="tile is-ancestor" v-if="similarity.similarity.hasOwnProperty('correlation')" style="width: 100%">
              <!-- div class="tile is-vertical" -->
                <div class="tile" style="padding-top: 0em!important;">
                  <div class="tile is-child has-text-centered">
                    <label class="is-size-7 gc-is-tertiary"> {{$t('similarity.correlation')}} </label> <br>  
                    <span class="title is-size-4" style="color: #32CD32;" v-if="similarity.similarity.correlation >= 0.9"> {{formatDecimal(similarity.similarity.correlation,2)}} </span>
                    <span class="title is-size-4" style="color: #F6BE00;" v-if="similarity.similarity.correlation > 0.8 & similarity.similarity.correlation < 0.9"> {{formatDecimal(similarity.similarity.correlation,2)}} </span>
                    <span class="title is-size-4" style="color: red;" v-if="similarity.similarity.correlation < 0.8"> {{formatDecimal(similarity.similarity.correlation,2)}} </span>
                  </div>
                  <div class="tile is-child has-text-centered">
                    <label class="is-size-7 gc-is-tertiary"> {{$t('similarity.euclidean_distance')}} </label><br>
                    <span class="title is-size-4" style="color: #32CD32;" v-if="similarity.similarity.distance.mean_distance <= 0.15"> {{formatDecimal(similarity.similarity.distance.mean_distance,2)}} </span>
                    <span class="title is-size-4" style="color: #F6BE00;" v-if="similarity.similarity.distance.mean_distance > 0.15 & similarity.similarity.distance.mean_distance <= 0.21"> {{formatDecimal(similarity.similarity.distance.mean_distance,2)}} </span>
                    <span class="title is-size-4" style="color: red;" v-if="similarity.similarity.distance.mean_distance > 0.21"> {{formatDecimal(similarity.similarity.distance.mean_distance,2)}} </span>
                  </div>
                  <div class="tile is-child has-text-centered">
                    <label class="is-size-7 gc-is-tertiary"> {{$t('similarity.references_found')}} </label><br>
                    <span class="title is-size-4 has-text-grey"> {{similarity.similarity.references_found}} </span>
                  </div>
                  <div class="tile is-child has-text-centered"">
                    <label class="is-size-7 gc-is-tertiary"> {{$t('similarity.references_used')}} </label><br>
                    <span class="title is-size-4 has-text-grey"> {{similarity.similarity.references_used}} </span>
                  </div>
                  <!-- div class="tile is-child p-2 has-text-centered">
                    <label class="is-size-7 gc-is-tertiary"> {{$t('similarity.cosine')}} </label><br>
                    <span class="title is-size-4" style="color: #32CD32;" v-if="similarity.similarity.cosine_similarity <= 0.15"> {{formatDecimal(similarity.similarity.cosine_similarity,2)}} </span>
                    <span class="title is-size-4" style="color: #F6BE00;" v-if="similarity.similarity.cosine_similarity > 0.15 & similarity.similarity.cosine_similarity <= 0.21"> {{formatDecimal(similarity.similarity.cosine_similarity,2)}} </span>
                    <span class="title is-size-4" style="color: red;" v-if="similarity.similarity.cosine_similarity > 0.21"> {{formatDecimal(similarity.similarity.cosine_similarity,2)}} </span>
                  </div -->
                </div>
              <!-- /div -->
            </div>
          </div>

          </div><!-- gcWidget -->`,
  data: function () {
    return {
      chart: undefined,
      statistics: [],
      statisticsMany: [],
      internalSelectedProduct: "",
      parcels: [],
      //offset: 0,
      pagingStep: 250,
      total_parcel_count: 250,
      chartLegendVisible: true,
      similarity: {
        content_parcel: [],
        content_reference: [],
        similarity: {},
        summary: {},
        classification: {}
      },
      phenology: [], //content : [{ { duration: {}, growth_rate: {}, marker: [] }, season: {} },
      currentGraphContent: "statistics", // statistics || similarity || phenology
      selectedGraphType: "line",
      selectedMarkerType: "phenology",
      hiddenStats: ["min", "max", "std.dev.", "means2", "meanl8", "cire", "vitality", "npcri", "ndre2", "evi2", "savi"], //hide these by default - user can change the visibility
      sn_markers: {},
      internalQuerydate: {}, //filled by click in chart only!
      selectedChartId: "", // filled by click in chart when in one-index or many-indices mode
      internalZoomStartdate: "", //TODO: startdate of parcel //new Date(new Date().getUTCFullYear()-1, 2, 1).simpleDate(), // last YEAR-03-01
      internalZoomEnddate: "", //TODO: enddate of parcel   //new Date(new Date().getUTCFullYear()-1, 10, 1).simpleDate(), // last YEAR-11-01
      internalCurrentParcelID: -1, //for internal use of widget only, if not set from outer gcCurrentParcelId prop
      inpFilterDateFromPicker: undefined,
      inpFilterDateToPicker: undefined,
      minDate: undefined,
      maxDate: undefined,
      internalMode: "one-index",
      dateZoomLayout: {
        "vertical": "field is-vertical",
        "horizontal": "field is-horizontal"
      },
      d3locales: {
        "de": {
          "decimal": ",",
          "thousands": ".",
          "grouping": [3],
          "currency": ["€", ""],
          "dateTime": "%a %b %e %X %Y",
          "date": "%d.%m.%Y",
          "time": "%H:%M:%S",
          "periods": ["AM", "PM"],
          "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
          "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
          "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
          "shortMonths": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
        },
        "en": {
          "decimal": ",",
          "thousands": ".",
          "grouping": [3],
          "currency": ["€", ""],
          "dateTime": "%a %b %e %X %Y",
          "date": "%d.%m.%Y",
          "time": "%H:%M:%S",
          "periods": ["AM", "PM"],
          "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
          "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
      },
      isloading: false, // indicates if data is being loaded or not
      api_err_msg: "", // if there is an error from the API, it will stored here; if length > 0 it will be displayed
      cloudFilter: true,
      watermark_msg: ""
    }
  },
  computed: {
    apiKey: {
      get: function () {
        return this.gcApikey;
      }
    },
    apiHost: {
      get: function () {
        return this.gcHost;
      }
    },
    apiBaseUrl: {
      get: function () {
        return this.gcApiBaseUrl;
      }
    },
    apiSecure: {
      get: function () {
        return this.gcApiSecure;
      }
    },
    apiMajorVersion: {
      get() {
        if (this.apiBaseUrl === "/agknow/api/v3") {
          return 3
        }
        if (this.apiBaseUrl === "/agknow/api/v4") {
          return 4
        }
      }
    },
    currentParcelID: {
      get: function () {
        // if parcel id is not set externally via prop, take the internal one!
        if (this.gcCurrentParcelId === -1)
          return this.internalCurrentParcelID;
        else
          return this.gcCurrentParcelId;
      },
      set: function (newValue) {
        // always emit to root
        this.$root.$emit('currentParcelIdChange', newValue);
        // if parcel id is not set externally via prop, take the internal one!
        if (this.gcCurrentParcelId === -1)
          this.internalCurrentParcelID = newValue;
      }
    },
    availableProducts: {
      get: function () {
        return this.filterDatasourceProductCompat(this.dataSource, this.gcAvailableProducts.split(","));
      },
    },
    selectedParcelIds: {
      get: function () {
        if (this.mode == "many-parcels") {

          // case if parcel ids are not defined - take the first 10 parcels 
          // from the result of the filterString against the API
          if (this.visibleParcelIds.length == 0) {
            if (this.gcInitialLoading === true) {
              /* limited to maximum of 10 parcels if visibleParcelIds are not set ! */
              return this.parcels.map(p => parseInt(p.parcel_id)).slice(0, 10);
            } else {
              return []; //return empty for waiting on changing visibleParcelIds from external setting (e.g. Portfolio)
            }
          } else {
            // case for defined parcel ids
            if (this.visibleParcelIds.split(",").length <= 10)
              return this.visibleParcelIds.split(",").map(p => parseInt(p));
            else
              return []; //empty
          }
        } else { // other graph modes
          if (this.visibleParcelIds.length == 0) {
            /* limited to maximum of 10 parcels if visibleParcelIds are not set ! */
            return this.parcels.map(p => parseInt(p.parcel_id)).slice(0, 10);
            //return this.parcels.map(p => p.parcel_id);
          } else {
            return this.visibleParcelIds.split(",").map(p => parseInt(p)).slice(0, 10);
          }
        }
      },
    },
    dataSource: {
      get: function () {
        return this.gcDataSource;
      },
      set: function (value) {
        this.$root.$emit("dataSourceChange", value);
      }
    },
    chartWidth: {
      get: function () {
        console.debug("clientwidth " + document.getElementById(this.gcWidgetId).clientWidth);
        console.debug("offsetwidth " + document.getElementById(this.gcWidgetId).offsetWidth);
        return parseInt(document.getElementById(this.gcWidgetId).offsetWidth);
      }
    },
    chartHeight: {
      get: function () {
        // console.debug("clientheight "+document.getElementById(this.gcWidgetId).clientHeight);
        // console.debug("offsetheight "+document.getElementById(this.gcWidgetId).offsetHeight);
        //return parseInt(document.getElementById(this.gcWidgetId).offsetHeight);
        return parseInt(document.getElementById(this.gcWidgetId).style.height);
      }
    },
    filterString: {
      get: function () {
        return this.gcFilterString;
      },
      // set: function(newValue) {
      //   /*
      //   this.crop = this.getQueryVariable(newValue, "crop") ? this.getQueryVariable(newValue, "crop") : "";
      //   this.entity = this.getQueryVariable(newValue, "entity") ? this.getQueryVariable(newValue, "entity") : "";
      //   this.name = this.getQueryVariable(newValue, "name") ? this.getQueryVariable(newValue, "name") : "";*/

      //   //notify root - through props it will change this.gcFilterString
      //   this.$root.$emit('filterChange', newValue);
      // }
    },
    limit: {
      get: function () {
        // will always reflect prop's value 
        return this.gcLimit;
      }
    },
    offset: {
      get: function () {
        // will always reflect prop's value 
        return this.gcOffset;
      }
    },
    chartFromDate: {
      /* The following logic is necessary because of the requirements:
         - embedded usage of the chart widget in another application, which sets the zoom dates:
           possibility to set zoom date for chart via props (e.g. declaration in the HTML tag of the widget)
           --> gcZoomStartdate
         - standalone mode: no external setters of the chart zoom dates; the own controls 
           will be used for setting the dates
           --> chartFromDate
         - date has to be valid for zooming
         - date has to be in the range of the time series; 
           otherwise fall back to the first date of the time series for the start date
        Note: zooming will be handled in the watcher!
      */
      get: function () {
        // either outer zoom date
        if (this.gcZoomStartdate.length > 0) {
          if (this.isDateValid(this.gcZoomStartdate)) {
            // if date is within time series range
            if (this.mode === "one-index") {
              const dates = this.statistics.map(d => new Date(d.date));
              if (this.isDateWithinRange(dates, this.gcZoomStartdate))
                return this.gcZoomStartdate;
              else // min date of dates
                return dates[0];
            }
            if (this.mode === "many-indices") {
              let isWithinRange = false;
              const allDates = [];
              for (var i = 0; i < this.availableProducts.length; i++) {
                const product = this.availableProducts[i];
                const dates = this.statisticsMany[product].map(d => new Date(d.date));
                allDates.concat(dates);
                isWithinRange = this.isDateWithinRange(dates, this.gcZoomStartdate);
                if (isWithinRange === true) {
                  return this.gcZoomStartdate;
                }
              }
              if (isWithinRange === false) {
                return allDates.sort()[0]; // min date of all dates
              }
            }
            if (this.mode === "many-parcels") {
              let isWithinRange = false;
              let allDates = [];
              for (var i = 0; i < this.selectedParcelIds.length; i++) {
                let parcel_id = this.selectedParcelIds[i];
                // console.debug(parcel_id)
                const parcel = this.statisticsMany.find(p => p.parcel_id === parcel_id);
                if (parcel === undefined) {
                  console.debug("parcel not found!")
                  return
                }
                const timeseries = parcel[this.selectedProduct];
                if (timeseries == undefined) {
                  console.debug("time series not found!")
                  console.debug(parcel)
                  console.debug(this.selectedProduct)
                  return
                }
                const dates = timeseries.map(d => new Date(d.date));
                allDates = allDates.concat(dates);
                isWithinRange = this.isDateWithinRange(dates, this.gcZoomStartdate);
                if (isWithinRange === true) {
                  console.debug("gcZoomStartdate in range!")
                  console.debug(this.gcZoomStartdate)
                  return this.gcZoomStartdate;
                }
              }
              if (isWithinRange === false) {
                console.debug("gcZoomStartdate not in range!");
                const d = allDates.sort((a, b) => a - b)[0];
                if (d !== undefined) {
                  console.debug("returning " + d.simpleDate());
                  return d.simpleDate(); // min date of all dates
                }
              }
            }
          }
        } // or internal zoom date
        else {
          if (this.isDateValid(this.internalZoomStartdate))
            return this.internalZoomStartdate;
        }
      },
      set: function (newValue) {
        console.debug("chartFromDate setter: " + newValue)
        if (this.isDateValid(newValue)) {
          //should set gcZoomStartdate from root to the new value
          this.$root.$emit("chartFromDateChange", newValue);
          // okay for different usage modes (embedded vs standalone)
          this.internalZoomStartdate = newValue;
        }
      }
    },
    chartToDate: {
      /* The following logic is necessary because of the requirements:
         - embedded usage of the chart widget in another application, which sets the zoom dates:
           possibility to set zoom date for chart via props (e.g. declaration in the HTML tag of the widget)
           --> gcZoomEnddate
         - standalone mode: no external setters of the chart zoom dates; the own controls 
           will be used for setting the dates
           --> chartToDate
         - date has to be valid for zooming
         - date has to be in the range of the time series; 
           otherwise fall back to the last date of the time series for the end date
        Note: zooming will be handled in the watcher!
      */
      get: function () {
        // either outer zoom date
        if (this.gcZoomEnddate.length > 0) {
          if (this.isDateValid(this.gcZoomEnddate)) {
            // if date is within time series range
            if (this.mode === "one-index") {
              const dates = this.statistics.map(d => new Date(d.date));
              if (this.isDateWithinRange(dates, this.gcZoomEnddate))
                return this.gcZoomStartdate;
              else // min date of dates
                return dates[0];
            }
            if (this.mode === "many-indices") {
              let isWithinRange = false;
              let allDates = [];
              for (var i = 0; i < this.availableProducts.length; i++) {
                const product = this.availableProducts[i];
                const dates = this.statisticsMany[product].map(d => new Date(d.date));
                allDates = allDates.concat(dates);
                isWithinRange = this.isDateWithinRange(dates, this.gcZoomEnddate);
                if (isWithinRange === true) {
                  return this.gcZoomEnddate;
                }
              }
              if (isWithinRange === false) {
                return allDates.sort()[allDates.length - 1]; // max date of all dates
              }
            }
            if (this.mode === "many-parcels") {
              let isWithinRange = false;
              let allDates = [];
              for (var i = 0; i < this.selectedParcelIds.length; i++) {
                let parcel_id = this.selectedParcelIds[i];
                // console.debug(parcel_id)
                const parcel = this.statisticsMany.find(p => p.parcel_id === parcel_id);
                if (parcel === undefined) {
                  console.debug("parcel not found!")
                  return
                }
                const timeseries = parcel[this.selectedProduct];
                if (timeseries == undefined) {
                  console.debug("time series not found!")
                  console.debug(parcel)
                  console.debug(this.selectedProduct)
                  return
                }
                const dates = timeseries.map(d => new Date(d.date));
                allDates = allDates.concat(dates);
                isWithinRange = this.isDateWithinRange(dates, this.gcZoomEnddate);
                if (isWithinRange === true) {
                  console.debug("gcZoomEnddate in range!")
                  console.debug(this.gcZoomEnddate)
                  return this.gcZoomEnddate;
                }
              }
              if (isWithinRange === false) {
                console.debug("gcZoomEnddate not in range!")
                const d = allDates.sort((a, b) => a - b)[allDates.length - 1];
                if (d !== undefined) {
                  console.debug("returning " + d.simpleDate());
                  return d.simpleDate(); // max date of all dates
                }
              }
            }
          }
        } // or internal zoom date
        else {
          if (this.isDateValid(this.internalZoomEnddate))
            return this.internalZoomEnddate;
        }
      },
      set: function (newValue) {
        console.debug("chartToDate setter: " + newValue)
        if (this.isDateValid(newValue)) {
          // should set gcZoomEnddate from root to the new value
          this.$root.$emit("chartToDateChange", newValue);
          // for different usage modes (embedded vs standalone)
          this.internalZoomEnddate = newValue;
        }
      }
    },
    internalZoomDomain: {
      get() {
        return [this.chartFromDate, this.chartToDate];
      }
    },
    selectedProduct: {
      get: function () {
        // check for variations & visible products: fallback to vitality
        if (["variations", "visible"].includes(this.gcSelectedProduct) && this.availableProducts.includes("vitality")) {
          return "vitality";
        }
        // workaround for external setting of not existent product (sos,eos,pos) 
        // fallback to vitality if present
        if (["sos", "eos", "pos"].includes(this.gcSelectedProduct) && this.availableProducts.includes("ndvi")) {
          return "ndvi";
        }
        if (["maturity"].includes(this.gcSelectedProduct) && this.availableProducts.includes("ndre1")) {
          return "ndre1";
        } else {
          if (this.gcSelectedProduct.length > 0)
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
    visibleParcelIds: {
      get: function () {
        return this.gcVisibleParcelIds;
      },
    },
    availableStats: {
      get: function () {
        return (this.gcAvailableStats.split(","));
      }
    },
    availableOptions: {
      get: function () {
        return (this.gcAvailableOptions.split(","));
      }
    },
    currentLanguage: {
      get: function () {
        // will always reflect prop's value 
        return this.gcLanguage;
      },
    },
    selectedDate: {
      get: function () {
        return this.gcSelectedDate;
      },
      set: function (value) {
        console.debug("selectedDate - setter: " + value);
        // emitting to root instance 
        this.$root.$emit("queryDateChange", value);
        // emitting to root instance 
        // this.$root.$emit("queryDateStatsChange", this.selectedDateStats);
      }
    },
    selectedDateStats: {
      get: function () {
        if (this.statistics.length > 0) {
          let idx = this.getClosestTimeSeriesIndex(this.statistics, this.selectedDate);
          return this.statistics[idx].statistics;
        }
      }
    },
    mode: {
      get: function () {
        if (this.gcMode.length > 0)
          return this.gcMode;
        else
          return this.internalMode;
      },
      set: function (value) {
        this.internalMode = value;
        // notify root
        this.$root.$emit('chartModeChange', value);
      }
    },
    phenology_marker: {
      /* formats the phenology markers for X axis grid lines 
      
         is only available if bound in chart generation:

         grid: {
            // phenology markers as x grid lines
            x: {
                lines: this.phenology_marker
            },
         }

      */
      get: function () {
        if (this.phenology.length > 0) {
          let result = [];
          for (var i = 0; i < this.phenology.length; i++) {
            for (var j = 0; j < this.phenology[i].marker.length; j++) {
              if (this.phenology[i].marker[j].date) {
                result.push({
                  value: this.phenology[i].marker[j].date,
                  text: this.phenology[i].marker[j].name + " " + this.phenology[i].season,
                  class: this.phenology[i].marker[j].name.split(" ").join("-")
                });
              }
            }
          }
          return result;
        }
      }
    },
    sos: {
      get: function () {
        let result = [];
        for (var i = 0; i < this.phenology.length; i++) {
          result.push(this.phenology[i].marker.filter(m => m.name == "start of season")[0].date);
        }
        console.debug(result);
        return result;
        // this.sos.push(this.phenology[i].marker.filter(m=>m.name == "start of season")[0].date);
        // this.pos.push(this.phenology[i].marker.filter(m=>m.name == "peak of season")[0].date);
        // this.eos.push(this.phenology[i].marker.filter(m=>m.name == "end of season")[0].date);
      }
    },
    pos: {
      get: function () {
        let result = [];
        for (var i = 0; i < this.phenology.length; i++) {
          result.push(this.phenology[i].marker.filter(m => m.name == "peak of season")[0].date);
        }
        console.debug(result);
        return result;
        // this.sos.push(this.phenology[i].marker.filter(m=>m.name == "start of season")[0].date);
        // this.pos.push(this.phenology[i].marker.filter(m=>m.name == "peak of season")[0].date);
        // this.eos.push(this.phenology[i].marker.filter(m=>m.name == "end of season")[0].date);
      }
    },
    eos: {
      get: function () {
        let result = [];
        for (var i = 0; i < this.phenology.length; i++) {
          result.push(this.phenology[i].marker.filter(m => m.name == "end of season")[0].date);
        }
        console.debug(result);
        return result;
        // this.sos.push(this.phenology[i].marker.filter(m=>m.name == "start of season")[0].date);
        // this.pos.push(this.phenology[i].marker.filter(m=>m.name == "peak of season")[0].date);
        // this.eos.push(this.phenology[i].marker.filter(m=>m.name == "end of season")[0].date);
      }
    },
    simRadius: {
      get: function () {
        return this.gcSimRadius;
      }
    },
    simReferences: {
      get: function () {
        return this.gcSimReferences;
      }
    },
    simInterval: {
      get: function () {
        return this.gcSimInterval;
      }
    },
    simEntity: {
      get: function () {
        return this.gcSimEntity;
      }
    },
    simCrop: {
      get: function () {
        return this.gcSimCrop;
      }
    },
    simVerification: {
      get: function () {
        return this.gcSimVerification;
      }
    }
    // currentTimeseries: {
    //   get() {
    //     if (this.mode === "one-index") {
    //       return this.statistics.filter(s=>s.statistics !== null);
    //     }
    //     if (this.mode === "many-indices") {
    //       // return the longest series
    //       let out = []
    //       let maxLength = 0;
    //       for (var i = 0; i < this.availableProducts.length; i++) {
    //         const product = this.availableProducts[i];
    //         if (this.statisticsMany[product].length > maxLength) {
    //           out = this.statisticsMany[product].filter(s=>s.statistics !== null);
    //         }
    //         maxLength = this.statisticsMany[product].length;
    //       }
    //       return out;
    //     }
    //   },
    //   set (value) {
    //     this.$root.$emit("timeseriesChange", this.currentTimeseries);
    //   }
    // }
  },
  // init internationalization
  i18n: {
    locale: this.currentLanguage,
    messages: gcChartLocales
  },
  created() {
    console.debug("gc-chart - created()");
    this.changeLanguage(); //initial i18n from prop gcLanguage
  },
  /* when vue component is mounted (ready) on DOM node */
  mounted: function () {

    // // listen on size change handler
    this.$root.$on("containerSizeChange", this.containerSizeChange);

    // init hidden stats  
    let allStats = ["mean", "min", "max", "std.dev.", "marker", "means2", "meanl8"];
    allStats.forEach(function (item) {
      if (!this.availableStats.includes(item)) {
        this.hiddenStats.push(item);
        if (item === "mean") {
          this.hiddenStats.push("means2");
          this.hiddenStats.push("meanl8");
        }
      }
    }.bind(this));


    // overwrite statisticsMany
    if (this.mode == "many-indices") {
      this.statisticsMany = {
        vitality: [],
        ndvi: [],
        ndre1: [],
        ndre2: [],
        ndwi: [],
        savi: [],
        evi2: [],
        cire: [],
        npcri: [],
        bsi: []
      };
    }
    if (this.mode == "many-parcels") {
      this.statisticsMany = [];
    }
    // set first of available products to the selected one
    if (this.mode == "one-index" || this.mode == "many-parcels") {
      this.selectedProduct = this.availableProducts[0];
    }

    /* init chart */
    // set i18n for time x axis
    d3.timeFormatDefaultLocale(this.d3locales[this.currentLanguage]);

    // generate empty chart
    this.chart = bb.generate({
      bindto: '#chart_' + this.gcWidgetId,
      data: {
        x: 'x',
        columns: [],
        empty: {
          label: {
            text: this.$t("chart.no_data_msg")
          }
        },
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
          label: {
            text: '',
            position: 'outer-top'
          }
        }
      }
    });

    // show loading spinner, hide chart
    this.isloading = true;

    /* watermark */
    // d3.select(this.chart.internal.config.bindto)
    //   .style ("background-image", "url('img/logo_opaque_50.png')")
    //   .style ("background-size", "220px")
    //   .style("background-repeat", "no-repeat")
    //   .style("background-position-x", "100%")
    //   .style("background-position-y", "85%")
    // ;

    // initial loading data
    if (this.currentParcelID > 0) {
      this.getAllParcels(this.currentParcelID, this.offset, this.filterString);
    } else {
      if (this.gcInitialLoading === true) {
        this.getAllParcels(undefined, this.offset, this.filterString);
      }
    }

  },
  watch: {
    chartFromDate: function (newValue, oldValue) {

      console.debug("event - chartFromDateChange");

      if (this.isDateValid(newValue)) {
        // special case: chartToDate may be undefined
        if (this.chartToDate !== undefined) {
          if (this.isDateValid(this.chartFromDate) && this.isDateValid(this.chartToDate)) {
            // if (new Date(newValue).getTime() < new Date(this.chartToDate).getTime()) {  
            //   this.chart.zoom([this.chartFromDate, this.chartToDate]);
            // }
          } else {
            // revert date to old
            // this.chartFromDate = oldValue;
            // or clear date
            this.chartFromDate = undefined;
          }
        }
      } else {
        // revert date to old
        // this.chartFromDate = oldValue;
        // or clear date
        this.chartFromDate = undefined;
      }
    },
    chartToDate: function (newValue, oldValue) {

      console.debug("event - chartToDateChange");
      if (this.isDateValid(newValue)) {
        // special case: chartFromDate may be undefined
        if (this.chartFromDate !== undefined) {
          if (this.isDateValid(this.chartFromDate) && this.isDateValid(this.chartToDate)) {
            // if (new Date(newValue).getTime() > new Date(this.chartFromDate).getTime()) {  
            //   this.chart.zoom([this.chartFromDate, this.chartToDate]);
            // }
          } else {
            // revert date to old
            // this.chartToDate = oldValue;
            // or clear date
            this.chartToDate = undefined;
          }
        }
      } else {
        // revert date to old
        // this.chartToDate = oldValue;
        // or clear date
        this.chartToDate = undefined;
      }
    },
    internalZoomDomain: function (newValue, oldValue) {
      /* zooms at once for change in chartFrom & chartTo date */
      console.debug("event - internalZoomDomain");
      // check for valid domain (fromDate < toDate)
      if (new Date(newValue[0]).getTime() < new Date(newValue[1]).getTime()) {
        this.chart.zoom(newValue);
        // notify root also
        this.$root.$emit('zoomDomainChange', newValue);
      }
    },
    selectedProduct: function (newValue, oldValue) {

      if (newValue != oldValue) {
        console.debug("event - selectedProductChange");

        this.$root.$emit("resetSimilarity");
        this.$root.$emit("resetPhenology");

        if (this.mode == "one-index") {
          if (this.getCurrentParcel()) {

            if (this.currentGraphContent == "statistics") {
              // only load stats if product is not visible
              if (newValue != 'visible') {
                this.getParcelsProductData(this.getCurrentParcel().parcel_id, this.selectedProduct, this.dataSource);

                //if (document.getElementById("chkChartHideMarker_"+this.gcWidgetId).checked) {
                //this.getMarkers(this.getCurrentParcel().parcel_id);
                //}
                // else {
                //   this.sn_markers = {};
                // }
                this.getIndexStats(this.getCurrentParcel().parcel_id, this.dataSource, this.selectedProduct);
              }
            }
            if (this.currentGraphContent == "similarity") {
              this.getSimilarity();
            }
          }
        }
        if (this.mode == "many-parcels") {
          // important: empty first 
          // otherwise statistics updates wil don't fire on each updated in getIndexStats
          // which leads to flickering zoom in the chart

          this.statisticsMany = [];

          // console.debug(this.selectedParcelIds);
          for (var i = 0; i < this.selectedParcelIds.length; i++) {
            let parcel_id = this.selectedParcelIds[i];
            //this.getParcelsProductData(parcel_id, this.selectedProduct, this.dataSource);
            // only load stats if product is not visible
            if (newValue != 'visible') {
              this.getIndexStats(parcel_id, this.dataSource, this.selectedProduct);
            }
          }
        }
        //should never reach here because selectedProduct should not be set in this gcMode!
        if (this.mode == "many-indices") {
          return;
        }
      }
    },
    availableProducts: function (newValue, oldValue) {

      console.debug("event - availableProductsChange");

      if (this.parcels.length > 0) {

        if (this.mode == "one-index") {
          this.getIndexStats(this.getCurrentParcel().parcel_id, this.dataSource, this.selectedProduct);
        }
        if (this.mode == "many-parcels") {
          for (var i = 0; i < this.selectedParcelIds.length; i++) {
            let parcel_id = this.selectedParcelIds[i];
            this.getParcelsProductData(parcel_id, this.selectedProduct, this.dataSource);
            // only load stats if product is not visible
            if (newValue != 'visible') {
              this.getIndexStats(this.selectedParcelIds[i], this.dataSource, this.selectedProduct);
            }
          }
        }
        if (this.mode == "many-indices") {
          for (var i = 0; i < this.availableProducts.length; i++) {
            this.getParcelsProductData(this.getCurrentParcel().parcel_id, this.availableProducts[i], this.dataSource);
            // only load stats if product is not visible
            if (newValue != 'visible') {
              this.getIndexStats(this.getCurrentParcel().parcel_id, this.dataSource, this.availableProducts[i]);
            }
          }
        }
      }
    },
    dataSource: function (newValue, oldValue) {

      console.debug("event - dataSourceChange");

      if (this.parcels.length > 0) {
        this.refreshData();
      }

    },
    currentParcelID: function (newValue, oldValue) {

      console.debug("event - currentParcelIDChange");
      //only for certain modes refresh
      if (this.mode == "one-index" || this.mode == "many-indices") {
        this.isloading = true;
        this.handleCurrentParcelIDchange(newValue, oldValue);
      }
    },
    visibleParcelIds: function (newValue, oldValue) {
      //may double loading on start and parcelIdsChange through external component
      // this.gcInitialLoading is set to true

      console.debug("event - parcelIdsChange");

      if (this.visibleParcelIds.length > 0) {

        if (this.mode == "many-parcels") {
          for (var i = 0; i < this.selectedParcelIds.length; i++) {
            let parcel_id = this.selectedParcelIds[i];
            if (parcel_id)
              this.getIndexStats(parcel_id, this.dataSource, this.selectedProduct);
          }
        }
      } else
        this.chart.unload();

    },
    statistics: function (newValue, oldValue) {

      console.debug("event - statisticsChange");

      //this.isloading = true;

      // create chart from values, if they change
      this.createChartData();

      try {
        // save first & last of time series
        this.minDate = new Date(newValue[0].date);
        this.maxDate = new Date(newValue[newValue.length - 1].date);

        // only if gcZoomStartdate is not set!
        if (this.gcZoomStartdate === "") {
          this.chartFromDate = this.minDate.simpleDate();
        }
        // only if gcZoomEnddate is not set!
        if (this.gcZoomEnddate === "") {
          this.chartToDate = this.maxDate.simpleDate();
        }

      } catch (ex) {
        console.warn(ex);
      }
    },
    statisticsMany: {
      handler: function (newValue, oldValue) {

        console.debug("event - statisticsManyChange");

        //this.isloading = true;

        // create chart from values, if they change
        this.createChartData();

        if (this.mode == "many-indices") {
          // only if there are values
          if (newValue[this.availableProducts[0]][0]) {
            // only if gcZoomStartdate is not set!
            if (this.gcZoomStartdate === "")
              this.chartFromDate = newValue[this.availableProducts[0]][0].date; // set to the first date of the first product
            // only if gcZoomEnddate is not set!
            if (this.gcZoomEnddate === "")
              this.chartToDate = newValue[this.availableProducts[0]][newValue[this.availableProducts[0]].length - 1].date; // set to the last date of the first product
          }
          if (this.inpFilterDateFromPicker && this.inpFilterDateToPicker) {
            //update min/max date for date selector: first and last item of timeseries
            // take the timeseries of the first available product
            try {
              let minDate = new Date(newValue[this.availableProducts[0]][0].date);
              let maxDate = new Date(newValue[newValue.length - 1].date);

              // save overall min & max Date
              this.minDate = minDate;
              this.maxDate = maxDate;

            } catch (ex) {
              console.warn("Error getting values of statistics in many-indices mode.");
            }
          }
        }

        if (this.mode == "many-parcels") {
          // get min & max of all parcels for selected product
          // initial values of first parcel
          try {
            let minDate = new Date();
            let maxDate = new Date();
            for (let i = 0; i < this.selectedParcelIds.length; i++) {

              const statsElement = newValue[i];
              if (statsElement === undefined)
                continue;
              const timeseries = statsElement[this.selectedProduct];
              if (timeseries.length === 0)
                continue;

              let testMinDate = new Date(timeseries[0].date);
              if (testMinDate < minDate) {
                minDate = testMinDate;
              }
              let testMaxDate = new Date(timeseries[timeseries.length - 1].date);
              if (testMaxDate > maxDate) {
                maxDate = testMaxDate;
              }
            }
            // save overall min & max Date
            this.minDate = minDate;
            this.maxDate = maxDate;

            // only if gcZoomStartdate is not set!
            if (this.gcZoomStartdate === "") {
              this.chartFromDate = this.minDate.simpleDate();
            }
            // only if gcZoomEnddate is not set!
            if (this.gcZoomEnddate === "") {
              this.chartToDate = this.maxDate.simpleDate();
            }
          } catch (ex) {
            console.warn("Error getting values of statisticsMany in many-parcels mode.");
            console.error(ex);
          }
        }

        // // zoom in any case on valid date
        // if (this.isDateValid(this.chartFromDate) && this.isDateValid(this.chartToDate)) {
        //   //this.chart.zoom([this.chartFromDate, this.chartToDate]);
        //   this.chart.zoom(this.internalZoomDomain);
        // }
      },
      deep: true //important for watching theses changes!
    },
    hiddenStats: function (newValue, oldValue) {

      // reset first
      let visibleStats = [];
      for (let i = 0; i < this.availableStats.length; i++) {
        if (!(this.hiddenStats.includes(this.availableStats[i]))) {
          visibleStats.push(this.availableStats[i]);
        }
      }
      this.chart.show(visibleStats);

      // hide then
      this.chart.hide(this.hiddenStats);

    },
    selectedGraphType: function (newValue, oldValue) {
      console.debug("event - selectedGraphTypeChange");
      //console.debug(newValue);
      this.isloading = true;
      this.createChartData();
    },
    selectedMarkerType: function (newValue, oldValue) {
      if (newValue != oldValue) {
        console.debug("event - selectedMarkerTypeChange");

        if (this.selectedMarkerType == "sn_marker") {
          //this.getMarkers(this.getCurrentParcel().parcel_id);
        }
        //switch between phenology and SN marker
        if (this.selectedMarkerType == "phenology") {
          this.getPhenology();
        }
        // create chart from values, if they change
        this.createChartData();
      }
    },
    gcCurrentParcelId: function (newValue, oldValue) {
      // highlight graph in chart
      if (parseInt(newValue) > 0)
        this.chart.focus(parseInt(newValue));
      else {
        this.chart.revert(); // reset focus for all!
      }
    },
    currentLanguage(newValue, oldValue) {
      this.changeLanguage();
      //rebuild chart if language changed, otherwise d3 localization will not refresh
      this.createChartData();

      try {
        //zoom to previous zoom selection!
        if (this.isDateValid(this.chartFromDate) && this.isDateValid(this.chartToDate))
          //this.chart.zoom([this.chartFromDate, this.chartToDate]);
          this.chart.zoom(this.internalZoomDomain);
      } catch (ex) {}
      //reset date pickers
      this.initDatePickers();
    },
    gcSelectedDate(newValue, oldValue) {
      /*       
          Workaround!
          
          Any selection in bb.js chart (programmatically or via UI) will result in a toggle selection
          when gcSelectedDate is set again externally (vue prop - root is in control); 
          Thus it will be selected and deselected right after it -> result no selection at all.
          AND: bb.js chart.selected() was not reliable - it sometimes looses its selection data! 

          So it is necessary to store a map (internalQueryDate) on the graphs in a custom object
          and check if the chart already knows about this date (could be set by clicking in the chart)
          if so, don't change the selection again.
      */
      console.debug("gcSelectedDateChange");

      if (this.mode == "one-index") {

        // if not set, just assign the first of availableStats
        // and check if its not hidden
        if (this.selectedChartId.length == 0) {
          for (var i = 0; i < this.availableStats.length; i++) {
            let stat = this.availableStats[i];
            if (!this.hiddenStats.includes(stat)) {
              this.selectedChartId = stat;
              break;
            }
          }
        }
        // console.debug(this.statistics);
        const exactDate = this.getClosestDate(this.statistics.map(d => new Date(d.date)),
          new Date(newValue));
        let alreadySelected = false;
        if (this.internalQuerydate.hasOwnProperty(this.selectedChartId)) {
          alreadySelected = this.internalQuerydate[this.selectedChartId].simpleDate() === exactDate.simpleDate();
        }
        // console.debug(alreadySelected);
        if (alreadySelected === true) {
          console.debug(this.selectedChartId + " already has date " + exactDate.simpleDate() +
            " selected. Checking next one..");
          return;
        } else {
          let index = this.getClosestTimeSeriesIndex(this.statistics, newValue);
          // reset selection of other selection points -> true
          this.chart.select(this.selectedChartId, [index], true);
        }
      }
      if (this.mode == "many-indices") {

        for (var i = 0; i < this.availableProducts.length; i++) {
          let product = this.availableProducts[i];

          const exactDate = this.getClosestDate(this.statisticsMany[product].map(d => new Date(d.date)),
            new Date(newValue));

          let alreadySelected = false;
          if (this.internalQuerydate.hasOwnProperty(product)) {
            alreadySelected = this.internalQuerydate[product].simpleDate() === exactDate.simpleDate();
          }
          // console.debug(alreadySelected);
          if (alreadySelected === true) {
            console.debug(product + " already has date " + exactDate.simpleDate() +
              " selected. Checking next one..");
            continue;
          } else {
            let index = this.getClosestTimeSeriesIndex(this.statisticsMany[product], newValue);
            // unselect on this product only
            this.chart.unselect(product);
            // reset selection of other selection points -> true
            this.chart.select(product, [index], false);
          }
        }
      }
      if (this.mode == "many-parcels") {
        // for portfolio use case a query date has to be transformed to the closest exact date
        // of the available time series
        for (var i = 0; i < this.selectedParcelIds.length; i++) {
          let parcel_id = this.selectedParcelIds[i];
          //console.debug(parcel_id);
          let p = this.statisticsMany.find(p => p.parcel_id == parcel_id)
          //console.debug(p);
          const exactDate = this.getClosestDate(p[this.selectedProduct].map(d => new Date(d.date)),
            new Date(newValue));

          let alreadySelected = false;
          if (this.internalQuerydate.hasOwnProperty(parcel_id + "")) {
            alreadySelected = this.internalQuerydate[parcel_id + ""].simpleDate() === exactDate.simpleDate();
          }
          // console.debug(alreadySelected);
          if (alreadySelected === true) {
            console.debug("parcel " + parcel_id + " already has date " + exactDate.simpleDate() +
              " selected. Checking next one..");
            continue;
          } else {
            let index = this.getClosestTimeSeriesIndex(p[this.selectedProduct], newValue);
            // unselect on this parcel only
            this.chart.unselect(parcel_id + "");
            // do not change the selection of other selection points on other parcels-> false
            this.chart.select(parcel_id + "", [index], false);
          }
        }
      }
    },
    mode(newValue, oldValue) {
      //re init because mode has changed!
      if (this.mode == "many-indices") {
        this.statisticsMany = {
          vitality: [],
          ndvi: [],
          ndre1: [],
          ndre2: [],
          ndwi: [],
          savi: [],
          evi2: [],
          cire: [],
          npcri: [],
          bsi: []
        };
      }
      if (this.mode == "many-parcels") {
        this.statisticsMany = [];
      }
      //set first of available products to the selected one
      if (this.mode == "one-index" || this.mode == "many-parcels") {
        this.selectedProduct = this.availableProducts[0];
      }

      //refresh data
      if (this.parcels.length > 0) {
        this.refreshData();
      }
    },
    minDate(newValue, oldValue) {
      if (this.inpFilterDateFromPicker && this.inpFilterDateToPicker) {
        // console.debug(newValue);
        // update min/max date for date selector
        this.inpFilterDateFromPicker.options["minDate"] = newValue;
        this.inpFilterDateToPicker.options["minDate"] = newValue;
      }
    },
    maxDate(newValue, oldValue) {
      if (this.inpFilterDateFromPicker && this.inpFilterDateToPicker) {
        // update min/max date for date selector
        this.inpFilterDateFromPicker.options["maxDate"] = newValue;
        this.inpFilterDateToPicker.options["maxDate"] = newValue;
      }
    },
    cloudFilter(newValue, oldValue) {

      if (this.parcels.length > 0) {
        this.chart.unload();

        if (this.mode == "one-index") {
          this.getIndexStats(this.getCurrentParcel().parcel_id, this.dataSource, this.selectedProduct);
        }
        if (this.mode == "many-parcels") {
          for (var i = 0; i < this.selectedParcelIds.length; i++) {
            let parcel_id = this.selectedParcelIds[i];
            this.getParcelsProductData(parcel_id, this.selectedProduct, this.dataSource);
            // only load stats if product is not visible
            if (newValue != 'visible') {
              this.getIndexStats(this.selectedParcelIds[i], this.dataSource, this.selectedProduct);
            }
          }
        }
        if (this.mode == "many-indices") {
          for (var i = 0; i < this.availableProducts.length; i++) {
            this.getParcelsProductData(this.getCurrentParcel().parcel_id, this.availableProducts[i], this.dataSource);
            // only load stats if product is not visible
            if (newValue != 'visible') {
              this.getIndexStats(this.getCurrentParcel().parcel_id, this.dataSource, this.availableProducts[i]);
            }
          }
        }
      }
    },
    filterString(newValue, oldValue) {
      // refresh parcels
      console.debug("gc-chart - filterString changed")
      //this.getAllParcels(undefined, this.offset, newValue);
      // if (this.currentParcelID > 0) {
      //   this.getAllParcels(this.currentParcelID, this.offset, this.filterString);
      // }
      // else {
      this.getAllParcels(undefined, this.offset, this.filterString);
      // }
    },
    offset(newValue, oldValue) {
      //fetch next batch of parcels
      this.getAllParcels(undefined, newValue, this.filterString);
    },
    phenology(newValue, oldValue) {
      // redraw chart
      this.createChartData();
    },
    similarity(newValue, oldValue) {
      // redraw chart
      this.createChartData();
    },
    // currentTimeseries(newValue, oldValue) {
    //   //notify root 
    //   this.$root.$emit("timeseriesChange", newValue);
    // },
  },
  methods: {
    getApiUrl: function (endpoint) {
      /* handles requests directly against  geocledian endpoints with API keys
          or (if gcProxy is set)
        also requests against the URL of gcProxy prop without API-Key; then
        the proxy or that URL has to add the api key to the requests against geocledian endpoints
      */
      let protocol = 'http';

      if (this.apiSecure) {
        protocol += 's';
      }

      // if (this.apiEncodeParams) {
      //   endpoint = encodeURIComponent(endpoint);
      // }

      // with or without apikey depending on gcProxy property
      return (this.gcProxy ?
        protocol + '://' + this.gcProxy + this.apiBaseUrl + endpoint :
        protocol + '://' + this.gcHost + this.apiBaseUrl + endpoint + "?key=" + this.apiKey);
    },
    getAllParcels: function (parcel_id, offset, filterString) {

      // show spinner
      this.isloading = true;

      //download in chunks of n parcels
      let limit = this.limit; //this.pagingStep;

      const endpoint = "/parcels";
      let params = "&limit=" + limit; //set limit to maximum (default 1000)

      if (offset) {
        params = params + "&offset=" + offset;
      }
      if (filterString) {
        params = params + filterString;
      }

      let xmlHttp = new XMLHttpRequest();
      let async = true;

      //Show requests on the DEBUG console for developers
      console.debug("getAllParcels()");
      console.debug("GET " + this.getApiUrl(endpoint) + params);

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          var tmp = JSON.parse(xmlHttp.responseText);
          if (xmlHttp.status != 200) {
            if (tmp.detail == "key is not authorized") {
              // show message, hide spinner, don't show chart
              this.api_err_msg = 'status_msg.unauthorized_key';
              this.isloading = false;
              return;
            }
            if (tmp.detail == "api key validity expired") {
              // show message, hide spinner, don't show chart
              this.api_err_msg = 'status_msg.invalid_key';
              this.isloading = false;
              return;
            }
            if (xmlHttp.status == 403) {
              // show message, hide spinner, don't show map
              this.api_err_msg = 'status_msg.missing_permissions';
              this.isloading = false;
              return;
            }
          } else {

            this.parcels = [];

            if (tmp.content.length == 0) {
              // show empty chart with no data msg
              this.createChartData();
              return;
            }

            for (var i = 0; i < tmp.content.length; i++) {
              var item = tmp.content[i];
              this.parcels.push(item);
            }

            try {
              if (this.mode == "one-index" || this.mode == "many-indices") {
                // if parcel_id was given as an argument to the function
                // set this value as currentParcelID
                if (parcel_id) {
                  this.currentParcelID = parcel_id;
                  //console.debug("setting "+ parcel_id +" parcel id as current!");
                  // hack needed to call the change explicitely if the filter includes the first element
                  // of previously unfiltered parcels!
                  // 1=1 -> no change in watch of vuejs
                  this.handleCurrentParcelIDchange(-1, this.currentParcelID);
                } else {

                  console.debug("setting first parcel as current!");

                  this.currentParcelID = this.parcels[0].parcel_id;
                  console.debug("currentParcelID: " + this.currentParcelID);

                  // hack needed to call the change explicitely if the filter includes the first element
                  // of previously unfiltered parcels!
                  // 1=1 -> no change in watch of vuejs
                  if (this.currentParcelID == this.parcels[0].parcel_id) {
                    this.handleCurrentParcelIDchange(-1, this.parcels[0].parcel_id);
                  }

                  console.debug("currentParcelID: " + this.currentParcelID);
                }
              } else {
                this.handleCurrentParcelIDchange();
              }
            } catch (err) {
              console.debug("error selecting parcel_id");
              console.debug(err);
            }
          }

        }
      }.bind(this);
      xmlHttp.open("GET", this.getApiUrl(endpoint) + params, async);
      xmlHttp.send();
    },
    // hack; see getAllParcels() for explanation
    handleCurrentParcelIDchange: function () {

      console.debug("handleCurrentParcelIDchange");

      //only if valid parcel id
      if (this.currentParcelID > 0) {
        if (this.selectedMarkerType == "sn_marker") {
          //this.getMarkers(this.getCurrentParcel().parcel_id);
        } else {
          this.sn_markers = {};
        }

        //reset phenology because it depends on date entries of parcels
        this.phenology = [];

        //reset similarity
        this.$root.$emit('resetSimilarity');
        this.$root.$emit("resetPhenology");

        let currentParcel = this.getCurrentParcel();
        if (currentParcel !== undefined) {
          if (this.mode == "one-index") {
            this.getIndexStats(currentParcel.parcel_id, this.dataSource, this.selectedProduct);
          }
          if (this.mode == "many-indices") {
            for (var i = 0; i < this.availableProducts.length; i++) {
              this.getIndexStats(currentParcel.parcel_id, this.dataSource, this.availableProducts[i]);
            }
          }
        } else {
          this.api_err_msg = "status_msg.parcel_id_not_found";
          this.isloading = false;
          return;
        }
      }
      if (this.mode == "many-parcels") {
        for (var i = 0; i < this.selectedParcelIds.length; i++) {
          let parcel_id = this.selectedParcelIds[i];
          if (parcel_id)
            this.getIndexStats(parcel_id, this.dataSource, this.selectedProduct);
        }
      }
    },
    getParcelsProductData: function (parcel_id, product, source) {

      // show spinner
      this.isloading = true;

      // hide watermark message
      this.watermark_msg = "";

      const endpoint = "/parcels/" + parcel_id + "/" + product;
      let params;

      if (this.apiMajorVersion == 3) {
        params = "&source=" + source + //landsat8 | sentinel2 | <empty string>
          "&order=date&statistics=true";
      }
      // no empty params for API v4!
      if (this.apiMajorVersion == 4) {
        if (["ndre1", "ndre2", "cire"].includes(product)) {
          source = "sentinel2" // always sentinel2 for red edge indices
        } else {
          if (source.length == 0) {
            source = "combined"
          }
        }
        params = "&source=" + source + //landsat8 | sentinel2 | <empty string>
          "&order=date&statistics=true";
      }

      let xmlHttp = new XMLHttpRequest();
      let async = true;

      //Show requests on the DEBUG console for developers
      console.debug("getParcelsProductData()");
      console.debug("GET " + this.getApiUrl(endpoint) + params);

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {

          if (xmlHttp.status == 403) {
            // show watermark on widget
            this.watermark_msg = 'status_msg.missing_permissions';
            this.isloading = false;
            this.createChart();
            return;
          }

          //console.log(xmlHttp.responseText);
          let tmp = JSON.parse(xmlHttp.responseText);
          let row = this.getCurrentParcel();

          // if (tmp.content.length > 0) {
          // add new attributes via Vue.set

          // one parcel can have 1-n rasters of the same product (time series!)
          // add all rasters (=time series)
          Vue.set(row, "timeSeries", tmp.content); //url + tmp.content[0].png + "?key=" + key);
          // }
          // else {
          // // show empty chart with no data msg
          // this.createChartData();
          // this.isloading = false;
          // }

        }
      }.bind(this);
      xmlHttp.open("GET", this.getApiUrl(endpoint) + params, async);
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
    getIndexStats: function (parcel_id, source, product) {

      this.isloading = true; // hide chart with this boolean
      this.api_err_msg = ""; // empty api messages
      // hide watermark message
      this.watermark_msg = "";

      let productName = product;

      // may happen on selected product visible and change to another parcel
      if (productName == "visible") {
        // so local product name to vitality so it fetches NDVI stats
        productName = "vitality";
      }

      const endpoint = "/parcels/" + parcel_id + "/" + productName;

      let params;
      if (this.apiMajorVersion == 3) {
        params = "&source=" + source + //landsat8 | sentinel2 | <empty string>
          "&order=date&statistics=true" + "&cloud_filter=" + this.cloudFilter;
      }
      // no empty params for API v4!
      if (this.apiMajorVersion == 4) {
        if (["ndre1", "ndre2", "cire"].includes(product)) {
          source = "sentinel2" // always sentinel2 for red edge indices
        } else {
          if (source.length == 0) {
            source = "combined"
          }
        }
        params = "&source=" + source + //landsat8 | sentinel2 | <empty string>
          "&order=date&statistics=true" + "&cloud_filter=" + this.cloudFilter;
      }


      let xmlHttp = new XMLHttpRequest();
      let async = true;

      //Show requests on the DEBUG console for developers
      console.debug("getIndexStats()");
      console.debug("GET " + this.getApiUrl(endpoint) + params);

      //clear chart
      this.chart.unload();

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {

          if (xmlHttp.status == 403) {
            // show watermark on widget
            this.watermark_msg = 'status_msg.missing_permissions';
            this.isloading = false;
            return;
          }

          //console.log(xmlHttp.responseText);
          var tmp = JSON.parse(xmlHttp.responseText);
          var row = this.getParcel(parcel_id);

          // note that even an empty reponse will work in the following lines
          // just producing empty arrays

          // which one is active stats or phenology?
          this.currentGraphContent = "statistics";

          // only chart data is necessary here
          if (this.mode == "one-index") {
            this.statistics = tmp.content;
          }
          if (this.mode == "many-parcels") {

            let parcel = this.statisticsMany.find(p => parseInt(p.parcel_id) == parseInt(parcel_id));

            if (parcel) {

              let idx = this.statisticsMany.indexOf(parcel);
              parcel[productName] = tmp.content;
              // existent -> update with new product
              this.statisticsMany.splice(idx, 1, parcel);
            } else {
              //console.debug("before insert - this.statisticsMany.length: " +this.statisticsMany.length);
              //console.debug("parcel_id: " +parcel_id);
              parcel = {
                "parcel_id": parseInt(parcel_id)
              };
              parcel[productName] = tmp.content;
              //new -> insert
              this.statisticsMany.push(parcel);
              //console.debug("after insert - this.statisticsMany.length: " +this.statisticsMany.length);
            }
          }
          if (this.mode == "many-indices") {
            this.statisticsMany[productName] = tmp.content;
          }

          // init datepickers now as the timeseries is ready
          // load external Javascript file has to exists prior to this!
          // should be handled in an init script
          this.initDatePickers();
        }
      }.bind(this);

      xmlHttp.open("GET", this.getApiUrl(endpoint) + params, async);
      xmlHttp.send();
    },
    getPhenology: function () {

      /* only available for API v4 */
      if (this.apiMajorVersion < 4) {
        return;
      }
      this.$root.$emit("resetSimilarity");
      this.$root.$emit("resetPhenology");

      this.api_err_msg = ""; // empty api messages
      // hide watermark message
      this.watermark_msg = "";

      const endpoint = "/parcels/" + this.gcCurrentParcelId + "/" + "phenology";

      let params = "";

      if (this.gcPhStartdate)
        params = params + "&startdate=" + this.gcPhStartdate;

      if (this.gcPhEnddate)
        params = params + "&enddate=" + this.gcPhEnddate;

      console.debug("getPhenology()");
      console.debug("GET " + this.getApiUrl(endpoint));

      let xmlHttp = new XMLHttpRequest();
      let async = true;

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          if (xmlHttp.status == 403) {
            // show watermark on widget
            this.watermark_msg = 'status_msg.missing_permissions';
            this.isloading = false;
            return;
          }

          var tmp = JSON.parse(xmlHttp.responseText);

          this.phenology = [];
          for (var i = 0; i < tmp.content.length; i++) {
            var item = tmp.content[i];
            this.phenology.push(item);
          }
        }
      }.bind(this);
      xmlHttp.open("GET", this.getApiUrl(endpoint) + params, async);
      xmlHttp.send();
    },
    getSimilarity: function () {

      /* only available for API v4 */
      if (this.apiMajorVersion < 4) {
        return;
      }
      this.isloading = true;

      this.$root.$emit("resetPhenology");
      this.$root.$emit('resetSimilarity');

      this.api_err_msg = ""; // empty api messages
      // hide watermark message
      this.watermark_msg = "";

      const endpoint = "/parcels/" + this.gcCurrentParcelId + "/" + "similarity";

      let params = "";
      params = "&radius=" + this.simRadius +
        "&entity=" + this.simEntity +
        "&crop=" + this.simCrop +
        "&interval=" + this.simInterval +
        "&references=" + this.simReferences

      if (this.gcSimStartdate)
        params = params + "&startdate=" + this.gcSimStartdate;

      if (this.gcSimEnddate)
        params = params + "&enddate=" + this.gcSimEnddate;

      if (this.gcSimVerification === true) {
        params = params + "&classification=" + this.gcSimVerification;
      }
      console.debug("getSimilarity()");
      console.debug("GET " + this.getApiUrl(endpoint) + params);

      let xmlHttp = new XMLHttpRequest();
      let async = true;

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          if (xmlHttp.status == 403) {
            // show watermark on widget
            this.watermark_msg = 'status_msg.missing_permissions';
            this.isloading = false;
            return;
          }

          var tmp = JSON.parse(xmlHttp.responseText);

          if (xmlHttp.status == 200) {
            tmp = tmp.content;

            let classification = {};
            if (tmp.classification) {
              classification = tmp.classification;
            }
            this.similarity = {
              "reference_timeseries": tmp.reference_timeseries,
              "parcel_timeseries": tmp.parcel_timeseries,
              "similarity": tmp.similarity,
              "classification": classification
            };
            // which one is active
            this.currentGraphContent = "similarity";
          }
        }
      }.bind(this);
      xmlHttp.open("GET", this.getApiUrl(endpoint) + params, async);
      xmlHttp.send();
    },
    createChartData: function () {
      console.debug("createChartData()");

      let chartType = this.currentGraphContent;
      let columns = [];

      if (chartType == "statistics") {
        if (this.mode == "one-index") {
          if (this.statistics.length > 0) {

            let filteredStats = this.statistics.filter(s => s.statistics != null);

            // map axis to values
            columns[0] = ["x"].concat(filteredStats.map(r => r.date));

            // format values to 2 decimals
            let means = [];
            // if (!this.hiddenStats.includes("errorBand")) {
            // create errorBand
            means = this.createErrorBand(filteredStats);
            // else {
            //   means = filteredStats.map( r => this.formatDecimal(r.statistics.mean, 3));
            // }
            columns[1] = ["mean"].concat(means);
            columns[2] = ["std.dev."].concat(filteredStats.map(r => this.formatDecimal(r.statistics.stddev, 3)));
            columns[3] = ["min"].concat(filteredStats.map(r => this.formatDecimal(r.statistics.min, 3)));
            columns[4] = ["max"].concat(filteredStats.map(r => this.formatDecimal(r.statistics.max, 3)));
            columns[5] = ["meanl8"].concat(filteredStats.map(function (r) {
              if (r.source === "landsat8") {
                return this.formatDecimal(r.statistics.mean, 3);
              } else {
                return null;
              }
            }.bind(this)));
            columns[6] = ["means2"].concat(filteredStats.map(function (r) {
              if (r.source === "sentinel2") {
                return this.formatDecimal(r.statistics.mean, 3);
              } else {
                return null;
              }
            }.bind(this)));
          }
        }
        if (this.mode == "many-indices") {

          // map x axis to values of first available product
          columns[0] = ["x"].concat(this.statisticsMany[this.availableProducts[0]].map(r => r.date));

          //console.debug("first x axis is "+this.availableProducts[0]);

          // API v3
          // vitality may have other dates than the dynamic indices (because of processing mode 'basic' vs 'reflectances') -> another x axis necessary
          // not true for API v4
          if (this.apiMajorVersion === 3) {
            if (this.availableProducts.includes("vitality")) {
              columns[1] = ["x3"].concat(this.statisticsMany["vitality"].filter(s => s.statistics != null).map(r => r.date));
            }
          }
          if (this.apiMajorVersion === 4) {
            columns[1] = ["x"].concat(this.statisticsMany["vitality"].filter(s => s.statistics != null).map(r => r.date));
          }

          // APIv3 & API v4: 
          // TODO: mixed lengths of sentinel2/landsat8 if Red Edge Products are requested (NDRE1+2, CIRE)
          //
          if (this.availableProducts.includes("ndre1")) {
            columns[1] = ["x4"].concat(this.statisticsMany["ndre1"].filter(s => s.statistics != null).map(r => r.date));
          }
          if (this.availableProducts.includes("ndre2")) {
            columns[1] = ["x4"].concat(this.statisticsMany["ndre2"].filter(s => s.statistics != null).map(r => r.date));
          }
          if (this.availableProducts.includes("cire")) {
            columns[1] = ["x4"].concat(this.statisticsMany["cire"].filter(s => s.statistics != null).map(r => r.date));
          }

          // map y axis
          for (var i = 0; i < this.availableProducts.length; i++) {
            const product = this.availableProducts[i];
            const filteredStats = this.statisticsMany[product].filter(s => s.statistics != null);
            //place the new column after the existing one(s)

            let means = [];
            // if (!this.hiddenStats.includes("errorBand")) {
            // create errorBand
            means = this.createErrorBand(filteredStats);
            // }
            // else {
            //   means = filteredStats.map( r => this.formatDecimal(r.statistics.mean, 3));
            // }
            columns[columns.length] = [product].concat(means);
          }
          // style:
          // columns[2] = ["ndvi"].concat( this.statisticsMany["ndvi"].map( r => this.formatDecimal(r.statistics.mean, 3)));

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
            for (var i = 0; i < this.selectedParcelIds.length; i++) {
              let parcel_id = this.selectedParcelIds[i];
              let idx = this.selectedParcelIds.indexOf(parcel_id);
              let parcel = this.statisticsMany.find(p => p.parcel_id == parcel_id);

              if (parcel) {
                let parcelStats = parcel[this.selectedProduct];
                if (parcelStats) {
                  //important! map parcel to the index position in selectedParcelIds 
                  //then the correct x axis may be mapped later in createChart()

                  //exclude null statistics
                  let filteredStats = parcelStats.filter(s => s.statistics != null);
                  columns[idx] = ["x" + idx].concat(filteredStats.map(r => r.date));
                }
              }
            }

            // fill columns with data (i.e. map y axis)
            for (var i = 0; i < this.selectedParcelIds.length; i++) {
              let parcel_id = this.selectedParcelIds[i];
              let parcel = this.statisticsMany.find(p => p.parcel_id == parcel_id);

              if (parcel) {
                let parcelStats = parcel[this.selectedProduct];
                if (parcelStats) {
                  //place the new column after the existing one(s)
                  //exclude null statistics
                  const filteredStats = parcelStats.filter(s => s.statistics != null);

                  // create errorBand
                  const means = this.createErrorBand(filteredStats);

                  //columns[columns.length] = [parcel_id].concat( filteredStats.map( r => this.formatDecimal(r.statistics.mean, 3)));
                  columns[columns.length] = [parcel_id].concat(means);
                }
              }
            }
          }
        }

        // new style of phenology visualization
        if (this.selectedMarkerType == "phenology") {
          // only for many-indices & one-index at the moment
          if (this.mode !== "many-parcels") {

            try {
              // TODO: check if we can merge all markers to one date array
              // columns[columns.length] = ["x5"].concat(this.sos, this.pos, this.eos);     
              // FIX: filter null dates before building x/y pairs — a null in x5/x6/x7
              // causes billboard.js to misalign all subsequent bars positionally.
              const sosPairs = this.sos.map(date => ({ date, max })).filter(p => p.date !== null);
              const posPairs = this.pos.map(date => ({ date, max })).filter(p => p.date !== null);
              const eosPairs = this.eos.map(date => ({ date, max })).filter(p => p.date !== null);
              columns[columns.length] = ["x5"].concat(sosPairs.map(p => p.date));
              columns[columns.length] = ["x6"].concat(posPairs.map(p => p.date));
              columns[columns.length] = ["x7"].concat(eosPairs.map(p => p.date));

              let max;
              let min;

              if (this.gcYScale === "dynamic") {

                // max computed from values & exclude null stats first!
                let maxStats = this.statistics.filter(r => r.statistics !== null).map(r => r.statistics.max);
                max = Number.NEGATIVE_INFINITY;
                for (let i = 0; i < maxStats.length; i++) {
                  if (maxStats[i] > max) {
                    max = maxStats[i];
                  }
                }
                // min computed from values & exclude null stats first!
                let minStats = this.statistics.filter(r => r.statistics !== null).map(r => r.statistics.min);
                min = Number.POSITIVE_INFINITY;
                for (let i = 0; i < minStats.length; i++) {
                  if (minStats[i] < min) {
                    min = minStats[i];
                  }
                }
              }
              if (this.gcYScale === "fixed") {

                // max declared by axis min/max (in config of chart)
                max = this.chart.axis.max().y;
                min = this.chart.axis.min().y;

              }

              // guard: fallback if statistics was empty (e.g. many-indices mode)
              // guard: if statistics was empty (e.g. in many-indices mode this.statistics
              // is never filled), max/min stay at their sentinel values -> NaN in SVG y attr
              if (max === Number.NEGATIVE_INFINITY || max === undefined) {
                max = 1.0;
              }
              if (min === Number.POSITIVE_INFINITY || min === undefined) {
                min = 0.0;
              }

              let minMax = {
                min: min,
                max: max
              };


              // assign the maximum of the y axis to the bar charts of phenology markers
              //TODO: minimum is not possible for bars at the moment!
              columns[columns.length] = ["sos"].concat(sosPairs.map(p => p.max));
              columns[columns.length] = ["pos"].concat(posPairs.map(p => p.max));
              columns[columns.length] = ["eos"].concat(eosPairs.map(p => p.max));

              // assign the min & max of the y axis to the candlestick charts of phenology markers
              // columns[columns.length] = ["sos"].concat(this.createCandleStickVals(this.sos.map( r => minMax)));
              // columns[columns.length] = ["pos"].concat(this.createCandleStickVals(this.pos.map( r => minMax)));
              // columns[columns.length] = ["eos"].concat(this.createCandleStickVals(this.eos.map( r => minMax)));

            } catch (ex) {
              console.debug("could not add phenology data to chart..")
              console.log(ex)
            }
          }
        }

        // // markers
        // try {
        //     // let markers;
        //     // if (this.selectedMarkerType == "sn_marker") {
        //     //     if (this.sn_markers) {
        //     //         markers = this.sn_markers.markers;
        //     //     }
        //     // }
        //     // if (this.selectedMarkerType == "phenology") {
        //     //     if (this.phenology.phenology) {
        //     //         markers = this.phenology.phenology.markers;
        //     //     }
        //     // }

        //     // if (markers) {
        //     //     // sort object by date in place
        //     //     markers.sort((a, b) => (a.date > b.date) ? 1 : -1);

        //     //     if (markers.length > 0) {
        //     //         //workaround for unfinished API: filter out date: "None"
        //     //         let dates_markers = markers.map( r => r.date != "None" ? r.date : NaN );

        //     //         // map date values to the second x axis
        //     //         columns[7] = ["x2"].concat(dates_markers);
        //     //         // format values to 2 decimals
        //     //         columns[8] = ["marker"].concat( markers.map(r => this.formatDecimal(r.mean, 3)));                                                                    
        //     //     }
        //     // }
        // }
        // catch (err) {
        //     console.log("error getting markers!");
        //     console.error(err);
        // }

        this.api_err_msg = ""; // empty api messages

        /*
        document.getElementById("similaritySummaryDiv").classList.add("is-hidden");
        document.getElementById("phenologyResultsDiv").classList.add("is-hidden");*/

        if (this.mode == "many-parcels") {
          // create chart when all data is ready - not earlier as this leads to undefined entries in data array
          // error: t[i] is undefined in bb.js
          // columns.length is double the size of the selectedParcelIds (x array + y array)
          if (columns.length === this.selectedParcelIds.length * 2) {
            // clean array: remove empty time series (which have length == 1 because of the id of the axis and the parcel_id)
            const cleanedColumns = [];
            for (var i = 0; i < columns.length; i++) {
              if (columns[i].length > 1)
                cleanedColumns.push(columns[i]);
            }
            // console.debug(cleanedColumns);
            this.createChart(cleanedColumns);
          } else {
            console.debug("createChartData() - not ready yet: not all statistics processed!")
            // console.debug(columns);
          }
        } else {
          this.createChart(columns);
        }
      }
      if (chartType === "similarity") {

        if (this.similarity.parcel_timeseries.length > 0) {
          let columns = [];
          // empty chart first
          this.createChart(columns);
          // prepare data & create chart with data
          this.prepareSimilarityData();
        }
      }
    },
    createChart: function (data) {

      console.debug("createChart()");
      // console.debug(data);

      let xs_options = {};
      let ys_options = {};

      // will be changed for many-parcels gcMode
      let meanType;
      // if (!this.hiddenStats.includes("errorBand")) {
      if (this.selectedGraphType != "area") {
        meanType = 'area-' + this.selectedGraphType + '-range';
      }
      // } else {
      //   meanType = this.selectedGraphType;
      // }
      let types_options = {
        "mean": meanType,
        'std.dev.': 'bar',
        'min': this.selectedGraphType,
        'max': this.selectedGraphType,
        'meanl8': 'scatter',
        'means2': 'scatter',
        //'parcel (mean)': this.selectedGraphType , 
        //'reference (mean)' : this.selectedGraphType,
        'marker': 'scatter',
        'sos': 'bar', //'candlestick', //
        'pos': 'bar', //'candlestick', //
        'eos': 'bar', //'candlestick', //
      };
      if (this.mode == "one-index") {
        xs_options = {
          "mean": "x",
          "means2": "x",
          "meanl8": "x",
          "min": "x",
          "max": "x",
          "std.dev.": "x",
          "parcel (mean)": "x",
          "reference (mean)": "x2",
          "marker": "x2",
          "sos": "x5",
          "pos": "x6",
          "eos": "x7",
        }
        ys_options = {
          "max": this.gcYScale == 'dynamic' ? undefined : this.selectedProduct == 'cire' ? 5.0 : 1.0,
          "min": this.gcYScale == 'dynamic' ? undefined : this.selectedProduct == 'cire' ? 0.0 : -0.2,
        }
      }
      if (this.mode == "many-indices") {

        for (var i = 0; i < this.availableProducts.length; i++) {
          const product = this.availableProducts[i];
          if (!["vitality", "ndre1", "ndre2", "cire"].includes(product)) {
            xs_options[product] = "x";
            types_options[product] = meanType; // this.selectedGraphType;
          }
          if (product === "vitality") {
            if (this.apiMajorVersion === 3) {
              xs_options[product] = "x3";
            }
            if (this.apiMajorVersion === 4) {
              xs_options[product] = "x";
            }
            types_options[product] = meanType; // this.selectedGraphType;
          }
          if (["ndre1", "ndre2", "cire"].includes(product)) {
            xs_options[product] = "x4";
            types_options[product] = meanType; // this.selectedGraphType;
          }
        }
        // similarity
        xs_options["parcel (mean)"] = "x";
        xs_options["reference (mean)"] = "x2";

        // phenology 
        xs_options["sos"] = "x5";
        xs_options["pos"] = "x6"; //"x6";
        xs_options["eos"] = "x7"; //"x7";

        ys_options = {
          "max": this.gcYScale == 'dynamic' ? undefined : this.availableProducts.includes('cire') ? 5.0 : 1.0,
          "min": this.gcYScale == 'dynamic' ? undefined : this.availableProducts.includes('cire') ? 0.0 : -0.2,
        }
      }
      if (this.mode == "many-parcels") {

        for (var i = 0; i < this.selectedParcelIds.length; i++) {
          const parcel_id = this.selectedParcelIds[i];
          const idx = this.selectedParcelIds.indexOf(parcel_id);
          xs_options[parcel_id] = "x" + idx;
          types_options[parcel_id] = meanType; // this.selectedGraphType;
        }
        ys_options = {
          "max": this.gcYScale == 'dynamic' ? undefined : this.selectedProduct == 'cire' ? 5.0 : 1.0,
          "min": this.gcYScale == 'dynamic' ? undefined : this.selectedProduct == 'cire' ? 0.0 : -0.2,
        }
      }

      var axis_label;
      if (this.mode == "one-index") {
        if (this.selectedProduct == "vitality" || this.selectedProduct == "variations" || this.selectedProduct == "visible") {
          axis_label = this.$t("products.vitality");
        } else {
          if (this.selectedProduct == "maturity") {
            axis_label = this.$t("products.ndre1");
          }
          axis_label = this.$t("products." + this.selectedProduct);
        }
        if (this.currentGraphContent == "similarity") {
          axis_label = this.$t("products.ndvi");
        }
      } else {
        axis_label = "Index [" + this.$t("statistics.mean") + "]";
      }

      //set i18n for time x axis
      d3.timeFormatDefaultLocale(this.d3locales[this.currentLanguage]);

      // generate without data
      this.chart = bb.generate({
        bindto: '#chart_' + this.gcWidgetId,
        //fixHeightResizing: true,
        data: {
          selection: {
            enabled: true,
            multiple: false,
            grouped: false,
            isselectable: function (d) {
              // disable selection for marker & reference of similarity
              if (d.id == "marker" || d.id == "reference (mean)") {
                return false;
              } else {
                return true;
              }
            },
          },
          // single x axis
          //x: 'x',
          // multiple x axis mapping
          xs: xs_options,
          //xFormat: '%Y-%m-%d', // how the date is parsed
          columns: [], // empty data first - will be loaded below with chart.load()
          names: { //with i18n
            "mean": this.$t("statistics.mean"),
            "min": this.$t("statistics.min"),
            "max": this.$t("statistics.max"),
            "std.dev.": this.$t("statistics.stddev"),
            "meanl8": 'Landsat-8',
            "means2": 'Sentinel-2',
            "sos": this.$t("products.sos"),
            "pos": this.$t("products.pos"),
            "eos": this.$t("products.eos"),
            "vitality": this.$t("products.vitality"),
            "ndvi": this.$t("products.ndvi"),
            "ndre1": this.$t("products.ndre1"),
            "ndre2": this.$t("products.ndre2"),
            "ndwi": this.$t("products.ndwi"),
            "savi": this.$t("products.savi"),
            "evi2": this.$t("products.evi2"),
            "cire": this.$t("products.cire"),
            "npcri": this.$t("products.npcri"),
            "backscatter_vv": this.$t("products.backscatter_vv"),
            "backscatter_vh": this.$t("products.backscatter_vh"),
            "sbmi": this.$t("products.sbmi"),
            "bsi": this.$t("products.bsi"),
            "parcel (mean)": this.$t("similarity.parcel_mean"),
            "reference (mean)": this.$t("similarity.reference_mean"),
          },
          empty: {
            label: {
              text: this.$t("chart.no_data_msg")
            }
          },
          //hide: [ data[3], data[4] ], //hide min and max
          hide: this.hiddenStats,
          type: 'line', //default,
          types: types_options,
          labels: {
            format: function (value, id, index, subindex) {
              // //only label phenology bars
              if (["sos", "pos", "eos"].includes(id)) {
                return id;
              }
            }
          },
          colors: {
            "mean": '#EF7D00', //orange
            "std.dev.": ' #d6d6d6', //'#7d00ef', //light purple
            "min": '#EF7D00',
            "max": '#EF7D00',
            "meanl8": '#0500ef', //light blue
            "means2": '#00eaef', //turquoise
            "parcel (mean)": '#EF7D00', //orange
            "reference (mean)": '#1f77b4', //blue
            "marker": 'grey', //{fill: 'darkgrey', stroke: 'black'}
            // blue , green, crimson / brown
            'sos': '#00578A', //'#003366', //'#A97D5D', // brown '#A37B45',
            'pos': '#298F00', //'teal', //'#99CC99', //'#86942A',
            'eos': '#993300' //'#507642'
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
                c = this.phenology[d.index].status;
              }

              return c;
            } else {
              return color; //default
            }
          },
          onselected: function (e, svgElement, b, c) {
            console.debug("onselected()");
            // only enabled if current graph content is statistics
            if (this.currentGraphContent == "statistics") {
              if (e.x) {
                // save also to internal - value is being checked in watcher
                // if (this.mode === "many-parcels") {
                this.internalQuerydate[e.id + ""] = e.x;
                // }
                this.selectedChartId = e.id;

                // for queryDate of portfolio map
                this.selectedDate = e.x.simpleDate();
              }
            }
            if (this.currentGraphContent == "similarity") {
              if (e.x) {
                // save also to internal - value is being checked in watcher
                // if (this.mode === "many-parcels") {
                this.internalQuerydate[e.id + ""] = e.x;
                // }
                this.selectedChartId = e.id;

                // for queryDate of portfolio map
                this.selectedDate = e.x.simpleDate();
              }
            }
          }.bind(this),
          onhidden: function (ids) {
            if (ids.includes("mean")) {
              // also hide means2 & meanl8
              this.chart.hide("means2");
              this.chart.hide("meanl8");
            }
          }.bind(this),
          onshown: function (ids) {
            if (ids.includes("mean")) {
              // also show means2 & meanl8
              // this.chart.show("means2");
              // this.chart.show("meanl8");
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
          show: this.availableOptions.includes('legend'),
          item: {
            onclick: function (id) {
              if (this.mode == "many-parcels") {
                //disable toggle!
                return;
              }
              //special case for mean, toggle also sentinel2 and landsat8 scatter points
              if (id == "mean") {
                this.chart.toggle("mean");
                //this.chart.toggle("meanl8");
                //this.chart.toggle("means2");
              } else {
                this.chart.toggle(id);
              }
            }.bind(this),
            onover: function (id) {
              if (this.mode == "many-parcels") {
                //send selection of current parcel to root
                this.currentParcelID = id;
              }
            }.bind(this)
          },
        },
        line: {
          connectNull: true
        },
        point: {
          show: true, //show data points in line chart
          //r: 3, //radius of points in line chart
          focus: {
            expand: {
              r: 6
            }
          },
          // issue in billboard 3.1.5: value will override opacity for any point (even for null values)
          // will be fixed with https://github.com/naver/billboard.js/blob/6ff9aec01d831c8fe2449da6b87121281829f209/src/ChartInternal/shape/point.ts#L42
          opacity: 1.0,
          // size dependent of source
          r: function (d) {
            // workaround for opacity issue
            // set radius to 0 if we have a null value
            if (d.value == null) {
              return 0;
            }
            if (d.id == "marker") {
              return 6;
            }
            return 3; //default
          }
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
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              rotate: 60,
              multiline: true,
              //format: '%d.%m.%Y',
              fit: false, //false means evenly spaced- ticks - otherwise the time spans will be honored between dates 
              format: "%e %b %y"
              //format: function (x) { return x.getFullYear(); }
            },
            //timeseries -> milliseconds as units; 1814400000 -> 3 weeks
            padding: {
              right: 1814400000,
              left: 1814400000
            },
          },
          y: {
            label: {
              text: axis_label,
              position: 'outer-top'
            },
            // fixed values vs dynamically scaling
            max: ys_options["max"],
            min: ys_options["min"],
            // max: this.gcYScale == 'dynamic' ? undefined : this.availableProducts.includes('cire') ? 5.0 : 1.0,
            // min: this.gcYScale == 'dynamic' ? undefined : this.availableProducts.includes('cire') ? 0.0 : -0.2,
            padding: {
              top: 10,
              bottom: 0
            }
          },
          // y2: { show: true}
        },
        zoom: {
          enabled: true, //only by chartFrom and chartTo fields!
          type: 'drag', // 'wheel'
          resetButton: false,
          onzoomend: function (domain) {
            // update chartFromDate & chartToDate when zooming per drag

            // and only trigger zoom when both values of the tuple are being modified!
            this.chartFromDate = domain[0].simpleDate();
            this.chartToDate = domain[1].simpleDate();

          }.bind(this)
        },
        tooltip: {
          grouped: true,
          format: {
            /*title: function(x) {
                return x.toISOString().split("T")[0];
            },*/
            name: function (name, ratio, id, index) {
              return name;
            },
            //   value: function (value, ratio, id, index) {

            //     // hide meanl8 and means2 in tooltip
            //     if (id == "meanl8" || id == "means2") {
            //         return;
            //     }

            //     // shows also source in tooltip (e.g. landsat8 or sentinel2)
            //     // only on charttype statistics - not for similarity
            //     if (this.currentGraphContent == "statistics") {
            //         if (this.dataSource == "") {
            //             if (id != "marker") { //exlude for markers
            //               if (this.mode == "one-index") {
            //                 return value + " ("+this.statistics[index].source + ")";
            //               } 
            //               if (this.mode == "many-indices") {
            //                 return value + " ("+this.statisticsMany[id][index].source + ")";
            //               }
            //               if (this.mode == "many-parcels") {
            //                 return value + " ("+this.statisticsMany.find(p => p.parcel_id == id)[this.selectedProduct][index].source + ")";
            //               }
            //             }
            //             else {
            //                 return value;
            //             }
            //         }
            //         else { return value; }
            //     }
            //     else { return value; }
            // }.bind(this)
          },
          // onshow: function(data) {
          //   console.debug("onshow!")
          //   var mid = data.filter(n => n.name == "Mean")[0].value[1];
          //   return null;
          // },
          // onshown: function(data) {
          //   console.debug("onshown!")
          //   // get the HTML for the tooltip
          //   var html = this.$.tooltip.html();
          //   var meanValueHtml = document.getElementsByClassName("bb-tooltip-name-mean")[0].getElementsByClassName("value")[0];
          //   var newValueHtml = "";

          //   if (data.filter(n => n.name == "Mean")[0])
          //   var midValue = data.filter(n => n.name == "Mean")[0].value[1];

          //   if (this.currentGraphContent == "statistics") {
          //     if (this.dataSource == "") {
          //         if (id != "marker") { //exlude for markers
          //           if (this.mode == "one-index") {
          //             newValueHtml = midValue + " ("+this.statistics[index].source + ")";
          //           } 
          //           if (this.mode == "many-indices") {
          //             newValueHtml = midValue + " ("+this.statisticsMany[id][index].source + ")";
          //           }
          //           if (this.mode == "many-parcels") {
          //             newValueHtml = midValue + " ("+this.statisticsMany.find(p => p.parcel_id == id)[this.selectedProduct][index].source + ")";
          //           }
          //         }
          //     }
          //   }

          //   meanValueHtml.innerHTML = ;
          //   // <table class="bb-tooltip"><tbody><tr><th colspan="2">18 Feb 18</th></tr><tr class="bb-tooltip-name-mean"><td class="name"><span style="background-color:#EF7D00"></span>Mean</td><td class="value"><b>Mid:</b> 0.597 (sentinel2) <b>High:</b> 0.622 (sentinel2) <b>Low:</b> 0.572 (sentinel2)</td></tr><tr class="bb-tooltip-name-std-dev-"><td class="name"><span style="background-color: #d6d6d6"></span>Standard Deviation</td><td class="value">0.026 (sentinel2)</td></tr><tr class="bb-tooltip-name-min"><td class="name"><span style="background-color:#EF7D00"></span>Minimum</td><td class="value">0.38 (sentinel2)</td></tr><tr class="bb-tooltip-name-max"><td class="name"><span style="background-color:#EF7D00"></span>Maximum</td><td class="value">0.65 (sentinel2)</td></tr></tbody></table>
          //   // set the HTML for the tooltip with
          //   // this.$.tooltip.html("")
          //   return data;

          // }.bind(this),

          // Works - except for mid/high/low values
          // contents: {
          //   template: '<table class="{=CLASS_TOOLTIP}">' +
          //               '<tbody>' +
          //                   '<tr><th colspan="2">{=TITLE}</th></tr>{{'+
          //                   '<tr class="{=CLASS_TOOLTIP_NAME}"></tr>'+
          //                       '<td class="{=CLASS_TOOLTIP}"><span style="background-color: {=COLOR}"></span>{=NAME}'+
          //                       '</td>'+
          //                       '<td class="">{=VALUE}</td>'+
          //                   '}}</tr>'+
          //               '</tbody>'+
          //             '</table>'
          // }

          // // overriding the contents of the tooltip for more customization
          contents: function (d, defaultTitleFormat, defaultValueFormat, color) {

            console.debug(d);

            let html = '<table class="bb-tooltip">' +
              '<tbody>' +
              '<tr><th colspan="2">' + defaultTitleFormat(d[0].x) + '</th></tr>';

            for (let i = 0; i < d.length; i++) {
              let value, id, index, name, x;
              value = d[i].value;
              id = d[i].id;
              index = d[i].index;
              name = d[i].name;
              x = d[i].x;

              // exclude nulls
              if (value == null)
                continue;
              // hide meanl8 and means2 in tooltip
              if (id == "meanl8" || id == "means2") {
                continue;
              }

              let season;
              let marker_value;

              // adjust phenology styling
              if (["sos", "pos", "eos"].includes(id)) {
                // resolve simple date to index in phenology marker array -> then query this.phenology for all data
                // FIX: use find() instead of arr_index positional lookup — after null-filtering
                // above, this.sos/pos/eos are shorter than this.phenology, so arr_index is wrong.
                const markerNameMap = { "sos": "start of season", "pos": "peak of season", "eos": "end of season" };
                const targetDate = x.simpleDate();
                const targetMarkerName = markerNameMap[id];
                const phenologyEntry = this.phenology.find(ph =>
                  ph.marker.some(m => m.name === targetMarkerName && m.date === targetDate)
                );
                if (phenologyEntry) {
                  season = phenologyEntry.season;
                  marker_value = this.formatDecimal(phenologyEntry.marker.filter(m => m.name === targetMarkerName)[0].mean, 3);
                } else {
                  season = "";
                  marker_value = "";
                }
                html += '<tr class="'+'bb-tooltip-'+ name +'"></tr>'+
                '<td class="bb-tooltip"><span style="background-color: '+color(d[i])+'"></span>'+ name + ' '+ season + '</td>';
              }
              else {
                html += '<tr class="'+'bb-tooltip-'+ name +'"></tr>'+
                        '<td class="bb-tooltip"><span style="background-color: '+color(d[i])+'"></span>'+ name + '</td>';
              }

              // for area range value skip high & low
              if (this.chart.internal.isTypeOf(d[i], ['area-line-range', 'area-spline-range'])) {
                // values is an array now; index 1 is mid value
                if (this.mode === "one-index") {
                  // phenology markers are different
                  if (["sos", "pos", "eos"].includes(id)) {
                    html += '<td>' + marker_value + '</td>';
                  } else {
                    html += '<td>' + value[1] + ' (' + this.statistics[index].source + ')' + '</td>';
                  }
                }
                if (this.mode === "many-indices") {
                  // phenology markers are different
                  if (["sos", "pos", "eos"].includes(id)) {
                    html += '<td>' + marker_value + '</td>';
                  } else {
                    html += '<td>' + value[1] + ' (' + this.statisticsMany[id][index].source + ')' + '</td>';
                  }
                }
                if (this.mode === "many-parcels") {
                  let parcel = this.statisticsMany.filter(p => p.parcel_id === parseInt(id))[0];
                  html += '<td>' + value[1] + ' (' + parcel[this.selectedProduct][index].source + ')' + '</td>';
                }
              }
              // value is a single value
              else {
                if (this.mode === "one-index") {
                  if (["sos", "pos", "eos"].includes(id)) {
                    // console.debug(id, index, value, name);
                    html += '<td>' + marker_value + '</td>';
                  } else {
                    html += '<td>' + value + ' (' + this.statistics[index].source + ')' + '</td>';
                  }
                }
                if (this.mode === "many-indices") {
                  // phenology markers are different
                  if (["sos", "pos", "eos"].includes(id)) {
                    html += '<td>' + marker_value + '</td>';
                  } else {
                    html += '<td>' + value + ' (' + this.statisticsMany[id][index].source + ')' + '</td>';
                  }
                }
              }
              html += '</tr>';
            }
            html += '</tbody>' +
              '</table>';

            return html;

          }.bind(this)
        },
        bar: {
          width: 3, // phenology marker width
        }
        // candlestick: {
        //     width: 5
        // }
      });

      // console.debug(this.chart);
      // console.debug(document.getElementById("chart_"+this.gcWidgetId))

      // then load data
      this.chart.load({
        columns: data,
        done: function () {
          // hide some data
          this.chart.hide(this.hiddenStats);

          // hide spinner after data is loaded
          //setTimeout(function() {
          this.isloading = false;
          //}.bind(this), 2000
          //);

        }.bind(this)
      });


    },
    prepareSimilarityData() {

      let columns = [];

      if (this.similarity.parcel_timeseries.length != this.similarity.reference_timeseries.length) {
        // warn if the date ranges differ
        console.debug("date ranges in similarity functon differ!");
        console.debug("parcel_timeseries.length: " + this.similarity.parcel_timeseries.length);
        console.debug("reference_timeseries.length: " + this.similarity.reference_timeseries.length);
      }

      // take all dates from content_parcel and content_reference
      let dates_parcel = this.similarity.parcel_timeseries.map(r => r.date);
      let dates_reference = this.similarity.reference_timeseries.map(r => r.date);

      if (this.similarity.parcel_timeseries.length > 0) {

        // map date values to the first x axis
        columns[0] = ["x"].concat(dates_parcel);
        // format values to 2 decimals
        columns[1] = ["parcel (mean)"].concat(this.similarity.parcel_timeseries.map(r => this.formatDecimal(r.mean, 3)));
        // map date values to the second x axis
        columns[2] = ["x2"].concat(dates_reference);
        // format values to 2 decimals
        columns[3] = ["reference (mean)"].concat(this.similarity.reference_timeseries.map(r => this.formatDecimal(r.mean, 3)));

        this.createChart(columns);
      }
    },
    refreshData() {

      this.$root.$emit('resetSimilarity');
      this.$root.$emit("resetPhenology");

      if (this.mode == "one-index") {
        this.getParcelsProductData(this.getCurrentParcel().parcel_id, this.selectedProduct, this.dataSource);
        // only load stats if product is not visible
        if (this.selectedProduct != 'visible') {
          // if (!this.hiddenStats.includes("marker")) {
          //   //this.getMarkers(this.getCurrentParcel().parcel_id);
          // }
          // else {
          //   this.sn_markers = {};
          // }
          this.getIndexStats(this.getCurrentParcel().parcel_id, this.dataSource, this.selectedProduct);
        }
      }
      if (this.mode == "many-parcels") {
        // console.debug(this.selectedParcelIds);
        for (var i = 0; i < this.selectedParcelIds.length; i++) {
          let parcel_id = this.selectedParcelIds[i];
          //this.getParcelsProductData(parcel_id, this.selectedProduct, this.dataSource);
          // only load stats if product is not visible
          if (newValue != 'visible') {
            this.getIndexStats(parcel_id, this.dataSource, this.selectedProduct);
          }
        }
      }
      if (this.mode == "many-indices") {
        for (var i = 0; i < this.availableProducts.length; i++) {
          //this.getParcelsProductData(this.getCurrentParcel().parcel_id, this.availableProducts[i], this.dataSource);
          // only load stats if product is not visible
          if (this.availableProducts[i] != 'visible') {
            this.getIndexStats(this.getCurrentParcel().parcel_id, this.dataSource, this.availableProducts[i]);
          }
        }
      }
    },
    /* GUI helper */
    toggleChartOptions: function () {
      this.gcOptionsCollapsed = !this.gcOptionsCollapsed;
    },
    containerSizeChange(size) {
      /* handles the resize of the chart if parent container size changes */
      setTimeout(function () {
          this.chart.resize();
        }.bind(this),
        200
      );
    },
    /* helper functions */
    removeFromArray: function (arry, value) {
      let index = arry.indexOf(value);
      if (index > -1) {
        arry.splice(index, 1);
      }
      return arry;
    },
    formatDecimal: function (decimal, numberOfDecimals) {
      /* Helper function for formatting numbers to given number of decimals */

      var factor = 100;

      if (isNaN(parseFloat(decimal))) {
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
      return Math.ceil(decimal * factor) / factor;
    },
    capitalize: function (s) {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    },
    isDateValid: function (date_str) {
      /* Validates a given date string */
      if (!isNaN(new Date(date_str))) {
        return true;
      } else {
        return false;
      }
    },
    isDateWithinRange: function (arr, date_str) {
      // function assumes sorted array of strings
      // that can be converted to date objects

      let test_date = new Date(date_str);
      let min_date = new Date(arr[0]);
      let max_date = new Date(arr[arr.length - 1]);

      if ((test_date.getTime() >= min_date.getTime()) && (test_date.getTime() <= max_date.getTime()))
        return true
      else
        return false

    },
    loadJSscript: function (url, callback) {
      let script = document.createElement("script"); // create a script DOM node
      script.src = url; // set its src to the provided URL
      script.async = true;
      document.body.appendChild(script); // add it to the end of the body section of the page 
      script.onload = function () {
        callback();
      };
    },
    initDatePickers() {

      if (this.inpFilterDateFromPicker) {
        this.inpFilterDateFromPicker.destroy();
      }

      this.inpFilterDateFromPicker = new bulmaCalendar(document.getElementById('inpFilterDateFrom_' + this.gcWidgetId), {
        minDate: new Date(this.chartFromDate),
        maxDate: new Date(this.chartToDate),
        startDate: new Date(this.chartFromDate), // Date selected by default
        dateFormat: 'yyyy-mm-dd', // the date format `field` value
        lang: this.currentLanguage, // internationalization
        overlay: false,
        closeOnOverlayClick: true,
        closeOnSelect: true,
        // callback functions
        onSelect: function (e) {
          // hack +1 day
          var a = new Date(e.valueOf() + 1000 * 3600 * 24);
          this.chartFromDate = a.toISOString().split("T")[0]; //ISO String splits at T between date and time
        }.bind(this),
      });

      if (this.inpFilterDateToPicker) {
        this.inpFilterDateToPicker.destroy();
      }

      this.inpFilterDateToPicker = new bulmaCalendar(document.getElementById('inpFilterDateTo_' + this.gcWidgetId), {
        minDate: new Date(this.chartFromDate),
        maxDate: new Date(this.chartToDate),
        startDate: new Date(this.chartToDate), // Date selected by default
        dateFormat: 'yyyy-mm-dd', // the date format `field` value
        lang: this.currentLanguage, // internationalization
        overlay: false,
        closeOnOverlayClick: true,
        closeOnSelect: true,
        // callback functions
        onSelect: function (e) {
          // hack +1 day
          var a = new Date(e.valueOf() + 1000 * 3600 * 24);
          this.chartToDate = a.toISOString().split("T")[0]; //ISO String splits at T between date and time
        }.bind(this),
      });
    },
    changeLanguage() {
      this.$i18n.locale = this.currentLanguage;
    },
    getClosestDate: function (arr, queryDate) {
      console.debug("getClosestDate()");
      /* Returns the closest date in a array of dates
         with the sort function */
      let i = arr.sort(function (a, b) {
        var distancea = Math.abs(queryDate - a);
        var distanceb = Math.abs(queryDate - b);
        return distancea - distanceb; // sort a before b when the distance is smaller
      });
      return i[0];
    },
    getClosestTimeSeriesIndex: function (timeseries, queryDate) {
      /* returns the nearest Date to the given parcel_id and query date */
      const exactDate = this.getClosestDate(timeseries.map(d => new Date(d.date)), new Date(queryDate));
      if (exactDate !== undefined) {
        console.debug("closest date of given date " + queryDate + " is " + exactDate.simpleDate());
        // find the index of the closest date in timeseries now
        return timeseries.map(d => d.date).indexOf(exactDate.simpleDate());
      }
    },
    filterDatasourceProductCompat: function (source, products) {
      /*
          Handles compatibility of products & data_source
      */
      console.debug("filterDatasourceProductCompat(" + source + ")");

      let matrix = {
        "landsat8": ["visible", "vitality", "variations", "ndvi", "ndwi", "savi", "evi2", "npcri"],
        "sentinel2": ["visible", "vitality", "variations", "ndvi", "ndre1", "ndre2", "ndre3",
          "ndwi", "savi", "evi2", "cire", "npcri", "bsi"
        ],
        "sentinel1": ["backscatter_vv", "backscatter_vh"],
        "sentinel12": ["sbmi"]
      };

      // source may be "landsat8", "sentinel2" or "" so check for length
      if (source.length > 0) {
        // filter out the ones which do not fit in
        return products.filter(p => matrix[source].includes(p))
      } else { //defaults to sentinel2 products if source not set
        return products.filter(p => matrix["sentinel2"].includes(p))
      }
    },
    resetDateZoom() {

      if (this.mode === "one-index") {
        // set this.chartFromDate / ToDate appropriate!
        this.chartFromDate = this.statistics[0].date;
        this.chartToDate = this.statistics[this.statistics.length - 1].date;
      }
      if (this.mode === "many-indices") {
        for (var i = 0; i < this.availableProducts.length; i++) {
          // set this.chartFromDate / ToDate appropriate!
          const firstProduct = this.availableProducts[0];
          this.chartFromDate = this.statisticsMany[firstProduct][0].date;
          this.chartToDate = this.statisticsMany[firstProduct][this.statisticsMany[firstProduct].length - 1].date;
        }
      }
      if (this.mode === "many-parcels") {
        for (var i = 0; i < this.parcels.length; i++) {
          // set this.chartFromDate / ToDate appropriate!
          const firstParcel = this.parcels[0];
          this.chartFromDate = this.statisticsMany[firstParcel][0].date;
          this.chartToDate = this.statisticsMany[firstParcel][this.statisticsMany[firstParcel].length - 1].date;
        }
      }
      // notify root
      this.$root.$emit("zoomDomainChange", this.internalZoomDomain);
    },
    createErrorBand(filteredStats) {
      // format values to 2 decimals
      let means = [];
      // simple array to [high, mid, low] with std.dev. for error band
      for (let i = 0; i < filteredStats.length; i++) {
        let r = filteredStats[i];
        let high = this.formatDecimal((r.statistics.mean + r.statistics.stddev), 3);
        let mid = this.formatDecimal(r.statistics.mean, 3);
        let low = this.formatDecimal((r.statistics.mean - r.statistics.stddev), 3);
        means.push([high, mid, low]);
      }
      return means;
    },
    createCandleStickVals(stats) {
      // format values to 2 decimals
      let values = [];
      // simple array to [open, high, low, close] for candlestick bar
      for (let i = 0; i < stats.length; i++) {
        let r = stats[i];
        let open = this.formatDecimal(r.min, 3); // this.formatDecimal(r.statistics.mean,3);
        let high = this.formatDecimal(r.max, 3); // this.formatDecimal((r.statistics.mean + r.statistics.stddev),3);
        let low = this.formatDecimal(r.min, 3); // this.formatDecimal(r.statistics.mean,3);
        let close = this.formatDecimal(r.max, 3); // this.formatDecimal((r.statistics.mean - r.statistics.stddev),3);

        values.push([open, high, low, close]);
      }
      console.debug(values);
      return values;
    }
  },
});