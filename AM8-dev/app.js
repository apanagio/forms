$(document).ready(function() {
    $('#form1').alpaca({
        schemaSource: "./schema/compiledSchema.json",
        optionsSource: "./options.json",
        dataSource: "./data.json",
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
