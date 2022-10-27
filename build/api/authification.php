<?php
session_start();

if ($_SESSION["authification"] == true) {
    echo json_encode(array("authification" => true));
} else {
    echo json_encode(array("authification" => false));
}
