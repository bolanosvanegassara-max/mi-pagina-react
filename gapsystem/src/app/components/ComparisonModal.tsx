import { X, Star } from "lucide-react";
import { Product } from "../data/products";

interface ComparisonModalProps {
  show: boolean;
  onClose: () => void;
  product: Product;
}

export function ComparisonModal({ show, onClose, product }: ComparisonModalProps) {
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-CO")}`;
  };

  if (!show) return null;

  // Get similar products for comparison
  const similarProducts = [product];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Product Comparison</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-center text-muted-foreground mb-4">
            Compare similar products to make the best choice
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProducts.map((product) => (
              <div key={product.id} className="border border-border rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover bg-muted"
                />
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold">{product.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <p className="text-lg font-bold">{formatPrice(product.price)}</p>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Features:</p>
                    <ul className="space-y-1">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start">
                          <span className="text-accent mr-1">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}