/*global phantom args*/
var system = require('system');
var data = system.stdin.read();

//var URL = 'http://www.amifisf.gr:8000/forms/AM8-pdf';
var URL  = system.args[1];

var webpage = require('webpage');
var page = webpage.create();
page.paperSize = {
    format: 'A4',
    orientation: 'portrait',
    margin: '0.8cm'
};
page.viewportSize = {
    width: 1400,
    height: 900
};
//page.onConsoleMessage = function(msg, lineNum, sourceId) {
//  console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
//};

var createPdf = function(url, settings) {
    page.open(url, settings, function(status) {
        if (status !== 'success') {
            console.log('Unable to load the address: ' + url);
            phantom.exit();
        } else {
            setInterval(function() {
                var finished = page.evaluate(function() {
                    return window.finishedRendering;
                });
                if (finished === true) {
                    var name = 'submission' + new Date().getTime() + '.pdf';
                    page.render('output/' + name, {
                        format: 'pdf'
                    });
                    console.log(name);
                    phantom.exit();
                }
            }, 1000); // Change timeout as required to allow sufficient time 
        }
    });
};

var url = URL;

var settings = {
    operation: "POST",
    encoding: "utf8",
    headers: {
        "Content-Type": "application/json"
    },
    data: data
};
setTimeout(function() {
    console.log('Timeout expired');
    phantom.exit();
}, 25000);


createPdf(url, settings);
