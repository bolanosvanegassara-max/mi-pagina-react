<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

$conexionBD = isset($conn) ? $conn : $conexion;

if (!$conexionBD) {
    echo json_encode(["success" => false, "message" => "No se pudo conectar a la base de datos"]);
    exit();
}

// Usamos 'nombre_completo' y 'correo' tal cual aparecen en tu tabla de phpMyAdmin
$sql = "SELECT id, nombre_completo AS nombre, correo FROM clientes ORDER BY id DESC";
$result = $conexionBD->query($sql);

$clientes = array();

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $clientes[] = array(
            "id" => $row["id"],
            "nombre" => $row["nombre"],
            "correo" => $row["correo"]
        );
    }
}

echo json_encode(["success" => true, "clientes" => $clientes]);
$conexionBD->close();
?>