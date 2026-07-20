export interface Product {
  id: string;
  name: string;
  category: "Tabak" | "Vazo" | "Karo" | "Kase";
  price: number;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  color: string[];
  origin: "İznik" | "Kütahya";
  technique: "Sır Altı" | "Sır Üstü" | "Lüster";
  motif: string[];
  details: string[];
  year: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderTimelineEvent {
  status: "order_placed" | "pattern_design" | "hand_painting" | "underglaze_firing" | "shipped" | "delivered";
  title: string;
  description: string;
  date?: string;
  completed: boolean;
}

export interface Order {
  id: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  status: "Alındı" | "Çizimde" | "Boyanıyor" | "Fırınlanıyor" | "Kargoda" | "Teslim Edildi";
  date: string;
  trackingCode: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    zipCode: string;
  };
  paymentCardLast4: string;
  timeline: OrderTimelineEvent[];
}

export interface User {
  email: string;
  fullName: string;
  isVerified: boolean;
  joinedDate: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  date: string;
}
