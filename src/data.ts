export type Category = "Refillable" | "Disposable" | "Pods" | "Accessories";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  badge?: "NEW" | "SALE";
  desc: string;
  options: string[];
  specs: [string, string][];
  rating: number;
  reviews: number;
  hidden?: boolean;
}

export const CATEGORIES = ["All", "Refillable", "Disposable", "Pods", "Accessories"] as const;
export type Filter = (typeof CATEGORIES)[number];

export const PRODUCTS: Product[] = [
  {
    id: "vapor-pro-black",
    name: "Vapor Pro Black",
    price: 299,
    category: "Refillable",
    badge: "NEW",
    desc: "Our flagship refillable device. A zinc-alloy body, adjustable airflow and a 1100 mAh cell that comfortably lasts a full day of heavy use.",
    options: ["Matte Black", "Gunmetal"],
    specs: [
      ["Battery", "1100 mAh"],
      ["Output", "5–40 W"],
      ["Charging", "USB-C"],
    ],
    rating: 4.8,
    reviews: 214,
  },
  {
    id: "vapor-lite-silver",
    name: "Vapor Lite Silver",
    price: 199,
    category: "Refillable",
    desc: "The slim everyday carry. Draw-activated firing, leak-resistant pod and a featherweight 38 g chassis for pocket-friendly sessions.",
    options: ["Silver", "Graphite"],
    specs: [
      ["Battery", "900 mAh"],
      ["Output", "5–30 W"],
      ["Charging", "USB-C"],
    ],
    rating: 4.6,
    reviews: 158,
  },
  {
    id: "mixed-fruit-pods",
    name: "Mixed Fruit Pods",
    price: 99,
    category: "Pods",
    badge: "SALE",
    desc: "A twin-pack of pre-filled pods blending mango, grape and white peach. Ceramic coil for a clean, consistent draw from first puff to last.",
    options: ["Mango", "Grape", "White Peach"],
    specs: [
      ["Nicotine", "20 mg/ml"],
      ["Puffs", "≈600 / pod"],
      ["Pack", "2 pods"],
    ],
    rating: 4.7,
    reviews: 342,
  },
  {
    id: "mint-freeze",
    name: "Mint Freeze",
    price: 99,
    category: "Disposable",
    desc: "Crisp garden mint with a long arctic finish. No buttons, no refills — open the box and vape. Fully compliant 2 ml fill.",
    options: ["Standard", "Extra Ice"],
    specs: [
      ["Puffs", "≈800"],
      ["Nicotine", "20 mg/ml"],
      ["Battery", "550 mAh"],
    ],
    rating: 4.5,
    reviews: 190,
  },
  {
    id: "mango-ice-liquid",
    name: "Mango Ice E-Liquid",
    price: 79,
    category: "Refillable",
    desc: "Sun-ripened Alphonso mango with a cool menthol tail. 50/50 VG/PG balanced for both pods and sub-ohm starter kits.",
    options: ["10 mg/ml", "20 mg/ml"],
    specs: [
      ["Volume", "10 ml"],
      ["VG/PG", "50/50"],
      ["Bottle", "Child-proof"],
    ],
    rating: 4.7,
    reviews: 96,
  },
  {
    id: "berry-blast",
    name: "Berry Blast",
    price: 89,
    category: "Disposable",
    badge: "NEW",
    desc: "A mixed-berry medley — blueberry, raspberry and a squeeze of blackcurrant. Compact TPD-compliant disposable with a soft-touch shell.",
    options: ["Standard"],
    specs: [
      ["Puffs", "≈700"],
      ["Nicotine", "20 mg/ml"],
      ["Battery", "500 mAh"],
    ],
    rating: 4.4,
    reviews: 71,
  },
  {
    id: "tobacco-gold-pods",
    name: "Tobacco Gold Pods",
    price: 109,
    category: "Pods",
    desc: "Smooth Virginia tobacco with a hint of caramel. Made for switchers who want a familiar, mellow throat hit.",
    options: ["Classic", "Rich"],
    specs: [
      ["Nicotine", "20 mg/ml"],
      ["Puffs", "≈600 / pod"],
      ["Pack", "2 pods"],
    ],
    rating: 4.6,
    reviews: 120,
  },
  {
    id: "charge-dock",
    name: "Magnetic Charge Dock",
    price: 149,
    category: "Accessories",
    desc: "A weighted zinc-alloy dock that snaps your device upright and tops it up over USB-C. Status LED, cable included.",
    options: ["Black"],
    specs: [
      ["Input", "USB-C"],
      ["Output", "5 V / 1 A"],
      ["Body", "Zinc alloy"],
    ],
    rating: 4.9,
    reviews: 64,
  },
  {
    id: "silk-case",
    name: "Silk Carry Case",
    price: 129,
    category: "Accessories",
    desc: "Vegan-leather travel case with a microfibre lining and magnetic closure. Fits the Pro, the Lite and two spare pods.",
    options: ["Sand", "Olive"],
    specs: [
      ["Fits", "Pro & Lite"],
      ["Material", "Vegan leather"],
      ["Closure", "Magnetic"],
    ],
    rating: 4.8,
    reviews: 45,
  },
  {
    id: "neon-series",
    name: "Vapor Pro X Neon Series",
    price: 499,
    category: "Refillable",
    badge: "NEW",
    desc: "The limited-edition Neon Series. RGB pulse lighting, a 1500 mAh cell and our fastest chipset yet — numbered run of 2,000 units.",
    options: ["Neon Black", "Neon Blue"],
    specs: [
      ["Battery", "1500 mAh"],
      ["Output", "5–60 W"],
      ["Charging", "USB-C fast"],
    ],
    rating: 5.0,
    reviews: 12,
    hidden: true,
  },
];

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: "Processing" | "Shipped";
}

export const EU_COUNTRIES = [
  "Germany", "France", "Italy", "Spain", "Netherlands", "Belgium", "Austria",
  "Portugal", "Ireland", "Finland", "Denmark", "Sweden", "Poland", "Czechia",
  "Greece", "Hungary", "Romania",
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const GRID_PRODUCTS = PRODUCTS.filter((p) => !p.hidden);
export const yuan = (n: number) => `¥${n}`;
export const FREE_SHIPPING_THRESHOLD = 199;
export const SHIPPING_FEE = 15;
