/*
 * ==================================================================================
 * AUTHOR       : sikula
 * VERSION      : 1.0.6
 * LAST UPDATE  : Sun Nov 1
 * DESCRIPTION  : A javascript program using CasperJS to extract the
 *                title, url, and time posted of the posts from a specified
 *                subreddit page.
 * ==================================================================================
 */

// Required Libraries
var casper      = require('casper').create({
    pageSettings: {
        loadImages:         false,
        loadPlugins:        false,
        userAgent:          'Mozilla/5.0 (Windows; U; Windows NT 5.1; pt-BR) AppleWebKit/533.3 (KHTML, like Gecko)  QtWeb Internet Browser/3.7 http://www.QtWeb.net'
    },
    retryTimeout:   20,
});
var colorizer   = require('colorizer').create('Colorizer');

var webpage;
// Variables
var titles  = [];
var links   = [];
var times   = [];
var posts   = [];


(function() {
    var subred  = casper.cli.get("subred");
    if( !casper.cli.has("subred")) {
        webpage = "http://www.reddit.com/";
    } else {
        webpage = "http://www.reddit.com/r/" + subred;
    };
})();

//----------------------------------------------------------
// Class-like object for formatting output
//----------------------------------------------------------
var Formatter   = (function() {
    /* Constructor */
    function Formatter() {
        /* Instance Variables */
    };

    // public:
        /* Format for titles */
        Formatter.prototype.title   = function(text) {
            return colorizer.format(text, {
                fg:     'blue',
                bold:   false,
            });
        };

        /* Format for links */
        Formatter.prototype.links   = function(text) {
            return colorizer.format(text, {
                fg:     'white',
                bold:   false,
            });
        };

    return Formatter;

})();


//----------------------------------------------------------
// Class-like objectt for extracting data from webpage
//----------------------------------------------------------
var Extractor = (function() {

    /* Constructor */
    function Extractor() {
        /* Instance Variables */
    };

    // private:
        /* Take as input two arrays and returns a single array of array_1[i] array_2[i] */
        function zip(arrays) {
            return arrays[0].map(function(_, i) {
                return arrays.map(function(array) {
                    return array[i];
                });
            });
        };


    // public:
        /* Returns an array of the titles scraped by Casper */
        Extractor.prototype.get_titles    = function() {
            var titles  = document.querySelectorAll('p.title a');
            return Array.prototype.map.call(titles, function(element) {
                return element.textContent;
            });
        };


        /* Returns an array of links scraped by Casper */
        Extractor.prototype.get_links       = function() {
            var links   = document.querySelectorAll('p.title a');
            return Array.prototype.map.call(links, function(element) {
                return element.getAttribute('href');
            });
        };


        /* Returns an array containing the time the post was posted */
        Extractor.prototype.get_times       = function() {
            var times   = document.querySelectorAll('p.tagline time.live-timestamp');
            return Array.prototype.map.call(times, function(element) {
                return element.getAttribute('title');
            });
        };


        /* Returns the reddit post, which is title + link */
        Extractor.prototype.posts           = function(titles, links) {
            return zip([titles, links]);
        };


    return Extractor;


})();



casper.start(webpage, function() {
    var extractor   = new Extractor();
    links   = links.concat(this.evaluate(extractor.get_links));
    titles  = titles.concat(this.evaluate(extractor.get_titles));
    times   = times.concat(this.evaluate(extractor.get_times));
    posts   = posts.concat(extractor.posts(titles, links));
});


casper.run(function() {
    var format  = new Formatter();
    var number  = casper.cli.get("num") || 10;
    for( i = 1 ; i <= number; i++ ) {
        this.echo(format.title("[ " + i + " ] " + posts[i][0] + " : " + times[i]));
        this.echo(format.links("          "     + posts[i][1]));
    };
    this.exit();
});
