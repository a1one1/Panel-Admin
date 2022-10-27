<?php
session_start();
if ($_SESSION['authification'] !== true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}

$file = "../../qwertyytrewq.html";

if (file_exists($file)) {
    unlink($file);
} else {
    header("HTTP/1.0 400 Bad Request");
}
