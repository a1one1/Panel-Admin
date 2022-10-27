<?php
session_start();
if ($_SESSION['authification'] !== true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}

$htmlfiles = glob('../../*.html');
$responce = [];

foreach ($htmlfiles as $file) {
    array_push($responce, basename($file));
}

echo json_encode($responce);
