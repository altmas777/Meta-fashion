const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const dummyProducts = [
  {
    name: "Obsidian Chronograph Watch",
    description: "A masterclass in horology, featuring a matte black finish with subtle gold accents and a sapphire crystal face.",
    price: 1250,
    discountPrice: 950,
    category: "Fashion",
    stock: 15,
    images: [{ url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop&q=80", publicId: "" }],
    ratings: { average: 4.8, count: 24 }
  },
  {
    name: "Aura Noise-Cancelling Headphones",
    description: "Immerse yourself in unparalleled sound quality. Crafted from premium materials for ultimate comfort and durability.",
    price: 450,
    category: "Electronics",
    stock: 30,
    images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", publicId: "" }],
    ratings: { average: 4.9, count: 112 }
  },
  {
    name: "Midnight Velvet Lounge Chair",
    description: "Elegant, sophisticated, and incredibly comfortable. This lounge chair is the perfect centerpiece for a modern living space.",
    price: 1800,
    discountPrice: 1500,
    category: "Home",
    stock: 5,
    images: [{ url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop&q=80", publicId: "" }],
    ratings: { average: 5.0, count: 8 }
  },
  {
    name: "24k Gold Infused Serum",
    description: "Rejuvenate your skin with our signature anti-aging serum, infused with pure 24k gold flakes.",
    price: 120,
    category: "Beauty",
    stock: 50,
    images: [{ url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80", publicId: "" }],
    ratings: { average: 4.6, count: 45 }
  },
  {
    name: "Carbon Fiber Tennis Racket",
    description: "Experience unmatched power and control on the court with this ultra-lightweight, aerodynamic racket.",
    price: 250,
    category: "Sports",
    stock: 20,
    images: [{ url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=80", publicId: "" }],
    ratings: { average: 4.7, count: 18 }
  },
  {
    name: "Onyx Leather Tote Bag",
    description: "Handcrafted from full-grain Italian leather, featuring a minimalist design suitable for any occasion.",
    price: 450,
    category: "Fashion",
    stock: 12,
    images: [{ url: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&auto=format&fit=crop&q=80", publicId: "" }],
    ratings: { average: 4.5, count: 32 }
  },
  {
    name: "Smart Home Hub Pro",
    description: "Control your entire home ecosystem from this sleek, glass-finished command center.",
    price: 299,
    discountPrice: 249,
    category: "Electronics",
    stock: 45,
    images: [{ url: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&auto=format&fit=crop&q=80", publicId: "" }],
    ratings: { average: 4.3, count: 88 }
  },
  {
    name: "Eclat Perfume Extrait",
    description: "A deep, intoxicating fragrance featuring notes of oud, amber, and dark rose.",
    price: 185,
    category: "Beauty",
    stock: 25,
    images: [{ url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80", publicId: "" }],
    ratings: { average: 4.9, count: 56 }
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding products...');

    await Product.deleteMany({});
    console.log('Cleared existing products.');

    await Product.insertMany(dummyProducts);
    console.log('Successfully inserted dummy products!');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
