import { useState, FormEvent } from "react";
import { ArrowLeft, Calendar, CheckCircle2, ChevronRight, ClipboardCheck, MapPin, Package, PlayCircle, Search, Truck } from "lucide-react";
import { Order } from "../types";
import { motion } from "motion/react";

interface OrderTrackerProps {
  orders: Order[];
  onAdvanceOrderStatus: (orderId: string) => void;
  theme?: "gunduz" | "gece";
}

export default function OrderTracker({ orders, onAdvanceOrderStatus, theme = "gunduz" }: OrderTrackerProps) {
  const [searchCode, setSearchCode] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchedOrder = selectedOrderId
    ? orders.find((order) => order.id === selectedOrderId) ?? null
    : null;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setSelectedOrderId(null);

    const normalizedCode = searchCode.trim().toLocaleLowerCase("tr-TR");

    if (!normalizedCode) {
      setSearchError("Lütfen bir sipariş takip kodu giriniz.");
      return;
    }

    const found = orders.find(
      (order) =>
        order.trackingCode.toLocaleLowerCase("tr-TR") === normalizedCode ||
        order.id.toLocaleLowerCase("tr-TR") === normalizedCode
    );

    if (found) {
      setSelectedOrderId(found.id);
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
    const isDelivered = order.status === "Teslim Edildi";

    return (
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setSelectedOrderId(null)}
          className={`mb-3 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
            theme === "gece"
              ? "border-sini-turquoise/20 bg-[#112946] text-slate-200 hover:border-sini-turquoise/50 hover:text-white"
              : "border-sini-navy/15 bg-white/80 text-sini-navy hover:border-sini-turquoise/50"
          }`}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Sipariş listesine dön
        </button>

        <div className={`rounded-2xl border p-4 shadow-lg sm:p-6 ${
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
            <h4 className={`mt-1 flex flex-wrap items-center gap-1.5 font-mono text-base font-bold ${theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"}`}>
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
            <Truck className="h-4 w-4 text-sini-turquoise" />
            Eserin Fırın ve Yolculuk Serüveni
          </h5>

          {/* Progress Timeline */}
          <div className="relative">
            {/* Background Line */}
            <div className={`absolute top-0 bottom-0 left-[15px] w-0.5 md:left-1/2 md:-ml-0.25 ${theme === "gece" ? "bg-sini-turquoise/15" : "bg-sini-navy/10"}`} />

            <div className="space-y-6 sm:space-y-8">
              {order.timeline.map((event, idx) => (
                <div key={event.status} className="relative min-h-14 pl-11 md:grid md:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] md:items-center md:pl-0">
                  {/* Timeline bullet */}
                  <div
                    className={`absolute left-0.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all md:left-1/2 md:-ml-3.5 ${
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

                  <div className={`md:row-start-1 ${
                    idx % 2 === 0
                      ? "md:col-start-1 md:pr-4 md:text-right"
                      : "md:col-start-3 md:pl-4 md:text-left"
                  }`}>
                    <h6 className={`text-xs font-bold ${
                      event.completed
                        ? theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"
                        : theme === "gece" ? "text-slate-500" : "text-stone-400"
                    }`}>
                      {event.title}
                    </h6>
                    <p className={`mt-1 text-xs leading-relaxed ${theme === "gece" ? "text-slate-300" : "text-stone-600"}`}>{event.description}</p>
                    {event.date && <span className={`mt-1 block font-mono text-[10px] ${theme === "gece" ? "text-slate-400" : "text-stone-400"}`}>{event.date}</span>}
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
            {isDelivered ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500 mt-0.5" />
            ) : (
              <PlayCircle className="h-5 w-5 text-sini-turquoise flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-xs font-bold ${theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"}`}>
                {isDelivered ? "Teslimat Tamamlandı" : "Aşama Simülatörü"}
              </p>
              <p className={`text-[10px] leading-normal ${theme === "gece" ? "text-slate-300" : "text-stone-500"}`}>
                {isDelivered
                  ? "Eseriniz tüm atölye ve kargo aşamalarını tamamlayarak adresine ulaştı."
                  : "Siparişinizi fırınlama, sırlama ve kargolama adımlarından bir sonrakine ilerletebilirsiniz."}
              </p>
            </div>
          </div>
          <motion.button
            type="button"
            onClick={() => onAdvanceOrderStatus(order.id)}
            disabled={isDelivered}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
              theme === "gece"
                ? "bg-sini-turquoise text-[#003153] hover:bg-sini-turquoise/80 hover:text-white"
                : "bg-sini-navy text-sini-turquoise hover:bg-sini-navy/90 hover:text-white"
            }`}
          >
            {isDelivered ? "Süreç Tamamlandı" : "Aşamayı İlerlet »"}
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
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Header Card */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-sini-turquoise/35 bg-gradient-to-br from-sini-navy via-[#0b2945] to-[#061523] p-5 text-white shadow-xl sm:p-7">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-sini-turquoise/10 blur-3xl" />
        <div className="relative">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sini-turquoise/30 bg-sini-turquoise/10">
            <Truck className="h-4.5 w-4.5 text-sini-turquoise" />
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-200/80">TwoTales Atölyesi</span>
            <h3 className="font-serif text-xl font-black text-white">Sipariş Takibi</h3>
          </div>
        </div>
        <p className="mb-5 max-w-2xl text-sm leading-relaxed text-slate-200">
          Çini eserinizin desen, boyama, fırınlama ve kargo yolculuğunu takip kodunuzla anında görüntüleyin.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-3.5 left-4 h-4 w-4 text-sini-turquoise/55" />
            <input
              type="text"
              placeholder="Takip kodunu yazın (Örn: TR-101)..."
              value={searchCode}
              onChange={(e) => {
                setSearchCode(e.target.value);
                if (searchError) setSearchError(null);
              }}
              aria-label="Sipariş takip kodu"
              aria-describedby={searchError ? "tracking-search-error" : undefined}
              className="w-full rounded-xl border border-white/15 bg-[#041525]/75 py-3 pr-4 pl-11 text-sm text-white placeholder-slate-400 outline-none transition focus:border-sini-turquoise focus:ring-2 focus:ring-sini-turquoise/30"
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
          <p id="tracking-search-error" role="alert" className="mt-3 flex items-center gap-1.5 rounded-lg border border-red-300/20 bg-red-950/30 px-3 py-2 text-xs font-semibold text-red-200">
            ⚠️ {searchError}
          </p>
        )}
        </div>
      </div>

      {/* Searched Order display */}
      {searchedOrder ? (
        displayOrderDetails(searchedOrder)
      ) : (
        /* Default List if logged in user has history */
        orders.length > 0 ? (
          <div className="space-y-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className={`font-serif text-base font-bold ${theme === "gece" ? "text-slate-100" : "text-sini-navy"}`}>Sipariş Geçmişiniz</h4>
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                theme === "gece"
                  ? "border-sini-turquoise/20 bg-sini-turquoise/10 text-sini-turquoise"
                  : "border-sini-navy/10 bg-sini-navy/5 text-sini-navy"
              }`}>
                {orders.length} sipariş
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <motion.button
                   type="button"
                   key={order.id}
                   onClick={() => setSelectedOrderId(order.id)}
                   aria-label={`${order.trackingCode} numaralı siparişi görüntüle`}
                   whileHover={{ scale: 1.015 }}
                   whileTap={{ scale: 0.985 }}
                   className={`grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border p-4 text-left shadow-sm transition-all cursor-pointer ${
                     theme === "gece"
                       ? "border-sini-turquoise/20 bg-[#112946] text-white hover:border-sini-turquoise/60"
                       : "border-sini-navy/15 bg-white/80 text-stone-800 hover:border-sini-turquoise/60"
                   }`}
                >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                      theme === "gece"
                        ? "bg-[#091727] border-sini-turquoise/15 text-sini-turquoise"
                        : "bg-sini-navy/5 border-sini-navy/10 text-sini-navy"
                    }`}>
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-mono text-xs font-bold ${theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"}`}>{order.trackingCode}</p>
                      <p className={`mt-1 truncate text-[11px] ${theme === "gece" ? "text-slate-300" : "text-stone-600"}`}>
                        {order.items[0]?.product.name ?? "Çini eseri"}
                      </p>
                      <p className={`mt-0.5 text-[10px] ${theme === "gece" ? "text-slate-400" : "text-stone-500"}`}>
                        {order.items.length} ürün • {order.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className={`text-xs font-extrabold ${theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"}`}>
                        ₺{order.total.toLocaleString("tr-TR")}
                      </p>
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[9px] font-bold mt-1 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${theme === "gece" ? "text-slate-500" : "text-stone-400"}`} />
                    </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className={`rounded-2xl border border-dashed px-6 py-14 text-center ${
            theme === "gece"
              ? "border-sini-turquoise/20 bg-[#112946]/60 text-slate-300"
              : "border-sini-navy/15 bg-white/60 text-stone-500"
          }`}>
            <Package className="mx-auto mb-3 h-8 w-8 text-sini-turquoise" />
            <p className="text-sm font-bold">Henüz kayıtlı siparişiniz yok</p>
            <p className="mt-1 text-xs opacity-75">Yeni siparişleriniz burada listelenecek.</p>
          </div>
        )
      )}
    </div>
  );
}
