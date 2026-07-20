import { useState, useEffect, FormEvent } from "react";
import { CreditCard, MapPin, ShieldCheck, CheckCircle2, ShoppingBag, ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { CartItem, Order } from "../types";
import { motion } from "motion/react";

interface PaymentSystemProps {
  cart: CartItem[];
  cartTotal: number;
  userEmail: string;
  onPlaceOrder: (shippingAddress: any, cardLast4: string) => Order;
  onClearCart: () => void;
  onGoToTab: (tabId: string) => void;
}

export default function PaymentSystem({
  cart,
  cartTotal,
  userEmail,
  onPlaceOrder,
  onClearCart,
  onGoToTab,
}: PaymentSystemProps) {
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");

  // Shipping form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Payment form fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // System states
  const [isProcessing, setIsProcessing] = useState(false);
  const [show3DSecure, setShow3DSecure] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(120);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Formatting Card Number: xxxx xxxx xxxx xxxx
  const handleCardNumberChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 16);
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    setCardNumber(parts.join(" "));
  };

  // Formatting Expiry: MM/YY
  const handleExpiryChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  // OTP Countdown trigger
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (show3DSecure && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [show3DSecure, countdown]);

  const handleShippingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine || !city || !zipCode) return;
    setStep("payment");
  };

  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, "").length < 16 || !cardName || cardExpiry.length < 5 || cardCvv.length < 3) return;

    // Trigger simulated 3D Secure modal
    setCountdown(120);
    setOtpCode("");
    setOtpError(null);
    setShow3DSecure(true);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length === 6) {
      setShow3DSecure(false);
      setIsProcessing(true);

      // Simulate network request for credit card verification
      setTimeout(() => {
        const addressObj = { fullName, phone, addressLine, city, zipCode };
        const last4 = cardNumber.slice(-4);
        const order = onPlaceOrder(addressObj, last4);
        setPlacedOrder(order);
        onClearCart();
        setIsProcessing(false);
        setStep("success");
      }, 2000);
    } else {
      setOtpError("Lütfen bankanızdan gelen 6 haneli şifreyi eksiksiz girin.");
    }
  };

  if (cart.length === 0 && step !== "success") {
    return (
      <div className="mx-auto max-w-md text-center py-16 px-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-50 border border-stone-100 mb-4">
          <ShoppingBag className="h-6 w-6 text-stone-400" />
        </div>
        <h4 className="font-serif text-lg font-bold text-stone-700">Sepetiniz Boş</h4>
        <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
          Ödeme sayfasına geçebilmek için sepetinize en az bir adet benzersiz el yapımı çini eklemeniz gerekmektedir.
        </p>
        <button
          onClick={() => onGoToTab("catalog")}
          className="mt-5 rounded-lg bg-sini-navy px-4 py-2 text-xs font-bold text-sini-turquoise hover:bg-sini-navy/90 transition-all cursor-pointer"
        >
          Kataloğu İncele
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Wizard Step Indicator */}
      <div className="mb-8 flex items-center justify-center max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              step === "shipping" ? "bg-sini-navy text-sini-turquoise" : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {step === "shipping" ? "1" : "✓"}
          </div>
          <span className={`text-xs font-bold ${step === "shipping" ? "text-sini-navy" : "text-emerald-700"}`}>Adres</span>
        </div>
        <div className="flex-1 mx-4 h-[1px] bg-stone-200" />
        <div className="flex items-center space-x-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              step === "payment"
                ? "bg-sini-navy text-sini-turquoise"
                : step === "success"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-stone-100 text-stone-400"
            }`}
          >
            {step === "success" ? "✓" : "2"}
          </div>
          <span
            className={`text-xs font-bold ${
              step === "payment" ? "text-sini-navy" : step === "success" ? "text-emerald-700" : "text-stone-400"
            }`}
          >
            Ödeme
          </span>
        </div>
        <div className="flex-1 mx-4 h-[1px] bg-stone-200" />
        <div className="flex items-center space-x-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              step === "success" ? "bg-sini-navy text-sini-turquoise" : "bg-stone-100 text-stone-400"
            }`}
          >
            3
          </div>
          <span className={`text-xs font-bold ${step === "success" ? "text-sini-navy" : "text-stone-400"}`}>Onay</span>
        </div>
      </div>

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center h-[350px] space-y-3">
          <Loader2 className="h-10 w-10 text-sini-turquoise animate-spin" />
          <h4 className="font-serif text-lg font-bold text-sini-navy">Ödeme Güvenle İşleniyor</h4>
          <p className="text-xs text-stone-500 max-w-xs text-center leading-relaxed">
            SSL şifreli tünel üzerinden 3D Secure banka onayınız işleniyor. Lütfen tarayıcı pencerenizi kapatmayınız.
          </p>
        </div>
      ) : step === "shipping" ? (
        /* Shipping Details Step */
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-stone-200 bg-[#fdfbf7] p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-sini-navy mb-5 flex items-center gap-1.5">
                <MapPin className="h-5 w-5 text-sini-turquoise" /> Teslimat & Fatura Bilgileri
              </h3>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-sini-navy tracking-wider mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ahmet Yılmaz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-sini-turquoise focus:ring-1 focus:ring-sini-turquoise"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-sini-navy tracking-wider mb-1">
                      Telefon Numarası
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0555 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-sini-turquoise focus:ring-1 focus:ring-sini-turquoise"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-sini-navy tracking-wider mb-1">
                      Posta Kodu
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="34000"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-sini-turquoise focus:ring-1 focus:ring-sini-turquoise"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-sini-navy tracking-wider mb-1">
                    Açık Adres
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Mahalle, Cadde, Sokak, Kapı No, Daire..."
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-sini-turquoise focus:ring-1 focus:ring-sini-turquoise"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-sini-navy tracking-wider mb-1">
                    Şehir
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="İstanbul"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-sini-turquoise focus:ring-1 focus:ring-sini-turquoise"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="mt-2 flex w-full items-center justify-center space-x-1 rounded-xl bg-sini-navy py-3 text-sm font-bold text-sini-turquoise hover:bg-sini-navy/90 hover:text-white transition-all shadow-sm cursor-pointer"
                >
                  <span>Ödeme Aşamasına Geç</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </form>
            </div>
          </div>

          {/* Checkout Cart Summary Pane */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h4 className="font-serif text-sm font-bold text-sini-navy mb-4 pb-2 border-b border-stone-100">Sipariş Özeti</h4>
              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-12 w-12 rounded-lg object-cover border border-stone-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-800 truncate">{item.product.name}</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        Adet: {item.quantity} • {item.product.origin}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-stone-800">
                      ₺{(item.product.price * item.quantity).toLocaleString("tr-TR")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-stone-200 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Ara Toplam:</span>
                  <span>₺{cartTotal.toLocaleString("tr-TR")}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Kargo Ücreti:</span>
                  <span className="text-emerald-600 font-semibold">ÜCRETSİZ</span>
                </div>
                <div className="flex justify-between items-center text-xs text-stone-800 font-bold pt-2 border-t border-stone-100">
                  <span>Toplam Ödeme:</span>
                  <span className="text-lg text-sini-navy font-extrabold">₺{cartTotal.toLocaleString("tr-TR")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : step === "payment" ? (
        /* Credit Card Payment Step */
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Card Form & Visual card */}
          <div className="lg:col-span-7">
            {/* Graphical Styled Credit Card */}
            <div className="relative mx-auto mb-6 h-48 w-80 rounded-2xl bg-gradient-to-tr from-sini-navy to-sini-turquoise p-6 text-white shadow-lg border border-sini-turquoise/20 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-sini-cream/80">Nakkaş Çini Kartı</span>
                  <div className="h-7 w-10 bg-amber-200/20 rounded-md border border-amber-300/30 mt-1 flex items-center justify-center font-bold text-[10px]">CHIP</div>
                </div>
                <ShieldCheck className="h-8 w-8 text-sini-cream" />
              </div>

              <div>
                <p className="font-mono text-lg font-bold tracking-widest">{cardNumber || "•••• •••• •••• ••••"}</p>
              </div>

              <div className="flex justify-between items-end text-xs font-mono">
                <div>
                  <p className="text-[8px] uppercase text-sini-cream/60">Kart Sahibi</p>
                  <p className="truncate max-w-[150px] uppercase font-bold text-sini-cream">{cardName || "ADI SOYADI"}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[8px] uppercase text-sini-cream/60">S.K.T</p>
                    <p className="font-bold text-sini-cream">{cardExpiry || "AA/YY"}</p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase text-sini-cream/60">CVV</p>
                    <p className="font-bold text-sini-cream">{cardCvv || "•••"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-[#fdfbf7] p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-sini-navy mb-5 flex items-center gap-1.5">
                <CreditCard className="h-5 w-5 text-sini-turquoise" /> Kart ile Güvenli Ödeme
              </h3>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-sini-navy tracking-wider mb-1">
                    Kart Sahibi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Kart üzerindeki isim..."
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-sini-turquoise focus:ring-1 focus:ring-sini-turquoise"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-sini-navy tracking-wider mb-1">
                    Kart Numarası
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-white py-2.5 px-3 text-sm font-mono outline-none focus:border-sini-turquoise focus:ring-1 focus:ring-sini-turquoise"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-sini-navy tracking-wider mb-1">
                      Son Kullanma Tarihi
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="AA/YY"
                      value={cardExpiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white py-2.5 px-3 text-sm font-mono outline-none focus:border-sini-turquoise focus:ring-1 focus:ring-sini-turquoise"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-sini-navy tracking-wider mb-1">
                      Güvenlik Kodu (CVV)
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={3}
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-xl border border-stone-200 bg-white py-2.5 px-3 text-sm font-mono outline-none focus:border-sini-turquoise focus:ring-1 focus:ring-sini-turquoise"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 mt-2">
                  <motion.button
                    type="button"
                    onClick={() => setStep("shipping")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-xl border border-stone-300 py-3 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Adrese Dön</span>
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-[2] rounded-xl bg-sini-navy py-3 text-xs font-bold text-sini-turquoise shadow-md hover:bg-sini-navy/90 hover:text-white transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>₺{cartTotal.toLocaleString("tr-TR")} Öde</span>
                    <ShieldCheck className="h-4 w-4" />
                  </motion.button>
                </div>
              </form>
            </div>
          </div>

          {/* Right side checkout overview */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-stone-200 bg-[#fdfbf7] p-5 shadow-sm">
              <h4 className="font-serif text-sm font-bold text-sini-navy mb-3">Teslimat Adresi Detayı</h4>
              <div className="text-xs text-stone-600 space-y-1 bg-white p-3.5 rounded-xl border border-stone-100">
                <p className="font-bold text-stone-800">{fullName}</p>
                <p>{phone}</p>
                <p>{addressLine}</p>
                <p>{city}, {zipCode}</p>
              </div>

              <div className="mt-5 border-t border-stone-200/60 pt-4 text-[10px] text-stone-400 leading-normal flex items-start space-x-1.5">
                <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>
                  Tüm ödemeleriniz 256-bit SSL katmanıyla şifrelenir. Kart bilgileriniz PCI-DSS standartları gereği asla sunucularımızda saklanmaz.
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Payment Success Step */
        <div className="rounded-2xl border border-emerald-100 bg-[#f0fdf4]/55 p-8 text-center max-w-xl mx-auto shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-[scale-in_0.5s_ease_out]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-sini-navy mb-1">Ödeme Güvenle Alındı!</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            Eseriniz nakkaşhanede sıraya alındı! Geleneksel fırınlama ve el çizimi süreçleri anbean başlatıldı.
          </p>

          {placedOrder && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-inner max-w-md mx-auto mb-6">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Takip Kodunuz</span>
              <p className="font-mono text-xl font-black text-sini-navy tracking-wider select-all mt-0.5">
                {placedOrder.trackingCode}
              </p>
              <p className="text-[9px] text-stone-400 mt-1">
                (Kodu kopyalayarak 'Sipariş Takibi' tabından fırın durumunu simüle edebilirsiniz.)
              </p>

              <div className="border-t border-dashed border-stone-100 mt-4 pt-4 text-xs flex justify-between">
                <span className="text-stone-500 text-left">Alıcı:</span>
                <span className="font-bold text-stone-800 text-right">{placedOrder.shippingAddress.fullName}</span>
              </div>
              <div className="text-xs flex justify-between mt-1">
                <span className="text-stone-500 text-left">Kart Bilgisi:</span>
                <span className="font-mono text-stone-700 text-right">•••• •••• •••• {placedOrder.paymentCardLast4}</span>
              </div>
              <div className="text-xs flex justify-between mt-1 font-bold">
                <span className="text-stone-800 text-left">Toplam Çekim:</span>
                <span className="text-sini-navy text-right">₺{placedOrder.total.toLocaleString("tr-TR")}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 max-w-md mx-auto">
            <motion.button
              onClick={() => onGoToTab("catalog")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 rounded-xl border border-stone-300 bg-white py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-all cursor-pointer"
            >
              Alışverişe Devam Et
            </motion.button>
            <motion.button
              onClick={() => onGoToTab("orders")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 rounded-xl bg-sini-navy py-2.5 text-xs font-bold text-sini-turquoise hover:bg-sini-navy/90 hover:text-white transition-all shadow-md cursor-pointer"
            >
              Siparişi Takip Et »
            </motion.button>
          </div>
        </div>
      )}

      {/* 3D Secure SMS OTP simulated dialog */}
      {show3DSecure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl animate-[scale-in_0.3s_ease_out]">
            <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              <div>
                <h4 className="font-serif text-sm font-bold text-stone-800">3D Secure Doğrulaması</h4>
                <p className="text-[10px] text-stone-400">Banka Güvenlik Geçidi</p>
              </div>
            </div>

            <div className="my-5 space-y-3.5 text-center">
              <p className="text-xs text-stone-600">
                Nakkaş Çini Alışverişi için bankanızda kayıtlı cep telefonunuza gelen 6 haneli doğrulama şifresini yazın.
              </p>
              <div className="flex justify-between text-[11px] text-stone-400 bg-stone-50 p-2 rounded-lg border border-stone-100">
                <span>İşlem Tutarı: <strong>₺{cartTotal.toLocaleString("tr-TR")}</strong></span>
                <span>Kalan Süre: <strong>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}</strong></span>
              </div>

              <input
                type="text"
                maxLength={6}
                placeholder="6 Haneli SMS Kodu"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                className="text-center w-full tracking-widest rounded-xl border border-stone-200 bg-stone-50 py-3 text-lg font-mono font-bold text-sini-navy outline-none focus:border-sini-turquoise focus:bg-white focus:ring-1 focus:ring-sini-turquoise transition-all"
              />

              {otpError && (
                <p className="text-xs text-red-500 flex items-center gap-1.5 justify-center">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{otpError}</span>
                </p>
              )}
            </div>

            <div className="flex gap-2.5">
              <motion.button
                onClick={() => setShow3DSecure(false)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 rounded-xl border border-stone-300 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-all cursor-pointer"
              >
                İptal Et
              </motion.button>
              <motion.button
                onClick={handleVerifyOtp}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Kodu Onayla
              </motion.button>
            </div>
            <p className="text-[9px] text-stone-400 text-center mt-3">
              (Geliştirici Notu: Test için 6 haneli herhangi bir sayı yazıp Onayla tuşuna basabilirsiniz.)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
