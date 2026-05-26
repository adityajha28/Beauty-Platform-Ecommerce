require('dotenv').config();

const contentRepo = require('../src/modules/content/content.repository');
const productsRepo = require('../src/modules/products/products.repository');
const { COLLECTIONS } = require('../src/modules/content/content.service');

async function main() {
  console.log('Seeding CMS content & products...');

  const offers = [
    {
      id: 'off_1',
      title: 'Bridal Radiance',
      badge: 'EXCLUSIVE',
      description: '20% off bridal season.',
      code: 'BRIDE20',
      discountPercent: 20,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400',
      link: '/services?category=Makeup',
      isActive: true,
      sortOrder: 1,
    },
    {
      id: 'off_2',
      title: 'Premium Skincare',
      badge: 'COUPON',
      description: 'Flat ₹500 off. Code: GLOW500',
      code: 'GLOW500',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400',
      link: '/products',
      isActive: true,
      sortOrder: 2,
    },
  ];

  for (const o of offers) {
    await contentRepo.upsert(COLLECTIONS.offers, o);
    console.log(`  offer: ${o.title}`);
  }

  const slides = [
    { id: 'hero_1', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600', sortOrder: 1, isActive: true },
    { id: 'hero_2', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1600', sortOrder: 2, isActive: true },
    { id: 'hero_3', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1600', sortOrder: 3, isActive: true },
  ];
  for (const s of slides) {
    await contentRepo.upsert(COLLECTIONS.heroSlides, s);
  }
  console.log(`  hero slides: ${slides.length}`);

  const banners = [
    {
      id: 'mk_1',
      title: 'Flawless Party Makeup',
      subtitle: 'At-home artists · Nagpur',
      badge: 'Signature Service',
      description: 'Book certified MUAs for parties & events.',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1400',
      ctaLabel: 'Book Makeup',
      link: '/services?category=Makeup',
      sortOrder: 1,
      isActive: true,
    },
  ];
  for (const b of banners) {
    await contentRepo.upsert(COLLECTIONS.makeupBanners, b);
  }

  await contentRepo.upsert(COLLECTIONS.reviews, {
    id: 'rev_1',
    name: 'Priya Sharma',
    rating: 5,
    targetType: 'service',
    targetName: 'Bridal Makeup',
    text: 'Flawless for 12 hours!',
    status: 'approved',
    isActive: true,
  });

  const pCats = [
    { id: 'pcat_skin', name: 'Skincare', slug: 'skincare', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400', sortOrder: 1, isActive: true },
    { id: 'pcat_hair', name: 'Haircare', slug: 'haircare', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400', sortOrder: 2, isActive: true },
    { id: 'pcat_makeup', name: 'Makeup', slug: 'makeup-products', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=400', sortOrder: 3, isActive: true },
  ];
  for (const c of pCats) {
    await productsRepo.upsertCategory(c);
  }

  const products = [
    { id: 'prd_1', categoryId: 'pcat_skin', name: 'Vitamin C Serum', price: 899, stock: 50, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400', description: 'Brightening serum.', badge: 'Bestseller', isActive: true },
    { id: 'prd_2', categoryId: 'pcat_hair', name: 'Keratin Hair Mask', price: 649, stock: 40, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400', description: 'Deep repair mask.', isActive: true },
    { id: 'prd_3', categoryId: 'pcat_makeup', name: 'Matte Lip Kit', price: 1299, stock: 25, image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=400', description: 'Long-wear lip collection.', badge: 'New', isActive: true },
  ];
  for (const p of products) {
    const cat = pCats.find((c) => c.id === p.categoryId);
    await productsRepo.upsertProduct({ ...p, categoryName: cat?.name });
    console.log(`  product: ${p.name}`);
  }

  console.log('Content seed complete.');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
