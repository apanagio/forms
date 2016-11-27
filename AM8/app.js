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


    $('#form1').alpaca({
        schemaSource: "./schema/compiledSchema.json",
        optionsSource: "./options.json",
        dataSource: "./data.json",
        postRender: function () {
            $('body').css('cursor', 'default');
        },
        view: {
        parent: "bootstrap-edit-horizontal",
        wizard: {
            title: "Welcome to the Wizard",
            description: "Please fill things in as you wish",
            hideSubmitButton: true,
             bindings: {
                "1": 1,
                "2": 2,
                "3": 3,
                "4": 4,
                "5": 5,
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
            }]
        }
    }
    });

    $("#download-btn").on('click', function() {
        var value = $("#form1").alpaca('get').getValue();
        this.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(value)));
        this.setAttribute('download', "Υποβολή" + $.format.date(new Date(), 'yyyy_M_d_H_mm_ss') + ".txt");
    });

    $('#advanced-download-link').on('click', function () {
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
