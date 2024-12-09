'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function Slider({ data }) {
    // Tjek om slide_image findes
    if (!data || !data.slide_image || data.slide_image.length === 0) {
        console.warn('⚠️ Ingen slide_image fundet i data:', data);
        return null; // Returnerer intet, hvis der ikke er nogen billeder
    }

  

    return (
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]} 
            spaceBetween={20} 
            slidesPerView={3} 
            navigation 
            pagination={{ clickable: true }} 
            scrollbar={{ draggable: true }} 
        >
            {data.slide_image.map((image, index) => {
                // Brug KUN formats.thumbnail.url
                const imageUrl = image?.formats?.medium?.url;
                const altText = image?.alternativeText || `Billede ${index + 1}`;


                return (
                    <SwiperSlide key={index}>
                        {imageUrl ? (
                            <img 
                                src={imageUrl} 
                                alt={altText} 
                                className="w-full h-auto" 
                                onError={(e) => console.error('❌ Image load failed:', e.target.src)} 
                            />
                        ) : (
                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">Ingen billede</span>
                            </div>
                        )}
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
}
