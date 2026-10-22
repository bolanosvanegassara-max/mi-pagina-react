
import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Headphones,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Wrench,
  CreditCard,
  Package,
} from "lucide-react";

export default function HelpDesk() {
  const [formData, setFormData] = useState({
    asunto: "",
    categoria: "Soporte técnico",
    mensaje: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMensajeExito("");
    setMensajeError("");

    // =========================
    // OBTENER CLIENTE LOGUEADO
    // =========================
    const clienteGuardado = localStorage.getItem("cliente");

    if (!clienteGuardado) {
      setMensajeError(
        "No se encontró la sesión del cliente. Inicia sesión nuevamente."
      );
      return;
    }

    let cliente;

    try {
      cliente = JSON.parse(clienteGuardado);
    } catch (error) {
      console.error("Error leyendo cliente:", error);

      setMensajeError(
        "No se pudo obtener la información del cliente. Inicia sesión nuevamente."
      );
      return;
    }

    const clienteId = cliente.id;

    if (!clienteId) {
      setMensajeError(
        "No se encontró el ID del cliente. Inicia sesión nuevamente."
      );
      return;
    }

    // =========================
    // VALIDAR FORMULARIO
    // =========================
    if (
      formData.asunto.trim() === "" ||
      formData.categoria.trim() === "" ||
      formData.mensaje.trim() === ""
    ) {
      setMensajeError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      // =========================
      // ENVIAR SOLICITUD AL PHP
      // =========================
      const respuesta = await fetch(
        "http://localhost/gapsystem/backend/registrar_soporte.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cliente_id: Number(clienteId),
            asunto: formData.asunto,
            categoria: formData.categoria,
            mensaje: formData.mensaje,
          }),
        }
      );

      const datos = await respuesta.json();

      console.log("Respuesta Mesa de Ayuda:", datos);

      if (datos.success) {
        setMensajeExito(
          "¡Solicitud registrada correctamente! Nuestro equipo revisará tu caso."
        );

        // Limpiar formulario
        setFormData({
          asunto: "",
          categoria: "Soporte técnico",
          mensaje: "",
        });
      } else {
        setMensajeError(
          datos.message || "No se pudo registrar la solicitud."
        );
      }
    } catch (error) {
      console.error("Error al registrar soporte:", error);

      setMensajeError(
        "No se pudo conectar con el servidor. Verifica que XAMPP esté funcionando."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================
          ENCABEZADO
      ========================= */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition"
          >
            <ArrowLeft size={20} />
            Volver a mi perfil
          </Link>

          <div className="flex items-center gap-4">

            <div className="bg-white/20 p-4 rounded-2xl">
              <Headphones size={38} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Mesa de Ayuda
              </h1>

              <p className="text-blue-100 mt-1">
                Estamos aquí para ayudarte con tus compras y productos.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* =========================
          CONTENIDO
      ========================= */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-2 gap-8">

          {/* =========================
              FORMULARIO
          ========================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">

            <div className="flex items-center gap-3 mb-6">

              <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
                <MessageSquare size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Crear solicitud
                </h2>

                <p className="text-sm text-gray-500">
                  Cuéntanos cómo podemos ayudarte.
                </p>
              </div>

            </div>

            {/* =========================
                MENSAJE EXITOSO
            ========================= */}
            {mensajeExito && (
              <div className="mb-5 flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">

                <CheckCircle size={20} className="mt-0.5" />

                <p>{mensajeExito}</p>

              </div>
            )}

            {/* =========================
                MENSAJE DE ERROR
            ========================= */}
            {mensajeError && (
              <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">

                <AlertCircle size={20} className="mt-0.5" />

                <p>{mensajeError}</p>

              </div>
            )}

            {/* =========================
                FORMULARIO
            ========================= */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* CATEGORÍA */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿En qué podemos ayudarte?
                </label>

                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="Soporte técnico">
                    Soporte técnico
                  </option>

                  <option value="Problema con un producto">
                    Problema con un producto
                  </option>

                  <option value="Problema con un pedido">
                    Problema con un pedido
                  </option>

                  <option value="Pago">
                    Pago
                  </option>

                  <option value="Garantía">
                    Garantía
                  </option>

                  <option value="Otro">
                    Otro
                  </option>

                </select>

              </div>

              {/* ASUNTO */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Asunto
                </label>

                <input
                  type="text"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  placeholder="Ej: Problema con mi pedido"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* MENSAJE */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Describe tu problema
                </label>

                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Escribe aquí detalladamente tu solicitud..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* BOTÓN */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
              >

                <Send size={20} />

                {loading
                  ? "Enviando solicitud..."
                  : "Enviar solicitud"}

              </button>

            </form>

          </div>

          {/* =========================
              INFORMACIÓN
          ========================= */}
          <div className="space-y-6">

            {/* TARJETA DE AYUDA */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">

              <h2 className="text-xl font-bold text-gray-900 mb-6">
                ¿Cómo podemos ayudarte?
              </h2>

              <div className="space-y-5">

                {/* SOPORTE */}
                <div className="flex gap-4">

                  <div className="bg-blue-100 text-blue-700 p-3 rounded-xl h-fit">
                    <Wrench size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Soporte técnico
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Ayuda con problemas técnicos relacionados
                      con nuestros productos.
                    </p>
                  </div>

                </div>

                {/* PEDIDOS */}
                <div className="flex gap-4">

                  <div className="bg-green-100 text-green-700 p-3 rounded-xl h-fit">
                    <Package size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Pedidos y productos
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Consulta problemas relacionados con tus
                      pedidos, entregas o productos.
                    </p>
                  </div>

                </div>

                {/* PAGOS */}
                <div className="flex gap-4">

                  <div className="bg-purple-100 text-purple-700 p-3 rounded-xl h-fit">
                    <CreditCard size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Pagos
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Si tienes inconvenientes con un pago,
                      puedes reportarlo mediante este formulario.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* =========================
                ESTADO
            ========================= */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-7">

              <div className="flex items-center gap-3 mb-4">

                <CheckCircle size={28} />

                <h2 className="text-xl font-bold">
                  Atención al cliente
                </h2>

              </div>

              <p className="text-blue-100 leading-relaxed">
                Tu solicitud quedará registrada en nuestro
                sistema con un estado inicial de{" "}
                <strong className="text-white">
                  Pendiente
                </strong>
                . Nuestro equipo podrá revisarla y darle
                seguimiento.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

