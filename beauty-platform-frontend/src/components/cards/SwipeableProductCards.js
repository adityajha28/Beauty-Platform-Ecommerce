import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ProductCard from "./ProductCard";
import "./SwipeableProductCards.css"; 

export default function SwipeableProductCards({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="swipe-prod-wrapper">
      <Swiper
        spaceBetween={12}
        slidesPerView="auto" 
        grabCursor={true}
        className="app-swiper-container"
        breakpoints={{
          768: { spaceBetween: 20 },
        }}
      >
        {products.map(product => (
          <SwiperSlide key={product.id} className="app-swiper-slide">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}