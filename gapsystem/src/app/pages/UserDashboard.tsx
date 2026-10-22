
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  LogOut,
  ShoppingBag,
  Headphones,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { products } from "../data/products";

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
}

interface PedidoProducto {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  date: string;
  status: "Delivered" | "In Transit" | "Processing" | "Cancelled";
  total: number;
  items: number;
  products: typeof products;
}

export function UserDashboard() {
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  // =====================================================
  // OBTENER CLIENTE QUE INICIÓ SESIÓN
  // =====================================================
  useEffect(() => {
    const clienteGuardado = localStorage.getItem("cliente");

    if (!clienteGuardado) {
      navigate("/login");
      return;
    }

    try {
      const datosCliente: Cliente = JSON.parse(clienteGuardado);
      setCliente(datosCliente);
    } catch (error) {
      console.error("Error al leer los datos del cliente:", error);
      localStorage.removeItem("cliente");
      navigate("/login");
    }
  }, [navigate]);

  // =====================================================
  // OBTENER PEDIDOS DESDE LA BASE DE DATOS
  // =====================================================
  const obtenerPedidos = async () => {
    setCargandoPedidos(true);
    const clienteGuardado = localStorage.getItem("cliente");

    if (!clienteGuardado) {
      setCargandoPedidos(false);
      return;
    }

    try {
      const datosCliente: Cliente = JSON.parse(clienteGuardado);

      if (!datosCliente.id) {
        setCargandoPedidos(false);
        return;
      }

      // Nota: Se añade el doble "gapsystem" para mantener la consistencia con tu XAMPP
      const respuesta = await fetch(
        `http://localhost/gapsystem/gapsystem/backend/obtener_pedidos_cliente.php?cliente_id=${datosCliente.id}`
      );

      const data = await respuesta.json();

      if (!data.success) {
        console.error("Error obteniendo pedidos:", data.message);
        setOrders([]);
        return;
      }

      const pedidosFormateados: Order[] = data.pedidos.map(
        (pedido: {
          id: number;
          date: string;
          status: string;
          total: number;
          products: PedidoProducto[];
        }) => {
          const productosDelPedido = pedido.products
            .map((productoPedido) => {
              const producto = products.find(
                (p) => String(p.id) === String(productoPedido.id)
              );
              return producto;
            })
            .filter((producto) => producto !== undefined);

          let estado: Order["status"] = "Processing";

          if (pedido.status === "Delivered") {
            estado = "Delivered";
          } else if (pedido.status === "In Transit") {
            estado = "In Transit";
          } else if (pedido.status === "Cancelled") {
            estado = "Cancelled";
          } else {
            estado = "Processing";
          }

          return {
            id: pedido.id,
            date: pedido.date,
            status: estado,
            total: Number(pedido.total),
            items: pedido.products.reduce(
              (total: number, producto: PedidoProducto) =>
                total + producto.quantity,
              0
            ),
            products: productosDelPedido as typeof products,
          };
        }
      );

      setOrders(pedidosFormateados);
    } catch (error) {
      console.error("Error conectando con los pedidos:", error);
      setOrders([]);
    } finally {
      setCargandoPedidos(false);
    }
  };

  useEffect(() => {
    if (cliente?.id) {
      obtenerPedidos();
    }
  }, [cliente]);

  // =====================================================
  // CERRAR SESIÓN
  // =====================================================
  const handleLogout = () => {
    localStorage.removeItem("cliente");
    navigate("/login");
  };

  // =====================================================
  // FORMATEAR PRECIOS
  // =====================================================
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-CO")}`;
  };

  // =====================================================
  // FORMATEAR FECHA
  // =====================================================
  const formatDate = (date: string) => {
    const fecha = new Date(date);

    if (isNaN(fecha.getTime())) {
      return date;
    }

    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // =====================================================
  // COLOR SEGÚN ESTADO
  // =====================================================
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "In Transit":
        return "bg-blue-100 text-blue-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // OBTENER INICIALES
  // =====================================================
  const getInitials = (nombre: string) => {
    return nombre
      .split(" ")
      .filter((parte) => parte.length > 0)
      .map((parte) => parte[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const initials = cliente?.nombre
    ? getInitials(cliente.nombre)
    : "CL";

  // =====================================================
  // ESTADÍSTICAS
  // =====================================================
  const pedidosEntregados = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const pedidosEnCamino = orders.filter(
    (order) => order.status === "In Transit"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TÍTULO */}
        <h1 className="text-3xl font-semibold mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* =====================================================
              MENÚ LATERAL
          ====================================================== */}
          <aside className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 border border-border space-y-6">
              {/* PERFIL */}
              <div className="text-center pb-6 border-b border-border">
                <div className="w-20 h-20 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                  {initials}
                </div>

                <h3 className="font-semibold text-foreground">
                  {cliente?.nombre || "Cliente"}
                </h3>

                <p className="text-sm text-muted-foreground break-all">
                  {cliente?.correo || "Sin correo"}
                </p>
              </div>

              {/* MENÚ */}
              <nav className="space-y-2">
                <a
                  href="#orders"
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Package className="w-5 h-5" />
                  <span>My Orders</span>
                </a>

                <a
                  href="#profile"
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Profile Settings</span>
                </a>

                <a
                  href="#wishlist"
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </a>

                <a
                  href="#addresses"
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Addresses</span>
                </a>

                <a
                  href="#payment"
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Methods</span>
                </a>

                <Link
                  to="/helpdesk"
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Headphones className="w-5 h-5" />
                  <span>Mesa de Ayuda</span>
                </Link>
              </nav>

              {/* CERRAR SESIÓN */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* =====================================================
              CONTENIDO PRINCIPAL
          ====================================================== */}
          <main className="lg:col-span-3">
            {/* ESTADÍSTICAS */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {/* TOTAL PEDIDOS */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-3xl font-semibold mt-2">{orders.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </div>

              {/* ENTREGADOS */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                    <p className="text-3xl font-semibold mt-2">{pedidosEntregados}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* EN CAMINO */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Transit</p>
                    <p className="text-3xl font-semibold mt-2">{pedidosEnCamino}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
                HISTORIAL DE PEDIDOS
            ===================================================== */}
            <div id="orders" className="bg-card rounded-lg border border-border">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order History</h2>
                <button
                  onClick={obtenerPedidos}
                  className="flex items-center gap-2 border border-border px-3 py-1.5 rounded-lg text-sm hover:bg-muted transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Actualizar
                </button>
              </div>

              {/* CARGANDO */}
              {cargandoPedidos ? (
                <div className="p-8 text-center text-muted-foreground">
                  Cargando tus pedidos...
                </div>
              ) : orders.length === 0 ? (
                /* SIN PEDIDOS */
                <div className="p-10 text-center">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No tienes pedidos todavía</h3>
                  <p className="text-muted-foreground mb-6">
                    Cuando realices una compra, tus pedidos aparecerán aquí.
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center px-5 py-2.5 bg-accent text-accent-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
                  >
                    Ver productos
                  </Link>
                </div>
              ) : (
                /* PEDIDOS REALES */
                <div className="divide-y divide-border">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">Pedido #{order.id}</h3>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.items} {order.items === 1 ? "item" : "items"}
                          </p>
                        </div>

                        {/* TOTAL */}
                        <div className="text-left sm:text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-lg font-semibold">{formatPrice(order.total)}</p>
                        </div>
                      </div>

                      {/* PRODUCTOS */}
                      {order.products.length > 0 && (
                        <div className="flex items-center gap-3 mt-5">
                          {order.products.map((product) => (
                            <div
                              key={product.id}
                              className="w-16 h-16 rounded-md border border-border overflow-hidden bg-white"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* =====================================================
                PERFIL
            ===================================================== */}
            <div id="profile" className="bg-card rounded-lg border border-border p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="path-sm text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{cliente?.nombre || "Cliente"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{cliente?.correo || "Sin correo"}</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}