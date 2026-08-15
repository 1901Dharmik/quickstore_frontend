import { HeroSection } from '@/components/home/HeroSection';
import { BrandSection } from '@/components/home/BrandSection';
import { CategorySection } from '@/components/home/CategorySection';
import { BestsellerSection } from '@/components/home/BestsellerSection';
import { NewArrivalSection } from '@/components/home/NewArrivalSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { InfiniteProductScroll } from '@/components/home/InfiniteProductScroll';

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <HeroSection />
      <BrandSection />
      <CategorySection />
      <BestsellerSection />
      <NewArrivalSection />
      <FeaturedSection />
      <InfiniteProductScroll />
    </main>
  );
};

export default Page;