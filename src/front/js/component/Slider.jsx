import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import '../../styles/Slider2.css';
import slide_image_1 from "../../img/img_1.jpg"
import slide_image_2 from "../../img/img_2.jpg"
import slide_image_3 from "../../img/img_3.jpg"
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import Card from "./Card.jsx";
import EmailModal from "./EmailModal.jsx";


const Slider = ({ slides }) => {
    return (
        <>
            {slides.map((item) => (
                <EmailModal
                    announcementID={item.id}
                    imgURL={item.images?.[0] || '../../img/placeholder-image.jpg'}
                    price={item.price}
                    size={item.size}
                    address={item.location}
                    imgOwner={item.user?.photo_profile || '../../img/placeholder-profile.jpg'}
                    owner={item.user?.name || 'Usuario'}
                    ownerPhoneNumber={item.user?.phone_number}
                    ownerEmail={item.user?.email}
                    info={item.description}
                    title={item.title}
                />
            ))}
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                loop={true}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 1
                }}
                pagination={true}
                modules={[EffectCoverflow, Pagination]}
                className="mySwiper"
            >
                {slides.map((item) => (
                    <SwiperSlide key={item.id}>
                        <Card
                            announcementID={item.id}
                            imgURL={item.images?.[0] || '../../img/placeholder-image.jpg'}
                            price={item.price}
                            size={item.size}
                            address={item.location}
                            imgOwner={item.user?.photo_profile || '../../img/placeholder-profile.jpg'}
                            owner={item.user?.name || 'Usuario'}
                            ownerPhoneNumber={item.user?.phone_number}
                            ownerEmail={item.user?.email}
                            info={item.description}
                            title={item.title}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>

        // <div className="container">
        //     <h1 className="heading">Flower Gallery</h1>
        //     <Swiper
        //         effect={'coverflow'}
        //         grabCursor={true}
        //         centeredSlides={true}
        //         loop={true}
        //         slidesPerView={'auto'}
        //     // coverflowEffect={{
        //     //     rotate: 0,
        //     //     stretch: 0,
        //     //     depth: 100,
        //     //     modifier: 2.5,
        //     // }}
        //     // pagination={{ el: '.swiper-pagination', clickable: true }}
        //     // navigation={{
        //     //     nextEl: '.swiper-button-next',
        //     //     prevEl: '.swiper-button-prev',
        //     //     clickable: true,
        //     // }}
        //     // modules={[EffectCoverflow, Pagination, Navigation]}
        //     // className="swiper_container"
        //     >
        //         {slides && slides.map((item) => (
        //             <SwiperSlide>
        //                 <Card
        //                     key={item.id}
        //                     announcementID={item.id}
        //                     imgURL={item.images?.[0] || '../../img/placeholder-image.jpg'}
        //                     price={item.price}
        //                     size={item.size}
        //                     address={item.location}
        //                     imgOwner={item.user?.photo_profile || '../../img/placeholder-profile.jpg'}
        //                     owner={item.user?.name || 'Usuario'}
        //                     ownerPhoneNumber={item.user?.phone_number}
        //                     ownerEmail={item.user?.email}
        //                     info={item.description}
        //                     title={item.title}
        //                 />
        //             </SwiperSlide>
        //         ))}
        //         {/* <SwiperSlide>
        //             <img src={slide_image_1} alt="slide_image" />
        //         </SwiperSlide>
        //         <SwiperSlide>
        //             <img src={slide_image_2} alt="slide_image" />
        //         </SwiperSlide>
        //         <SwiperSlide>
        //             <img src={slide_image_3} alt="slide_image" />
        //         </SwiperSlide> */}
        //         <div className="slider-controler">
        //             <div className="swiper-button-prev slider-arrow">
        //                 <ion-icon name="arrow-back-outline"></ion-icon>
        //             </div>
        //             <div className="swiper-button-next slider-arrow">
        //                 <ion-icon name="arrow-forward-outline"></ion-icon>
        //             </div>
        //             <div className="swiper-pagination"></div>
        //         </div>
        //     </Swiper>
        // </div>
    );
}

export default Slider;