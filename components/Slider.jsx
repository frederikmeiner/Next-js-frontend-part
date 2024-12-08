'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function Slider({ data }) {
  if (!data || !data.slide_image) {
    return null; // Returnerer intet, hvis der ikke er nogen billeder
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]} // Swiper moduler aktiveret
      spaceBetween={20} // Afstand mellem slides
      slidesPerView={3} // Antal slides, der vises ad gangen
      navigation // Næste og forrige knapper
      pagination={{ clickable: true }} // Aktiver pagination-knapper
      scrollbar={{ draggable: true }} // Gør scrollbar dragbar
    >
      {data.slide_image.map((image, index) => (
        <SwiperSlide key={index}>
           <img 
            src={`${process.env.NEXT_PUBLIC_API_URL}${image?.url}`} 
            alt={image?.alternativeText || `Billede ${index + 1}`} 
            className="w-full h-auto" 
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
