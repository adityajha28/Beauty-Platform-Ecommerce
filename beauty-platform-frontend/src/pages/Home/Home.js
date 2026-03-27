// src/pages/Home/Home.js
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";

import ExploreServicesSection from "../../sections/ExploreServicesSection/ExploreServicesSection";
import MostBookedSection from "../../sections/MostBookedSection/MostBookedSection";
import PackagesSection from "../../sections/PackagesSection/PackagesSection";
import AdBannerSection from "../../sections/AdBannerSection/AdBannerSection"; // Upgraded UI
import ProductsSection from "../../sections/ProductsSection/ProductsSection";
import ReviewsSection from "../../sections/ReviewsSection/ReviewsSection";

import Footer from "../../components/Footer/Footer";
import BottomNav from "../../components/BottomNav/BottomNav";
import CartPanel from "../../components/Cart/CartPanel";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [mostBookedServices, setMostBookedServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ─── BACKEND INTEGRATION POINT ───
  useEffect(() => {
    async function fetchHomeData() {
      try {
        // Mock Categories
        setCategories([
          { id: 1, name: "Waxing", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400" },
          { id: 2, name: "Facial", image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=400" },
          { id: 3, name: "Mani-Pedi", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=400" },
          { id: 4, name: "D-Tan", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400" },
          { id: 5, name: "Body Polish", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=400" },
          { id: 6, name: "Hair Care", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=400" },
          { id: 7, name: "Makeup", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400" },
          { id: 8, name: "Packages", image: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=400" },
        ]);

        // Mock Most Booked Services
        setMostBookedServices([
          { id: 101, name: "Signature HD Bridal", category: "Makeup", price: 15000, duration: 120, image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400" },
          { id: 102, name: "Keratin Spa", category: "Hair", price: 4000, duration: 90, image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=400" },
          { id: 103, name: "24K Gold Facial", category: "Facial", price: 3500, duration: 60, image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=400" },
        ]);

        // Mock Packages Data
        setPackages([
          { id: 201, name: "Pre-Bridal Radiance", price: 5999, originalPrice: 8000, discount: "25%", servicesIncluded: ["Gold Facial", "Full Body Wax", "Spa Pedicure"], image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600" },
          { id: 202, name: "Monthly Refresh", price: 1999, originalPrice: 2500, discount: "20%", servicesIncluded: ["Fruit Facial", "Threading", "Basic Manicure"], image: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=600" },
        ]);

        // Mock Products
        setProducts([
          { id: 1, name: "Vitamin C Serum", category: "Skincare", price: 899, rating: 4.8, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400", badge: "Bestseller" },
          { id: 2, name: "Luxury Face Cream", category: "Skincare", price: 1299, rating: 5.0, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400" },
          { id: 3, name: "Hair Repair Oil", category: "Haircare", price: 699, rating: 4.5, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400" },
        ]);

        // Mock Reviews Data
        setReviews([
          { id: 1, name: "Priya Sharma", rating: 5, service: "Bridal Makeup", text: "The team was incredibly professional. My makeup stayed flawless for 12 hours straight!" },
          { id: 2, name: "Aarti Singh", rating: 5, service: "Keratin Spa", text: "Loved the home service. My hair has never felt this smooth and silky. Highly recommend." },
          { id: 3, name: "Neha Gupta", rating: 4, service: "24K Gold Facial", text: "Very relaxing experience. The beautician was polite and carried all hygiene equipment." },
        ]);

      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  return (
    <div className="app-layout">
      <Navbar />
      
      <main className="main-content" style={{ paddingBottom: "80px" }}>
        <Hero />
        
        {!isLoading && <ExploreServicesSection categories={categories} />}
        {!isLoading && <MostBookedSection services={mostBookedServices} />} 
        {!isLoading && <PackagesSection packages={packages} />}

        {/* UPGRADED: Makeup Ad Banner */}
        {!isLoading && <AdBannerSection />}

        {!isLoading && <ProductsSection products={products} />} 
        
        {/* BookingSection REMOVED as requested */}

        {!isLoading && <ReviewsSection reviews={reviews} />}
      </main>

      <Footer />
      <BottomNav />
      <CartPanel />
    </div>
  );
}