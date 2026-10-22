import { useEffect, useState } from "react";
import {
  Wrench,
  Plus,
  Package,
  Tag,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface Equipo {
  id: number;
  nombre_equipo: string;
  codigo_equipo: string;
  categoria: string;
  descripcion: string;
  estado: "Disponible" | "En mantenimiento" | "En oferta" | "Fuera de servicio";
  precio: number;
  fecha_registro: string;
  fecha_mantenimiento: string | null;
}

export function EquipmentControl() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formData, setFormData] = useState({
    nombre_equipo: "",
    codigo_equipo: "",
    categoria: "Computadores",
    descripcion: "",
    estado: "Disponible",
    precio: "",
    fecha_mantenimiento: "",
  });

  // =====================================================
  // OBTENER EQUIPOS
  // =====================================================

  const obtenerEquipos = async () => {
    setCargando(true);

    try {
      const respuesta = await fetch(
        "http://localhost/gapsystem/backend/gestionar_equipos.php"
      );

      const data = await respuesta.json();

      console.log("Equipos recibidos:", data);

      if (data.success) {
        setEquipos(data.equipos);
      } else {
        alert(data.message || "No se pudieron obtener los equipos.");
      }
    } catch (error) {
      console.error("Error obteniendo equipos:", error);

      alert(
        "No se pudo conectar con el servidor. Verifica que XAMPP esté funcionando."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerEquipos();
  }, []);

  // =====================================================
  // CAMBIAR FORMULARIO
  // =====================================================

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

  // =====================================================
  // REGISTRAR EQUIPO
  // =====================================================

  const registrarEquipo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.nombre_equipo.trim() === "" ||
      formData.codigo_equipo.trim() === "" ||
      formData.categoria.trim() === ""
    ) {
      alert("Completa los campos obligatorios.");
      return;
    }

    setGuardando(true);

    try {
      const respuesta = await fetch(
        "http://localhost/gapsystem/backend/gestionar_equipos.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre_equipo: formData.nombre_equipo,
            codigo_equipo: formData.codigo_equipo,
            categoria: formData.categoria,
            descripcion: formData.descripcion,
            estado: formData.estado,
            precio: Number(formData.precio) || 0,
            fecha_mantenimiento:
              formData.fecha_mantenimiento || null,
          }),
        }
      );

      const data = await respuesta.json();

      console.log("Respuesta registro equipo:", data);

      if (data.success) {
        alert("¡Equipo registrado correctamente!");

        setFormData({
          nombre_equipo: "",
          codigo_equipo: "",
          categoria: "Computadores",
          descripcion: "",
          estado: "Disponible",
          precio: "",
          fecha_mantenimiento: "",
        });

        setMostrarFormulario(false);

        obtenerEquipos();
      } else {
        alert(data.message || "No se pudo registrar el equipo.");
      }
    } catch (error) {
      console.error("Error registrando equipo:", error);

      alert(
        "No se pudo conectar con el servidor. Verifica que XAMPP esté funcionando."
      );
    } finally {
      setGuardando(false);
    }
  };

  // =====================================================
  // CAMBIAR ESTADO
  // =====================================================

  const cambiarEstado = async (
    id: number,
    nuevoEstado: Equipo["estado"]
  ) => {
    try {
      const respuesta = await fetch(
        "http://localhost/gapsystem/backend/gestionar_equipos.php",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            estado: nuevoEstado,
          }),
        }
      );

      const data = await respuesta.json();

      if (data.success) {
        obtenerEquipos();
      } else {
        alert(data.message || "No se pudo actualizar el estado.");
      }
    } catch (error) {
      console.error("Error actualizando estado:", error);

      alert("No se pudo conectar con el servidor.");
    }
  };

  // =====================================================
  // FORMATEAR PRECIO
  // =====================================================

  const formatPrice = (price: number) => {
    return `$${Number(price).toLocaleString("es-CO")}`;
  };

  // =====================================================
  // COLOR DEL ESTADO
  // =====================================================

  const getEstadoColor = (estado: Equipo["estado"]) => {
    switch (estado) {
      case "Disponible":
        return "bg-green-100 text-green-700";

      case "En mantenimiento":
        return "bg-yellow-100 text-yellow-700";

      case "En oferta":
        return "bg-blue-100 text-blue-700";

      case "Fuera de servicio":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // ICONO DEL ESTADO
  // =====================================================

  const getEstadoIcon = (estado: Equipo["estado"]) => {
    switch (estado) {
      case "Disponible":
        return <CheckCircle size={16} />;

      case "En mantenimiento":
        return <Wrench size={16} />;

      case "En oferta":
        return <Tag size={16} />;

      case "Fuera de servicio":
        return <XCircle size={16} />;

      default:
        return <AlertTriangle size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          ENCABEZADO
      ===================================================== */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="bg-white/20 p-4 rounded-2xl">

                <Wrench size={36} />

              </div>

              <div>

                <h1 className="text-3xl font-bold">
                  Control de Equipos
                </h1>

                <p className="text-blue-100 mt-1">
                  Gestión de mantenimiento y ofertas
                </p>

              </div>

            </div>

            <div className="flex gap-3">

              <button
                onClick={obtenerEquipos}
                className="bg-white/15 hover:bg-white/25 px-4 py-3 rounded-xl flex items-center gap-2 transition"
              >
                <RefreshCw size={18} />
                Actualizar
              </button>

              <button
                onClick={() =>
                  setMostrarFormulario(!mostrarFormulario)
                }
                className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-3 rounded-xl flex items-center gap-2 font-semibold transition"
              >
                <Plus size={19} />
                Registrar equipo
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* =====================================================
            ESTADÍSTICAS
        ===================================================== */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-2xl border border-gray-200 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Total equipos
                </p>

                <p className="text-3xl font-bold mt-1">
                  {equipos.length}
                </p>

              </div>

              <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
                <Package size={24} />
              </div>

            </div>

          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Disponibles
                </p>

                <p className="text-3xl font-bold mt-1">
                  {
                    equipos.filter(
                      (equipo) => equipo.estado === "Disponible"
                    ).length
                  }
                </p>

              </div>

              <div className="bg-green-100 text-green-700 p-3 rounded-xl">
                <CheckCircle size={24} />
              </div>

            </div>

          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  En mantenimiento
                </p>

                <p className="text-3xl font-bold mt-1">
                  {
                    equipos.filter(
                      (equipo) =>
                        equipo.estado === "En mantenimiento"
                    ).length
                  }
                </p>

              </div>

              <div className="bg-yellow-100 text-yellow-700 p-3 rounded-xl">
                <Wrench size={24} />
              </div>

            </div>

          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  En oferta
                </p>

                <p className="text-3xl font-bold mt-1">
                  {
                    equipos.filter(
                      (equipo) => equipo.estado === "En oferta"
                    ).length
                  }
                </p>

              </div>

              <div className="bg-purple-100 text-purple-700 p-3 rounded-xl">
                <Tag size={24} />
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            FORMULARIO
        ===================================================== */}

        {mostrarFormulario && (

          <div className="bg-white rounded-2xl border border-gray-200 p-7 mb-8">

            <div className="flex items-center gap-3 mb-6">

              <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">

                <Plus size={24} />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Registrar nuevo equipo
                </h2>

                <p className="text-sm text-gray-500">
                  Ingresa la información del equipo.
                </p>

              </div>

            </div>

            <form
              onSubmit={registrarEquipo}
              className="grid md:grid-cols-2 gap-5"
            >

              {/* NOMBRE */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del equipo *
                </label>

                <input
                  type="text"
                  name="nombre_equipo"
                  value={formData.nombre_equipo}
                  onChange={handleChange}
                  placeholder="Ej: Lenovo IdeaPad 3"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* CÓDIGO */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Código del equipo *
                </label>

                <input
                  type="text"
                  name="codigo_equipo"
                  value={formData.codigo_equipo}
                  onChange={handleChange}
                  placeholder="Ej: EQ-001"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* CATEGORÍA */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoría *
                </label>

                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="Computadores">
                    Computadores
                  </option>

                  <option value="Monitores">
                    Monitores
                  </option>

                  <option value="Audio">
                    Audio
                  </option>

                  <option value="Accesorios">
                    Accesorios
                  </option>

                  <option value="Periféricos">
                    Periféricos
                  </option>

                </select>

              </div>

              {/* PRECIO */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Precio
                </label>

                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ej: 2500000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* ESTADO */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado
                </label>

                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="Disponible">
                    Disponible
                  </option>

                  <option value="En mantenimiento">
                    En mantenimiento
                  </option>

                  <option value="En oferta">
                    En oferta
                  </option>

                  <option value="Fuera de servicio">
                    Fuera de servicio
                  </option>

                </select>

              </div>

              {/* FECHA MANTENIMIENTO */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de mantenimiento
                </label>

                <input
                  type="date"
                  name="fecha_mantenimiento"
                  value={formData.fecha_mantenimiento}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* DESCRIPCIÓN */}
              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>

                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe el equipo, mantenimiento requerido u observaciones..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* BOTONES */}
              <div className="md:col-span-2 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="px-5 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
                >
                  {guardando
                    ? "Guardando..."
                    : "Registrar equipo"}
                </button>

              </div>

            </form>

          </div>

        )}

        {/* =====================================================
            LISTA DE EQUIPOS
        ===================================================== */}

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          <div className="p-6 border-b border-gray-200">

            <h2 className="text-xl font-bold">
              Equipos registrados
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Control de equipos, mantenimiento y ofertas.
            </p>

          </div>

          {cargando ? (

            <div className="p-10 text-center text-gray-500">
              Cargando equipos...
            </div>

          ) : equipos.length === 0 ? (

            <div className="p-12 text-center">

              <Package
                size={50}
                className="mx-auto mb-4 text-gray-300"
              />

              <h3 className="text-lg font-semibold text-gray-800">
                No hay equipos registrados
              </h3>

              <p className="text-gray-500 mt-2">
                Registra el primer equipo para comenzar el control.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Equipo
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Código
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Categoría
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Precio
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Estado
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Mantenimiento
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Acción
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-200">

                  {equipos.map((equipo) => (

                    <tr
                      key={equipo.id}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* EQUIPO */}
                      <td className="px-6 py-5">

                        <div>

                          <p className="font-semibold text-gray-900">
                            {equipo.nombre_equipo}
                          </p>

                          {equipo.descripcion && (

                            <p className="text-sm text-gray-500 mt-1 max-w-xs">
                              {equipo.descripcion}
                            </p>

                          )}

                        </div>

                      </td>

                      {/* CÓDIGO */}
                      <td className="px-6 py-5">

                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {equipo.codigo_equipo}
                        </span>

                      </td>

                      {/* CATEGORÍA */}
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {equipo.categoria}
                      </td>

                      {/* PRECIO */}
                      <td className="px-6 py-5 font-semibold text-gray-800">
                        {formatPrice(equipo.precio)}
                      </td>

                      {/* ESTADO */}
                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getEstadoColor(
                            equipo.estado
                          )}`}
                        >

                          {getEstadoIcon(equipo.estado)}

                          {equipo.estado}

                        </span>

                      </td>

                      {/* FECHA */}
                      <td className="px-6 py-5 text-sm text-gray-600">

                        {equipo.fecha_mantenimiento
                          ? new Date(
                              equipo.fecha_mantenimiento
                            ).toLocaleDateString("es-CO")
                          : "No programado"}

                      </td>

                      {/* ACCIONES */}
                      <td className="px-6 py-5">

                        <select
                          value={equipo.estado}
                          onChange={(e) =>
                            cambiarEstado(
                              equipo.id,
                              e.target.value as Equipo["estado"]
                            )
                          }
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >

                          <option value="Disponible">
                            Disponible
                          </option>

                          <option value="En mantenimiento">
                            En mantenimiento
                          </option>

                          <option value="En oferta">
                            En oferta
                          </option>

                          <option value="Fuera de servicio">
                            Fuera de servicio
                          </option>

                        </select>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}