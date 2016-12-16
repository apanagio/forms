/*global $ */
$(document).ready(function() {
    $('body').css('cursor', 'progress');

    $("#form1").alpaca({
        schemaSource: "./schema.json",
        optionsSource: "./options.json",
        dataSource: "./data.json",
        postRender: function() {
            $('body').css('cursor', 'default');
            $('[data-alpaca-field-name=tab2] table').removeClass('table-hover table-striped');
            $('[data-alpaca-field-name=tab2] tbody tr[data-alpaca-container-item-index=0] td[data-alpaca-container-item-index=0]').attr('rowspan', 5);
            $('[data-alpaca-field-name=tab2] tbody tr[data-alpaca-container-item-index=5] td[data-alpaca-container-item-index=0]').attr('rowspan', 2);
            [1,2,3,4,6].map(function (el) {
                $('[data-alpaca-field-name=tab2] tbody tr[data-alpaca-container-item-index=' + el + '] td[data-alpaca-container-item-index=0]').remove();
            });
            [5,6].map(function (el) {
                $('[data-alpaca-field-name=tab2] tbody tr[data-alpaca-container-item-index=' + el + ']').addClass('bg-info');
            })
        },
        view: {
            parent: "bootstrap-edit-horizontal",
            wizard: {
                title: "Αξιολόγηση",
                description: "Please fill things in as you wish",
                validation: false,
                hideSubmitButton: true,
                bindings: {
                    "tab1": 2,
                    "tab2": 1,
                    "tab3": 3,
                    "tab4": 4,
                    "tab5": 5
                },
                steps: [{
                    title: "1",
                    description: "Τυπικές"
                }, {
                    title: "2",
                    description: "Κατάσταση"
                }, {
                    title: "3",
                    description: "Σαφήνεια"
                }, {
                    title: "4",
                    description: "Ωριμότητα",
                }, {
                    title: "5",
                    description: "Συνολικά"
                }]
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
