/**
selects the td and tr elements of a given table
@param {string} arr - selector for the array (usually a class)
@param {number[]} rows - list of rows to be returned 0 indexed - empty array => all rows - negatives count from the end
@param {number[]} cols - list of columns to be returned 0 indexed - empty array => all columns
@returns {element[]} - list of all DOM elements that match the criteria
 */
var tableSelect = function (arr, rows, cols) {
    'use strict';
    var $arr = $(arr).find('table');
    var length = $arr.find('>tbody >tr').length;
    var colSelector, ret,
    res;
    var rowSelector = rows.reduce(function (acc, el, i) {
            el < 0 && (el = length + el);
            var selector = '[data-alpaca-container-item-index="' + el + '"]';
            i != 0 && (selector = ',' + selector);
            return acc + selector;
        }, 'tr');
    if (cols === undefined) {
        ret = $arr.find(rowSelector);
    } else {
        colSelector = cols.reduce(function (acc, el, i) {
                var selector = '[data-alpaca-container-item-index="' + el + '"]';
                i != 0 && (selector = ',' + selector);
                return acc + selector;
            }, 'td');
        ret = $arr.find(rowSelector).find(colSelector);
    }

    return ret;
};

$(document).ready(function () {

    $('body').css('cursor', 'progress');

    Alpaca.views["bootstrap-edit"].callbacks["collapsible"] = function () {
        var $fieldEl = $(this.getFieldEl());
        var $legendEl = $fieldEl.find("legend").first();
        var $anchorEl = $("[data-toggle='collapse']", $legendEl);
        if ($anchorEl.length > 0) {
            var $containerEl = $(this.getContainerEl());
            var id = $containerEl.attr("id");
            if (!id) {
                id = Alpaca.generateId();
                $containerEl.attr("id", id);
            }
            $anchorEl.attr("aria-expanded", this.options.collapsed ? "false" : "true");
            $containerEl.addClass(this.options.collapsed ? "collapse" : "collapse in");
            if (!$anchorEl.attr("data-target")) {
                $anchorEl.attr("data-target", "#" + id);
            }
            $anchorEl.mouseover(function (e) {
                $(this).css("cursor", "pointer");
            })
        }
    };

    Alpaca.defaultToolbarSticky = true;

    $('#form1').alpaca({
        schemaSource: "./schema/compiledSchema.json",
        optionsSource: "./options.json",
        dataSource: "./data.json",
        postRender: function () {
            $('body').css('cursor', 'default');

            $('.array-with-help').find('.help-block').each(function () {
                this.parentNode.appendChild(this);
            });

            console.log(tableSelect('.array51', [1, 4, -2], [0, 2]).each(function () {
                    $(this).css('background', 'red');
                }));

            $('[data-alpaca-container-item-name="5_0_0_2"], [data-alpaca-container-item-name="5_0_10_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_0_0_1"],[data-alpaca-container-item-name="5_0_0_3"],[data-alpaca-container-item-name="5_0_0_4"]').remove();
            $('[data-alpaca-container-item-name="5_0_10_1"],[data-alpaca-container-item-name="5_0_10_3"],[data-alpaca-container-item-name="5_0_10_4"]').remove();
            $('[data-alpaca-container-item-name="5_0_14_2"]').attr('colspan', '2');
            $('[data-alpaca-container-item-name="5_0_14_1"]').remove();
            $('[data-alpaca-container-item-name="5_1_0_0_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_1_0_0_1"],[data-alpaca-container-item-name="5_1_0_0_3"],[data-alpaca-container-item-name="5_1_0_0_4"]').remove();
            $('[data-alpaca-container-item-name="5_1_0_4_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_1_0_4_1"],[data-alpaca-container-item-name="5_1_0_4_3"],[data-alpaca-container-item-name="5_1_0_4_4"]').remove();
            $('[data-alpaca-container-item-name="5_1_0_7_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_1_0_7_1"],[data-alpaca-container-item-name="5_1_0_7_3"],[data-alpaca-container-item-name="5_1_0_7_4"]').remove();
            $('[data-alpaca-container-item-name="5_1_0_11_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_1_0_11_1"],[data-alpaca-container-item-name="5_1_0_11_3"],[data-alpaca-container-item-name="5_1_0_11_4"]').remove();
            $('[data-alpaca-container-item-name="5_1_0_16_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_1_0_16_1"],[data-alpaca-container-item-name="5_1_0_16_3"],[data-alpaca-container-item-name="5_1_0_16_4"]').remove();
            $('[data-alpaca-container-item-name="5_1_0_18_2"]').attr('colspan', '2');
            $('[data-alpaca-container-item-name="5_1_0_18_1"]').remove();
            $('[data-alpaca-container-item-name="5_1_1_0_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_1_1_0_1"],[data-alpaca-container-item-name="5_1_1_0_3"],[data-alpaca-container-item-name="5_1_1_0_4"]').remove();
            $('[data-alpaca-container-item-name="5_1_1_2_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_1_1_2_1"],[data-alpaca-container-item-name="5_1_1_2_3"],[data-alpaca-container-item-name="5_1_1_2_4"]').remove();
            $('[data-alpaca-container-item-name="5_1_1_5_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_1_1_5_1"],[data-alpaca-container-item-name="5_1_1_5_3"],[data-alpaca-container-item-name="5_1_1_5_4"]').remove();
            $('[data-alpaca-container-item-name="5_1_1_7_2"]').attr('colspan', '2');
            $('[data-alpaca-container-item-name="5_1_1_7_1"]').remove();
            $('[data-alpaca-container-item-name="5_1_2_0_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_1_2_0_1"],[data-alpaca-container-item-name="5_1_2_0_3"],[data-alpaca-container-item-name="5_1_2_0_4"]').remove();
            $('[data-alpaca-container-item-name="5_1_2_4_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_1_2_4_1"],[data-alpaca-container-item-name="5_1_2_4_3"],[data-alpaca-container-item-name="5_1_2_4_4"]').remove();
            $('[data-alpaca-container-item-name="5_1_2_7_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_1_2_7_1"],[data-alpaca-container-item-name="5_1_2_7_3"],[data-alpaca-container-item-name="5_1_2_7_4"]').remove();
            $('[data-alpaca-container-item-name="5_1_2_11_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_1_2_11_1"],[data-alpaca-container-item-name="5_1_2_11_3"],[data-alpaca-container-item-name="5_1_2_11_4"]').remove();
            $('[data-alpaca-container-item-name="5_1_2_16_2"]').attr('colspan', '4');
            $('[data-alpaca-container-item-name="5_1_2_16_1"],[data-alpaca-container-item-name="5_1_2_16_3"],[data-alpaca-container-item-name="5_1_2_16_4"]').remove();
            $('[data-alpaca-container-item-name="5_1_2_18_2"]').attr('colspan', '2');
            $('[data-alpaca-container-item-name="5_1_2_18_1"]').remove();
            $('[name="5_1_0_18_3"]').attr('readonly', true);

            $('.array512').find('td[data-alpaca-container-item-index="2"]').find('input').on('change', function () {

                var sum = 0;
                var arr = $('.array512').find('td[data-alpaca-container-item-index="2"]').find('input');

                $.each(arr, function (i, el) {
                    if (i === (arr.length - 1)) {
                        return;
                    }
                    sum += 1 * el.value;
                });

                $.each(arr, function (i, el) {

                    if (i === (arr.length - 1)) {
                        return;
                    }

                    $(this).parents("tr").find('td[data-alpaca-container-item-index="3"]').find("input").val((Math.floor(10000 * (this.value / sum), 1) / 100) + "%");
                });
                arr.last().parents("tr").find('td[data-alpaca-container-item-index="3"]').find("input").val("100%");
                arr.last().parents("tr").find('td[data-alpaca-container-item-index="2"]').find("input").val(sum);
            });

        },
        view: {
            parent: "bootstrap-edit-horizontal",
            wizard: {
                title: "Welcome to the Wizard",
                description: "Please fill things in as you wish",
                validation: false,
                hideSubmitButton: true,
                bindings: {
                    "1": 5,
                    "2": 2,
                    "3": 3,
                    "4": 4,
                    "5": 1,
                    "6": 6,
                    "7": 7,
                    "8": 8,
                    "9": 9,
                    "10": 10
                },
                steps: [{
                        title: "1",
                        description: "Γενικά"
                    }, {
                        title: "2",
                        description: "Παρουσίαση"
                    }, {
                        title: "3",
                        description: "Δικαιούχος"
                    }, {
                        title: "4",
                        description: "Αναλυτικά",
                    }, {
                        title: "5",
                        description: "Οικονομικά"
                    }, {
                        title: "6",
                        description: "Ενσωμάτωση"
                    }, {
                        title: "7",
                        description: "Άδειες"
                    }, {
                        title: "8",
                        description: "Χρονοδιάγραμμα"
                    }, {
                        title: "9",
                        description: "Δείκτες"
                    }, {
                        title: "10",
                        description: "Δήλωση"
                    }
                ]
            }
        }
    });

    $("#download-btn").on('click', function () {
        var value = $("#form1").alpaca('get').getValue();
        this.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(value)));
        this.setAttribute('download', "Υποβολή" + $.format.date(new Date(), 'yyyy_M_d_H_mm_ss') + ".txt");
    });

    $('#advanced-download-link').on('click', function () {
        var value = $("#form1").alpaca('get').getValue();
        $('#submit-content').val(JSON.stringify(value));
    });

    $("#upload-file").on('change', function () {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                $('#form1').empty();
                $("#form1").alpaca({
                    schemaSource: "./schema.json",
                    optionsSource: "./options.json",
                    view: "bootstrap-edit",
                    data: JSON.parse(evt.target.result)
                });
            }
            reader.onerror = function (evt) {}
        }
    });

});
