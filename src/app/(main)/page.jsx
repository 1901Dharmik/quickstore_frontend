import { HeroSection } from '@/components/home/HeroSection';
import { BrandSection } from '@/components/home/BrandSection';
import { CategorySection } from '@/components/home/CategorySection';
import { BestsellerSection } from '@/components/home/BestsellerSection';
import { NewArrivalSection } from '@/components/home/NewArrivalSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { InfiniteProductScroll } from '@/components/home/InfiniteProductScroll';
import { PromotionalSection } from '@/components/home/PromotionalSection';
import { WatchTabbedSection } from '@/components/home/WatchTabbedSection';
import { MoreRecommendationsSection } from '@/components/home/MoreRecommendationsSection';
import { TrustBadgesSection } from '@/components/home/TrustBadgesSection';

export const metadata = {
  title: "QuickStore — The Art of Horology",
  description: "A curated selection of modern smart timepieces, where advanced technology meets contemporary design.",
  openGraph: {
    title: "QuickStore — The Art of Horology",
    description: "A curated selection of modern smart timepieces, where advanced technology meets contemporary design.",
    url: 'https://quickstore.com',
    siteName: 'QuickStore',
    images: [
      {
        url: 'https://quickstore.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickStore — The Art of Horology',
    description: 'A curated selection of modern smart timepieces, where advanced technology meets contemporary design.',
  },
};

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <HeroSection />
      <BrandSection />
      
      {/* Xiaomi Style Sections */}
      {/* <WatchTabbedSection />
      <MoreRecommendationsSection /> */}
      
      {/* Original Sections */}
      <CategorySection />
      <BestsellerSection />
      <NewArrivalSection />
      <PromotionalSection />
      <FeaturedSection />
      <InfiniteProductScroll />
      
      {/* Footer pre-cursor */}
      <TrustBadgesSection />
    </main>
  );
};

export default Page;