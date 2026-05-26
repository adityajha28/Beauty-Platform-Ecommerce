// src/pages/Home/Home.js
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";

import ExploreServicesSection from "../../sections/ExploreServicesSection/ExploreServicesSection";
import MostBookedSection from "../../sections/MostBookedSection/MostBookedSection";
import OffersStripeSection from "../../sections/OffersStripeSection/OffersStripeSection";
import PackagesSection from "../../sections/PackagesSection/PackagesSection";
import AdBannerSection from "../../sections/AdBannerSection/AdBannerSection";
import ProductsSection from "../../sections/ProductsSection/ProductsSection";
import ReviewsSection from "../../sections/ReviewsSection/ReviewsSection";

import Footer from "../../components/Footer/Footer";
import BottomNav from "../../components/BottomNav/BottomNav";
import CartPanel from "../../components/Cart/CartPanel";
import OperationsNotice from "../../components/OperationsNotice/OperationsNotice";

import {
  getServiceCategories,
  getProductCategories,
  getProducts,
  getApprovedReviews,
  getMakeupBanners,
  getOffers,
} from "../../services/cmsService";
import { fetchPopularServices } from "../../services/servicesCatalogService";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [mostBookedServices, setMostBookedServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [makeupBanners, setMakeupBanners] = useState([]);
  const [serviceOffers, setServiceOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [cats, popular, pCats, prods, revs, banners, offers] = await Promise.all([
          getServiceCategories(),
          fetchPopularServices(6),
          getProductCategories(),
          getProducts(),
          getApprovedReviews(),
          getMakeupBanners(),
          getOffers(),
        ]);

        setCategories(
          (cats || []).map((c) => ({
            id: c.id,
            name: c.name,
            image: c.image,
          }))
        );

        setMostBookedServices(
          (popular || []).map((s) => ({
            id: s.id,
            name: s.name,
            category: s.category || cats?.find((c) => c.id === s.categoryId)?.name || "",
            price: s.price,
            duration: s.duration,
            image: s.image,
          }))
        );

        setProducts(
          (prods || []).slice(0, 8).map((p) => ({
            id: p.id,
            name: p.name,
            category: pCats?.find((c) => c.id === p.categoryId)?.name || "",
            price: p.price,
            rating: p.rating || 4.8,
            image: p.image,
            badge: p.badge,
          }))
        );

        setPackages([]);

        setReviews(
          (revs || []).map((r) => ({
            id: r.id,
            name: r.name,
            rating: r.rating,
            service: r.targetName || r.service || r.targetType,
            text: r.text,
          }))
        );

        setMakeupBanners(banners || []);
        setServiceOffers(offers || []);
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
        <OperationsNotice scope="all" />
        <Hero />

        {!isLoading && <ExploreServicesSection categories={categories} />}
        {!isLoading && <MostBookedSection services={mostBookedServices} />}
        {!isLoading && <OffersStripeSection offers={serviceOffers} />}
        {!isLoading && <PackagesSection packages={packages} />}
        {!isLoading && <AdBannerSection banners={makeupBanners} />}
        {!isLoading && <ProductsSection products={products} />}
        {!isLoading && <ReviewsSection reviews={reviews} />}
      </main>

      <Footer />
      <BottomNav />
      <CartPanel />
    </div>
  );
}
