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



    <script type="text/javascript" src="app.js"></script>
    <link href="style.css" rel="stylesheet">
    <link href="print-style.css" rel="stylesheet">

</head>

<body>
    <div id="cover" class="cover text-center">
        <div class="cover-logo">
            <img src="img/AM8-logo_no_logo.png" class="img-responsive center-block">
        </div>
        <div class="cover-content text-center">
            <h4 class="space-above">
                Eνίσχυση Eπενδυτικών σχεδίων Καινοτομίας, Έρευνας & Ανάπτυξης Επιχειρήσεων, του κλάδου Χημικών – Πολυμερών Υλικών
            </h4>
            <h5 class="space-above">
                Ειδική Υπηρεσία Διαχείρισης Επιχειρησιακού Προγράμματος<br>Περιφέρειας Ανατολικής Μακεδονίας & Θράκης
            </h5>
            <h6 class="space-above row">
                <dl class="dl-horizontal col-xs-10 col-md-10 center-col">
                  <dt>Κωδικός Πράξης Έργου <br>(Αριθμός ηλεκτρονικής υποβολής): </dt>
                  <dd><?php echo $_GET['id']; ?></dd>
                  <dt>Ημερομηνία ηλεκτρονικής υποβολής: </dt>
                  <dd><?php echo $_GET['date']; ?></dd>
                </dl>
            </h6>
        </div>
        <div class="cover-footer space-above-large">
            <div class="row">
                <div class="col-xs-4 col-md-4"><img src="img/europe-small.jpg"/ width=80></div>
                <div class="col-xs-4 col-md-4"><img src="img/Elliniki_dimokratia_logo-small.png"/ width=80></div>
                <div class="col-xs-4 col-md-4"><img src="img/espa1420-small.jpg"/ width=80></div>
            </div>
        </div>
    </div>
    <?php
        $data = file_get_contents('php://input', true);
        if (empty($data)) {
            $data = '{}';
        }
        $data = str_replace(array("\r\n", "\n", "\r"), '     ', $data);
    ?>
    <?php

        $readonly = 'false';
        $serverData = '{}';
    ?>

    <div id="form1"></div>
    <input type="hidden" id="server-data" value='<?php echo $data; ?>'>

</body>

</html>
