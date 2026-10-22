<?php

$host = "localhost";
$usuario = "root";
$password = "";
$base_datos = "gapsystem";

$conexion = new mysqli(
    $host,
    $usuario,
    $password,
    $base_datos
);

if ($conexion->connect_error) {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos: " . $conexion->connect_error
    ]);
    exit;
}

$conexion->set_charset("utf8mb4");
?>

