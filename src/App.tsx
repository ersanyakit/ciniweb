import { useState, useEffect } from "react";
import { PRODUCTS, INITIAL_ORDERS } from "./data";
import { Product, CartItem, Order, User, OrderTimelineEvent, Review } from "./types";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import AuthPortal from "./components/AuthPortal";
import OrderTracker from "./components/OrderTracker";
import PaymentSystem from "./components/PaymentSystem";
import ProductReviews from "./components/ProductReviews";
import heroBannerImage from "./assets/images/cini_hero_banner_1783463799205.jpg";
import { 
  Heart, ShoppingCart, Trash2, X, Share2, Eye, ShieldCheck, 
  Sparkles, Instagram, Award, Hourglass, HelpCircle, AlertCircle,
  Filter, SlidersHorizontal, Layers, MapPin, Paintbrush,
  Star, MessageSquare, Send, ChevronRight, Home, ArrowLeft
} from "lucide-react";
import { motion } from "motion/react";

const SEED_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "cini-plate-1",
    userName: "Nihan Kara",
    rating: 5,
    comment: "Hünkar lale motifleri inanılmaz canlı duruyor. Duvar tabağı olarak mükemmel bir asma aparatıyla geldi, salonumun havası değişti.",
    date: "14.05.2026"
  },
  {
    id: "rev-2",
    productId: "cini-plate-1",
    userName: "Mehmet Yılmaz",
    rating: 5,
    comment: "Çok kaliteli, kuvars hamurunun o kendine has çınlama sesi ve ağırlığı çok belirgin. İznik kalitesinde harika el işçiliği.",
    date: "22.05.2026"
  },
  {
    id: "rev-3",
    productId: "cini-vase-1",
    userName: "Selin Şen",
    rating: 5,
    comment: "Altın varak ve turkuaz sırı muazzam parlıyor. Özel ahşap sandıkta kırılma tehlikesi olmadan sapa sağlam ulaştı.",
    date: "01.06.2026"
  },
  {
    id: "rev-4",
    productId: "cini-tile-1",
    userName: "Ahmet Ak",
    rating: 4,
    comment: "Mutfak tezgah arası için 10 adet sipariş vermiştim. Rölyef (kabartma) yapısı ve simetrisi kusursuz. Kargo paketlemesi mükemmel.",
    date: "18.06.2026"
  },
  {
    id: "rev-5",
    productId: "cini-bowl-1",
    userName: "Zeynep Tunç",
    rating: 5,
    comment: "Helezon spiral çizgilerindeki incelik usta TwoTales sanatı olduğunu belli ediyor. Sunum kasesi olarak kullanmaya kıyamıyorum.",
    date: "25.06.2026"
  },
  {
    id: "rev-6",
    productId: "cini-vazo-2",
    userName: "Murat Güler",
    rating: 5,
    comment: "Kütahya çinisinin zerafeti rumi motiflerle buluşmuş. Çok asil bir parça, hediyelik olarak almıştım, kendime de sipariş vereceğim.",
    date: "02.07.2026"
  },
  {
    id: "rev-7",
    productId: "cini-plate-2",
    userName: "Buse Kaya",
    rating: 5,
    comment: "Selçuklu yıldızı sembolizmini çok iyi yansıtmış. Geometrik dengesi ve el boyaması ton geçişleri son derece pürüzsüz.",
    date: "04.07.2026"
  },
  {
    id: "rev-8",
    productId: "cini-tile-2",
    userName: "Caner Yıldız",
    rating: 5,
    comment: "Hayat ağacı figürlü harika bir çini pano oluşturduk. Sır altı kalitesi ömürlük, renklerin solmayacağını hissettiriyor.",
    date: "06.07.2026"
  }
];

const CURRENT_PRODUCT_IMAGES = new Map(
  PRODUCTS.map((product) => [product.id, product.image])
);

const refreshProductImage = (product: Product): Product => ({
  ...product,
  image: CURRENT_PRODUCT_IMAGES.get(product.id) ?? product.image,
});

const refreshOrderImages = (order: Order): Order => ({
  ...order,
  items: order.items.map((item) => ({
    ...item,
    product: refreshProductImage(item.product),
  })),
});

export default function App() {
  const [theme, setTheme] = useState<"gunduz" | "gece">(() => {
    const saved = localStorage.getItem("twotales-theme");
    return (saved === "gece" || saved === "gunduz") ? saved : "gunduz";
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "gunduz" ? "gece" : "gunduz";
      localStorage.setItem("twotales-theme", next);
      return next;
    });
  };

  const [activeTab, setActiveTab] = useState<string>("catalog");
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Search & Advanced Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("Tümü");
  const [selectedTechnique, setSelectedTechnique] = useState<string>("Tümü");
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  // Zoomed Product Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailQuantity, setDetailQuantity] = useState<number>(1);

  useEffect(() => {
    setDetailQuantity(1);
  }, [selectedProduct]);

  // Social Sharing alert state
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [sharedItemName, setSharedItemName] = useState("");

  // Premium Toast Notification State
  const [toasts, setToasts] = useState<{ id: string; message: string; subMessage?: string; type: "success" | "info" }[]>([]);

  const addToast = (message: string, subMessage?: string, type: "success" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, subMessage, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Safe navigation function that also resets active search filters to avoid getting stuck
  const handleNavigateToCatalog = () => {
    setActiveTab("catalog");
    setSearchQuery("");
    setSelectedCategory("Tümü");
    setSelectedOrigin("Tümü");
    setSelectedTechnique("Tümü");
    setMaxPrice(4000);
    setOnlyInStock(false);
  };

  // Initialize and Sync localStorage on Boot
  useEffect(() => {
    const savedCart = localStorage.getItem("cini_cart");
    if (savedCart) {
      const refreshedCart = (JSON.parse(savedCart) as CartItem[]).map((item) => ({
        ...item,
        product: refreshProductImage(item.product),
      }));
      setCart(refreshedCart);
      localStorage.setItem("cini_cart", JSON.stringify(refreshedCart));
    }

    const savedFavorites = localStorage.getItem("cini_favorites");
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

    const savedOrders = localStorage.getItem("cini_orders");
    if (savedOrders) {
      const refreshedOrders = (JSON.parse(savedOrders) as Order[]).map(refreshOrderImages);
      setOrders(refreshedOrders);
      localStorage.setItem("cini_orders", JSON.stringify(refreshedOrders));
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem("cini_orders", JSON.stringify(INITIAL_ORDERS));
    }

    const savedUser = localStorage.getItem("cini_current_user");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const savedProducts = localStorage.getItem("cini_products");
    if (savedProducts) {
      const refreshedProducts = (JSON.parse(savedProducts) as Product[]).map(refreshProductImage);
      setProducts(refreshedProducts);
      localStorage.setItem("cini_products", JSON.stringify(refreshedProducts));
    } else {
      setProducts(PRODUCTS);
      localStorage.setItem("cini_products", JSON.stringify(PRODUCTS));
    }

    const savedReviews = localStorage.getItem("cini_reviews");
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews(SEED_REVIEWS);
      localStorage.setItem("cini_reviews", JSON.stringify(SEED_REVIEWS));
    }
  }, []);

  // Sync state helpers
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cini_cart", JSON.stringify(newCart));
  };

  const toggleFavorite = (productId: string) => {
    const isAdding = !favorites.includes(productId);
    const newFavs = isAdding
      ? [...favorites, productId]
      : favorites.filter((id) => id !== productId);
    setFavorites(newFavs);
    localStorage.setItem("cini_favorites", JSON.stringify(newFavs));

    const product = products.find((p) => p.id === productId);
    if (product) {
      if (isAdding) {
        addToast(
          "Favorilerinize Eklendi! 💙",
          `"${product.name}" isimli eseri favori listenize eklediniz.`,
          "success"
        );
      } else {
        addToast(
          "Favorilerden Çıkarıldı",
          `"${product.name}" favorilerinizden kaldırıldı.`,
          "info"
        );
      }
    }
  };

  const handleAddReview = (productId: string, rating: number, comment: string, userName: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName,
      rating,
      comment,
      date: new Date().toLocaleDateString("tr-TR")
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem("cini_reviews", JSON.stringify(updatedReviews));

    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        const totalPoints = p.rating * p.reviewsCount;
        const newCount = p.reviewsCount + 1;
        const newAvg = (totalPoints + rating) / newCount;
        return {
          ...p,
          reviewsCount: newCount,
          rating: Number(newAvg.toFixed(1))
        };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem("cini_products", JSON.stringify(updatedProducts));

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => {
        if (!prev) return null;
        const totalPoints = prev.rating * prev.reviewsCount;
        const newCount = prev.reviewsCount + 1;
        const newAvg = (totalPoints + rating) / newCount;
        return {
          ...prev,
          reviewsCount: newCount,
          rating: Number(newAvg.toFixed(1))
        };
      });
    }

    addToast(
      "Yorumunuz Yayınlandı! ✍️",
      "Değerli görüşünüz TwoTales arşivine başarıyla kaydedildi.",
      "success"
    );
  };

  // Auth Callbacks
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("cini_current_user", JSON.stringify(user));
    // Redirect back to catalog
    handleNavigateToCatalog();
    addToast(
      "Giriş Başarılı! 👋",
      `Hoş geldiniz, Sn. ${user.fullName}. TwoTales portalı aktif.`,
      "success"
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("cini_current_user");
    handleNavigateToCatalog();
    addToast(
      "Çıkış Yapıldı",
      "Hesabınızdan güvenli bir şekilde çıkış yaptınız.",
      "info"
    );
  };

  // Cart Management
  const handleAddToCart = (product: Product, quantity = 1) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      updateCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        )
      );
    } else {
      updateCart([...cart, { product, quantity }]);
    }
    
    addToast(
      "Sepete Eklendi! 🛒",
      `"${product.name}" eseri alışveriş sepetinize eklendi.`,
      "success"
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    updateCart(cart.filter((item) => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    updateCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Advanced Filtering logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.motif.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "Tümü" || p.category === selectedCategory;
    const matchesOrigin = selectedOrigin === "Tümü" || p.origin === selectedOrigin;
    const matchesTechnique = selectedTechnique === "Tümü" || p.technique === selectedTechnique;
    const matchesPrice = p.price <= maxPrice;
    const matchesStock = !onlyInStock || p.stock > 0;

    return matchesSearch && matchesCategory && matchesOrigin && matchesTechnique && matchesPrice && matchesStock;
  });

  // Order Placement logic
  const handlePlaceOrder = (shippingAddress: any, cardLast4: string) => {
    const trackingNo = `TR-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userEmail: currentUser?.email || "misafir@example.com",
      items: [...cart],
      total: cartTotal,
      status: "Alındı",
      date: new Date().toLocaleDateString("tr-TR"),
      trackingCode: trackingNo,
      shippingAddress,
      paymentCardLast4: cardLast4,
      timeline: [
        { status: "order_placed", title: "Sipariş Alındı", description: "Sipariş TwoTales atölyesine başarıyla iletildi.", date: `${new Date().toLocaleDateString("tr-TR")} ${new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`, completed: true },
        { status: "pattern_design", title: "Desen Çizimi", description: "TwoTales ustaları tarafından çamur form üzerine motif eskizleniyor.", completed: false },
        { status: "hand_painting", title: "El Boyaması", description: "Doğal mineral pigmentlerle fırça çizimleri yapılacak.", completed: false },
        { status: "underglaze_firing", title: "Sır Altı Fırınlama", description: "Eser camı andıran şeffaf sırla kaplanıp fırınlanacak.", completed: false },
        { status: "shipped", title: "Yola Çıktı", description: "Eser özel ahşap sandıkla kargoya verilecek.", completed: false },
        { status: "delivered", title: "Teslim Edildi", description: "Eser adrese ulaştırılacak.", completed: false }
      ]
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("cini_orders", JSON.stringify(updatedOrders));
    return newOrder;
  };

  // Advance Order Status Timeline Simulator (Traditional Çini Lifecycle)
  const handleAdvanceOrderStatus = (orderId: string) => {
    const updated = orders.map((order) => {
      if (order.id !== orderId) return order;

      const nextStatusMap: Record<Order["status"], { next: Order["status"]; index: number }> = {
        "Alındı": { next: "Çizimde", index: 1 },
        "Çizimde": { next: "Boyanıyor", index: 2 },
        "Boyanıyor": { next: "Fırınlanıyor", index: 3 },
        "Fırınlanıyor": { next: "Kargoda", index: 4 },
        "Kargoda": { next: "Teslim Edildi", index: 5 },
        "Teslim Edildi": { next: "Teslim Edildi", index: 5 }
      };

      const stepInfo = nextStatusMap[order.status];
      if (!stepInfo) return order;

      const nextStatus = stepInfo.next;
      const nextIndex = stepInfo.index;

      const updatedTimeline = order.timeline.map((event, idx) => {
        if (idx <= nextIndex) {
          return {
            ...event,
            completed: true,
            date: event.date || `${new Date().toLocaleDateString("tr-TR")} ${new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`
          };
        }
        return event;
      });

      return {
        ...order,
        status: nextStatus,
        timeline: updatedTimeline
      };
    });

    setOrders(updated);
    localStorage.setItem("cini_orders", JSON.stringify(updated));
  };

  // Social Share Simulator
  const triggerShare = (itemName: string) => {
    setSharedItemName(itemName);
    setShowShareNotification(true);
    setTimeout(() => {
      setShowShareNotification(false);
    }, 4000);
  };

  // Dynamic counter helpers for filters (exquisite boutique feedback)
  const getCategoryCount = (cat: string) => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.motif.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesOrigin = selectedOrigin === "Tümü" || p.origin === selectedOrigin;
      const matchesTechnique = selectedTechnique === "Tümü" || p.technique === selectedTechnique;
      const matchesPrice = p.price <= maxPrice;
      const matchesStock = !onlyInStock || p.stock > 0;
      return matchesSearch && (cat === "Tümü" || p.category === cat) && matchesOrigin && matchesTechnique && matchesPrice && matchesStock;
    }).length;
  };

  const getOriginCount = (origin: string) => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.motif.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "Tümü" || p.category === selectedCategory;
      const matchesTechnique = selectedTechnique === "Tümü" || p.technique === selectedTechnique;
      const matchesPrice = p.price <= maxPrice;
      const matchesStock = !onlyInStock || p.stock > 0;
      return matchesSearch && matchesCategory && (origin === "Tümü" || p.origin === origin) && matchesTechnique && matchesPrice && matchesStock;
    }).length;
  };

  const getTechniqueCount = (tech: string) => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.motif.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "Tümü" || p.category === selectedCategory;
      const matchesOrigin = selectedOrigin === "Tümü" || p.origin === selectedOrigin;
      const matchesPrice = p.price <= maxPrice;
      const matchesStock = !onlyInStock || p.stock > 0;
      return matchesSearch && matchesCategory && matchesOrigin && (tech === "Tümü" || p.technique === tech) && matchesPrice && matchesStock;
    }).length;
  };

  return (
    <div className={`min-h-screen transition-all duration-500 flex flex-col font-sans ${
      theme === "gece" 
        ? "bg-[#051322] text-slate-100" 
        : "bg-[#fdfbf7] text-stone-800"
    }`}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedProduct(null);
          if (tab === "catalog") {
            handleNavigateToCatalog();
          } else {
            setActiveTab(tab);
          }
        }}
        cartCount={cartCount}
        favoritesCount={favorites.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Social media sharing toast notification */}
      {showShareNotification && (
        <div className="fixed top-20 right-4 z-50 rounded-2xl border border-emerald-100 bg-[#f0fdf4] p-4 shadow-lg flex items-center gap-3 animate-[slide-in_0.3s_ease_out]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Share2 className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-800">Bağlantı Kopyalandı!</p>
            <p className="text-[10px] text-stone-500">"{sharedItemName}" sosyal medyada paylaşılmaya hazır.</p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-grow">
        {selectedProduct ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in"
          >
            {/* Elegant Back Navigation & Breadcrumb */}
            <div className={`mb-6 flex flex-col md:flex-row md:items-center md:justify-between border rounded-2xl px-5 py-3.5 shadow-xs gap-4 ${
              theme === "gece" ? "bg-[#0d233a] border-slate-800" : "bg-[#fdfbf7] border-stone-200/80"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className={`group flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs self-start ${
                    theme === "gece"
                      ? "bg-[#112946] border-slate-700/80 hover:border-sini-turquoise text-slate-300 hover:text-white hover:bg-slate-800"
                      : "bg-white border border-stone-200 hover:border-sini-navy/30 hover:bg-stone-50 text-stone-600 hover:text-sini-navy"
                  }`}
                >
                  <ArrowLeft className={`h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 ${
                    theme === "gece" ? "text-slate-400 group-hover:text-white" : "text-stone-500 group-hover:text-sini-navy"
                  }`} />
                  <span>Koleksiyona Dön</span>
                </button>
                <div className="hidden sm:block h-4 w-[1px] bg-stone-200" />
                <div className="flex items-center space-x-1.5 text-[11px] text-stone-400 font-medium overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className={`flex items-center gap-1 transition-colors font-bold uppercase tracking-wider text-[10px] ${
                      theme === "gece" ? "text-slate-300 hover:text-sini-turquoise" : "text-stone-500 hover:text-sini-navy"
                    }`}
                  >
                    <Home className={`h-3.5 w-3.5 ${
                      theme === "gece" ? "text-slate-400 hover:text-sini-turquoise" : "text-stone-400 hover:text-sini-navy"
                    }`} />
                    <span>TwoTales</span>
                  </button>
                  <ChevronRight className="h-3 w-3 text-stone-300 flex-shrink-0" />
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className={`transition-colors font-semibold ${
                      theme === "gece" ? "text-slate-300 hover:text-sini-turquoise" : "text-stone-500 hover:text-sini-navy"
                    }`}
                  >
                    Koleksiyon
                  </button>
                  <ChevronRight className="h-3 w-3 text-stone-300 flex-shrink-0" />
                  <span className="text-stone-500 font-medium">
                    {selectedProduct.category}
                  </span>
                  <ChevronRight className="h-3 w-3 text-stone-300 flex-shrink-0" />
                  <span className={`font-bold max-w-[150px] sm:max-w-[200px] truncate ${
                    theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"
                  }`}>
                    {selectedProduct.name}
                  </span>
                </div>
              </div>

              {/* Museum status or piece registration on the right side */}
              <div className="hidden md:flex items-center space-x-2 text-[10px] uppercase tracking-wider font-bold text-sini-turquoise">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sini-turquoise opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sini-turquoise"></span>
                </span>
                <span>Kayıt No: TT-{selectedProduct.year}-{selectedProduct.id.slice(-3).toUpperCase()}</span>
              </div>
            </div>

            {/* Premium Two-Column Grid - Ultra-polished Museum Gallery Design */}
            <div className={`rounded-3xl border overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0 ${
              theme === "gece" ? "bg-[#0d233a] border-slate-800" : "bg-sini-cream border-stone-200/80"
            }`}>
              
              {/* Left Side: Exquisite Image Presentation */}
              <div className={`lg:col-span-6 relative flex flex-col justify-start border-r p-6 md:p-10 ${
                theme === "gece" ? "bg-[#0f2a4a]/45 border-slate-800" : "bg-gradient-to-b from-stone-100/50 to-stone-50/20 border-stone-200/60"
              }`}>
                {/* Gold/Bronze Art Frame Simulation */}
                <div className={`relative overflow-hidden rounded-2xl border-8 shadow-2xl aspect-square flex items-center justify-center group p-1.5 transition-all duration-300 ring-4 ${
                  theme === "gece" 
                    ? "bg-[#091727] border-slate-900 ring-sini-turquoise/10 hover:ring-sini-turquoise/30" 
                    : "bg-white border-sini-navy ring-sini-turquoise/20 hover:ring-sini-turquoise/40"
                }`}>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Antique style technique badges overlay */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className="rounded-md bg-stone-900/90 backdrop-blur-xs px-3 py-1 text-[9px] font-mono font-bold text-sini-turquoise uppercase tracking-widest shadow-lg border border-sini-turquoise/30">
                      {selectedProduct.origin}
                    </span>
                    <span className="rounded-md bg-sini-navy/95 backdrop-blur-xs px-3 py-1 text-[9px] font-mono font-bold text-sini-turquoise uppercase tracking-widest shadow-lg border border-sini-turquoise/30">
                      {selectedProduct.technique}
                    </span>
                  </div>

                  {/* TwoTales Seal/Mühür absolute badge overlay bottom-right */}
                  <div className="absolute bottom-4 right-4 transform rotate-12 transition-transform duration-300 group-hover:rotate-6">
                    <div className="bg-gradient-to-br from-sini-red to-red-850 text-sini-cream border-2 border-white rounded-full h-16 w-16 flex flex-col items-center justify-center text-center shadow-2xl p-1 select-none">
                      <span className="text-[6px] font-mono tracking-widest uppercase text-white font-black">ÖZGÜN</span>
                      <span className="text-[9px] font-serif font-black tracking-tighter leading-none my-0.5 text-sini-cream">TwoTales</span>
                      <span className="text-[6px] font-medium text-sini-cream/90">MÜHRÜ</span>
                    </div>
                  </div>
                </div>

                {/* Handcraft Trust Badges - Museum Standard */}
                <div className="mt-8 grid grid-cols-3 gap-3.5">
                  <div className={`p-3.5 rounded-2xl border text-center shadow-xs transition-all duration-300 hover:shadow-md hover:border-sini-turquoise/40 transform hover:-translate-y-0.5 ${
                    theme === "gece" ? "bg-[#112946]/90 border-slate-700/60" : "bg-white border-stone-200/80"
                  }`}>
                    <div className="h-9 w-9 rounded-xl bg-sini-turquoise/5 flex items-center justify-center mx-auto mb-2">
                      <Award className="h-5 w-5 text-sini-turquoise" />
                    </div>
                    <span className={`block text-[11px] font-extrabold leading-tight ${theme === "gece" ? "text-slate-100" : "text-stone-800"}`}>TwoTales Ustası</span>
                    <span className="block text-[9px] text-stone-400 mt-0.5">%100 El Emeği</span>
                  </div>
                  <div className={`p-3.5 rounded-2xl border text-center shadow-xs transition-all duration-300 hover:shadow-md hover:border-sini-turquoise/40 transform hover:-translate-y-0.5 ${
                    theme === "gece" ? "bg-[#112946]/90 border-slate-700/60" : "bg-white border-stone-200/80"
                  }`}>
                    <div className="h-9 w-9 rounded-xl bg-sini-turquoise/5 flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="h-5 w-5 text-sini-turquoise" />
                    </div>
                    <span className={`block text-[11px] font-extrabold leading-tight ${theme === "gece" ? "text-slate-100" : "text-stone-800"}`}>Kuvars Sır</span>
                    <span className="block text-[9px] text-stone-400 mt-0.5">Doğal Mineraller</span>
                  </div>
                  <div className={`p-3.5 rounded-2xl border text-center shadow-xs transition-all duration-300 hover:shadow-md hover:border-emerald-500/30 transform hover:-translate-y-0.5 ${
                    theme === "gece" ? "bg-[#112946]/90 border-slate-700/60" : "bg-white border-stone-200/80"
                  }`}>
                    <div className="h-9 w-9 rounded-xl bg-emerald-500/5 flex items-center justify-center mx-auto mb-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    </div>
                    <span className={`block text-[11px] font-extrabold leading-tight ${theme === "gece" ? "text-slate-100" : "text-stone-800"}`}>Güvenli Kargo</span>
                    <span className="block text-[9px] text-stone-400 mt-0.5">Sigortalı Sandık</span>
                  </div>
                </div>

                {/* Interactive Certificate of Authenticity Panel */}
                <div className={`mt-6 border-2 border-double rounded-2xl p-5 relative overflow-hidden ring-1 ring-offset-2 ${
                  theme === "gece" 
                    ? "bg-[#091727] border-slate-700/80 ring-slate-800 text-slate-100" 
                    : "bg-stone-50 border-sini-navy/30 ring-sini-navy/10 text-stone-800"
                }`}>
                  <div className="absolute -right-10 -bottom-10 opacity-[0.06] pointer-events-none">
                    <Award className="h-36 w-36 text-sini-navy" />
                  </div>
                  
                  {/* Fine vintage decorative corners */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-sini-navy/40" />
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-sini-navy/40" />
                  <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-sini-navy/40" />
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-sini-navy/40" />

                  <h4 className={`font-serif text-[11px] font-black tracking-widest uppercase mb-3 flex items-center justify-center gap-1.5 border-b pb-2 ${
                    theme === "gece" ? "text-sini-turquoise border-slate-800" : "text-sini-navy border-sini-navy/15"
                  }`}>
                    <Award className="h-4 w-4 text-sini-turquoise animate-pulse" />
                    Koleksiyon Orijinallik Belgesi
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10.5px]">
                    <div className="flex justify-between border-b border-stone-200/50 pb-1.5">
                      <span className="text-stone-400">Atölye Ref:</span>
                      <span className="font-mono text-stone-800 font-extrabold">CINI-{selectedProduct.id.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200/50 pb-1.5">
                      <span className="text-stone-400">Mineral Yapı:</span>
                      <span className="font-serif text-stone-800 font-bold">%80-85 Kuvars</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200/50 pb-1.5">
                      <span className="text-stone-400">Fırınlama:</span>
                      <span className="font-serif text-stone-800 font-bold">930°C - 1040°C</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200/50 pb-1.5">
                      <span className="text-stone-400">Sertifika:</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                        <ShieldCheck className="h-3 w-3 text-emerald-600 inline" /> Akredite
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-[9.5px] italic text-stone-600 leading-normal text-center bg-white/80 py-1.5 rounded-lg border border-stone-200/40">
                    "Bu sanat eseri, geleneksel İznik sır altı tekniğiyle tamamen elde biçimlendirilip boyanmıştır."
                  </div>
                </div>
              </div>

              {/* Right Side: Detailed Story & Actions */}
              <div className={`lg:col-span-6 p-6 md:p-10 flex flex-col justify-between transition-all duration-300 ${
                theme === "gece" ? "bg-[#0b1d30]" : "bg-white"
              }`}>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-sini-turquoise bg-sini-turquoise/5 border border-sini-turquoise/15 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        Eser Yılı: {selectedProduct.year}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                        theme === "gece" 
                          ? "text-sini-turquoise bg-sini-turquoise/10 border border-sini-turquoise/20" 
                          : "text-sini-navy bg-sini-navy/5 border border-sini-navy/10"
                      }`}>
                        {selectedProduct.category}
                      </span>
                    </div>
                    {/* Stock status badge */}
                    <span className={`text-[9.5px] px-3 py-0.5 rounded-full font-extrabold self-start ${
                      selectedProduct.stock > 0 
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}>
                      {selectedProduct.stock > 0 ? `Sınırlı Stok: ${selectedProduct.stock} Eser` : "Tükendi"}
                    </span>
                  </div>

                  <h3 className={`font-serif text-3xl md:text-4xl font-black leading-tight tracking-tight mb-4 ${
                    theme === "gece" ? "text-slate-100" : "text-sini-navy"
                  }`}>
                    {selectedProduct.name}
                  </h3>

                  {/* Motif Tags Showcase */}
                  <div className="mb-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest block mb-1.5 ${
                      theme === "gece" ? "text-slate-300" : "text-sini-navy/70"
                    }`}>Geleneksel Motifler</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.motif.map((m, idx) => (
                        <span 
                          key={idx} 
                          onClick={() => {
                            setSearchQuery(m);
                            setSelectedProduct(null);
                            setActiveTab("catalog");
                          }}
                          className={`border rounded-lg px-3 py-1 text-[11px] font-mono cursor-pointer transition-all font-semibold ${
                            theme === "gece"
                              ? "bg-slate-900/60 hover:bg-sini-turquoise/10 text-slate-300 hover:text-white border-slate-800 hover:border-sini-turquoise/30"
                              : "bg-stone-50 hover:bg-sini-turquoise/10 text-stone-700 hover:text-sini-navy border-stone-200 hover:border-sini-turquoise/30"
                          }`}
                        >
                          #{m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Story Description with Dropped Cap & Elegant Styling */}
                  <div className={`mb-6 border-l-4 border-sini-turquoise p-5 rounded-r-2xl shadow-xs relative overflow-hidden ${
                    theme === "gece" ? "bg-[#091727]" : "bg-sini-cream"
                  }`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(20,149,181,0.08),transparent)] pointer-events-none" />
                    <h4 className={`text-[11px] font-black mb-2.5 uppercase tracking-widest flex items-center gap-1.5 ${
                      theme === "gece" ? "text-sini-turquoise" : "text-sini-navy"
                    }`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-sini-turquoise animate-pulse" />
                      Sanatsal Öyküsü & Tarihçesi
                    </h4>
                    <p className={`text-xs leading-relaxed italic font-serif ${
                      theme === "gece" ? "text-slate-300" : "text-stone-700"
                    }`}>
                      <span className={`float-left text-2xl font-serif font-black text-white h-10 w-10 flex items-center justify-center rounded-xl shadow-xs mr-3 mt-1 select-none border ${
                        theme === "gece" ? "bg-[#112946] border-slate-800" : "bg-sini-navy border-sini-navy/10"
                      }`}>
                        {selectedProduct.description.charAt(0)}
                      </span>
                      {selectedProduct.description.slice(1)}
                    </p>
                  </div>

                  {/* Specifications Card with neat icons */}
                  <div className={`border rounded-2xl p-5 mb-6 ${
                    theme === "gece" ? "bg-[#091727] border-slate-800" : "bg-sini-cream/40 border-stone-200/80"
                  }`}>
                    <h4 className={`text-[11px] font-black mb-3.5 uppercase tracking-widest border-b pb-2 flex items-center gap-1.5 ${
                      theme === "gece" ? "text-sini-turquoise border-slate-800" : "text-sini-navy border-stone-200/40"
                    }`}>
                      <Paintbrush className="h-3.5 w-3.5 text-sini-turquoise" />
                      Yapısal Özellikler & İşçilik Detayları
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      {selectedProduct.details.map((detail, idx) => (
                        <li key={idx} className="text-xs flex items-start gap-2 leading-relaxed">
                          <span className="text-sini-turquoise font-extrabold text-[15px] leading-none mt-[-2px]">✧</span>
                          <span className={`font-semibold ${theme === "gece" ? "text-slate-200" : "text-stone-700"}`}>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Adet Seçimi ve Stok Bilgisi */}
                  {selectedProduct.stock > 0 && (
                    <div className={`flex items-center justify-between mb-6 p-4 rounded-xl border ${
                      theme === "gece" ? "border-slate-800 bg-[#091727]" : "border-stone-200/60 bg-sini-cream/25"
                    }`}>
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-black uppercase tracking-wider ${
                          theme === "gece" ? "text-slate-200" : "text-sini-navy"
                        }`}>
                          Koleksiyon Adedi
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium mt-0.5">
                          Mevcut Stok: {selectedProduct.stock} Adet
                        </span>
                      </div>
                      <div className={`flex items-center rounded-xl border p-1 shadow-xs ${
                        theme === "gece" ? "border-slate-800 bg-[#112946]" : "border-stone-200 bg-white"
                      }`}>
                        <button
                          type="button"
                          onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed font-extrabold ${
                            theme === "gece" ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-stone-500 hover:bg-stone-50 hover:text-sini-navy"
                          }`}
                          disabled={detailQuantity <= 1}
                        >
                          -
                        </button>
                        <span className={`w-12 text-center text-xs font-black font-mono ${
                          theme === "gece" ? "text-slate-100" : "text-stone-800"
                        }`}>
                          {detailQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDetailQuantity(Math.min(selectedProduct.stock, detailQuantity + 1))}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed font-extrabold ${
                            theme === "gece" ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-stone-500 hover:bg-stone-50 hover:text-sini-navy"
                          }`}
                          disabled={detailQuantity >= selectedProduct.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Pricing and Action row in Detail Page */}
                  <div className="bg-[#00223a] p-5 rounded-2xl border border-sini-navy flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,180,216,0.12),transparent)] pointer-events-none" />
                    <div className="relative z-10">
                      <span className="text-[10px] uppercase tracking-widest text-sini-turquoise font-black block">
                        {detailQuantity > 1 ? `Toplam Değer (${detailQuantity} Adet)` : "Koleksiyon Değeri"}
                      </span>
                      <span className="text-3xl font-black text-white font-mono tracking-tight">
                        ₺{(selectedProduct.price * detailQuantity).toLocaleString("tr-TR")}
                      </span>
                    </div>

                    <div className="flex gap-3 items-center w-full sm:w-auto relative z-10">
                      <motion.button
                        onClick={() => toggleFavorite(selectedProduct.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`rounded-xl border p-3.5 transition-all cursor-pointer shadow-sm ${
                          favorites.includes(selectedProduct.id)
                            ? "border-sini-red/40 text-sini-red bg-sini-red/25 hover:bg-sini-red/35"
                            : "border-white/10 bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white"
                        }`}
                        title="Favorilerime Ekle"
                      >
                        <Heart className={`h-5 w-5 ${favorites.includes(selectedProduct.id) ? "fill-current text-sini-red" : ""}`} />
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          handleAddToCart(selectedProduct, detailQuantity);
                        }}
                        disabled={selectedProduct.stock === 0}
                        whileHover={selectedProduct.stock > 0 ? { scale: 1.02 } : {}}
                        whileTap={selectedProduct.stock > 0 ? { scale: 0.98 } : {}}
                        className="flex-grow sm:flex-grow-0 rounded-xl bg-white text-sini-navy hover:bg-sini-cream hover:text-sini-navy px-8 py-3.5 text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-white/5 border border-white hover:border-sini-cream cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {selectedProduct.stock > 0 ? "Koleksiyona Ekle (Satın Al)" : "Stokta Yok"}
                      </motion.button>
                    </div>
                  </div>

                  {/* Product Reviews Section nested seamlessly */}
                  <ProductReviews
                    productId={selectedProduct.id}
                    reviews={reviews}
                    currentUser={currentUser}
                    onAddReview={handleAddReview}
                  />
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <>
            {activeTab === "catalog" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Elegant Hero Section */}
            <div className={`relative overflow-hidden py-16 border-b transition-all duration-500 ${
              theme === "gece" 
                ? "bg-[#091727] text-white border-slate-800" 
                : "bg-[#003153] text-white border-[#00b4d8]/20"
            }`}>
              <div className="absolute inset-0 opacity-25">
                <img
                  src={heroBannerImage}
                  alt="TwoTales Banner"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <span className="rounded-full bg-[#00b4d8]/20 border border-[#00b4d8]/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#00b4d8] inline-block mb-3 animate-[fade-in_1s]">
                  Saraydan Günümüze Kadim Sanat
                </span>
                <h2 className="font-serif text-3xl font-black tracking-tight text-[#fdfbf7] sm:text-5xl">
                  Ateşin Sır Altındaki <span className="text-[#00b4d8]">Mavi Şiiri</span>
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm text-[#00b4d8]/85 leading-relaxed">
                  Geleneksel saray sanatkarlarının ve lüks TwoTales atölyelerinin İznik ve Kütahya fırınlarında pişirdiği, geleneksel lale, karanfil ve rumi motiflerini %100 el işçiliği kuvarshane çamuruyla yarınlara aktarıyoruz.
                </p>
                
                {/* Visual highlights cards */}
                <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg mx-auto md:grid-cols-4 md:max-w-4xl text-left">
                  <div className="bg-slate-900/90 border border-sini-turquoise/40 p-4 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
                    <Award className="h-5 w-5 text-sini-turquoise mb-1.5" />
                    <h5 className="text-xs font-extrabold text-white uppercase tracking-wider">Orijinal Kuvars</h5>
                    <p className="text-[11px] text-slate-200 mt-1">Yüksek mukavemetli İznik çamuru.</p>
                  </div>
                  <div className="bg-slate-900/90 border border-sini-turquoise/40 p-4 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
                    <Instagram className="h-5 w-5 text-sini-turquoise mb-1.5" />
                    <h5 className="text-xs font-extrabold text-white uppercase tracking-wider">%100 El Çizimi</h5>
                    <p className="text-[11px] text-slate-200 mt-1">Benzersiz fırça darbeleri.</p>
                  </div>
                  <div className="bg-slate-900/90 border border-sini-turquoise/40 p-4 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
                    <Hourglass className="h-5 w-5 text-sini-turquoise mb-1.5" />
                    <h5 className="text-xs font-extrabold text-white uppercase tracking-wider">Çift Fırınlama</h5>
                    <p className="text-[11px] text-slate-200 mt-1">950 derecede sır altı dayanıklılık.</p>
                  </div>
                  <div className="bg-slate-900/90 border border-sini-turquoise/40 p-4 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
                    <ShieldCheck className="h-5 w-5 text-sini-turquoise mb-1.5" />
                    <h5 className="text-xs font-extrabold text-white uppercase tracking-wider">Güvenli Kargo</h5>
                    <p className="text-[11px] text-slate-200 mt-1">Özel ahşap ambalajlı gönderim.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog Grid with Filters */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                
                {/* Sidebar Filter Panel */}
                <div className="lg:col-span-3">
                  <div className={`lg:sticky lg:top-24 rounded-2xl border-2 border-double p-5.5 shadow-md relative overflow-hidden transition-all duration-300 ${
                    theme === "gece" 
                      ? "border-sini-turquoise/20 bg-[#091727] shadow-slate-900/50" 
                      : "border-sini-navy/20 bg-[#FCFAF7] shadow-stone-200/30"
                  }`}>
                    
                    {/* Vintage Corner Decors */}
                    <div className={`absolute top-1.5 left-1.5 w-2 h-2 border-t border-l ${theme === "gece" ? "border-sini-turquoise/30" : "border-sini-navy/20"}`} />
                    <div className={`absolute top-1.5 right-1.5 w-2 h-2 border-t border-r ${theme === "gece" ? "border-sini-turquoise/30" : "border-sini-navy/20"}`} />
                    <div className={`absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l ${theme === "gece" ? "border-sini-turquoise/30" : "border-sini-navy/20"}`} />
                    <div className={`absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r ${theme === "gece" ? "border-sini-turquoise/30" : "border-sini-navy/20"}`} />

                    {/* Exquisite Sidebar Header */}
                    <div className={`flex flex-col pb-3 border-b mb-5 text-center ${theme === "gece" ? "border-slate-800" : "border-sini-navy/10"}`}>
                      <span className="text-[9px] uppercase tracking-widest text-sini-turquoise font-bold">TwoTales Atölyesi</span>
                      <h4 className={`font-serif text-sm font-black uppercase tracking-wider flex items-center justify-center gap-1.5 mt-0.5 ${
                        theme === "gece" ? "text-slate-200" : "text-[#003153]"
                      }`}>
                        <Filter className="h-3.5 w-3.5 text-sini-turquoise animate-pulse" />
                        Seçkin Filtreler
                      </h4>
                    </div>

                    {/* In-Stock Only Boutique Toggler */}
                    <div className={`mb-5 flex items-center justify-between p-3 rounded-xl border shadow-xs transition-colors duration-300 ${
                      theme === "gece" ? "bg-[#112946] border-slate-800" : "bg-white border-stone-200/50"
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-sini-turquoise" />
                        <span className={`text-[10.5px] font-black uppercase tracking-wider ${
                          theme === "gece" ? "text-slate-200" : "text-[#003153]"
                        }`}>Yalnızca Stoktakiler</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOnlyInStock(!onlyInStock)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          onlyInStock ? "bg-sini-navy" : "bg-stone-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            onlyInStock ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Price Range with Elegant Serif Numbers */}
                    <div className={`mb-5 p-3.5 rounded-xl border shadow-xs transition-colors duration-300 ${
                      theme === "gece" ? "bg-[#112946] border-slate-800" : "bg-white border-stone-200/50"
                    }`}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <SlidersHorizontal className={`h-3.5 w-3.5 ${theme === "gece" ? "text-sini-turquoise" : "text-[#003153]/70"}`} />
                        <label className={`block text-[10.5px] font-black uppercase tracking-wider ${
                          theme === "gece" ? "text-slate-200" : "text-[#003153]"
                        }`}>
                          Eser Değer Aralığı
                        </label>
                      </div>
                      <div className="text-[11px] font-bold mb-2.5 flex justify-between items-center">
                        <span className="font-serif italic text-stone-400 text-[10px]">Tavan Değer:</span>
                        <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-black border ${
                          theme === "gece" 
                            ? "text-sini-turquoise bg-[#091727] border-sini-turquoise/20" 
                            : "text-[#003153] bg-sini-cream/50 border-sini-navy/10"
                        }`}>
                          ₺{maxPrice.toLocaleString("tr-TR")}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={400}
                        max={4000}
                        step={100}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className={`w-full cursor-pointer h-1.5 rounded-lg appearance-none border ${
                          theme === "gece" ? "accent-sini-turquoise bg-slate-900 border-slate-800" : "accent-[#003153] bg-stone-100 border-stone-200/30"
                        }`}
                      />
                      <div className="flex justify-between text-[9px] text-stone-400 font-bold font-mono mt-1.5">
                        <span>₺400</span>
                        <span>₺4,000</span>
                      </div>
                    </div>

                    {/* Category Selection with Dynamic Match Counters */}
                    <div className="mb-5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Layers className={`h-3.5 w-3.5 ${theme === "gece" ? "text-sini-turquoise" : "text-[#003153]/70"}`} />
                        <label className={`block text-[10.5px] font-black uppercase tracking-wider ${
                          theme === "gece" ? "text-slate-200" : "text-[#003153]"
                        }`}>
                          Çini Kategorisi
                        </label>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {["Tümü", "Tabak", "Vazo", "Karo", "Kase"].map((cat) => {
                          const isSelected = selectedCategory === cat;
                          const matchCount = getCategoryCount(cat);
                          return (
                            <motion.button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategory(cat)}
                              whileHover={{ x: 3 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full text-left rounded-xl px-3.5 py-2.5 text-xs transition-all cursor-pointer flex items-center justify-between border ${
                                isSelected
                                  ? "bg-sini-navy text-white border-sini-navy shadow-md font-bold pl-4 border-l-4 border-l-sini-turquoise"
                                  : theme === "gece"
                                    ? "bg-[#112946]/90 text-slate-300 hover:bg-[#153457] hover:text-white border-slate-800"
                                    : "bg-white text-stone-600 hover:bg-stone-50 hover:text-[#003153] border-stone-200/40"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isSelected && <span className="text-sini-turquoise font-extrabold text-[10px]">✦</span>}
                                <span className={isSelected ? "font-black uppercase tracking-wide text-[10.5px]" : "font-semibold"}>
                                  {cat === "Tümü" ? "Tüm Kategoriler" : cat}
                                </span>
                              </div>
                              <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                                isSelected 
                                  ? "bg-[#00223a] text-sini-turquoise border border-sini-turquoise/25" 
                                  : theme === "gece"
                                    ? "bg-[#091727] text-slate-400 border border-slate-800"
                                    : "bg-stone-100 text-stone-400 border border-stone-200/10"
                              }`}>
                                {matchCount}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Origin Selection with Dynamic Match Counters */}
                    <div className="mb-5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <MapPin className={`h-3.5 w-3.5 ${theme === "gece" ? "text-sini-turquoise" : "text-[#003153]/70"}`} />
                        <label className={`block text-[10.5px] font-black uppercase tracking-wider ${
                          theme === "gece" ? "text-slate-200" : "text-[#003153]"
                        }`}>
                          Atölye Yöresi
                        </label>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {["Tümü", "İznik", "Kütahya"].map((origin) => {
                          const isSelected = selectedOrigin === origin;
                          const matchCount = getOriginCount(origin);
                          return (
                            <motion.button
                              key={origin}
                              type="button"
                              onClick={() => setSelectedOrigin(origin)}
                              whileHover={{ x: 3 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full text-left rounded-xl px-3.5 py-2.5 text-xs transition-all cursor-pointer flex items-center justify-between border ${
                                isSelected
                                  ? "bg-sini-navy text-white border-sini-navy shadow-md font-bold pl-4 border-l-4 border-l-sini-turquoise"
                                  : theme === "gece"
                                    ? "bg-[#112946]/90 text-slate-300 hover:bg-[#153457] hover:text-white border-slate-800"
                                    : "bg-white text-stone-600 hover:bg-stone-50 hover:text-[#003153] border-stone-200/40"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isSelected && <span className="text-sini-turquoise font-extrabold text-[10px]">✦</span>}
                                <span className={isSelected ? "font-black uppercase tracking-wide text-[10.5px]" : "font-semibold"}>
                                  {origin === "Tümü" ? "Tüm Yöreler" : origin}
                                </span>
                              </div>
                              <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                                isSelected 
                                  ? "bg-[#00223a] text-sini-turquoise border border-sini-turquoise/25" 
                                  : theme === "gece"
                                    ? "bg-[#091727] text-slate-400 border border-slate-800"
                                    : "bg-stone-100 text-stone-400 border border-stone-200/10"
                              }`}>
                                {matchCount}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Technique Selection with Dynamic Match Counters */}
                    <div className="mb-6">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Paintbrush className={`h-3.5 w-3.5 ${theme === "gece" ? "text-sini-turquoise" : "text-[#003153]/70"}`} />
                        <label className={`block text-[10.5px] font-black uppercase tracking-wider ${
                          theme === "gece" ? "text-slate-200" : "text-[#003153]"
                        }`}>
                          Sırlama Metodu
                        </label>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {["Tümü", "Sır Altı", "Sır Üstü"].map((tech) => {
                          const isSelected = selectedTechnique === tech;
                          const matchCount = getTechniqueCount(tech);
                          return (
                            <motion.button
                              key={tech}
                              type="button"
                              onClick={() => setSelectedTechnique(tech)}
                              whileHover={{ x: 3 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full text-left rounded-xl px-3.5 py-2.5 text-xs transition-all cursor-pointer flex items-center justify-between border ${
                                isSelected
                                  ? "bg-sini-navy text-white border-sini-navy shadow-md font-bold pl-4 border-l-4 border-l-sini-turquoise"
                                  : theme === "gece"
                                    ? "bg-[#112946]/90 text-slate-300 hover:bg-[#153457] hover:text-white border-slate-800"
                                    : "bg-white text-stone-600 hover:bg-stone-50 hover:text-[#003153] border-stone-200/40"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isSelected && <span className="text-sini-turquoise font-extrabold text-[10px]">✦</span>}
                                <span className={isSelected ? "font-black uppercase tracking-wide text-[10.5px]" : "font-semibold"}>
                                  {tech === "Tümü" ? "Tüm Teknikler" : tech}
                                </span>
                              </div>
                              <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                                isSelected 
                                  ? "bg-[#00223a] text-sini-turquoise border border-sini-turquoise/25" 
                                  : theme === "gece"
                                    ? "bg-[#091727] text-slate-400 border border-slate-800"
                                    : "bg-stone-100 text-stone-400 border border-stone-200/10"
                              }`}>
                                {matchCount}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Clear Filters Button - Sleek styling */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedCategory("Tümü");
                        setSelectedOrigin("Tümü");
                        setSelectedTechnique("Tümü");
                        setMaxPrice(4000);
                        setSearchQuery("");
                        setOnlyInStock(false);
                      }}
                      className={`w-full mt-4 rounded-xl py-3.5 text-center text-[10.5px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-xs border ${
                        theme === "gece"
                          ? "bg-[#112946] border-slate-800 text-slate-300 hover:bg-sini-turquoise hover:text-white hover:border-sini-turquoise"
                          : "border-stone-350/50 bg-stone-50 hover:bg-sini-navy hover:text-white hover:border-sini-navy text-stone-500"
                      }`}
                    >
                      Filtreleri Temizle
                    </motion.button>
                  </div>
                </div>

                {/* Product List Grid */}
                <div className="lg:col-span-9">
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredProducts.map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          isFavorite={favorites.includes(p.id)}
                          onToggleFavorite={() => toggleFavorite(p.id)}
                          onAddToCart={() => handleAddToCart(p)}
                          onSelectProduct={setSelectedProduct}
                          theme={theme}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-stone-200 py-24 text-center">
                      <AlertCircle className="mx-auto h-10 w-10 text-stone-300 mb-2" />
                      <h4 className="font-serif text-base font-bold text-stone-600">Aradığınız Eser Bulunamadı</h4>
                      <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                        Filtre ayarlarınızı gevşeterek veya arama kelimenizi değiştirerek diğer el yapımı çini eserlerimizi listeleyebilirsiniz.
                      </p>
                    </div>
                  )}

                  {/* Traditional Social Media Integration block */}
                  <div className="mt-16 rounded-2xl border border-[#00b4d8]/30 bg-[#00b4d8]/5 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
                      <div>
                        <h4 className={`font-serif text-lg font-bold flex items-center gap-1.5 ${
                          theme === "gece" ? "text-slate-200" : "text-[#003153]"
                        }`}>
                          <Instagram className="h-5 w-5 text-[#00b4d8]" />
                          TwoTales Instagram Atölyesi
                        </h4>
                        <p className={`text-xs mt-0.5 ${theme === "gece" ? "text-slate-400" : "text-stone-500"}`}>
                          Ufuk açıcı çini modellerimizi paylaşın, tasarımlarınızı sosyal medyada sergileyin.
                        </p>
                      </div>
                      <button 
                        onClick={() => triggerShare("TwoTales E-Store")}
                        className="rounded-lg bg-[#003153] text-white px-4 py-2 text-xs font-bold hover:bg-[#00223a] transition-all flex items-center justify-center gap-1.5 self-start md:self-auto cursor-pointer"
                      >
                        <Share2 className="h-3.5 w-3.5" /> Mağazayı Paylaş
                      </button>
                    </div>

                    {/* Social gallery grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {[
                        { seed: "cini1", tag: "@ersanyakit", likes: 238, item: "İznik Lale Tabağı" },
                        { seed: "cini2", tag: "@twotales_art", likes: 184, item: "Firuze Çini Karo" },
                        { seed: "cini3", tag: "@traditional_tiles", likes: 312, item: "Gözyaşı Çini Vazo" },
                        { seed: "cini4", tag: "@iznik_fırın", likes: 145, item: "Haliç Kase" }
                      ].map((item, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-xl aspect-square bg-stone-100 border border-stone-200">
                           {/* We'll use simple fallback picsum image placeholders */}
                          <img
                            src={`https://picsum.photos/seed/${item.seed}/400/400`}
                            alt="Instagram Gallery"
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-[#003153]/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex flex-col justify-end p-3 text-white">
                            <p className="text-[10px] font-mono font-bold">{item.tag}</p>
                            <p className="text-[9px] text-[#00b4d8] truncate mt-0.5">{item.item}</p>
                            <div className="flex items-center justify-between text-[9px] mt-2 text-[#00b4d8]/85">
                              <span>❤️ {item.likes} Beğeni</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerShare(item.item);
                                }}
                                className="text-white hover:text-[#00b4d8]"
                              >
                                <Share2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* Other Tab Views */}

        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <OrderTracker
              orders={orders}
              onAdvanceOrderStatus={handleAdvanceOrderStatus}
              theme={theme}
            />
          </motion.div>
        )}

        {activeTab === "favorites" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
          >
            <h3 className="font-serif text-xl font-bold text-[#003153] mb-6 flex items-center gap-1.5">
              <Heart className="h-5.5 w-5.5 text-red-500 fill-current" /> Favori Listem
            </h3>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.filter((p) => favorites.includes(p.id)).map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isFavorite={true}
                    onToggleFavorite={() => toggleFavorite(p.id)}
                    onAddToCart={() => handleAddToCart(p)}
                    onSelectProduct={setSelectedProduct}
                    theme={theme}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-200 py-20 text-center">
                <Heart className="mx-auto h-8 w-8 text-stone-300 mb-1" />
                <h4 className="font-serif text-base font-bold text-stone-600">Henüz Favori Eklenmedi</h4>
                <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                  Beğendiğiniz çini eserlerin üzerindeki kalp simgesine basarak, daha sonra kolayca bulmak üzere bu listeye ekleme yapabilirsiniz.
                </p>
                <button
                  onClick={handleNavigateToCatalog}
                  className="mt-4 rounded-lg bg-[#003153] px-3.5 py-1.5 text-xs font-bold text-[#00b4d8] hover:bg-[#00223a] transition-all cursor-pointer"
                >
                  Koleksiyona Göz At
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "cart" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
          >
            <h3 className="font-serif text-xl font-bold text-[#003153] mb-6 flex items-center gap-1.5">
              <ShoppingCart className="h-5.5 w-5.5 text-[#00b4d8]" /> Alışveriş Sepetim
            </h3>
            {cart.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Cart items list */}
                <div className="lg:col-span-8 space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-lg object-cover border border-stone-100"
                        />
                        <div className="min-w-0">
                          <p 
                            onClick={() => setSelectedProduct(item.product)}
                            className="text-xs font-bold text-stone-800 truncate hover:text-[#00b4d8] cursor-pointer"
                          >
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-stone-400 mt-0.5">Yöresi: {item.product.origin} • Stok: {item.product.stock}</p>
                          <div className="flex items-center space-x-2.5 mt-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="h-6 w-6 rounded-md border border-stone-200 bg-stone-50 hover:bg-stone-100 font-bold text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-xs font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="h-6 w-6 rounded-md border border-stone-200 bg-stone-50 hover:bg-stone-100 font-bold text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-2">
                        <span className="text-sm font-extrabold text-[#003153]">
                          ₺{(item.product.price * item.quantity).toLocaleString("tr-TR")}
                        </span>
                        <button
                          onClick={() => handleRemoveFromCart(item.product.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Ürünü Çıkar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal card */}
                <div className="lg:col-span-4">
                  <div className="rounded-2xl border border-stone-200 bg-[#fdfbf7] p-5 shadow-sm">
                    <h4 className="font-serif text-sm font-bold text-[#003153] mb-4 pb-2 border-b border-stone-100">Ödeme Detayı</h4>
                    <div className="space-y-3.5">
                      <div className="flex justify-between text-xs text-stone-500">
                        <span>Sepet Toplamı:</span>
                        <span>₺{cartTotal.toLocaleString("tr-TR")}</span>
                      </div>
                      <div className="flex justify-between text-xs text-stone-500">
                        <span>Güvenli Sigortalı Kargo:</span>
                        <span className="text-emerald-600 font-bold">Bedava</span>
                      </div>
                      <div className="border-t border-stone-200/60 pt-3 flex justify-between items-center text-xs font-bold text-stone-800">
                        <span>Genel Toplam:</span>
                        <span className="text-lg text-[#003153] font-extrabold">₺{cartTotal.toLocaleString("tr-TR")}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab("payment")}
                      className="mt-5 w-full rounded-xl bg-[#003153] py-3 text-center text-xs font-bold text-[#00b4d8] hover:bg-[#00223a] hover:text-white transition-all shadow-md cursor-pointer"
                    >
                      Ödeme Adımına Geç »
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-200 py-20 text-center">
                <ShoppingCart className="mx-auto h-8 w-8 text-stone-300 mb-1" />
                <h4 className="font-serif text-base font-bold text-stone-600">Sepetiniz Boş</h4>
                <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                  Kataloğumuzda yer alan İznik ve Kütahya el yapımı şaheserleri inceleyip sepetinize ekleyebilirsiniz.
                </p>
                <button
                  onClick={handleNavigateToCatalog}
                  className="mt-4 rounded-lg bg-[#003153] px-3.5 py-1.5 text-xs font-bold text-[#00b4d8] hover:bg-[#00223a] transition-all cursor-pointer"
                >
                  Ürünleri Gör
                </button>
              </div>
            )}
          </motion.div>
        )}

         {activeTab === "auth" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AuthPortal
              currentUser={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          </motion.div>
        )}

        {activeTab === "payment" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PaymentSystem
              cart={cart}
              cartTotal={cartTotal}
              userEmail={currentUser?.email || "misafir@example.com"}
              onPlaceOrder={handlePlaceOrder}
              onClearCart={() => updateCart([])}
              onGoToTab={setActiveTab}
            />
          </motion.div>
        )}
        </>
        )}
      </main>

      {/* Styled Footer */}
      <footer className={`transition-colors duration-500 border-t ${
        theme === "gece" 
          ? "bg-[#091727] text-slate-300 border-slate-800" 
          : "bg-[#003153] text-slate-300 border-[#00b4d8]/30"
      } py-12`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00b4d8] text-sm font-bold text-[#003153]">T</div>
              <span className="font-serif text-lg font-bold text-white">TwoTales</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300/90">
              Kadim Türk çini sanatını en saf fırça darbeleri ve doğal sırlar eşliğinde fırınlayarak, evinizin en lüks köşelerine taşıyoruz.
            </p>
          </div>

          {/* Site Navigation links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Hızlı Bağlantılar</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={handleNavigateToCatalog} className="text-slate-200 hover:text-[#00b4d8] transition-colors text-left cursor-pointer flex items-center gap-1.5">
                  <span className="text-[#00b4d8]">•</span> Koleksiyonu İncele
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("orders")} className="text-slate-200 hover:text-[#00b4d8] transition-colors text-left cursor-pointer flex items-center gap-1.5">
                  <span className="text-[#00b4d8]">•</span> Sipariş Takibi
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("auth")} className="text-slate-200 hover:text-[#00b4d8] transition-colors text-left cursor-pointer flex items-center gap-1.5">
                  <span className="text-[#00b4d8]">•</span> Giriş Yap / Üye Ol
                </button>
              </li>
            </ul>
          </div>

          {/* Traditional Motifs info links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Kadim Motif Sırları</h5>
            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-center gap-1.5">
                <span className="text-[#00b4d8]">❀</span> <span>Lale: Güzellik & Zarafet</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#00b4d8]">❀</span> <span>Karanfil: Yenilenme & Bahar</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#00b4d8]">❀</span> <span>Rumi: Sonsuz Döngü & Kozmos</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#00b4d8]">❀</span> <span>Hayat Ağacı: Cennet & Soy</span>
              </li>
            </ul>
          </div>

          {/* Secure details badges */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Güvenli Alt Yapı</h5>
            <div className="space-y-2 text-[11px] text-slate-200">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>%100 Güvenli Üyelik (SHA-256)</span>
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>3D Secure Ödeme Tüneli</span>
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Sigortalı Özel Kırılmaz Kargo</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright segment */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-[#00b4d8]/20 mt-10 pt-6 text-center text-xs text-slate-300">
          <p>© 2026 TwoTales E-Ticaret Portalı. Tüm hakları saklıdır. Geleneksel Türk Süsleme Sanatı.</p>
        </div>
      </footer>

      {/* Premium Toast Notification Stack */}
      <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="pointer-events-auto w-full rounded-2xl border border-stone-200 bg-white p-4 shadow-xl flex items-start gap-3"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              toast.type === "success" 
                ? "bg-sky-50 text-[#003153]" 
                : "bg-amber-50 text-amber-600"
            }`}>
              {toast.type === "success" ? (
                <ShoppingCart className="h-4.5 w-4.5 text-[#003153]" />
              ) : (
                <Heart className="h-4.5 w-4.5 fill-current" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-stone-800 leading-tight">{toast.message}</p>
              {toast.subMessage && (
                <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">{toast.subMessage}</p>
              )}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-stone-400 hover:text-stone-600 cursor-pointer self-start"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
