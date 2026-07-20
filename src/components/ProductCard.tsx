import { Star, Heart, ShoppingCart, Eye, Sparkles, Award } from "lucide-react";
import { Product } from "../types";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ProductCardProps {
  key?: string;
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
  onSelectProduct: (product: Product) => void;
  theme?: "gunduz" | "gece";
}

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  theme = "gunduz",
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 p-2.5 ${
        theme === "gece"
          ? "border-slate-800 bg-[#0d233a] hover:shadow-cyan-950/10 hover:border-sini-turquoise"
          : "border-stone-200/80 bg-white hover:shadow-xl hover:shadow-sini-navy/[0.03] hover:border-sini-turquoise/40"
      }`}
    >
      {/* Exquisite Double Frame Canvas */}
      <div className={`relative flex-1 flex flex-col rounded-xl border p-2.5 ${
        theme === "gece"
          ? "border-slate-700/40 bg-[#112946]/40"
          : "border-stone-100 bg-[#FAF9F5]/40"
      }`}>
        
        {/* Product Origin & Technique Badges - Styled like Wax Seals */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          <div className="flex items-center gap-1 rounded-md bg-[#00223a] border border-sini-turquoise/30 px-2.5 py-0.5 shadow-sm">
            <span className="h-1 w-1 rounded-full bg-sini-turquoise animate-pulse" />
            <span className="text-[9.5px] font-black tracking-widest uppercase text-sini-cream font-mono">
              {product.origin}
            </span>
          </div>
          <div className={`flex items-center gap-1 rounded-md border px-2 py-0.5 shadow-xs ${
            theme === "gece" ? "bg-[#112946] border-slate-700/80 text-slate-300" : "bg-white border-stone-200/70 text-stone-500"
          }`}>
            <span className="text-[8.5px] font-bold tracking-wider uppercase">
              {product.technique}
            </span>
          </div>
        </div>

        {/* Favorite Button with Golden Glow on hover */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          className={`absolute top-4 right-4 z-10 flex h-8.5 w-8.5 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition-all duration-300 cursor-pointer ${
            isFavorite 
              ? "bg-sini-red/10 text-sini-red border border-sini-red/20" 
              : theme === "gece"
              ? "bg-slate-900/95 text-slate-400 hover:text-sini-red hover:bg-slate-800 border border-slate-700/80"
              : "bg-white/90 text-stone-400 hover:text-sini-red hover:bg-white border border-stone-200/50"
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-transform duration-200 ${
              isFavorite ? "fill-current scale-105" : "scale-100"
            }`}
          />
        </motion.button>

        {/* Product Image Stage with Museum Framing */}
        <div 
          onClick={() => onSelectProduct(product)}
          className={`relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border ${
            theme === "gece" ? "bg-[#091727] border-slate-800/80" : "bg-[#FAF9F5] border-stone-200/40"
          }`}
        >
          {/* Subtle vignette layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/5 via-transparent to-transparent z-1" />
          
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
          />
          
          {/* Elegant Quick View Overlay */}
          <div className="absolute inset-0 z-2 bg-[#00223a]/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
            <motion.button 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={isHovered ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-1.5 rounded-xl border px-4.5 py-2 text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer ${
                theme === "gece"
                  ? "bg-sini-turquoise text-white border-sini-turquoise hover:bg-sini-turquoise/90"
                  : "bg-white text-sini-navy border-white hover:bg-[#FAF9F5]"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>İncele</span>
            </motion.button>
          </div>

          {/* Masterpiece Stamp */}
          <div className={`absolute bottom-2.5 right-2.5 z-2 backdrop-blur-xs px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-xs ${
            theme === "gece"
              ? "bg-[#0d233a]/90 border-slate-700/60 text-sini-cream"
              : "bg-white/90 border-stone-200/60 text-sini-navy"
          }`}>
            <Award className="h-2.5 w-2.5 text-sini-turquoise" />
            Sertifikalı
          </div>
        </div>

        {/* Product Info Block */}
        <div className="flex flex-1 flex-col pt-3.5 px-1.5 pb-1">
          {/* Motif Tags - Elegant small capsules */}
          <div className="mb-2.5 flex flex-wrap gap-1">
            {product.motif.map((m, idx) => (
              <span 
                key={idx} 
                className={`text-[9px] font-bold px-2 py-0.5 rounded-md font-mono border ${
                  theme === "gece"
                    ? "text-sini-turquoise bg-sini-turquoise/10 border-sini-turquoise/20"
                    : "text-sini-navy/60 bg-sini-navy/[0.03] border border-sini-navy/5"
                }`}
              >
                #{m}
              </span>
            ))}
          </div>

          {/* Title - Beautiful Serif Font */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className={`cursor-pointer font-serif text-sm font-black line-clamp-1 transition-colors leading-tight tracking-tight ${
              theme === "gece"
                ? "text-slate-100 hover:text-sini-turquoise"
                : "text-stone-800 hover:text-sini-turquoise"
            }`}
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className={`mt-1 text-[11px] font-medium line-clamp-2 leading-relaxed italic font-serif ${
            theme === "gece" ? "text-slate-400" : "text-stone-400"
          }`}>
            {product.description}
          </p>

          {/* Rating Block with elegant presentation */}
          <div className={`mt-3 flex items-center gap-1.5 p-1.5 rounded-lg border ${
            theme === "gece"
              ? "bg-slate-900/40 border-slate-800/80"
              : "bg-stone-50/70 border-stone-200/30"
          }`}>
            <div className="flex text-sini-turquoise">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-2.5 w-2.5 ${
                    idx < Math.floor(product.rating) ? "fill-current" : "text-stone-200"
                  }`}
                />
              ))}
            </div>
            <span className={`text-[10px] font-bold font-mono ${theme === "gece" ? "text-slate-300" : "text-stone-600"}`}>
              {product.rating.toFixed(1)}
            </span>
            <span className={`text-[9px] ${theme === "gece" ? "text-slate-400" : "text-stone-400"} font-medium`}>• ({product.reviewsCount} Sanatsever)</span>
          </div>

          {/* Price & Action Row */}
          <div className={`mt-4 pt-3 flex items-center justify-between border-t ${
            theme === "gece" ? "border-slate-800/80" : "border-stone-200/50"
          }`}>
            <div className="flex flex-col">
              <span className={`text-[8.5px] uppercase tracking-widest font-black ${theme === "gece" ? "text-slate-500" : "text-stone-400"}`}>Değeri</span>
              <span className={`text-[14.5px] font-black font-mono ${theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"}`}>
                ₺{product.price.toLocaleString("tr-TR")}
              </span>
            </div>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              disabled={product.stock === 0}
              whileHover={product.stock > 0 ? { scale: 1.04, y: -0.5 } : {}}
              whileTap={product.stock > 0 ? { scale: 0.96 } : {}}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-widest shadow-sm transition-all cursor-pointer ${
                product.stock === 0
                  ? "bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200/60"
                  : theme === "gece"
                  ? "bg-sini-turquoise text-white hover:bg-sini-turquoise/90 border border-sini-turquoise hover:shadow-md"
                  : "bg-sini-navy text-white hover:bg-[#00223a] border border-sini-navy hover:shadow-md"
              }`}
            >
              <ShoppingCart className={`h-3 w-3 ${product.stock === 0 ? "text-stone-400" : "text-sini-turquoise"}`} />
              <span>{product.stock === 0 ? "Tükendi" : "Sepete Al"}</span>
            </motion.button>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}
