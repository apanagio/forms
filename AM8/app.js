/*global $ Alpaca */

var equals = function(i) {
    return function(j) {
        return j === i;
    };
};

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
    $('#total-budget').html(result.total);
    $('#eligible-budget').html(result.eligible);
    $('#total-percentage').html((100 * result.eligible / result.total).toFixed(2));
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
    'use strict'
    var $arr = $('[data-alpaca-field-id="4.1b"] tbody tr').toArray();
    return $arr.map(function(el) {
        return {
            value: $(el).find('td[data-alpaca-container-item-index="0"] input').val(),
            option: $(el).find('td[data-alpaca-container-item-index="2"] :input').val(),
            text: $(el).find('td[data-alpaca-container-item-index="1"] input').val(),
            free: $(el).find('td[data-alpaca-container-item-index="3"] :checkbox').prop('checked')
        }
    });
}

var updateSelect = function() {
    var createOptions = function(i, arr) {
        return arr.filter(function(el) {
                return el.option == i;
            })
            .reduce(function(a, b) {
                return a + '<option value="' + b.value + '">' + b.text + '</option>';
            }, '');
    };

    var options = getWorkPackages();

    $('.reference-41b').each(function(i, element) {
        var value = $(this).find('select').val();
        $(this).find('select').empty();
        [1, 2, 3, 4, 5].map(function(el) {
            $(element).filter('.ref-' + el).find('select').append(createOptions(el, options));
        });
        $(this).find('select').val(value);
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

var getArticle = function(id) {
    if (id === "") {
        return undefined;
    }
    var package = getWorkPackages();
    var valid = package.filter(function(el) {
        return el.value == id;
    });
    return valid.length > 0 ? valid[0].option : undefined;
};

var is25 = function(id) {
    return getArticle(id) == 1 || getArticle(id) == 2;
};
var is28 = function(id) {
    return getArticle(id) == 3;
};
var is3 = function(id) {
    return getArticle(id) == 4;
};
var isMS = function(id) {
    return getArticle(id) == 5;
};
var isFree = function(id) {
    var free = getWorkPackages().filter(function(el) {
        return el.value == id;
    }).map(function(el) {
        return el.free;
    });
    return free.length > 0 ? free[0] : false;
}

var getSubsidy = function($row) {
    var value = numOr0($row.find('.sum-col input').val(), 0);
    return getSubsidyPer($row) * value;
};

//given a spending returns the subsidy it gets (before cutting)
var getSubsidyPer = function($row) {
    var workSection = $row.find('.reference-41b select').val();
    var type = getArticle(workSection);

    var free = isFree(workSection) ? 0.15 : 0;

    var extraArr = {
        "Πολύ μικρή": 0.2,
        "Μικρή": 0.2,
        "Μεσαία": 0.1,
        "Μεγάλη": 0
    };
    var size = extraArr[$('[data-alpaca-field-id="3E.2"] select').val()];

    var percentages = [Math.min(0.5 + free + size, 0.8), 0.25 + free + size, 0.5, 0.5, 0.5 + size];

    return numOr0(percentages[type - 1], 0);
};
//given a row from 5.1.2 returns the percentage that it will get
var updateSubsidy = function(row) {
    var arr51 = $('[data-alpaca-field-id="5.1"]');
    var arr5121 = $('[data-alpaca-field-id="5.1.2.1"]');
    var arr5122 = $('[data-alpaca-field-id="5.1.2.2"]');
    var arr5123 = $('[data-alpaca-field-id="5.1.2.3"]');

    [
        [arr5121, 1, '5.3.1', {
            3: equals('Υφιστάμενο Προσωπικό'),
            7: is25
        }, 1],
        [arr5121, 2, '5.3.1', {
            3: equals('Νέο Προσωπικό'),
            7: is25
        }, 1],
        [arr5121, 3, '5.3.1', {
            3: equals('Δελτίο Παροχής'),
            7: is25
        }, 1],
        [arr5121, 5, '5.3.2', {
            2: equals('Εξοπλισμός'),
            7: is25
        }, 2],
        [arr5121, 6, '5.3.2', {
            2: equals('Κτίριο'),
            7: is25
        }, 3],
        [arr5121, 8, '5.3.3', {
            4: is25
        }, 4],
        [arr5121, 9, '5.3.5', {
            4: is25
        }, 5],
        [arr5121, 10, '5.3.9', {
            3: is25
        }, 5],
        [arr5121, 12, '5.3.7', {
            3: is25
        }, 7],
        [arr5121, 13, '5.3.8', {
            3: is25
        }, 7],
        [arr5121, 14, '5.3.6', {
            3: is25
        }, 6],
        [arr5121, 15, '5.3.6.1', {
            3: is25
        }, , 6],
        [arr5121, 17, '5.3.4', undefined, 8],

        [arr5122, 1, '5.3.10', {
            3: is28
        }, 11],
        [arr5122, 3, '5.3.11', {
            3: equals('Εσωτερικό'),
            4: is28
        }],
        [arr5122, 4, '5.3.11', {
            3: equals('Εξωτερικό'),
            4: is28
        }, 10],
        [arr5122, 6, '5.3.12', {
            3: is28
        }, 12],

        [arr5123, 1, '5.3.1', {
            3: equals('Υφιστάμενο Προσωπικό'),
            7: is3
        }, 1],
        [arr5123, 2, '5.3.1', {
            3: equals('Νέο Προσωπικό'),
            7: is3
        }, 1],
        [arr5123, 3, '5.3.1', {
            3: equals('Δελτίο Παροχής'),
            7: is3
        }, 1],
        [arr5123, 5, '5.3.2', {
            2: equals('Εξοπλισμός'),
            7: is3
        }, 2],
        [arr5123, 6, '5.3.2', {
            2: equals('Κτίριο'),
            7: is3
        }, 2],
        [arr5123, 8, '5.3.3', {
            4: is3
        }, 4],
        [arr5123, 9, '5.3.5', {
            4: is3
        }, 5],
        [arr5123, 10, '5.3.9', {
            3: is3
        }, 5],
        [arr5123, 12, '5.3.7', {
            3: is3
        }, 7],
        [arr5123, 13, '5.3.8', {
            3: is3
        }, 7],
        [arr5123, 14, '5.3.6', {
            3: is3
        }, 6],
        [arr5123, 15, '5.3.6.1', {
            3: is3
        }, 6]
    ].map(function(el) {
        var requested = el[0].find(sel(el[1], 2)).val();
        el[0].find(sel(el[1], 3)).val(
            numOr0((tableSumIf($('[data-alpaca-field-id="' + el[2] + '"]'),
                generateCondition(el[3]),
                getFinalSub(el[4])) * 100 / requested), 0)
            .toFixed(2));
    });

};

var getFinalSub = function(ref) {
    return function($row) {
        var value = $row.find('.sum-col input').val();
        var sub = getSubsidy($row);
        var reduce = subsidyReduce(ref);

        var amount = sub * (1 - reduce);

        return amount;
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
        var value = $row.find('.sum-col').val();
        reduce = numOr0(Math.max((value - 14000) / value, 0));
    }
    else {
        reduce = 0;
    }
    return reduce;
};



var updateSum = function() {
    var arr51 = $('[data-alpaca-field-id="5.1"]');
    var arr5121 = $('[data-alpaca-field-id="5.1.2.1"]');
    var arr5122 = $('[data-alpaca-field-id="5.1.2.2"]');
    var arr5123 = $('[data-alpaca-field-id="5.1.2.3"]');

    //[targetArray, targetRow, sourceArray, condition]
    [
        [arr51, 1, '5.3.1'],
        [arr51, 2, '5.3.2', {
            2: equals('Εξοπλισμός'),
        }],
        [arr51, 3, '5.3.2', {
            2: equals('Κτίριο'),
        }],
        [arr51, 4, '5.3.3'],
        [arr51, 5, '5.3.5'],
        [arr51, 6, '5.3.6'],
        [arr51, 7, '5.3.8'],
        [arr51, 8, '5.3.4'],
        [arr51, 10, '5.3.11'],
        [arr51, 11, '5.3.10'],
        [arr51, 12, '5.3.12']
    ].map(function(el) {
        el[0].find(sel(el[1], 2)).val(
            tableSumIf($('[data-alpaca-field-id="' + el[2] + '"]'),
                generateCondition(el[3]),
                getSubsidy
            ).toFixed(2));
    });
    [
        [arr51, 6, '5.3.6.1'],
        [arr51, 7, '5.3.7'],
        [arr51, 5, '5.3.9']
    ].map(function(el) {
        var value = el[0].find(sel(el[1], 2)).val();
        el[0].find(sel(el[1], 2)).val(1 * value +
            1 * tableSumIf($('[data-alpaca-field-id="' + el[2] + '"]'),
                generateCondition(el[3]),
                getSubsidy
            ).toFixed(2));
    });

    //[targetArray, targetRow, sourceArray, condition, 5.1row]
    [
        [arr5121, 1, '5.3.1', {
            3: equals('Υφιστάμενο Προσωπικό'),
            7: is25
        }],
        [arr5121, 2, '5.3.1', {
            3: equals('Νέο Προσωπικό'),
            7: is25
        }],
        [arr5121, 3, '5.3.1', {
            3: equals('Δελτίο Παροχής'),
            7: is25
        }],
        [arr5121, 5, '5.3.2', {
            2: equals('Εξοπλισμός'),
            7: is25
        }],
        [arr5121, 6, '5.3.2', {
            2: equals('Κτίριο'),
            7: is25
        }],
        [arr5121, 8, '5.3.3', {
            4: is25
        }],
        [arr5121, 9, '5.3.5', {
            4: is25
        }],
        [arr5121, 10, '5.3.9', {
            3: is25
        }],
        [arr5121, 12, '5.3.7', {
            3: is25
        }],
        [arr5121, 13, '5.3.8', {
            3: is25
        }],
        [arr5121, 14, '5.3.6', {
            3: is25
        }],
        [arr5121, 15, '5.3.6.1', {
            3: is25
        }],
        [arr5121, 17, '5.3.4'],

        [arr5122, 1, '5.3.10', {
            3: is28
        }],
        [arr5122, 3, '5.3.11', {
            3: equals('Εσωτερικό'),
            4: is28
        }],
        [arr5122, 4, '5.3.11', {
            3: equals('Εξωτερικό'),
            4: is28
        }],
        [arr5122, 6, '5.3.12', {
            3: is28
        }],

        [arr5123, 1, '5.3.1', {
            3: equals('Υφιστάμενο Προσωπικό'),
            7: is3
        }],
        [arr5123, 2, '5.3.1', {
            3: equals('Νέο Προσωπικό'),
            7: is3
        }],
        [arr5123, 3, '5.3.1', {
            3: equals('Δελτίο Παροχής'),
            7: is3
        }],
        [arr5123, 5, '5.3.2', {
            2: equals('Εξοπλισμός'),
            7: is3
        }],
        [arr5123, 6, '5.3.2', {
            2: equals('Κτίριο'),
            7: is3
        }],
        [arr5123, 8, '5.3.3', {
            4: is3
        }],
        [arr5123, 9, '5.3.5', {
            4: is3
        }],
        [arr5123, 10, '5.3.9', {
            3: is3
        }],
        [arr5123, 12, '5.3.7', {
            3: is3
        }],
        [arr5123, 13, '5.3.8', {
            3: is3
        }],
        [arr5123, 14, '5.3.6', {
            3: is3
        }],
        [arr5123, 15, '5.3.6.1', {
            3: is3
        }]
    ].map(function(el) {
        el[0].find(sel(el[1], 2)).val(
            tableSumIf($('[data-alpaca-field-id="' + el[2] + '"]'),
                generateCondition(el[3])));
    });
};
//updates percentages of table 5.1
var updatePer = function() {

    var $arr = $('[data-alpaca-field-id="5.1"]');
    var sum = tableSumIf($arr);

    $arr.find('tbody tr:last-child .sum-col input').val(sum);

    $arr.find('tbody tr:not(:last-child)').each(function(i, row) {
        var budget = $(row).find('.sum-col input').val();
        var per = sum == 0 ? '' : (100 * budget / sum).toFixed(2);

        $(row).find('.per-col input').val(per);
    });
};

var markErrors = function() {
    var markRow = function(row) {
        $arr.find($alpaca(row, 'tr')).addClass('error-danger');
    };

    var $arr = $('[data-alpaca-field-id="5.1"]');
    var min = [25];
    var max = [70, 40, 35, 40, 40, 10, 25];

    var errorLines = [];

    min.forEach(function(el, i) {
        var per = $arr.find(sel(i + 1, 3)).val();
        if (isNumeric(per) && 1 * per < el) {
            errorLines.push(i + 1);
        }
    });
    max.forEach(function(el, i) {
        var per = $arr.find(sel(i + 1, 3)).val();
        if (isNumeric(per) && 1 * per > el) {
            errorLines.push(i + 1);
        }
    });
    [8, 12].map(function(el) {
        var cost = $arr.find(sel(el, 2)).val();
        if (isNumeric(cost) && 1 * cost > 14000) {
            errorLines.push(el);
        }
    })

    $arr.find('tr').removeClass('error-danger');
    errorLines.map(function(el) {
        markRow(el);
    });
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
            })
        }
    };

    Alpaca.defaultToolbarSticky = true;

    $('#form1').alpaca({
        schemaSource: "./schema/compiledSchema.json",
        optionsSource: "./options.json",
        dataSource: "./data.json",
        postRender: function(control) {
            $('body').css('cursor', 'default');

            $('.array-with-help').find('.help-block').each(function() {
                this.parentNode.appendChild(this);
            });

            ['.array51', '.array25', '.array3', '.array28',
                '.array5311', '.array5312', '.array5313', '.array5314',
                '.array5315', '.array5316', '.array53161', '.array5317', '.array5318',
                '.array5319', '.array53110', '.array53111', '.array53112', '.array54',
                '.array55', '.array-total-sum'
            ].forEach(function(el) {
                tableSelect(el, [-1], []).find('input').attr('readonly', true);
                tableSelect(el, [-1], [1]).attr('colspan', 2).addClass('subtitle-sum');
                tableSelect(el, [-1], [0]).remove();
                tableSelect(el, [-1]).find('.reference-41b').closest('td').remove();
                tableSelect(el, [-1]).find('.hide-last').closest('td').remove();
            });

            tableSelect('.array52', [1], [0]).attr('colspan', 2).addClass('subtitle');
            tableSelect('.array52', [1], []).find('input').attr('readonly', true);
            tableSelect('.array52', [1], [1]).remove();

            tableSelect('.array51', [0, 9], [1]).attr('colspan', 5).addClass('subtitle');
            tableSelect('.array51', [0, 9], [0, 2, 3, 4]).remove();

            tableSelect('.array25', [0, 4, 7, 11, 16], [1]).attr('colspan', 4).addClass('subtitle');
            tableSelect('.array25', [0, 4, 7, 11, 16], [0, 2, 3]).remove();

            tableSelect('.array28', [0, 2, 5], [1]).attr('colspan', 4).addClass('subtitle');
            tableSelect('.array28', [0, 2, 5], [0, 2, 3]).remove();

            tableSelect('.array3', [0, 4, 7, 11, 16], [1]).attr('colspan', 4).addClass('subtitle');
            tableSelect('.array3', [0, 4, 7, 11, 16], [0, 2, 3]).remove();

            tableSelect('.array5311', [-1], [1]).attr('colspan', 5).addClass('subtitle-sum');
            tableSelect('.array5311', [-1], [2, 3, 4, 6]).remove();

            tableSelect('.array5312', [-1], [1]).attr('colspan', 4).addClass('subtitle-sum');
            tableSelect('.array5312', [-1], [2, 3]).remove();

            ['.array5313', '.array5314', '.array5315', '.array54'].forEach(function(el) {
                tableSelect(el, [-1], [1]).attr('colspan', 3).addClass('subtitle-sum');
                tableSelect(el, [-1], [2]).remove();
            });

            tableSelect('.array54', [], [5]).find('input').attr('readonly', true);
            //add dynamically readonly to new percentage columns
            $('body').on('DOMNodeInserted', '.array54', function() {
                //alert("");
                tableSelect($(this), [], [5]).find('input').attr('readonly', true);
            });
            tableSelect('.array55', [], [3]).find('input').attr('readonly', true);

            var computeSum = function(el, col, per, offset) {
                var sum = 0 - offset;
                var arr = $(el).find('tr:not(:last-child) ' + col + ' input');
                $.each(arr, function() {
                    var num = 1 * this.value;
                    !isNaN(num) && (sum += num);
                    (per == true) && ($(el).find('.per-col').length > 0) && $.each(arr, function() {
                        num = 1 * this.value;
                        if (!isNaN(num)) {
                            $(this).closest("tr").find('.per-col input').val((100 * num / sum).toFixed(2));
                        }
                        $(el).find('tr:last-child .per-col input').val("100");
                    });
                    $(el).find('tr:last-child ' + col + ' input').val(sum);
                });
            };

            $('.auto-sum').each(function(i, el) { // Default sum, per function 

                $(el).on('change', '.sum-col > input', function() {
                    computeSum(el, '.sum-col', true, 0);
                });
                $(el).on('mouseup', '.table-bordered>tbody>tr>td.actionbar button[data-alpaca-array-actionbar-action="remove"]', function(el1) {
                    var temp = $(this).closest('tr').find('.sum-col input').val();
                    computeSum(el, '.sum-col', true, temp);
                });

                ['.sum-col-extra', '.sum-col-extra-2'].forEach(function(col) {
                    if ($(el).find(col).length > 0) {
                        $(el).on('change', col + ' > input', function() {
                            computeSum(el, col, false, 0);
                        });
                        $(el).on('mouseup', '.table-bordered>tbody>tr>td.actionbar button[data-alpaca-array-actionbar-action="remove"]', function(el1) {
                            var temp = $(this).closest('tr').find(col + ' input').val();
                            computeSum(el, col, false, temp);
                        });
                    }
                });
            });

            $('.gant-data').append('<div id="gant-chart"></div>');
            var plot = createGant('gant-chart', $('.gant-data'));

            $('.gant-data').on('change', 'input', function() {
                plot = createGant('gant-chart', $('.gant-data'));
            });

            $('.kad-table').on('change', $alpaca(1, 'td', ' :input'), function() {
                $(this).closest('tr').find($alpaca(2, 'td', ' input')).val($(this).val());
            });

            //tab3 
            [0, 1, 2].map(function(row) {
                [1, 3].map(function(col) {
                    $('[data-alpaca-field-id="sourceFin"] tbody tr[data-alpaca-container-item-index=' + row + '] td[data-alpaca-container-item-index=' + col + '] input')
                        .on('change', function(el) {
                            $('[data-alpaca-field-id="targetFin"] tbody tr[data-alpaca-container-item-index=' + (row + 2) + '] td[data-alpaca-container-item-index=' + (col == 3 ? 2 : 1) + '] input')
                                .val(this.value);
                        });

                    $('[data-alpaca-field-id="targetFin"] tbody tr[data-alpaca-container-item-index=' + (row + 2) + '] td[data-alpaca-container-item-index=' + (col == 3 ? 2 : 1) + '] input')
                        .prop('disabled', true);
                });
            });

            //tab4 

            //tab5
            $('#result-table').prependTo('[data-alpaca-field-id="a5"]').show();
            updateSelect();
            //refresh 5.3 on change of 4.1b and when adding rows
            $('[data-alpaca-field-id="4.1b"]').on('change', updateSelect);
            $('[data-alpaca-field-id="5.3"]').on('mousedown', '[data-alpaca-array-actionbar-action="add"]', function() {
                setTimeout(updateSelect, 400);
            });

            //automatic sum of tables
            updateSum();
            updatePer();
            updateSubsidy();
            updateTotal(financialResults(control.getValue()));

            $('[data-alpaca-field-id="5.3"]').on('change', function() {
                updateSum();
                updatePer();
                markErrors();
                updateSubsidy();

                updateTotal(financialResults(control.getValue()));

            });
        },
        view: {
            parent: "bootstrap-edit-horizontal",
            wizard: {
                title: "Welcome to the Wizard",
                description: "Please fill things in as you wish",
                validation: false,
                markAllStepsVisited: true,
                hideSubmitButton: true,
                bindings: {
                    "tab1": 1,
                    "tab2": 2,
                    "tab3": 3,
                    "tab4": 4,
                    "tab5": 5,
                    "tab6": 6,
                    "tab7": 7,
                    "tab8": 8,
                    "tab9": 9,
                    "tab10": 10
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
            };
            reader.onerror = function(evt) {};
        }
    });
});
