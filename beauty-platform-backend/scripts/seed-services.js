/**
 * Seeds service categories, services, and default operations settings.
 */
require('dotenv').config();

const repo = require('../src/modules/services/services.repository');

const categories = [
  {
    id: 'cat_packages',
    name: 'Special Packages',
    slug: 'special-packages',
    image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=400',
    description: 'Curated multi-service packages',
    sortOrder: 0,
    isActive: true,
  },
  {
    id: 'cat_korean',
    name: 'Korean Special',
    slug: 'korean-special',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=400',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat_home',
    name: 'Salon At Home',
    slug: 'salon-at-home',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'cat_waxing',
    name: 'Waxing',
    slug: 'waxing',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'cat_facial',
    name: 'Hydra Facial',
    slug: 'hydra-facial',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=400',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'cat_hair',
    name: 'Hair Care',
    slug: 'hair-care',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=400',
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 'cat_makeup',
    name: 'Makeup',
    slug: 'makeup',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400',
    sortOrder: 6,
    isActive: true,
  },
];

const services = [
  {
    id: 'svc_party_makeup',
    categoryId: 'cat_makeup',
    name: 'Party Makeup',
    price: 2499,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600',
    description: 'HD party makeup at home with premium products.',
    isActive: true,
    isPopular: true,
    rating: '4.9',
    reviews: 320,
  },
  {
    id: 'svc_gold_facial',
    categoryId: 'cat_facial',
    name: '24K Gold Facial',
    price: 1999,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600',
    description: 'Luxury gold facial for radiant skin.',
    isActive: true,
    isPopular: true,
    rating: '4.8',
    reviews: 210,
  },
  {
    id: 'svc_full_arms_wax',
    categoryId: 'cat_waxing',
    name: 'Full Arms Waxing',
    price: 499,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600',
    description: 'Hygienic Rica wax, single-use kit.',
    isActive: true,
    isPopular: false,
    rating: '4.7',
    reviews: 180,
  },
  {
    id: 'svc_korean_cleanup',
    categoryId: 'cat_korean',
    name: 'Korean Deep Detox Cleanup',
    price: 1499,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600',
    description: 'Korean glass-skin cleanup ritual.',
    isActive: true,
    isPopular: true,
    rating: '4.9',
    reviews: 410,
  },
  {
    id: 'svc_hair_spa',
    categoryId: 'cat_hair',
    name: 'Hair Spa Treatment',
    price: 899,
    duration: 40,
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600',
    description: 'Deep conditioning hair spa at home.',
    isActive: true,
    isPopular: false,
    rating: '4.6',
    reviews: 95,
  },
  {
    id: 'svc_manicure',
    categoryId: 'cat_home',
    name: 'Vitamin C Manicure',
    price: 599,
    duration: 35,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600',
    description: 'Brightening manicure with vitamin C.',
    isActive: true,
    isPopular: false,
    rating: '4.5',
    reviews: 72,
  },
];

async function main() {
  console.log('Seeding services catalog...');

  for (const cat of categories) {
    await repo.upsertCategory(cat);
    console.log(`  category: ${cat.name}`);
  }

  for (const svc of services) {
    const cat = categories.find((c) => c.id === svc.categoryId);
    await repo.upsertService({ ...svc, categoryName: cat?.name });
    console.log(`  service: ${svc.name}`);
  }

  await repo.setOperations({
    servicesOpen: true,
    productsOpen: true,
    serviceMessage: 'Service bookings are temporarily paused. Please check back soon.',
    productMessage: 'Product orders are temporarily paused. Please check back soon.',
    globalBanner: '',
  });

  console.log('Services seed complete.');
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
