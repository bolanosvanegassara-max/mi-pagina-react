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

/* =========================
   DATOS DEL CLIENTE
========================= */

$cliente_id = $data["cliente_id"] ?? null;
$nombre = trim($data["nombre"] ?? "");
$telefono = trim($data["telefono"] ?? "");
$direccion = trim($data["direccion"] ?? "");
$ciudad = trim($data["ciudad"] ?? "");
$metodo_pago = trim($data["metodo_pago"] ?? "");
$total = (float)($data["total"] ?? 0);

/* =========================
   PRODUCTOS
========================= */

$productos = $data["productos"] ?? [];

/* =========================
   VALIDAR DATOS
========================= */

if (
    !$cliente_id ||
    $nombre === "" ||
    $telefono === "" ||
    $direccion === "" ||
    $ciudad === "" ||
    $metodo_pago === "" ||
    $total <= 0 ||
    empty($productos)
) {
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos para registrar el pedido."
    ]);
    exit;
}

/* =========================
   INICIAR TRANSACCIÓN
========================= */

$conexion->begin_transaction();

try {

    /* =========================
       GUARDAR PEDIDO
    ========================= */

    $sqlPedido = "INSERT INTO pedidos
        (
            cliente_id,
            total,
            estado,
            nombre_cliente,
            telefono,
            direccion,
            ciudad,
            metodo_pago
        )
        VALUES (?, ?, 'Processing', ?, ?, ?, ?, ?)";

    $stmtPedido = $conexion->prepare($sqlPedido);

    if (!$stmtPedido) {
        throw new Exception("Error preparando el pedido.");
    }

    $stmtPedido->bind_param(
        "idsssss",
        $cliente_id,
        $total,
        $nombre,
        $telefono,
        $direccion,
        $ciudad,
        $metodo_pago
    );

    if (!$stmtPedido->execute()) {
        throw new Exception("No se pudo guardar el pedido.");
    }

    /* ID del pedido creado */
    $pedido_id = $conexion->insert_id;

    $stmtPedido->close();

    /* =========================
       GUARDAR DETALLE
    ========================= */

    $sqlDetalle = "INSERT INTO detalle_pedido
        (
            pedido_id,
            producto_id,
            nombre_producto,
            cantidad,
            precio
        )
        VALUES (?, ?, ?, ?, ?)";

    $stmtDetalle = $conexion->prepare($sqlDetalle);

    if (!$stmtDetalle) {
        throw new Exception("Error preparando el detalle del pedido.");
    }

    foreach ($productos as $producto) {

        $producto_id = (string)($producto["product"]["id"] ?? "");
        $nombre_producto = $producto["product"]["name"] ?? "";
        $cantidad = (int)($producto["quantity"] ?? 0);
        $precio = (float)($producto["product"]["price"] ?? 0);

        if (
            $producto_id === "" ||
            $nombre_producto === "" ||
            $cantidad <= 0 ||
            $precio <= 0
        ) {
            throw new Exception("Hay un producto con datos inválidos.");
        }

        $stmtDetalle->bind_param(
            "issid",
            $pedido_id,
            $producto_id,
            $nombre_producto,
            $cantidad,
            $precio
        );

        if (!$stmtDetalle->execute()) {
            throw new Exception("No se pudo guardar un producto del pedido.");
        }
    }

    $stmtDetalle->close();

    /* =========================
       CONFIRMAR
    ========================= */

    $conexion->commit();

    echo json_encode([
        "success" => true,
        "message" => "Pedido registrado correctamente.",
        "pedido_id" => $pedido_id
    ]);

} catch (Exception $e) {

    /* Si algo falla, no guarda nada */
    $conexion->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conexion->close();

?>