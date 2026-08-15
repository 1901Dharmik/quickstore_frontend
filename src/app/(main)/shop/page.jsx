import { Suspense } from 'react';
import ShopPage from '@/components/shop/shop-page';
import Loading from './loading';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ShopPage />
    </Suspense>
  );
}
