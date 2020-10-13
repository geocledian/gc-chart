/*
 Vue.js Geocledian chart component
 created: 2019-11-04, jsommer
 last update: 2020-05-14, jsommer
 version: 0.9
*/

// root Vue instance
var vmRoot;

// global gc locale object
// every component may append its data to this
var gcLocales = { en: {}, de: {} };

// global i18n object
var i18n;

// init dependent javascript libs
const libs = ['https://unpkg.com/vue@2.6.11/dist/vue.min.js',
              'https://unpkg.com/vue-i18n@8.17.5/dist/vue-i18n.js',
              'js/d3.v3.min.js', // v4.13.0 
              'js/c3.min.js', // v0.7.11
              'css/bulma-ext/bulma-calendar.min.js'
            ];

function gcGetBaseURL() {
    //get the base URL relative to the current script - regardless from where it was called
    // js files are loaded relative to the page
    // css files are loaded relative to its file
    let scriptURL = document.getElementById("gc-chart-init");
    let url = new URL(scriptURL.src);
    let basename = url.pathname.substring(url.pathname.lastIndexOf('/')+1);
    return url.href.split('/js/'+basename)[0];
}

function loadJSscriptDeps(url_list, final_callback) {
    /* 
      loads dependent javascript libraries async but in order as given in the url_list. 
      thanks to 
      https://stackoverflow.com/questions/7718935/load-scripts-asynchronously
    */
    function scriptExists(url_to_check) {
      
      let found = false;

      for (var i=0; i< document.head.children.length; i++) {
        const script = document.head.children[i];
        
        // only scripts or links (css) are of interest
        if (!["SCRIPT","LINK"].includes(script.tagName))  { continue; }

        if (script.src === url_to_check) {
          found = true;
          //console.error("Script already loaded: "+ url_to_check)
          break;
        }
      }
      return found;
    }
    function loadNext() {
      //console.debug("length of URLs: "+ url_list.length);
      if (!url_list.length) { 
        console.debug("READY loading dependent libs"); 
        final_callback(); 
      }
  
      let url = url_list.shift();
      //console.debug("current URL: "+ url);

      if (url && !url.includes('http')) {
        url = gcGetBaseURL() + "/" +url;
        console.debug('loadNext()');
        console.debug(url);
      }
      
      // check google URL for valid key
      if (url && url.includes("YOUR_VALID_API_KEY_FROM_GOOGLE")) { 
        console.error("Change the Google Maps API Key!"); 
        return;
      }

      // prevent multiple loading of same script urls
      if (url && !scriptExists(url)) { 
        let script = document.createElement("script");  // create a script DOM node
        script.type = 'text/javascript';
        script.src = url;  // set its src to the provided URL
        script.async = true;
        // if ready, load the next on in queue
        script.onload = script.onreadystatechange = function () {
          loadNext();
        };
        // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
        document.head.appendChild(script); 
      }
      else { console.warn("URL already loaded - skipping: "+ url); }
    }
    //first call
    loadNext();

}
function initComponent() {
    /* 
      inits component
    */

    i18n = new VueI18n({
      locale: 'en', // set locale
      fallbackLocale: 'en',
      messages: gcLocales, // set locale messages
    })

    // bind index locales to global locales
    if (typeof indexLocales !== 'undefined') {
      gcLocales.de.indexLocales = indexLocales.de;
      gcLocales.en.indexLocales = indexLocales.en;
    }
    
    // load map component dynamically
    // change for DEBUG to js/gc-chart.js
    loadJSscript("js/gc-chart.min.js", function() {
        /* when ready, init global vue root instance */
        vmRoot = new Vue({
            //must match the id attribute of the div tag which contains the widget(s)
            el: "#gc-app",
            i18n: i18n, //root i18n
            // check for selectedProduct changes!
        });
    });
}
function loadJSscript (url, callback) {
    /* 
      loads javascript library async and appends it to the DOM
      */
    let script = document.createElement("script");  // create a script DOM node
    script.type = 'text/javascript';
    script.src = gcGetBaseURL() + "/"+ url;  // set its src to the provided URL
    script.async = true;
    document.head.appendChild(script);  // add it to the end of the head section of the page
    //if ready, call the callback function 
    script.onload = script.onreadystatechanged = function () {
      if (callback) { callback(); }
    };
}

// async loading dependencies and init the component
loadJSscriptDeps(libs, initComponent);   
