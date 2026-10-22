import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { ProductCard } from "../components/ProductCard";
import { products, categories } from "../data/products";
import { useState } from "react";
import imagenGapsystem from "../../assets/GAPSYSTEM.jpeg";

export function Home() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  const featuredProducts = products.slice(0, 8);
  const recommendedProducts = products.slice(8);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} />

      {/* Sección principal */}
      <section className="relative bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                TECNOLOGÍA PARA TODOS EN UN SOLO LUGAR
              </h1>

              <p className="text-lg sm:text-xl text-white/90">
                Descubre computadores, monitores, audio y accesorios diseñados
                para acompañarte en cada momento.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center space-x-2 bg-accent text-accent-foreground px-8 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                <span>Comprar ahora</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Imagen principal de GAPSYSTEM */}
            <div className="relative h-64 sm:h-96">
              <img
                src={imagenGapsystem}
                alt="Tecnología GAPSYSTEM"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sección de categorías */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-foreground mb-8">
            Comprar por categoría
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-border"
              >
                <div className="text-4xl mb-3">{category.icon}</div>

                <h3 className="font-medium text-foreground mb-1">
                  {category.name}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {category.count.toLocaleString("es-CO")} productos
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold text-foreground">
              Productos destacados
            </h2>

            <Link
              to="/products"
              className="text-accent hover:text-accent/80 transition-colors flex items-center space-x-1"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sección recomendados */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-foreground mb-8">
            Recomendados para ti
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pie de página */}
      <footer className="bg-primary text-primary-foreground py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Información de GAPSYSTEM */}
            <div>
              <h3 className="font-semibold mb-4">
                Acerca de GAPSYSTEM
              </h3>

              <p className="text-sm text-white/70">
                Tu destino de confianza para adquirir productos tecnológicos,
                equipos electrónicos y accesorios de excelente calidad.
              </p>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h3 className="font-semibold mb-4">
                Enlaces rápidos
              </h3>

              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link
                    to="/products"
                    className="hover:text-white"
                  >
                    Productos
                  </Link>
                </li>

                <li>
                  <Link
                    to="/about"
                    className="hover:text-white"
                  >
                    Sobre nosotros
                  </Link>
                </li>

                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Servicio al cliente */}
            <div>
              <h3 className="font-semibold mb-4">
                Servicio al cliente
              </h3>

              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link
                    to="/helpdesk"
                    className="hover:text-white"
                  >
                    Mesa de ayuda
                  </Link>
                </li>

                <li>
                  <Link
                    to="/returns"
                    className="hover:text-white"
                  >
                    Devoluciones
                  </Link>
                </li>

                <li>
                  <Link
                    to="/shipping"
                    className="hover:text-white"
                  >
                    Información de envíos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Información adicional */}
            <div>
              <h3 className="font-semibold mb-4">
                Mantente informado
              </h3>

              <p className="text-sm text-white/70">
                Mantente conectado para conocer nuestras novedades,
                productos y ofertas.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/70">
            <p>
              &copy; 2026 GAPSYSTEM. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}