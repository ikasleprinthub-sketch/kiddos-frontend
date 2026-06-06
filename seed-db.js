const { Client } = require('C:/Users/Administrator/Documents/KiddosFood/kiddos-backend/node_modules/pg');
const crypto = require('crypto');

const client = new Client({
  connectionString: 'postgresql://kiddos_user:kiddos_pass@localhost:5433/kiddos_db'
});

const CATEGORIES = [
  { slug: "batter", label: "Batter", image: "/uploads/categories/b973a928-8d0a-40f5-898a-f688acaa939a.png" },
  { slug: "spice-blends", label: "Spice Blends", image: "/uploads/categories/04b57325-8a9d-4443-935e-025946b7a410.png" },
  { slug: "raw-spices", label: "Raw Spices", image: null },
  { slug: "oils", label: "Oils", image: "/uploads/categories/f3d85cdb-362b-4fa7-9d06-419449bf3643.png" },
  { slug: "pickles", label: "Pickles", image: null },
  { slug: "chutney-book", label: "Chutney Book", image: null },
  { slug: "millets", label: "Millets", image: "/uploads/categories/325af53d-b6fb-4b12-99b2-6169a0d39923.png" },
  { slug: "rice", label: "Rice", image: null },
  { slug: "ghee", label: "Ghee", image: null },
  { slug: "honey", label: "Honey", image: null },
  { slug: "snacks", label: "Snacks", image: null },
  { slug: "masala", label: "Masala", image: null }
];

const PRODUCTS = [
  // Batter
  { id: "bat-01", name: "Sprouted Ragi Dosa Batter", category: "batter", description: "High-calcium sprouted finger millet batter. Zero soda, zero preservatives.", price: 120, salePrice: 105, isFeatured: true, isPopularBatter: true, weight: 1.0, unit: "kg", tags: ["Millet", "Gluten-Free", "Healthy"] },
  { id: "bat-02", name: "Multi-Millet Dosa Batter", category: "batter", description: "A superfood blend of Kodo, Foxtail, Barnyard, and Little Millets.", price: 140, salePrice: null, isFeatured: true, isPopularBatter: true, weight: 1.0, unit: "kg", tags: ["High Fiber", "Millets", "Superfood"] },
  { id: "bat-03", name: "Classic Homestyle Idli Batter", category: "batter", description: "Perfectly fermented stone-ground batter for pillowy-soft idlis.", price: 90, salePrice: null, isFeatured: false, isPopularBatter: true, weight: 1.0, unit: "kg", tags: ["Traditional", "Fermented"] },
  { id: "bat-04", name: "Beetroot & Carrot Idli Batter", category: "batter", description: "Naturally colorful and packed with vitamins. Kids' absolute favorite!", price: 110, salePrice: null, isFeatured: false, isPopularBatter: true, weight: 0.8, unit: "g", tags: ["Kids Special", "Vitamins", "Colorful"] },
  // Spice Blends
  { id: "spc-01", name: "Premium Gunpowder (Podi)", category: "spice-blends", description: "Traditional spicy lentil powder roasted in pure sesame oil.", price: 150, salePrice: 130, isFeatured: true, isSpiceOil: true, weight: 0.25, unit: "g", tags: ["Spicy", "Authentic"] },
  { id: "spc-02", name: "Sambar Masala Powder", category: "spice-blends", description: "Handcrafted spice blend for the perfect, fragrant hotel-style Sambar.", price: 120, salePrice: null, isFeatured: false, isSpiceOil: true, weight: 0.2, unit: "g", tags: ["Home-Style", "Fragrant"] },
  // Oils
  { id: "oil-01", name: "Cold-Pressed Sesame Oil", category: "oils", description: "Traditional wood-pressed (Marachekku) oil made with organic palm jaggery.", price: 350, salePrice: 310, isFeatured: true, isSpiceOil: true, weight: 0.5, unit: "ml", tags: ["Wood-Pressed", "Organic Jaggery"] },
  { id: "oil-02", name: "Cold-Pressed Coconut Oil", category: "oils", description: "Pure, edible-grade cold-pressed coconut oil from sun-dried copra.", price: 310, salePrice: null, isFeatured: false, isSpiceOil: true, weight: 0.5, unit: "ml", tags: ["Pure", "Edible Grade"] },
  // Millets
  { id: "mil-01", name: "Organic Foxtail Millet", category: "millets", description: "De-husked, premium organic foxtail millet. Packed with protein.", price: 110, salePrice: null, isFeatured: true, isSpiceOil: false, weight: 1.0, unit: "kg", tags: ["Gluten-Free", "Low GI"] },
  { id: "mil-02", name: "Premium Kodo Millet", category: "millets", description: "Traditionally processed grains rich in dietary fiber and antioxidants.", price: 115, salePrice: null, isFeatured: false, isSpiceOil: false, weight: 1.0, unit: "kg", tags: ["Ancient Grain", "Antioxidants"] }
];

async function seed() {
  await client.connect();
  console.log("Connected to database.");

  // Clean tables
  await client.query("DELETE FROM product_images");
  await client.query("DELETE FROM products");
  await client.query("DELETE FROM categories");
  console.log("Cleaned tables.");

  // Insert categories
  const categoryIdMap = {};
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const id = crypto.randomUUID();
    categoryIdMap[cat.slug] = id;
    
    await client.query(
      `INSERT INTO categories (id, name, slug, description, image, "isActive", "sortOrder", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [id, cat.label, cat.slug, `Organic ${cat.label} category.`, cat.image, true, i]
    );
    console.log(`Inserted category: ${cat.label}`);
  }

  // Insert products
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    const id = crypto.randomUUID();
    const categoryId = categoryIdMap[p.category];
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sku = `SKU-${p.id.toUpperCase()}`;

    await client.query(
      `INSERT INTO products (
        id, name, slug, description, price, "salePrice", stock, sku, "categoryId", 
        "isActive", "isFeatured", weight, unit, tags, "isPopularBatter", "isSpiceOil", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())`,
      [
        id, p.name, slug, p.description, p.price, p.salePrice, 100, sku, categoryId,
        true, p.isFeatured, p.weight, p.unit, p.tags, p.isPopularBatter || false, p.isSpiceOil || false
      ]
    );
    console.log(`Inserted product: ${p.name}`);
  }

  console.log("Seeding complete!");
  await client.end();
}

seed().catch(e => {
  console.error("Seeding error:", e);
  client.end();
});
