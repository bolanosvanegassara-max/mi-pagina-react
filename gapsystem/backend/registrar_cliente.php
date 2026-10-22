<?php
// Permitir origen de React (o comodín para pruebas locales)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Responder inmediatamente a la petición preflight de CORS
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

$nombre = trim($data["name"] ?? "");
$correo = trim($data["email"] ?? "");
$password = $data["password"] ?? "";
$confirmPassword = $data["confirmPassword"] ?? "";

if ($nombre === "" || $correo === "" || $password === "" || $confirmPassword === "") {
    echo json_encode([
        "success" => false,
        "message" => "Todos los campos son obligatorios."
    ]);
    exit;
}

if ($password !== $confirmPassword) {
    echo json_encode([
        "success" => false,
        "message" => "Las contraseñas no coinciden."
    ]);
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "El correo electrónico no es válido."
    ]);
    exit;
}

$consulta = $conexion->prepare(
    "SELECT id FROM clientes WHERE correo = ?"
);

if (!$consulta) {
    echo json_encode([
        "success" => false,
        "message" => "Error preparando la consulta: " . $conexion->error
    ]);
    exit;
}

$consulta->bind_param("s", $correo);
$consulta->execute();
$consulta->store_result();

if ($consulta->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Este correo ya está registrado."
    ]);
    $consulta->close();
    $conexion->close();
    exit;
}

$consulta->close();

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$insertar = $conexion->prepare(
    "INSERT INTO clientes (nombre_completo, correo, password)
     VALUES (?, ?, ?)"
);

if (!$insertar) {
    echo json_encode([
        "success" => false,
        "message" => "Error preparando la inserción: " . $conexion->error
    ]);
    exit;
}

$insertar->bind_param(
    "sss",
    $nombre,
    $correo,
    $passwordHash
);

if ($insertar->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Cliente registrado correctamente."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "No se pudo registrar el cliente en la base de datos."
    ]);
}

$insertar->close();
$conexion->close();
?>