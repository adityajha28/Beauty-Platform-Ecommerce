import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import ServicesSection from "../../sections/ServicesSection/ServicesSection";
import ProductsSection from "../../sections/ProductsSection/ProductsSection";
import BookingSection from "../../sections/BookingSection/BookingSection";
import Footer from "../../components/Footer/Footer";
import BottomNav from "../../components/BottomNav/BottomNav";
import CartPanel from "../../components/Cart/CartPanel";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ServicesSection /> 
      <ProductsSection /> 
      <BookingSection /> 
      <Footer />
      <BottomNav />
      <CartPanel />
    </>
  );
}

export default Home;