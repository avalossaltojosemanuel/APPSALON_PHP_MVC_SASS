<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

//Funcion que revisa que el usuario este autenticado

function isAuth() : void{
    if (!isset($_SESSION['login'])) { //revisa que la variable este como true o false
        header ('Location: /');  //sino esta autenticado lo regresa al login
    }
}