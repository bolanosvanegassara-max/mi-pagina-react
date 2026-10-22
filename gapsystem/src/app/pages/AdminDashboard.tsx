import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  TrendingUp,
  Wrench,
  Tag,
  CheckCircle,
  XCircle,
  RefreshCw,
  Mail,
  User,
  Loader2,
} from "lucide-react";
import { products } from "../data/products";

interface Equipo {
  id: number;
  nombre_equipo: string;
  codigo_equipo: string;
  categoria: string;
  descripcion: string;
  estado:
    | "Disponible"
    | "En mantenimiento"
    | "En oferta"
    | "Fuera de servicio";
  precio: number;
  fecha_registro: string;
  fecha_mantenimiento: string | null;
}

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // =====================================================
  // ESTADOS PARA CONTROL DE EQUIPOS
  // =====================================================

  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [cargandoEquipos, setCargandoEquipos] = useState(false);
  const [guardandoEquipo, setGuardandoEquipo] = useState(false);
  const [mostrarFormularioEquipo, setMostrarFormularioEquipo] =
    useState(false);

  const [formEquipo, setFormEquipo] = useState({
    nombre_equipo: "",
    codigo_equipo: "",
    categoria: "Computadores",
    descripcion: "",
    estado: "Disponible",
    precio: "",
    fecha_mantenimiento: "",
  });

  // =====================================================
  // ESTADOS PARA CLIENTES DESDE LA BD
  // =====================================================

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargandoClientes, setCargandoClientes] = useState(false);

  // =====================================================
  // CERRAR SESIÓN
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  // =====================================================
  // PRODUCTOS
  // =====================================================

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // =====================================================
  // FORMATO DE PESOS COLOMBIANOS
  // =====================================================

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // =====================================================
  // OBTENER CLIENTES DESDE LA BD
  // =====================================================

  const obtenerClientes = async () => {
    setCargandoClientes(true);
    try {
      const respuesta = await fetch(
        "http://localhost/gapsystem/gapsystem/backend/obtener_clientes.php"
      );
      const data = await respuesta.json();

      if (data.success) {
        setClientes(data.clientes);
      } else {
        setClientes([]);
      }
    } catch (error) {
      console.error("Error obteniendo clientes:", error);
    } finally {
      setCargandoClientes(false);
    }
  };

  // =====================================================
  // ESTADÍSTICAS
  // =====================================================

  const stats = [
    {
      title: "Ingresos totales",
      value: "\$4.567.890",
      change: "+12,5%",
      icon: TrendingUp,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Total de pedidos",
      value: "1.234",
      change: "+8,2%",
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total de productos",
      value: products.length.toString(),
      change: "+5",
      icon: Package,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Total de clientes",
      value: clientes.length > 0 ? clientes.length.toString() : "8.901",
      change: "+15,3%",
      icon: Users,
      color: "bg-orange-100 text-orange-700",
    },
  ];

  // =====================================================
  // OBTENER EQUIPOS
  // =====================================================

  const obtenerEquipos = async () => {
    setCargandoEquipos(true);

    try {
      const respuesta = await fetch(
        "http://localhost/gapsystem/backend/gestionar_equipos.php"
      );

      const data = await respuesta.json();

      console.log("Equipos recibidos:", data);

      if (data.success) {
        setEquipos(data.equipos);
      } else {
        alert(
          data.message || "No se pudieron obtener los equipos."
        );
      }
    } catch (error) {
      console.error("Error obteniendo equipos:", error);

      alert(
        "No se pudo conectar con el servidor. Verifica que XAMPP esté funcionando."
      );
    } finally {
      setCargandoEquipos(false);
    }
  };

  // =====================================================
  // CARGAR EQUIPOS Y CLIENTES AL INICIAR
  // =====================================================

  useEffect(() => {
    obtenerEquipos();
    obtenerClientes();
  }, []);

  // =====================================================
  // CAMBIAR FORMULARIO
  // =====================================================

  const handleEquipoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormEquipo({
      ...formEquipo,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // REGISTRAR EQUIPO
  // =====================================================

  const registrarEquipo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formEquipo.nombre_equipo.trim() === "" ||
      formEquipo.codigo_equipo.trim() === "" ||
      formEquipo.categoria.trim() === ""
    ) {
      alert("Completa los campos obligatorios.");
      return;
    }

    setGuardandoEquipo(true);

    try {
      const respuesta = await fetch(
        "http://localhost/gapsystem/backend/gestionar_equipos.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre_equipo: formEquipo.nombre_equipo,
            codigo_equipo: formEquipo.codigo_equipo,
            categoria: formEquipo.categoria,
            descripcion: formEquipo.descripcion,
            estado: formEquipo.estado,
            precio: Number(formEquipo.precio) || 0,
            fecha_mantenimiento:
              formEquipo.fecha_mantenimiento || null,
          }),
        }
      );

      const data = await respuesta.json();

      console.log("Respuesta registro equipo:", data);

      if (data.success) {
        alert("¡Equipo registrado correctamente!");

        setFormEquipo({
          nombre_equipo: "",
          codigo_equipo: "",
          categoria: "Computadores",
          descripcion: "",
          estado: "Disponible",
          precio: "",
          fecha_mantenimiento: "",
        });

        setMostrarFormularioEquipo(false);

        obtenerEquipos();
      } else {
        alert(
          data.message || "No se pudo registrar el equipo."
        );
      }
    } catch (error) {
      console.error("Error registrando equipo:", error);

      alert(
        "No se pudo conectar con el servidor. Verifica que XAMPP esté funcionando."
      );
    } finally {
      setGuardandoEquipo(false);
    }
  };

  // =====================================================
  // CAMBIAR ESTADO DEL EQUIPO
  // =====================================================

  const cambiarEstadoEquipo = async (
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
        alert(
          data.message || "No se pudo actualizar el estado."
        );
      }
    } catch (error) {
      console.error(
        "Error actualizando estado:",
        error
      );

      alert("No se pudo conectar con el servidor.");
    }
  };

  // =====================================================
  // COLOR DEL ESTADO
  // =====================================================

  const getEstadoColor = (
    estado: Equipo["estado"]
  ) => {
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

  const getEstadoIcon = (
    estado: Equipo["estado"]
  ) => {
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
        return <Wrench size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* =====================================================
          MENÚ LATERAL
      ===================================================== */}

      <aside className="w-64 bg-sidebar text-sidebar-foreground flex-shrink-0">

        <div className="p-6">

          {/* LOGO */}

          <div className="flex items-center space-x-2 mb-8">

            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">

              <span className="text-white font-bold">
                G
              </span>

            </div>

            <span className="text-xl font-semibold">
              GAPSYSTEM
            </span>

          </div>

          {/* MENÚ */}

          <nav className="space-y-2">

            {/* INICIO */}

            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "overview"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />

              <span>
                Inicio
              </span>
            </button>

            {/* PRODUCTOS */}

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "products"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent"
              }`}
            >
              <Package className="w-5 h-5" />

              <span>
                Productos
              </span>
            </button>

            {/* CLIENTES */}

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "users"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent"
              }`}
            >
              <Users className="w-5 h-5" />

              <span>
                Clientes
              </span>
            </button>

            {/* CONTROL DE EQUIPOS */}

            <button
              onClick={() => setActiveTab("equipment")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "equipment"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent"
              }`}
            >
              <Wrench className="w-5 h-5" />

              <span>
                Control de equipos
              </span>
            </button>

            {/* CONFIGURACIÓN */}

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "settings"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent"
              }`}
            >
              <Settings className="w-5 h-5" />

              <span>
                Configuración
              </span>
            </button>

          </nav>

          {/* CERRAR SESIÓN */}

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors mt-8"
          >
            <LogOut className="w-5 h-5" />

            <span>
              Cerrar sesión
            </span>
          </button>

        </div>

      </aside>

      {/* =====================================================
          CONTENIDO PRINCIPAL
      ===================================================== */}

      <main className="flex-1 overflow-auto">

        <div className="p-8">

          {/* ENCABEZADO */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-foreground mb-2">

              {activeTab === "overview" &&
                "Panel de administración"}

              {activeTab === "products" &&
                "Gestión de productos"}

              {activeTab === "users" &&
                "Gestión de clientes"}

              {activeTab === "equipment" &&
                "Control de equipos"}

              {activeTab === "settings" &&
                "Configuración"}

            </h1>

            <p className="text-muted-foreground">

              {activeTab === "overview" &&
                "Resumen general de GAPSYSTEM."}

              {activeTab === "products" &&
                "Administra los productos disponibles en la tienda."}

              {activeTab === "users" &&
                "Consulta y administra los clientes registrados."}

              {activeTab === "equipment" &&
                "Gestiona equipos, mantenimiento y ofertas."}

              {activeTab === "settings" &&
                "Configura las opciones generales de la tienda."}

            </p>

          </div>

          {/* =====================================================
              INICIO
          ===================================================== */}

          {activeTab === "overview" && (

            <div className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {stats.map((stat, index) => (

                  <div
                    key={index}
                    className="bg-card rounded-lg p-6 border border-border"
                  >

                    <div className="flex items-center justify-between mb-4">

                      <div
                        className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                      >
                        <stat.icon className="w-6 h-6" />
                      </div>

                      <span className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </span>

                    </div>

                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>

                    <p className="text-2xl font-bold">
                      {stat.value}
                    </p>

                  </div>

                ))}

              </div>

              {/* PEDIDOS RECIENTES Y PRODUCTOS DESTACADOS */}

              <div className="grid lg:grid-cols-2 gap-6">

                <div className="bg-card rounded-lg border border-border">

                  <div className="p-6 border-b border-border">

                    <h2 className="text-lg font-semibold">
                      Pedidos recientes
                    </h2>

                  </div>

                  <div className="p-6">

                    <div className="space-y-4">

                      {[
                        "PED-2026-123",
                        "PED-2026-124",
                        "PED-2026-125",
                      ].map((pedido) => (

                        <div
                          key={pedido}
                          className="flex items-center justify-between"
                        >

                          <div>

                            <p className="font-medium">
                              {pedido}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              2 productos
                            </p>

                          </div>

                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Completado
                          </span>

                        </div>

                      ))}

                    </div>

                  </div>

                </div>

                {/* PRODUCTOS DESTACADOS */}

                <div className="bg-card rounded-lg border border-border">

                  <div className="p-6 border-b border-border">

                    <h2 className="text-lg font-semibold">
                      Productos destacados
                    </h2>

                  </div>

                  <div className="p-6">

                    <div className="space-y-4">

                      {products
                        .slice(0, 3)
                        .map((product) => (

                          <div
                            key={product.id}
                            className="flex items-center space-x-3"
                          >

                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg bg-muted"
                            />

                            <div className="flex-1">

                              <p className="font-medium text-sm line-clamp-1">
                                {product.name}
                              </p>

                              <p className="text-sm text-muted-foreground">
                                {formatPrice(product.price)}
                              </p>

                            </div>

                          </div>

                        ))}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )}

          {/* =====================================================
              PRODUCTOS
          ===================================================== */}

          {activeTab === "products" && (

            <div className="space-y-6">

              <div className="flex items-center justify-between">

                <div className="relative flex-1 max-w-md">

                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />

                </div>

                <button className="flex items-center space-x-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors">

                  <Plus className="w-5 h-5" />

                  <span>
                    Agregar producto
                  </span>

                </button>

              </div>

              <div className="bg-card rounded-lg border border-border overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead className="bg-muted">

                      <tr>

                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Producto
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Categoría
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Precio
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Disponibilidad
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Acciones
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-border">

                      {filteredProducts.map((product) => (

                        <tr
                          key={product.id}
                          className="hover:bg-muted/50"
                        >

                          <td className="px-6 py-4">

                            <div className="flex items-center space-x-3">

                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg bg-muted"
                              />

                              <div>

                                <p className="font-medium">
                                  {product.name}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                  {product.brand}
                                </p>

                              </div>

                            </div>

                          </td>

                          <td className="px-6 py-4">

                            <span className="px-2 py-1 bg-muted rounded text-xs">
                              {product.category}
                            </span>

                          </td>

                          <td className="px-6 py-4 font-medium">
                            {formatPrice(product.price)}
                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                product.inStock
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.inStock
                                ? "Disponible"
                                : "Agotado"}
                            </span>

                          </td>

                          <td className="px-6 py-4">

                            <div className="flex items-center space-x-2">

                              <button className="p-2 hover:bg-muted rounded-lg transition-colors">

                                <Edit className="w-4 h-4 text-accent" />

                              </button>

                              <button className="p-2 hover:bg-muted rounded-lg transition-colors">

                                <Trash2 className="w-4 h-4 text-destructive" />

                              </button>

                            </div>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          )}

          {/* =====================================================
              CLIENTES (CONECTADO CON LA BASE DE DATOS)
          ===================================================== */}

          {activeTab === "users" && (

            <div className="bg-card rounded-lg border border-border overflow-hidden">

              <div className="p-6 border-b border-border flex justify-between items-center">

                <div>
                  <h3 className="text-lg font-semibold">
                    Clientes registrados
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Lista de usuarios desde la base de datos MySQL.
                  </p>
                </div>

                <button
                  onClick={obtenerClientes}
                  className="flex items-center gap-2 border border-border px-3 py-1.5 rounded-lg text-sm hover:bg-muted transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Actualizar
                </button>

              </div>

              {cargandoClientes ? (

                <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-2 text-accent" />
                  <p>Cargando clientes de la base de datos...</p>
                </div>

              ) : clientes.length === 0 ? (

                <div className="p-12 text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="font-medium text-foreground">
                    No hay clientes registrados todavía
                  </p>
                  <p className="text-sm">
                    Los nuevos usuarios aparecerán aquí cuando se registren.
                  </p>
                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full text-left border-collapse">

                    <thead>

                      <tr className="bg-muted text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <th className="py-3 px-6">ID</th>
                        <th className="py-3 px-6">Nombre</th>
                        <th className="py-3 px-6">Correo electrónico</th>
                      </tr>

                    </thead>

                    <tbody className="divide-y divide-border text-sm">

                      {clientes.map((cliente) => (

                        <tr
                          key={cliente.id}
                          className="hover:bg-muted/30 transition-colors"
                        >

                          <td className="py-4 px-6 font-medium">
                            #{cliente.id}
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">
                                {cliente.nombre}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span>{cliente.correo}</span>
                            </div>
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          )}

          {/* =====================================================
              CONTROL DE EQUIPOS
          ===================================================== */}

          {activeTab === "equipment" && (

            <div className="space-y-6">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <h2 className="text-xl font-bold">
                    Gestión de equipos
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Control de mantenimiento, disponibilidad y ofertas.
                  </p>

                </div>

                <div className="flex gap-3">

                  <button
                    onClick={obtenerEquipos}
                    className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  >

                    <RefreshCw className="w-4 h-4" />

                    Actualizar

                  </button>

                  <button
                    onClick={() =>
                      setMostrarFormularioEquipo(
                        !mostrarFormularioEquipo
                      )
                    }
                    className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
                  >

                    <Plus className="w-5 h-5" />

                    Registrar equipo

                  </button>

                </div>

              </div>

              {/* ESTADÍSTICAS */}

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="bg-card rounded-lg border border-border p-5">

                  <p className="text-sm text-muted-foreground">
                    Total de equipos
                  </p>

                  <p className="text-3xl font-bold mt-1">
                    {equipos.length}
                  </p>

                </div>

                <div className="bg-card rounded-lg border border-border p-5">

                  <p className="text-sm text-muted-foreground">
                    Equipos disponibles
                  </p>

                  <p className="text-3xl font-bold mt-1">
                    {
                      equipos.filter(
                        (equipo) =>
                          equipo.estado === "Disponible"
                      ).length
                    }
                  </p>

                </div>

                <div className="bg-card rounded-lg border border-border p-5">

                  <p className="text-sm text-muted-foreground">
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

                <div className="bg-card rounded-lg border border-border p-5">

                  <p className="text-sm text-muted-foreground">
                    En oferta
                  </p>

                  <p className="text-3xl font-bold mt-1">
                    {
                      equipos.filter(
                        (equipo) =>
                          equipo.estado === "En oferta"
                      ).length
                    }
                  </p>

                </div>

              </div>

              {/* FORMULARIO REGISTRO EQUIPO */}

              {mostrarFormularioEquipo && (

                <div className="bg-card rounded-lg border border-border p-6">

                  <div className="flex items-center gap-3 mb-6">

                    <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">

                      <Wrench className="w-6 h-6" />

                    </div>

                    <div>

                      <h2 className="text-xl font-bold">
                        Registrar nuevo equipo
                      </h2>

                      <p className="text-sm text-muted-foreground">
                        Ingresa la información del equipo.
                      </p>

                    </div>

                  </div>

                  <form
                    onSubmit={registrarEquipo}
                    className="grid md:grid-cols-2 gap-5"
                  >

                    <div>

                      <label className="block text-sm font-semibold mb-2">
                        Nombre del equipo *
                      </label>

                      <input
                        type="text"
                        name="nombre_equipo"
                        value={formEquipo.nombre_equipo}
                        onChange={handleEquipoChange}
                        placeholder="Ej: Lenovo IdeaPad 3"
                        className="w-full border border-border bg-background rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold mb-2">
                        Código del equipo *
                      </label>

                      <input
                        type="text"
                        name="codigo_equipo"
                        value={formEquipo.codigo_equipo}
                        onChange={handleEquipoChange}
                        placeholder="Ej: EQ-001"
                        className="w-full border border-border bg-background rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold mb-2">
                        Categoría *
                      </label>

                      <select
                        name="categoria"
                        value={formEquipo.categoria}
                        onChange={handleEquipoChange}
                        className="w-full border border-border bg-background rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="Computadores">Computadores</option>
                        <option value="Monitores">Monitores</option>
                        <option value="Audio">Audio</option>
                        <option value="Accesorios">Accesorios</option>
                        <option value="Periféricos">Periféricos</option>
                      </select>

                    </div>

                    <div>

                      <label className="block text-sm font-semibold mb-2">
                        Estado inicial *
                      </label>

                      <select
                        name="estado"
                        value={formEquipo.estado}
                        onChange={handleEquipoChange}
                        className="w-full border border-border bg-background rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="Disponible">Disponible</option>
                        <option value="En mantenimiento">En mantenimiento</option>
                        <option value="En oferta">En oferta</option>
                        <option value="Fuera de servicio">Fuera de servicio</option>
                      </select>

                    </div>

                    <div>

                      <label className="block text-sm font-semibold mb-2">
                        Precio
                      </label>

                      <input
                        type="number"
                        name="precio"
                        value={formEquipo.precio}
                        onChange={handleEquipoChange}
                        placeholder="Ej: 2500000"
                        className="w-full border border-border bg-background rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold mb-2">
                        Fecha de mantenimiento
                      </label>

                      <input
                        type="date"
                        name="fecha_mantenimiento"
                        value={formEquipo.fecha_mantenimiento}
                        onChange={handleEquipoChange}
                        className="w-full border border-border bg-background rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                      />

                    </div>

                    <div className="md:col-span-2">

                      <label className="block text-sm font-semibold mb-2">
                        Descripción
                      </label>

                      <textarea
                        name="descripcion"
                        rows={3}
                        value={formEquipo.descripcion}
                        onChange={handleEquipoChange}
                        placeholder="Escribe detalles sobre el estado o especificaciones del equipo..."
                        className="w-full border border-border bg-background rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      />

                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">

                      <button
                        type="button"
                        onClick={() => setMostrarFormularioEquipo(false)}
                        className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        disabled={guardandoEquipo}
                        className="bg-accent text-accent-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
                      >
                        {guardandoEquipo ? "Guardando..." : "Guardar Equipo"}
                      </button>

                    </div>

                  </form>

                </div>

              )}

              {/* TABLA DE EQUIPOS */}

              <div className="bg-card rounded-lg border border-border overflow-hidden">

                {cargandoEquipos ? (

                  <div className="p-12 text-center text-muted-foreground">
                    Cargando equipos...
                  </div>

                ) : equipos.length === 0 ? (

                  <div className="p-12 text-center text-muted-foreground">
                    No hay equipos registrados todavía.
                  </div>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full">

                      <thead className="bg-muted text-xs uppercase font-semibold text-muted-foreground">

                        <tr>

                          <th className="px-6 py-3 text-left">Equipo</th>
                          <th className="px-6 py-3 text-left">Código</th>
                          <th className="px-6 py-3 text-left">Categoría</th>
                          <th className="px-6 py-3 text-left">Estado</th>
                          <th className="px-6 py-3 text-left">Precio</th>
                          <th className="px-6 py-3 text-left">Acciones</th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-border text-sm">

                        {equipos.map((equipo) => (

                          <tr key={equipo.id} className="hover:bg-muted/50">

                            <td className="px-6 py-4 font-medium">
                              {equipo.nombre_equipo}
                            </td>

                            <td className="px-6 py-4 text-muted-foreground">
                              {equipo.codigo_equipo}
                            </td>

                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 bg-muted rounded-full text-xs font-medium">
                                {equipo.categoria}
                              </span>
                            </td>

                            <td className="px-6 py-4">

                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                                  equipo.estado
                                )}`}
                              >
                                {getEstadoIcon(equipo.estado)}
                                {equipo.estado}
                              </span>

                            </td>

                            <td className="px-6 py-4 font-semibold">
                              {formatPrice(equipo.precio)}
                            </td>

                            <td className="px-6 py-4">

                              <select
                                value={equipo.estado}
                                onChange={(e) =>
                                  cambiarEstadoEquipo(
                                    equipo.id,
                                    e.target.value as Equipo["estado"]
                                  )
                                }
                                className="border border-border bg-background rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                              >
                                <option value="Disponible">Disponible</option>
                                <option value="En mantenimiento">En mantenimiento</option>
                                <option value="En oferta">En oferta</option>
                                <option value="Fuera de servicio">Fuera de servicio</option>
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

          )}

          {/* =====================================================
              CONFIGURACIÓN
          ===================================================== */}

          {activeTab === "settings" && (

            <div className="bg-card rounded-lg border border-border p-8 text-center">

              <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />

              <h3 className="text-lg font-semibold mb-2">
                Configuración del sistema
              </h3>

              <p className="text-muted-foreground">
                Las opciones de configuración aparecerán aquí.
              </p>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}