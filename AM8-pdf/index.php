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
