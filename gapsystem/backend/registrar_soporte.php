<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No se recibieron datos."
    ]);
    exit;
}

$cliente_id = $data["cliente_id"] ?? null;
$asunto = trim($data["asunto"] ?? "");
$categoria = trim($data["categoria"] ?? "");
$mensaje = trim($data["mensaje"] ?? "");

if (
    !$cliente_id ||
    $asunto === "" ||
    $categoria === "" ||
    $mensaje === ""
) {
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos para registrar la solicitud."
    ]);
    exit;
}

$sql = "INSERT INTO mesa_ayuda
        (cliente_id, asunto, categoria, mensaje, estado)
        VALUES (?, ?, ?, ?, 'Pendiente')";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Error preparando la solicitud."
    ]);
    exit;
}

$stmt->bind_param(
    "isss",
    $cliente_id,
    $asunto,
    $categoria,
    $mensaje
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Solicitud registrada correctamente.",
        "ticket_id" => $conexion->insert_id
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "No se pudo registrar la solicitud."
    ]);
}

$stmt->close();
$conexion->close();

?>