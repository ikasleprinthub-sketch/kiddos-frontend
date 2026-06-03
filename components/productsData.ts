export interface Product {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  emoji: string;
  image?: string;
  image2?: string;
  gradient: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  isVeg: boolean;
  weightOrQty: string;
  tags: string[];
  slug?: string;
  stock?: number;
}

export interface CategoryInfo {
  slug: string;
  label: string;
  emoji: string;
  gradient: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "batter",
    label: "Batter",
    emoji: "🫙",
    gradient: "from-amber-100 to-orange-200",
    description: "Stone-ground fermented batters with no preservatives."
  },
  {
    slug: "spice-blends",
    label: "Spice Blends",
    emoji: "🌶️",
    gradient: "from-red-100 to-rose-200",
    description: "Aromatic home-style spice mixes for authentic flavors."
  },
  {
    slug: "raw-spices",
    label: "Raw Spices",
    emoji: "🌿",
    gradient: "from-green-100 to-emerald-200",
    description: "Sourced directly from the finest organic farms."
  },
  {
    slug: "oils",
    label: "Oils",
    emoji: "🫒",
    gradient: "from-yellow-100 to-lime-200",
    description: "Cold-pressed, wood-pressed pure oils for healthy cooking."
  },
  {
    slug: "pickles",
    label: "Pickles",
    emoji: "🥒",
    gradient: "from-teal-100 to-green-200",
    description: "Traditional sun-dried pickles prepared with Amma's recipe."
  },
  {
    slug: "chutney-book",
    label: "Chutney Book",
    emoji: "📖",
    gradient: "from-orange-100 to-amber-200",
    description: "Unlock secret chutney recipes passed down through generations."
  },
  {
    slug: "millets",
    label: "Millets",
    emoji: "🌾",
    gradient: "from-yellow-50 to-yellow-200",
    description: "Nutritious and fiber-rich ancient grains for daily wellness."
  },
  {
    slug: "rice",
    label: "Rice",
    emoji: "🍚",
    gradient: "from-sky-100 to-blue-200",
    description: "Heritage and unpolished traditional rice varieties."
  },
  {
    slug: "ghee",
    label: "Ghee",
    emoji: "🧈",
    gradient: "from-amber-50 to-yellow-200",
    description: "Pure, aromatic A2 desi cow ghee cooked slowly."
  },
  {
    slug: "honey",
    label: "Honey",
    emoji: "🍯",
    gradient: "from-orange-100 to-yellow-300",
    description: "100% raw wild forest honey, unprocessed and sweet."
  },
  {
    slug: "snacks",
    label: "Snacks",
    emoji: "🥜",
    gradient: "from-stone-100 to-amber-200",
    description: "Guilt-free, baked and roasted snacks for the whole family."
  },
  {
    slug: "masala",
    label: "Masala",
    emoji: "✨",
    gradient: "from-purple-100 to-pink-200",
    description: "Secret spice formulations to elevate everyday dishes."
  }
];

export const PRODUCTS: Product[] = [
  // ── BATTER ──
  {
    id: "bat-01",
    name: "Sprouted Ragi Dosa Batter",
    category: "batter",
    categoryLabel: "Batter",
    description: "High-calcium sprouted finger millet batter. Zero soda, zero preservatives.",
    price: 120,
    originalPrice: 145,
    rating: 4.9,
    reviewsCount: 142,
    emoji: "🫙",
    gradient: "from-amber-100 to-orange-200",
    isBestSeller: true,
    isVeg: true,
    weightOrQty: "1 kg",
    tags: ["Millet", "Gluten-Free", "Healthy"]
  },
  {
    id: "bat-02",
    name: "Multi-Millet Dosa Batter",
    category: "batter",
    categoryLabel: "Batter",
    description: "A superfood blend of Kodo, Foxtail, Barnyard, and Little Millets.",
    price: 140,
    rating: 4.8,
    reviewsCount: 88,
    emoji: "🫙",
    gradient: "from-amber-100 to-orange-200",
    isNew: true,
    isVeg: true,
    weightOrQty: "1 kg",
    tags: ["High Fiber", "Millets", "Superfood"]
  },
  {
    id: "bat-03",
    name: "Classic Homestyle Idli Batter",
    category: "batter",
    categoryLabel: "Batter",
    description: "Perfectly fermented stone-ground batter for pillowy-soft idlis.",
    price: 90,
    originalPrice: 105,
    rating: 4.7,
    reviewsCount: 310,
    emoji: "🫙",
    gradient: "from-amber-100 to-orange-200",
    isVeg: true,
    weightOrQty: "1 kg",
    tags: ["Traditional", "Fermented"]
  },
  {
    id: "bat-04",
    name: "Beetroot & Carrot Idli Batter",
    category: "batter",
    categoryLabel: "Batter",
    description: "Naturally colorful and packed with vitamins. Kids' absolute favorite!",
    price: 110,
    rating: 4.9,
    reviewsCount: 74,
    emoji: "🫙",
    gradient: "from-amber-100 to-orange-200",
    isVeg: true,
    weightOrQty: "800g",
    tags: ["Kids Special", "Vitamins", "Colorful"]
  },

  // ── SPICE BLENDS ──
  {
    id: "spc-01",
    name: "Premium Gunpowder (Podi)",
    category: "spice-blends",
    categoryLabel: "Spice Blends",
    description: "Traditional spicy lentil powder roasted in pure sesame oil.",
    price: 150,
    originalPrice: 180,
    rating: 4.9,
    reviewsCount: 195,
    emoji: "🌶️",
    gradient: "from-red-100 to-rose-200",
    isBestSeller: true,
    isVeg: true,
    weightOrQty: "250g",
    tags: ["Spicy", "Authentic"]
  },
  {
    id: "spc-02",
    name: "Sambar Masala Powder",
    category: "spice-blends",
    categoryLabel: "Spice Blends",
    description: "Handcrafted spice blend for the perfect, fragrant hotel-style Sambar.",
    price: 120,
    rating: 4.6,
    reviewsCount: 92,
    emoji: "🌶️",
    gradient: "from-red-100 to-rose-200",
    isVeg: true,
    weightOrQty: "200g",
    tags: ["Home-Style", "Fragrant"]
  },

  // ── RAW SPICES ──
  {
    id: "raw-01",
    name: "Organic Turmeric Powder",
    category: "raw-spices",
    categoryLabel: "Raw Spices",
    description: "High-curcumin heirloom turmeric, freshly ground and pure.",
    price: 95,
    rating: 4.8,
    reviewsCount: 115,
    emoji: "🌿",
    gradient: "from-green-100 to-emerald-200",
    isVeg: true,
    weightOrQty: "200g",
    tags: ["Organic", "High Curcumin"]
  },
  {
    id: "raw-02",
    name: "Salem Black Pepper Bold",
    category: "raw-spices",
    categoryLabel: "Raw Spices",
    description: "Sun-dried bold black peppercorns with a spicy, intense aroma.",
    price: 180,
    originalPrice: 200,
    rating: 4.8,
    reviewsCount: 63,
    emoji: "🌿",
    gradient: "from-green-100 to-emerald-200",
    isVeg: true,
    weightOrQty: "150g",
    tags: ["Premium", "Aromatic"]
  },

  // ── OILS ──
  {
    id: "oil-01",
    name: "Cold-Pressed Sesame Oil",
    category: "oils",
    categoryLabel: "Oils",
    description: "Traditional wood-pressed (Marachekku) oil made with organic palm jaggery.",
    price: 350,
    originalPrice: 395,
    rating: 4.9,
    reviewsCount: 154,
    emoji: "🫒",
    gradient: "from-yellow-100 to-lime-200",
    isBestSeller: true,
    isVeg: true,
    weightOrQty: "500ml",
    tags: ["Wood-Pressed", "Organic Jaggery"]
  },
  {
    id: "oil-02",
    name: "Cold-Pressed Coconut Oil",
    category: "oils",
    categoryLabel: "Oils",
    description: "Pure, edible-grade cold-pressed coconut oil from sun-dried copra.",
    price: 310,
    rating: 4.7,
    reviewsCount: 104,
    emoji: "🫒",
    gradient: "from-yellow-100 to-lime-200",
    isVeg: true,
    weightOrQty: "500ml",
    tags: ["Pure", "Edible Grade"]
  },

  // ── PICKLES ──
  {
    id: "pck-01",
    name: "Homemade Mango Avakaya",
    category: "pickles",
    categoryLabel: "Pickles",
    description: "Traditional Andhra-style raw mango pickle made with wood-pressed oil.",
    price: 160,
    originalPrice: 190,
    rating: 4.9,
    reviewsCount: 220,
    emoji: "🥒",
    gradient: "from-teal-100 to-green-200",
    isBestSeller: true,
    isVeg: true,
    weightOrQty: "300g",
    tags: ["Andhra Style", "Spicy"]
  },
  {
    id: "pck-02",
    name: "Spicy Garlic Pickle",
    category: "pickles",
    categoryLabel: "Pickles",
    description: "Slow-matured garlic cloves infused in spicy tamarind and chili paste.",
    price: 150,
    rating: 4.8,
    reviewsCount: 89,
    emoji: "🥒",
    gradient: "from-teal-100 to-green-200",
    isVeg: true,
    weightOrQty: "300g",
    tags: ["Immunity", "Tangy"]
  },

  // ── CHUTNEY BOOK ──
  {
    id: "bkh-01",
    name: "101 Traditional Chutneys Book",
    category: "chutney-book",
    categoryLabel: "Chutney Book",
    description: "A beautifully illustrated guide detailing 101 authentic South Indian chutney recipes.",
    price: 399,
    originalPrice: 499,
    rating: 5.0,
    reviewsCount: 48,
    emoji: "📖",
    gradient: "from-orange-100 to-amber-200",
    isBestSeller: true,
    isVeg: true,
    weightOrQty: "Hardcover Book",
    tags: ["Recipes", "Gifting"]
  },

  // ── MILLETS ──
  {
    id: "mil-01",
    name: "Organic Foxtail Millet",
    category: "millets",
    categoryLabel: "Millets",
    description: "De-husked, premium organic foxtail millet. Packed with protein.",
    price: 110,
    rating: 4.6,
    reviewsCount: 75,
    emoji: "🌾",
    gradient: "from-yellow-50 to-yellow-200",
    isVeg: true,
    weightOrQty: "1 kg",
    tags: ["Gluten-Free", "Low GI"]
  },
  {
    id: "mil-02",
    name: "Premium Kodo Millet",
    category: "millets",
    categoryLabel: "Millets",
    description: "Traditionally processed grains rich in dietary fiber and antioxidants.",
    price: 115,
    rating: 4.7,
    reviewsCount: 52,
    emoji: "🌾",
    gradient: "from-yellow-50 to-yellow-200",
    isVeg: true,
    weightOrQty: "1 kg",
    tags: ["Ancient Grain", "Antioxidants"]
  },

  // ── RICE ──
  {
    id: "ric-01",
    name: "Heritage Mapillai Samba Rice",
    category: "rice",
    categoryLabel: "Rice",
    description: "Traditional red rice variety that builds stamina and boosts immunity.",
    price: 160,
    originalPrice: 195,
    rating: 4.8,
    reviewsCount: 136,
    emoji: "🍚",
    gradient: "from-sky-100 to-blue-200",
    isBestSeller: true,
    isVeg: true,
    weightOrQty: "1 kg",
    tags: ["Stamina", "Unpolished", "Traditional"]
  },
  {
    id: "ric-02",
    name: "Karuppu Kavuni Black Rice",
    category: "rice",
    categoryLabel: "Rice",
    description: "Royal black rice rich in Anthocyanins. Ideal for sweet pongal and puddings.",
    price: 220,
    rating: 4.9,
    reviewsCount: 84,
    emoji: "🍚",
    gradient: "from-sky-100 to-blue-200",
    isNew: true,
    isVeg: true,
    weightOrQty: "1 kg",
    tags: ["Royal Rice", "Anthocyanins"]
  },

  // ── GHEE ──
  {
    id: "ghe-01",
    name: "A2 Desi Cow Ghee (Premium)",
    category: "ghee",
    categoryLabel: "Ghee",
    description: "Pure Bilona method ghee from grass-fed Gir cows. Golden and granular.",
    price: 650,
    originalPrice: 750,
    rating: 4.9,
    reviewsCount: 245,
    emoji: "🧈",
    gradient: "from-amber-50 to-yellow-200",
    isBestSeller: true,
    isVeg: true,
    weightOrQty: "500ml",
    tags: ["Gir Cow A2", "Bilona Method", "Premium"]
  },
  {
    id: "ghe-02",
    name: "Pure Vedic Buffalo Ghee",
    category: "ghee",
    categoryLabel: "Ghee",
    description: "Aromatic white ghee prepared in small batches from local buffalo milk.",
    price: 480,
    rating: 4.7,
    reviewsCount: 68,
    emoji: "🧈",
    gradient: "from-amber-50 to-yellow-200",
    isVeg: true,
    weightOrQty: "500ml",
    tags: ["Aromatic", "Small Batch"]
  },

  // ── HONEY ──
  {
    id: "hny-01",
    name: "Raw Wild Forest Honey",
    category: "honey",
    categoryLabel: "Honey",
    description: "Unpasteurized, dark wild honey collected from deep forest beehives.",
    price: 280,
    originalPrice: 320,
    rating: 4.9,
    reviewsCount: 112,
    emoji: "🍯",
    gradient: "from-orange-100 to-yellow-300",
    isBestSeller: true,
    isVeg: true,
    weightOrQty: "500g",
    tags: ["Raw", "Wild Forest"]
  },
  {
    id: "hny-02",
    name: "Organic Tulsi Infused Honey",
    category: "honey",
    categoryLabel: "Honey",
    description: "Natural honey infused with organic Tulsi leaves. Perfect for cough and cold.",
    price: 320,
    rating: 4.8,
    reviewsCount: 45,
    emoji: "🍯",
    gradient: "from-orange-100 to-yellow-300",
    isNew: true,
    isVeg: true,
    weightOrQty: "250g",
    tags: ["Tulsi", "Immunity Boost"]
  },

  // ── SNACKS ──
  {
    id: "snk-01",
    name: "Baked Millet Murukku",
    category: "snacks",
    categoryLabel: "Snacks",
    description: "Crispy and light murukku made with millets, baked to perfection.",
    price: 80,
    rating: 4.7,
    reviewsCount: 167,
    emoji: "🥜",
    gradient: "from-stone-100 to-amber-200",
    isBestSeller: true,
    isVeg: true,
    weightOrQty: "150g",
    tags: ["Baked", "Low Fat", "Snack Time"]
  },
  {
    id: "snk-02",
    name: "Roasted Makhana (Salt & Pepper)",
    category: "snacks",
    categoryLabel: "Snacks",
    description: "Crunchy fox nuts lightly roasted with olive oil, salt, and pepper.",
    price: 90,
    originalPrice: 110,
    rating: 4.6,
    reviewsCount: 124,
    emoji: "🥜",
    gradient: "from-stone-100 to-amber-200",
    isVeg: true,
    weightOrQty: "80g",
    tags: ["Roasted", "Diet Friendly"]
  },
  {
    id: "snk-03",
    name: "Homemade Ragi Chips",
    category: "snacks",
    categoryLabel: "Snacks",
    description: "Crunchy baked ragi chips spiced with native chili and cumin.",
    price: 75,
    rating: 4.8,
    reviewsCount: 96,
    emoji: "🥜",
    gradient: "from-stone-100 to-amber-200",
    isNew: true,
    isVeg: true,
    weightOrQty: "120g",
    tags: ["Baked", "Calcium Rich"]
  },

  // ── MASALA ──
  {
    id: "msl-01",
    name: "Kiddos Secret Garam Masala",
    category: "masala",
    categoryLabel: "Masala",
    description: "A secret blend of 15 premium spices roasted and ground by hand.",
    price: 145,
    originalPrice: 170,
    rating: 4.9,
    reviewsCount: 153,
    emoji: "✨",
    gradient: "from-purple-100 to-pink-200",
    isBestSeller: true,
    isVeg: true,
    weightOrQty: "150g",
    tags: ["Secret Recipe", "Hand-ground"]
  },
  {
    id: "msl-02",
    name: "Bisi Bele Bath Powder",
    category: "masala",
    categoryLabel: "Masala",
    description: "Authentic Karnataka style spice mix for hot lentil rice.",
    price: 135,
    rating: 4.8,
    reviewsCount: 78,
    emoji: "✨",
    gradient: "from-purple-100 to-pink-200",
    isVeg: true,
    weightOrQty: "200g",
    tags: ["Karnataka Style", "Authentic"]
  }
];
