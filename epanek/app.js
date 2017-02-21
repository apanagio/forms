/*global $ Alpaca */

var equals = function(i) {
    return function(j) {
        return j === i;
    };
};

var id = function(i) {
    return function() {
        return i;
    }
}

var isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var numOr0 = function(n, neutral) {
    return isNumeric(n) ? 1 * n : neutral;
};

var $alpaca = function(index, prefix, suffix) {
    return (prefix ? prefix : "") + '[data-alpaca-container-item-index="' + index + '"]' + (suffix ? suffix : "");
};
var getPlotData = function($div) {

    return $div.find('tbody tr').toArray().map(function(el) {
        return $(el).find('input').toArray().map(function(el) {
            return el.value;
        });
    });
};

var createGant = function(chartDiv, $dataDiv) {

    var d = getPlotData($dataDiv);

    if (d.length < 2) {
        return;
    }

    var series = [{
        data: d.map(function(el, i) {
            return [1 * el[3] + 1 * el[2], i, 1 * el[2]];
        }),
        color: '#123456'
    }];

    var options = {
        xaxis: {
            minTickSize: 1,
            min: 0
        },
        yaxis: {
            ticks: d.map(function(el, i) {
                return [i, el[0]];
            }),
        },
        series: {
            lines: {
                show: false
            },
            bars: {
                barWidth: 0.6,
                horizontal: true,
                show: true
            },
            stack: true
        }
    };
    return $.plot("#" + chartDiv, series, options);
};

//calculates totalbudget, eligibleBudget, percentage
var financialResults = function(data) {
    var result = data;
    var total;
    var eligible;

    var addTable = function(table, col) {
        return table.reduce(function(a, b) {
            return a + numOr0(b[col], 0);
        }, 0);
    };

    var addTablePer = function(table, col, per) {
        return table.reduce(function(a, b) {
            return a + numOr0(b[col] * 0.01 * b[per], 0);
        }, 0);
    };

    total = addTable(data.tab5.a5_1_2.a5_1_2_1, 'budget') +
        addTable(data.tab5.a5_1_2.a5_1_2_2, 'budget') +
        addTable(data.tab5.a5_1_2.a5_1_2_3, 'budget');

    eligible = addTablePer(data.tab5.a5_1_2.a5_1_2_1, 'budget', 'percentage') +
        addTablePer(data.tab5.a5_1_2.a5_1_2_2, 'budget', 'percentage') +
        addTablePer(data.tab5.a5_1_2.a5_1_2_3, 'budget', 'percentage');

    return {
        total: total,
        eligible: eligible
    };
};

var updateTotal = function(result) {
    $('#total-budget').html(numOr0(result.total, 0).toFixed(2));
    $('#eligible-budget').html(numOr0(result.eligible, 0).toFixed(2));
    $('#total-percentage').html((numOr0(100 * result.eligible / result.total, 0)).toFixed(2));
};

//calculates total and subsideized budget per section
//returns array [{id: id, total: totalBudget, public: publicBudget}]
var sectionBudget = function(data) {
    var getCategory = function(id) {
        var cat = data.tab4.a4_1b
            .filter(function(el) {
                return el.id == id;
            });

        var ret = cat.length > 0 ? cat[0].category : undefined;
        return ret;
    };

    var getPer = function(arr, row) {
        var hash = {
            'a5_3_1': function() {
                return {
                    "Υφιστάμενο Προσωπικό": 1,
                    "Νέο Προσωπικό": 2,
                    "Δελτίο Παροχής": 3,
                }[data.tab5.a5_3[arr][row].d];
            },
            'a5_3_2': function() {
                return {
                    "Εξοπλισμός": 5,
                    "Κτίριο": 6
                }[data.tab5.a5_3[arr][row].c];
            },
            'a5_3_3': id(8),
            'a5_3_4': id(17),
            'a5_3_5': id(9),
            'a5_3_6': id(14),
            'a5_3_6_1': id(15),
            'a5_3_7': id(12),
            'a5_3_8': id(13),
            'a5_3_9': id(10),
            'a5_3_10': id(1),
            'a5_3_11': function() {
                return {
                    "Εξωτερικό": 4,
                    "Εσωτερικό": 3
                }[data.tab5.a5_3[arr][row].d];
            },
            'a5_3_12': id(6)
        };
        var cat = getCategory(data.tab5.a5_3[arr][row].section);
        if (cat === undefined) {
            return 0;
        }

        var tables = data.tab5.a5_1_2;
        var refArray = [tables.a5_1_2_1, tables.a5_1_2_1, tables.a5_1_2_2, tables.a5_1_2_3, tables.a5_1_2_1][cat - 1];

        return 0.01 * refArray[hash[arr]()].percentage;
    };

    var ret = {};

    $.each(data.tab5.a5_3, function(i, el) {
        el.forEach(function(item, index, arr) {
            if (index === arr.length - 1 || item.section === undefined || !isNumeric(item.budget)) {
                return;
            }
            if (ret[item.section] === undefined) {
                ret[item.section] = {
                    budget: item.budget,
                    pub: item.budget * getPer(i, index)
                };
            }
            else {
                ret[item.section].budget += item.budget;
                ret[item.section].pub += item.budget * getPer(i, index);
            }
        });
    });
    return ret;
};

var updateSectionBudget = function(data) {
    var d = sectionBudget(data);
    var $arr = $('[data-alpaca-field-id="4.1b"]');

    $.each(d, function(i, el) {
        $arr.find('tbody tr')
            .toArray()
            .filter(function(row) {
                return $(row).find('.row-id input').val() == i;
            })
            .map(function(row) {
                $(row).find('.budget-col input').val(el.budget.toFixed(2));
                $(row).find('.public-col input').val(el.pub.toFixed(2));
            });
    });
};


/**
selects the td and tr elements of a given table
@param {string} arr - selector for the array (usually a class)
@param {number[]} rows - list of rows to be returned 0 indexed - empty array => all rows - negatives count from the end
@param {number[]} cols - list of columns to be returned 0 indexed - empty array => all columns
@returns {element[]} - list of all DOM elements that match the criteria
 */
var tableSelect = function(arr, rows, cols) {
    'use strict';
    var $arr = $(arr).find('table');
    var length = $arr.find('>tbody >tr').length;
    var colSelector, ret;

    var rowSelector = rows.reduce(function(acc, el, i) {
        el < 0 && (el = length + el);
        var selector = $alpaca(el);
        i != 0 && (selector = ',' + selector);
        return acc + selector;
    }, 'tr');
    if (cols === undefined) {
        ret = $arr.find(rowSelector);
    }
    else {
        colSelector = cols.reduce(function(acc, el, i) {
            var selector = $alpaca(el);
            i != 0 && (selector = ',' + selector);
            return acc + selector;
        }, 'td');
        ret = $arr.find(rowSelector).find(colSelector);
    }
    return ret;
};

//calculate options for arrays 5.3
//returns declared worckpackages
var getWorkPackages = function(article28) {
    'use strict';
    var $arr = $('[data-alpaca-field-id="4.1b"] tbody tr').toArray();
    return $arr.map(function(el) {
        return {
            value: $(el).find('td[data-alpaca-container-item-index="0"] input').val(),
            option: $(el).find('td[data-alpaca-container-item-index="2"] :input').val(),
            text: $(el).find('td[data-alpaca-container-item-index="1"] input').val(),
            free: $(el).find('td[data-alpaca-container-item-index="3"] :checkbox').prop('checked')
        };
    });
};

var updateSelect = function(data) {
    var createOptions = function(i, arr) {
        return arr.filter(function(el) {
                return el.option == i;
            })
            .reduce(function(a, b) {
                return a + '<option value="' + b.value + '">' + b.text + '</option>';
            }, '');
    };

    var options = getWorkPackages();

    $('[data-alpaca-field-id="5.3"] .show-with').each(function(i, element) {
        var which = $(element).attr('data-alpaca-field-id').replace(/\./g, '_');
        var values = data && data.tab5 && data.tab5.a5_3 && data.tab5.a5_3['a' + which];

        $(element).find('.reference-41b select').empty();
        [1, 2, 3, 4, 5].map(function(el) {
            $(element).find('.ref-' + el).find('select').append(createOptions(el, options));
        });
        $(this).find('.reference-41b select').each(function(index, el) {
            values && values[index] !== undefined && $(el).val(values[index].section);
        });

        if ($(element).find('select option').length == 0) {
            $(element).find('table').find(':input').prop('disabled', true);
        }
        else {
            $(element).find('table').find(':input').prop('disabled', false);
        }
    });
};


/**
@param {table} $table - jquery object of the table from which the data will be red
@param {function} condition - function to filter rows
@param {function} transform - function that generates new value 
@returns the sum
*/
var tableSumIf = function($table, condition, transform) {
    if (typeof condition !== "function") {
        condition = function() {
            return true;
        };
    }
    if (typeof transform !== "function") {
        transform = function($row) {
            return numOr0($row.find('.sum-col input').val(), 0);
        };
    }

    var sum = 0;
    var $rows = $table.find('tbody tr:not(:last-child)');

    $.each($rows, function(i, row) {
        if (!condition($(row))) {
            return;
        }
        sum += condition($(row)) ? transform($(row)) : 0;
    });

    return sum;
};

var sel = function(row, col) {
    return 'tbody tr[data-alpaca-container-item-index=' + row + '] td[data-alpaca-container-item-index=' + col + '] input';
};

//generate a function that checks all requirements
var generateCondition = function(requirement) {
    return function($row) {
        if (!requirement) {
            return true;
        }

        var ret = true;
        $.each(requirement, function(i, el) {
            ret = (ret && el($row.find($alpaca(i, 'td', ' :input')).val()))
        });
        return ret;
    };
};



//returns the percentage to be reduced
var subsidyReduce = function(row) {

    var max = [70, 40, 35, 40, 40, 10, 25];

    var $row = $('[data-alpaca-field-id="5.1"]').find($alpaca(row, 'tr'));
    var per = $row.find('.per-col input').val();

    var reduce;

    if (row <= 7) {
        reduce = 0.01 * Math.max(1 * per - max[row - 1], 0);
    }
    else if (row == 8) {
        var value = $row.find('.sum-col input').val();
        reduce = numOr0(Math.max((value - 14000) / value, 0));
    }
    else {
        reduce = 0;
    }
    return reduce;
};




$(document).ready(function() {

    $('body').css('cursor', 'progress');

    Alpaca.views["bootstrap-edit"].callbacks["collapsible"] = function() {
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
            $anchorEl.mouseover(function(e) {
                $(this).css("cursor", "pointer");
            });
        }
    };

    var path = './';
    //  var path = '../../SAMIS/AM1XP/Controls/SourceHTMLCode/';

    var readonly = false;
    if (typeof(window._Readonly) !== "undefined") {
        readonly = true;
    }
    Alpaca.defaultToolbarSticky = true;
    if (window._serverData == "") {
        window._serverData = "{}";
    }

    var schema = window._submissionSchema;
    schema.required = null;
    schema.readonly = readonly;
    $('#form1').alpaca({
        schema: schema,
        // optionsSource: path + "options.json",
        options: {},
        // dataSource: path + "data.json",
        data: window._serverData,
        postRender: function(control) {
            $('body').css('cursor', 'default');
            setTimeout(function() {
                $('#do-save').show();
            }, 180000);
            $('.array-with-help').find('.help-block').each(function() {
                this.parentNode.appendChild(this);
            });
        },
        "view": {
            // "parent": "bootstrap-edit-horizontal"
        }
        //     wizard: {
        //     title: "Welcome to the Wizard",
        //     description: "Please fill things in as you wish",
        //     validation: false,
        //     markAllStepsVisited: true,
        //     hideSubmitButton: true,
        //     bindings: {
        //         "tab1": 1,
        //         "tab2": 2,
        //         "tab3": 3,
        //         "tab4": 4,
        //         "tab5": 5,
        //         "tab6": 6,
        //         "tab7": 7,
        //         "tab8": 8,
        //         "tab9": 9,
        //         "tab10": 10
        //     },
        //     steps: [{
        //         title: "1",
        //         description: "Γενικά"
        //     }, {
        //         title: "2",
        //         description: "Παρουσίαση"
        //     }, {
        //         title: "3",
        //         description: "Δικαιούχος"
        //     }, {
        //         title: "4",
        //         description: "Αναλυτικά",
        //     }, {
        //         title: "5",
        //         description: "Οικονομικά"
        //     }, {
        //         title: "6",
        //         description: "Ενσωμάτωση"
        //     }, {
        //         title: "7",
        //         description: "Άδειες"
        //     }, {
        //         title: "8",
        //         description: "Χρονοδιάγραμμα"
        //     }, {
        //         title: "9",
        //         description: "Δείκτες"
        //     }, {
        //         title: "10",
        //         description: "Δήλωση"
        //     }]
        // },
        // }
    });

    $("#download-btn").on('click', function() {
        var value = $("#form1").alpaca('get').getValue();
        //$('#print-pdf-content').val(JSON.stringify(value));
        // this.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(value)));
        // this.setAttribute('download', "Υποβολή" + $.format.date(new Date(), 'yyyy_M_d_H_mm_ss') + ".txt");
        $.post({
            url: 'http://www.amifisf.gr:8000/forms/print/',
            data: {
                data: value,
                url: 'http://www.amifisf.gr:8000/forms/AM8-pdf/'
            },
            success: function(response, status, xhr) {
                console.log(response, status, xhr);
            }
        });
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
            };
            reader.onerror = function(evt) {};
        }
    });
});
