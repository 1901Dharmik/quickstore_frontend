"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'Smart Band 8 Pro',
    subtitle: 'Fitness meets fashion.',
    imageDesktop: 'https://i03.appmifile.com/746_operator_in/31/10/2025/142dc46d9468f897fb5e35ec682d5a41.jpg?thumb=1&w=5120&f=webp&q=85',
    imageMobile: 'https://i03.appmifile.com/746_operator_in/31/10/2025/142dc46d9468f897fb5e35ec682d5a41.jpg?thumb=1&w=5120&f=webp&q=85',
    link: '/shop',
    align: 'left',
    color: 'text-white', // Text color based on background darkness
    overlay: 'bg-black/40',
  },
  {
    id: 2,
    title: 'Watch S3 Series',
    subtitle: 'Interchangeable bezels. A new twist on time.',
    imageDesktop: 'https://i03.appmifile.com/228_operator_in/31/10/2025/6d6bfd8ba026c2b2c5bf59c52a145220.jpg?thumb=1&w=5120&f=webp&q=85',
    imageMobile: 'https://i03.appmifile.com/228_operator_in/31/10/2025/6d6bfd8ba026c2b2c5bf59c52a145220.jpg?thumb=1&w=5120&f=webp&q=85',
    link: '/shop',
    align: 'left',
    color: 'text-white',
    overlay: 'bg-black/30',
  },
  {
    id: 3,
    title: 'Active Life 2',
    subtitle: 'Unleash your potential with 150+ sports modes.',
    imageDesktop: 'https://i03.appmifile.com/746_operator_in/31/10/2025/142dc46d9468f897fb5e35ec682d5a41.jpg?thumb=1&w=5120&f=webp&q=85',
    imageMobile: 'https://i03.appmifile.com/746_operator_in/31/10/2025/142dc46d9468f897fb5e35ec682d5a41.jpg?thumb=1&w=5120&f=webp&q=85',
    link: '/shop',
    align: 'center', // Just to show variety like Mi sometimes does
    color: 'text-black',
    overlay: 'bg-white/20',
  },
];

export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  return (
    <section 
      className="relative w-full h-[520px] md:h-[476px] overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden h-full w-full" ref={emblaRef}>
        <div className="flex h-full w-full touch-pan-y">
          {SLIDES.map((slide, index) => (
            <div key={slide.id} className="relative flex-[0_0_100%] h-full w-full min-w-0">
              
              {/* Desktop Image */}
              <div className="hidden md:block absolute inset-0">
                <Image
                  src={slide.imageDesktop}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </div>
              
              {/* Mobile Image */}
              <div className="md:hidden absolute inset-0">
                <Image
                  src={slide.imageMobile}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </div>

              {/* Overlay for legibility if needed */}
              <div className={`absolute inset-0 ${slide.overlay}`} />

              {/* Content Wrapper */}
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className={`w-full max-w-[1226px] px-6 md:px-8 h-full flex flex-col justify-start md:justify-center ${
                  slide.align === 'center' ? 'items-center text-center' : 'items-center md:items-start text-center md:text-left'
                } pt-[60px] md:pt-0`}>
                  
                  <h2 className={`font-sans font-bold text-[28px] md:text-[36px] tracking-tight mb-2 md:mb-3 ${slide.color}`}>
                    {slide.title}
                  </h2>
                  
                  <p className={`font-sans text-[16px] md:text-[18px] mb-6 md:mb-8 max-w-lg ${slide.color} opacity-90`}>
                    {slide.subtitle}
                  </p>
                  
                  <Link 
                    href={slide.link}
                    className="inline-flex h-[36px] md:h-[40px] items-center justify-center rounded-xl bg-[#262626] hover:bg-[#404040] text-white px-6 md:px-8 font-sans text-[14px] transition-colors"
                  >
                    Learn more
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Side Navigation Arrows (Desktop Only) */}
      <div 
        className={`hidden md:flex absolute inset-y-0 left-0 w-24 items-center justify-start pl-4 z-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <button 
          onClick={scrollPrev}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white transition-all backdrop-blur-sm"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      </div>

      <div 
        className={`hidden md:flex absolute inset-y-0 right-0 w-24 items-center justify-end pr-4 z-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <button 
          onClick={scrollNext}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white transition-all backdrop-blur-sm"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      {/* Custom Bottom Progress Indicators */}
      <div className="absolute bottom-4 md:bottom-6 left-0 right-0 z-20 flex justify-center gap-1.5 md:gap-2 px-4">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className="group relative h-1 w-10 md:w-16 overflow-hidden rounded-full bg-white/30 backdrop-blur-sm cursor-pointer transition-all"
            aria-label={`Go to slide ${index + 1}`}
          >
            {/* Base Hover State */}
            <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            
            {/* Active Progress Bar */}
            {index === selectedIndex && (
              <div 
                className="absolute inset-y-0 left-0 bg-white animate-[progress_5s_linear_forwards]"
                style={{ 
                  animationPlayState: isHovered ? 'paused' : 'running'
                }}
              />
            )}
            
            {/* Completed Progress Bars (so they stay white if you swipe fast, optional, but Xiaomi only animates active) */}
            {/* For exact Xiaomi style, inactive bars are just gray, active fills up. */}
          </button>
        ))}
      </div>

      {/* Add custom keyframes for the progress animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}} />
    </section>
  );
}
