import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { products } from "../data/products";

interface NavbarProps {
  cartCount?: number;
}

export function Navbar({ cartCount = 0 }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Sincronizar leyendo "cliente" del localStorage
  useEffect(() => {
    const verificarSesion = () => {
      const clienteGuardado = localStorage.getItem("cliente");
      if (clienteGuardado) {
        try {
          const datos = JSON.parse(clienteGuardado);
          if (datos && datos.nombre) {
            setCurrentUserName(datos.nombre);
          } else {
            setCurrentUserName(null);
          }
        } catch (e) {
          setCurrentUserName(null);
        }
      } else {
        setCurrentUserName(null);
      }
    };

    verificarSesion();

    window.addEventListener("storage", verificarSesion);
    return () => {
      window.removeEventListener("storage", verificarSesion);
    };
  }, []);

  const sugerencias = searchQuery.trim() === ""
    ? []
    : products.filter((prod: any) => {
        const query = searchQuery.toLowerCase();
        const name = prod.name?.toLowerCase() || "";
        const category = prod.category?.toLowerCase() || "";
        const brand = prod.brand?.toLowerCase() || "";
        return name.includes(query) || category.includes(query) || brand.includes(query);
      }).slice(0, 6);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
  };

  const handleSelectProduct = (productId: string | number) => {
    setShowDropdown(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-xl font-semibold hidden sm:block">
              <span className="font-normal">GAPSYSTEM</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div 
            ref={searchContainerRef}
            className="flex-1 max-w-2xl mx-4 sm:mx-8 relative"
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <button
                type="submit"
                aria-label="Buscar"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <input
                type="text"
                placeholder="Buscar Lenovo, ASUS, monitores, audio..."
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-white text-foreground border border-transparent focus:outline-none focus:ring-2 focus:ring-accent shadow-sm"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {showDropdown && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 text-foreground">
                {sugerencias.length > 0 ? (
                  <div className="py-2">
                    <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Resultados encontrados
                    </div>
                    {sugerencias.map((item: any) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectProduct(item.id)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b last:border-b-0 transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-gray-900">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            Categoría: {item.category}
                          </span>
                        </div>
                        {item.price && (
                          <span className="text-xs font-bold text-accent">
                            ${Number(item.price).toLocaleString("es-CO")}
                          </span>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2 text-xs text-primary font-medium bg-gray-50 hover:bg-gray-100 border-t"
                    >
                      Ver todos los resultados para "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No encontramos opciones para "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {currentUserName ? (
              <Link
                to="/user-dashboard"
                className="flex items-center space-x-1 sm:space-x-2 hover:text-accent transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block font-medium">{currentUserName}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 sm:space-x-2 hover:text-accent transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block">Login</span>
              </Link>
            )}

            <Link
              to="/cart"
              className="relative hover:text-accent transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button className="sm:hidden hover:text-accent transition-colors" aria-label="Menú">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="border-t border-white/10 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 h-10 text-sm">
            <Link to="/products?category=computadores" className="hover:text-accent transition-colors">
              Computadores
            </Link>
            <Link to="/products?category=monitores" className="hover:text-accent transition-colors">
              Monitores
            </Link>
            <Link to="/products?category=audio" className="hover:text-accent transition-colors">
              Audio
            </Link>
            <Link to="/products?category=accesorios" className="hover:text-accent transition-colors">
              Accesorios
            </Link>
            <Link to="/products?category=perifericos" className="hover:text-accent transition-colors">
              Periféricos
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}