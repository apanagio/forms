
var $alpaca = function(index, prefix, suffix) {
    return (prefix ? prefix : "") + '[data-alpaca-container-item-index="' + index + '"]' + (suffix ? suffix : "");
};

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
            var selector = $alpaca(el);
            i != 0 && (selector = ',' + selector);
            return acc + selector;
        }, 'tr');
    if (cols === undefined) {
        ret = $arr.find(rowSelector);
    } else {
        colSelector = cols.reduce(function (acc, el, i) {
                var selector = $alpaca(el);
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

            ['.array51', '.array25', '.array3', '.array28', '.array52' , 
	    '.array5311', '.array5312', '.array5313', '.array5314', 
	    '.array5315', '.array5316', '.array5317', '.array5318', 
	    '.array5319', '.array53110', '.array53111', '.array54', 
	    '.array55', '.array-total-sum'].forEach(function (el) {
            tableSelect(el, [-1], []).find('input').attr('readonly', true);
            tableSelect(el, [-1], [1]).attr('colspan', 2).addClass('subtitle-sum');
	    tableSelect(el, [-1], [0]).remove();
            });
	
	   tableSelect('.array52', [1],[1]).attr('colspan', 2).addClass('subtitle');
	   tableSelect('.array52', [1], []).find('input').attr('readonly', true);
	   tableSelect('.array52', [1], [0]).remove();

            tableSelect('.array51', [0, 10], [1]).attr('colspan', 4).addClass('subtitle');
            tableSelect('.array51', [0, 10], [0, 2, 3]).remove();

            tableSelect('.array25', [0, 4, 7, 11, 16], [1]).attr('colspan', 4).addClass('subtitle');
            tableSelect('.array25', [0, 4, 7, 11, 16], [0, 2, 3]).remove();

            tableSelect('.array28', [0, 2, 5], [1]).attr('colspan', 4).addClass('subtitle');
            tableSelect('.array28', [0, 2, 5], [0, 2, 3]).remove();

            tableSelect('.array3', [0, 4, 7, 11, 16], [1]).attr('colspan', 4).addClass('subtitle');
            tableSelect('.array3', [0, 4, 7, 11, 16], [0, 2, 3]).remove();
	
	    tableSelect('.array5311', [-1], [1]).attr('colspan', 5).addClass('subtitle-sum');         
            tableSelect('.array5311', [-1], [2,3,4,6]).remove();

            tableSelect('.array5312', [-1], [1]).attr('colspan', 4).addClass('subtitle-sum');
            tableSelect('.array5312', [-1], [2,3]).remove();

            ['.array5313', '.array5314', '.array5315',  '.array54'].forEach(function (el) {
                tableSelect(el, [-1], [1]).attr('colspan', 3).addClass('subtitle-sum');
                tableSelect(el, [-1], [2]).remove();
            });
			
            tableSelect('.array54', [], [5]).find('input').attr('readonly', true);
	    tableSelect('.array55', [], [3]).find('input').attr('readonly', true);
			
	    $('body').on('DOMNodeInserted', '.array52', function() {   // testing for new array FIXME
		
			alert('');
		});


            $('body ').each(function (i, el) {				// Default sum, per function FIXME
                $(el).on('change', '.sum-col > input', function () {
                    var sum = 0;
                    var arr = $(el).find('tr:not(:last-child) .sum-col input');
                    $.each(arr, function () {
			num = parseFloat(this.value.replace(".","").replace(",","."));
			if( !isNaN(num))
			{
				sum += num;
			}
		    });
		    ($(el).find('.per-col').length > 0) && $.each(arr, function () {
			num = parseFloat(this.value.replace(".","").replace(",", "."));
			if( !isNaN(num))
			{
				$(this).closest("tr").find('.per-col input').val((100 * num / sum).toFixed(2));
			}
		    });
		    $(el).find('tr:last-child .sum-col input').val(sum);
		    $(el).find('tr:last-child .per-col input').val("100");
		});
            });





	    $('.auto-sum').each(function (i, el) {    				// On .sum-col-extra  FIXME 
                $(el).on('change', 'input: .sum-col-extra', function () {
                    var sum = 0;
                    var arr = $(el).find('tr:not(:last-child) .sum-col-extra input');
                    $.each(arr, function () {
			num = parseFloat(this.value.replace(".","").replace(",","."));
			if( !isNaN(num))
			{
				sum += num;
			}
		    });
		    $(el).find('tr:last-child .sum-col-extra input').val(sum);
	 	});
            });
		
	    



	$('.auto-sum').each(function (i, el) {    				// On .sum-col-extra-2 FIXME 
                $(el).on('change', '.sum-col-extra-2 input', function () {
                    var sum = 0;
                    var arr = $(el).find('tr:not(:last-child) .sum-col-extra-2 input');
                    $.each(arr, function () {
			num = parseFloat(this.value.replace(".","").replace(",",""));
			if( !isNaN(num))
				sum += num;
		    });
                    $(el).find('tr:last-child .sum-col-extra-2 input').val(sum);
                });
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
                    "tab1": 5,
                    "tab2": 2,
                    "tab3": 3,
                    "tab4": 4,
                    "tab5": 1,
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
