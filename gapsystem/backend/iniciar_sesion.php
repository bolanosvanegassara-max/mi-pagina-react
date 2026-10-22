<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

$correo = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if ($correo === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "El correo y la contraseña son obligatorios."
    ]);
    exit;
}

$consulta = $conexion->prepare(
    "SELECT id, nombre_completo, correo, password
     FROM clientes
     WHERE correo = ?"
);

$consulta->bind_param("s", $correo);
$consulta->execute();

$consulta->store_result();

if ($consulta->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "El correo no está registrado."
    ]);

    $consulta->close();
    $conexion->close();
    exit;
}

$consulta->bind_result(
    $id,
    $nombre_completo,
    $correo_db,
    $password_hash
);

$consulta->fetch();

if (!password_verify($password, $password_hash)) {

    echo json_encode([
        "success" => false,
        "message" => "La contraseña es incorrecta."
    ]);

    $consulta->close();
    $conexion->close();
    exit;
}

echo json_encode([
    "success" => true,
    "message" => "Inicio de sesión exitoso.",
    "cliente" => [
        "id" => $id,
        "nombre" => $nombre_completo,
        "correo" => $correo_db
    ]
]);

$consulta->close();
$conexion->close();

?>