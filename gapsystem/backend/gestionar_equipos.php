<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once "conexion.php";

$metodo = $_SERVER["REQUEST_METHOD"];


/* =====================================================
   OBTENER TODOS LOS EQUIPOS
   GET
===================================================== */

if ($metodo === "GET") {

    $sql = "SELECT
                id,
                nombre_equipo,
                codigo_equipo,
                categoria,
                descripcion,
                estado,
                precio,
                fecha_registro,
                fecha_mantenimiento
            FROM equipos_mantenimiento
            ORDER BY id DESC";

    $resultado = $conexion->query($sql);

    if (!$resultado) {
        echo json_encode([
            "success" => false,
            "message" => "Error al consultar los equipos."
        ]);
        exit;
    }

    $equipos = [];

    while ($fila = $resultado->fetch_assoc()) {
        $equipos[] = $fila;
    }

    echo json_encode([
        "success" => true,
        "equipos" => $equipos
    ]);

    $conexion->close();
    exit;
}


/* =====================================================
   REGISTRAR EQUIPO
   POST
===================================================== */

if ($metodo === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode([
            "success" => false,
            "message" => "No se recibieron datos."
        ]);
        exit;
    }

    $nombre_equipo = trim($data["nombre_equipo"] ?? "");
    $codigo_equipo = trim($data["codigo_equipo"] ?? "");
    $categoria = trim($data["categoria"] ?? "");
    $descripcion = trim($data["descripcion"] ?? "");
    $estado = trim($data["estado"] ?? "Disponible");
    $precio = $data["precio"] ?? 0;
    $fecha_mantenimiento = $data["fecha_mantenimiento"] ?? null;


    if (
        $nombre_equipo === "" ||
        $codigo_equipo === "" ||
        $categoria === ""
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Nombre, código y categoría son obligatorios."
        ]);

        exit;
    }


    $sql = "INSERT INTO equipos_mantenimiento
            (
                nombre_equipo,
                codigo_equipo,
                categoria,
                descripcion,
                estado,
                precio,
                fecha_mantenimiento
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conexion->prepare($sql);

    if (!$stmt) {

        echo json_encode([
            "success" => false,
            "message" => "Error preparando el registro."
        ]);

        exit;
    }


    $stmt->bind_param(
        "sssssds",
        $nombre_equipo,
        $codigo_equipo,
        $categoria,
        $descripcion,
        $estado,
        $precio,
        $fecha_mantenimiento
    );


    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Equipo registrado correctamente.",
            "id" => $conexion->insert_id
        ]);

    } else {

        if ($conexion->errno === 1062) {

            echo json_encode([
                "success" => false,
                "message" => "El código del equipo ya existe."
            ]);

        } else {

            echo json_encode([
                "success" => false,
                "message" => "No se pudo registrar el equipo."
            ]);
        }
    }

    $stmt->close();
    $conexion->close();
    exit;
}


/* =====================================================
   ACTUALIZAR ESTADO
   PUT
===================================================== */

if ($metodo === "PUT") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {

        echo json_encode([
            "success" => false,
            "message" => "No se recibieron datos."
        ]);

        exit;
    }

    $id = $data["id"] ?? null;
    $estado = trim($data["estado"] ?? "");

    if (!$id || $estado === "") {

        echo json_encode([
            "success" => false,
            "message" => "Faltan datos para actualizar."
        ]);

        exit;
    }


    $sql = "UPDATE equipos_mantenimiento
            SET estado = ?
            WHERE id = ?";

    $stmt = $conexion->prepare($sql);

    if (!$stmt) {

        echo json_encode([
            "success" => false,
            "message" => "Error preparando la actualización."
        ]);

        exit;
    }


    $stmt->bind_param(
        "si",
        $estado,
        $id
    );


    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Estado actualizado correctamente."
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "No se pudo actualizar el estado."
        ]);
    }


    $stmt->close();
    $conexion->close();
    exit;
}


/* =====================================================
   MÉTODO NO PERMITIDO
===================================================== */

echo json_encode([
    "success" => false,
    "message" => "Método no permitido."
]);

$conexion->close();

?>