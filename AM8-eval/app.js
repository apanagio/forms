/*global Alpaca $ budgetRules*/

$(document).ready(function() {
    $('body').css('cursor', 'progress');

    Alpaca.defaultToolbarSticky = true;


    $("#form1").alpaca({
        schemaSource: "./schema.json",
        optionsSource: "./options.json",
        dataSource: "./data.json",
        postRender: function() {
            $('body').css('cursor', 'default');

            //tab2
            $('[data-alpaca-field-name=tab2] table').removeClass('table-hover table-striped');
            $('[data-alpaca-field-name=tab2] tbody tr[data-alpaca-container-item-index=0] td[data-alpaca-container-item-index=0]').attr('rowspan', 5);
            $('[data-alpaca-field-name=tab2] tbody tr[data-alpaca-container-item-index=5] td[data-alpaca-container-item-index=0]').attr('rowspan', 2);
            [1, 2, 3, 4, 6].map(function(row) {
                $('[data-alpaca-field-name=tab2] tbody tr[data-alpaca-container-item-index=' + row + '] td[data-alpaca-container-item-index=0]').remove();
            });
            [5, 6].map(function(row) {
                $('[data-alpaca-field-name=tab2] tbody tr[data-alpaca-container-item-index=' + row + ']').addClass('bg-info');
            });

            //tab3
            $('[data-alpaca-field-name=tab3] table').removeClass('table-hover table-striped');
            $('[data-alpaca-field-name=tab3] tbody tr[data-alpaca-container-item-index=0] td[data-alpaca-container-item-index=0]').attr('rowspan', 6);
            [1, 2, 3, 4, 5].map(function(row) {
                $('[data-alpaca-field-name=tab3] tbody tr[data-alpaca-container-item-index=' + row + '] td[data-alpaca-container-item-index=0]').remove();
            });
            [2, 3, 6].map(function(col) {
                $('[data-alpaca-field-name=tab3] tbody tr[data-alpaca-container-item-index=1] td[data-alpaca-container-item-index=' + col + ']').attr('rowspan', 5);
            });
            [2, 3, 4, 5, 6].map(function(row) {
                [2, 3, 6].map(function(col) {
                    $('[data-alpaca-field-name=tab3] tbody tr[data-alpaca-container-item-index=' + row + '] td[data-alpaca-container-item-index=' + col + ']').remove();
                });
            });

            //tab4
            $('[data-alpaca-field-name=tab4] table').removeClass('table-hover table-striped');
            $('[data-alpaca-field-name=tab4] tbody tr[data-alpaca-container-item-index=0] td[data-alpaca-container-item-index=0]').attr('rowspan', 5);
            [1, 2, 3, 4].map(function(row) {
                $('[data-alpaca-field-name=tab4] tbody tr[data-alpaca-container-item-index=' + row + '] td[data-alpaca-container-item-index=0]').remove();
            });
            [2, 3, 6].map(function(col) {
                $('[data-alpaca-field-name=tab4] tbody tr[data-alpaca-container-item-index=3] td[data-alpaca-container-item-index=' + col + ']').attr('rowspan', 5);
            });
            [4].map(function(row) {
                [2, 3, 6].map(function(col) {
                    $('[data-alpaca-field-name=tab4] tbody tr[data-alpaca-container-item-index=' + row + '] td[data-alpaca-container-item-index=' + col + ']').remove();
                });
            });

            //tab5
            budgetRules();
            
            var requirements = function () {
                return (!$('[data-alpaca-field-id="tab1"] :checkbox').not(':checked').length > 0);
            };
            
            var calcConditions = function () {
                return $('[data-alpaca-field-id="tab2"] tbody tr').toArray().reduce(function (acc, el) {
                    var value = $(el).find('[data-alpaca-container-item-index="5"] input').val();
                    var weight = $(el).find('[data-alpaca-container-item-index="6"] .alpaca-control').text().replace(',', '.');
                    return acc + (value * weight);
                }, 0);
            };
            
            var calcInvestment = function () {
                return $('[data-alpaca-field-id="tab3"] tbody tr').toArray().reduce(function (acc, el, i) {
                    var value = $(el).find('[data-alpaca-container-item-index="5"] input').val();
                    var weight = i == 0 ? 0.4 : 0.6;
                    return acc + (value * weight);
                }, 0);
            };

            var calcMaturity = function () {
                return $('[data-alpaca-field-id="tab4"] tbody tr').toArray().reduce(function (acc, el, i) {
                    var value = $(el).find('[data-alpaca-container-item-index="5"] input').val();
                    var weight = i != 5? $(el).find('[data-alpaca-container-item-index="6"] .alpaca-control').text().replace(',', '.') : 0.35;
                    return acc + (value * weight);
                }, 0);
            };
            
            var maturityOnOff = function () {
                return [1, 2].reduce(function (acc, el) {
                    return acc * $('[data-alpaca-field-id="tab4"] tbody tr[data-alpaca-container-item-index="' + el + '"] [data-alpaca-container-item-index="5"] input').val();
                }, 1);
            };
            
            var calcTotal = function () {
                return calcConditions() * 0.3 + calcInvestment() * 0.5 + calcMaturity() * 0.2;
            };
            
            var pass = function () {
                return requirements && (maturityOnOff() > 0) && (calcTotal() > 4);
            };

            //tab6
            $('#result').show().appendTo('[data-alpaca-field-id=tab6]');
            $('#calc').on('click', function () {
                $('#on-off').html( requirements() ? 'ΝΑΙ' : 'ΟΧΙ');
                $('#condition').html(calcConditions().toFixed(2));    
                $('#condition-total').html((calcConditions() * 0.3).toFixed(2));    
                $('#investment-plan').html(calcInvestment().toFixed(2));    
                $('#investment-plan-total').html((calcInvestment() * 0.5).toFixed(2));    
                $('#maturity').html(calcMaturity().toFixed(2));    
                $('#maturity-total').html((calcMaturity() * 0.2).toFixed(2));
                $('#maturity-on-off').html(maturityOnOff() == 0 ? 'ΟΧΙ' : 'ΝΑΙ');    
                $('#total').html(calcTotal().toFixed(2));
                $('#pass').html(pass() ? 'ΝΑΙ' : 'ΟΧΙ');
            });
            
        },
        view: {
            parent: "bootstrap-edit-horizontal",
            wizard: {
                title: "Αξιολόγηση",
                description: "Please fill things in as you wish",
                validation: false,
                hideSubmitButton: true,
                bindings: {
                    "tab1": 1,
                    "tab2": 2,
                    "tab3": 3,
                    "tab4": 4,
                    "tab5": 5,
                    "tab6": 6
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
                    description: "Αλλαγές προϋπολογισμoύ"
                }, {
                    title: "6",
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
