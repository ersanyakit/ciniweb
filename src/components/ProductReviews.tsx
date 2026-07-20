import React, { useState } from "react";
import { Star, MessageSquare, Send, User, Award, CheckCircle, ThumbsUp, Sparkles, Edit3 } from "lucide-react";
import { motion } from "motion/react";
import { Review, User as UserType } from "../types";

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  currentUser: UserType | null;
  onAddReview: (productId: string, rating: number, comment: string, userName: string) => void;
}

export default function ProductReviews({
  productId,
  reviews,
  currentUser,
  onAddReview,
}: ProductReviewsProps) {
  const filteredReviews = reviews.filter((r) => r.productId === productId);
  
  // Local form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [name, setName] = useState(currentUser?.fullName || "");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const userName = name.trim() || currentUser?.fullName || "Misafir Sanatsever";
    onAddReview(productId, rating, comment, userName);
    
    // Reset form
    setComment("");
    if (!currentUser) setName("");
  };

  const handleVote = (reviewId: string) => {
    if (votedReviews[reviewId]) return;
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
    setVotedReviews(prev => ({
      ...prev,
      [reviewId]: true
    }));
  };

  // Calculate review stats
  const totalReviews = filteredReviews.length;
  const averageRating = totalReviews > 0
    ? Number((filteredReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  // Distribution counts
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  filteredReviews.forEach(r => {
    const rate = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
    if (distribution[rate] !== undefined) {
      distribution[rate]++;
    }
  });

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5: return "Fevkalade (Koleksiyonluk)";
      case 4: return "Çok Başarılı";
      case 3: return "Güzel & Özgün";
      case 2: return "Orta Seviye";
      case 1: return "Beklentiyi Karşılamadı";
      default: return "";
    }
  };

  return (
    <div id="product-reviews-section" className="mt-12 border-t border-stone-200/60 pt-8">
      
      {/* Exquisite Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
        <div>
          <h4 className="font-serif text-sm font-black text-sini-navy uppercase tracking-widest flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-sini-turquoise animate-pulse" />
            Sanatsever Defteri & Yorumlar
          </h4>
          <p className="text-[10px] text-stone-400 mt-1 font-medium">
            Atölyemizden sertifikalı eser sahiplerinin orijinal deneyimleri ve değerlendirmeleri.
          </p>
        </div>
        
        <div className="flex items-center gap-1.5 bg-sini-navy/[0.03] px-3 py-1.5 rounded-full border border-sini-navy/10 self-start md:self-auto">
          <Sparkles className="h-3.5 w-3.5 text-sini-turquoise" />
          <span className="text-[10.5px] font-bold text-sini-navy">Garantili El İşçiliği Değerlendirmesi</span>
        </div>
      </div>

      {/* Exquisite Stats Dashboard */}
      {totalReviews > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-sini-cream/35 border border-stone-200/80 p-5 rounded-2xl mb-8 shadow-xs">
          {/* Average Score Big Display */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-stone-200/60 pb-4 md:pb-0 md:pr-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Genel Skor</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-serif font-black text-sini-navy tracking-tight">{averageRating}</span>
              <span className="text-sm font-bold text-stone-400">/ 5</span>
            </div>
            {/* Stars */}
            <div className="flex text-sini-turquoise mt-1.5 mb-1">
              {Array.from({ length: 5 }).map((_, idx) => {
                const isFull = idx < Math.floor(averageRating);
                const isHalf = !isFull && idx < averageRating;
                return (
                  <Star
                    key={idx}
                    className={`h-4 w-4 ${isFull ? "fill-current" : isHalf ? "fill-current opacity-60" : "text-stone-200"}`}
                  />
                );
              })}
            </div>
            <span className="text-[10.5px] font-bold text-sini-turquoise tracking-wide mt-1">
              {totalReviews} Sanatsever Değerlendirmesi
            </span>
          </div>

          {/* Distribution Progress Bars */}
          <div className="md:col-span-8 flex flex-col justify-center space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distribution[stars as 5 | 4 | 3 | 2 | 1] || 0;
              const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-10 text-stone-400 font-bold font-mono text-[10.5px] text-right flex items-center justify-end gap-1">
                    {stars} <Star className="h-3 w-3 fill-sini-turquoise text-sini-turquoise inline" />
                  </span>
                  <div className="flex-grow h-2 bg-stone-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${stars >= 4 ? "bg-sini-navy" : stars === 3 ? "bg-sini-turquoise" : "bg-stone-300"}`}
                    />
                  </div>
                  <span className="w-8 text-[10px] font-semibold text-stone-500 font-mono text-left">
                    {count} Adet
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews List Layout */}
      <div className="space-y-4 mb-8 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev, index) => {
            const isVoted = votedReviews[rev.id] || false;
            const extraVotes = helpfulVotes[rev.id] || 0;
            const isPerfect = rev.rating === 5;
            
            return (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                className={`p-4 rounded-2xl border transition-all hover:shadow-xs flex flex-col gap-2.5 ${
                  isPerfect 
                    ? "bg-sini-cream/15 border-sini-turquoise/30 border-l-4 border-l-sini-turquoise" 
                    : "bg-white border-stone-200/75 border-l-4 border-l-sini-navy/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center border transition-colors ${
                      isPerfect 
                        ? "bg-sini-turquoise/10 border-sini-turquoise/25 text-sini-turquoise" 
                        : "bg-sini-navy/5 border-sini-navy/10 text-sini-navy"
                    }`}>
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-stone-800 leading-none">
                          {rev.userName}
                        </span>
                        <div className="flex items-center gap-0.5 bg-emerald-50 border border-emerald-100 text-[8.5px] font-bold text-emerald-700 px-1.5 py-0.5 rounded-md">
                          <CheckCircle className="h-2.5 w-2.5 text-emerald-600" />
                          <span>Doğrulanmış Alıcı</span>
                        </div>
                      </div>
                      <span className="text-[9.5px] text-stone-400 mt-1 block">
                        Koleksiyon Sahibi • TwoTales Koleksiyoneri
                      </span>
                    </div>
                  </div>
                  
                  {/* Review Date */}
                  <span className="text-[9.5px] text-stone-400 font-mono font-medium tracking-tight bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-md">
                    {rev.date}
                  </span>
                </div>

                {/* Stars and Rating text label */}
                <div className="flex items-center gap-2">
                  <div className="flex text-sini-turquoise">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3 w-3 ${idx < rev.rating ? "fill-current" : "text-stone-100"}`}
                      />
                    ))}
                  </div>
                  <span className="text-[9.5px] font-bold text-stone-400 uppercase tracking-wider">
                    {getRatingLabel(rev.rating)}
                  </span>
                </div>

                {/* Comment Text with stylized quote layout */}
                <div className="relative">
                  <p className="text-xs text-stone-700 leading-relaxed font-serif italic pl-1">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Interaction Row (Helpful button) */}
                <div className="flex items-center justify-between border-t border-stone-100/80 pt-2 mt-1">
                  <div className="text-[9px] text-stone-400 font-medium">
                    Atölye Ref: <span className="font-mono text-stone-600">NK-REV-{rev.id.slice(-4).toUpperCase()}</span>
                  </div>
                  
                  <button
                    onClick={() => handleVote(rev.id)}
                    disabled={isVoted}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                      isVoted 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : "text-stone-500 hover:text-sini-navy bg-stone-50 hover:bg-stone-100/80 border border-stone-200/50"
                    }`}
                  >
                    <ThumbsUp className={`h-3 w-3 ${isVoted ? "fill-current" : ""}`} />
                    <span>{isVoted ? "Faydalı Bulundu" : "Faydalı"}</span>
                    <span className="font-mono bg-white/80 px-1 py-0.2 rounded-sm border border-stone-200 text-[8.5px]">
                      {extraVotes}
                    </span>
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-stone-200/80 rounded-2xl bg-sini-cream/10">
            <MessageSquare className="h-8 w-8 text-stone-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-sini-navy uppercase tracking-wide">Henüz Değerlendirme Yok</p>
            <p className="text-[10px] text-stone-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Bu müstesna çini yapıt hakkında henüz yorum yazılmamıştır. İlk değerlendirmeyi siz yazarak bu eserin öyküsüne katkıda bulunabilirsiniz.
            </p>
          </div>
        )}
      </div>

      {/* Upgraded Review Form */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-[#fcfbf7] p-5 rounded-2xl border border-stone-200/90 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sini-navy via-sini-turquoise to-sini-navy" />
        
        <h5 className="text-xs font-black text-sini-navy uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Award className="h-4 w-4 text-sini-turquoise" /> Sanatsever Değerlendirmesi Ekle
        </h5>
        
        {/* Rating selection with real-time text status */}
        <div className="bg-white px-4 py-3 rounded-xl border border-stone-200/60 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-600 font-bold">Kişisel Notunuz (Puan):</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, idx) => {
                const starVal = idx + 1;
                const isHighlighted = starVal <= (hoverRating ?? rating);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors duration-150 ${
                        isHighlighted
                          ? "fill-sini-turquoise text-sini-turquoise"
                          : "text-stone-200"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded bg-sini-cream text-sini-navy border border-sini-navy/10 self-start sm:self-auto min-w-[140px] text-center">
            {getRatingLabel(hoverRating ?? rating)}
          </div>
        </div>

        {/* Form Fields container */}
        <div className="space-y-3.5">
          {/* Guest Name input */}
          {!currentUser && (
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-stone-400">
                <User className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                required
                placeholder="Adınız Soyadınız (Örn: Ersan Yakıt)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-200 bg-white pl-9 pr-4 py-2.5 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-sini-navy focus:ring-1 focus:ring-sini-navy transition-all"
              />
            </div>
          )}

          {/* Comment input */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-stone-400">
              <Edit3 className="h-3.5 w-3.5" />
            </span>
            <textarea
              rows={3}
              required
              placeholder="Çini eserin sırlama kalitesi, fırça işçiliği, renk canlılığı ve kargo paketlemesi hakkındaki izlenimlerinizi paylaşın..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-200 bg-white pl-9 pr-12 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-sini-navy focus:ring-1 focus:ring-sini-navy resize-none leading-relaxed transition-all"
            />
            
            {/* Elegant Submit circle button */}
            <button
              type="submit"
              disabled={!comment.trim() || (!currentUser && !name.trim())}
              className={`absolute bottom-3 right-3 p-2 rounded-xl transition-all shadow-xs ${
                comment.trim() && (currentUser || name.trim())
                  ? "bg-sini-navy text-sini-turquoise hover:bg-sini-navy/95 hover:text-white hover:shadow-md cursor-pointer hover:scale-105"
                  : "bg-stone-100 text-stone-300 cursor-not-allowed"
              }`}
              title="Değerlendirmeyi Gönder"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="text-[9px] text-stone-400 mt-3 italic text-center">
          "Yazılan her yorum, İznik çini sanatının yaşatılmasına ve kalitemizin yükselmesine vesile olmaktadır."
        </p>
      </form>
    </div>
  );
}
