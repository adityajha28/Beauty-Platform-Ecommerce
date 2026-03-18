import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

function SwipeSection({items,renderItem}){

return(

<Swiper

spaceBetween={10}
slidesPerView={1.2}

breakpoints={{
768:{slidesPerView:2},
1024:{slidesPerView:4}
}}

>

{items.map((item,index)=>(

<SwiperSlide key={index}>

{renderItem(item)}

</SwiperSlide>

))}

</Swiper>

)

}

export default SwipeSection