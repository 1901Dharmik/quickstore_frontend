import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-10">
        <div className="space-y-3 border-b border-border pb-8">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-12 w-2/3 max-w-xl" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-border">
                <Skeleton className="aspect-square w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
