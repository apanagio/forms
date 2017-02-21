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

    <script type="text/javascript" src="app.js"></script>
    <link href="style.css" rel="stylesheet">

</head>

<body>
    <div id="cover" class="cover text-center">
        <div class="cover-logo">
            <img src="img/AM8-logo_no_logo.png" class="img-responsive center-block">
        </div>
        <div class="cover-content text-center">
            <h4 class="space-above">
                Ενίσχυση Επιχειρήσεων για ερευνητικά έργα στους τομείς Χημικών Πολυμερών
            </h4>
            <h5 class="space-above">
                Ειδική Υπηρεσία Διαχείρισης Επιχειρησιακού Προγράμματος<br>Περιφέρειας Ανατολικής Μακεδονίας & Θράκης
            </h5>
            <h6 class="space-above row">
                <dl class="dl-horizontal col-xs-8 col-md-8 center-col">
                  <dt>Κωδικός Πράξης Έργου <br>(Αριθμός ηλεκτρονικής υποβολής): </dt>
                  <dd>sdsdsdsds</dd>
                  <dt>Ημερομηνία ηλεκτρονικής υποβολής: </dt>
                  <dd>xcxcxcxcxc</dd>
                </dl>
            </h6>
        </div>
        <div class="cover-footer space-above-large">
            <div class="row">
                <div class="col-xs-4 col-md-4"><img src="img/europe-small.jpg"/></div>
                <div class="col-xs-4 col-md-4"><img src="img/Elliniki_dimokratia_logo-small.png"/></div>
                <div class="col-xs-4 col-md-4"><img src="img/espa1420-small.jpg"/></div>
            </div>
        </div>
    </div>
    <?php
        $data = file_get_contents('php://input', true);
        if (empty($data)) {
            $data = '{}';
        }
    ?>
    <?php
//        $schema = file_get_contents('schema/compiledSchema.json');
//        if ($schema === false) {
//            echo 'Cannot read schema';
//            die;
//        }
//        $schema = preg_replace('/\t+/', ' ', $schema);

        $readonly = 'false';
        $serverData = '{}';
    ?>
    <input type="hidden" id="server-data" value='<?php echo $data; ?>'>
    <div id="form1">
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
    <script>
        //window._submissionSchema = <?php echo $schema; ?>;
        window._submissionSchema = {};
        window._serverData = '<?php echo $data; ?>';
    </script>
</body>

</html>
