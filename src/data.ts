import { Product, Order } from "./types";
import plateImage from "./assets/images/cini_plate_1783463813116.jpg";
import vaseImage from "./assets/images/cini_vase_1783463825441.jpg";
import tileImage from "./assets/images/cini_tile_1783463838351.jpg";
import bowlImage from "./assets/images/cini_bowl_1783463852387.jpg";

export const PRODUCTS: Product[] = [
  {
    id: "cini-plate-1",
    name: "Hünkar Klasik Lale Motifli İznik Tabağı",
    category: "Tabak",
    price: 1850,
    description: "16. yüzyıl klasik İznik üslubunda, el yapımı kuvars hamurundan şekillendirilmiş, firuze ve kobalt mavi zemin üzerine ince lale işlemeli dekoratif duvar tabağı.",
    image: plateImage,
    rating: 4.9,
    reviewsCount: 38,
    stock: 5,
    color: ["Kobalt Mavi", "Turkuaz", "Beyaz"],
    origin: "İznik",
    technique: "Sır Altı",
    motif: ["lale", "yaprak", "bulut"],
    details: [
      "Çap: 30 cm",
      "Kuvars katkılı el yapımı çamurdan üretilmiştir.",
      "950 derecede çift fırınlama tabi tutulmuştur.",
      "Duvara asma teli ile birlikte gönderilir.",
      "Sıcak gıdalarla teması ve mikrodalgada kullanımı önerilmez."
    ],
    year: 2026
  },
  {
    id: "cini-vase-1",
    name: "Firuze Sır Altı Altın Çini Vazo",
    category: "Vazo",
    price: 3400,
    description: "Geleneksel gözyaşı formunda, zengin turkuaz (firuze) sır ile sırlanmış, üzerinde 18 ayar altın yaldız işlemeli rumi helezon kıvrımlar barındıran lüks vazo.",
    image: vaseImage,
    rating: 4.8,
    reviewsCount: 24,
    stock: 2,
    color: ["Turkuaz", "Altın"],
    origin: "Kütahya",
    technique: "Sır Üstü",
    motif: ["rumi", "helezon"],
    details: [
      "Yükseklik: 38 cm • Genişlik: 18 cm",
      "Geleneksel Kütahya çömlek çarkında el ile çekilmiştir.",
      "Sır altı turkuaz boyamadan sonra, sır üstü altın yaldız ile fırınlanmıştır.",
      "Sınırlı sayıda üretilmiş özel koleksiyon eseridir.",
      "Sadece kuru bezle temizlenmelidir."
    ],
    year: 2026
  },
  {
    id: "cini-tile-1",
    name: "Karanfil Desenli Rumi Duvar Çinisi",
    category: "Karo",
    price: 480,
    description: "Türk mimari süsleme sanatında saray duvarlarını süsleyen klasik 20x20 cm boyutlarında, sırlı, kabartma karanfil ve rumi kıvrımları içeren şık duvar karosu.",
    image: tileImage,
    rating: 4.7,
    reviewsCount: 15,
    stock: 45,
    color: ["Kobalt Mavi", "Mercan Kırmızı", "Beyaz"],
    origin: "İznik",
    technique: "Sır Altı",
    motif: ["karanfil", "rumi"],
    details: [
      "Ölçü: 20 x 20 cm • Kalınlık: 1.2 cm",
      "İç ve dış mekan mimari kaplamalara uygundur.",
      "Su geçirmez, dona ve UV ışınlarına karşı tam dayanıklıdır.",
      "Tasarım bütünlüğü sağlayan simetrik kenar kesim.",
      "Sır altı kabartma (rölyef) tekniğiyle desenlenmiştir."
    ],
    year: 2025
  },
  {
    id: "cini-bowl-1",
    name: "Haliç İşi El Çekimi Mavi-Beyaz Kase",
    category: "Kase",
    price: 1250,
    description: "Haliç işi (helezon) üslubunda, ince uçlu fırçalarla çizilmiş spiral desenlerden oluşan, el yapımı çukur meze ve dekorasyon kasesi.",
    image: bowlImage,
    rating: 4.9,
    reviewsCount: 42,
    stock: 8,
    color: ["Kobalt Mavi", "Beyaz"],
    origin: "İznik",
    technique: "Sır Altı",
    motif: ["helezon", "bulut"],
    details: [
      "Çap: 22 cm • Derinlik: 8 cm",
      "Nakkaş tarafından döner tabla üzerinde tamamen serbest elle çizilmiştir.",
      "Parlak ve sırsız taban halkalı geleneksel gövde yapısı.",
      "Soslar, meyveler veya kuru yemişler için kullanıma uygundur.",
      "Elde yıkanması tavsiye edilir."
    ],
    year: 2026
  },
  // Stable fallback CDN / Picsum photos for catalog extension
  {
    id: "cini-vazo-2",
    name: "Sultan Gözyaşı Çini Vazo",
    category: "Vazo",
    price: 2950,
    description: "Kütahya fırınlarında geleneksel el işçiliğiyle üretilmiş, zengin kobalt zemin üzerine mercan kırmızısı karanfillerle bezenmiş gözyaşı formu çini vazo.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600&h=600",
    rating: 4.6,
    reviewsCount: 11,
    stock: 4,
    color: ["Kobalt Mavi", "Mercan Kırmızı", "Yeşil"],
    origin: "Kütahya",
    technique: "Sır Altı",
    motif: ["karanfil", "yaprak"],
    details: [
      "Yükseklik: 32 cm",
      "Kütahya kili ile yoğrulmuş dayanıklı bünye.",
      "Sır altı tekniğinde kurşunsuz şeffaf sır kullanılmıştır.",
      "Desenler el boyamasıdır, iki vazo birbirinin tıpatıp aynısı olamaz."
    ],
    year: 2025
  },
  {
    id: "cini-plate-2",
    name: "Selçuklu Yıldızı Sırlı Duvar Tabağı",
    category: "Tabak",
    price: 1950,
    description: "Merkezinde 8 köşeli kozmik Selçuklu Yıldızı motifi bulunduran, her bir köşesinde şefkat, sabır ve doğruluk gibi felsefeleri temsil eden İznik çini tabağı.",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600&h=600",
    rating: 4.9,
    reviewsCount: 29,
    stock: 3,
    color: ["Turkuaz", "Kobalt Mavi", "Altın"],
    origin: "İznik",
    technique: "Sır Altı",
    motif: ["selcuklu yildizi", "rumi"],
    details: [
      "Çap: 28 cm",
      "Geleneksel Selçuklu geometrik desenlerinden esinlenmiştir.",
      "Firuze sırrı ile derinlik kazandırılmıştır.",
      "Özel kadife koruma kutusu ile birlikte kargolanır."
    ],
    year: 2026
  },
  {
    id: "cini-tile-2",
    name: "Hayat Ağacı Klasik Çini Karo",
    category: "Karo",
    price: 520,
    description: "Cenneti ve ebediyeti temsil eden köklü Hayat Ağacı motifinin lale dallarıyla sarılı olduğu, turkuaz ve kobalt tonlarının hakim olduğu el yapımı karo çini.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600&h=600",
    rating: 4.8,
    reviewsCount: 18,
    stock: 20,
    color: ["Turkuaz", "Yeşil", "Kobalt Mavi"],
    origin: "İznik",
    technique: "Sır Altı",
    motif: ["hayat agaci", "lale"],
    details: [
      "Ölçü: 20 x 20 cm",
      "Restorasyon kalitesinde, fırın fayanstır.",
      "Harç ve yapıştırıcı yardımıyla duvara monte edilebilir.",
      "Usta nakkaşlar tarafından tek tek el boyaması ile üretilmiştir."
    ],
    year: 2026
  },
  {
    id: "cini-bowl-2",
    name: "Nar ve Bereket Desenli Çini Kase",
    category: "Kase",
    price: 980,
    description: "Bolluğu ve birliği simgeleyen nar motifinin geleneksel yeşil ve mercan kırmızısı pigmentlerle el ile çizildiği, sofralarınıza bereket getirecek kase.",
    image: "https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&q=80&w=600&h=600",
    rating: 4.7,
    reviewsCount: 21,
    stock: 12,
    color: ["Mercan Kırmızı", "Yeşil", "Beyaz"],
    origin: "Kütahya",
    technique: "Sır Altı",
    motif: ["nar", "yaprak"],
    details: [
      "Çap: 18 cm • Derinlik: 7 cm",
      "Bolluk ve birlik felsefesine sahip nar bezemelidir.",
      "İçi ve dışı tamamen el işleme çinidir.",
      "Mutfakta gıda sunumuna uygun kurşunsuz sırla kaplanmıştır."
    ],
    year: 2025
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "order-101",
    userEmail: "ersanyakit@gmail.com",
    items: [
      {
        product: PRODUCTS[0],
        quantity: 1
      }
    ],
    total: 1850,
    status: "Teslim Edildi",
    date: "12.06.2026",
    trackingCode: "TR-101",
    shippingAddress: {
      fullName: "Ersan Yakıt",
      phone: "0532 987 6543",
      addressLine: "Bebek Mah. Cevdetpaşa Cad. No:12 D:4",
      city: "İstanbul",
      zipCode: "34342"
    },
    paymentCardLast4: "5412",
    timeline: [
      { status: "order_placed", title: "Sipariş Alındı", description: "Siparişiniz fırın sistemine kaydedildi.", date: "12.06.2026 10:15", completed: true },
      { status: "pattern_design", title: "Desen Çizimi", description: "Nakkaş tarafından tabağa lale motifi eskizlendi.", date: "12.06.2026 14:30", completed: true },
      { status: "hand_painting", title: "El Boyaması", description: "Kobalt mavi ve turkuaz sırlar el fırçasıyla çekildi.", date: "13.06.2026 11:20", completed: true },
      { status: "underglaze_firing", title: "Sır Altı Fırınlama", description: "Fırında 950 derecede pişirme işlemi yapıldı.", date: "14.06.2026 16:45", completed: true },
      { status: "shipped", title: "Kargoya Verildi", description: "Eseriniz korunaklı ahşap sandıkla kargoya verildi.", date: "15.06.2026 09:00", completed: true },
      { status: "delivered", title: "Teslim Edildi", description: "Eser imza karşılığı teslim edildi.", date: "16.06.2026 14:15", completed: true }
    ]
  },
  {
    id: "order-102",
    userEmail: "ersanyakit@gmail.com",
    items: [
      {
        product: PRODUCTS[1],
        quantity: 1
      }
    ],
    total: 3400,
    status: "Boyanıyor",
    date: "05.07.2026",
    trackingCode: "TR-102",
    shippingAddress: {
      fullName: "Ersan Yakıt",
      phone: "0532 987 6543",
      addressLine: "Bebek Mah. Cevdetpaşa Cad. No:12 D:4",
      city: "İstanbul",
      zipCode: "34342"
    },
    paymentCardLast4: "9012",
    timeline: [
      { status: "order_placed", title: "Sipariş Alındı", description: "Sipariş başarıyla alındı ve atölyeye iletildi.", date: "05.07.2026 09:30", completed: true },
      { status: "pattern_design", title: "Desen Çizimi", description: "Çömlek çarkından çıkan vazoya rumi motif pürüzsüzce nakşedildi.", date: "06.07.2026 13:10", completed: true },
      { status: "hand_painting", title: "El Boyaması", description: "Nakkaşlar firuze tonları ve altın detayları vazo gövdesine boyuyor.", date: "07.07.2026 10:00", completed: true },
      { status: "underglaze_firing", title: "Sır Altı Fırınlama", description: "Bilinmeyen fırınlama saati • Sır altı fırınlanması bekleniyor.", completed: false },
      { status: "shipped", title: "Kargoya Verildi", description: "Paketlenmesi ve kargoya verilmesi bekleniyor.", completed: false },
      { status: "delivered", title: "Teslim Edildi", description: "Teslimat adrese henüz yapılmadı.", completed: false }
    ]
  }
];
