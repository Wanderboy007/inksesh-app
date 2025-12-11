export default function ArtistLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="relative w-full h-60 sm:h-72 md:h-80 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-neutral-900 to-neutral-950" />
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-28 md:-mt-32 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-12 md:mb-16 pb-6 md:pb-8 pt-6 md:pt-8 border-b border-neutral-800">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 shrink-0 rounded-full overflow-hidden bg-neutral-900 animate-pulse" />

          <div className="flex-1 w-full max-w-lg md:max-w-none">
            <div className="h-8 sm:h-9 md:h-10 w-48 sm:w-64 md:w-80 bg-neutral-900 rounded-lg animate-pulse mb-3" />
            <div className="h-5 w-40 bg-neutral-900 rounded-md animate-pulse" />
            <div className="flex gap-2 mt-4">
              <div className="h-7 w-24 bg-neutral-900 rounded-full animate-pulse" />
              <div className="h-7 w-20 bg-neutral-900 rounded-full animate-pulse" />
            </div>
          </div>

          <div className="shrink-0">
            <div className="h-10 w-40 bg-neutral-900 rounded-full animate-pulse" />
          </div>
        </div>

        <div>
          <div className="h-7 w-32 bg-neutral-900 rounded-md animate-pulse mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="relative aspect-4/5 bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800"
              >
                <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
