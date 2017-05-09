/*global phantom args*/
var system = require('system');
var fs = require('fs');

var data = system.stdin.read();

var URL  = system.args[1];


var webpage = require('webpage');
var page = webpage.create();
page.paperSize = {
    format: 'A4',
    orientation: 'portrait',
    margin: '0.8cm',
    footer: {
            height: "1cm",
            contents: phantom.callback(function(pageNum, numPages) {
                if (pageNum == 1) {
                    return "";
                }
                return "<div style='font-size:7px;font-weight:100'>Υποβολή<span style='float:right'>" + pageNum + " / " + numPages + "</span></div>";
            })
        }
};
page.viewportSize = {
    width: 1400,
    height: 900
};
page.onConsoleMessage = function(msg, lineNum, sourceId) {
  var msg = 'CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")';
  fs.write('output/log', msg, 'a');
};

var createPdf = function(url, settings) {
   page.open(url, settings, function(status) {
   //page.open(url, 'POST', 'll='+data, function(status) {
        if (status !== 'success') {
            console.log('Unable to load the address: ' + url);
            phantom.exit();
        } else {
            console.log(page.content);
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
}, 125000);

//fs.writeFile("log/log" + new Date().getTime(), "test", function(err) {
//}); 

createPdf(url, settings);
