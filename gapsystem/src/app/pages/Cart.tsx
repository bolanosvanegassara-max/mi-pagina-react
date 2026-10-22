import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { products } from "../data/products";

interface CartItem {
  product: (typeof products)[0];
  quantity: number;
}

export function Cart() {
  const navigate = useNavigate();

  // Leer carrito guardado
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("gapsystem_cart");

    if (!savedCart) {
      return [];
    }

    try {
      return JSON.parse(savedCart);
    } catch {
      return [];
    }
  });

  // Guardar cambios del carrito
  useEffect(() => {
    localStorage.setItem(
      "gapsystem_cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // Aumentar cantidad
  const increaseQuantity = (productId: string) => {
    setCartItems((items) =>
      items.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // Disminuir cantidad
  const decreaseQuantity = (productId: string) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Eliminar producto
  const removeItem = (productId: string) => {
    setCartItems((items) =>
      items.filter(
        (item) => item.product.id !== productId
      )
    );
  };

  // Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Subtotal
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  // Envío
  const shipping =
    subtotal >= 200000 || subtotal === 0
      ? 0
      : 15000;

  // Total
  const total = subtotal + shipping;

  // Cantidad total de productos
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Formato de precios
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-CO")}`;
  };

  // Ir al checkout
  const handleCheckout = () => {
    const cliente = localStorage.getItem("cliente");

    if (!cliente) {
      alert(
        "Debes iniciar sesión para realizar una compra."
      );

      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    // Ir a la pantalla de checkout
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Volver a productos */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Continuar comprando
        </Link>

        {/* Título */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-8 h-8" />

          <h1 className="text-3xl font-semibold">
            Carrito de compras
          </h1>
        </div>

        {cartItems.length === 0 ? (

          /* CARRITO VACÍO */
          <div className="bg-card border border-border rounded-lg p-12 text-center">

            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />

            <h2 className="text-xl font-semibold mb-2">
              Tu carrito está vacío
            </h2>

            <p className="text-muted-foreground mb-6">
              Agrega algunos productos para continuar.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 rounded-md bg-accent text-accent-foreground font-medium hover:opacity-90"
            >
              Ver productos
            </Link>

          </div>

        ) : (

          /* CARRITO CON PRODUCTOS */
          <div className="grid lg:grid-cols-3 gap-8">

            {/* PRODUCTOS */}
            <div className="lg:col-span-2 space-y-4">

              {cartItems.map((item) => (

                <div
                  key={item.product.id}
                  className="bg-card border border-border rounded-lg p-5"
                >

                  <div className="flex gap-5">

                    {/* IMAGEN */}
                    <div className="w-28 h-28 rounded-md overflow-hidden bg-white border border-border flex-shrink-0">

                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />

                    </div>

                    {/* INFORMACIÓN */}
                    <div className="flex-1">

                      <div className="flex justify-between gap-4">

                        <div>

                          <h2 className="font-semibold text-lg">
                            {item.product.name}
                          </h2>

                          <p className="text-sm text-muted-foreground mt-1">
                            {item.product.brand}
                          </p>

                        </div>

                        {/* ELIMINAR */}
                        <button
                          onClick={() =>
                            removeItem(item.product.id)
                          }
                          className="text-red-500 hover:text-red-700"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                      </div>

                      {/* PRECIO */}
                      <p className="font-semibold text-lg mt-3">
                        {formatPrice(item.product.price)}
                      </p>

                      {/* CANTIDAD */}
                      <div className="flex items-center gap-3 mt-4">

                        <span className="text-sm text-muted-foreground">
                          Cantidad:
                        </span>

                        <div className="flex items-center border border-border rounded-md">

                          <button
                            onClick={() =>
                              decreaseQuantity(
                                item.product.id
                              )
                            }
                            className="p-2 hover:bg-muted"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="px-4 font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                item.product.id
                              )
                            }
                            className="p-2 hover:bg-muted"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                        </div>

                      </div>

                      {/* TOTAL PRODUCTO */}
                      <p className="text-sm text-muted-foreground mt-3">

                        Total del producto:{" "}

                        <span className="font-semibold text-foreground">
                          {formatPrice(
                            item.product.price *
                              item.quantity
                          )}
                        </span>

                      </p>

                    </div>

                  </div>

                </div>

              ))}

              {/* VACIAR CARRITO */}
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Vaciar carrito
              </button>

            </div>

            {/* RESUMEN */}
            <div>

              <div className="bg-card border border-border rounded-lg p-6 sticky top-6">

                <h2 className="text-xl font-semibold mb-6">
                  Resumen del pedido
                </h2>

                <div className="space-y-4">

                  {/* SUBTOTAL */}
                  <div className="flex justify-between">

                    <span className="text-muted-foreground">
                      Subtotal
                    </span>

                    <span className="font-medium">
                      {formatPrice(subtotal)}
                    </span>

                  </div>

                  {/* ENVÍO */}
                  <div className="flex justify-between">

                    <span className="text-muted-foreground">
                      Envío
                    </span>

                    <span className="font-medium">

                      {shipping === 0
                        ? "GRATIS"
                        : formatPrice(shipping)}

                    </span>

                  </div>

                  {/* TOTAL */}
                  <div className="border-t border-border pt-4">

                    <div className="flex justify-between items-center">

                      <span className="text-lg font-semibold">
                        Total
                      </span>

                      <span className="text-2xl font-bold">
                        {formatPrice(total)}
                      </span>

                    </div>

                  </div>

                </div>

                {/* CHECKOUT */}
                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-accent text-accent-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
                >
                  Continuar con la compra
                </button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Envío gratis en compras superiores a
                  $200.000 COP
                </p>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}