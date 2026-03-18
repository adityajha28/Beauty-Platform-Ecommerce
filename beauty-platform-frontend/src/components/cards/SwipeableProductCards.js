import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import ProductCard from "./ProductCard";

function SwipeableProductCards({ products }) {

  return (

    <Swiper
      spaceBetween={15}
      slidesPerView={1.2}
      breakpoints={{
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 }
      }}
    >

      {products.map(product => (

        <SwiperSlide key={product.id}>

          <ProductCard product={product} />

        </SwiperSlide>

      ))}

    </Swiper>

  );

}

export default SwipeableProductCards;