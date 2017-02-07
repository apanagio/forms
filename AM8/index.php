<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset=utf-8>
    <title>Generic form template to base other forms</title>

    <!-- dependencies (jquery, handlebars and bootstrap) -->

    <script src="../deps/jquery/jquery.min.js"></script>

    <script src="../deps/handlebars/handlebars.min.js"></script>

    <link href="../deps/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <script src="../deps/bootstrap/js/bootstrap.min.js"></script>


    <link type="text/css" href="../deps/alpaca/alpaca.min.css" rel="stylesheet" />
    <script type="text/javascript" src="../deps/alpaca/alpaca.min.js"></script>

    <!-- jQuery Price Format for currency field -->
    <script src="../deps/jquery-price-format2/jquery.priceformat.min.js"></script>

    <!-- jQuery date Format -->
    <script src="../deps/jquery-dateFormat/jquery-dateFormat.min.js"></script>


    <script src="../deps/flot/jquery.flot.min.js"></script>
    <script src="../deps/flot/jquery.flot.stack.min.js"></script>

    <?php
        $schema = file_get_contents('schema/compiledSchema.json');
        if ($schema === false) {
            echo 'Cannot read schema';
            die;
        }
        $schema = preg_replace('/\t+/', ' ', $schema);

        $readonly = 'false';
        $serverData = '{}';
    ?>
    <script type="text/javascript">
        window._serverData = '<?php echo $serverData; ?>';
        window._submissionSchema = <?php echo $schema; ?>;
        window._Readonly = undefined;
        if (<?php echo $readonly; ?> === "True") {
            window._Readonly = "True";
       }
        $(document).ready(function () {
            $('#form1').on('change', ':input', function () {
                $('#jsonresult').val((JSON.stringify($("#form1").alpaca('get').getValue())));
            });
        });
    </script>


    <script type="text/javascript" src="app.js"></script>
    <link href="style.css" rel="stylesheet">

</head>

<body>
    <div>
        <label class="btn btn-info btn-sm btn-file">
                <span class="glyphicon glyphicon-open" aria-hidden="true"></span>
                Upload
                <input id="upload-file" type="file" style="display: none;">
            </label>


        <div id="do-save" class="alert alert-danger" role="alert" style="display:none;position:fixed;z-index:9999">
            <strong>Προσοχή:</strong> Αποθηκεύστε την αίτησή σας, η συνεδρία θα αρχικοποιηθεί!
        </div>

        <div id="form1">
        </div>


        <div class="row">
            <form id="print-pdf" method="post" action="http://www.amifisf.gr:8000/forms/print/">
                <input type="hidden" id="jsonresult" name="data" value="<?php echo $serverData; ?>">
                <input type="hidden" id="print-pdf-url" name="url" value="http://www.amifisf.gr:8000/forms/AM8-pdf/">
                <button type="submit" id="download-btn" class="download-btn btn btn-primary btn-lg col-md-3">
                    <span class="glyphicon glyphicon-save" aria-hidden="true"></span> Download pdf
                </button>
            </form>
            <div class="col-md-8">
                <a href="advanced-download" id="advanced-download-link" data-toggle="modal" data-target="#advanced-download" class="download-btn btn btn-danger btn-sm">
                    <span class="glyphicon glyphicon-wrench" aria-hidden="true"></span> Πρόβλημα στο κατέβασμα
                </a>
                <div class="modal fade" id="advanced-download" role="dialog">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                Αντιγράψτε το παρακάτω περιεχόμενο σε ένα αρχείο και ανεβάστε το αρχέιο στο σύστημα υποβολών
                                <textarea id="submit-content" class="form-control"></textarea>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>

    <div id="result-table">
        <table class="table">
            <thead>
                <tr>
                    <th>Αιτούμενος Προϋπολογισμός</th>
                    <th>Χρηματοδότηση</th>
                    <th>Ποσοστό Χρηματοδότησης</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td id="total-budget"></td>
                    <td id="eligible-budget"></td>
                    <td id="total-percentage"></td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>
