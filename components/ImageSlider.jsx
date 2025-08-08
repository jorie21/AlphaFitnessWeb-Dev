"use client";

import { useState, useEffect } from "react";


const images = [
  "/gym-pixel.jpeg",
  "/muaythai-pixel.jpeg",
  "/sauna-pixel.jpeg",
];



export default function ImageSlider({className}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div
      className={`relative w-full h-[300px] md:h-[500px]  lg:h-screen overflow-hidden ${className}`}
    >
      {/* Image */}
      <div
        className={`w-full h-full bg-center bg-cover opacity-20 transition-all duration-700
          ${"mask-mobile-fade"}`}
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
        }}
      ></div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full cursor-pointer transition-colors ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}