<?php
session_start();

if($_SESSION["authification"] == true) {
    $_SESSION["authification"] == false;
    session_destroy();
}