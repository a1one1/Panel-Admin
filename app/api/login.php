<?php
session_start();
$_POST = json_decode(file_get_contents("php://input"), true);

$password = $_POST["password"];

if ($password) {
    $settings = json_decode(file_get_contents('./settings.json'), true);
    if ($password == $settings["password"]) {
        $_SESSION["authification"] = true;
        echo json_encode(array("authification" => true));
    } else {
        echo json_encode(array("authification" => false));
    }
} else {
    header("HTTP/1.0 400 Bad Request");
}
