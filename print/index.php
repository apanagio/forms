<?php

    $data = $_POST['data'];
    if (empty($data)) {
        $data = '{}';
    }

    $url = $_POST['url'];
    $id = urlencode($_POST['ContractCode']);
    $date = $_POST['SubmissionDate'];

    $url = "$url?id=$id&date=$date";

    $phantomPath = './';

    $command = "echo '$data' | phantomjs {$phantomPath}print.js '$url' ";

    $output = 'output/';

    $result = exec($command);

    $attachment_location = $output.$result;
    clearstatcache(true);
    if (file_exists($attachment_location)) {
        header($_SERVER['SERVER_PROTOCOL'].' 200 OK');
        header('Cache-Control: public'); // needed for internet explorer
        header('Content-Type: application/pdf; charset=utf-8');
        header('Content-Transfer-Encoding: Binary');
        header('Content-Length:'.filesize($attachment_location));
        header("Content-Disposition: attachment; filename=$result");
        readfile($attachment_location);
        die();
    } else {
        die('Error: File not found. '.$result);
    }
    echo $result;
