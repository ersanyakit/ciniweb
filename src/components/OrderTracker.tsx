import { useState, FormEvent } from "react";
import { Search, MapPin, Truck, Calendar, Package, ClipboardCheck, PlayCircle, Loader } from "lucide-react";
import { Order } from "../types";
import { motion } from "motion/react";

interface OrderTrackerProps {
  orders: Order[];
  onAdvanceOrderStatus: (orderId: string) => void;
  theme?: string;
}

export default function OrderTracker({ orders, onAdvanceOrderStatus, theme = "light" }: OrderTrackerProps) {
  const [searchCode, setSearchCode] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setSearchedOrder(null);

    if (!searchCode.trim()) {
      setSearchError("Lütfen bir sipariş takip kodu giriniz.");
      return;
    }

    const found = orders.find(
      (o) => o.trackingCode.toLowerCase() === searchCode.trim().toLowerCase() || o.id === searchCode.trim()
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchError("Aradığınız takip koduna ait aktif bir sipariş bulunamadı. Örnek: 'TR-101' veya 'TR-102' deneyin.");
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Alındı":
        return theme === "gece"
          ? "text-blue-400 bg-blue-950/40 border-blue-800"
          : "text-blue-600 bg-blue-50 border-blue-200";
      case "Çizimde":
        return theme === "gece"
          ? "text-purple-400 bg-purple-950/40 border-purple-800"
          : "text-purple-600 bg-purple-50 border-purple-200";
      case "Boyanıyor":
        return theme === "gece"
          ? "text-amber-400 bg-amber-950/40 border-amber-800"
          : "text-amber-600 bg-amber-50 border-amber-200";
      case "Fırınlanıyor":
        return theme === "gece"
          ? "text-red-400 bg-red-950/40 border-red-800"
          : "text-red-600 bg-red-50 border-red-200";
      case "Kargoda":
        return theme === "gece"
          ? "text-orange-400 bg-orange-950/40 border-orange-800"
          : "text-orange-600 bg-orange-50 border-orange-200";
      case "Teslim Edildi":
        return theme === "gece"
          ? "text-emerald-400 bg-emerald-950/40 border-emerald-800"
          : "text-emerald-600 bg-emerald-50 border-emerald-200";
      default:
        return theme === "gece"
          ? "text-slate-400 bg-slate-900/40 border-slate-800"
          : "text-stone-600 bg-stone-50 border-stone-200";
    }
  };

  const displayOrderDetails = (order: Order) => {
    return (
      <div className={`rounded-2xl border p-6 shadow-md mt-6 ${
        theme === "gece"
          ? "bg-[#112946] border-sini-turquoise/20 text-white"
          : "bg-white/85 border-sini-navy/15 text-stone-800"
      }`}>
        {/* Order Header */}
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-2 ${
          theme === "gece" ? "border-sini-turquoise/15" : "border-sini-navy/10"
        }`}>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === "gece" ? "text-slate-400" : "text-stone-400"}`}>Takip Numarası</span>
            <h4 className={`font-mono text-base font-bold flex items-center gap-1.5 ${theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"}`}>
              {order.trackingCode}
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </h4>
          </div>
          <div className="text-left md:text-right">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === "gece" ? "text-slate-400" : "text-stone-400"}`}>Sipariş Tarihi</span>
            <p className={`text-xs font-semibold flex items-center md:justify-end gap-1 mt-0.5 ${theme === "gece" ? "text-slate-200" : "text-stone-800"}`}>
              <Calendar className={`h-3.5 w-3.5 ${theme === "gece" ? "text-slate-400" : "text-stone-400"}`} /> {order.date}
            </p>
          </div>
        </div>

        {/* Traditional Manufacturing & Delivery Timeline */}
        <div className="my-8">
          <h5 className={`font-serif text-sm font-bold mb-6 flex items-center gap-1.5 ${theme === "gece" ? "text-white" : "text-sini-navy"}`}>
            <Loader className="h-4 w-4 text-sini-turquoise animate-spin" />
            Eserin Fırın ve Yolculuk Serüveni
          </h5>

          {/* Progress Timeline */}
          <div className="relative">
            {/* Background Line */}
            <div className={`absolute top-0 bottom-0 left-4 w-0.5 md:left-1/2 md:-ml-0.25 ${theme === "gece" ? "bg-sini-turquoise/15" : "bg-sini-navy/10"}`} />

            <div className="space-y-8">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Timeline bullet */}
                  <div
                    className={`absolute left-2.5 md:left-1/2 md:-ml-3.5 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all z-10 ${
                      event.completed
                        ? theme === "gece"
                          ? "bg-sini-turquoise border-sini-turquoise text-[#003153]"
                          : "bg-sini-navy border-sini-navy text-sini-turquoise"
                        : theme === "gece"
                          ? "bg-slate-900 border-sini-turquoise/20 text-slate-500"
                          : "bg-sini-cream border-sini-navy/20 text-stone-400"
                    }`}
                  >
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  </div>

                  {/* Left Block (Displays on desktop left, or aligned on mobile) */}
                  <div className="ml-10 md:ml-0 md:w-[45%] md:text-right">
                    {idx % 2 === 0 && (
                      <div>
                        <h6 className={`text-xs font-bold ${
                          event.completed 
                            ? theme === "gece" ? "text-sini-turquoise" : "text-sini-navy" 
                            : theme === "gece" ? "text-slate-500" : "text-stone-400"
                        }`}>
                          {event.title}
                        </h6>
                        <p className={`text-[11px] mt-0.5 leading-normal ${theme === "gece" ? "text-slate-300" : "text-stone-500"}`}>{event.description}</p>
                        {event.date && <span className={`text-[9px] font-mono block mt-1 ${theme === "gece" ? "text-slate-400" : "text-stone-400"}`}>{event.date}</span>}
                      </div>
                    )}
                  </div>

                  {/* Right Block (Displays on desktop right, or aligned on mobile) */}
                  <div className="ml-10 md:ml-0 md:w-[45%] md:text-left">
                    {idx % 2 !== 0 && (
                      <div>
                        <h6 className={`text-xs font-bold ${
                          event.completed 
                            ? theme === "gece" ? "text-sini-turquoise" : "text-sini-navy" 
                            : theme === "gece" ? "text-slate-500" : "text-stone-400"
                        }`}>
                          {event.title}
                        </h6>
                        <p className={`text-[11px] mt-0.5 leading-normal ${theme === "gece" ? "text-slate-300" : "text-stone-500"}`}>{event.description}</p>
                        {event.date && <span className={`text-[9px] font-mono block mt-1 ${theme === "gece" ? "text-slate-400" : "text-stone-400"}`}>{event.date}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advance Timeline Simulator */}
        <div className={`p-4 rounded-xl border mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
          theme === "gece"
            ? "bg-sini-turquoise/10 border-sini-turquoise/30"
            : "bg-sini-turquoise/5 border-sini-turquoise/30"
        }`}>
          <div className="flex items-start space-x-2.5">
            <PlayCircle className="h-5 w-5 text-sini-turquoise flex-shrink-0 mt-0.5" />
            <div>
              <p className={`text-xs font-bold ${theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"}`}>Aşama Simülatörü</p>
              <p className={`text-[10px] leading-normal ${theme === "gece" ? "text-slate-300" : "text-stone-500"}`}>
                Siparişinizi fırınlama, sırlama, kargolama adımlarından bir sonrakine atlatarak çini teslimat simülasyonunu test edebilirsiniz.
              </p>
            </div>
          </div>
          <motion.button
            onClick={() => {
              onAdvanceOrderStatus(order.id);
              // Trigger a local state refresh for searched order
              const found = orders.find((o) => o.id === order.id);
              if (found) setSearchedOrder(found);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer ${
              theme === "gece"
                ? "bg-sini-turquoise text-[#003153] hover:bg-sini-turquoise/80 hover:text-white"
                : "bg-sini-navy text-sini-turquoise hover:bg-sini-navy/90 hover:text-white"
            }`}
          >
            Aşamayı İlerlet »
          </motion.button>
        </div>

        {/* Order Details & Delivery Summary */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-5 mt-6 ${
          theme === "gece" ? "border-sini-turquoise/15" : "border-sini-navy/10"
        }`}>
          {/* Shipping Address */}
          <div>
            <h5 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
              theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"
            }`}>
              <MapPin className="h-4 w-4 text-sini-turquoise" />
              Gönderi Adresi
            </h5>
            <div className={`text-xs space-y-1 ${theme === "gece" ? "text-slate-300" : "text-stone-600"}`}>
              <p className={`font-bold ${theme === "gece" ? "text-white" : "text-stone-800"}`}>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.addressLine}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.zipCode}
              </p>
            </div>
          </div>

          {/* Cart items list in the order */}
          <div>
            <h5 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
              theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"
            }`}>
              <Package className="h-4 w-4 text-sini-turquoise" />
              Sipariş İçeriği
            </h5>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className={`truncate max-w-[200px] ${theme === "gece" ? "text-slate-300" : "text-stone-600"}`}>
                    {item.product.name} <span className={`font-medium ${theme === "gece" ? "text-slate-400" : "text-stone-400"}`}>x{item.quantity}</span>
                  </span>
                  <span className={`font-semibold ${theme === "gece" ? "text-white" : "text-stone-800"}`}>
                    ₺{(item.product.price * item.quantity).toLocaleString("tr-TR")}
                  </span>
                </div>
              ))}
              <div className={`border-t border-dashed pt-2 flex justify-between items-center text-xs ${
                theme === "gece" ? "border-sini-turquoise/15" : "border-sini-navy/10"
              }`}>
                <span className={`font-bold ${theme === "gece" ? "text-slate-300" : "text-sini-navy"}`}>Toplam Tutar (KDV Dahil):</span>
                <span className={`font-extrabold text-base ${theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"}`}>
                  ₺{order.total.toLocaleString("tr-TR")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Header Card */}
      <div className="rounded-2xl border border-sini-turquoise/20 bg-sini-navy p-6 text-white shadow-md mb-8">
        <h3 className="font-serif text-xl font-bold text-sini-turquoise mb-2">Hızlı Sipariş Takip Paneli</h3>
        <p className="text-xs text-sini-turquoise/85 mb-5 leading-relaxed">
          Sipariş verdiğiniz geleneksel çini eserinizin hangi aşamada olduğunu, boyama sıklığını, fırın durumunu ve kargo takip numaralarını anında sorgulayın.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-3.5 left-4 h-4 w-4 text-sini-turquoise/55" />
            <input
              type="text"
              placeholder="Takip kodunu yazın (Örn: TR-101)..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full rounded-xl border border-sini-turquoise/20 bg-stone-950/40 py-3 pr-4 pl-11 text-sm text-sini-cream placeholder-sini-turquoise/45 outline-none focus:border-sini-turquoise focus:ring-1 focus:ring-sini-turquoise"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-sini-turquoise text-sini-navy px-6 py-3 text-sm font-bold shadow-md hover:bg-sini-turquoise/90 transition-all cursor-pointer"
          >
            Siparişi Sorgula
          </motion.button>
        </form>

        {searchError && (
          <p className="text-xs text-red-300 font-semibold mt-3 flex items-center gap-1.5">
            ⚠️ {searchError}
          </p>
        )}
      </div>

      {/* Searched Order display */}
      {searchedOrder ? (
        displayOrderDetails(searchedOrder)
      ) : (
        /* Default List if logged in user has history */
        orders.length > 0 && (
          <div className="space-y-4">
            <h4 className={`font-serif text-sm font-bold mb-3 ${theme === "gece" ? "text-slate-200" : "text-sini-navy"}`}>Tüm Sipariş Geçmişiniz</h4>
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <motion.div
                   key={order.id}
                   onClick={() => setSearchedOrder(order)}
                   whileHover={{ scale: 1.015 }}
                   whileTap={{ scale: 0.985 }}
                   className={`rounded-xl border p-4 shadow-sm cursor-pointer transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
                     theme === "gece"
                       ? "border-sini-turquoise/20 bg-[#112946] text-white hover:border-sini-turquoise/60"
                       : "border-sini-navy/15 bg-white/80 text-stone-800 hover:border-sini-turquoise/60"
                   }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                      theme === "gece"
                        ? "bg-[#091727] border-sini-turquoise/15 text-sini-turquoise"
                        : "bg-sini-navy/5 border-sini-navy/10 text-sini-navy"
                    }`}>
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`text-xs font-mono font-bold ${theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"}`}>{order.trackingCode}</p>
                      <p className={`text-[10px] mt-0.5 ${theme === "gece" ? "text-slate-400" : "text-stone-500"}`}>
                        {order.items.length} Ürün • {order.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 ml-13 md:ml-0">
                    <div className="text-left md:text-right">
                      <p className={`text-xs font-extrabold ${theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"}`}>
                        ₺{order.total.toLocaleString("tr-TR")}
                      </p>
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[9px] font-bold mt-1 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
