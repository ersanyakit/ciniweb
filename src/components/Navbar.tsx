import { useState } from "react";
import { Search, ShoppingCart, Heart, User, ClipboardList, Menu, X, LogOut, Sun, Moon } from "lucide-react";
import { User as UserType } from "../types";
import { motion } from "motion/react";
import logoMark from "../assets/images/logo-mark-gold.png";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  favoritesCount: number;
  currentUser: UserType | null;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: "gunduz" | "gece";
  toggleTheme: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  favoritesCount,
  currentUser,
  onLogout,
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "catalog", label: "Koleksiyon", icon: CompassIcon, highlight: false },
    { id: "orders", label: "Sipariş Takibi", icon: ClipboardList, highlight: false },
  ];

  function CompassIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    );
  }

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sini-turquoise/30 bg-sini-navy text-white shadow-md">
      {/* Top Announcement Bar */}
      <div className="bg-sini-turquoise py-1 text-center text-[10.5px] font-bold text-sini-cream uppercase tracking-widest">
        {theme === "gece" 
          ? "🌌 İki Hikayeli Sanat: Gece ve Gündüz Koleksiyonu • Ücretsiz Kargo"
          : "✨ TwoTales: Geleneksel Çini Sanatının Gündüz & Gece Hikayeleri • Ücretsiz Kargo"}
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          type="button"
          aria-label="TwoTales ana sayfasına git"
          onClick={() => handleTabClick("catalog")} 
          className="group flex shrink-0 cursor-pointer items-center gap-2 text-left"
        >
          <div className="logo-jewel relative flex h-10 w-11 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-12">
            <img
              src={logoMark}
              alt=""
              className="logo-jewel__mark h-full w-full object-contain"
            />
            <span aria-hidden="true" className="logo-jewel__sparkle logo-jewel__sparkle--one" />
            <span aria-hidden="true" className="logo-jewel__sparkle logo-jewel__sparkle--two" />
            <span aria-hidden="true" className="logo-jewel__sparkle logo-jewel__sparkle--three" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-serif text-lg font-black tracking-tight text-sini-cream sm:text-xl flex items-center gap-0.5">
              <span className="text-sini-gold font-sans font-black">Two</span>
              <span className="text-white italic">Tales</span>
            </h1>
            <p className="hidden text-[8.5px] uppercase tracking-widest text-sini-turquoise/90 font-mono font-bold lg:block">
              {theme === "gece" ? "Gece Masalları • Sır Altı" : "Gündüz Hikayeleri • Sır & Ateş"}
            </p>
          </div>
        </button>

        {/* Search Bar (Desktop) */}
        <div className="hidden max-w-md flex-1 px-8 md:block">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-sini-turquoise/60" />
            <input
              type="text"
              placeholder="Motif, renk veya ürün ara..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== "catalog") setActiveTab("catalog");
              }}
              className="w-full rounded-full border border-sini-turquoise/40 bg-stone-900/90 py-2 pr-4 pl-10 text-sm text-white placeholder-stone-300 outline-none focus:border-sini-turquoise focus:bg-stone-950 focus:ring-1 focus:ring-sini-turquoise transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Navigation Actions (Desktop) */}
        <nav className="hidden items-center space-x-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center space-x-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer border border-transparent focus:outline-none focus:ring-0 focus:border-transparent focus-visible:ring-0 focus-visible:outline-none active:outline-none ${
                  item.highlight
                    ? "bg-gradient-to-r from-sini-navy to-sini-turquoise text-white hover:opacity-90 shadow-md shadow-sini-turquoise/20 !border-sini-turquoise/20"
                    : isSelected
                    ? "bg-stone-950/60 text-sini-turquoise !border-sini-turquoise/20"
                    : "text-sini-cream/80 hover:bg-stone-900/50 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                  </span>
                )}
              </motion.button>
            );
          })}

          <div className="mx-2 h-6 w-[1px] bg-sini-turquoise/20" />

          {/* Favorites */}
          <motion.button
            onClick={() => handleTabClick("favorites")}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            className={`relative rounded-full p-2 transition-all hover:bg-stone-900/45 cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-0 ${
              activeTab === "favorites" ? "text-sini-red" : "text-sini-turquoise/80 hover:text-white"
            }`}
            title="Favorilerim"
          >
            <Heart className={`h-5 w-5 ${activeTab === "favorites" ? "fill-current" : ""}`} />
            {favoritesCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-sini-red text-[10px] font-bold text-white ring-2 ring-sini-navy">
                {favoritesCount}
              </span>
            )}
          </motion.button>

          {/* Cart */}
          <motion.button
            onClick={() => handleTabClick("cart")}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            className={`relative rounded-full p-2 transition-all hover:bg-stone-900/45 cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-0 ${
              activeTab === "cart" ? "text-sini-turquoise" : "text-sini-turquoise/80 hover:text-white"
            }`}
            title="Sepetim"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-sini-turquoise text-[10px] font-black text-sini-navy ring-2 ring-sini-navy">
                {cartCount}
              </span>
            )}
          </motion.button>

          {/* Theme Switcher */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            className="relative rounded-full p-2 transition-all hover:bg-stone-900/45 cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-0"
            title={theme === "gece" ? "Gündüz Moduna Geç" : "Gece Moduna Geç"}
          >
            {theme === "gece" ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-300" />
            )}
          </motion.button>

          {/* User Profile */}
          <div className="relative ml-2">
            {currentUser ? (
              <div className="flex items-center space-x-2 rounded-full border border-sini-turquoise/20 bg-stone-950/40 py-1 pr-3 pl-1.5">
                <motion.button
                  onClick={() => handleTabClick("auth")}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-sini-turquoise text-xs font-black text-sini-navy shadow-inner cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-0"
                >
                  {currentUser.fullName.split(" ").map(n => n[0]).join("")}
                </motion.button>
                <div 
                  onClick={() => handleTabClick("auth")} 
                  className="hidden max-w-[80px] cursor-pointer text-left md:block"
                >
                  <p className="truncate text-xs font-medium text-white">{currentUser.fullName}</p>
                </div>
                <motion.button 
                  onClick={onLogout}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  className="text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Çıkış Yap"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={() => handleTabClick("auth")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1.5 rounded-full border border-sini-turquoise/20 px-3 py-1.5 text-xs font-bold text-sini-turquoise hover:bg-stone-900 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-0 animate-[pulse_3s_infinite]"
              >
                <User className="h-4 w-4" />
                <span>Giriş Yap</span>
              </motion.button>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-3 md:hidden">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1 text-sini-turquoise focus:outline-none"
            title={theme === "gece" ? "Gündüz Moduna Geç" : "Gece Moduna Geç"}
          >
            {theme === "gece" ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-300" />
            )}
          </button>

          {/* Mobile Favorites */}
          <button
            onClick={() => handleTabClick("favorites")}
            className="relative p-1 text-sini-turquoise"
          >
            <Heart className={`h-5 w-5 ${activeTab === "favorites" ? "text-sini-red fill-current" : ""}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sini-red text-[9px] font-bold text-white">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Mobile Cart */}
          <button
            onClick={() => handleTabClick("cart")}
            className="relative p-1 text-sini-turquoise"
          >
            <ShoppingCart className={`h-5 w-5 ${activeTab === "cart" ? "text-sini-turquoise" : ""}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sini-turquoise text-[9px] font-bold text-sini-navy">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-sini-turquoise hover:bg-stone-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="border-t border-sini-turquoise/10 bg-sini-navy px-4 py-3 md:hidden">
          {/* Mobile Search */}
          <div className="relative mb-3">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-sini-turquoise/60" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-sini-turquoise/40 bg-stone-900/90 py-2 pr-4 pl-10 text-sm text-white placeholder-stone-300 outline-none focus:border-sini-turquoise focus:bg-stone-950 focus:ring-1 focus:ring-sini-turquoise transition-all"
            />
          </div>

          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    item.highlight
                      ? "bg-gradient-to-r from-sini-navy to-sini-turquoise text-white"
                      : isSelected
                      ? "bg-stone-900 text-sini-turquoise"
                      : "text-sini-cream/80 hover:bg-stone-900/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="my-2 border-t border-sini-turquoise/10" />

            {currentUser ? (
              <div className="flex items-center justify-between rounded-lg bg-stone-950/30 p-3">
                <div 
                  onClick={() => handleTabClick("auth")}
                  className="flex cursor-pointer items-center space-x-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sini-turquoise text-xs font-black text-sini-navy">
                    {currentUser.fullName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{currentUser.fullName}</p>
                    <p className="text-[10px] text-sini-turquoise/60">Profilim</p>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleTabClick("auth")}
                className="flex items-center justify-center space-x-2 rounded-lg border border-sini-turquoise/20 py-2.5 text-sm font-medium text-sini-turquoise hover:bg-stone-900 hover:text-white"
              >
                <User className="h-5 w-5" />
                <span>Giriş Yap / Üye Ol</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
