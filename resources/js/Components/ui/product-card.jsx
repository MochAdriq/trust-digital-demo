import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const formatPrice = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

const ProductCard = React.forwardRef(({ className, product, ...props }, ref) => {
  return (
    <button
      onClick={() => props.onClick && props.onClick(product)}
      className="block h-full w-full text-left focus:outline-none"
      type="button"
    >
      <motion.div
        ref={ref}
        className={cn(
          "group relative flex h-full w-full flex-col items-center justify-start overflow-hidden rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all duration-300 ease-in-out hover:border-blue-500 hover:shadow-md sm:p-6",
          className,
        )}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        {...props}
      >
        <div className="relative mb-3 flex h-24 w-full items-center justify-center rounded-xl bg-slate-50 p-2 sm:mb-4 sm:h-32 sm:p-4">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="text-sm font-bold text-slate-400">TD</span>
          )}
        </div>

        <div className="flex flex-grow flex-col items-center gap-1 sm:gap-2">
          <h3 className="line-clamp-2 text-xs font-bold leading-tight text-slate-900 group-hover:text-blue-600 sm:text-sm">
            {product.name}
          </h3>
          <p className="hidden text-xs text-slate-500 line-clamp-2 sm:block">
            {product.description || "Layanan premium terpercaya"}
          </p>
        </div>

        <div className="mt-3 flex w-full flex-col items-center gap-2 border-t border-slate-100 pt-2 sm:mt-4 sm:pt-3">
          <span className="text-sm font-extrabold text-blue-600 sm:text-lg">
            {formatPrice(product.price)}
          </span>
          {product.points_price && (
            <span className="text-xs font-bold text-slate-500">
              {product.points_price} poin
            </span>
          )}
        </div>
      </motion.div>
    </button>
  );
});

ProductCard.displayName = "ProductCard";

export { ProductCard };
