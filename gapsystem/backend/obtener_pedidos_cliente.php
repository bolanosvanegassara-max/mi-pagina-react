<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once "conexion.php";

$cliente_id = isset($_GET["cliente_id"]) ? (int)$_GET["cliente_id"] : 0;

if ($cliente_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Cliente no válido."
    ]);
    exit;
}

try {

    // Obtener pedidos del cliente
    $sqlPedidos = "SELECT 
                    id,
                    fecha,
                    total,
                    estado,
                    nombre_cliente,
                    telefono,
                    direccion,
                    ciudad,
                    metodo_pago
                   FROM pedidos
                   WHERE cliente_id = ?
                   ORDER BY fecha DESC";

    $stmtPedidos = $conexion->prepare($sqlPedidos);

    if (!$stmtPedidos) {
        throw new Exception("Error preparando la consulta de pedidos.");
    }

    $stmtPedidos->bind_param("i", $cliente_id);
    $stmtPedidos->execute();

    $resultadoPedidos = $stmtPedidos->get_result();

    $pedidos = [];

    while ($pedido = $resultadoPedidos->fetch_assoc()) {

        $pedido_id = (int)$pedido["id"];

        // Obtener productos de cada pedido
        $sqlDetalles = "SELECT
                            producto_id,
                            nombre_producto,
                            cantidad,
                            precio
                        FROM detalle_pedido
                        WHERE pedido_id = ?";

        $stmtDetalles = $conexion->prepare($sqlDetalles);

        if (!$stmtDetalles) {
            throw new Exception("Error preparando los detalles del pedido.");
        }

        $stmtDetalles->bind_param("i", $pedido_id);
        $stmtDetalles->execute();

        $resultadoDetalles = $stmtDetalles->get_result();

        $productos = [];

        while ($detalle = $resultadoDetalles->fetch_assoc()) {

            $productos[] = [
                "id" => $detalle["producto_id"],
                "name" => $detalle["nombre_producto"],
                "quantity" => (int)$detalle["cantidad"],
                "price" => (float)$detalle["precio"]
            ];
        }

        $stmtDetalles->close();

        $pedidos[] = [
            "id" => $pedido_id,
            "date" => $pedido["fecha"],
            "status" => $pedido["estado"],
            "total" => (float)$pedido["total"],
            "nombre_cliente" => $pedido["nombre_cliente"],
            "telefono" => $pedido["telefono"],
            "direccion" => $pedido["direccion"],
            "ciudad" => $pedido["ciudad"],
            "metodo_pago" => $pedido["metodo_pago"],
            "products" => $productos
        ];
    }

    $stmtPedidos->close();

    echo json_encode([
        "success" => true,
        "pedidos" => $pedidos
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conexion->close();

?>