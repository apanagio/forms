/* global $*/
$(document).ready(function() {
    $("#form1").alpaca({
        schemaSource: "./schema.json",
        optionsSource: "./options.json",
        dataSource: "./data.json",
        "view": {
            "parent": "bootstrap-edit-horizontal",
            "layout": {
                "template": "threeColumnGridLayout",
                "bindings": {
                    "id": "column-1",
                    "description": "column-1",
                    "details": "column-2",
                    "member": "column-2",
                    "photo": "column-2",
                    "phone": "column-2",
                    "icecream": "column-3",
                    "address": "column-3"
                }
            },
            "templates": {
                "threeColumnGridLayout": '<div class="row">' + '{{#if options.label}}<h2>{{options.label}}</h2><span></span>{{/if}}' + '{{#if options.helper}}<p>{{options.helper}}</p>{{/if}}' + '<div id="column-1" class="col-md-6"> </div>' + '<div id="column-2" class="col-md-6"> </div>' + '<div id="column-3" class="col-md-12"> </div>' + '<div class="clear"></div>' + '</div>'
            }
        }
    });

    $("#download-btn").on('click', function() {
        var value = $("#form1").alpaca('get').getValue();
        this.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(value)));
        this.setAttribute('download', "Υποβολή" + $.format.date(new Date(), 'yyyy_M_d_H_mm_ss') + ".txt");
    });

    $('#advanced-download-link').on('click', function() {
        var value = $("#form1").alpaca('get').getValue();
        $('#submit-content').val(JSON.stringify(value));
    });

    $("#upload-file").on('change', function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function(evt) {
                $('#form1').empty();
                $("#form1").alpaca({
                    schemaSource: "./schema.json",
                    optionsSource: "./options.json",
                    view: "bootstrap-edit",
                    data: JSON.parse(evt.target.result)
                });
            }
            reader.onerror = function(evt) {

            }
        }
    });
});
