'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  {
    title: "Men's Collection",
    subtitle: 'Bold & Engineered',
    slug: 'man',
    image: '/assets/images/man_category.jpg',
    color: 'from-blue-600/80 to-cyan-600/80',
    border: 'group-hover:border-blue-400',
  },
  {
    title: "Women's Collection",
    subtitle: 'Elegance Meets Tech',
    slug: 'woman',
    image: '/assets/images/woman_category.jpg',
    color: 'from-pink-600/80 to-purple-600/80',
    border: 'group-hover:border-pink-400',
  },
  {
    title: 'Couple Matching',
    slug: 'couple',
    subtitle: 'Perfect Together',
    image: '/assets/images/couple_category.jpg',
    color: 'from-purple-600/80 to-indigo-600/80',
    border: 'group-hover:border-purple-400',
  },
  {
    title: 'Kids Smartwatches',
    subtitle: 'Fun & Safe',
    slug: 'kids',
    image: '/assets/images/kids_category.jpg',
    color: 'from-orange-600/80 to-amber-600/80',
    border: 'group-hover:border-orange-400',
  }
];

export const GenderCategorySection = () => {
  return (
    <section className="relative w-full bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Curated For You
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 max-w-2xl text-base text-muted-foreground"
          >
            Discover smartwatches perfectly tailored to your lifestyle and aesthetic.
          </motion.p>
        </div>

        {/* Premium Square Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              className="w-full"
            >
              <Link 
                href={`/shop?gender=${category.slug}`} 
                className="group relative flex flex-col aspect-square w-full overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-900 border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Background Image - Aspect Square means no cropping! */}
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain object-center opacity-90 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-100"
                />
                
                {/* Subtle Gradient for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 lg:p-8">
                  <div className="translate-y-4 transform transition-transform duration-500 ease-out group-hover:translate-y-0">
                    <p className="text-[10px] md:text-xs font-semibold tracking-widest text-white/80 uppercase mb-1 md:mb-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      {category.subtitle}
                    </p>
                    <h3 className="font-sans text-lg md:text-2xl font-bold text-white">
                      {category.title}
                    </h3>
                  </div>
                  
                  {/* Floating Action Button */}
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 flex h-8 w-8 md:h-10 md:w-10 shrink-0 transform items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:bg-white group-hover:text-black shadow-lg">
                    <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
