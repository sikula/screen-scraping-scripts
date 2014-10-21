/* ==================================================================================
 * AUTHOR       : sikula
 * VERSION      : 1.0.5
 * LAST UPDATE  : Tue Oct 21
 * DESCRIPTION  : A javascript program using CasperJS to save a map, from
 *                OpenStreet Maps as an image. The program can easily manipulate the
 *                map to create custom map-images.
 *
 * NOTES        : Keep the viewport size below 2000 x 2000 otherwise it takes a long
 *                time to get the picture.
 * ==================================================================================
 */

/* Create a new CasperJS instance and specify the appropriate settings */
var casper  = require('casper').create({
    pageSettings: {
        userAgent: 'Mozilla/5.0 (Windows; U; Windows NT 5.1; pt-BR) AppleWebKit/533.3 (KHTML, like Gecko)  QtWeb Internet Browser/3.7 http://www.QtWeb.net'
    },
    viewportSize: {
        width:  1500,
        height: 1000,
    },
    retryTimeout: 20,
});

/* Creates an anonymous function which will run automatically, used for setting variables in this case */
(function() {
    base    = "http://www.openstreetmap.org/#map=";
    zoom    = casper.cli.get("zoom") || 17;
    lat     = casper.cli.get("lat")  || 42.35905;
    lon     = casper.cli.get("lon")  || -71.05726;
    layer   = "&layers=T";
    webpage = base + zoom + "/" + lat + "/" + lon + layer;
})();



/* We begin by injecting ZeptoJS into our current DOM context */
casper.start(webpage, function() {
    casper.page.injectJs('resources/zepto.min.js');
});


/* Next we remove the side controls from the container so we don't crowd our viewport with useless elements */
casper.then(function() {
    this.evaluate(function() {
        $('.leaflet-control-container').remove();
    });
});


/*  Next we remove the sidebar */
casper.then(function() {
    this.evaluate(function() {
        $('#sidebar').remove();
    });
});


/* Finally we take a snapshot of <div id="map">...</div> */
casper.then(function() {
    this.captureSelector("test_map.png", "div#map");
});


casper.run(function() {
    this.exit();
});
