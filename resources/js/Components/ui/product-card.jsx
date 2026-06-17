import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const formatPrice = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

const getImageUrl = (path) => path ? (path.startsWith('http') || path.startsWith('/') ? path : `/storage/${path}`) : null;

const ProductCard = React.forwardRef(({ className, product, onClick, ...props }, ref) => {
  const discount = product.discount_percentage ? `-${product.discount_percentage}%` : null;
  const originalPrice = product.original_price;
  const unit = "per 1 Bulan";

  return (
    <motion.div
      ref={ref}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-xl cursor-pointer",
        className,
      )}
      whileHover={{ y: -4 }}
      onClick={() => onClick && onClick(product)}
      {...props}
    >
      {/* Top Image Section */}
      <div className="relative h-28 sm:h-40 w-full bg-slate-50 overflow-hidden flex-shrink-0">
        {product.image ? (
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
             <span className="text-2xl font-bold text-slate-300">TD</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full bg-red-500 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-white shadow-sm">
            {discount}
          </div>
        )}
      </div>

      {/* Body Section */}
      <div className="flex flex-grow flex-col p-3 sm:p-5 text-left">
        <h3 className="line-clamp-2 text-xs sm:text-base font-bold leading-tight text-slate-900 group-hover:text-blue-600">
          {product.name}
        </h3>
        <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm text-slate-500 line-clamp-2">
          {product.description || "Layanan premium terpercaya dengan garansi."}
        </p>



        <div className="mt-auto pt-3 sm:pt-4">
            {/* Price Row */}
            <div className="flex flex-col">
            <span className="text-sm sm:text-xl font-extrabold text-blue-600">
                {formatPrice(product.price)}
            </span>
            {originalPrice && (
                <div className="flex items-center gap-1 text-[9px] sm:text-xs text-slate-400">
                <span className="line-through">{formatPrice(originalPrice)}</span>
                <span>{unit}</span>
                </div>
            )}
            </div>

            {/* Checkout Button */}
            <button
            onClick={(e) => { e.stopPropagation(); onClick && onClick(product); }}
            className="mt-3 sm:mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]"
            >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" /> Checkout
            </button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

export { ProductCard };
