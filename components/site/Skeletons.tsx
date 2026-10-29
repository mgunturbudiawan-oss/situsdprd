import { cn } from "@/lib/utils";

export function Sk({ className, dark }: { className?: string; dark?: boolean }) {
  return <div className={cn("rounded-lg", dark ? "skeleton-light" : "skeleton", className)} aria-hidden />;
}

function Loading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div role="status" aria-label="Memuat halaman" className={className}>
      <span className="sr-only">Memuat...</span>
      {children}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <section className="skeleton-dark pb-10 pt-36 md:pb-20 md:pt-48">
      <div className="container">
        <Sk dark className="h-4 w-48" />
        <Sk dark className="mt-5 h-10 w-3/4 max-w-2xl md:h-12" />
        <Sk dark className="mt-4 h-5 w-1/2 max-w-xl" />
        <div className="mt-6 h-1 w-20 rounded-full bg-accent-500/60" />
      </div>
    </section>
  );
}

export function CardSkeleton({ aspect = "aspect-[16/10]", lines = 3 }: { aspect?: string; lines?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className={cn("skeleton", aspect)} />
      <div className="space-y-3 p-5">
        <Sk className="h-3 w-24" />
        {Array.from({ length: lines }, (_, i) => (
          <Sk key={i} className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")} />
        ))}
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6, cols = "md:grid-cols-2 lg:grid-cols-3", aspect, lines }: { count?: number; cols?: string; aspect?: string; lines?: number }) {
  return (
    <div className={cn("grid gap-6", cols)}>
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} aspect={aspect} lines={lines} />
      ))}
    </div>
  );
}

export function RowsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex gap-4 rounded-2xl border border-slate-200 p-5">
          <Sk className="h-14 w-14 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2.5">
            <Sk className="h-3 w-32" />
            <Sk className="h-4 w-full" />
            <Sk className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="space-y-4">
      <Sk className="h-4 w-56" />
      <div className="skeleton aspect-video w-full rounded-2xl" />
      {Array.from({ length: 8 }, (_, i) => (
        <Sk key={i} className={cn("h-4", i % 4 === 3 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

/* ---------- Kerangka per halaman ---------- */

export function HomeSkeleton() {
  return (
    <Loading>
      <section className="skeleton-dark relative h-[70svh] max-h-[640px] min-h-[540px] sm:h-[80svh] sm:max-h-none md:h-[100svh] md:min-h-[620px]">
        <div className="container flex h-full flex-col items-center justify-center pb-14 pt-[13.5rem] sm:pt-40 md:pb-24 md:pt-28">
          <div className="flex w-full max-w-2xl flex-col items-center gap-4">
            <Sk dark className="h-6 w-64 rounded-full" />
            <Sk dark className="h-8 w-72 md:h-10" />
            <Sk dark className="h-14 w-full rounded-2xl md:h-16" />
            <div className="flex gap-2">
              <Sk dark className="h-8 w-24 rounded-full" />
              <Sk dark className="h-8 w-24 rounded-full" />
              <Sk dark className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </section>
      <div className="container grid gap-8 py-10 md:py-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Sk className="mb-3 h-6 w-48" />
          <Sk className="mb-8 h-1 w-24" />
          <div className="grid gap-4 md:grid-cols-2 lg:h-[440px]">
            <div className="skeleton-dark min-h-[280px] rounded-2xl md:min-h-[360px] lg:min-h-0" />
            <div className="space-y-3 overflow-hidden rounded-2xl border border-slate-200 p-3">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex gap-3">
                  <Sk className="h-14 w-16 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Sk className="h-3 w-16" />
                    <Sk className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <Sk className="mb-3 h-6 w-40" />
          <Sk className="mb-8 h-1 w-24" />
          <div className="overflow-hidden rounded-2xl border border-slate-200 lg:h-[440px]">
            <div className="skeleton-dark h-10" />
            <div className="space-y-4 p-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex gap-3">
                  <Sk className="h-14 w-16 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Sk className="h-3 w-16" />
                    <Sk className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
}

export function ListPageSkeleton({ variant = "cards" }: { variant?: "cards" | "people" | "rows" | "gallery" }) {
  return (
    <Loading>
      <PageHeaderSkeleton />
      <div className="container py-12">
        <div className="mb-10 flex flex-wrap gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Sk key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
        {variant === "cards" && <GridSkeleton />}
        {variant === "people" && <GridSkeleton count={10} cols="grid-cols-2 md:grid-cols-3 lg:grid-cols-5" aspect="aspect-[3/4]" lines={2} />}
        {variant === "rows" && <RowsSkeleton />}
        {variant === "gallery" && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="skeleton aspect-[4/3] rounded-2xl" />
            ))}
          </div>
        )}
      </div>
    </Loading>
  );
}

export function DetailPageSkeleton({ portrait }: { portrait?: boolean }) {
  return (
    <Loading>
      <PageHeaderSkeleton />
      <div className="container grid gap-12 py-12 lg:grid-cols-12">
        {portrait && (
          <div className="lg:col-span-4">
            <div className="skeleton aspect-[3/4] w-full rounded-3xl" />
          </div>
        )}
        <div className={portrait ? "lg:col-span-8" : "lg:col-span-8"}>
          {portrait ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <Sk key={i} className="h-20 rounded-2xl" />
                ))}
              </div>
              {Array.from({ length: 5 }, (_, i) => (
                <Sk key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : (
            <ArticleSkeleton />
          )}
        </div>
        {!portrait && (
          <div className="space-y-5 lg:col-span-4">
            <Sk className="h-5 w-40" />
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex gap-4">
                <Sk className="h-24 w-24 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Sk className="h-3 w-16" />
                  <Sk className="h-4 w-full" />
                  <Sk className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Loading>
  );
}

export function AgendaSkeleton() {
  return (
    <Loading>
      <PageHeaderSkeleton />
      <div className="container grid gap-10 py-12 lg:grid-cols-12">
        <div className="overflow-hidden rounded-2xl border border-slate-200 lg:col-span-7">
          <div className="skeleton-dark h-16" />
          <div className="grid grid-cols-7">
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="h-24 border-b border-r p-2">
                <Sk className="h-6 w-6 rounded-full" />
                {i % 5 === 2 && <Sk className="mt-2 h-3 w-full" />}
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <RowsSkeleton count={4} />
        </div>
      </div>
    </Loading>
  );
}

export function TvSkeleton() {
  return (
    <Loading className="bg-primary-950 pb-16 pt-36 md:pt-40">
      <div className="container">
        <div className="mb-6 flex items-center gap-3">
          <Sk dark className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Sk dark className="h-6 w-64" />
            <Sk dark className="h-3 w-48" />
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Sk dark className="aspect-video w-full rounded-2xl" />
            <Sk dark className="mt-5 h-7 w-2/3" />
          </div>
          <Sk dark className="h-80 rounded-2xl" />
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-3">
              <Sk dark className="aspect-video w-full rounded-xl" />
              <Sk dark className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </Loading>
  );
}

export function FormPageSkeleton() {
  return (
    <Loading>
      <PageHeaderSkeleton />
      <div className="container grid gap-12 py-16 lg:grid-cols-12">
        <div className="space-y-5 rounded-2xl border border-slate-200 p-8 lg:col-span-8">
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="space-y-2">
                <Sk className="h-3 w-24" />
                <Sk className="h-11 w-full" />
              </div>
            ))}
          </div>
          <Sk className="h-40 w-full" />
          <Sk className="h-12 w-full" />
        </div>
        <div className="space-y-6 lg:col-span-4">
          <Sk className="h-44 rounded-2xl" />
          <Sk className="h-28 rounded-2xl" />
        </div>
      </div>
    </Loading>
  );
}

export function AdminSkeleton() {
  return (
    <Loading>
      <Sk className="mb-2 h-7 w-56" />
      <Sk className="mb-8 h-4 w-32" />
      <div className="card overflow-hidden">
        <div className="border-b p-4">
          <Sk className="h-10 w-72" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <Sk className="h-12 w-16 shrink-0 rounded-md" />
              <Sk className="h-4 flex-1" />
              <Sk className="hidden h-4 w-28 md:block" />
              <Sk className="hidden h-4 w-24 md:block" />
              <Sk className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    </Loading>
  );
}
