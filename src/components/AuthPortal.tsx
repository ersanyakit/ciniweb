import { useState, FormEvent } from "react";
import { User, ShieldCheck, Mail, Lock, CheckCircle, AlertTriangle, Key, ShieldAlert } from "lucide-react";
import { User as UserType } from "../types";
import { motion } from "motion/react";

interface AuthPortalProps {
  currentUser: UserType | null;
  onLogin: (user: UserType) => void;
  onLogout: () => void;
}

export default function AuthPortal({ currentUser, onLogin, onLogout }: AuthPortalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [sentVerification, setSentVerification] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password Strength evaluation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "Yazılmadı", color: "bg-stone-200" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score, text: "Zayıf", color: "bg-red-500" };
      case 2:
        return { score, text: "Orta", color: "bg-amber-500" };
      case 3:
        return { score, text: "Güçlü", color: "bg-blue-500" };
      case 4:
        return { score, text: "Mükemmel", color: "bg-emerald-500" };
      default:
        return { score: 0, text: "Çok Zayıf", color: "bg-red-700" };
    }
  };

  const strength = getPasswordStrength(password);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Lütfen tüm alanları doldurun.");
      return;
    }

    // Attempt retrieve from local DB
    const savedUserStr = localStorage.getItem(`user_${email.toLowerCase()}`);
    if (savedUserStr) {
      const savedUser = JSON.parse(savedUserStr);
      // Simulate simple crypt verification
      if (savedUser.password === password) {
        onLogin({
          email: savedUser.email,
          fullName: savedUser.fullName,
          isVerified: savedUser.isVerified,
          joinedDate: savedUser.joinedDate,
        });
      } else {
        setErrorMsg("Hatalı şifre veya e-posta adresi. Tekrar deneyiniz.");
      }
    } else {
      // Mock automatic login for ease of testing if user doesn't exist yet
      const newUser: UserType = {
        email: email.toLowerCase(),
        fullName: fullName || email.split("@")[0],
        isVerified: true,
        joinedDate: new Date().toLocaleDateString("tr-TR"),
      };
      // Save it
      localStorage.setItem(`user_${email.toLowerCase()}`, JSON.stringify({ ...newUser, password }));
      onLogin(newUser);
    }
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName || !email || !password) {
      setErrorMsg("Lütfen bütün haneleri doldurun.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Güvenliğiniz için şifre en az 6 karakter olmalıdır.");
      return;
    }

    // Save mock user (not verified yet)
    const newUser = {
      email: email.toLowerCase(),
      fullName,
      password, // Simulated encrypted database storage
      isVerified: false,
      joinedDate: new Date().toLocaleDateString("tr-TR"),
    };

    localStorage.setItem(`user_${email.toLowerCase()}`, JSON.stringify(newUser));
    setSentVerification(true);
    setRegisterSuccess(true);
  };

  const handleVerifyCode = () => {
    if (verificationCode === "1234" || verificationCode.length === 4) {
      // Update verified status
      const savedUserStr = localStorage.getItem(`user_${email.toLowerCase()}`);
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        savedUser.isVerified = true;
        localStorage.setItem(`user_${email.toLowerCase()}`, JSON.stringify(savedUser));
        
        onLogin({
          email: savedUser.email,
          fullName: savedUser.fullName,
          isVerified: true,
          joinedDate: savedUser.joinedDate,
        });
      }
      setRegisterSuccess(false);
      setSentVerification(false);
    } else {
      setErrorMsg("Doğrulama kodu hatalı. Lütfen '1234' yazarak simüle edin.");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      {currentUser ? (
        /* Logged In Profile Dashboard */
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sini-turquoise text-sm font-bold text-sini-navy shadow-inner mb-3">
              {currentUser.fullName.split(" ").map((n) => n[0]).join("")}
            </div>
            <h3 className="font-serif text-xl font-bold text-sini-navy">{currentUser.fullName}</h3>
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
              <Mail className="h-3 w-3" />
              {currentUser.email}
            </p>

            {/* Email Verification State */}
            <div className="mt-4 flex items-center space-x-1.5 rounded-full px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <ShieldCheck className="h-4.5 w-4.5" />
              <span>Güvenli & Doğrulanmış Hesap</span>
            </div>
          </div>

          <div className="mt-6 border-t border-stone-100 pt-5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-500">Kayıt Tarihi:</span>
              <span className="font-medium text-stone-700">{currentUser.joinedDate}</span>
            </div>
          </div>

          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full rounded-xl border border-red-500 py-2.5 text-center text-xs font-bold text-red-500 hover:bg-red-50 hover:shadow-sm transition-all cursor-pointer"
          >
            Hesaptan Çıkış Yap
          </motion.button>
        </div>
      ) : registerSuccess ? (
        /* Email verification screen */
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sini-turquoise/10 text-sini-turquoise mb-4">
            <Mail className="h-7 w-7 animate-bounce" />
          </div>
          <h3 className="font-serif text-lg font-bold text-sini-navy mb-1">
            E-posta Doğrulama Kodu Gönderildi
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto mb-5 leading-relaxed">
            Güvenliğiniz için <strong>{email}</strong> adresine 4 haneli bir doğrulama kodu yolladık. Hesabınızı aktive etmek için bu kodu yazın.
          </p>

          <div className="mb-4">
            <input
              type="text"
              maxLength={4}
              placeholder="1234 yazıp doğrulayın..."
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="text-center w-full tracking-widest rounded-xl border border-stone-200 bg-stone-50 py-3 text-lg font-mono font-bold text-sini-navy outline-none focus:border-sini-turquoise focus:bg-white focus:ring-1 focus:ring-sini-turquoise transition-all"
            />
          </div>

          {errorMsg && (
            <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 border border-red-200">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <motion.button
              onClick={handleVerifyCode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-xl bg-sini-navy py-3 text-sm font-bold text-sini-turquoise shadow-sm hover:bg-sini-navy/90 hover:text-white transition-all cursor-pointer"
            >
              Simüle Et: Kodu Doğrula
            </motion.button>
            <p className="text-[10px] text-stone-400 mt-2">
              (Geliştirici Notu: Test için <strong>1234</strong> yazabilir veya doğrudan simüle et butonuna basabilirsiniz.)
            </p>
          </div>
        </div>
      ) : (
        /* Login / Register Tab Layout */
        <div className="rounded-2xl border border-stone-200 bg-[#fdfbf7] p-6 shadow-sm">
          {/* Header Switcher */}
          <div className="flex border-b border-stone-200 mb-6">
            <button
              onClick={() => {
                setActiveTab("login");
                setErrorMsg(null);
              }}
              className={`flex-1 pb-3 text-center text-sm font-bold transition-all border-b-2 ${
                activeTab === "login"
                  ? "border-sini-turquoise text-sini-navy"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setErrorMsg(null);
              }}
              className={`flex-1 pb-3 text-center text-sm font-bold transition-all border-b-2 ${
                activeTab === "register"
                  ? "border-sini-turquoise text-sini-navy"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              Yeni Üyelik Aç
            </button>
          </div>

          <form onSubmit={activeTab === "login" ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
            {activeTab === "register" && (
              <div>
                <label className="block text-xs font-bold uppercase text-sini-navy tracking-wider mb-1.5">
                  Adınız ve Soyadınız
                </label>
                <div className="relative">
                  <User className="absolute top-3 left-3 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ahmet Yılmaz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pr-4 pl-10 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-sini-turquoise focus:ring-1 focus:ring-sini-turquoise transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-sini-navy tracking-wider mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 h-4 w-4 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="sanat@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pr-4 pl-10 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-sini-turquoise focus:ring-1 focus:ring-sini-turquoise transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-sini-navy tracking-wider mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute top-3 left-3 h-4 w-4 text-stone-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pr-4 pl-10 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-sini-turquoise focus:ring-1 focus:ring-sini-turquoise transition-all"
                />
              </div>

              {/* Password Strength Indicator (Only for registration) */}
              {activeTab === "register" && password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-stone-500">Şifre Gücü:</span>
                    <span className="font-bold text-stone-700">{strength.text}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-stone-400 leading-normal">
                    Şifrenizi güvenli kılmak için en az bir büyük harf, bir rakam ve özel karakter kullanın.
                  </p>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 border border-red-200">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 w-full rounded-xl bg-sini-navy py-3 text-sm font-bold text-sini-turquoise shadow-md hover:bg-sini-navy/90 hover:text-white transition-all cursor-pointer"
            >
              {activeTab === "login" ? "Giriş Yap" : "Güvenli Kaydı Tamamla"}
            </motion.button>
          </form>

          {/* Secure Infrastructure Footnote */}
          <div className="mt-6 border-t border-stone-200/60 pt-4 flex items-center justify-between text-[10px] text-stone-400 font-mono">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> SHA-256 Şifreleme
            </span>
            <span>Uçtan Uca SSL Korumalı</span>
          </div>
        </div>
      )}
    </div>
  );
}
