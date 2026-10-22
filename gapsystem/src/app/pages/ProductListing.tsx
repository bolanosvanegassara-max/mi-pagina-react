import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { ProductCard } from "../components/ProductCard";
import { products, brands } from "../data/products";

const CATEGORY_LABELS: Record<string, string> = {
  computadores: "Computadores",
  monitores: "Monitores",
  audio: "Audio",
  accesorios: "Accesorios",
  perifericos: "Periféricos",
};

const SIDEBAR_CATEGORIES = [
  { id: "computadores", name: "Computadores" },
  { id: "monitores", name: "Monitores" },
  { id: "audio", name: "Audio" },
  { id: "accesorios", name: "Accesorios" },
  { id: "perifericos", name: "Periféricos" },
];

interface CartItem {
  product: (typeof products)[0];
  quantity: number;
}

export function ProductListing() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [cartCount, setCartCount] = useState(() => {
    const savedCart = localStorage.getItem("gapsystem_cart");

    if (!savedCart) {
      return 0;
    }

    try {
      const cart: CartItem[] = JSON.parse(savedCart);

      return cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
    } catch {
      return 0;
    }
  });

  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 3500000]);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );

  // AGREGAR PRODUCTO AL CARRITO
  const handleAddToCart = (product: (typeof products)[0]) => {
    const savedCart = localStorage.getItem("gapsystem_cart");

    let cart: CartItem[] = [];

    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch {
        cart = [];
      }
    }

    const existingItem = cart.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        product,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "gapsystem_cart",
      JSON.stringify(cart)
    );

    const newCount = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    setCartCount(newCount);

    alert(`${product.name} fue agregado al carrito.`);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    filtered = filtered.filter(
      (p) =>
        p.price >= priceRange[0] &&
        p.price <= priceRange[1]
    );

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) =>
        selectedBrands.includes(p.brand)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;

      default:
        break;
    }

    return filtered;
  }, [
    priceRange,
    selectedBrands,
    selectedCategories,
    sortBy,
  ]);

  const pageTitle = categoryParam
    ? CATEGORY_LABELS[categoryParam] ?? categoryParam
    : "Todos los productos";

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-foreground">
            {pageTitle}
          </h1>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 bg-card border border-border px-4 py-2 rounded-lg"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>

        <div className="flex gap-6">
          {/* SIDEBAR DE FILTROS */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-64 flex-shrink-0`}
          >
            <div className="bg-card rounded-lg p-6 space-y-6 sticky top-20 border border-border">
              <div className="flex items-center justify-between lg:hidden">
                <h2 className="font-semibold">
                  Filtros
                </h2>

                <button
                  onClick={() => setShowFilters(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CATEGORÍAS */}
              <div>
                <h3 className="font-semibold mb-3">
                  Categorías
                </h3>

                <div className="space-y-2">
                  {SIDEBAR_CATEGORIES.map(
                    ({ id, name }) => (
                      <label
                        key={id}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(
                            id
                          )}
                          onChange={() =>
                            toggleCategory(id)
                          }
                          className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                        />

                        <span className="text-sm">
                          {name}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* RANGO DE PRECIO */}
              <div>
                <h3 className="font-semibold mb-3">
                  Rango de precio
                </h3>

                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="3500000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        0,
                        parseInt(e.target.value),
                      ])
                    }
                    className="w-full accent-accent"
                  />

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>$0</span>

                    <span>
                      $
                      {priceRange[1].toLocaleString(
                        "es-CO"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* MARCAS */}
              <div>
                <h3 className="font-semibold mb-3">
                  Marcas
                </h3>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(
                          brand
                        )}
                        onChange={() =>
                          toggleBrand(brand)
                        }
                        className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                      />

                      <span className="text-sm">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* LIMPIAR FILTROS */}
              <button
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedCategories([]);
                  setPriceRange([0, 3500000]);
                }}
                className="w-full text-sm text-accent hover:text-accent/80 transition-colors"
              >
                Limpiar todos los filtros
              </button>
            </div>
          </aside>

          {/* PRODUCTOS */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedProducts.length} productos
                encontrados
              </p>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="featured">
                  Destacados
                </option>

                <option value="price-low">
                  Precio: menor a mayor
                </option>

                <option value="price-high">
                  Precio: mayor a menor
                </option>

                <option value="rating">
                  Mejor valorados
                </option>
              </select>
            </div>

            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() =>
                        handleAddToCart(product)
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  Sin productos
                </p>

                <p className="text-sm text-muted-foreground mt-2">
                  Intenta ajustar los filtros
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}