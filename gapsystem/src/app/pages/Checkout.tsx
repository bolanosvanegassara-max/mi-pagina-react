
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  CheckCircle,
  Download,
  Smartphone,
  Building2,
  Lock,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { products } from "../data/products";

interface CartItem {
  product: (typeof products)[0];
  quantity: number;
}

interface Factura {
  pedido_id: number;
  fecha: string;
  nombre: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  metodoPago: MetodoPago;
  subtotal: number;
  shipping: number;
  total: number;
  productos: CartItem[];
}

type MetodoPago =
  | "Tarjeta"
  | "Nequi"
  | "PSE"
  | "Contraentrega"
  | "";

export function Checkout() {
  const navigate = useNavigate();

  // CARRITO
  const [cartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem("gapsystem_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // CLIENTE
  const cliente = (() => {
    try {
      const savedCliente = localStorage.getItem("cliente");
      return savedCliente ? JSON.parse(savedCliente) : null;
    } catch {
      return null;
    }
  })();

  // DATOS DE ENVÍO
  const [formData, setFormData] = useState({
    nombre: cliente?.nombre || "",
    telefono: "",
    direccion: "",
    ciudad: "",
    metodoPago: "" as MetodoPago,
  });

  // DATOS FICTICIOS DE PAGO
  const [paymentData, setPaymentData] = useState({
    numeroTarjeta: "",
    nombreTarjeta: "",
    vencimiento: "",
    cvv: "",
    pin: "",
    telefonoNequi: "",
    codigoNequi: "",
    bancoPSE: "",
    tipoPersonaPSE: "",
    documentoPSE: "",
  });

  // ESTADOS
  const [procesando, setProcesando] = useState(false);
  const [estadoPago, setEstadoPago] = useState("");
  const [compraRealizada, setCompraRealizada] = useState(false);
  const [factura, setFactura] = useState<Factura | null>(null);

  // TOTALES
  const subtotal = cartItems.reduce(
    (acumulado, item) =>
      acumulado + Number(item.product.price) * item.quantity,
    0
  );

  const shipping =
    subtotal >= 200000 || subtotal === 0 ? 0 : 15000;

  const total = subtotal + shipping;

  // FORMATO DE PRECIO
  const formatPrice = (price: number) =>
    `$${Number(price).toLocaleString("es-CO")}`;

  // CAMBIOS EN LOS DATOS
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // DESCARGAR FACTURA PDF
  const descargarFactura = () => {
    if (!factura) {
      alert("No hay una factura disponible para descargar.");
      return;
    }

    try {
      const pdf = new jsPDF();
      const anchoPagina = pdf.internal.pageSize.getWidth();
      const altoPagina = pdf.internal.pageSize.getHeight();
      const margen = 18;
      const anchoTexto = anchoPagina - margen * 2;
      let y = 20;

      const comprobarEspacio = (espacio = 10) => {
        if (y + espacio > altoPagina - 18) {
          pdf.addPage();
          y = 20;
        }
      };

      const escribir = (
        texto: string,
        opciones?: { negrita?: boolean; tamano?: number }
      ) => {
        const tamano = opciones?.tamano ?? 10;
        pdf.setFont(
          "helvetica",
          opciones?.negrita ? "bold" : "normal"
        );
        pdf.setFontSize(tamano);

        const lineas = pdf.splitTextToSize(texto, anchoTexto);
        comprobarEspacio(lineas.length * 5 + 3);
        pdf.text(lineas, margen, y);
        y += lineas.length * 5 + 3;
      };

      // ENCABEZADO
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(21);
      pdf.text("GAPSYSTEM S.A.S.", margen, y);
      y += 10;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text("FACTURA DE COMPRA", margen, y);
      y += 8;

      pdf.setDrawColor(210, 20, 150);
      pdf.setLineWidth(0.8);
      pdf.line(margen, y, anchoPagina - margen, y);
      y += 10;

      escribir(`Numero de pedido: #${factura.pedido_id}`, {
        negrita: true,
        tamano: 11,
      });
      escribir(`Fecha: ${factura.fecha}`);
      y += 3;

      // DATOS DEL CLIENTE
      escribir("DATOS DEL CLIENTE", {
        negrita: true,
        tamano: 12,
      });
      escribir(`Nombre: ${factura.nombre}`);
      escribir(`Telefono: ${factura.telefono}`);
      escribir(`Direccion: ${factura.direccion}`);
      escribir(`Ciudad: ${factura.ciudad}`);
      y += 4;

      // TABLA DE PRODUCTOS
      escribir("PRODUCTOS", { negrita: true, tamano: 12 });

      const colProducto = margen;
      const colCantidad = anchoPagina - margen - 58;
      const colPrecio = anchoPagina - margen - 23;

      const dibujarEncabezadoTabla = () => {
        comprobarEspacio(14);
        pdf.setFillColor(245, 235, 242);
        pdf.rect(margen, y - 4, anchoTexto, 10, "F");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.text("Producto", colProducto + 2, y + 2);
        pdf.text("Cant.", colCantidad, y + 2);
        pdf.text("Total", colPrecio, y + 2);
        y += 12;
      };

      dibujarEncabezadoTabla();

      factura.productos.forEach((item) => {
        const nombre = String(item.product.name);
        const cantidad = Number(item.quantity);
        const precioTotal =
          Number(item.product.price) * cantidad;

        const lineas = pdf.splitTextToSize(nombre, 85);
        const altura = Math.max(7, lineas.length * 5) + 3;

        comprobarEspacio(altura + 2);

        if (y === 20) {
          dibujarEncabezadoTabla();
        }

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.text(lineas, colProducto + 2, y);
        pdf.text(String(cantidad), colCantidad, y);
        pdf.text(
          `$${precioTotal.toLocaleString("es-CO")}`,
          colPrecio,
          y
        );

        y += altura;
        pdf.setDrawColor(225, 225, 225);
        pdf.line(margen, y - 2, anchoPagina - margen, y - 2);
      });

      y += 6;

      // TOTALES
      comprobarEspacio(35);

      const escribirTotal = (
        etiqueta: string,
        valor: string,
        negrita = false
      ) => {
        comprobarEspacio(9);
        pdf.setFont("helvetica", negrita ? "bold" : "normal");
        pdf.setFontSize(negrita ? 12 : 10);
        pdf.text(etiqueta, margen, y);
        pdf.text(valor, anchoPagina - margen, y, {
          align: "right",
        });
        y += 8;
      };

      escribirTotal("Subtotal:", formatPrice(factura.subtotal));
      escribirTotal(
        "Envio:",
        factura.shipping === 0
          ? "GRATIS"
          : formatPrice(factura.shipping)
      );

      pdf.setDrawColor(210, 20, 150);
      pdf.line(margen, y - 2, anchoPagina - margen, y - 2);
      y += 5;

      escribirTotal("TOTAL:", formatPrice(factura.total), true);
      y += 3;

      // PAGO Y PIE
      escribir(`Metodo de pago: ${factura.metodoPago}`);
      escribir(
        factura.metodoPago === "Contraentrega"
          ? "Estado: Pedido registrado. Pago pendiente de entrega."
          : "Estado: Pago simulado aprobado."
      );

      comprobarEspacio(22);
      y += 5;
      pdf.setDrawColor(210, 20, 150);
      pdf.line(margen, y, anchoPagina - margen, y);
      y += 8;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(
        "Gracias por comprar en GAPSYSTEM S.A.S.",
        anchoPagina / 2,
        y,
        { align: "center" }
      );

      y += 6;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text(
        "Conserva esta factura como comprobante de tu compra.",
        anchoPagina / 2,
        y,
        { align: "center" }
      );

      pdf.save(`Factura_GAPSYSTEM_${factura.pedido_id}.pdf`);
    } catch (error) {
      console.error("Error al generar la factura PDF:", error);
      alert("No se pudo generar el PDF. Intenta nuevamente.");
    }
  };

  // VALIDAR PAGO SIMULADO
  const validarPago = () => {
    if (formData.metodoPago === "Tarjeta") {
      const numero = paymentData.numeroTarjeta.replace(/\s/g, "");

      if (
        !numero ||
        !paymentData.nombreTarjeta ||
        !paymentData.vencimiento ||
        !paymentData.cvv ||
        !paymentData.pin
      ) {
        alert("Completa todos los datos ficticios de la tarjeta.");
        return false;
      }

      if (!/^\d{16}$/.test(numero)) {
        alert("El número de tarjeta de prueba debe tener 16 dígitos.");
        return false;
      }

      if (!/^\d{3}$/.test(paymentData.cvv)) {
        alert("El CVV de prueba debe tener 3 dígitos.");
        return false;
      }

      if (!/^\d{4}$/.test(paymentData.pin)) {
        alert("El PIN de prueba debe tener 4 dígitos.");
        return false;
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.vencimiento)) {
        alert("Usa el formato MM/YY para el vencimiento de prueba.");
        return false;
      }
    }

    if (formData.metodoPago === "Nequi") {
      if (!paymentData.telefonoNequi || !paymentData.codigoNequi) {
        alert("Completa los datos ficticios de Nequi.");
        return false;
      }

      if (!/^\d{10}$/.test(paymentData.telefonoNequi)) {
        alert("El celular de prueba debe tener 10 dígitos.");
        return false;
      }
    }

    if (formData.metodoPago === "PSE") {
      if (
        !paymentData.bancoPSE ||
        !paymentData.tipoPersonaPSE ||
        !paymentData.documentoPSE
      ) {
        alert("Completa todos los datos ficticios de PSE.");
        return false;
      }
    }

    return true;
  };

  // PROCESAR COMPRA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nombre.trim() ||
      !formData.telefono.trim() ||
      !formData.direccion.trim() ||
      !formData.ciudad.trim() ||
      !formData.metodoPago
    ) {
      alert("Completa todos los datos de envío y selecciona un método de pago.");
      return;
    }

    if (!cliente?.id) {
      alert("No se encontró la información del cliente.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Tu carrito está vacío.");
      navigate("/cart");
      return;
    }

    if (!validarPago()) return;

    setProcesando(true);

    try {
      setEstadoPago("Validando información de pago...");
      await new Promise((resolve) => setTimeout(resolve, 700));

      setEstadoPago("Procesando compra...");
      await new Promise((resolve) => setTimeout(resolve, 700));

      const response = await fetch(
        "http://localhost/gapsystem/gapsystem/backend/registrar_pedido.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cliente_id: cliente.id,
            nombre: formData.nombre,
            telefono: formData.telefono,
            direccion: formData.direccion,
            ciudad: formData.ciudad,
            metodo_pago: formData.metodoPago,
            total,
            productos: cartItems,
          }),
        }
      );

      const textoRespuesta = await response.text();

      let data: {
        success?: boolean;
        pedido_id?: number | string;
        message?: string;
      };

      try {
        data = JSON.parse(textoRespuesta);
      } catch {
        console.error("Respuesta recibida del servidor:", textoRespuesta);
        throw new Error(
          "El servidor PHP no devolvió JSON válido. Revisa registrar_pedido.php."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "No se pudo registrar el pedido."
        );
      }

      const pedidoId = Number(data.pedido_id);

      if (!Number.isFinite(pedidoId) || pedidoId <= 0) {
        throw new Error(
          "El servidor no devolvió un número de pedido válido."
        );
      }

      setEstadoPago("Pedido registrado correctamente.");

      const nuevaFactura: Factura = {
        pedido_id: pedidoId,
        fecha: new Date().toLocaleString("es-CO"),
        nombre: formData.nombre,
        telefono: formData.telefono,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        metodoPago: formData.metodoPago,
        subtotal,
        shipping,
        total,
        productos: cartItems,
      };

      localStorage.setItem(
        "gapsystem_factura",
        JSON.stringify(nuevaFactura)
      );

      localStorage.removeItem("gapsystem_cart");

      setFactura(nuevaFactura);
      setCompraRealizada(true);
    } catch (error) {
      console.error("Error al registrar el pedido:", error);

      alert(
        error instanceof Error
          ? error.message
          : "No fue posible registrar el pedido. Verifica que Apache y MySQL estén funcionando."
      );

      setEstadoPago("");
    } finally {
      setProcesando(false);
    }
  };

  // PANTALLA DE FACTURA
  if (compraRealizada && factura) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="text-center mb-8 no-print">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />

            <h1 className="text-3xl font-bold mb-2">
              ¡Compra realizada correctamente!
            </h1>

            <p className="text-muted-foreground">
              Tu pedido fue registrado correctamente.
            </p>

            <p className="mt-2 font-semibold">
              Número de pedido: #{factura.pedido_id}
            </p>
          </div>

          <div
            id="factura"
            className="bg-white text-black border border-gray-300 rounded-lg p-8 shadow-sm"
          >
            <div className="flex justify-between items-start border-b pb-6 mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  GAPSYSTEM S.A.S.
                </h2>
                <p className="text-gray-600">Factura de compra</p>
              </div>

              <div className="text-right">
                <p className="font-semibold">FACTURA</p>
                <p>#{factura.pedido_id}</p>
                <p className="text-sm text-gray-600">
                  {factura.fecha}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold mb-3">Datos del cliente</h3>
              <p><strong>Nombre:</strong> {factura.nombre}</p>
              <p><strong>Teléfono:</strong> {factura.telefono}</p>
              <p><strong>Dirección:</strong> {factura.direccion}</p>
              <p><strong>Ciudad:</strong> {factura.ciudad}</p>
            </div>

            <div className="mb-8">
              <h3 className="font-bold mb-3">Productos</h3>

              <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-4 bg-gray-100 p-3 font-semibold text-sm">
                  <span className="col-span-2">Producto</span>
                  <span>Cant.</span>
                  <span>Precio</span>
                </div>

                {factura.productos.map((item) => (
                  <div
                    key={item.product.id}
                    className="grid grid-cols-4 p-3 border-t text-sm"
                  >
                    <span className="col-span-2">
                      {item.product.name}
                    </span>
                    <span>{item.quantity}</span>
                    <span>
                      {formatPrice(
                        item.product.price * item.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(factura.subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>
                    {factura.shipping === 0
                      ? "GRATIS"
                      : formatPrice(factura.shipping)}
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(factura.total)}</span>
                </div>
              </div>
            </div>

            <div className="border-t mt-8 pt-6">
              <p>
                <strong>Método de pago:</strong>{" "}
                {factura.metodoPago}
              </p>

              <p className="text-green-700">
                <strong>Estado:</strong>{" "}
                {factura.metodoPago === "Contraentrega"
                  ? "Pedido registrado; pago pendiente de entrega"
                  : "Pago simulado aprobado"}
              </p>
            </div>

            <div className="text-center mt-8 pt-6 border-t">
              <p className="font-semibold">
                Gracias por comprar en GAPSYSTEM S.A.S.
              </p>
              <p className="text-sm text-gray-600">
                Conserva esta factura como comprobante de tu compra.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 no-print">
            <button
              type="button"
              onClick={descargarFactura}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-md font-semibold hover:opacity-90"
            >
              <Download className="w-5 h-5" />
              Descargar factura PDF
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-3 rounded-md border border-border font-semibold hover:bg-muted"
            >
              Ir a mi perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // USUARIO NO LOGUEADO
  if (!cliente) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">
            Debes iniciar sesión
          </h1>
          <p className="text-muted-foreground mb-6">
            Para realizar una compra necesitas tener una cuenta e iniciar sesión.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 rounded-md bg-accent text-accent-foreground font-medium"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  // CARRITO VACÍO
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-semibold mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-muted-foreground mb-6">
            Agrega productos al carrito antes de continuar con la compra.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 rounded-md bg-accent text-accent-foreground font-medium"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  // CHECKOUT
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al carrito
        </Link>

        <h1 className="text-3xl font-semibold mb-2">
          Finalizar compra
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Completa tus datos para realizar la compra.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* DATOS DE ENVÍO */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">
                    Datos de envío
                  </h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Tu nombre completo"
                        className="w-full border border-border rounded-md pl-10 pr-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <input
                        type="tel"
                        name="telefono"
                        required
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="Ej: 3001234567"
                        className="w-full border border-border rounded-md pl-10 pr-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      required
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Ej: Calle 10 # 20-30"
                      className="w-full border border-border rounded-md px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="ciudad"
                      required
                      value={formData.ciudad}
                      onChange={handleChange}
                      placeholder="Ej: Bogotá"
                      className="w-full border border-border rounded-md px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              {/* MÉTODO DE PAGO */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">
                    Método de pago
                  </h2>
                </div>

                <select
                  name="metodoPago"
                  required
                  value={formData.metodoPago}
                  onChange={handleChange}
                  className="w-full border border-border rounded-md px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Selecciona un método de pago</option>
                  <option value="Tarjeta">💳 Tarjeta de crédito / débito</option>
                  <option value="Nequi">📱 Nequi</option>
                  <option value="PSE">🏦 PSE</option>
                  <option value="Contraentrega">💵 Contraentrega</option>
                </select>

                {/* TARJETA */}
                {formData.metodoPago === "Tarjeta" && (
                  <div className="mt-6 border border-border rounded-lg p-5 bg-background">
                    <div className="flex items-center gap-3 mb-5">
                      <CreditCard className="w-5 h-5 text-accent" />
                      <div>
                        <h3 className="font-semibold">Datos de tarjeta</h3>
                        <p className="text-xs text-muted-foreground">
                          Usa únicamente datos ficticios para esta simulación.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Número de tarjeta de prueba
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          name="numeroTarjeta"
                          value={paymentData.numeroTarjeta}
                          onChange={handlePaymentChange}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          autoComplete="off"
                          className="w-full border border-border rounded-md px-4 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nombre del titular
                        </label>
                        <input
                          type="text"
                          name="nombreTarjeta"
                          value={paymentData.nombreTarjeta}
                          onChange={handlePaymentChange}
                          placeholder="NOMBRE DE PRUEBA"
                          autoComplete="off"
                          className="w-full border border-border rounded-md px-4 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Vencimiento
                          </label>
                          <input
                            type="text"
                            name="vencimiento"
                            value={paymentData.vencimiento}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            autoComplete="off"
                            className="w-full border border-border rounded-md px-4 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            CVV ficticio
                          </label>
                          <input
                            type="password"
                            inputMode="numeric"
                            name="cvv"
                            value={paymentData.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            maxLength={3}
                            autoComplete="off"
                            className="w-full border border-border rounded-md px-4 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            PIN ficticio
                          </label>
                          <input
                            type="password"
                            inputMode="numeric"
                            name="pin"
                            value={paymentData.pin}
                            onChange={handlePaymentChange}
                            placeholder="1234"
                            maxLength={4}
                            autoComplete="off"
                            className="w-full border border-border rounded-md px-4 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2">
                        <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>
                          Simulación académica. No uses datos bancarios reales.
                          Estos datos no se guardan ni se envían al servidor.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* NEQUI */}
                {formData.metodoPago === "Nequi" && (
                  <div className="mt-6 border border-border rounded-lg p-5 bg-background">
                    <div className="flex items-center gap-3 mb-5">
                      <Smartphone className="w-5 h-5 text-accent" />
                      <div>
                        <h3 className="font-semibold">Pago con Nequi</h3>
                        <p className="text-xs text-muted-foreground">
                          Datos ficticios para simular el proceso.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Número de celular de prueba
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          name="telefonoNequi"
                          value={paymentData.telefonoNequi}
                          onChange={handlePaymentChange}
                          placeholder="Ej: 3001234567"
                          maxLength={10}
                          autoComplete="off"
                          className="w-full border border-border rounded-md px-4 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Código ficticio de confirmación
                        </label>
                        <input
                          type="password"
                          inputMode="numeric"
                          name="codigoNequi"
                          value={paymentData.codigoNequi}
                          onChange={handlePaymentChange}
                          placeholder="Ej: 123456"
                          maxLength={6}
                          autoComplete="off"
                          className="w-full border border-border rounded-md px-4 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2">
                        <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>
                          Simulación académica. No introduzcas tu PIN,
                          contraseña ni datos reales de Nequi.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PSE */}
                {formData.metodoPago === "PSE" && (
                  <div className="mt-6 border border-border rounded-lg p-5 bg-background">
                    <div className="flex items-center gap-3 mb-5">
                      <Building2 className="w-5 h-5 text-accent" />
                      <div>
                        <h3 className="font-semibold">Pago mediante PSE</h3>
                        <p className="text-xs text-muted-foreground">
                          Selecciona un banco para la simulación.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Selecciona tu banco
                        </label>
                        <select
                          name="bancoPSE"
                          value={paymentData.bancoPSE}
                          onChange={handlePaymentChange}
                          className="w-full border border-border rounded-md px-4 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          <option value="">Selecciona un banco</option>
                          <option value="Bancolombia">Bancolombia</option>
                          <option value="Banco de Bogotá">Banco de Bogotá</option>
                          <option value="Davivienda">Davivienda</option>
                          <option value="BBVA">BBVA</option>
                          <option value="Banco de Occidente">Banco de Occidente</option>
                          <option value="Scotiabank Colpatria">Scotiabank Colpatria</option>
                          <option value="Banco Popular">Banco Popular</option>
                          <option value="Banco AV Villas">Banco AV Villas</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Tipo de persona
                        </label>
                        <select
                          name="tipoPersonaPSE"
                          value={paymentData.tipoPersonaPSE}
                          onChange={handlePaymentChange}
                          className="w-full border border-border rounded-md px-4 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          <option value="">Selecciona una opción</option>
                          <option value="Persona Natural">Persona Natural</option>
                          <option value="Persona Jurídica">Persona Jurídica</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Identificación ficticia
                        </label>
                        <input
                          type="text"
                          name="documentoPSE"
                          value={paymentData.documentoPSE}
                          onChange={handlePaymentChange}
                          placeholder="Documento de prueba"
                          autoComplete="off"
                          className="w-full border border-border rounded-md px-4 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2">
                        <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>
                          Simulación académica. No se conecta con el portal
                          bancario de PSE.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTRAENTREGA */}
                {formData.metodoPago === "Contraentrega" && (
                  <div className="mt-6 border border-border rounded-lg p-5 bg-background">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-6 h-6 text-accent" />
                      <div>
                        <h3 className="font-semibold">Pago contraentrega</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Realizarás el pago cuando recibas tu pedido.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.metodoPago && (
                  <p className="text-xs text-muted-foreground mt-4">
                    Este proyecto utiliza un entorno de simulación.
                    No se procesan pagos reales.
                  </p>
                )}
              </div>
            </div>

            {/* RESUMEN */}
            <div>
              <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-6">
                  Resumen del pedido
                </h2>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md border border-border"
                      />

                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold mt-1">
                          {formatPrice(
                            item.product.price * item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Envío</span>
                      <span>
                        {shipping === 0 ? "GRATIS" : formatPrice(shipping)}
                      </span>
                    </div>

                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-xl font-bold">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {procesando && (
                  <div className="mt-5 rounded-md border border-border bg-background p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      <div>
                        <p className="font-medium text-sm">{estadoPago}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Por favor espera...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={procesando}
                  className="w-full mt-6 bg-accent text-accent-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {procesando ? "Procesando compra..." : "Confirmar y pagar"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
